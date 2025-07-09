import { NextResponse } from 'next/server';
import candidateData from '@/data/candidate-info.json';

export async function GET() {
  try {
    return NextResponse.json(candidateData);
  } catch (error) {
    console.error('Error loading candidate data:', error);
    return NextResponse.json(
      { error: 'Failed to load candidate data' },
      { status: 500 }
    );
  }
}