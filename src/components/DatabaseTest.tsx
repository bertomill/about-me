'use client';

import { useState } from 'react';
import { testSupabaseConnection } from '@/utils/migrate-data';
import { Database, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function DatabaseTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');
    setIsSuccess(null);
    
    try {
      const result = await testSupabaseConnection();
      if (result.success) {
        setTestResult('Database connection successful!');
        setIsSuccess(true);
      } else {
        setTestResult(`Connection failed: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setTestResult(`Test error: ${error}`);
      setIsSuccess(false);
    }
    
    setIsLoading(false);
  };

  return (
    <div>
      <button
        onClick={runTest}
        disabled={isLoading}
        className="w-full px-4 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 border border-emerald-500/30"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Testing...</span>
          </>
        ) : (
          <>
            <Database size={16} />
            <span>Test Connection</span>
          </>
        )}
      </button>
      
      {testResult && (
        <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
          <div className="flex items-center space-x-2 text-sm">
            {isSuccess ? (
              <CheckCircle size={14} className="text-green-400" />
            ) : isSuccess === false ? (
              <XCircle size={14} className="text-red-400" />
            ) : (
              <Loader2 size={14} className="text-blue-400 animate-spin" />
            )}
            <span className={`${
              isSuccess ? 'text-green-400' : 
              isSuccess === false ? 'text-red-400' : 
              'text-blue-400'
            }`}>
              {testResult}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}