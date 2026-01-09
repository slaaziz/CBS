import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, Home, X } from 'lucide-react';
import { filterCategories, filterSources, filterTimeRanges, filterThemes } from '../data/mockData';
import { parseFiltersFromURL, filtersToURLParams } from '../utils/filterUtils';

export function FilterSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize state from URL params
  const initialFilters = parseFiltersFromURL(searchParams);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [selectedSources, setSelectedSources] = useState<string[]>(initialFilters.sources);
  const [selectedTimeRange, setSelectedTimeRange] = useState(initialFilters.timeRange);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(initialFilters.themes);
  const [minVertrouwensscore, setMinVertrouwensscore] = useState<number | undefined>(initialFilters.minVertrouwensscore);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSource = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const totalFilters = selectedCategories.length + selectedSources.length + selectedThemes.length + 1;

  const handleApply = () => {
    const filters = {
      categories: selectedCategories,
      sources: selectedSources,
      timeRange: selectedTimeRange,
      themes: selectedThemes,
      minVertrouwensscore: minVertrouwensscore,
    };

    const urlParams = filtersToURLParams(filters);
    const query = searchParams.get('q');
    if (query) {
      urlParams.set('q', query);
      navigate(`/search?${urlParams}`);
    } else {
      navigate(`/?${urlParams}`);
    }
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('showFilters');
    const query = searchParams.get('q');
    if (query) {
      navigate(`/search?${params.toString()}`);
    } else {
      navigate(`/?${params.toString()}`);
    }
  };

  return (
    <>
      {/* Slide-in Panel */}
      <div className="fixed inset-y-0 right-0 w-1/2 bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#1C3664] text-white px-8 py-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold mb-1">Filter Selector</h1>
            <p className="text-blue-200 text-sm">
              Pas uw zoekresultaten aan met filters
            </p>
          </div>
          <button
            onClick={handleClose}
            className="hover:bg-white/10 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 py-6 flex-1 overflow-y-auto">
          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h2 className="text-[#1C3664] mb-4">Categorieën</h2>
              <div className="space-y-3">
                {filterCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-5 h-5 rounded border-gray-300 text-[#0097DB] focus:ring-[#0097DB]"
                    />
                    <span className="text-gray-700 group-hover:text-[#1C3664] transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div>
              <h2 className="text-[#1C3664] mb-4">Bronnen</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {filterSources.map((source) => (
                  <label
                    key={source}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source)}
                      onChange={() => toggleSource(source)}
                      className="w-5 h-5 rounded border-gray-300 text-[#0097DB] focus:ring-[#0097DB]"
                    />
                    <span className="text-gray-700 group-hover:text-[#1C3664] transition-colors text-sm">
                      {source}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div>
              <h2 className="text-[#1C3664] mb-4">Tijdsperiode</h2>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097DB] focus:border-transparent"
              >
                {filterTimeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Themes */}
            <div>
              <h2 className="text-[#1C3664] mb-4">Thema's / Tags</h2>
              <div className="space-y-3">
                {filterThemes.map((theme) => (
                  <label
                    key={theme}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedThemes.includes(theme)}
                      onChange={() => toggleTheme(theme)}
                      className="w-5 h-5 rounded border-gray-300 text-[#0097DB] focus:ring-[#0097DB]"
                    />
                    <span className="text-gray-700 group-hover:text-[#1C3664] transition-colors">
                      {theme}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vertrouwensscore Minimum */}
            <div>
              <h2 className="text-[#1C3664] mb-4">Minimum Vertrouwensscore</h2>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={minVertrouwensscore || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMinVertrouwensscore(val === 0 ? undefined : val);
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0%</span>
                  <span className="font-semibold text-[#0097DB]">
                    {minVertrouwensscore || 0}%
                  </span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {totalFilters} {totalFilters === 1 ? 'filter' : 'filters'} geselecteerd
            </div>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedSources([]);
                setSelectedTimeRange('all');
                setSelectedThemes([]);
                setMinVertrouwensscore(undefined);
              }}
              className="text-sm text-gray-500 hover:text-[#1C3664] transition-colors"
            >
              Wis alle filters
            </button>
          </div>
          <button
            onClick={handleApply}
            className="w-full h-12 bg-[#0097DB] hover:bg-[#007AB8] text-white rounded-lg transition-colors font-semibold"
          >
            Filters Toepassen
          </button>
        </div>
      </div>
    </>
  );
}