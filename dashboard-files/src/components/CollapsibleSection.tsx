import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function CollapsibleSection({ title, children, defaultOpen = true, className = '' }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-6 flex items-center justify-between bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors"
      >
        <h2 className="text-base font-semibold text-[#111827]">{title}</h2>
        <div className="flex items-center gap-2 min-w-[44px] min-h-[44px] justify-center">
          {isOpen ? (
            <>
              <ChevronDown className="w-5 h-5 text-[#6B7280]" />
              <span className="text-sm text-[#6B7280]">Minimaliseren</span>
            </>
          ) : (
            <>
              <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              <span className="text-sm text-[#6B7280]">Uitvouwen</span>
            </>
          )}
        </div>
      </button>
      
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
