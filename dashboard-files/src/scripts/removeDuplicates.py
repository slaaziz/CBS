#!/usr/bin/env python3
import json
import re

# Read the mockData.ts file
with open('data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start and end of the articles array
articles_start = content.find('export const mockArticles: Article[] = [')
if articles_start == -1:
    print("Could not find mockArticles array")
    exit(1)

# Find the end of the array (looking for the closing ];)
array_content_start = articles_start + len('export const mockArticles: Article[] = ')
array_end = content.find('];', array_content_start)
if array_end == -1:
    print("Could not find end of mockArticles array")
    exit(1)

# Extract parts
before_articles = content[:array_content_start]
articles_json_str = content[array_content_start:array_end + 1]
after_articles = content[array_end + 2:]

# Parse the JSON array
try:
    articles = json.loads(articles_json_str)
except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")
    exit(1)

print(f"Total articles before deduplication: {len(articles)}")

# Track duplicates
seen_ids = {}
duplicates = []
unique_articles = []

for idx, article in enumerate(articles):
    article_id = article.get('id')
    if article_id in seen_ids:
        duplicates.append({
            'id': article_id,
            'title': article.get('title', 'No title'),
            'index': idx,
            'first_seen': seen_ids[article_id]
        })
        print(f"  Duplicate found: ID {article_id} at index {idx} (first seen at index {seen_ids[article_id]})")
    else:
        seen_ids[article_id] = idx
        unique_articles.append(article)

print(f"\nFound {len(duplicates)} duplicate articles")
print(f"Unique articles: {len(unique_articles)}")

# Write back the deduplicated data
new_articles_json = json.dumps(unique_articles, indent=2, ensure_ascii=False)
new_content = before_articles + new_articles_json + ';\n\n' + after_articles

with open('data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n✓ Duplicates removed successfully!")
print(f"  Before: {len(articles)} articles")
print(f"  After: {len(unique_articles)} articles")
print(f"  Removed: {len(duplicates)} duplicates")
