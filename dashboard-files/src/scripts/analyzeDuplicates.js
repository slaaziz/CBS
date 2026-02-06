const fs = require('fs');
const path = require('path');

// Read the mockData.ts file
const mockDataPath = path.join(__dirname, '..', 'data', 'mockData.ts');
const content = fs.readFileSync(mockDataPath, 'utf-8');

// Extract all article IDs using regex
const idPattern = /"id":\s*"(\d+)"/g;
const ids = [];
let match;

while ((match = idPattern.exec(content)) !== null) {
  ids.push(match[1]);
}

console.log(`📊 Total articles found: ${ids.length}`);

// Count occurrences of each ID
const idCounts = {};
ids.forEach(id => {
  idCounts[id] = (idCounts[id] || 0) + 1;
});

// Find duplicates
const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);

if (duplicates.length === 0) {
  console.log('\n✅ No duplicate IDs found!');
  process.exit(0);
}

console.log(`\n⚠️  Found ${duplicates.length} duplicate IDs:\n`);
duplicates.forEach(([id, count]) => {
  console.log(`  ID: ${id} appears ${count} times`);
});

const totalDuplicates = duplicates.reduce((sum, [id, count]) => sum + (count - 1), 0);
console.log(`\n📊 Total duplicate articles to remove: ${totalDuplicates}`);
console.log(`📊 Articles after deduplication: ${ids.length - totalDuplicates}`);

// Now extract full articles and find which ones to keep
console.log('\n🔍 Analyzing articles to determine which to keep...\n');

// Extract the articles array section
const articlesStart = content.indexOf('export const mockArticles: Article[] = [');
const articlesEnd = content.indexOf('];', articlesStart) + 2;
const articlesSection = content.substring(articlesStart, articlesEnd);

// For each duplicate ID, find all occurrences and their vertrouwensscore
duplicates.forEach(([duplicateId, count]) => {
  console.log(`\n📌 Analyzing ID: ${duplicateId} (${count} copies)`);
  
  // Find all article objects with this ID
  const articlePattern = new RegExp(`\\{[^}]*"id":\\s*"${duplicateId}"[^}]*\\}`, 'gs');
  const articles = [];
  let articleMatch;
  
  // More robust pattern to capture full article objects including nested properties
  const fullArticlePattern = new RegExp(
    `\\{\\s*"id":\\s*"${duplicateId}"[\\s\\S]*?vertrouwensscore":\\s*(\\d+)[\\s\\S]*?(?=\\},\\s*\\{|\\}\\s*\\];)`,
    'g'
  );
  
  let pos = 0;
  while ((articleMatch = fullArticlePattern.exec(articlesSection)) !== null) {
    const score = parseInt(articleMatch[1]);
    articles.push({ score, position: articleMatch.index });
  }
  
  if (articles.length > 0) {
    articles.sort((a, b) => b.score - a.score);
    console.log(`  Found ${articles.length} copies:`);
    articles.forEach((art, idx) => {
      const marker = idx === 0 ? '✓ KEEP' : '✗ REMOVE';
      console.log(`    ${marker} - Vertrouwensscore: ${art.score}%`);
    });
  }
});

console.log('\n\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Original article count: ${ids.length}`);
console.log(`Duplicate IDs: ${duplicates.length}`);
console.log(`Duplicate articles to remove: ${totalDuplicates}`);
console.log(`Final article count: ${ids.length - totalDuplicates}`);
console.log('\n⚠️  Manual intervention required to update mockData.ts');
console.log('   For each duplicate ID above, keep only the article');
console.log('   with the highest vertrouwensscore.');
