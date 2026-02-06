import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { ArticleCard } from './ArticleCard';
import { FilterSelectionPage } from './FilterSelectionPage';
import { PaginationAdvanced } from './PaginationAdvanced';
import { EnhancedSortDropdown } from './EnhancedSortDropdown';
import { SlidersHorizontal, X, Home } from 'lucide-react';
import { mockArticles } from '../data/mockData';
import { filterArticles, parseFiltersFromURL, getFilterLabels, filtersToURLParams } from '../utils/filterUtils';
import { categorizeArticles } from '../utils/categorizeArticle';

export function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date-desc');
  const itemsPerPage = 20;
  
  // Categorize articles on load
  const categorizedArticles = useMemo(() => categorizeArticles(mockArticles), []);
  
  // Check if filter panel should be shown
  const showFilterPanel = searchParams.get('showFilters') === 'true';
  
  // Get current filters
  const currentFilters = parseFiltersFromURL(searchParams);
  const activeFilterLabels = getFilterLabels(currentFilters);
  
  // Apply filters and search
  const filteredArticles = useMemo(() => {
    let results = filterArticles(categorizedArticles, currentFilters);
    
    // Apply search query if exists
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(article => 
        article.title.toLowerCase().includes(lowerQuery) ||
        (article.snippet && article.snippet.toLowerCase().includes(lowerQuery)) ||
        article.body.toLowerCase().includes(lowerQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'trust-desc':
          return b.vertrouwensscore - a.vertrouwensscore;
        case 'trust-asc':
          return a.vertrouwensscore - b.vertrouwensscore;
        case 'citations-desc':
          return (b.citations || 0) - (a.citations || 0);
        case 'publisher-asc':
          return a.publisher.localeCompare(b.publisher);
        case 'quality-desc':
          return b.mediaQuality - a.mediaQuality;
        case 'wordcount-desc':
          return b.wordCount - a.wordCount;
        case 'relevance':
        default:
          return b.vertrouwensscore - a.vertrouwensscore;
      }
    });
    
    return results;
  }, [query, currentFilters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeFilter = (label: string) => {
    const newFilters = { ...currentFilters };
    
    newFilters.categories = newFilters.categories.filter(c => c !== label);
    newFilters.sources = newFilters.sources.filter(s => s !== label);
    newFilters.themes = newFilters.themes.filter(t => t !== label);
    
    if (label.startsWith('Laatste')) {
      newFilters.timeRange = 'all';
    }
    
    if (label.startsWith('Vertrouwensscore')) {
      newFilters.minVertrouwensscore = undefined;
    }

    // Handle enhanced filter removals
    if (label.startsWith('Uitgever:')) {
      const publisher = label.replace('Uitgever: ', '');
      newFilters.publishers = (newFilters.publishers || []).filter(p => p !== publisher);
    }

    if (label === 'CBS Data' || label === 'Alleen CBS' || label === 'Nieuwsvergadering') {
      newFilters.contentType = 'all';
    }

    if (label.startsWith('Citaties:')) {
      newFilters.citationRange = undefined;
    }

    if (label.startsWith('Kwaliteit:')) {
      const qualityText = label.replace('Kwaliteit: ', '');
      if (qualityText === 'Geen sterren') {
        newFilters.mediaQuality = (newFilters.mediaQuality || []).filter(q => q !== 0);
      } else {
        const stars = parseInt(qualityText);
        newFilters.mediaQuality = (newFilters.mediaQuality || []).filter(q => q !== stars);
      }
    }
    
    const urlParams = filtersToURLParams(newFilters);
    if (query) {
      urlParams.set('q', query);
    }
    navigate(`/search?${urlParams}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header initialQuery={query} />
      
      <main className="flex-1 mx-auto px-20 py-12 w-full max-w-screen-2xl">
        <div className="mb-8">
          <h1 className="text-[#1C3664] mb-2">
            {query ? `Zoekresultaten voor "${query}"` : 'Alle Artikelen'}
          </h1>
          <p className="text-gray-600">{filteredArticles.length} resultaten gevonden</p>
        </div>

        {/* Active Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            {activeFilterLabels.length > 0 ? (
              <>
                {activeFilterLabels.map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E6F5FC] text-[#1C3664] rounded-lg border border-[#0097DB]"
                  >
                    <span>{label}</span>
                    <button
                      onClick={() => removeFilter(label)}
                      className="hover:bg-[#CCE9F7] rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => navigate(query ? `/search?q=${query}` : '/search')}
                  className="text-sm text-gray-500 hover:text-[#1C3664] transition-colors"
                >
                  Wis alle filters
                </button>
              </>
            ) : (
              <span className="text-gray-500 text-sm">Geen actieve filters</span>
            )}
          </div>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('showFilters', 'true');
              navigate(`/search?${params.toString()}`);
            }}
            className="flex items-center gap-2 px-6 h-10 border border-[#1C3664] text-[#1C3664] rounded-lg hover:bg-[#F5F5F5] transition-colors flex-shrink-0 ml-4"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Results */}
          <div className="col-span-12">
            {/* Sort Dropdown */}
            {filteredArticles.length > 0 && (
              <div className="flex justify-end mb-4">
                <EnhancedSortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {filteredArticles.length > 0 ? (
                <>
                  <table className="w-full">
                    <thead className="bg-[#F5F5F5] border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-[#1C3664] w-32">
                          Datum
                        </th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-[#1C3664]">
                          Artikel
                        </th>
                        <th className="py-3 px-6 text-right text-sm font-semibold text-[#1C3664] w-48">
                          Vertrouwensscore
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedArticles.map((article, index) => (
                        <ArticleCard key={`${article.id}-${index}`} article={article} />
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <PaginationAdvanced
                      currentPage={currentPage}
                      totalPages={totalPages}
                      itemsPerPage={itemsPerPage}
                      totalItems={filteredArticles.length}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <p className="text-lg mb-2">Geen artikelen gevonden</p>
                  <p className="text-sm">Probeer andere zoektermen of pas uw filters aan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Filter Panel Overlay */}
      {showFilterPanel && <FilterSelectionPage />}
    </div>
  );
}