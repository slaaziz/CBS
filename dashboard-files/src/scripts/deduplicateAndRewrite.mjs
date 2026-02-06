import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the mockData.ts file
const mockDataPath = path.join(__dirname, '..', 'data', 'mockData.ts');
const content = fs.readFileSync(mockDataPath, 'utf-8');

// Extract the mockArticles array
const articlesMatch = content.match(/export const mockArticles: Article\[\] = (\[[\s\S]*?\n\]);/);
if (!articlesMatch) {
  console.error('Could not find mockArticles array in mockData.ts');
  process.exit(1);
}

const articlesJSON = articlesMatch[1];
let articles;
try {
  // Use eval to parse the array (we trust our own code)
  articles = eval(articlesJSON);
} catch (e) {
  console.error('Failed to parse articles array:', e);
  process.exit(1);
}

console.log(`Original article count: ${articles.length}`);

// Group articles by ID
const idMap = new Map();
articles.forEach(article => {
  if (!idMap.has(article.id)) {
    idMap.set(article.id, []);
  }
  idMap.get(article.id).push(article);
});

// Find and report duplicates
const duplicates = [];
idMap.forEach((articlesWithId, id) => {
  if (articlesWithId.length > 1) {
    duplicates.push({ id, articles: articlesWithId });
  }
});

if (duplicates.length === 0) {
  console.log('\n✅ No duplicate child articles found!');
  process.exit(0);
}

console.log(`\n⚠️  Found ${duplicates.length} duplicate IDs:\n`);

// Show details for each duplicate
duplicates.forEach(({ id, articles: dupes }) => {
  console.log(`ID: ${id} (${dupes.length} duplicates)`);
  dupes.forEach((article, index) => {
    console.log(`  [${index + 1}] Score: ${article.vertrouwensscore}% - "${article.title.substring(0, 50)}..."`);
  });
  
  // Sort by vertrouwensscore to find the best one
  const sorted = [...dupes].sort((a, b) => b.vertrouwensscore - a.vertrouwensscore);
  console.log(`  ✓ Keeping: Score ${sorted[0].vertrouwensscore}%\n`);
});

// Create deduplicated array
const deduplicatedArticles = [];
const processedIds = new Set();

articles.forEach(article => {
  if (processedIds.has(article.id)) {
    return; // Skip duplicates
  }
  
  const articlesWithSameId = idMap.get(article.id);
  if (articlesWithSameId.length === 1) {
    deduplicatedArticles.push(article);
  } else {
    // Keep the one with highest vertrouwensscore
    const sorted = [...articlesWithSameId].sort((a, b) => b.vertrouwensscore - a.vertrouwensscore);
    deduplicatedArticles.push(sorted[0]);
  }
  
  processedIds.add(article.id);
});

console.log(`\n📊 Summary:`);
console.log(`Original count: ${articles.length}`);
console.log(`Deduplicated count: ${deduplicatedArticles.length}`);
console.log(`Removed: ${articles.length - deduplicatedArticles.length} duplicate articles`);

// Create the new file content
const beforeArticles = content.substring(0, content.indexOf('export const mockArticles: Article[] = ['));
const afterArticles = content.substring(content.indexOf('];', content.indexOf('export const mockArticles')) + 2);

const newArticlesJSON = JSON.stringify(deduplicatedArticles, null, 2);
const newContent = beforeArticles + 
  'export const mockArticles: Article[] = ' + 
  newArticlesJSON + 
  ';' + 
  afterArticles;

// Write the updated file
fs.writeFileSync(mockDataPath, newContent, 'utf-8');

console.log(`\n✅ Successfully updated ${mockDataPath}`);
console.log('Deduplication complete!');
