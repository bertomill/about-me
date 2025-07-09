import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define proper types for database entities to avoid any types
// These interfaces match the structure of data from our Supabase database
interface DatabaseEducation {
  degree: string;
  institution: string;
  graduation_year: string;
  achievements?: string[];
  relevant_coursework?: string[];
  why_chosen: string;
}

interface DatabaseExperience {
  position: string;
  company: string;
  start_date: string;
  end_date: string;
  location: string;
  how_found_job: string;
  what_hired_to_do: string;
  manager_description: string;
  biggest_win: string;
  toughest_challenge: string;
  why_made_move: string;
  what_learned: string;
  accomplishments?: string[];
  skills?: string[];
  technologies?: string[];
}

interface DatabaseStrength {
  strength: string;
}

interface DatabaseStory {
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  learned: string;
  tags?: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Function to get candidate context from JSON file
async function getCandidateContext() {
  try {
    // Import candidate data from JSON file
    const candidateData = await import('@/data/candidate-info.json');
    
    const personal = candidateData.personal;
    const education = candidateData.education || [];
    const experience = candidateData.experience || [];
    const strengths = candidateData.strengths || [];
    const stories = candidateData.keyStories || [];

    // Format the context for AI models (optimized for better performance)
    let context = `You are an AI assistant helping interviewers learn about Robert Mill. Here's key information about him:

PERSONAL INFO:
- Name: ${personal?.name}
- Role: ${personal?.currentRole} at ${personal?.currentCompany}
- Location: ${personal?.location}
- Links: LinkedIn, YouTube, Newsletter, Twitter

EDUCATION:`;

    education.forEach((edu: any) => {
      context += `
- ${edu.degree} from ${edu.institution} (${edu.graduationYear})
  Key achievements: ${edu.achievements?.slice(0, 2).join(', ')}`;
    });

    context += `

WORK EXPERIENCE:`;

    experience.forEach((exp: any) => {
      context += `
- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})
  Biggest Win: ${exp.magicQuestions?.biggestWin}
  Key Skills: ${exp.skills?.slice(0, 3).join(', ')}
  Technologies: ${exp.technologies?.slice(0, 3).join(', ')}`;
    });

    context += `

CORE STRENGTHS:`;
    strengths.forEach((strength: any) => {
      if (typeof strength === 'string') {
        context += `
- ${strength}`;
      } else {
        context += `
- ${strength.title}: ${strength.summary}
  Details: ${strength.details}
  Key Metrics: ${strength.metrics?.join(', ')}
  Technologies: ${strength.technologies?.join(', ')}
  Impact: ${strength.impact}`;
      }
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
    const { message, messages = [], model = 'gpt-4' } = await req.json();

    // Get candidate context
    const candidateContext = await getCandidateContext();

    // Create streaming response based on selected model
    if (model === 'claude') {
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
          { error: 'Anthropic API key is not configured' },
          { status: 500 }
        );
      }

      let response;
      try {
        response = await anthropic.messages.create({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1000,
          temperature: 0.7,
          system: candidateContext,
          messages: [
            ...messages,
            { role: 'user', content: message }
          ],
          stream: true,
        });
      } catch (error: any) {
        // Handle Claude API errors before streaming
        if (error.error?.type === 'overloaded_error') {
          const errorMessage = "Claude is currently experiencing high demand. Please try again in a moment or switch to GPT-4 or Gemini.";
          const encoder = new TextEncoder();
          const errorStream = new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: errorMessage })}\n\n`));
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            },
          });
          
          return new Response(errorStream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          });
        }
        
        // Re-throw other errors
        throw error;
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                const content = chunk.delta.text;
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error: any) {
            console.error('Claude streaming error:', error);
            
            // Handle specific Claude errors
            if (error.error?.type === 'overloaded_error') {
              const errorMessage = "Claude is currently experiencing high demand. Please try again in a moment or switch to GPT-4 or Gemini.";
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: errorMessage })}\n\n`));
            } else {
              const errorMessage = "Sorry, I encountered an error with Claude. Please try again or switch to a different model.";
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: errorMessage })}\n\n`));
            }
            
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
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

    } else if (model === 'gemini') {
      if (!process.env.GOOGLE_API_KEY) {
        return NextResponse.json(
          { error: 'Google API key is not configured' },
          { status: 500 }
        );
      }

      const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      // Format conversation for Gemini
      const conversationHistory = messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const chat = geminiModel.startChat({
        history: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const fullPrompt = `${candidateContext}\n\nUser: ${message}`;
      
      try {
        const result = await chat.sendMessageStream(fullPrompt);

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of result.stream) {
                const content = chunk.text();
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              }
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            } catch (error: any) {
              console.error('Gemini streaming error:', error);
              
              // Handle specific Gemini errors
              if (error.status === 429) {
                const errorMessage = "Gemini has exceeded its rate limit. Please try again later or switch to GPT-4 or Claude.";
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: errorMessage })}\n\n`));
              } else {
                const errorMessage = "Sorry, I encountered an error with Gemini. Please try again or switch to a different model.";
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: errorMessage })}\n\n`));
              }
              
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
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
        
      } catch (error: any) {
        // Handle Gemini API errors before streaming
        if (error.status === 429) {
          const errorMessage = "Gemini has exceeded its rate limit. Please try again later or switch to GPT-4 or Claude.";
          const encoder = new TextEncoder();
          const errorStream = new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: errorMessage })}\n\n`));
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            },
          });
          
          return new Response(errorStream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          });
        }
        
        // Re-throw other errors
        throw error;
      }

    } else {
      // Default to GPT-4
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: 'OpenAI API key is not configured' },
          { status: 500 }
        );
      }

      const systemMessage = {
        role: 'system' as const,
        content: candidateContext
      };

      const allMessages = [
        systemMessage,
        ...messages,
        { role: 'user' as const, content: message }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      });

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
            console.error('OpenAI streaming error:', error);
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
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}