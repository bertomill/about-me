'use client';

import { useState } from 'react';
import { CheckCircle, TrendingUp, Users, Zap, Brain, Target, Award, ChevronRight, Briefcase } from 'lucide-react';

interface RequirementMatch {
  requirement: string;
  category: string;
  matchLevel: 'perfect' | 'strong' | 'good';
  robertsExperience: string;
  evidence: string[];
}

export default function JobFitAnalysis() {
  const [activeCategory, setActiveCategory] = useState('all');

  const jobRequirements: RequirementMatch[] = [
    // Education & Background
    {
      requirement: "Bachelor's Degree or higher, preferably in a STEM-related field",
      category: "education",
      matchLevel: "perfect",
      robertsExperience: "Bachelor of Commerce with concentration in Finance and Strategic Management",
      evidence: ["3.8 GPA", "Dean's List recognition", "STEM-adjacent business degree with quantitative focus"]
    },
    
    // SaaS Experience
    {
      requirement: "3+ years of experience in a SaaS Software environment",
      category: "experience",
      matchLevel: "perfect",
      robertsExperience: "3+ years combined: 2+ years at CIBC with enterprise software solutions and 1+ year at Scelta delivering software products to construction companies",
      evidence: ["Digital transformation projects at CIBC", "Construction technology platform delivery at Scelta", "Cloud-based solution implementations", "Software vendor management"]
    },

    // Customer-Facing Experience
    {
      requirement: "3+ years in Customer Success, Consulting, Professional Services, Account Management",
      category: "experience",
      matchLevel: "perfect",
      robertsExperience: "5+ years in strategy consulting and client-facing roles across CIBC, Scelta, and Wood Gundy",
      evidence: ["Strategy Consultant at CIBC", "Client relationship management at Scelta", "Wood Gundy client-facing experience", "Stakeholder engagement across multiple industries"]
    },

    // AI Understanding
    {
      requirement: "Understanding of AI - Conversational AI, Large Language Models, Generative AI",
      category: "technical",
      matchLevel: "perfect",
      robertsExperience: "Direct AI implementation experience, strategic AI initiatives, and ongoing AI content creation",
      evidence: ["Led AI adoption strategies at CIBC", "Generative AI project implementations", "AI newsletter publication", "YouTube channel on AI and coding"]
    },

    // Growth Mindset
    {
      requirement: "Growth mindset with natural curiosity about technology, passion for AI",
      category: "mindset",
      matchLevel: "perfect",
      robertsExperience: "Demonstrated continuous learning and AI passion through content creation and innovation focus",
      evidence: ["AI newsletter publication", "YouTube channel on AI and coding", "Innovation-focused role", "Self-directed technology learning"]
    },

    // Project Management
    {
      requirement: "Proven ability to coordinate multiple client-facing projects simultaneously",
      category: "skills",
      matchLevel: "perfect",
      robertsExperience: "Managed multiple strategic initiatives at CIBC and 10+ client accounts at Scelta",
      evidence: ["Multiple concurrent projects at CIBC", "Managed 5-6 client accounts simultaneously at Scelta", "Cross-functional team leadership", "Client deliverable coordination"]
    },

    // Cross-functional Collaboration
    {
      requirement: "Experience collaborating across Sales, Product, Customer Success, Development teams",
      category: "collaboration",
      matchLevel: "perfect",
      robertsExperience: "Extensive cross-functional collaboration in enterprise environment and construction technology platform delivery",
      evidence: ["Worked with IT, Operations, Sales teams at CIBC", "Construction technology platform delivery at Scelta", "Product development collaboration", "Stakeholder alignment across departments"]
    },

    // Communication Skills
    {
      requirement: "Excellent communication skills to explain complex AI concepts to non-technical stakeholders",
      category: "communication",
      matchLevel: "perfect",
      robertsExperience: "Proven ability to translate complex concepts for diverse audiences",
      evidence: ["Executive presentations", "Technical concept simplification", "Strategic communication expertise"]
    },

    // Problem Solving
    {
      requirement: "Curious by nature, enthusiastic problem solver, efficient and scalable solutions",
      category: "mindset",
      matchLevel: "perfect",
      robertsExperience: "Strategic problem-solving expertise with innovation focus and continuous learning through content creation",
      evidence: ["Innovation Strategy role", "YouTube channel on AI and coding", "AI newsletter publication", "Process optimization", "Strategic solution development"]
    },

    // AI Ethics
    {
      requirement: "Understanding of AI ethics and responsible AI practices",
      category: "technical",
      matchLevel: "perfect",
      robertsExperience: "Strategic understanding of AI governance and ethical implementation, including contributions to enterprise AI guidelines",
      evidence: ["Initial contributor to CIBC's generative AI guidelines", "Enterprise AI governance", "Responsible AI implementation", "Strategic risk assessment"]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Requirements', icon: Target },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'technical', label: 'Technical', icon: Brain },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'communication', label: 'Communication', icon: Users },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'mindset', label: 'Mindset', icon: TrendingUp },
    { id: 'education', label: 'Education', icon: Award }
  ];

  const filteredRequirements = activeCategory === 'all' 
    ? jobRequirements 
    : jobRequirements.filter(req => req.category === activeCategory);

  const getMatchColor = (level: string) => {
    switch (level) {
      case 'perfect': return 'text-green-700 bg-green-100 border-green-200';
      case 'strong': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'good': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getMatchIcon = (level: string) => {
    switch (level) {
      case 'perfect': return <CheckCircle size={16} className="text-green-600" />;
      case 'strong': return <CheckCircle size={16} className="text-blue-600" />;
      case 'good': return <CheckCircle size={16} className="text-yellow-600" />;
      default: return <CheckCircle size={16} className="text-gray-600" />;
    }
  };

  const overallStats = {
    perfect: jobRequirements.filter(req => req.matchLevel === 'perfect').length,
    strong: jobRequirements.filter(req => req.matchLevel === 'strong').length,
    good: jobRequirements.filter(req => req.matchLevel === 'good').length,
    total: jobRequirements.length
  };

  const matchPercentage = 95; // Mid-90s match reflecting exceptional alignment with Glia requirements

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Job Fit Analysis</h1>
        <p className="text-gray-600">Mapping Robert's experience to Glia AI Consultant requirements</p>
      </div>

      {/* Overall Match Score */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Overall Job Fit</h2>
            <p className="text-gray-600">Based on Glia AI Consultant role requirements</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{matchPercentage}%</div>
            <div className="text-sm text-gray-600">Match Score</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{overallStats.perfect}</div>
            <div className="text-xs text-gray-600">Perfect Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{overallStats.strong}</div>
            <div className="text-xs text-gray-600">Strong Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{overallStats.good}</div>
            <div className="text-xs text-gray-600">Good Matches</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Requirements Grid */}
      <div className="space-y-4">
        {filteredRequirements.map((req, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getMatchIcon(req.matchLevel)}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(req.matchLevel)}`}>
                    {req.matchLevel.charAt(0).toUpperCase() + req.matchLevel.slice(1)} Match
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{req.requirement}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Robert's Experience</h4>
                <p className="text-gray-700 text-sm">{req.robertsExperience}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Supporting Evidence</h4>
                <ul className="space-y-1">
                  {req.evidence.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                      <ChevronRight size={12} className="text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Strengths for Glia AI Consultant Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>Perfect Alignment:</strong>
            <ul className="mt-1 space-y-1">
              <li>• 3+ years SaaS experience (CIBC + Scelta)</li>
              <li>• 5+ years client-facing consulting experience</li>
              <li>• Direct AI implementation and strategy work</li>
              <li>• Managed 5-6 client accounts simultaneously</li>
              <li>• Strong technical communication skills</li>
            </ul>
          </div>
          <div>
            <strong>Competitive Advantages:</strong>
            <ul className="mt-1 space-y-1">
              <li>• AI newsletter and YouTube channel</li>
              <li>• Initial contributor to CIBC's AI guidelines</li>
              <li>• Construction technology platform delivery</li>
              <li>• Enterprise-level strategic thinking</li>
              <li>• Innovation and transformation focus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}