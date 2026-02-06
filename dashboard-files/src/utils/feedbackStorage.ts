// Utility for managing article feedback storage using localStorage

export interface ArticleFeedback {
  articleId: string;
  positiveCount: number;
  negativeCount: number;
  userVote?: 'positive' | 'negative'; // Track if current user has voted
}

const FEEDBACK_STORAGE_KEY = 'insightNavigator_articleFeedback';

// Get all feedback from localStorage
export function getAllFeedback(): Record<string, ArticleFeedback> {
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading feedback from localStorage:', error);
    return {};
  }
}

// Save all feedback to localStorage
function saveFeedback(feedback: Record<string, ArticleFeedback>): void {
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedback));
  } catch (error) {
    console.error('Error saving feedback to localStorage:', error);
  }
}

// Get feedback for a specific article
export function getArticleFeedback(articleId: string): ArticleFeedback {
  const allFeedback = getAllFeedback();
  return allFeedback[articleId] || {
    articleId,
    positiveCount: 0,
    negativeCount: 0,
  };
}

// Submit feedback for an article
export function submitArticleFeedback(
  articleId: string,
  feedbackType: 'positive' | 'negative'
): ArticleFeedback {
  const allFeedback = getAllFeedback();
  const currentFeedback = allFeedback[articleId] || {
    articleId,
    positiveCount: 0,
    negativeCount: 0,
  };

  // If user already voted, remove previous vote
  if (currentFeedback.userVote === 'positive') {
    currentFeedback.positiveCount = Math.max(0, currentFeedback.positiveCount - 1);
  } else if (currentFeedback.userVote === 'negative') {
    currentFeedback.negativeCount = Math.max(0, currentFeedback.negativeCount - 1);
  }

  // Add new vote
  if (feedbackType === 'positive') {
    currentFeedback.positiveCount += 1;
  } else {
    currentFeedback.negativeCount += 1;
  }

  currentFeedback.userVote = feedbackType;

  // Save back to storage
  allFeedback[articleId] = currentFeedback;
  saveFeedback(allFeedback);

  return currentFeedback;
}

// Check if user has voted on an article
export function getUserVote(articleId: string): 'positive' | 'negative' | undefined {
  const feedback = getArticleFeedback(articleId);
  return feedback.userVote;
}

// Get total feedback count for an article
export function getTotalFeedback(articleId: string): number {
  const feedback = getArticleFeedback(articleId);
  return feedback.positiveCount + feedback.negativeCount;
}

// Get percentage of positive feedback
export function getPositivePercentage(articleId: string): number | null {
  const feedback = getArticleFeedback(articleId);
  const total = feedback.positiveCount + feedback.negativeCount;
  
  if (total === 0) return null;
  
  return Math.round((feedback.positiveCount / total) * 100);
}

// Calculate helpfulness text
export function getHelpfulnessText(articleId: string): string | null {
  const feedback = getArticleFeedback(articleId);
  const total = feedback.positiveCount + feedback.negativeCount;
  
  if (total === 0) return null;
  
  const percentage = Math.round((feedback.positiveCount / total) * 100);
  return `${percentage}% vond dit nuttig (${total} ${total === 1 ? 'stem' : 'stemmen'})`;
}

// Reset all feedback (useful for testing)
export function clearAllFeedback(): void {
  try {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing feedback:', error);
  }
}
