import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mockDataPath = path.join(__dirname, '../data/mockData.ts');

console.log('Reading mockData.ts...');
const content = fs.readFileSync(mockDataPath, 'utf8');

// Find the articles array
const arrayStart = content.indexOf('export const mockArticles: Article[] = [');
const arrayStartPos = arrayStart + 'export const mockArticles: Article[] = '.length;
const arrayEnd = content.indexOf('];', arrayStartPos);

const before = content.substring(0, arrayStartPos);
const arrayContent = content.substring(arrayStartPos, arrayEnd + 1);
const after = content.substring(arrayEnd + 2);

// Parse articles
const articles = JSON.parse(arrayContent);
console.log(`Total articles: ${articles.length}`);

// Remove duplicates
const seen = new Set();
const unique = [];
const removed = [];

for (const article of articles) {
  if (seen.has(article.id)) {
    removed.push({ id: article.id, title: article.title });
  } else {
    seen.add(article.id);
    unique.push(article);
  }
}

console.log(`\nDuplicates found: ${removed.length}`);
removed.forEach(r => console.log(`  - ID ${r.id}: ${r.title.substring(0, 60)}...`));

console.log(`\nUnique articles: ${unique.length}`);

// Write back
const newContent = before + JSON.stringify(unique, null, 2) + ';\n\n' + after;
fs.writeFileSync(mockDataPath, newContent, 'utf8');

console.log('\n✅ Deduplication complete!');
