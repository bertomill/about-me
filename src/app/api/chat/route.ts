import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define proper types for candidate data structure
interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
  achievements?: string[];
  relevantCoursework?: string[];
  whyChosen: string;
}

interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  magicQuestions?: {
    howFoundJob?: string;
    whatHiredToDo?: string;
    managerDescription?: string;
    biggestWin?: string;
    toughestChallenge?: string;
  };
  careerMove?: {
    whyMadeMove?: string;
    whatLearned?: string;
  };
  accomplishments?: string[];
  skills?: string[];
  technologies?: string[];
}

interface Strength {
  title: string;
  summary: string;
  details: string;
  metrics?: string[];
  technologies?: string[];
  impact: string;
}

interface Story {
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  learned: string;
  tags?: string[];
}

// Type for message objects
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Type for API errors
interface APIError {
  error?: {
    type?: string;
  };
  status?: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Function to get candidate context from JSON file (OPTIMIZED for performance and token efficiency)
async function getCandidateContext() {
  try {
    // Import candidate data from JSON file
    const candidateData = await import('@/data/candidate-info.json');
    
    const personal = candidateData.personal;
    const experience = candidateData.experience || [];
    const strengths = candidateData.strengths || [];
    const values = candidateData.values || [];
    const valueExperiences = candidateData.valueExperiences || [];
    const situationScenarios = candidateData.situationScenarios || [];

    // OPTIMIZED CONTEXT - Reduced tokens while maintaining key information
    let context = `You are Robert Mill's AI assistant for interview preparation. Answer questions about Robert using this data:

PERSONAL: ${personal?.name}, ${personal?.currentRole} at ${personal?.currentCompany}, ${personal?.location}

EXPERIENCE:`;

    // Limit to top 3 most recent experiences to reduce tokens
    experience.slice(0, 3).forEach((exp: Experience) => {
      context += `
• ${exp.position} at ${exp.company} (${exp.startDate}-${exp.endDate})
  Win: ${exp.magicQuestions?.biggestWin?.slice(0, 100)}...
  Challenge: ${exp.magicQuestions?.toughestChallenge?.slice(0, 100)}...`;
    });

    context += `

CORE VALUES:`;
    // Include values but keep descriptions short
    values.slice(0, 4).forEach((value: any) => {
      context += `
• ${value.title}: ${value.shortDescription}`;
    });

    context += `

BEHAVIORAL SCENARIOS:`;
    // Include key behavioral scenarios for interview prep
    situationScenarios.forEach((scenario: any) => {
      context += `
• ${scenario.title} (${scenario.categoryId})
  Situation: ${scenario.situation.slice(0, 150)}...
  Result: ${scenario.result.slice(0, 150)}...`;
    });

    context += `

STRENGTHS:`;
    strengths.slice(0, 4).forEach((strength: Strength | string) => {
      if (typeof strength === 'string') {
        context += `
• ${strength}`;
      } else {
        context += `
• ${strength.title}: ${strength.summary.slice(0, 100)}...`;
      }
    });

    context += `

VALUE EXPERIENCES:`;
    // Include a few key value-driven experiences
    valueExperiences.slice(0, 3).forEach((exp: any) => {
      context += `
• ${exp.title}: ${exp.impact}`;
    });

    context += `

Instructions: Answer questions about Robert's background, experience, values, and behavioral examples. Use specific examples and maintain a professional, helpful tone. For behavioral questions, reference the scenarios above.`;

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
      } catch (error: unknown) {
        const apiError = error as APIError;
        // Handle Claude API errors before streaming
        if (apiError.error?.type === 'overloaded_error') {
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
          } catch (error: unknown) {
            const apiError = error as APIError;
            console.error('Claude streaming error:', error);
            
            // Handle specific Claude errors
            if (apiError.error?.type === 'overloaded_error') {
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
      const conversationHistory = messages.map((msg: Message) => ({
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
            } catch (error: unknown) {
              const apiError = error as APIError;
              console.error('Gemini streaming error:', error);
              
              // Handle specific Gemini errors
              if (apiError.status === 429) {
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
        
      } catch (error: unknown) {
        const apiError = error as APIError;
        // Handle Gemini API errors before streaming
        if (apiError.status === 429) {
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