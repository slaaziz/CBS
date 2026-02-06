#!/usr/bin/env node
/**
 * Simple duplicate ID checker
 * Reads mockData.ts and identifies any duplicate article IDs
 */

const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '..', 'data', 'mockData.ts');
const content = fs.readFileSync(mockDataPath, 'utf-8');

// Extract all article IDs using regex
const matches = content.matchAll(/"id":\s*"(\d+)"/g);
const ids = Array.from(matches, m => m[1]);

console.log(`Total article entries found: ${ids.length}`);

// Count occurrences
const counts = {};
ids.forEach(id => {
  counts[id] = (counts[id] || 0) + 1;
});

// Find duplicates
const duplicates = Object.entries(counts)
  .filter(([id, count]) => count > 1)
  .sort((a, b) => b[1] - a[1]); // Sort by count descending

if (duplicates.length === 0) {
  console.log('\n✅ No duplicate IDs found! All article IDs are unique.');
  process.exit(0);
}

console.log(`\n❌ Found ${duplicates.length} duplicate IDs:\n`);
console.log('ID       | Count');
console.log('-----------------');
duplicates.forEach(([id, count]) => {
  console.log(`${id.padEnd(8)} | ${count}`);
});

const totalDuplicates = duplicates.reduce((sum, [, count]) => sum + (count - 1), 0);
console.log(`\nTotal articles: ${ids.length}`);
console.log(`Unique IDs: ${Object.keys(counts).length}`);
console.log(`Duplicate entries: ${totalDuplicates}`);
console.log(`\nAfter deduplication: ${ids.length - totalDuplicates} articles`);
