import { Header } from './Header';
import { Footer } from './Footer';
import { ArticleCard } from './ArticleCard';
import { FilterSidebar } from './FilterSidebar';
import { FilterSelectionPage } from './FilterSelectionPage';
import { mockArticles } from '../data/mockData';
import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { filterArticles, parseFiltersFromURL } from '../utils/filterUtils';
import { Network } from 'lucide-react';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Parse filters from URL
  const filters = parseFiltersFromURL(searchParams);
  
  // Check if filter panel should be shown
  const showFilterPanel = searchParams.get('showFilters') === 'true';
  
  // Apply filters to articles
  const filteredArticles = useMemo(() => {
    return filterArticles(mockArticles, filters);
  }, [filters]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 mx-auto px-20 py-12 w-full max-w-screen-2xl">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-[#1C3664] mb-2">Recente Artikelen</h1>
              <p className="text-gray-600">
                Ontdek de nieuwste inzichten en analyses van vertrouwde bronnen
                {filteredArticles.length < mockArticles.length && (
                  <span className="ml-2 text-[#0097DB]">
                    ({filteredArticles.length} van {mockArticles.length} artikelen)
                  </span>
                )}
              </p>
            </div>
            
            {/* Network Graph Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate(`/network?${searchParams.toString()}`)}
                className="flex items-center gap-2 px-6 h-12 bg-[#0097DB] hover:bg-[#007AB8] text-white rounded-lg transition-colors"
              >
                <Network className="w-5 h-5" />
                Netwerk Visualisatie
              </button>
            </div>
            
            {/* Articles Grid */}
            <div className="col-span-9">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {filteredArticles.length > 0 ? (
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
                      {filteredArticles.slice(0, 9).map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <p className="text-lg mb-2">Geen artikelen gevonden</p>
                    <p className="text-sm">Pas uw filters aan om meer resultaten te zien</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <FilterSidebar />
        </div>
      </main>

      <Footer />
      
      {/* Filter Panel Overlay */}
      {showFilterPanel && <FilterSelectionPage />}
    </div>
  );
}