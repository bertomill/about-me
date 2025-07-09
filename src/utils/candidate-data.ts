import { CandidateInfo } from '@/types/candidate';
import candidateJson from '@/data/candidate-info.json';

export const candidateData: CandidateInfo = candidateJson as CandidateInfo;

export function getCandidateInfo(): CandidateInfo {
  return candidateData;
}

export function searchCandidateInfo(query: string): string[] {
  const results: string[] = [];
  const searchText = query.toLowerCase();
  
  // Search through all text fields
  const searchInObject = (obj: Record<string, unknown>, path: string = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && value.toLowerCase().includes(searchText)) {
        results.push(`${currentPath}: ${value}`);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string' && item.toLowerCase().includes(searchText)) {
            results.push(`${currentPath}[${index}]: ${item}`);
          } else if (typeof item === 'object' && item !== null) {
            searchInObject(item as Record<string, unknown>, `${currentPath}[${index}]`);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        searchInObject(value as Record<string, unknown>, currentPath);
      }
    }
  };
  
  searchInObject(candidateData as unknown as Record<string, unknown>);
  return results;
}

export function getCandidateByCategory(category: keyof CandidateInfo) {
  return candidateData[category];
}