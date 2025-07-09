'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, MapPin, Mail, Linkedin, GraduationCap, Briefcase, Award, Target, Lightbulb, MessageCircle, ChevronDown, ChevronRight, Youtube, Twitter, FileText } from 'lucide-react';

interface PersonalInfo {
  name: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  email: string;
  linkedin: string;
  youtube: string;
  newsletter: string;
  twitter: string;
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

interface Strength {
  title: string;
  summary: string;
  details: string;
  metrics: string[];
  technologies: string[];
  impact: string;
}

interface CandidateData {
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  strengths: Strength[];
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
  const [expandedStrengths, setExpandedStrengths] = useState<Set<number>>(new Set());
  const [expandedGrowthAreas, setExpandedGrowthAreas] = useState<Set<number>>(new Set());

  const toggleStrength = (index: number) => {
    const newExpanded = new Set(expandedStrengths);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedStrengths(newExpanded);
  };

  const toggleGrowthArea = (index: number) => {
    const newExpanded = new Set(expandedGrowthAreas);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedGrowthAreas(newExpanded);
  };

  const getTimelineData = () => {
    if (!candidateData) return { education: [], work: [] };
    
    // Process education data
    const education = candidateData.education.map(edu => ({
      ...edu,
      startYear: parseInt(edu.graduationYear) - 2, // Assuming 2-year programs
      endYear: parseInt(edu.graduationYear),
      type: 'education'
    }));
    
    // Process work experience data
    const work = candidateData.experience.map(exp => ({
      ...exp,
      startYear: new Date(exp.startDate).getFullYear(),
      endYear: exp.endDate === 'Present' ? new Date().getFullYear() : new Date(exp.endDate).getFullYear(),
      type: 'work',
      isPresent: exp.endDate === 'Present'
    }));
    
    return { education: education.sort((a, b) => a.startYear - b.startYear), work: work.sort((a, b) => a.startYear - b.startYear) };
  };

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
    { id: 'timeline', label: 'Timeline', icon: Target },
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
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-green-200">
          <Image 
            src="/Robert-Headshot.png" 
            alt="Robert Mill" 
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{candidateData.personal.name}</h1>
          <p className="text-lg text-gray-600">{candidateData.personal.currentRole} at {candidateData.personal.currentCompany}</p>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-500">
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
            <a href={candidateData.personal.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-red-600 transition-colors">
              <Youtube size={16} />
              <span>YouTube</span>
            </a>
            <a href={candidateData.personal.newsletter} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <FileText size={16} />
              <span>Newsletter</span>
            </a>
            <a href={candidateData.personal.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-sky-600 transition-colors">
              <Twitter size={16} />
              <span>X</span>
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
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Target size={20} className="text-emerald-600" />
                <span>Top Strengths</span>
              </h3>
              <div className="space-y-3">
                {candidateData.strengths.slice(0, 3).map((strength, index) => (
                  <div key={index} className="border border-emerald-100 rounded-xl bg-white/70 backdrop-blur-sm">
                    <button
                      onClick={() => toggleStrength(index)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-emerald-50/50 transition-all duration-200 rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="text-gray-700 text-sm">
                          • <span className="font-bold text-emerald-700">{strength.title}</span> - {strength.summary}
                        </div>
                      </div>
                      <div className="ml-2 text-emerald-600">
                        {expandedStrengths.has(index) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                    </button>
                    
                    {expandedStrengths.has(index) && (
                      <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {strength.details}
                        </div>
                        
                        {strength.metrics && strength.metrics.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-emerald-700 mb-1">Key Metrics:</h5>
                            <div className="space-y-1">
                              {strength.metrics.slice(0, 3).map((metric, i) => (
                                <div key={i} className="text-xs text-gray-600 flex items-start">
                                  <span className="text-emerald-500 mr-1 mt-0.5">✓</span>
                                  {metric}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {strength.technologies && strength.technologies.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-emerald-700 mb-1">Technologies:</h5>
                            <div className="flex flex-wrap gap-1">
                              {strength.technologies.slice(0, 4).map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-600 bg-emerald-50 p-2 rounded-lg italic">
                          <strong>Impact:</strong> {strength.impact}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Lightbulb size={20} className="text-amber-500" />
                <span>Growth Areas</span>
              </h3>
              <div className="space-y-3">
                {candidateData.growthAreas.map((area, index) => {
                  // Enhanced growth area details
                  const growthDetails = {
                    0: {
                      title: "Technical Database Expertise",
                      description: "Currently developing deeper understanding of database systems and technical infrastructure to complement strategic consulting skills",
                      plan: "Taking advanced database courses, working on hands-on projects with SQL, NoSQL, and data architecture",
                      timeline: "6-month learning plan with practical application goals"
                    },
                    1: {
                      title: "Healthcare Industry Depth", 
                      description: "Building more comprehensive domain knowledge in healthcare technology and regulatory environments",
                      plan: "Reading healthcare technology reports, attending industry conferences, and connecting with healthcare professionals",
                      timeline: "Ongoing professional development with quarterly milestones"
                    },
                    2: {
                      title: "Advanced Stakeholder Management",
                      description: "Continuously improving skills in managing complex organizational dynamics and driving change across multiple business units", 
                      plan: "Seeking mentorship, studying organizational behavior, and practicing with cross-functional project leadership",
                      timeline: "Developing through real-world application and feedback"
                    },
                    3: {
                      title: "Process Documentation",
                      description: "Enhancing systematic documentation practices for better knowledge transfer and team scaling as organizations grow",
                      plan: "Implementing documentation frameworks, learning technical writing best practices, and creating standardized templates",
                      timeline: "Immediate implementation with iterative improvements"
                    }
                  }[index];

                  return (
                    <div key={index} className="border border-amber-100 rounded-xl bg-white/70 backdrop-blur-sm">
                      <button
                        onClick={() => toggleGrowthArea(index)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-amber-50/50 transition-all duration-200 rounded-xl"
                      >
                        <div className="flex-1">
                          <div className="text-gray-700 text-sm">
                            • <span className="font-bold text-amber-700">{growthDetails?.title || area}</span>
                          </div>
                        </div>
                        <div className="ml-2 text-amber-600">
                          {expandedGrowthAreas.has(index) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      </button>
                      
                      {expandedGrowthAreas.has(index) && growthDetails && (
                        <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                          <div className="text-xs text-gray-600 leading-relaxed">
                            {growthDetails.description}
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-semibold text-amber-700 mb-1">Development Plan:</h5>
                            <div className="text-xs text-gray-600">
                              {growthDetails.plan}
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-600 bg-amber-50 p-2 rounded-lg">
                            <strong>Timeline:</strong> {growthDetails.timeline}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'timeline' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Career Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education Column */}
              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                  <GraduationCap size={20} className="mr-2" />
                  Education
                </h4>
                <div className="space-y-4">
                  {getTimelineData().education.map((edu, index) => (
                    <div key={index} className="relative pl-6 pb-4">
                      <div className="absolute left-0 top-0 w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="absolute left-1.5 top-3 w-0.5 bg-blue-200 h-full"></div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-blue-600">
                            {edu.startYear} - {edu.endYear}
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-900">{edu.degree}</h5>
                        <p className="text-blue-600 text-sm">{edu.institution}</p>
                        <p className="text-gray-600 text-sm mt-1">{edu.whyChosen}</p>
                        
                        {edu.achievements && edu.achievements.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700">Key Achievements:</p>
                            <ul className="text-xs text-gray-600 mt-1">
                              {edu.achievements.slice(0, 2).map((achievement, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-blue-500 mr-1">•</span>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience Column */}
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                  <Briefcase size={20} className="mr-2" />
                  Work Experience
                </h4>
                <div className="space-y-4">
                  {getTimelineData().work.map((job, index) => (
                    <div key={index} className="relative pl-6 pb-4">
                      <div className="absolute left-0 top-0 w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="absolute left-1.5 top-3 w-0.5 bg-green-200 h-full"></div>
                      
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-green-600">
                            {job.startYear} - {job.isPresent ? 'Present' : job.endYear}
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-900">{job.position}</h5>
                        <p className="text-green-600 text-sm">{job.company}</p>
                        <p className="text-gray-500 text-sm">{job.location}</p>
                        
                        {job.magicQuestions && job.magicQuestions.biggestWin && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700">Biggest Win:</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {job.magicQuestions.biggestWin.substring(0, 120)}...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleStrength(index)}
                    className="w-full p-4 bg-green-50 hover:bg-green-100 transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{strength.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{strength.summary}</p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {expandedStrengths.has(index) ? (
                        <ChevronDown size={20} className="text-green-600" />
                      ) : (
                        <ChevronRight size={20} className="text-green-600" />
                      )}
                    </div>
                  </button>
                  
                  {expandedStrengths.has(index) && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Details</h5>
                          <p className="text-gray-700 text-sm">{strength.details}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Key Metrics</h5>
                          <ul className="space-y-1">
                            {strength.metrics.map((metric, metricIndex) => (
                              <li key={metricIndex} className="text-gray-700 text-sm flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                {metric}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Technologies</h5>
                          <div className="flex flex-wrap gap-2">
                            {strength.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Impact</h5>
                          <p className="text-gray-700 text-sm">{strength.impact}</p>
                        </div>
                      </div>
                    </div>
                  )}
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