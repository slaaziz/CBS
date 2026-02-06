#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read mockData.ts
const mockDataPath = path.join(__dirname, '..', 'data', 'mockData.ts');
let content = fs.readFileSync(mockDataPath, 'utf-8');

console.log('🔍 Analyzing mockData.ts for duplicate article IDs...\n');

// Find the start and end of the mockArticles array
const arrayStart = content.indexOf('export const mockArticles: Article[] = [');
const arrayEnd = content.indexOf('];', arrayStart) + 1;

if (arrayStart === -1 || arrayEnd === -1) {
  console.error('❌ Could not find mockArticles array');
  process.exit(1);
}

const beforeArray = content.substring(0, arrayStart + 'export const mockArticles: Article[] = ['.length);
const afterArray = content.substring(arrayEnd + 1);
const arrayContent = content.substring(arrayStart + 'export const mockArticles: Article[] = ['.length, arrayEnd);

// Parse articles - split by },\n  { pattern
const articleStrings = arrayContent.split(/\},\s*\{/).map((str, idx, arr) => {
  let article = str.trim();
  // Add back the braces
  if (idx > 0) article = '{' + article;
  if (idx < arr.length - 1) article = article + '}';
  return article;
});

console.log(`📊 Found ${articleStrings.length} articles`);

// Parse each article to extract ID and vertrouwensscore
const articles = articleStrings.map(str => {
  const idMatch = str.match(/"id":\s*"([^"]+)"/);
  const scoreMatch = str.match(/"vertrouwensscore":\s*(\d+)/);
  const titleMatch = str.match(/"title":\s*"([^"]+)"/);
  
  return {
    raw: str,
    id: idMatch ? idMatch[1] : null,
    vertrouwensscore: scoreMatch ? parseInt(scoreMatch[1]) : 0,
    title: titleMatch ? titleMatch[1] : 'Unknown'
  };
});

// Group by ID
const byId = {};
articles.forEach(article => {
  if (article.id) {
    if (!byId[article.id]) {
      byId[article.id] = [];
    }
    byId[article.id].push(article);
  }
});

// Find duplicates
const duplicateIds = Object.keys(byId).filter(id => byId[id].length > 1);

if (duplicateIds.length === 0) {
  console.log('✅ No duplicate article IDs found!');
  process.exit(0);
}

console.log(`\n⚠️  Found ${duplicateIds.length} duplicate IDs:\n`);

// For each duplicate, show details and mark which to keep
const toRemove = new Set();
duplicateIds.forEach(id => {
  const copies = byId[id];
  console.log(`ID: ${id} (${copies.length} copies)`);
  
  // Sort by vertrouwensscore descending
  copies.sort((a, b) => b.vertrouwensscore - a.vertrouwensscore);
  
  copies.forEach((article, idx) => {
    if (idx === 0) {
      console.log(`  ✓ KEEP - Score: ${article.vertrouwensscore}% - "${article.title.substring(0, 50)}..."`);
    } else {
      console.log(`  ✗ REMOVE - Score: ${article.vertrouwensscore}% - "${article.title.substring(0, 50)}..."`);
      toRemove.add(article.raw);
    }
  });
  console.log();
});

// Create deduplicated articles array
const deduplicatedArticles = [];
const seenIds = new Set();

articles.forEach(article => {
  if (!article.id) {
    deduplicatedArticles.push(article.raw);
    return;
  }
  
  if (seenIds.has(article.id)) {
    // Skip - we've already added the best version
    return;
  }
  
  const copies = byId[article.id];
  if (copies.length === 1) {
    // No duplicate, just add it
    deduplicatedArticles.push(article.raw);
  } else {
    // Has duplicates - add the one with highest vertrouwensscore
    const sorted = [...copies].sort((a, b) => b.vertrouwensscore - a.vertrouwensscore);
    deduplicatedArticles.push(sorted[0].raw);
  }
  
  seenIds.add(article.id);
});

console.log('='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Original articles: ${articles.length}`);
console.log(`Duplicate IDs found: ${duplicateIds.length}`);
console.log(`Articles removed: ${articles.length - deduplicatedArticles.length}`);
console.log(`Final article count: ${deduplicatedArticles.length}`);

// Write the updated content
const newArrayContent = '\n  ' + deduplicatedArticles.join(',\n  ') + '\n';
const newContent = beforeArray + newArrayContent + afterArray;

// Create backup
const backupPath = mockDataPath + '.backup';
fs.writeFileSync(backupPath, content, 'utf-8');
console.log(`\n💾 Backup created: ${backupPath}`);

// Write new content
fs.writeFileSync(mockDataPath, newContent, 'utf-8');
console.log(`✅ Updated: ${mockDataPath}`);
console.log('\n✨ Deduplication complete!');
