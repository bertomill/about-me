'use client';

import { useState, useEffect } from 'react';
import { Heart, Target, Users, Lightbulb, TrendingUp, Award, ChevronRight, Star, CheckCircle, Briefcase, Calendar, Shield, Wrench } from 'lucide-react';

// Import your real candidate data
import candidateData from '@/data/candidate-info.json';

// Types based on your actual data structure
interface CoreValue {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  color: string;
  principles: string[];
}

interface ValueExperience {
  id: string;
  valueId: string;
  title: string;
  company: string;
  role: string;
  timeframe: string;
  situation: string;
  action: string;
  impact: string;
  learnings: string[];
  tags: string[];
}

export default function Values() {
  const [selectedValue, setSelectedValue] = useState<string>('all');

  // Get real data from candidate info
  const coreValues: CoreValue[] = candidateData.values || [];
  const valueExperiences: ValueExperience[] = candidateData.valueExperiences || [];

  const getIconComponent = (iconName: string) => {
    const iconMap = {
      'lightbulb': Lightbulb,
      'users': Users,
      'target': Target,
      'trending-up': TrendingUp,
      'heart': Heart,
      'award': Award,
      'star': Star,
      'check-circle': CheckCircle,
      'shield': Shield,
      'wrench': Wrench
    };
    return iconMap[iconName as keyof typeof iconMap] || Star;
  };

  const filteredExperiences = selectedValue === 'all' 
    ? valueExperiences 
    : valueExperiences.filter(exp => exp.valueId === selectedValue);

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
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25 border border-white/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
            <Heart size={22} className="sm:w-7 sm:h-7 text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/25 to-transparent"></div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <span>Core Values & Guiding Principles</span>
              <span className="text-purple-600 text-lg">💎</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              The fundamental principles that guide Robert's decisions and drive his approach to work, relationships, and personal growth - each demonstrated through real career experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {coreValues.map((value) => {
          const IconComponent = getIconComponent(value.icon);
          return (
            <button
              key={value.id}
              onClick={() => setSelectedValue(selectedValue === value.id ? 'all' : value.id)}
              className={`relative group text-left p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                selectedValue === value.id
                  ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg shadow-purple-200/50'
                  : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-md'
              }`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative space-y-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center shadow-sm border border-white/20`}>
                  <IconComponent size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                  <p className="text-xs text-purple-600 font-medium mb-1">{value.shortDescription}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </div>
                {selectedValue === value.id && (
                  <div className="flex items-center space-x-1 text-purple-600">
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
          onClick={() => setSelectedValue('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedValue === 'all'
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          All Experiences
        </button>
        {coreValues.map((value) => (
          <button
            key={value.id}
            onClick={() => setSelectedValue(value.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedValue === value.id
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {value.title}
          </button>
        ))}
      </div>

      {/* Experiences Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Career Experiences 
            {selectedValue !== 'all' && (
              <span className="text-purple-600 ml-2">
                • {coreValues.find(v => v.id === selectedValue)?.title}
              </span>
            )}
          </h3>
          <span className="text-sm text-gray-500">
            {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No experiences yet for this value.</p>
            <p className="text-sm text-gray-400 mt-1">Content will be added soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExperiences.map((experience) => (
              <div
                key={experience.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{experience.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Briefcase size={14} />
                      <span>{experience.role} at {experience.company}</span>
                      <span>•</span>
                      <Calendar size={14} />
                      <span>{experience.timeframe}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                    coreValues.find(v => v.id === experience.valueId)?.color || 'from-gray-400 to-gray-500'
                  } text-white`}>
                    {coreValues.find(v => v.id === experience.valueId)?.title}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Situation</h5>
                    <p className="text-sm text-gray-600">{experience.situation}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Action</h5>
                    <p className="text-sm text-gray-600">{experience.action}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Impact</h5>
                    <p className="text-sm text-gray-600">{experience.impact}</p>
                  </div>
                  {experience.learnings.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Key Learnings</h5>
                      <div className="flex flex-wrap gap-2">
                        {experience.learnings.map((learning, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md border border-purple-200"
                          >
                            {learning}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {experience.tags && experience.tags.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Tags</h5>
                      <div className="flex flex-wrap gap-2">
                        {experience.tags.map((tag, index) => (
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

      {/* Values Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Star size={20} className="text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Authentically Demonstrated</h4>
            <p className="text-sm text-purple-700">
              Robert's values aren't just words on a page - they're principles lived out through real career decisions, from <span className="font-medium">scaling startups and mastering AI transformation</span> to <span className="font-medium">training for world-class competitions and serving customers hands-on</span>. Each value represents authentic experiences and ongoing personal development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 