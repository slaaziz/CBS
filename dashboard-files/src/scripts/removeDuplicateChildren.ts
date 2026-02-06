import { mockArticles } from '../data/mockData';
import type { Article } from '../data/mockData';

// Find duplicate child articles and keep only the ones with highest vertrouwensscore
function removeDuplicateChildren() {
  const idMap = new Map<string, Article[]>();
  
  // Group articles by ID
  mockArticles.forEach(article => {
    if (!idMap.has(article.id)) {
      idMap.set(article.id, []);
    }
    idMap.get(article.id)!.push(article);
  });
  
  // Find duplicates
  const duplicates: string[] = [];
  idMap.forEach((articles, id) => {
    if (articles.length > 1) {
      duplicates.push(id);
      console.log(`\nDuplicate ID: ${id}`);
      console.log(`Found ${articles.length} articles with this ID:`);
      articles.forEach((article, index) => {
        console.log(`  [${index + 1}] Vertrouwensscore: ${article.vertrouwensscore}%, Title: ${article.title.substring(0, 60)}...`);
      });
      
      // Sort by vertrouwensscore descending
      articles.sort((a, b) => b.vertrouwensscore - a.vertrouwensscore);
      console.log(`  -> Keeping article with highest score: ${articles[0].vertrouwensscore}%`);
    }
  });
  
  if (duplicates.length === 0) {
    console.log('\nNo duplicate child articles found!');
    return mockArticles;
  }
  
  console.log(`\n\nTotal duplicate IDs found: ${duplicates.length}`);
  
  // Create deduplicated array - keep only the article with highest vertrouwensscore for each ID
  const deduplicatedArticles: Article[] = [];
  const processedIds = new Set<string>();
  
  mockArticles.forEach(article => {
    if (processedIds.has(article.id)) {
      return; // Skip - we already processed this ID
    }
    
    const articlesWithSameId = idMap.get(article.id)!;
    if (articlesWithSameId.length === 1) {
      // No duplicates, just add it
      deduplicatedArticles.push(article);
    } else {
      // Has duplicates - add the one with highest vertrouwensscore
      const sorted = [...articlesWithSameId].sort((a, b) => b.vertrouwensscore - a.vertrouwensscore);
      deduplicatedArticles.push(sorted[0]);
    }
    
    processedIds.add(article.id);
  });
  
  console.log(`\nOriginal count: ${mockArticles.length}`);
  console.log(`Deduplicated count: ${deduplicatedArticles.length}`);
  console.log(`Removed: ${mockArticles.length - deduplicatedArticles.length} duplicate articles`);
  
  return deduplicatedArticles;
}

// Run the deduplication
const result = removeDuplicateChildren();
console.log('\n\nDeduplication complete!');
console.log('\nNext steps:');
console.log('1. Review the output above to verify the correct articles are being kept');
console.log('2. Update mockData.ts with the deduplicated articles');
