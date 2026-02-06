// Quick script to find duplicate article IDs in mockData.ts
const fs = require('fs');

const content = fs.readFileSync('./data/mockData.ts', 'utf-8');

// Extract all IDs using regex
const idMatches = [...content.matchAll(/"id":\s*"(\d+)"/g)];
const ids = idMatches.map(m => m[1]);

console.log(`Total ID occurrences: ${ids.length}`);

// Find duplicates
const counts = {};
ids.forEach(id => {
  counts[id] = (counts[id] || 0) + 1;
});

const duplicates = Object.entries(counts).filter(([id, count]) => count > 1);

if (duplicates.length === 0) {
  console.log('\n✅ No duplicates found!');
} else {
  console.log(`\n❌ Found ${duplicates.length} duplicate IDs:`);
  duplicates.forEach(([id, count]) => {
    console.log(`  ID ${id}: appears ${count} times`);
  });
}
