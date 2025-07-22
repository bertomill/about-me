'use client';

import { useState } from 'react';
import { MessageSquare, User, Mic, Target, Heart, X, Shield, Eye, Lock, CheckCircle } from 'lucide-react';
import QuestionInterface from '@/components/QuestionInterface';
import CandidateProfile from '@/components/CandidateProfile';
import VoiceInterface from '@/components/VoiceInterface';
import JobFitAnalysis from '@/components/JobFitAnalysis';
import Values from '@/components/Values';

export default function SimpleInterviewDashboard() {
  const [activeTab, setActiveTab] = useState('assistant');
  const [isResponsibleAIModalOpen, setIsResponsibleAIModalOpen] = useState(false);

  const tabs = [
    {
      id: 'assistant',
      label: 'Chat Assistant',
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
    },
    {
      id: 'values',
      label: 'Values',
      icon: Heart,
      description: 'Core values and career experiences'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Custom Brand Logo */}
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-white/20">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 text-white font-bold text-lg flex items-center justify-center">
                    {/* Custom brain/network logo */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/25 to-transparent"></div>
                  {/* Subtle animated ring */}
                  <div className="absolute inset-0 rounded-2xl border border-white/30 animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                  <span>Robert Mill TopGrade</span>
                  <span className="text-blue-300 text-sm font-normal">AI</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">Candidate Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 text-emerald-200 rounded-full text-xs font-semibold backdrop-blur-sm hover:bg-gradient-to-r hover:from-emerald-500/30 hover:to-blue-500/30 transition-all duration-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse shadow-sm"></div>
                  <span>Live Session</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Mobile: Scrollable horizontal tabs */}
          <div className="flex overflow-x-auto scrollbar-hide space-x-1 sm:space-x-6 md:space-x-10 py-2 sm:py-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center space-x-2 px-4 sm:px-5 py-4 sm:py-5 border-b-3 transition-all duration-300 whitespace-nowrap min-w-fit relative hover:transform hover:scale-[1.02] active:scale-[0.98] ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-slate-700 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  {/* Active tab background glow */}
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/60 to-blue-50/30 rounded-t-lg -m-1 border-t border-emerald-200/50"></div>
                  )}
                  
                  <div className={`relative z-10 p-1.5 rounded-lg transition-all duration-200 shadow-sm border ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-br from-emerald-100 to-blue-100 text-emerald-700 border-emerald-200/50' 
                      : 'bg-gray-50 border-gray-200/50 group-hover:bg-gradient-to-br group-hover:from-gray-100 group-hover:to-blue-50 group-hover:border-blue-200/50'
                  }`}>
                    <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  
                  <span className="relative z-10 font-semibold text-sm sm:text-base">
                    {/* Show shorter labels on mobile for better fit */}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">
                      {tab.id === 'assistant' ? 'Chat' : 
                       tab.id === 'voice' ? 'Voice' : 
                       tab.id === 'profile' ? 'Profile' : 
                       tab.id === 'values' ? 'Values' :
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
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-300 overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              <div className="relative flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25 border border-white/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300">
                  <MessageSquare size={22} className="sm:w-7 sm:h-7 text-white" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/25 to-transparent"></div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <span>Meet Robert Mill</span>
                    <span className="text-emerald-600 text-lg">✨</span>
                  </h2>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-3xl">
                    Your AI-powered interview companion is ready to dive deep into Robert&apos;s professional journey. 
                    Explore his strategic expertise at <span className="font-semibold text-emerald-700">CIBC</span>, 
                    innovation work at <span className="font-semibold text-emerald-700">Scelta</span>, 
                    healthcare contributions at <span className="font-semibold text-emerald-700">SickKids</span>, 
                    and discover what makes him an exceptional candidate for your team.
                  </p>
                </div>
              </div>
            </div>

            {/* Question Interface */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-300">
              <QuestionInterface />
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-6">
            {/* Voice Welcome Card */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-300 overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              <div className="relative flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25 border border-white/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                  <Mic size={22} className="sm:w-7 sm:h-7 text-white" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/25 to-transparent"></div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <span>Voice Intelligence Mode</span>
                    <span className="text-cyan-600 text-lg">🎤</span>
                  </h2>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-3xl">
                    Experience the future of interviews with our advanced voice AI. Simply speak naturally and get 
                    intelligent, contextual responses about Robert&apos;s <span className="font-semibold text-cyan-700">career highlights</span>, 
                    <span className="font-semibold text-cyan-700">leadership experience</span>, and 
                    <span className="font-semibold text-cyan-700">strategic achievements</span> in real-time conversation.
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Interface */}
            <VoiceInterface />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-300">
            <CandidateProfile />
          </div>
        )}

        {activeTab === 'jobfit' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-300">
            <JobFitAnalysis />
          </div>
        )}

        {activeTab === 'values' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-300">
            <Values />
          </div>
        )}
      </div>

      {/* Subtle Footer */}
      <div className="border-t border-gray-200/50 bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="font-medium">© 2025 Robert Mill</span>
              <span className="hidden sm:inline text-gray-400">•</span>
              <span className="hidden sm:inline text-gray-500">TopGrade AI Platform</span>
              <span className="hidden md:inline text-gray-400">•</span>
              <button 
                onClick={() => setIsResponsibleAIModalOpen(true)}
                className="hidden md:inline text-gray-500 hover:text-emerald-600 transition-all duration-200 cursor-pointer underline decoration-dotted underline-offset-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                Responsible AI Practices
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-1 text-gray-400">
                <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse"></span>
                <span className="text-xs">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsible AI Practices Modal */}
      {isResponsibleAIModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 transform animate-in zoom-in-95 duration-300 ease-out">
                         {/* Modal Header */}
             <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Responsible AI Practices</h3>
                    <p className="text-emerald-100 text-sm">How we ensure ethical AI in candidate evaluation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsResponsibleAIModalOpen(false)}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
                             {/* Privacy Protection */}
               <div className="flex items-start space-x-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                   <Lock className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h4 className="text-lg font-semibold text-gray-900 mb-2">Candidate Privacy Protection</h4>
                   <p className="text-gray-700 text-sm leading-relaxed mb-3">
                     We prioritize candidate data protection through secure handling and automatic data management policies.
                   </p>
                   <ul className="space-y-2 text-sm text-gray-600">
                     <li className="flex items-center space-x-2">
                       <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                       <span>Candidate data is automatically deleted after one month</span>
                     </li>
                     <li className="flex items-center space-x-2">
                       <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                       <span>Secure data handling and access controls</span>
                     </li>
                     <li className="flex items-center space-x-2">
                       <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                       <span>No permanent storage of personal information</span>
                     </li>
                   </ul>
                 </div>
               </div>

                             {/* AI Guardrails */}
               <div className="flex items-start space-x-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                   <Shield className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Model Guardrails</h4>
                   <p className="text-gray-700 text-sm leading-relaxed mb-3">
                     Our AI systems include built-in safeguards to ensure fair, unbiased, and appropriate candidate evaluation.
                   </p>
                   <ul className="space-y-2 text-sm text-gray-600">
                     <li className="flex items-center space-x-2">
                       <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                       <span>Unbiased algorithm when matching job description with candidate skills</span>
                     </li>
                     <li className="flex items-center space-x-2">
                       <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                       <span>Content filtering to prevent inappropriate questions</span>
                     </li>
                     <li className="flex items-center space-x-2">
                       <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                       <span>Regular model audits for fairness and accuracy</span>
                     </li>
                   </ul>
                 </div>
               </div>

              {/* Transparency */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Transparency & Explainability</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    We believe in transparent AI decisions and provide clear explanations for all candidate assessments.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      <span>Clear disclosure of AI involvement in evaluation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      <span>Detailed reasoning behind AI recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      <span>Human oversight for all final hiring decisions</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Additional Commitments */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Our Commitment</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We continuously monitor and improve our AI systems to ensure they serve candidates and employers fairly. 
                  Our platform is designed to augment human decision-making, not replace it, while maintaining the highest 
                  standards of ethical AI practice in talent evaluation.
                </p>
              </div>
            </div>

                         {/* Modal Footer */}
             <div className="bg-gray-50 px-6 py-4 rounded-b-3xl border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">Last updated: January 2025</p>
                <button
                  onClick={() => setIsResponsibleAIModalOpen(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-emerald-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}