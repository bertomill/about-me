import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export type Database = {
  public: {
    Tables: {
      personal_info: {
        Row: {
          id: string;
          name: string;
          role: string;
          company: string;
          location: string;
          email: string;
          linkedin: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          company: string;
          location: string;
          email: string;
          linkedin: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          company?: string;
          location?: string;
          email?: string;
          linkedin?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          degree: string;
          institution: string;
          graduation_year: string;
          achievements: string[];
          relevant_coursework: string[];
          why_chosen: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          degree: string;
          institution: string;
          graduation_year: string;
          achievements: string[];
          relevant_coursework: string[];
          why_chosen: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          degree?: string;
          institution?: string;
          graduation_year?: string;
          achievements?: string[];
          relevant_coursework?: string[];
          why_chosen?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      experience: {
        Row: {
          id: string;
          company: string;
          position: string;
          start_date: string;
          end_date: string;
          location: string;
          how_found_job: string;
          who_hired_you: string;
          what_hired_to_do: string;
          manager_description: string;
          areas_for_growth: string;
          biggest_win: string;
          toughest_challenge: string;
          why_left: string;
          why_made_move: string;
          what_learned: string;
          accomplishments: string[];
          challenges: string[];
          exceptional_performance: string[];
          skills: string[];
          technologies: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          position: string;
          start_date: string;
          end_date: string;
          location: string;
          how_found_job: string;
          who_hired_you: string;
          what_hired_to_do: string;
          manager_description: string;
          areas_for_growth: string;
          biggest_win: string;
          toughest_challenge: string;
          why_left: string;
          why_made_move: string;
          what_learned: string;
          accomplishments: string[];
          challenges: string[];
          exceptional_performance: string[];
          skills: string[];
          technologies: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          position?: string;
          start_date?: string;
          end_date?: string;
          location?: string;
          how_found_job?: string;
          who_hired_you?: string;
          what_hired_to_do?: string;
          manager_description?: string;
          areas_for_growth?: string;
          biggest_win?: string;
          toughest_challenge?: string;
          why_left?: string;
          why_made_move?: string;
          what_learned?: string;
          accomplishments?: string[];
          challenges?: string[];
          exceptional_performance?: string[];
          skills?: string[];
          technologies?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      key_stories: {
        Row: {
          id: string;
          title: string;
          situation: string;
          task: string;
          action: string;
          result: string;
          learned: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          situation: string;
          task: string;
          action: string;
          result: string;
          learned: string;
          tags: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          situation?: string;
          task?: string;
          action?: string;
          result?: string;
          learned?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      awards: {
        Row: {
          id: string;
          title: string;
          organization: string;
          year: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          organization: string;
          year: string;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          organization?: string;
          year?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};