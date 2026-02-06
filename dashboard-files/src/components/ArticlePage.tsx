import { useParams, useNavigate } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImpactBadge } from './ImpactBadge';
import { MatchExplanation } from './MatchExplanation';
import { FeedbackWidget } from './FeedbackWidget';
import { ArrowLeft, Tag, ExternalLink } from 'lucide-react';
import { mockArticles } from '../data/mockData';
import { useState } from 'react';
import { getParentArticles, hasMultipleParents, formatCBSNumbers } from '../utils/parentArticleUtils';

export function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = mockArticles.find(a => a.id === id);
  const [showAllParents, setShowAllParents] = useState(false);

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

  const parentArticles = getParentArticles(article);
  const multipleParents = hasMultipleParents(article);

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
                  {article.date ? new Date(article.date).toLocaleDateString('nl-NL', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  }).replace(/\//g, '-') : 'Onbekend'}
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
              {article.tags.length > 0 && (
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
              )}

              {/* Match Explanation */}
              {article.vertrouwensscore > 0 && (
                <div className="mt-8">
                  <MatchExplanation
                    vertrouwensscore={article.vertrouwensscore}
                    sharedKeywords={article.tags.slice(0, 5)}
                    dateMatch={article.parentDate ? `Gekoppeld aan CBS artikel van ${new Date(article.parentDate).toLocaleDateString('nl-NL')}` : "CBS artikel match"}
                    numericalData={[]}
                    theme={article.keyThemes.length > 0 ? `${article.category} > ${article.keyThemes[0]}` : article.category}
                    onFeedback={() => {}}
                  />
                </div>
              )}

              {/* Feedback Widget */}
              <div className="mt-8">
                <FeedbackWidget
                  articleId={article.id}
                  variant="inline"
                  showStats={true}
                />
              </div>
            </article>
          </div>

          {/* Right Column - Insights Sidebar */}
          <div className="w-96 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6 space-y-8">
              <div>
                <h2 className="text-gray-900 mb-6">Artikel Informatie</h2>
                
                {/* Word Count */}
                <div className="mb-6">
                  <div className="text-gray-700 mb-2">Aantal Woorden</div>
                  <div className="text-gray-900 font-semibold text-2xl">{article.wordCount.toLocaleString('nl-NL')}</div>
                </div>
                
                {/* CBS Parent Articles - Handling Multiple Parents */}
                {parentArticles.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-gray-700">
                        Gerelateerde CBS Artikel{parentArticles.length > 1 ? 'en' : ''}
                        {multipleParents && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {parentArticles.length} matches
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Show first parent or all if expanded */}
                    <div className="space-y-3">
                      {(showAllParents ? parentArticles : parentArticles.slice(0, 1)).map((parent, index) => (
                        <div 
                          key={index}
                          className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-xs font-mono text-blue-600">{parent.cbsNumber}</div>
                            {parent.date && (
                              <div className="text-xs text-gray-500">
                                {new Date(parent.date).toLocaleDateString('nl-NL', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                }).replace(/\//g, '-')}
                              </div>
                            )}
                          </div>
                          {parent.title && (
                            <div className="text-sm text-gray-900 mb-2 font-medium capitalize">
                              {parent.title}
                            </div>
                          )}
                          {parent.link && (
                            <a
                              href={parent.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-[#0097DB] hover:text-[#007BB5] hover:underline transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Bekijk CBS artikel
                            </a>
                          )}
                        </div>
                      ))}
                      
                      {/* Show More / Show Less button */}
                      {multipleParents && (
                        <button
                          onClick={() => setShowAllParents(!showAllParents)}
                          className="text-sm text-[#0097DB] hover:text-[#007BB5] font-medium flex items-center gap-1"
                        >
                          {showAllParents ? (
                            <>Toon minder</>
                          ) : (
                            <>Toon alle {parentArticles.length} CBS artikelen</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Key Themes */}
                {article.keyThemes.length > 0 && (
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
                )}
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