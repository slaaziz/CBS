/**
 * Script to fix mockData.ts
 * This removes sentiment fields and adds wordCount to all articles
 * 
 * Run this with Node.js:
 * node scripts/fixMockData.js
 */

const fs = require('fs');
const path = require('path');

// Read the mockData.ts file
const filePath = path.join(__dirname, '../data/mockData.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Function to estimate word count from text
function estimateWordCount(text) {
  // Extract the body text and count words
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

// Remove all sentiment lines
// Pattern: one or more spaces + sentiment: { positive: X, neutral: Y, negative: Z },
content = content.replace(/\s+sentiment: \{ positive: \d+, neutral: \d+, negative: \d+ \},\n/g, '\n');

// Now we need to add wordCount before the closing brace of each article
// This is trickier - we'll add it after relatedArticles or cbsNumber

// Pattern 1: After relatedArticles
content = content.replace(/(relatedArticles: \[.*?\])\n(\s+)\}/g, (match, p1, p2) => {
  // Estimate word count - for now just use a random reasonable number
  // In real scenario, you'd parse the body field
  const wordCount = Math.floor(Math.random() * 200) + 50; // 50-250 words
  return `${p1},\n${p2}wordCount: ${wordCount}\n${p2}}`;
});

// Pattern 2: After cbsNumber (when relatedArticles not present)
content = content.replace(/(cbsNumber: '[^']+')(\n\s+)\}/g, (match, p1, p2) => {
  const wordCount = Math.floor(Math.random() * 200) + 50;
  return `${p1},${p2}wordCount: ${wordCount}${p2}}`;
});

// Write back
fs.writeFileSync(filePath, content, 'utf-8');

console.log('✅ mockData.ts has been updated!');
console.log('- Removed all sentiment fields');
console.log('- Added wordCount to all articles');
