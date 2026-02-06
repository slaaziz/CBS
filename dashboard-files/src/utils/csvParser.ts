import { Article } from '../data/mockData';

/**
 * CSV Column Mapping:
 * - child_id → id
 * - parent_id → cbsNumber (e.g., "CBS-2024-1847")
 * - match → contentType (1='cbs-data', 0='all')
 * - % → vertrouwensscore (0-100)
 * - title_child → title
 * - content_child → body & snippet (first 200 chars)
 * - publish_date_child → date (YYYY-MM-DD)
 * - datasource_title_child → source
 * - publisher_string_child → publisher
 * - tags_string_child → tags (split by comma)
 * - themes_string_child → keyThemes (split by comma)
 * - taxonomies_string_child → category (first item)
 * - media_value_child → mediaQuality (1→1, 2→2, 3→3, null→0)
 * - word_count_child → wordCount
 * - related_parents_string_child → relatedArticles (split by comma)
 * - title_parent → parentTitle
 * - content_parent → parentContent
 * - publish_date_parent → parentDate (YYYY-MM-DD)
 */

interface CSVRow {
  child_id: string;
  parent_id: string;
  match: string | number;
  '%': string | number;
  title_child: string;
  content_child: string;
  publish_date_child: string;
  datasource_title_child: string;
  publisher_string_child: string;
  tags_string_child: string;
  themes_string_child: string;
  taxonomies_string_child: string;
  media_value_child: string | number | null;
  word_count_child: string | number;
  related_parents_string_child: string;
  title_parent: string;
  content_parent: string;
  publish_date_parent: string;
}

/**
 * Converts a CSV row object to an Article object
 */
export function parseCSVRowToArticle(row: CSVRow): Article {
  // Helper function to split comma-separated strings
  const splitAndClean = (str: string): string[] => {
    if (!str || str.trim() === '') return [];
    return str.split(',').map(item => item.trim()).filter(item => item !== '');
  };

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    // Assumes input is already in a parseable format
    try {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateStr; // Return as-is if parsing fails
    }
  };

  // Create snippet from first 200 characters of content
  const snippet = row.content_child
    ? row.content_child.substring(0, 200).trim()
    : '';

  // Map media_value_child to mediaQuality
  const mediaQuality = (): 0 | 1 | 2 | 3 => {
    const val = row.media_value_child;
    if (val === null || val === '' || val === undefined) return 0;
    const num = Number(val);
    if (num === 1) return 1;
    if (num === 2) return 2;
    if (num === 3) return 3;
    return 0;
  };

  // Map match to contentType
  const contentType = Number(row.match) === 1 ? 'cbs-data' : 'all';

  // Get first category from taxonomies
  const taxonomies = splitAndClean(row.taxonomies_string_child);
  const category = taxonomies.length > 0 ? taxonomies[0] : 'Overig';

  // Format parent_id as CBS number
  const cbsNumber = row.parent_id || undefined;

  return {
    id: String(row.child_id),
    title: row.title_child || '',
    snippet: snippet,
    date: formatDate(row.publish_date_child),
    source: row.datasource_title_child || '',
    category: category,
    vertrouwensscore: Number(row['%']) || 0,
    body: row.content_child || '',
    tags: splitAndClean(row.tags_string_child),
    keyThemes: splitAndClean(row.themes_string_child),
    publisher: row.publisher_string_child || '',
    citations: 0, // Not available in CSV, set to 0
    mediaQuality: mediaQuality(),
    contentType: contentType as 'all' | 'cbs-data',
    cbsNumber: cbsNumber,
    relatedArticles: splitAndClean(row.related_parents_string_child),
    wordCount: Number(row.word_count_child) || 0,
    parentTitle: row.title_parent || undefined,
    parentContent: row.content_parent || undefined,
    parentDate: row.publish_date_parent ? formatDate(row.publish_date_parent) : undefined,
  };
}

/**
 * Parses CSV text into Article array
 * 
 * Usage:
 * 1. Upload your CSV file
 * 2. Read it as text
 * 3. Call parseCSVToArticles(csvText)
 * 4. Replace mockArticles in mockData.ts with the result
 */
export function parseCSVToArticles(csvText: string): Article[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse header row
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  // Parse data rows
  const articles: Article[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Simple CSV parsing (doesn't handle quoted commas - use a library for production)
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    
    // Create row object
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    try {
      const article = parseCSVRowToArticle(row as CSVRow);
      articles.push(article);
    } catch (error) {
      console.error(`Error parsing row ${i}:`, error);
    }
  }

  return articles;
}

/**
 * Example usage:
 * 
 * // In a component or script:
 * const csvText = `... your CSV data ...`;
 * const articles = parseCSVToArticles(csvText);
 * console.log('Parsed articles:', articles);
 * 
 * // Then manually update /data/mockData.ts:
 * // export const mockArticles: Article[] = [... paste the output ...];
 */
