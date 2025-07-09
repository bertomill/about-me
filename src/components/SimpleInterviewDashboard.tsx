'use client';

import { useState } from 'react';
import { MessageSquare, User, Mic, Target } from 'lucide-react';
import QuestionInterface from '@/components/QuestionInterface';
import CandidateProfile from '@/components/CandidateProfile';
import VoiceInterface from '@/components/VoiceInterface';
import JobFitAnalysis from '@/components/JobFitAnalysis';

export default function SimpleInterviewDashboard() {
  const [activeTab, setActiveTab] = useState('assistant');

  const tabs = [
    {
      id: 'assistant',
      label: 'AI Assistant',
      icon: MessageSquare,
      description: 'Ask questions about the candidate'
    },
    {
      id: 'voice',
      label: 'Voice Assistant',
      icon: Mic,
      description: 'Voice conversation with AI'
    },
    {
      id: 'profile',
      label: 'Candidate Profile',
      icon: User,
      description: 'View complete background information'
    },
    {
      id: 'jobfit',
      label: 'Job Fit Analysis',
      icon: Target,
      description: 'Skills alignment with Glia requirements'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <MessageSquare size={14} className="sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold text-gray-900">
                  Interview Assistant
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">AI-powered candidate evaluation</p>
              </div>
            </div>
            <div className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Connected
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Mobile: Scrollable horizontal tabs */}
          <div className="flex overflow-x-auto scrollbar-hide space-x-1 sm:space-x-4 md:space-x-8 py-2 sm:py-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-3 sm:py-4 border-b-2 transition-all duration-200 whitespace-nowrap min-w-fit mobile-tab ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="font-medium text-sm sm:text-base">
                    {/* Show shorter labels on mobile for better fit */}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">
                      {tab.id === 'assistant' ? 'AI' : 
                       tab.id === 'voice' ? 'Voice' : 
                       tab.id === 'profile' ? 'Profile' : 
                       'Job Fit'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'assistant' && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={20} className="sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Ask Me Anything About Robert Mill
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl">
                    I can help you understand Robert&apos;s background, experience, skills, and qualifications. 
                    Ask about his work at CIBC, Scelta, Sick Kids Hospital, or any other aspect of his career journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Question Interface */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
              <QuestionInterface />
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-6">
            {/* Voice Welcome Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mic size={20} className="sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Voice Interview with AI
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl">
                    Have a natural voice conversation about Robert&apos;s background. The AI will listen to your questions and respond with voice answers about his experience and qualifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Interface */}
            <VoiceInterface />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
            <CandidateProfile />
          </div>
        )}

        {activeTab === 'jobfit' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
            <JobFitAnalysis />
          </div>
        )}
      </div>
    </div>
  );
}