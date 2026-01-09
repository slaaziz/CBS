import { Article } from '../data/mockData';

export interface FilterState {
  categories: string[];
  sources: string[];
  timeRange: string;
  themes: string[];
  minVertrouwensscore?: number;
}

export function filterArticles(articles: Article[], filters: FilterState): Article[] {
  return articles.filter(article => {
    // Filter by categories
    if (filters.categories.length > 0 && !filters.categories.includes(article.category)) {
      return false;
    }

    // Filter by sources
    if (filters.sources.length > 0 && !filters.sources.includes(article.source)) {
      return false;
    }

    // Filter by themes (check if article has any of the selected themes in keyThemes or tags)
    if (filters.themes.length > 0) {
      const hasTheme = filters.themes.some(theme => 
        article.keyThemes.includes(theme) || article.tags.includes(theme.toLowerCase())
      );
      if (!hasTheme) {
        return false;
      }
    }

    // Filter by time range
    if (filters.timeRange !== 'all') {
      const articleDate = new Date(article.date);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (filters.timeRange) {
        case '24h':
          if (daysDiff > 1) return false;
          break;
        case '7d':
          if (daysDiff > 7) return false;
          break;
        case '30d':
          if (daysDiff > 30) return false;
          break;
        case '90d':
          if (daysDiff > 90) return false;
          break;
      }
    }

    // Filter by minimum vertrouwensscore
    if (filters.minVertrouwensscore !== undefined && article.vertrouwensscore < filters.minVertrouwensscore) {
      return false;
    }

    return true;
  });
}

export function parseFiltersFromURL(searchParams: URLSearchParams): FilterState {
  return {
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    sources: searchParams.get('sources')?.split(',').filter(Boolean) || [],
    timeRange: searchParams.get('timeRange') || 'all',
    themes: searchParams.get('themes')?.split(',').filter(Boolean) || [],
    minVertrouwensscore: searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : undefined,
  };
}

export function filtersToURLParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  
  if (filters.categories.length > 0) {
    params.set('categories', filters.categories.join(','));
  }
  if (filters.sources.length > 0) {
    params.set('sources', filters.sources.join(','));
  }
  if (filters.timeRange !== 'all') {
    params.set('timeRange', filters.timeRange);
  }
  if (filters.themes.length > 0) {
    params.set('themes', filters.themes.join(','));
  }
  if (filters.minVertrouwensscore !== undefined) {
    params.set('minScore', filters.minVertrouwensscore.toString());
  }
  
  return params;
}

export function getFilterLabels(filters: FilterState): string[] {
  const labels: string[] = [];
  
  filters.categories.forEach(cat => labels.push(cat));
  filters.sources.forEach(src => labels.push(src));
  filters.themes.forEach(theme => labels.push(theme));
  
  if (filters.timeRange !== 'all') {
    const timeLabels: Record<string, string> = {
      '24h': 'Laatste 24 uur',
      '7d': 'Laatste 7 dagen',
      '30d': 'Laatste 30 dagen',
      '90d': 'Laatste 90 dagen',
    };
    labels.push(timeLabels[filters.timeRange] || filters.timeRange);
  }
  
  if (filters.minVertrouwensscore !== undefined) {
    labels.push(`Vertrouwensscore ≥${filters.minVertrouwensscore}%`);
  }
  
  return labels;
}
