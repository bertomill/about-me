'use client';

import { useState, useCallback } from 'react';
import { 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Zap, 
  Brain, 
  Target, 
  Award, 
  ChevronRight, 
  Briefcase,
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  Star,
  TrendingDown
} from 'lucide-react';

// Types for the analysis results - these match our API
interface RequirementMatch {
  requirement: string;
  category: string;
  matchLevel: 'perfect' | 'strong' | 'good' | 'weak';
  robertsExperience: string;
  evidence: string[];
  confidence: number;
}

interface JobFitAnalysisResult {
  companyName: string;
  jobTitle: string;
  overallMatchScore: number;
  overallSummary: string;
  requirements: RequirementMatch[];
  keyStrengths: string[];
  potentialConcerns: string[];
  recommendations: string[];
}

export default function JobFitAnalysis() {
  // State management for the interactive component
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<JobFitAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  
  // Input state for job description
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Handle file upload - this extracts text from uploaded files
  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type === 'text/plain') {
      // Handle plain text files
      const text = await file.text();
      setJobDescription(text);
    } else if (file.type === 'application/pdf') {
      // For PDF files, we'd need a PDF parser - for now, show helpful message
      setError('PDF upload coming soon! Please copy and paste the job description text for now.');
    } else {
      setError('Please upload a text file (.txt) or paste the job description directly.');
    }
  }, []);

  // Handle drag and drop functionality
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  // Main function to analyze job fit using our new API
  const analyzeJobFit = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisStep(0);

    try {
      // Step 1: Parsing job description
      setAnalysisStep(1);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 2: Loading candidate profile
      setAnalysisStep(2);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Step 3: AI analysis
      setAnalysisStep(3);
      
      // Call our new job fit analysis API
      const response = await fetch('/api/job-fit-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: jobDescription.trim(),
          companyName: companyName.trim() || undefined,
          jobTitle: jobTitle.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      // Step 4: Generating results
      setAnalysisStep(4);
      const result: JobFitAnalysisResult = await response.json();
      
      // Step 5: Complete
      setAnalysisStep(5);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAnalysisResult(result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  // Reset function to start a new analysis
  const startNewAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
    setJobDescription('');
    setCompanyName('');
    setJobTitle('');
    setActiveCategory('all');
  };

  // Helper functions for styling based on match levels
  const getMatchColor = (level: string) => {
    switch (level) {
      case 'perfect': return 'text-green-700 bg-green-100 border-green-200';
      case 'strong': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'good': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'weak': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getMatchIcon = (level: string) => {
    switch (level) {
      case 'perfect': return <CheckCircle size={16} className="text-green-600" />;
      case 'strong': return <CheckCircle size={16} className="text-blue-600" />;
      case 'good': return <CheckCircle size={16} className="text-yellow-600" />;
      case 'weak': return <AlertCircle size={16} className="text-red-600" />;
      default: return <CheckCircle size={16} className="text-gray-600" />;
    }
  };

  // Category filter for requirements
  const categories = [
    { id: 'all', label: 'All Requirements', icon: Target },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'technical', label: 'Technical', icon: Brain },
    { id: 'soft-skills', label: 'Soft Skills', icon: Users },
    { id: 'education', label: 'Education', icon: Award },
    { id: 'other', label: 'Other', icon: Zap }
  ];

  // Filter requirements based on active category
  const filteredRequirements = analysisResult?.requirements ? 
    (activeCategory === 'all' 
      ? analysisResult.requirements 
      : analysisResult.requirements.filter(req => req.category === activeCategory)
    ) : [];

  // Calculate statistics for the results
  const getStats = () => {
    if (!analysisResult?.requirements) return { perfect: 0, strong: 0, good: 0, weak: 0, total: 0 };
    
    return {
      perfect: analysisResult.requirements.filter(req => req.matchLevel === 'perfect').length,
      strong: analysisResult.requirements.filter(req => req.matchLevel === 'strong').length,
      good: analysisResult.requirements.filter(req => req.matchLevel === 'good').length,
      weak: analysisResult.requirements.filter(req => req.matchLevel === 'weak').length,
      total: analysisResult.requirements.length
    };
  };

  const stats = getStats();

  // Analysis steps for animation
  const analysisSteps = [
    { id: 1, title: 'Parsing Job Description', description: 'Reading and understanding requirements' },
    { id: 2, title: 'Loading Candidate Profile', description: 'Accessing Robert\'s comprehensive experience' },
    { id: 3, title: 'AI Analysis', description: 'Comparing experience with job requirements' },
    { id: 4, title: 'Generating Results', description: 'Creating detailed match analysis' },
    { id: 5, title: 'Complete', description: 'Analysis ready!' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          AI-Powered Job Fit Analysis
        </h1>
        <p className="text-gray-600">
          Upload or paste any job description to see how Robert&apos;s experience matches
        </p>
      </div>

      {/* Animated Analysis Progress */}
      {isAnalyzing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 m-4 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 h-16 w-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                <Brain className="absolute inset-4 h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
              <p className="text-gray-600">This may take a few moments...</p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
              {analysisSteps.map((step) => (
                <div key={step.id} className={`flex items-center space-x-3 transition-all duration-300 ${
                  analysisStep >= step.id 
                    ? 'text-green-600' 
                    : analysisStep === step.id - 1 
                      ? 'text-blue-600' 
                      : 'text-gray-400'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    analysisStep > step.id 
                      ? 'bg-green-600 text-white' 
                      : analysisStep === step.id 
                        ? 'bg-blue-600 text-white animate-pulse' 
                        : 'bg-gray-200'
                  }`}>
                    {analysisStep > step.id ? (
                      <CheckCircle size={16} />
                    ) : analysisStep === step.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <span className="text-xs font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium transition-all duration-300 ${
                      analysisStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs transition-all duration-300 ${
                      analysisStep >= step.id ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round((analysisStep / analysisSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(analysisStep / analysisSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Section - Shows when no analysis result */}
      {!analysisResult && (
        <div className="space-y-6">
          {/* File Upload & Text Input Area */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* File Upload Section */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Job Description
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop a .txt file or click to browse
                </p>
                <input
                  type="file"
                  accept=".txt,.pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <FileText size={16} className="mr-2" />
                  Choose File
                </label>
              </div>

              {/* Text Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Google, Microsoft, Apple"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer, Product Manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Job Description Text Area */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here, or upload a file above..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Analyze Button */}
            <div className="mt-6 text-center">
              <button
                onClick={analyzeJobFit}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                <Brain size={20} className="mr-2" />
                Analyze Job Fit with AI
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analysis Results Section - Shows when we have results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Results Header with New Analysis Button */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Analysis Results: {analysisResult.companyName}
              </h2>
              <p className="text-gray-600">{analysisResult.jobTitle}</p>
            </div>
            <button
              onClick={startNewAnalysis}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Analysis
            </button>
          </div>

          {/* Overall Match Score */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Overall Job Fit</h3>
                <p className="text-gray-600">{analysisResult.overallSummary}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {analysisResult.overallMatchScore}%
                </div>
                <div className="text-sm text-gray-600">Match Score</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.perfect}</div>
                <div className="text-xs text-gray-600">Perfect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.strong}</div>
                <div className="text-xs text-gray-600">Strong</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.good}</div>
                <div className="text-xs text-gray-600">Good</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.weak}</div>
                <div className="text-xs text-gray-600">Weak</div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 sm:flex-wrap sm:overflow-x-visible">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap min-w-fit ${
                      activeCategory === category.id
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-xs sm:text-sm font-medium">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Requirements Analysis */}
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
                      <span className="text-xs text-gray-500">
                        {req.confidence}% confidence
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{req.requirement}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Robert&apos;s Experience</h5>
                    <p className="text-gray-700 text-sm">{req.robertsExperience}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Supporting Evidence</h5>
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

          {/* Key Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Strengths */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center mb-3">
                <Star className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Key Strengths</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {analysisResult.keyStrengths.map((strength, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <ChevronRight size={12} className="text-green-500 mt-1" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Potential Concerns */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-center mb-3">
                <TrendingDown className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Potential Concerns</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {analysisResult.potentialConcerns.map((concern, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <ChevronRight size={12} className="text-yellow-500 mt-1" />
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {analysisResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <ChevronRight size={12} className="text-blue-500 mt-1" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}