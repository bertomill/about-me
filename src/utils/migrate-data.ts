import { supabase } from '@/lib/supabase';
import { candidateData } from './candidate-data';

export async function migrateCandidateData() {
  try {
    console.log('Starting data migration...');

    // 1. Migrate personal info
    console.log('Migrating personal info...');
    const { error: personalError } = await supabase
      .from('personal_info')
      .insert([{
        name: candidateData.personal.name,
        role: candidateData.personal.currentRole,
        company: candidateData.personal.currentCompany,
        location: candidateData.personal.location,
        email: candidateData.personal.email,
        linkedin: candidateData.personal.linkedin
      }]);
    
    if (personalError) {
      console.error('Personal info migration error:', personalError);
      throw personalError;
    }

    // 2. Migrate education
    console.log('Migrating education...');
    for (const edu of candidateData.education) {
      const { error: eduError } = await supabase
        .from('education')
        .insert([{
          degree: edu.degree,
          institution: edu.institution,
          graduation_year: edu.graduationYear,
          achievements: edu.achievements,
          relevant_coursework: edu.relevantCoursework,
          why_chosen: edu.whyChosen
        }]);
      
      if (eduError) {
        console.error('Education migration error:', eduError);
        throw eduError;
      }
    }

    // 3. Migrate experience
    console.log('Migrating experience...');
    for (const exp of candidateData.experience) {
      const { error: expError } = await supabase
        .from('experience')
        .insert([{
          company: exp.company,
          position: exp.position,
          start_date: exp.startDate,
          end_date: exp.endDate,
          location: exp.location,
          how_found_job: exp.magicQuestions.howFoundJob,
          who_hired_you: exp.magicQuestions.whoHiredYou,
          what_hired_to_do: exp.magicQuestions.whatHiredToDo,
          manager_description: exp.magicQuestions.managerDescription,
          areas_for_growth: exp.magicQuestions.areasForGrowth,
          biggest_win: exp.magicQuestions.biggestWin,
          toughest_challenge: exp.magicQuestions.toughestChallenge,
          why_left: exp.magicQuestions.whyLeft,
          why_made_move: exp.careerMove.whyMadeMove,
          what_learned: exp.careerMove.whatLearned,
          accomplishments: exp.accomplishments,
          challenges: exp.challenges,
          exceptional_performance: exp.exceptionalPerformance,
          skills: exp.skills,
          technologies: exp.technologies
        }]);
      
      if (expError) {
        console.error('Experience migration error:', expError);
        throw expError;
      }
    }

    // 4. Migrate key stories
    console.log('Migrating key stories...');
    for (const story of candidateData.keyStories) {
      const { error: storyError } = await supabase
        .from('key_stories')
        .insert([{
          title: story.title,
          situation: story.situation,
          task: story.task,
          action: story.action,
          result: story.result,
          learned: story.learned,
          tags: story.tags
        }]);
      
      if (storyError) {
        console.error('Key stories migration error:', storyError);
        throw storyError;
      }
    }

    // 5. Migrate awards
    console.log('Migrating awards...');
    for (const award of candidateData.awards) {
      const { error: awardError } = await supabase
        .from('awards')
        .insert([{
          title: award.title,
          organization: award.organization,
          year: award.year,
          description: award.description
        }]);
      
      if (awardError) {
        console.error('Awards migration error:', awardError);
        throw awardError;
      }
    }

    // 6. Migrate strengths
    console.log('Migrating strengths...');
    for (const strength of candidateData.strengths) {
      const { error: strengthError } = await supabase
        .from('strengths')
        .insert([{
          strength: strength
        }]);
      
      if (strengthError) {
        console.error('Strengths migration error:', strengthError);
        throw strengthError;
      }
    }

    // 7. Migrate growth areas
    console.log('Migrating growth areas...');
    for (const growth of candidateData.growthAreas) {
      const { error: growthError } = await supabase
        .from('growth_areas')
        .insert([{
          growth_area: growth
        }]);
      
      if (growthError) {
        console.error('Growth areas migration error:', growthError);
        throw growthError;
      }
    }

    // 8. Migrate questions for interviewer
    console.log('Migrating questions for interviewer...');
    for (const question of candidateData.questionsForInterviewer) {
      const { error: questionError } = await supabase
        .from('questions_for_interviewer')
        .insert([{
          question: question
        }]);
      
      if (questionError) {
        console.error('Questions migration error:', questionError);
        throw questionError;
      }
    }

    console.log('Migration completed successfully!');
    return { success: true, message: 'All data migrated successfully' };

  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error };
  }
}

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connection successful!');
    return { success: true, data };
  } catch (error) {
    console.error('Connection test error:', error);
    return { success: false, error };
  }
}