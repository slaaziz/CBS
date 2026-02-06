const fs = require('fs');
const path = require('path');

// Read the mockData.ts file
const mockDataPath = path.join(process.cwd(), 'data', 'mockData.ts');
const content = fs.readFileSync(mockDataPath, 'utf8');

// Extract the articles array
const articlesStart = content.indexOf('export const mockArticles: Article[] = [');
const articlesEnd = content.lastIndexOf('];', content.indexOf('export const publishers'));

if (articlesStart === -1) {
  console.error('Could not find mockArticles array');
  process.exit(1);
}

// Get everything before and after the articles array
const beforeArticles = content.substring(0, articlesStart);
const afterArticlesIndex = content.indexOf('];', articlesStart) + 2;
const afterArticles = content.substring(afterArticlesIndex);

// Extract just the articles JSON content
const articlesContent = content.substring(articlesStart + 'export const mockArticles: Article[] = '.length, afterArticlesIndex - 1);

// Parse the articles
let articles;
try {
  articles = eval(articlesContent); // Using eval since it's a TS file
} catch (e) {
  console.error('Error parsing articles:', e.message);
  process.exit(1);
}

console.log(`Total articles before deduplication: ${articles.length}`);

// Track duplicates
const seen = new Map();
const duplicates = [];
const unique = [];

articles.forEach((article, index) => {
  if (seen.has(article.id)) {
    duplicates.push({ id: article.id, title: article.title, index });
  } else {
    seen.set(article.id, true);
    unique.push(article);
  }
});

console.log(`\nFound ${duplicates.length} duplicate articles:`);
duplicates.forEach(dup => {
  console.log(`  - ID ${dup.id}: "${dup.title}" (index ${dup.index})`);
});

console.log(`\nUnique articles: ${unique.length}`);

// Write the deduplicated data back
const newContent = beforeArticles + 
  'export const mockArticles: Article[] = ' + 
  JSON.stringify(unique, null, 2) + 
  ';\n\n' + 
  afterArticles;

fs.writeFileSync(mockDataPath, newContent, 'utf8');
console.log('\nDuplicates removed successfully!');
