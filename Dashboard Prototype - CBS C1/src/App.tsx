import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { ArticlePage } from './components/ArticlePage';
import { NetworkGraphPage } from './components/NetworkGraphPage';

export default function App() {
  return (
    <Router basename="/">
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/network" element={<NetworkGraphPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}