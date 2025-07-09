-- Create personal_info table
CREATE TABLE personal_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education table
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  relevant_coursework TEXT[] DEFAULT '{}',
  why_chosen TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experience table
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  location TEXT NOT NULL,
  how_found_job TEXT NOT NULL,
  who_hired_you TEXT NOT NULL,
  what_hired_to_do TEXT NOT NULL,
  manager_description TEXT NOT NULL,
  areas_for_growth TEXT NOT NULL,
  biggest_win TEXT NOT NULL,
  toughest_challenge TEXT NOT NULL,
  why_left TEXT NOT NULL,
  why_made_move TEXT NOT NULL,
  what_learned TEXT NOT NULL,
  accomplishments TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  exceptional_performance TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create key_stories table
CREATE TABLE key_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  situation TEXT NOT NULL,
  task TEXT NOT NULL,
  action TEXT NOT NULL,
  result TEXT NOT NULL,
  learned TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create awards table
CREATE TABLE awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create simple tables for strengths and growth areas
CREATE TABLE strengths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strength TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE growth_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  growth_area TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE questions_for_interviewer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_key_stories_updated_at BEFORE UPDATE ON key_stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_awards_updated_at BEFORE UPDATE ON awards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_strengths_updated_at BEFORE UPDATE ON strengths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_growth_areas_updated_at BEFORE UPDATE ON growth_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_for_interviewer_updated_at BEFORE UPDATE ON questions_for_interviewer FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE strengths ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions_for_interviewer ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on personal_info" ON personal_info FOR ALL USING (true);
CREATE POLICY "Allow all operations on education" ON education FOR ALL USING (true);
CREATE POLICY "Allow all operations on experience" ON experience FOR ALL USING (true);
CREATE POLICY "Allow all operations on key_stories" ON key_stories FOR ALL USING (true);
CREATE POLICY "Allow all operations on awards" ON awards FOR ALL USING (true);
CREATE POLICY "Allow all operations on strengths" ON strengths FOR ALL USING (true);
CREATE POLICY "Allow all operations on growth_areas" ON growth_areas FOR ALL USING (true);
CREATE POLICY "Allow all operations on questions_for_interviewer" ON questions_for_interviewer FOR ALL USING (true);