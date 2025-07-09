import { NextResponse } from 'next/server';

// This API route doesn't need the request parameter
export async function POST() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Generate ephemeral token for OpenAI Realtime API
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2025-06-03',
        voice: 'alloy',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI Realtime API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create realtime session' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      client_secret: data.client_secret?.value,
      expires_at: data.expires_at,
    });

  } catch (error) {
    console.error('Ephemeral token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ephemeral token' },
      { status: 500 }
    );
  }
}