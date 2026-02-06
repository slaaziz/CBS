import { Article } from '../data/mockData';

/**
 * Utility functions for handling articles with multiple parent CBS articles
 */

export interface ParentArticle {
  cbsNumber: string;
  title?: string;
  content?: string;
  date?: string;
  link?: string;
}

/**
 * Extracts parent article information from an article, handling both single and multiple parents
 */
export function getParentArticles(article: Article): ParentArticle[] {
  const parents: ParentArticle[] = [];
  
  // Handle cbsNumber - can be string or array
  const cbsNumbers = Array.isArray(article.cbsNumber) 
    ? article.cbsNumber 
    : article.cbsNumber 
      ? [article.cbsNumber] 
      : [];
  
  // Handle parentTitle - can be string or array
  const parentTitles = Array.isArray(article.parentTitle)
    ? article.parentTitle
    : article.parentTitle
      ? [article.parentTitle]
      : [];
  
  // Handle parentContent - can be string or array  
  const parentContents = Array.isArray(article.parentContent)
    ? article.parentContent
    : article.parentContent
      ? [article.parentContent]
      : [];
  
  // Handle parentDate - can be string or array
  const parentDates = Array.isArray(article.parentDate)
    ? article.parentDate
    : article.parentDate
      ? [article.parentDate]
      : [];
  
  // Handle parentLink - can be string or array
  const parentLinks = Array.isArray(article.parentLink)
    ? article.parentLink
    : article.parentLink
      ? [article.parentLink]
      : [];
  
  // Create parent article objects
  cbsNumbers.forEach((cbsNumber, index) => {
    parents.push({
      cbsNumber,
      title: parentTitles[index] || undefined,
      content: parentContents[index] || undefined,
      date: parentDates[index] || undefined,
      link: parentLinks[index] || undefined,
    });
  });
  
  return parents;
}

/**
 * Get count of parent articles
 */
export function getParentCount(article: Article): number {
  if (Array.isArray(article.cbsNumber)) {
    return article.cbsNumber.length;
  }
  return article.cbsNumber ? 1 : 0;
}

/**
 * Check if article has multiple parents
 */
export function hasMultipleParents(article: Article): boolean {
  return getParentCount(article) > 1;
}

/**
 * Get primary (first) parent article
 */
export function getPrimaryParent(article: Article): ParentArticle | null {
  const parents = getParentArticles(article);
  return parents.length > 0 ? parents[0] : null;
}

/**
 * Format CBS numbers for display (handles single or multiple)
 */
export function formatCBSNumbers(cbsNumber?: string | string[]): string {
  if (!cbsNumber) return '';
  if (Array.isArray(cbsNumber)) {
    return cbsNumber.join(', ');
  }
  return cbsNumber;
}

/**
 * Format parent titles for display (shows first + count if multiple)
 */
export function formatParentTitles(parentTitle?: string | string[]): string {
  if (!parentTitle) return '';
  if (Array.isArray(parentTitle)) {
    if (parentTitle.length === 0) return '';
    if (parentTitle.length === 1) return parentTitle[0];
    return `${parentTitle[0]} (+${parentTitle.length - 1} meer)`;
  }
  return parentTitle;
}