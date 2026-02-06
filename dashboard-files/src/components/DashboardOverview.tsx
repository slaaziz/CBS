import { useNavigate } from 'react-router';
import { Search, TrendingUp, Users, FileText, Calendar, Network } from 'lucide-react';
import { mockArticles } from '../data/mockData';
import { useMemo } from 'react';
import { categorizeArticles } from '../utils/categorizeArticle';

export function DashboardOverview() {
  const navigate = useNavigate();

  // Categorize articles on load
  const categorizedArticles = useMemo(() => categorizeArticles(mockArticles), []);

  // Calculate statistics
  const totalArticles = categorizedArticles.length;
  
  // Only count articles with vertrouwensscore > 0 for average
  const articlesWithScore = categorizedArticles.filter(a => a.vertrouwensscore > 0);
  const avgTrustScore = articlesWithScore.length > 0 
    ? Math.round(articlesWithScore.reduce((sum, article) => sum + article.vertrouwensscore, 0) / articlesWithScore.length)
    : 0;
  
  const recentArticles = categorizedArticles.slice(0, 6);

  // Get unique categories (exclude "Uncategorized")
  const categories = Array.from(new Set(categorizedArticles.map(a => a.category)))
    .filter(cat => cat && cat !== 'Uncategorized');
  
  // Count articles with CBS matches (vertrouwensscore > 0)
  const matchedArticles = categorizedArticles.filter(a => a.vertrouwensscore > 0).length;

  return (
    <div className="space-y-8">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#0097DB]">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-[#E6F5FC] rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#0097DB]" />
            </div>
            <span className="text-3xl font-bold text-[#1C3664]">{totalArticles}</span>
          </div>
          <p className="text-gray-600">Totaal Artikelen</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-[#1C3664]">{avgTrustScore}%</span>
          </div>
          <p className="text-gray-600">Gem. Vertrouwensscore</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-[#1C3664]">{matchedArticles}</span>
          </div>
          <p className="text-gray-600">CBS Matches</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-3xl font-bold text-[#1C3664]">{categories.length}</span>
          </div>
          <p className="text-gray-600">Categorieën</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-[#1C3664] mb-4">Snel aan de slag</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/search')}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow border border-gray-200 group"
          >
            <div className="w-12 h-12 bg-[#E6F5FC] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0097DB] transition-colors">
              <Search className="w-6 h-6 text-[#0097DB] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-[#1C3664] mb-2">Zoek Artikelen</h3>
            <p className="text-gray-600 text-sm">
              Doorzoek alle {totalArticles} artikelen met geavanceerde filters
            </p>
          </button>

          <button
            onClick={() => navigate('/search?showFilters=true')}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow border border-gray-200 group"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
              <TrendingUp className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-[#1C3664] mb-2">Filter & Analyseer</h3>
            <p className="text-gray-600 text-sm">
              Gebruik filters om specifieke artikelen te vinden
            </p>
          </button>

          <button
            onClick={() => navigate('/network')}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow border border-gray-200 group"
          >
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
              <Network className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-[#1C3664] mb-2">Netwerk Grafiek</h3>
            <p className="text-gray-600 text-sm">
              Visualiseer artikelrelaties en verbindingen
            </p>
          </button>
        </div>
      </div>

      {/* Recent Articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#1C3664]">Recente Artikelen</h2>
          <button
            onClick={() => navigate('/search')}
            className="text-[#0097DB] hover:text-[#007BB5] font-medium text-sm"
          >
            Bekijk alle artikelen →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentArticles.map((article, index) => (
            <button
              key={`${article.id}-${index}`}
              onClick={() => navigate(`/article/${article.id}`)}
              className="bg-white rounded-lg shadow-sm p-5 text-left hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-[#0097DB] bg-[#E6F5FC] px-2 py-1 rounded">
                  {article.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  article.vertrouwensscore >= 90 ? 'bg-green-100 text-green-700' :
                  article.vertrouwensscore >= 80 ? 'bg-blue-100 text-blue-700' :
                  article.vertrouwensscore >= 70 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {article.vertrouwensscore}%
                </span>
              </div>
              <h3 className="font-semibold text-[#1C3664] mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {article.snippet || 'Geen samenvatting beschikbaar'}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{article.publisher}</span>
                <span>
                  {article.date ? new Date(article.date).toLocaleDateString('nl-NL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/\//g, '-') : 'Onbekend'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Categories Overview */}
      <div>
        <h2 className="text-xl font-semibold text-[#1C3664] mb-4">Categorieën</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.slice(0, 14).map((category) => {
            const count = categorizedArticles.filter(a => a.category === category).length;
            return (
              <button
                key={category}
                onClick={() => navigate(`/search?categories=${encodeURIComponent(category)}`)}
                className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow border border-gray-200 group"
              >
                <div className="text-2xl font-bold text-[#0097DB] mb-1">{count}</div>
                <div className="text-xs text-gray-600 group-hover:text-[#1C3664] transition-colors">
                  {category}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}