import { Article } from '../data/mockData';

export interface FilterState {
  categories: string[];
  sources: string[];
  timeRange: string;
  themes: string[];
  minVertrouwensscore?: number;
  // Enhanced filters
  publishers?: string[];
  contentType?: string;
  citationRange?: { min: number; max: number };
  citationType?: string;
  mediaQuality?: number[];
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
        article.keyThemes.some(kt => kt.toLowerCase().includes(theme.toLowerCase())) || 
        article.tags.some(tag => tag.toLowerCase().includes(theme.toLowerCase()))
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

    // Enhanced filter: publishers
    if (filters.publishers && filters.publishers.length > 0) {
      if (!filters.publishers.includes(article.publisher)) {
        return false;
      }
    }

    // Enhanced filter: content type
    if (filters.contentType && filters.contentType !== 'all') {
      if (article.contentType !== filters.contentType) {
        return false;
      }
    }

    // Enhanced filter: citation range
    if (filters.citationRange) {
      const citations = article.citations || 0;
      if (citations < filters.citationRange.min || citations > filters.citationRange.max) {
        return false;
      }
    }

    // Enhanced filter: media quality
    if (filters.mediaQuality && filters.mediaQuality.length > 0) {
      if (!filters.mediaQuality.includes(article.mediaQuality)) {
        return false;
      }
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
    // Enhanced filters
    publishers: searchParams.get('publishers')?.split(',').filter(Boolean) || [],
    contentType: searchParams.get('contentType') || 'all',
    citationRange: searchParams.get('citationMin') || searchParams.get('citationMax') ? {
      min: searchParams.get('citationMin') ? parseInt(searchParams.get('citationMin')!) : 0,
      max: searchParams.get('citationMax') ? parseInt(searchParams.get('citationMax')!) : 200,
    } : undefined,
    citationType: searchParams.get('citationType') || 'all',
    mediaQuality: searchParams.get('mediaQuality')?.split(',').map(Number).filter(Boolean) || [],
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

  // Enhanced filters
  if (filters.publishers && filters.publishers.length > 0) {
    params.set('publishers', filters.publishers.join(','));
  }
  if (filters.contentType && filters.contentType !== 'all') {
    params.set('contentType', filters.contentType);
  }
  if (filters.citationRange) {
    if (filters.citationRange.min > 0) {
      params.set('citationMin', filters.citationRange.min.toString());
    }
    if (filters.citationRange.max < 200) {
      params.set('citationMax', filters.citationRange.max.toString());
    }
  }
  if (filters.citationType && filters.citationType !== 'all') {
    params.set('citationType', filters.citationType);
  }
  if (filters.mediaQuality && filters.mediaQuality.length > 0) {
    params.set('mediaQuality', filters.mediaQuality.join(','));
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

  // Enhanced filter labels
  if (filters.publishers && filters.publishers.length > 0) {
    filters.publishers.forEach(pub => labels.push(`Uitgever: ${pub}`));
  }

  if (filters.contentType && filters.contentType !== 'all') {
    const contentTypeLabels: Record<string, string> = {
      'cbs-data': 'CBS Data',
      'cbs-only': 'Alleen CBS',
      'nieuwsvergadering': 'Nieuwsvergadering',
    };
    labels.push(contentTypeLabels[filters.contentType] || filters.contentType);
  }

  if (filters.citationRange && (filters.citationRange.min > 0 || filters.citationRange.max < 200)) {
    labels.push(`Citaties: ${filters.citationRange.min}-${filters.citationRange.max}`);
  }

  if (filters.mediaQuality && filters.mediaQuality.length > 0) {
    const qualityLabels = filters.mediaQuality.map(q => {
      if (q === 0) return 'Geen sterren';
      return `${q} ${q === 1 ? 'ster' : 'sterren'}`;
    });
    qualityLabels.forEach(label => labels.push(`Kwaliteit: ${label}`));
  }
  
  return labels;
}