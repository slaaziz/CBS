import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { sortOptions } from '../data/mockData';

interface EnhancedSortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function EnhancedSortDropdown({ value, onChange }: EnhancedSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = sortOptions.find(opt => opt.value === value) || sortOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 w-[220px] h-11 px-4 bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
      >
        <span className="text-sm text-[#374151]">{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[280px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-2 bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <p className="text-xs font-semibold text-[#6B7280] uppercase">Sorteer op:</p>
          </div>
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F3F4F6] transition-colors text-left min-h-[44px]"
              >
                <span className={`text-sm ${value === option.value ? 'text-[#0097DB] font-medium' : 'text-[#374151]'}`}>
                  {option.label}
                </span>
                {value === option.value && (
                  <Check className="w-4 h-4 text-[#0097DB]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
