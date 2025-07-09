import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

// Import the proper types to fix linter errors
// These types help TypeScript understand what data we're working with
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

// Cache for storing Robert's context to avoid repeated database calls
// This significantly speeds up the voice assistant loading time by eliminating
// the slow database queries that were causing the loading bar to get stuck at 25%
// Cache duration is set to 5 minutes to balance performance with data freshness
let candidateContextCache: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes (in milliseconds)

// Function to get candidate context (reused from chat route)
async function getCandidateContext() {
  try {
    // Check if we have a valid cached context to avoid slow database queries
    const now = Date.now();
    if (candidateContextCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Using cached candidate context - much faster!');
      return candidateContextCache;
    }

    console.log('Fetching fresh candidate context from database...');
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

    let context = `You are an AI assistant helping interviewers learn about Robert Mill through voice conversation. Speak naturally and conversationally. Here's comprehensive information about him:

PERSONAL INFORMATION:
- Name: ${personal?.name}
- Current Role: ${personal?.role} at ${personal?.company}
- Location: ${personal?.location}
- Email: ${personal?.email}
- LinkedIn: ${personal?.linkedin}

EDUCATION:`;

    education.forEach((edu: DatabaseEducation) => {
      context += `
- ${edu.degree} from ${edu.institution} (${edu.graduation_year})
  Achievements: ${edu.achievements?.join(', ')}
  Relevant Coursework: ${edu.relevant_coursework?.join(', ')}
  Why Chosen: ${edu.why_chosen}`;
    });

    context += `

WORK EXPERIENCE:`;

    experience.forEach((exp: DatabaseExperience) => {
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
    strengths.forEach((strength: DatabaseStrength) => {
      context += `
- ${strength.strength}`;
    });

    context += `

KEY STORIES:`;
    stories.forEach((story: DatabaseStory) => {
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

Please answer questions about Robert in a helpful, conversational way suitable for voice interaction. Be specific and use examples from his experience. Keep responses concise but informative since this is a voice conversation.`;

    // Store the context in cache with timestamp to speed up future requests
    candidateContextCache = context;
    cacheTimestamp = now;
    console.log('Candidate context cached successfully');

    return context;
  } catch (error) {
    console.error('Error getting candidate context:', error);
    return 'I have basic information about Robert Mill, but I\'m having trouble accessing his detailed profile right now.';
  }
}

export async function POST(req: NextRequest) {
  try {
    const { audio, transcript } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    let transcriptionText = transcript;

    // If audio is provided, transcribe it
    if (audio && !transcript) {
      try {
        // Convert base64 audio to buffer
        const audioBuffer = Buffer.from(audio, 'base64');
        
        // Create a temporary file for OpenAI Whisper
        const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });
        
        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: 'whisper-1',
        });
        
        transcriptionText = transcription.text;
      } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
          { error: 'Failed to transcribe audio' },
          { status: 500 }
        );
      }
    }

    if (!transcriptionText) {
      return NextResponse.json(
        { error: 'No text to process' },
        { status: 400 }
      );
    }

    // Get candidate context
    const candidateContext = await getCandidateContext();

    // Generate response using GPT
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: candidateContext
        },
        {
          role: 'user',
          content: transcriptionText
        }
      ],
      temperature: 0.7,
      max_tokens: 300, // Keep responses concise for voice
    });

    const responseText = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';

    // Generate speech from the response
    try {
      const speechResponse = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: responseText,
        response_format: 'mp3',
      });

      const audioBuffer = Buffer.from(await speechResponse.arrayBuffer());
      const audioBase64 = audioBuffer.toString('base64');

      return NextResponse.json({
        transcript: transcriptionText,
        response: responseText,
        audio: audioBase64,
      });
    } catch (error) {
      console.error('Text-to-speech error:', error);
      // Return text response even if TTS fails
      return NextResponse.json({
        transcript: transcriptionText,
        response: responseText,
        audio: null,
      });
    }

  } catch (error) {
    console.error('Voice API error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice request' },
      { status: 500 }
    );
  }
}

// GET endpoint to quickly retrieve cached candidate context for voice interface setup
// This avoids slow database queries during voice assistant initialization
export async function GET() {
  try {
    const candidateContext = await getCandidateContext();
    
    return NextResponse.json({
      context: candidateContext,
      cached: candidateContextCache !== null,
      cacheAge: candidateContextCache ? Date.now() - cacheTimestamp : 0
    });
  } catch (error) {
    console.error('Error getting candidate context for voice setup:', error);
    return NextResponse.json(
      { error: 'Failed to get candidate context' },
      { status: 500 }
    );
  }
}