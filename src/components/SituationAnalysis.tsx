'use client';

import { useState } from 'react';
import { AlertTriangle, Users, TrendingDown, Clock, Shield, Target, CheckCircle, Briefcase, Calendar, ChevronRight, Star, Brain } from 'lucide-react';

// Types for situation analysis data structure
interface SituationCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface SituationScenario {
  id: string;
  categoryId: string;
  title: string;
  commonQuestion: string;
  company: string;
  role: string;
  timeframe: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  whatLearned: string;
  applicableWhen: string[];
  tags: string[];
}

export default function SituationAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Placeholder categories - will be populated with real data
  const situationCategories: SituationCategory[] = [
    {
      id: 'crisis-management',
      title: 'Crisis Management',
      description: 'How I handle urgent problems and system failures',
      icon: 'alert-triangle',
      color: 'from-red-500 to-orange-600'
    },
    {
      id: 'team-conflict',
      title: 'Team Dynamics',
      description: 'Managing disagreements and building consensus',
      icon: 'users',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'performance-issues',
      title: 'Performance Challenges',
      description: 'Dealing with underperformance and missed deadlines',
      icon: 'trending-down',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'time-pressure',
      title: 'Time Pressure',
      description: 'Delivering under tight deadlines and competing priorities',
      icon: 'clock',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'difficult-decisions',
      title: 'Difficult Decisions',
      description: 'Making tough choices with incomplete information',
      icon: 'brain',
      color: 'from-emerald-500 to-green-600'
    }
  ];

  // Placeholder scenarios - will be populated with real examples
  const situationScenarios: SituationScenario[] = [
    {
      id: 'system-failure',
      categoryId: 'crisis-management',
      title: 'Critical System Outage During Peak Hours',
      commonQuestion: 'Tell me about a time when a critical system failed and customers were impacted. How did you handle it?',
      company: 'Example Company',
      role: 'Consultant',
      timeframe: '2023',
      situation: 'Placeholder situation description',
      task: 'Placeholder task description', 
      action: 'Placeholder action taken',
      result: 'Placeholder result achieved',
      whatLearned: 'Key insights gained from this experience',
      applicableWhen: ['System outages', 'Customer escalations', 'Crisis communication'],
      tags: ['crisis', 'communication', 'customer-service']
    }
  ];

  const getIconComponent = (iconName: string) => {
    const iconMap = {
      'alert-triangle': AlertTriangle,
      'users': Users,
      'trending-down': TrendingDown,
      'clock': Clock,
      'shield': Shield,
      'target': Target,
      'brain': Brain
    };
    return iconMap[iconName as keyof typeof iconMap] || Star;
  };

  const filteredScenarios = selectedCategory === 'all' 
    ? situationScenarios 
    : situationScenarios.filter(scenario => scenario.categoryId === selectedCategory);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-300 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative flex items-start space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/25 border border-white/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300">
            <Brain size={22} className="sm:w-7 sm:h-7 text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/25 to-transparent"></div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <span>Situation Analysis</span>
              <span className="text-indigo-600 text-lg">🎯</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Real examples of how Robert handles challenging situations - from system failures and team conflicts to tight deadlines and difficult decisions. Each scenario demonstrates problem-solving approach and lessons learned.
            </p>
          </div>
        </div>
      </div>

      {/* Situation Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {situationCategories.map((category) => {
          const IconComponent = getIconComponent(category.icon);
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
              className={`relative group text-left p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                selectedCategory === category.id
                  ? 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg shadow-indigo-200/50'
                  : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-md'
              }`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative space-y-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-sm border border-white/20`}>
                  <IconComponent size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
                </div>
                {selectedCategory === category.id && (
                  <div className="flex items-center space-x-1 text-indigo-600">
                    <CheckCircle size={16} />
                    <span className="text-xs font-medium">Selected</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          All Situations
        </button>
        {situationCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Scenarios Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Situation Examples
            {selectedCategory !== 'all' && (
              <span className="text-indigo-600 ml-2">
                • {situationCategories.find(c => c.id === selectedCategory)?.title}
              </span>
            )}
          </h3>
          <span className="text-sm text-gray-500">
            {filteredScenarios.length} scenario{filteredScenarios.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredScenarios.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No scenarios yet for this category.</p>
            <p className="text-sm text-gray-400 mt-1">Behavioral examples will be added soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{scenario.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Briefcase size={14} />
                      <span>{scenario.role} at {scenario.company}</span>
                      <span>•</span>
                      <Calendar size={14} />
                      <span>{scenario.timeframe}</span>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-indigo-800 font-medium">Common Interview Question:</p>
                      <p className="text-sm text-indigo-700 italic">&quot;{scenario.commonQuestion}&quot;</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                    situationCategories.find(c => c.id === scenario.categoryId)?.color || 'from-gray-400 to-gray-500'
                  } text-white`}>
                    {situationCategories.find(c => c.id === scenario.categoryId)?.title}
                  </div>
                </div>

                {/* STAR Format */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Situation</h5>
                    <p className="text-sm text-gray-600">{scenario.situation}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Task</h5>
                    <p className="text-sm text-gray-600">{scenario.task}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Action</h5>
                    <p className="text-sm text-gray-600">{scenario.action}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Result</h5>
                    <p className="text-sm text-gray-600">{scenario.result}</p>
                  </div>
                </div>

                {/* Additional Insights */}
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">What I Learned</h5>
                    <p className="text-sm text-gray-600">{scenario.whatLearned}</p>
                  </div>
                  
                  {scenario.applicableWhen.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Applicable When</h5>
                      <div className="flex flex-wrap gap-2">
                        {scenario.applicableWhen.map((application, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-200"
                          >
                            {application}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.tags.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Tags</h5>
                      <div className="flex flex-wrap gap-2">
                        {scenario.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Star size={20} className="text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-indigo-900 mb-1">Behavioral Examples Coming Soon</h4>
            <p className="text-sm text-indigo-700">
              Real situational examples from Robert&apos;s career will be added to demonstrate problem-solving approaches, decision-making under pressure, and learning from challenging experiences across different categories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 