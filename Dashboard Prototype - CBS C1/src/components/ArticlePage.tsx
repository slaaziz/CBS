import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImpactBadge } from './ImpactBadge';
import { ArrowLeft, Tag, SmilePlus, Minus, Frown } from 'lucide-react';
import { mockArticles } from '../data/mockData';

export function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = mockArticles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-gray-900 mb-4">Artikel Niet Gevonden</h1>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700"
            >
              Terug naar Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalSentiment = article.sentiment.positive + article.sentiment.neutral + article.sentiment.negative;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 mx-auto px-20 py-12 w-full max-w-screen-2xl">
        <div className="flex gap-12">
          {/* Left Column - Article Content */}
          <div className="flex-1 max-w-3xl">
            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Terug naar Resultaten
            </button>

            <article>
              <h1 className="text-gray-900 mb-6">{article.title}</h1>
              
              {/* Metadata Row */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <span className="text-gray-600">{article.source}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {new Date(article.date).toLocaleDateString('nl-NL', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  }).replace(/\//g, '-')}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{article.category}</span>
                <div className="ml-auto">
                  <ImpactBadge score={article.vertrouwensscore} />
                </div>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                {article.body.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 flex-wrap">
                  <Tag className="w-5 h-5 text-gray-400" />
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Right Column - Insights Sidebar */}
          <div className="w-96 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6 space-y-8">
              <div>
                <h2 className="text-gray-900 mb-6">Commentaar Inzichten</h2>
                
                {/* Sentiment Analysis */}
                <div className="mb-6">
                  <div className="text-gray-700 mb-3">Sentiment Analyse</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <SmilePlus className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Positief</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{article.sentiment.positive}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
                        <div
                          className="h-full bg-green-500 relative"
                          style={{ width: `${article.sentiment.positive}%` }}
                        >
                          <div className="absolute inset-0" style={{ 
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px)'
                          }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Minus className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Neutraal</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{article.sentiment.neutral}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
                        <div
                          className="h-full bg-blue-500 relative"
                          style={{ width: `${article.sentiment.neutral}%` }}
                        >
                          <div className="absolute inset-0" style={{ 
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)'
                          }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Frown className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Negatief</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{article.sentiment.negative}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
                        <div
                          className="h-full bg-red-500 relative"
                          style={{ width: `${article.sentiment.negative}%` }}
                        >
                          <div className="absolute inset-0" style={{ 
                            backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px)'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Themes */}
                <div>
                  <div className="text-gray-700 mb-3">Belangrijkste Thema's</div>
                  <div className="space-y-2">
                    {article.keyThemes.map((theme, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                      >
                        {theme}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tag Cloud Placeholder */}
              <div className="pt-6 border-t border-gray-200">
                <div className="text-gray-700 mb-3">Discussie Onderwerpen</div>
                <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                  Onderwerp visualisatie
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}