/**
 * Utility script to update mockData.ts
 * This script removes sentiment fields and adds wordCount to all articles
 * 
 * INSTRUCTIONS:
 * 1. Copy this code
 * 2. Run it in your browser console or Node.js environment
 * 3. Copy the output
 * 4. Replace the mockArticles array in /data/mockData.ts
 */

import { mockArticles } from '../data/mockData';

// Function to estimate word count from body text
function estimateWordCount(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Update all articles
export function updateArticlesStructure() {
  const updated Articles = mockArticles.map(article => {
    // Remove sentiment field and add wordCount
    const { sentiment, ...rest } = article as any;
    
    return {
      ...rest,
      wordCount: article.wordCount || estimateWordCount(article.body)
    };
  });
  
  return updatedArticles;
}

// Generate the export string
export function generateMockDataExport() {
  const updated = updateArticlesStructure();
  return `export const mockArticles: Article[] = ${JSON.stringify(updated, null, 2)};`;
}

// Usage in console:
// import { generateMockDataExport } from './utils/updateMockData';
// console.log(generateMockDataExport());
// Then copy the output and paste into mockData.ts
