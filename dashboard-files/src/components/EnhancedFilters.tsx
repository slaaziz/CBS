import { useState } from 'react';
import { Search, X, Star } from 'lucide-react';
import { publishers, contentTypes, citationTypes, mediaQualityLevels } from '../data/mockData';

export interface EnhancedFilters {
  publishers: string[];
  contentType: string;
  citationRange: { min: number; max: number };
  citationType: string;
  mediaQuality: number[];
}

interface EnhancedFiltersProps {
  filters: EnhancedFilters;
  onChange: (filters: EnhancedFilters) => void;
}

export function EnhancedFiltersComponent({ filters, onChange }: EnhancedFiltersProps) {
  const [publisherSearch, setPublisherSearch] = useState('');

  const popularPublishers = publishers.filter(p => p.tier === 'popular');
  const allPublishers = publishers.filter(p => p.tier === 'all');
  
  const filteredPublishers = publisherSearch
    ? allPublishers.filter(p => p.name.toLowerCase().includes(publisherSearch.toLowerCase()))
    : allPublishers;

  const handlePublisherToggle = (publisherName: string) => {
    const newPublishers = filters.publishers.includes(publisherName)
      ? filters.publishers.filter(p => p !== publisherName)
      : [...filters.publishers, publisherName];
    
    onChange({ ...filters, publishers: newPublishers });
  };

  const handleSelectAllPublishers = () => {
    onChange({ ...filters, publishers: publishers.map(p => p.name) });
  };

  const handleClearAllPublishers = () => {
    onChange({ ...filters, publishers: [] });
  };

  const handleContentTypeChange = (value: string) => {
    onChange({ ...filters, contentType: value });
  };

  const handleCitationRangeChange = (type: 'min' | 'max', value: number) => {
    onChange({
      ...filters,
      citationRange: {
        ...filters.citationRange,
        [type]: value,
      },
    });
  };

  const handleCitationTypeChange = (value: string) => {
    onChange({ ...filters, citationType: value });
  };

  const handleMediaQualityToggle = (value: number) => {
    const newQuality = filters.mediaQuality.includes(value)
      ? filters.mediaQuality.filter(q => q !== value)
      : [...filters.mediaQuality, value];
    
    onChange({ ...filters, mediaQuality: newQuality });
  };

  return (
    <div className="space-y-6">
      {/* Publisher Filter */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-3">Uitgevers</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={publisherSearch}
            onChange={(e) => setPublisherSearch(e.target.value)}
            placeholder="Zoek uitgever..."
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097DB]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {publisherSearch && (
            <button
              onClick={() => setPublisherSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Select All / Clear All */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#E5E7EB]">
          <button
            onClick={handleSelectAllPublishers}
            className="text-xs text-[#0097DB] hover:text-[#007BB5] font-medium"
          >
            Alles selecteren
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={handleClearAllPublishers}
            className="text-xs text-[#0097DB] hover:text-[#007BB5] font-medium"
          >
            Alles wissen
          </button>
        </div>

        {/* Popular Publishers */}
        {!publisherSearch && (
          <>
            <p className="text-xs font-semibold text-[#6B7280] uppercase mb-2">Populair</p>
            <div className="space-y-2 mb-4 pb-4 border-b border-[#E5E7EB]">
              {popularPublishers.map((publisher) => (
                <label
                  key={publisher.name}
                  className="flex items-center justify-between cursor-pointer min-h-[44px] py-2 hover:bg-[#F9FAFB] rounded px-2"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={filters.publishers.includes(publisher.name)}
                      onChange={() => handlePublisherToggle(publisher.name)}
                      className="w-[18px] h-[18px] text-[#0097DB] rounded focus:ring-[#0097DB]"
                    />
                    <span className="text-sm text-[#111827]">{publisher.name}</span>
                  </div>
                  <span className="text-xs text-[#6B7280]">({publisher.articleCount.toLocaleString('nl-NL')})</span>
                </label>
              ))}
            </div>
          </>
        )}

        {/* All Publishers */}
        <p className="text-xs font-semibold text-[#6B7280] uppercase mb-2">
          {publisherSearch ? `${filteredPublishers.length} resultaten` : 'Alle Uitgevers'}
        </p>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {filteredPublishers.map((publisher) => (
            <label
              key={publisher.name}
              className="flex items-center justify-between cursor-pointer min-h-[44px] py-2 hover:bg-[#F9FAFB] rounded px-2"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={filters.publishers.includes(publisher.name)}
                  onChange={() => handlePublisherToggle(publisher.name)}
                  className="w-[18px] h-[18px] text-[#0097DB] rounded focus:ring-[#0097DB]"
                />
                <span className="text-sm text-[#111827]">{publisher.name}</span>
              </div>
              <span className="text-xs text-[#6B7280]">({publisher.articleCount.toLocaleString('nl-NL')})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Content Type Filter */}
      <div className="pt-6 border-t border-[#E5E7EB]">
        <h3 className="text-sm font-semibold text-[#111827] mb-3">Type Inhoud</h3>
        <div className="space-y-2">
          {contentTypes.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-3 cursor-pointer min-h-[44px] py-2 hover:bg-[#F9FAFB] rounded px-2"
            >
              <input
                type="radio"
                name="contentType"
                value={type.value}
                checked={filters.contentType === type.value}
                onChange={() => handleContentTypeChange(type.value)}
                className="w-5 h-5 text-[#0097DB] focus:ring-[#0097DB]"
              />
              <span className="text-sm text-[#111827]">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Citation Filter */}
      <div className="pt-6 border-t border-[#E5E7EB]">
        <h3 className="text-sm font-semibold text-[#111827] mb-3">Aantal citaties</h3>
        
        {/* Range inputs */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <label className="text-xs text-[#6B7280] mb-1 block">Min</label>
            <input
              type="number"
              min="0"
              value={filters.citationRange.min}
              onChange={(e) => handleCitationRangeChange('min', parseInt(e.target.value) || 0)}
              className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097DB]"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-[#6B7280] mb-1 block">Max</label>
            <input
              type="number"
              min="0"
              value={filters.citationRange.max}
              onChange={(e) => handleCitationRangeChange('max', parseInt(e.target.value) || 0)}
              className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097DB]"
            />
          </div>
        </div>

        {/* Citation Type Dropdown */}
        <div>
          <label className="text-xs text-[#6B7280] mb-1 block">Type citatie</label>
          <select
            value={filters.citationType}
            onChange={(e) => handleCitationTypeChange(e.target.value)}
            className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097DB] bg-white"
          >
            {citationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Quality Filter */}
      <div className="pt-6 border-t border-[#E5E7EB]">
        <h3 className="text-sm font-semibold text-[#111827] mb-3">Mediakwaliteit</h3>
        <div className="space-y-2">
          {mediaQualityLevels.map((level) => (
            <label
              key={level.value}
              className="flex items-center gap-3 cursor-pointer min-h-[44px] py-2 hover:bg-[#F9FAFB] rounded px-2"
            >
              <input
                type="checkbox"
                checked={filters.mediaQuality.includes(level.value)}
                onChange={() => handleMediaQualityToggle(level.value)}
                className="w-[18px] h-[18px] text-[#0097DB] rounded focus:ring-[#0097DB]"
              />
              <div className="flex items-center gap-2">
                {level.stars > 0 ? (
                  <div className="flex">
                    {Array.from({ length: level.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#FCD34D] fill-[#FCD34D]" />
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
                <span className="text-sm text-[#111827]">{level.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
