import { Search, User, Home } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import cbsLogo from 'figma:asset/7965749448b052296dcdeb2c58f8dddf9a9d91b1.png';

interface HeaderProps {
  initialQuery?: string;
}

export function Header({ initialQuery = '' }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo - clickable to go home */}
          <button
            onClick={() => navigate('/')}
            className="flex-shrink-0 mr-6 hover:opacity-80 transition-opacity"
          >
            <img src={cbsLogo} alt="CBS Logo" className="h-12" />
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek artikelen, onderwerpen of bronnen..."
                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097DB] focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* Right Side - Back to Overview + Profile */}
          <div className="flex items-center gap-3 ml-6">
            {!isHomePage && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 h-10 text-[#0097DB] hover:bg-[#E6F5FC] rounded-lg transition-colors font-medium"
              >
                <Home className="w-4 h-4" />
                Terug naar overzicht
              </button>
            )}
            
            {/* Profile Icon */}
            <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <User className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}