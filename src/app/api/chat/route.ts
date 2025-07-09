import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to get candidate context from Supabase
async function getCandidateContext() {
  try {
    // Get all candidate data from Supabase
    const [personalResponse, educationResponse, experienceResponse, strengthsResponse, storiesResponse] = await Promise.all([
      supabase.from('personal_info').select('*').single(),
      supabase.from('education').select('*'),
      supabase.from('experience').select('*'),
      supabase.from('strengths').select('*'),
      supabase.from('key_stories').select('*')
    ]);

    const personal = personalResponse.data;
    const education = educationResponse.data || [];
    const experience = experienceResponse.data || [];
    const strengths = strengthsResponse.data || [];
    const stories = storiesResponse.data || [];

    // Format the context for OpenAI
    let context = `You are an AI assistant helping interviewers learn about Robert Mill. Here's comprehensive information about him:

PERSONAL INFORMATION:
- Name: ${personal?.name}
- Current Role: ${personal?.role} at ${personal?.company}
- Location: ${personal?.location}
- Email: ${personal?.email}
- LinkedIn: ${personal?.linkedin}

EDUCATION:`;

    education.forEach((edu: any) => {
      context += `
- ${edu.degree} from ${edu.institution} (${edu.graduation_year})
  Achievements: ${edu.achievements?.join(', ')}
  Relevant Coursework: ${edu.relevant_coursework?.join(', ')}
  Why Chosen: ${edu.why_chosen}`;
    });

    context += `

WORK EXPERIENCE:`;

    experience.forEach((exp: any) => {
      context += `
- ${exp.position} at ${exp.company} (${exp.start_date} - ${exp.end_date})
  Location: ${exp.location}
  How Found Job: ${exp.how_found_job}
  What Hired To Do: ${exp.what_hired_to_do}
  Manager's Description: ${exp.manager_description}
  Biggest Win: ${exp.biggest_win}
  Toughest Challenge: ${exp.toughest_challenge}
  Why Made Move: ${exp.why_made_move}
  What Learned: ${exp.what_learned}
  Key Accomplishments: ${exp.accomplishments?.join(', ')}
  Skills: ${exp.skills?.join(', ')}
  Technologies: ${exp.technologies?.join(', ')}`;
    });

    context += `

CORE STRENGTHS:`;
    strengths.forEach((strength: any) => {
      context += `
- ${strength.strength}`;
    });

    context += `

KEY STORIES:`;
    stories.forEach((story: any) => {
      context += `
- ${story.title}
  Situation: ${story.situation}
  Task: ${story.task}
  Action: ${story.action}
  Result: ${story.result}
  Learned: ${story.learned}
  Tags: ${story.tags?.join(', ')}`;
    });

    context += `

Please answer questions about Robert in a helpful, informative way. Be specific and use examples from his experience. If asked about specific roles, accomplishments, or skills, reference the detailed information above.`;

    return context;
  } catch (error) {
    console.error('Error getting candidate context:', error);
    return 'I have basic information about Robert Mill, but I\'m having trouble accessing his detailed profile right now.';
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, messages = [] } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Get candidate context
    const candidateContext = await getCandidateContext();

    // Prepare messages for OpenAI
    const systemMessage = {
      role: 'system' as const,
      content: candidateContext
    };

    const allMessages = [
      systemMessage,
      ...messages,
      { role: 'user' as const, content: message }
    ];

    // Create streaming response
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}