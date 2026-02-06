import * as fs from 'fs';
import * as path from 'path';

// Read the file
const filePath = path.join(process.cwd(), 'data', 'mockData.ts');
console.log('Reading file:', filePath);
const content = fs.readFileSync(filePath, 'utf-8');

// Extract the array
const arrayMarker = 'export const mockArticles: Article[] = ';
const arrayStart = content.indexOf(arrayMarker);

if (arrayStart === -1) {
  console.error('Could not find mockArticles array');
  process.exit(1);
}

const arrayContentStart = arrayStart + arrayMarker.length;
const arrayEnd = content.indexOf('];', arrayContentStart);

if (arrayEnd === -1) {
  console.error('Could not find end of mockArticles array');
  process.exit(1);
}

// Parse the JSON
const arrayJson = content.substring(arrayContentStart, arrayEnd + 1);
const articles = JSON.parse(arrayJson);

console.log(`\nOriginal article count: ${articles.length}`);

// Remove duplicates
const seen = new Set();
const unique = [];
let duplicateCount = 0;

for (const article of articles) {
  if (seen.has(article.id)) {
    console.log(`  Removing duplicate: ID ${article.id} - "${article.title.substring(0, 50)}..."`);
    duplicateCount++;
  } else {
    seen.add(article.id);
    unique.push(article);
  }
}

console.log(`\nDuplicates removed: ${duplicateCount}`);
console.log(`Unique articles: ${unique.length}`);

// Reconstruct the file
const before = content.substring(0, arrayContentStart);
const after = content.substring(arrayEnd + 2);
const newContent = before + JSON.stringify(unique, null, 2) + ';\n\n' + after;

// Write back
fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('\n✅ File updated successfully!');
