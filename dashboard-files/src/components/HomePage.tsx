import { Header } from './Header';
import { Footer } from './Footer';
import { DashboardOverview } from './DashboardOverview';
import { FilterSelectionPage } from './FilterSelectionPage';
import { useSearchParams } from 'react-router';

export function HomePage() {
  const [searchParams] = useSearchParams();
  
  // Check if filter panel should be shown
  const showFilterPanel = searchParams.get('showFilters') === 'true';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 mx-auto px-20 py-12 w-full max-w-screen-2xl">
        <DashboardOverview />
      </main>

      <Footer />
      
      {/* Filter Panel Overlay */}
      {showFilterPanel && <FilterSelectionPage />}
    </div>
  );
}