#!/usr/bin/env python3
import re
import json
from collections import defaultdict

# Read the mockData.ts file
with open('data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all article IDs using regex
id_pattern = r'"id":\s*"(\d+)"'
matches = re.findall(id_pattern, content)

print(f"Total articles found: {len(matches)}")

# Count occurrences of each ID
id_counts = defaultdict(list)
for idx, article_id in enumerate(matches):
    id_counts[article_id].append(idx)

# Find duplicates
duplicates = {k: v for k, v in id_counts.items() if len(v) > 1}

if not duplicates:
    print("\n✅ No duplicate IDs found!")
else:
    print(f"\n⚠️  Found {len(duplicates)} duplicate IDs:\n")
    for article_id, positions in sorted(duplicates.items()):
        print(f"ID: {article_id} appears {len(positions)} times at positions: {positions}")
    
    print(f"\nTotal duplicate articles: {sum(len(v) - 1 for v in duplicates.values())}")
