import { Search, Filter, AlertTriangle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-results' | 'no-filters';
  onClearFilters?: () => void;
  onNewSearch?: () => void;
}

export function EmptyState({ type, onClearFilters, onNewSearch }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-[#6B7280]" />
        </div>
        <h3 className="text-xl font-semibold text-[#111827] mb-2">Geen resultaten gevonden</h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          We konden geen artikelen vinden die overeenkomen met uw zoekopdracht en filters.
        </p>
        <div className="text-sm text-gray-600 mb-6">
          <p className="mb-2">Probeer:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Minder filters toe te passen</li>
            <li>Andere zoektermen</li>
            <li>Controleer spelfouten</li>
          </ul>
        </div>
        <div className="flex gap-3">
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-6 h-12 border-2 border-[#0097DB] text-[#0097DB] rounded-lg hover:bg-[#E6F5FC] transition-colors font-medium"
            >
              Filters wissen
            </button>
          )}
          {onNewSearch && (
            <button
              onClick={onNewSearch}
              className="px-6 h-12 bg-[#0097DB] text-white rounded-lg hover:bg-[#007BB5] transition-colors font-medium"
            >
              Nieuwe zoekopdracht
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-6">
        <Filter className="w-10 h-10 text-[#6B7280]" />
      </div>
      <h3 className="text-xl font-semibold text-[#111827] mb-2">Selecteer filters om te beginnen</h3>
      <p className="text-gray-500 text-center max-w-md">
        Gebruik de filters aan de linkerkant om artikelen te vinden die overeenkomen met uw criteria.
      </p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Er is iets misgegaan', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-[#111827] mb-2">{message}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        De pagina kon niet worden geladen. Probeer het opnieuw.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 h-12 bg-[#0097DB] text-white rounded-lg hover:bg-[#007BB5] transition-colors font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          Opnieuw proberen
        </button>
      )}
    </div>
  );
}
