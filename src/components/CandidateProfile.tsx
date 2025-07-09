'use client';

import { useState, useEffect } from 'react';
import { User, MapPin, Mail, Linkedin, GraduationCap, Briefcase, Award, Target, Lightbulb, MessageCircle } from 'lucide-react';

interface PersonalInfo {
  name: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  email: string;
  linkedin: string;
}

interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
  achievements: string[];
  relevantCoursework: string[];
  whyChosen: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  magicQuestions: {
    biggestWin: string;
    accomplishments?: string[];
  };
}

interface CandidateData {
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  strengths: string[];
  growthAreas: string[];
  awards: Array<{
    title: string;
    organization: string;
    year: string;
    description: string;
  }>;
  keyStories: Array<{
    title: string;
    situation: string;
    task: string;
    action: string;
    result: string;
    learned: string;
    tags: string[];
  }>;
}

export default function CandidateProfile() {
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    // Load candidate data from JSON file
    fetch('/api/candidate-data')
      .then(res => res.json())
      .then(data => setCandidateData(data))
      .catch(() => {
        // Fallback to importing the JSON directly
        import('@/data/candidate-info.json')
          .then(data => setCandidateData(data.default as CandidateData))
          .catch(console.error);
      });
  }, []);

  if (!candidateData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading candidate profile...</div>
      </div>
    );
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'strengths', label: 'Strengths', icon: Target },
    { id: 'stories', label: 'Key Stories', icon: MessageCircle },
    { id: 'awards', label: 'Awards', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
          <User size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{candidateData.personal.name}</h1>
          <p className="text-lg text-gray-600">{candidateData.personal.currentRole} at {candidateData.personal.currentCompany}</p>
          <div className="flex items-center space-x-4 mt-2 text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin size={16} />
              <span>{candidateData.personal.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail size={16} />
              <span>{candidateData.personal.email}</span>
            </div>
            <a href={candidateData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-green-600 transition-colors">
              <Linkedin size={16} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="mb-6">
        {/* Mobile: Horizontal scroll, Desktop: Wrap */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 sm:flex-wrap sm:overflow-x-visible">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap min-w-fit mobile-tab ${
                  activeSection === section.id
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                <span className="text-xs sm:text-sm font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Mobile indicator for scrollable content */}
        <div className="sm:hidden text-center mt-2">
          <div className="text-xs text-gray-400">← Swipe to see all sections →</div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Target size={20} className="text-green-600" />
                <span>Top Strengths</span>
              </h3>
              <div className="space-y-3">
                {candidateData.strengths.slice(0, 3).map((strength, index) => (
                  <div key={index} className="text-gray-700 text-sm">
                    • {strength}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Lightbulb size={20} className="text-yellow-500" />
                <span>Growth Areas</span>
              </h3>
              <div className="space-y-3">
                {candidateData.growthAreas.map((area, index) => (
                  <div key={index} className="text-gray-700 text-sm">
                    • {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'experience' && (
          <div className="space-y-6">
            {candidateData.experience.map((exp, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-lg text-green-600">{exp.company}</p>
                    <p className="text-gray-500">{exp.startDate} - {exp.endDate} • {exp.location}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-gray-900 font-medium mb-2">Biggest Win:</h4>
                  <p className="text-gray-700 text-sm">{exp.magicQuestions.biggestWin}</p>
                </div>

                {exp.magicQuestions.accomplishments && (
                  <div>
                    <h4 className="text-gray-900 font-medium mb-2">Key Accomplishments:</h4>
                    <div className="space-y-1">
                      {exp.magicQuestions.accomplishments.map((accomplishment, i) => (
                        <div key={i} className="text-gray-700 text-sm">• {accomplishment}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'education' && (
          <div className="space-y-6">
            {candidateData.education.map((edu, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-lg text-green-600">{edu.institution}</p>
                <p className="text-gray-500 mb-4">Graduated {edu.graduationYear}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-900 font-medium mb-2">Achievements:</h4>
                    <div className="space-y-1">
                      {edu.achievements.map((achievement, i) => (
                        <div key={i} className="text-gray-700 text-sm">• {achievement}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-900 font-medium mb-2">Relevant Coursework:</h4>
                    <div className="space-y-1">
                      {edu.relevantCoursework.map((course, i) => (
                        <div key={i} className="text-gray-700 text-sm">• {course}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-gray-900 font-medium mb-2">Why This Path:</h4>
                  <p className="text-gray-700 text-sm">{edu.whyChosen}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'strengths' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Core Strengths</h3>
            <div className="space-y-4">
              {candidateData.strengths.map((strength, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-gray-700">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'stories' && (
          <div className="space-y-6">
            {candidateData.keyStories.map((story, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{story.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-blue-600 font-medium mb-2">Situation</h4>
                      <p className="text-gray-700 text-sm">{story.situation}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-green-600 font-medium mb-2">Task</h4>
                      <p className="text-gray-700 text-sm">{story.task}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-yellow-600 font-medium mb-2">Action</h4>
                      <p className="text-gray-700 text-sm">{story.action}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-purple-600 font-medium mb-2">Result</h4>
                      <p className="text-gray-700 text-sm">{story.result}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-orange-600 font-medium mb-2">What I Learned</h4>
                  <p className="text-gray-700 text-sm">{story.learned}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {story.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'awards' && (
          <div className="space-y-4">
            {candidateData.awards.map((award, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award size={24} className="text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{award.title}</h3>
                    <p className="text-green-600">{award.organization} • {award.year}</p>
                    <p className="text-gray-700 text-sm mt-2">{award.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}