# CSV Import Instructions for Insight Navigator

## Overview

The application has been updated to support loading real data from your CSV file. This document explains how to convert your CSV data into the format required by the application.

## CSV Column Mapping

Your CSV file should have these columns (exact names):

| CSV Column | Article Field | Description |
|------------|---------------|-------------|
| `child_id` | `id` | Unique article identifier |
| `parent_id` | `cbsNumber` | CBS reference number (e.g., "CBS-2024-1847") |
| `match` | `contentType` | 1 = 'cbs-data', 0 = 'all' |
| `%` | `vertrouwensscore` | Trust score (0-100) |
| `title_child` | `title` | Article title |
| `content_child` | `body` | Full article text |
| `content_child` | `snippet` | First 200 characters of content |
| `publish_date_child` | `date` | Publication date (will be formatted as YYYY-MM-DD) |
| `datasource_title_child` | `source` | Source/publication name |
| `publisher_string_child` | `publisher` | Publisher name |
| `tags_string_child` | `tags` | Comma-separated tags |
| `themes_string_child` | `keyThemes` | Comma-separated themes |
| `taxonomies_string_child` | `category` | Comma-separated categories (first will be used) |
| `media_value_child` | `mediaQuality` | 1=highest, 2=medium, 3=low, null=other (0) |
| `word_count_child` | `wordCount` | Word count |
| `related_parents_string_child` | `relatedArticles` | Comma-separated related article IDs |
| `title_parent` | `parentTitle` | CBS article title (optional) |
| `content_parent` | `parentContent` | CBS article content (optional) |
| `publish_date_parent` | `parentDate` | CBS publication date (optional) |

## Changes Made to Data Structure

### 1. Updated Article Interface

**Removed:**
- `sentiment` field (no longer used)

**Added:**
- `wordCount: number` - Word count from CSV
- `parentTitle?: string` - CBS article title
- `parentContent?: string` - CBS article content  
- `parentDate?: string` - CBS publication date

### 2. Updated Components

- **ArticlePage**: Removed sentiment analysis section, now displays word count
- **FilterSelectionPage**: Fixed bug - now correctly navigates to search results when filters are applied

## How to Import Your CSV Data

### Option 1: Using the CSV Parser Utility (Recommended)

A CSV parser utility has been created at `/utils/csvParser.ts`. Here's how to use it:

#### Step 1: Create a Temporary Component to Parse CSV

Create a file `/components/CSVImporter.tsx`:

```typescript
import { useState } from 'react';
import { parseCSVToArticles } from '../utils/csvParser';

export function CSVImporter() {
  const [output, setOutput] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const articles = parseCSVToArticles(csvText);
      
      // Convert to formatted JSON
      const formatted = JSON.stringify(articles, null, 2);
      setOutput(formatted);
      
      console.log('Parsed Articles:', articles);
      console.log('Total:', articles.length);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">CSV Importer</h1>
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileUpload}
        className="mb-4"
      />
      {output && (
        <div>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="mb-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Copy to Clipboard
          </button>
          <pre className="bg-gray-100 p-4 overflow-auto max-h-96 text-xs">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
```

#### Step 2: Temporarily Add to App.tsx

```typescript
import { CSVImporter } from './components/CSVImporter';

// In your routes, add:
<Route path="/csv-import" element={<CSVImporter />} />
```

#### Step 3: Use the Importer

1. Navigate to `/csv-import` in your app
2. Upload your CSV file
3. Click "Copy to Clipboard" to copy the parsed articles
4. Open `/data/mockData.ts`
5. Replace the `mockArticles` array with the copied data:

```typescript
export const mockArticles: Article[] = [
  // Paste your copied data here
];
```

#### Step 4: Clean Up

Remove the CSVImporter component and route after importing.

### Option 2: Manual Conversion

If you prefer to convert data manually or via a script:

1. Read your CSV file
2. For each row, create an Article object following this template:

```typescript
{
  id: String(row.child_id),
  title: row.title_child,
  snippet: row.content_child.substring(0, 200),
  date: formatAsYYYYMMDD(row.publish_date_child),
  source: row.datasource_title_child,
  category: row.taxonomies_string_child.split(',')[0],
  vertrouwensscore: Number(row['%']),
  body: row.content_child,
  tags: row.tags_string_child.split(',').map(t => t.trim()),
  keyThemes: row.themes_string_child.split(',').map(t => t.trim()),
  publisher: row.publisher_string_child,
  citations: 0, // Not in CSV, set to 0
  mediaQuality: mapMediaValue(row.media_value_child), // 1→1, 2→2, 3→3, null→0
  contentType: row.match === 1 ? 'cbs-data' : 'all',
  cbsNumber: row.parent_id,
  relatedArticles: row.related_parents_string_child.split(',').map(id => id.trim()),
  wordCount: Number(row.word_count_child),
  parentTitle: row.title_parent || undefined,
  parentContent: row.content_parent || undefined,
  parentDate: row.publish_date_parent ? formatAsYYYYMMDD(row.publish_date_parent) : undefined,
}
```

## Date Formatting

Dates should be formatted as `YYYY-MM-DD`. Example: `2024-12-15`

The CSV parser includes a date formatting function that handles various input formats.

## Notes

- **citations**: Not available in your CSV, so it's set to 0 for all articles
- **Empty strings**: The parser handles empty strings and converts them to empty arrays or undefined as appropriate
- **Comma-separated values**: Tags, themes, taxonomies, and related articles are split by commas and trimmed

## Testing After Import

After importing your CSV data:

1. ✅ Check the homepage dashboard shows correct statistics
2. ✅ Search and filter articles
3. ✅ View individual article pages
4. ✅ Verify trust scores display correctly with color coding
5. ✅ Check that related articles link properly
6. ✅ Test the network graph visualization

## Troubleshooting

### Problem: Dates not displaying correctly
- **Solution**: Ensure dates in CSV are in a parseable format (YYYY-MM-DD, DD/MM/YYYY, etc.)

### Problem: Tags/Themes showing as single string
- **Solution**: Verify CSV columns use commas as separators

### Problem: Trust scores showing wrong colors
- **Solution**: Verify the `%` column contains numbers 0-100

### Problem: Articles not linking correctly
- **Solution**: Check that `related_parents_string_child` contains valid article IDs

## Support

For issues or questions about CSV import, refer to:
- `/utils/csvParser.ts` - Parser implementation
- `/data/mockData.ts` - Article interface definition
- This document

---

**Last Updated**: January 2026
