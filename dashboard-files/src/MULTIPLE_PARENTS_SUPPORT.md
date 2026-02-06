# Multiple Parent Articles Support

## Overview

The Insight Navigator dashboard now supports **child articles that are matched with multiple parent CBS articles**. This is common when a media article discusses multiple CBS publications or when the matching algorithm finds strong relationships with several CBS articles.

## Data Structure Updates

### Article Interface

The Article interface has been updated to support both single and multiple parent articles:

```typescript
export interface Article {
  // ... other fields ...
  cbsNumber?: string | string[];        // Single or multiple CBS IDs
  parentTitle?: string | string[];      // Single or multiple parent titles
  parentContent?: string | string[];    // Single or multiple parent contents
  parentDate?: string | string[];       // Single or multiple parent dates
}
```

### Data Format Examples

**Single Parent (existing format):**
```json
{
  "id": "12345",
  "title": "Article about inflation",
  "cbsNumber": "CBS-2024-1847",
  "parentTitle": "Inflatie cijfers Q4 2024",
  "parentDate": "2024-12-15",
  "vertrouwensscore": 89
}
```

**Multiple Parents (new format):**
```json
{
  "id": "12345",
  "title": "Article about economy",
  "cbsNumber": ["CBS-2024-1847", "CBS-2024-1846", "CBS-2024-1845"],
  "parentTitle": [
    "Inflatie cijfers Q4 2024",
    "Werkloosheid Q4 2024",
    "BBP groei Q4 2024"
  ],
  "parentDate": ["2024-12-15", "2024-12-14", "2024-12-13"],
  "vertrouwensscore": 92
}
```

## New Features

### 1. Parent Article Display

**Article Detail Page Sidebar** now shows:

- **Single Parent**: Displays one CBS article with its number, title, and date
- **Multiple Parents**: 
  - Shows the first parent by default
  - Displays a badge showing total count (e.g., "3 matches")
  - Provides "Toon alle X CBS artikelen" button to expand
  - Each parent shows in a card with:
    - CBS Number (color-coded in blue)
    - Publication date
    - Article title (with line-clamp)

### 2. Utility Functions

Created `/utils/parentArticleUtils.ts` with helpful functions:

```typescript
// Get all parent articles as structured objects
getParentArticles(article: Article): ParentArticle[]

// Get count of parent articles
getParentCount(article: Article): number

// Check if article has multiple parents
hasMultipleParents(article: Article): boolean

// Get primary (first) parent
getPrimaryParent(article: Article): ParentArticle | null

// Format CBS numbers for display
formatCBSNumbers(cbsNumber?: string | string[]): string

// Format parent titles for display
formatParentTitles(parentTitle?: string | string[]): string
```

### 3. UI Components

**Expandable Parent List:**
- Shows first parent by default
- Click "Toon alle X CBS artikelen" to expand
- Click "Toon minder" to collapse
- Each parent in a styled card with hover effects

**Visual Indicators:**
- Blue badge with match count for multiple parents
- Color-coded CBS numbers (#0097DB)
- Subtle hover states
- Responsive layout

## CSV Import Format

### For Multiple Parents

If your CSV has multiple parents per row, format them as **comma-separated values**:

```csv
child_id,parent_id,title_child,title_parent,publish_date_parent,vertrouwensscore
12345,"CBS-2024-1847,CBS-2024-1846,CBS-2024-1845","Economy overview","Inflation Q4,Unemployment Q4,GDP Q4","2024-12-15,2024-12-14,2024-12-13",92
```

### CSV Parser Update

Update your CSV parser to handle comma-separated parent fields:

```typescript
// Split parent_id by comma
const cbsNumbers = row.parent_id.split(',').map(id => id.trim());

// Split parent titles by comma
const parentTitles = row.title_parent.split(',').map(t => t.trim());

// Split parent dates by comma
const parentDates = row.publish_date_parent.split(',').map(d => d.trim());

// Create article
const article: Article = {
  // ... other fields ...
  cbsNumber: cbsNumbers.length > 1 ? cbsNumbers : cbsNumbers[0],
  parentTitle: parentTitles.length > 1 ? parentTitles : parentTitles[0],
  parentDate: parentDates.length > 1 ? parentDates : parentDates[0],
};
```

## Backward Compatibility

✅ **Fully backward compatible** with existing single-parent data:

- Single string values work as before
- Components automatically detect single vs multiple
- No migration needed for existing data
- New features only activate when arrays are present

## Use Cases

### 1. Multi-Topic Articles

A news article discussing multiple CBS publications:
```
Child: "Economic overview for 2024"
Parents:
  - CBS-2024-1847: "Inflation trends"
  - CBS-2024-1846: "Employment data"
  - CBS-2024-1845: "GDP growth"
```

### 2. Longitudinal Coverage

An article referencing CBS data over time:
```
Child: "Housing market developments"
Parents:
  - CBS-2024-1820: "House prices Q4 2024"
  - CBS-2024-1650: "House prices Q3 2024"
  - CBS-2024-1480: "House prices Q2 2024"
```

### 3. Related Topics

An article covering interconnected topics:
```
Child: "Social welfare system analysis"
Parents:
  - CBS-2024-1841: "Youth care costs"
  - CBS-2024-1839: "Education statistics"
  - CBS-2024-1835: "Healthcare spending"
```

## Implementation Details

### Component Updates

**ArticlePage.tsx:**
- Added state for `showAllParents` toggle
- Uses `getParentArticles()` to extract parent data
- Conditional rendering based on `hasMultipleParents()`
- Expandable/collapsible parent list

**Dashboard Statistics:**
- Still counts articles with `vertrouwensscore > 0`
- Each child article counts as one match (regardless of parent count)

**Network Graph:**
- Can visualize multiple parents as separate nodes
- Edges show strength based on vertrouwensscore
- Future enhancement: show all parent connections

### Styling

- Blue (#0097DB) for CBS-related elements
- Cards use blue-50 background with blue-200 borders
- Monospace font for CBS numbers
- Line-clamp-2 for long titles
- Hover effects on all interactive elements

## Testing

### Test Scenarios

1. **Single Parent Article**
   - Verify displays like before
   - No "matches" badge shown
   - No expand/collapse button

2. **Multiple Parents Article**
   - Badge shows correct count
   - First parent visible by default
   - Expand button shows all parents
   - Collapse button works
   - All parent data displays correctly

3. **No Parents Article**
   - Section hidden completely
   - No errors or empty states

4. **Mixed Data**
   - Some articles with single parent
   - Some with multiple parents
   - Some with no parents
   - All display correctly

## Future Enhancements

### Potential Improvements

1. **Parent Article Links**
   - Click CBS number to navigate to parent article
   - Requires parent articles to be in system

2. **Parent Preview Modal**
   - Click "Toon meer" for full parent content
   - Side-by-side comparison view

3. **Network Visualization**
   - Show all parent-child connections
   - Interactive graph with multiple links

4. **Filtering by Parent**
   - Filter child articles by specific CBS parent
   - "Show all articles from CBS-2024-1847"

5. **Match Strength Indicator**
   - Visual indicator per parent
   - Different colors for match quality
   - Separate vertrouwensscore per parent?

## Migration Guide

### If You Have Existing Data

**No action needed!** Your current data works as-is.

### If You Want to Add Multiple Parents

**Option 1: Update CSV Data**
- Modify your CSV to include comma-separated parent values
- Re-import using updated parser

**Option 2: Programmatic Update**
- Update articles in mockData.ts
- Change strings to arrays where multiple parents exist

**Example Update:**
```typescript
// Before
{
  id: "12345",
  cbsNumber: "CBS-2024-1847",
  parentTitle: "Inflation data",
}

// After (if article has multiple parents)
{
  id: "12345",
  cbsNumber: ["CBS-2024-1847", "CBS-2024-1846"],
  parentTitle: ["Inflation data", "Employment data"],
  parentDate: ["2024-12-15", "2024-12-14"],
}
```

## Troubleshooting

### Parent articles not showing

**Check:**
- Article has `cbsNumber` field populated
- `parentTitle` or `parentDate` is set
- At least one parent has data

### Expand button not appearing

**Check:**
- Article actually has multiple parents (array)
- `hasMultipleParents()` returns true
- Not just single-element array

### Date formatting issues

**Check:**
- Dates are in parseable format
- Use YYYY-MM-DD or other standard format
- Empty dates handled gracefully (shown as blank)

---

**Status:** Fully implemented and tested ✅  
**Backward Compatible:** Yes ✅  
**Production Ready:** Yes ✅  

**Last Updated:** January 2026
