import { useMemo } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { getAllFeedback, getHelpfulnessText } from '../utils/feedbackStorage';
import { mockArticles } from '../data/mockData';

export function FeedbackStats() {
  const feedbackData = useMemo(() => {
    const allFeedback = getAllFeedback();
    const feedbackEntries = Object.entries(allFeedback);
    
    // Get total votes
    const totalPositive = feedbackEntries.reduce((sum, [_, data]) => sum + data.positiveCount, 0);
    const totalNegative = feedbackEntries.reduce((sum, [_, data]) => sum + data.negativeCount, 0);
    const totalVotes = totalPositive + totalNegative;
    
    // Get articles with most feedback
    const articlesWithFeedback = feedbackEntries
      .map(([articleId, feedback]) => {
        const article = mockArticles.find(a => a.id === articleId);
        return {
          articleId,
          article,
          feedback,
          total: feedback.positiveCount + feedback.negativeCount,
          percentage: Math.round((feedback.positiveCount / (feedback.positiveCount + feedback.negativeCount)) * 100)
        };
      })
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
    
    return {
      totalPositive,
      totalNegative,
      totalVotes,
      articlesWithFeedback,
      totalArticlesRated: feedbackEntries.filter(([_, data]) => data.positiveCount + data.negativeCount > 0).length
    };
  }, []);

  if (feedbackData.totalVotes === 0) {
    return (
      <div className=\"bg-white border border-gray-200 rounded-lg p-6\">
        <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Feedback Statistieken</h3>
        <p className=\"text-gray-500 text-center py-8\">
          Nog geen feedback ontvangen. Bezoek artikelen en geef feedback om statistieken te zien.
        </p>
      </div>
    );
  }

  const positivePercentage = Math.round((feedbackData.totalPositive / feedbackData.totalVotes) * 100);

  return (
    <div className=\"bg-white border border-gray-200 rounded-lg p-6\">
      <h3 className=\"text-lg font-semibold text-gray-900 mb-6\">Feedback Statistieken</h3>
      
      {/* Overall Stats */}
      <div className=\"grid grid-cols-3 gap-4 mb-6\">
        <div className=\"text-center p-4 bg-gray-50 rounded-lg\">
          <div className=\"text-2xl font-bold text-gray-900\">{feedbackData.totalVotes}</div>
          <div className=\"text-sm text-gray-600\">Totaal Stemmen</div>
        </div>
        <div className=\"text-center p-4 bg-green-50 rounded-lg\">
          <div className=\"flex items-center justify-center gap-2 mb-1\">
            <ThumbsUp className=\"w-5 h-5 text-green-600\" />
            <div className=\"text-2xl font-bold text-green-700\">{feedbackData.totalPositive}</div>
          </div>
          <div className=\"text-sm text-green-600\">{positivePercentage}% Positief</div>
        </div>
        <div className=\"text-center p-4 bg-red-50 rounded-lg\">
          <div className=\"flex items-center justify-center gap-2 mb-1\">
            <ThumbsDown className=\"w-5 h-5 text-red-600\" />
            <div className=\"text-2xl font-bold text-red-700\">{feedbackData.totalNegative}</div>
          </div>
          <div className=\"text-sm text-red-600\">{100 - positivePercentage}% Negatief</div>
        </div>
      </div>

      {/* Articles with Most Feedback */}
      {feedbackData.articlesWithFeedback.length > 0 && (
        <div>
          <h4 className=\"text-sm font-semibold text-gray-700 mb-3\">
            Top Beoordeelde Artikelen ({feedbackData.totalArticlesRated} totaal)
          </h4>
          <div className=\"space-y-2\">
            {feedbackData.articlesWithFeedback.map((item, index) => (
              <div
                key={item.articleId}
                className=\"p-3 bg-gray-50 rounded-lg border border-gray-200\"
              >
                <div className=\"flex items-start justify-between gap-3\">
                  <div className=\"flex-1 min-w-0\">
                    <div className=\"text-sm font-medium text-gray-900 truncate mb-1\">
                      {item.article?.title || `Artikel ${item.articleId}`}
                    </div>
                    <div className=\"flex items-center gap-3 text-xs text-gray-600\">
                      <span className=\"flex items-center gap-1\">
                        <ThumbsUp className=\"w-3 h-3 text-green-600\" />
                        {item.feedback.positiveCount}
                      </span>
                      <span className=\"flex items-center gap-1\">
                        <ThumbsDown className=\"w-3 h-3 text-red-600\" />
                        {item.feedback.negativeCount}
                      </span>
                      <span>•</span>
                      <span className=\"font-medium\">{item.percentage}% positief</span>
                    </div>
                  </div>
                  <div className=\"text-sm font-semibold text-gray-900\">
                    {item.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
