import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import candidateData from '@/data/candidate-info.json';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define types for the analysis results
interface RequirementMatch {
  requirement: string;
  category: string;
  matchLevel: 'perfect' | 'strong' | 'good' | 'weak';
  robertsExperience: string;
  evidence: string[];
  confidence: number;
}

interface JobFitAnalysisResult {
  companyName: string;
  jobTitle: string;
  overallMatchScore: number;
  overallSummary: string;
  requirements: RequirementMatch[];
  keyStrengths: string[];
  potentialConcerns: string[];
  recommendations: string[];
}

// Function to extract Robert's comprehensive experience summary
function getCandidateProfile() {
  const profile = {
    personal: candidateData.personal,
    education: candidateData.education,
    experience: candidateData.experience,
    strengths: candidateData.strengths || [],
    keyStories: candidateData.keyStories || [],
    skills: candidateData.skills || [],
    technologies: candidateData.technologies || []
  };

  return `
CANDIDATE PROFILE - ROBERT MILL

PERSONAL:
- Current Role: ${profile.personal.currentRole} at ${profile.personal.currentCompany}
- Location: ${profile.personal.location}

EDUCATION:
${profile.education.map(edu => `
- ${edu.degree} from ${edu.institution} (${edu.graduationYear})
  Achievements: ${edu.achievements?.join(', ')}
  Coursework: ${edu.relevantCoursework?.join(', ')}
  Reason: ${edu.whyChosen}
`).join('')}

WORK EXPERIENCE:
${profile.experience.map(exp => `
- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})
  Location: ${exp.location}
  What hired to do: ${exp.magicQuestions?.whatHiredToDo}
  Biggest win: ${exp.magicQuestions?.biggestWin}
  Toughest challenge: ${exp.magicQuestions?.toughestChallenge}
  Manager description: ${exp.magicQuestions?.managerDescription}
  Accomplishments: ${exp.accomplishments?.join(', ')}
  Skills: ${exp.skills?.join(', ')}
  Technologies: ${exp.technologies?.join(', ')}
  Why made move: ${exp.careerMove?.whyMadeMove}
  What learned: ${exp.careerMove?.whatLearned}
`).join('')}

CORE STRENGTHS:
${typeof profile.strengths[0] === 'string' 
  ? profile.strengths.join(', ')
  : profile.strengths.map((s: any) => `
- ${s.title}: ${s.summary}
  Details: ${s.details}
  Impact: ${s.impact}
  Metrics: ${s.metrics?.join(', ')}
  Technologies: ${s.technologies?.join(', ')}
`).join('')}

KEY STORIES:
${profile.keyStories.map((story: any) => `
- ${story.title}
  Situation: ${story.situation}
  Task: ${story.task}
  Action: ${story.action}
  Result: ${story.result}
  Learned: ${story.learned}
  Tags: ${story.tags?.join(', ')}
`).join('')}
`;
}

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, companyName, jobTitle } = await req.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Get Robert's comprehensive profile
    const candidateProfile = getCandidateProfile();

    // Create the AI prompt for job fit analysis
    const prompt = `
You are an expert recruitment analyst. Analyze how well Robert Mill fits the following job description.

CANDIDATE PROFILE:
${candidateProfile}

JOB DESCRIPTION:
Company: ${companyName || 'Not specified'}
Job Title: ${jobTitle || 'Not specified'}
Description: ${jobDescription}

ANALYSIS INSTRUCTIONS:
1. Extract 6-10 key requirements from the job description
2. For each requirement, assess Robert's match level: perfect, strong, good, or weak
3. Provide specific evidence from Robert's background
4. Calculate an overall match percentage (0-100%)
5. Identify key strengths and potential concerns
6. Provide actionable recommendations

Return your analysis in the following JSON format:
{
  "companyName": "extracted or provided company name",
  "jobTitle": "extracted or provided job title", 
  "overallMatchScore": number between 0-100,
  "overallSummary": "2-3 sentence summary of the fit",
  "requirements": [
    {
      "requirement": "specific requirement from job description",
      "category": "experience/education/technical/soft-skills/other",
      "matchLevel": "perfect/strong/good/weak",
      "robertsExperience": "how Robert's background addresses this",
      "evidence": ["specific examples", "from his experience"],
      "confidence": number between 0-100
    }
  ],
  "keyStrengths": ["strength 1", "strength 2", "strength 3"],
  "potentialConcerns": ["concern 1", "concern 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

Be thorough, specific, and honest in your assessment. Use direct quotes and examples from Robert's experience.
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert recruitment analyst specializing in job fit analysis. Always respond with valid JSON.'
        },
        {
          role: 'user', 
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI');
    }

    // Parse the AI response - clean markdown formatting if present
    let analysisResult: JobFitAnalysisResult;
    try {
      // Remove markdown code block formatting if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      analysisResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('AI response:', response);
      throw new Error('Failed to parse AI response');
    }

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error('Job fit analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze job fit. Please try again.' },
      { status: 500 }
    );
  }
} 