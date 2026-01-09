import { useNavigate, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { parseFiltersFromURL, getFilterLabels, filtersToURLParams } from '../utils/filterUtils';

export function FilterSidebar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get current filters from URL
  const currentFilters = parseFiltersFromURL(searchParams);
  const activeFilterLabels = getFilterLabels(currentFilters);
  
  const removeFilter = (label: string) => {
    // This is a simplified version - you might want to make this more robust
    const newFilters = { ...currentFilters };
    
    // Remove from categories
    newFilters.categories = newFilters.categories.filter(c => c !== label);
    // Remove from sources
    newFilters.sources = newFilters.sources.filter(s => s !== label);
    // Remove from themes
    newFilters.themes = newFilters.themes.filter(t => t !== label);
    
    // Handle time range
    if (label.startsWith('Laatste')) {
      newFilters.timeRange = 'all';
    }
    
    // Handle vertrouwensscore
    if (label.startsWith('Vertrouwensscore')) {
      newFilters.minVertrouwensscore = undefined;
    }
    
    const urlParams = filtersToURLParams(newFilters);
    navigate(`/?${urlParams}`);
  };
  
  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg p-6 sticky top-6 h-fit">
      <h2 className="text-[#1C3664] mb-6">Filters</h2>
      
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.set('showFilters', 'true');
          navigate(`/?${params.toString()}`);
        }}
        className="w-full h-12 bg-[#0097DB] hover:bg-[#007AB8] text-white rounded-lg transition-colors flex items-center justify-center gap-2 mb-6"
      >
        <SlidersHorizontal className="w-5 h-5" />
        Open Filter Selector
      </button>

      {activeFilterLabels.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[#1C3664] mb-3">Actieve Filters:</div>
            {activeFilterLabels.length > 0 && (
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-500 hover:text-[#1C3664] transition-colors"
              >
                Wis alles
              </button>
            )}
          </div>
          {activeFilterLabels.map((label, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2 bg-[#F5F5F5] text-[#1C3664] rounded-lg border border-gray-300"
            >
              <span className="text-sm">{label}</span>
              <button
                onClick={() => removeFilter(label)}
                className="ml-2 hover:bg-gray-200 rounded p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Geen actieve filters</p>
          <p className="text-xs mt-2">Klik op "Open Filter Selector" om filters toe te voegen</p>
        </div>
      )}
    </div>
  );
}