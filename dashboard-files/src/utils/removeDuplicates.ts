/**
 * Utility to remove duplicate articles from mockData
 * Duplicates are identified by ID - keeps the first occurrence
 */

import { mockArticles, Article } from '../data/mockData';

export function removeDuplicateArticles(): Article[] {
  const seen = new Set<string>();
  const unique: Article[] = [];
  const duplicates: { id: string; title: string }[] = [];

  mockArticles.forEach((article) => {
    if (seen.has(article.id)) {
      duplicates.push({ id: article.id, title: article.title });
    } else {
      seen.add(article.id);
      unique.push(article);
    }
  });

  console.log(`Total articles: ${mockArticles.length}`);
  console.log(`Duplicates found: ${duplicates.length}`);
  if (duplicates.length > 0) {
    console.log('Duplicate IDs:');
    duplicates.forEach(d => console.log(`  - ${d.id}: ${d.title}`));
  }
  console.log(`Unique articles: ${unique.length}`);

  return unique;
}

// For easy console use
export function generateDeduplicatedData() {
  const unique = removeDuplicateArticles();
  return JSON.stringify(unique, null, 2);
}
