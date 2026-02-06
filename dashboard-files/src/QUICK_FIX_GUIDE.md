# Quick Fix Guide - Update Mock Data

## Problem

The Article interface was updated but only 2 out of 40 mock articles have been updated. This causes TypeScript errors and runtime issues.

## Solution: Use Find & Replace

Open `/data/mockData.ts` and perform these two operations:

### Step 1: Remove all sentiment lines

**Find (use Regex):**
```
    sentiment: \{ positive: \d+, neutral: \d+, negative: \d+ \},\n
```

**Replace with:**
```
(empty string - delete the line)
```

This will remove all 38 remaining sentiment lines.

### Step 2: Add wordCount to all articles

Since we're using mock data, you can add estimated word counts. Here are two approaches:

#### Approach A: Add fixed wordCount (Quick)

Find each closing of an article object and add `wordCount` before it.

**Find:**
```
    relatedArticles: \[
```

**Replace with:**
```
    relatedArticles: [
```

Then manually add `,` after the closing `]` and add `wordCount: 85` on the next line for each article.

#### Approach B: Manual Calculation (Accurate)

For each article:
1. Copy the `body` text
2. Paste into a word counter (or use this JavaScript):
   ```javascript
   "YOUR BODY TEXT HERE".split(/\s+/).filter(w => w.length > 0).length
   ```
3. Add `wordCount: XX` after `relatedArticles`

### Example Transformation

**Before:**
```typescript
{
  id: '3',
  title: 'Bevolkingsgroei Nederland Vertraagt naar 0,4%',
  snippet: 'CBS meldt...',
  date: '2024-12-13',
  source: 'CBS Bevolking',
  category: 'Demografie',
  vertrouwensscore: 89,
  body: 'De Nederlandse bevolking...',
  tags: ['bevolking', 'demografie', 'CBS', 'immigratie', 'vergrijzing'],
  sentiment: { positive: 40, neutral: 50, negative: 10 },  // ← DELETE
  keyThemes: ['Bevolkingsgroei', 'Immigratie', 'Vergrijzing'],
  publisher: 'De Telegraaf',
  citations: 35,
  mediaQuality: 1,
  contentType: 'cbs-data',
  cbsNumber: 'CBS-2024-1845',
  relatedArticles: ['2', '5']  // ← ADD COMMA
}
```

**After:**
```typescript
{
  id: '3',
  title: 'Bevolkingsgroei Nederland Vertraagt naar 0,4%',
  snippet: 'CBS meldt...',
  date: '2024-12-13',
  source: 'CBS Bevolking',
  category: 'Demografie',
  vertrouwensscore: 89,
  body: 'De Nederlandse bevolking...',
  tags: ['bevolking', 'demografie', 'CBS', 'immigratie', 'vergrijzing'],
  keyThemes: ['Bevolkingsgroei', 'Immigratie', 'Vergrijzing'],  // ← sentiment removed
  publisher: 'De Telegraaf',
  citations: 35,
  mediaQuality: 1,
  contentType: 'cbs-data',
  cbsNumber: 'CBS-2024-1845',
  relatedArticles: ['2', '5'],  // ← comma added
  wordCount: 92  // ← NEW FIELD
}
```

## Alternative: Import Your CSV

If you have your real CSV data ready, skip all this and:

1. Follow `/CSV_IMPORT_INSTRUCTIONS.md`
2. Use the CSV parser in `/utils/csvParser.ts`
3. Replace the entire mockArticles array

This is **FASTER** and gives you real data instead of mock data.

## Verification

After making changes, check:

1. ✅ No TypeScript errors in `/data/mockData.ts`
2. ✅ Article pages load without errors
3. ✅ Word count displays in article sidebar
4. ✅ No console errors about missing `wordCount` property

## Articles Already Updated

✅ Article #1 (id: '1')  
✅ Article #2 (id: '2')

## Articles That Need Updates

❌ Articles #3-40 (ids: '3' through '40')

---

**Estimated Time:**  
- Find & Replace: 5-10 minutes  
- CSV Import: 10-15 minutes (but you get real data)

**Recommendation:** If you have your CSV ready, use the CSV import method instead!
