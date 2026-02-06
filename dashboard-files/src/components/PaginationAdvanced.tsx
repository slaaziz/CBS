import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface PaginationAdvancedProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function PaginationAdvanced({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: PaginationAdvancedProps) {
  const [jumpPage, setJumpPage] = useState('');
  const [error, setError] = useState(false);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleJump = () => {
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleQuickJump = (increment: number) => {
    const newPage = Math.min(Math.max(currentPage + increment, 1), totalPages);
    onPageChange(newPage);
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxButtons = 7;
    
    if (totalPages <= maxButtons) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`min-w-[36px] h-[36px] px-2 rounded-lg text-sm font-medium transition-colors ${
              i === currentPage
                ? 'bg-[#0097DB] text-white'
                : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show first page
      buttons.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`min-w-[36px] h-[36px] px-2 rounded-lg text-sm font-medium transition-colors ${
            1 === currentPage
              ? 'bg-[#0097DB] text-white'
              : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
          }`}
        >
          1
        </button>
      );

      // Show ellipsis or nearby pages
      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-[#6B7280]">
            ...
          </span>
        );
      }

      // Show current and nearby pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`min-w-[36px] h-[36px] px-2 rounded-lg text-sm font-medium transition-colors ${
              i === currentPage
                ? 'bg-[#0097DB] text-white'
                : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
            }`}
          >
            {i}
          </button>
        );
      }

      // Show ellipsis before last page
      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="px-2 text-[#6B7280]">
            ...
          </span>
        );
      }

      // Show last page
      buttons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`min-w-[36px] h-[36px] px-2 rounded-lg text-sm font-medium transition-colors ${
            totalPages === currentPage
              ? 'bg-[#0097DB] text-white'
              : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="w-full bg-[#F9FAFB] border-t border-[#E5E7EB] px-6 py-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 h-[40px] text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Vorige
        </button>

        {/* Page buttons */}
        <div className="flex items-center gap-2">
          {renderPageButtons()}
        </div>

        {/* Jump controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6B7280]">Ga naar:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpPage}
            onChange={(e) => {
              setJumpPage(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleJump();
              }
            }}
            placeholder=""
            className={`w-[60px] h-[36px] px-2 text-sm text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097DB] ${
              error ? 'border-red-500' : 'border-[#D1D5DB]'
            }`}
          />
          <button
            onClick={handleJump}
            className="min-w-[36px] h-[36px] flex items-center justify-center text-[#0097DB] hover:bg-[#E6F5FC] rounded-lg transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick jump buttons */}
          <button
            onClick={() => handleQuickJump(10)}
            disabled={currentPage >= totalPages}
            className="px-3 h-[36px] text-sm font-medium text-[#0097DB] bg-white border border-[#0097DB] rounded-lg hover:bg-[#E6F5FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +10
          </button>
          <button
            onClick={() => handleQuickJump(50)}
            disabled={currentPage >= totalPages}
            className="px-3 h-[36px] text-sm font-medium text-[#0097DB] bg-white border border-[#0097DB] rounded-lg hover:bg-[#E6F5FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +50
          </button>
          <button
            onClick={() => handleQuickJump(100)}
            disabled={currentPage >= totalPages}
            className="px-3 h-[36px] text-sm font-medium text-[#0097DB] bg-white border border-[#0097DB] rounded-lg hover:bg-[#E6F5FC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +100
          </button>
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 h-[40px] text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Volgende
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Info text */}
      <div className="text-center text-xs text-[#6B7280]">
        Pagina {currentPage} van {totalPages.toLocaleString('nl-NL')} • Artikelen {startItem.toLocaleString('nl-NL')}-{endItem.toLocaleString('nl-NL')} van {totalItems.toLocaleString('nl-NL')}
      </div>
    </div>
  );
}
