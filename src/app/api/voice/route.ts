import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Import the proper types for JSON data structure
interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  magicQuestions?: {
    biggestWin?: string;
    toughestChallenge?: string;
  };
}

interface Value {
  title: string;
  shortDescription: string;
  description: string;
}

interface SituationScenario {
  title: string;
  commonQuestion: string;
  situation: string;
  result: string;
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

// Function to get candidate context (OPTIMIZED - Now uses JSON file for consistency with chat route)
async function getCandidateContext() {
  try {
    // Check if we have a valid cached context to avoid repeated processing
    const now = Date.now();
    if (candidateContextCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Using cached candidate context - much faster!');
      return candidateContextCache;
    }

    console.log('Building fresh candidate context from JSON file...');
    
    // Import candidate data from JSON file (same as chat route for consistency)
    const candidateData = await import('@/data/candidate-info.json');
    
    const personal = candidateData.personal;
    const experience = candidateData.experience || [];
    const values = candidateData.values || [];
    const situationScenarios = candidateData.situationScenarios || [];

    // OPTIMIZED VOICE CONTEXT - Concise but conversational for voice interaction
    let context = `You are Robert Mill's AI voice assistant for interview preparation. Speak naturally and conversationally. Key information:

PERSONAL: ${personal?.name}, ${personal?.currentRole} at ${personal?.currentCompany}, based in ${personal?.location}

RECENT EXPERIENCE:`;

    // Limit to top 2 experiences for voice efficiency
    experience.slice(0, 2).forEach((exp: Experience) => {
      context += `
• ${exp.position} at ${exp.company}
  Key Win: ${exp.magicQuestions?.biggestWin?.slice(0, 120)}...
  Challenge: ${exp.magicQuestions?.toughestChallenge?.slice(0, 120)}...`;
    });

    context += `

CORE VALUES:`;
    values.forEach((value: Value) => {
      context += `
• ${value.title}: ${value.shortDescription}`;
    });

    context += `

BEHAVIORAL SCENARIOS for interview questions:`;
    situationScenarios.forEach((scenario: SituationScenario) => {
      context += `
• ${scenario.title} - ${scenario.commonQuestion}
  Quick Summary: ${scenario.situation.slice(0, 100)}... Result: ${scenario.result.slice(0, 100)}...`;
    });

    context += `

VOICE INSTRUCTIONS: Keep responses conversational, concise (2-3 sentences max), and specific. Use Robert's actual experiences. For behavioral questions, reference the scenarios above with specific details.`;

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