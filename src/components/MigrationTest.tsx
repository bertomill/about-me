'use client';

import { useState } from 'react';
import { migrateRobertData } from '@/utils/migrate-robert-data';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function MigrationTest() {
  const [migrationResult, setMigrationResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const runMigration = async () => {
    setIsLoading(true);
    setMigrationResult('Migrating data...');
    setIsSuccess(null);
    
    try {
      const result = await migrateRobertData();
      if (result.success) {
        setMigrationResult('Data migration successful!');
        setIsSuccess(true);
      } else {
        setMigrationResult(`Migration failed: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setMigrationResult(`Migration error: ${error}`);
      setIsSuccess(false);
    }
    
    setIsLoading(false);
  };

  return (
    <div>
      <button
        onClick={runMigration}
        disabled={isLoading}
        className="w-full px-4 py-2.5 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 border border-blue-500/30"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Migrating...</span>
          </>
        ) : (
          <>
            <Upload size={16} />
            <span>Migrate Data</span>
          </>
        )}
      </button>
      
      {migrationResult && (
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
              {migrationResult}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}