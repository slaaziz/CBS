import { useState, useRef, useEffect } from 'react';
import { Search, Clock, FileText, Hash, X } from 'lucide-react';
import { recentSearches, searchSuggestions, cbsNumbers } from '../data/mockData';
import { useNavigate } from 'react-router';

interface SearchAutocompleteProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  onClose?: () => void;
}

export function SearchAutocomplete({ query, onQueryChange, onSearch, onClose }: SearchAutocompleteProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [localRecentSearches, setLocalRecentSearches] = useState(recentSearches);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearAll = () => {
    setLocalRecentSearches([]);
  };

  const handleSelectSuggestion = (title: string, articleId?: string) => {
    if (articleId) {
      navigate(`/article/${articleId}`);
    } else {
      onSearch(title);
    }
    setShowDropdown(false);
  };

  const handleSelectCBSNumber = (number: string) => {
    onSearch(number);
    setShowDropdown(false);
  };

  const filteredSuggestions = query.length > 0
    ? searchSuggestions.filter(s => s.title.toLowerCase().includes(query.toLowerCase()))
    : searchSuggestions;

  const filteredCBSNumbers = query.length > 0
    ? cbsNumbers.filter(n => n.toLowerCase().includes(query.toLowerCase()))
    : cbsNumbers;

  const hasResults = localRecentSearches.length > 0 || filteredSuggestions.length > 0 || filteredCBSNumbers.length > 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch(query);
              setShowDropdown(false);
            }
          }}
          placeholder="Zoek artikelen, CBS-nummers..."
          className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097DB] focus:border-transparent"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        {query && (
          <button
            onClick={() => {
              onQueryChange('');
              if (onClose) onClose();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && hasResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50">
          {/* Recent Searches */}
          {localRecentSearches.length > 0 && query.length === 0 && (
            <div className="border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between px-4 py-3">
                <h3 className="text-xs font-semibold text-[#6B7280] uppercase">Recente zoekopdrachten</h3>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-[#0097DB] hover:text-[#007BB5] font-medium"
                >
                  Alles wissen
                </button>
              </div>
              {localRecentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(search)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F3F4F6] transition-colors text-left min-h-[44px]"
                >
                  <Clock className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                  <span className="text-sm text-[#111827]">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Suggested Articles */}
          {filteredSuggestions.length > 0 && (
            <div className="border-b border-[#E5E7EB]">
              <div className="px-4 py-3">
                <h3 className="text-xs font-semibold text-[#6B7280] uppercase">Voorgestelde artikelen</h3>
              </div>
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSelectSuggestion(suggestion.title, suggestion.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#F3F4F6] transition-colors text-left min-h-[44px]"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                    <span className="text-sm text-[#111827] line-clamp-1">{suggestion.title}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-[#10B981] text-white text-xs font-semibold rounded">
                    {suggestion.score}%
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* CBS Numbers */}
          {filteredCBSNumbers.length > 0 && (
            <div>
              <div className="px-4 py-3">
                <h3 className="text-xs font-semibold text-[#6B7280] uppercase">CBS Nummers</h3>
              </div>
              {filteredCBSNumbers.map((number, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectCBSNumber(number)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F3F4F6] transition-colors text-left min-h-[44px]"
                >
                  <Hash className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                  <span className="text-sm text-[#111827] font-mono">{number}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}