import { mockArticles } from '../data/mockData';
import { categorizeArticles } from '../utils/categorizeArticle';

// Categorize all articles first
const categorizedArticles = categorizeArticles(mockArticles);

// Extract unique sources
const uniqueSources = Array.from(new Set(categorizedArticles.map(a => a.source)))
  .filter(Boolean)
  .sort();

// Extract unique categories after categorization
const uniqueCategories = Array.from(new Set(categorizedArticles.map(a => a.category)))
  .filter(Boolean)
  .filter(cat => cat !== 'Uncategorized')
  .sort();

// Extract unique themes from keyThemes
const uniqueThemes = Array.from(new Set(categorizedArticles.flatMap(a => a.keyThemes)))
  .filter(Boolean)
  .sort();

console.log('=== UNIQUE SOURCES ===');
console.log(JSON.stringify(uniqueSources, null, 2));
console.log('\n=== UNIQUE CATEGORIES ===');
console.log(JSON.stringify(uniqueCategories, null, 2));
console.log('\n=== UNIQUE THEMES ===');
console.log(JSON.stringify(uniqueThemes, null, 2));
console.log('\n=== COUNTS ===');
console.log(`Total articles: ${categorizedArticles.length}`);
console.log(`Unique sources: ${uniqueSources.length}`);
console.log(`Unique categories: ${uniqueCategories.length}`);
console.log(`Unique themes: ${uniqueThemes.length}`);
