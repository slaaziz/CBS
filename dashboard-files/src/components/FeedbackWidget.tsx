import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { 
  submitArticleFeedback, 
  getUserVote, 
  getArticleFeedback,
  getHelpfulnessText 
} from '../utils/feedbackStorage';

interface FeedbackWidgetProps {
  articleId: string;
  matchId?: string;
  variant?: 'inline' | 'compact';
  onSubmit?: (feedback: FeedbackData) => void;
  showStats?: boolean; // Show feedback statistics
}

export interface FeedbackData {
  articleId: string;
  matchId?: string;
  feedbackType: 'positive' | 'negative';
  reason?: string;
  comment?: string;
  timestamp: string;
}

export function FeedbackWidget({ articleId, matchId, variant = 'inline', onSubmit, showStats = true }: FeedbackWidgetProps) {
  const [selected, setSelected] = useState<'positive' | 'negative' | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [feedbackStats, setFeedbackStats] = useState<string | null>(null);

  // Load user's previous vote on mount
  useEffect(() => {
    const userVote = getUserVote(articleId);
    if (userVote) {
      setSelected(userVote);
    }
    
    // Load feedback stats
    if (showStats) {
      const stats = getHelpfulnessText(articleId);
      setFeedbackStats(stats);
    }
  }, [articleId, showStats]);

  const handleFeedback = (type: 'positive' | 'negative') => {
    setSelected(type);
    if (type === 'negative') {
      setShowForm(true);
    } else {
      submitFeedback(type);
    }
  };

  const submitFeedback = (type: 'positive' | 'negative', customReason?: string) => {
    // Store in localStorage
    const updatedFeedback = submitArticleFeedback(articleId, type);
    
    const feedback: FeedbackData = {
      articleId,
      matchId,
      feedbackType: type,
      reason: reason === 'other' ? otherReason : reason,
      timestamp: new Date().toISOString(),
    };

    if (onSubmit) {
      onSubmit(feedback);
    }

    toast.success('Bedankt voor uw feedback!');
    
    // Update stats display
    if (showStats) {
      const stats = getHelpfulnessText(articleId);
      setFeedbackStats(stats);
    }
    
    // Reset form but keep selection
    setTimeout(() => {
      setShowForm(false);
      setReason('');
      setOtherReason('');
    }, 1000);
  };

  const handleCancel = () => {
    setSelected(null);
    setShowForm(false);
    setReason('');
    setOtherReason('');
  };

  if (variant === 'compact') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleFeedback('positive')}
          className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
            selected === 'positive'
              ? 'bg-green-500 text-white'
              : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
          }`}
          title="Dit was nuttig"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleFeedback('negative')}
          className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
            selected === 'negative'
              ? 'bg-red-500 text-white'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
          title="Dit was niet nuttig"
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-[#374151]">Was deze koppeling correct?</span>
        <button
          onClick={() => handleFeedback('positive')}
          className={`flex items-center gap-2 px-4 h-11 rounded-lg font-medium transition-colors ${
            selected === 'positive'
              ? 'bg-green-500 text-white'
              : 'border border-gray-300 text-gray-700 hover:bg-green-50'
          }`}
        >
          <ThumbsUp className="w-5 h-5" />
          Ja
        </button>
        <button
          onClick={() => handleFeedback('negative')}
          className={`flex items-center gap-2 px-4 h-11 rounded-lg font-medium transition-colors ${
            selected === 'negative'
              ? 'bg-red-500 text-white'
              : 'border border-gray-300 text-gray-700 hover:bg-red-50'
          }`}
        >
          <ThumbsDown className="w-5 h-5" />
          Nee
        </button>
      </div>

      {/* Feedback Statistics */}
      {showStats && feedbackStats && (
        <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
          <p className="text-xs text-gray-500">{feedbackStats}</p>
        </div>
      )}

      {/* Expanded Form */}
      {showForm && selected === 'negative' && (
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
          <p className="text-sm font-medium text-[#374151] mb-3">Wat was er mis? (optioneel)</p>
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input
                type="radio"
                name="reason"
                value="wrong-parent"
                checked={reason === 'wrong-parent'}
                onChange={(e) => setReason(e.target.value)}
                className="w-5 h-5 text-[#0097DB] focus:ring-[#0097DB]"
              />
              <span className="text-sm text-[#374151]">Verkeerd CBS-artikel</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input
                type="radio"
                name="reason"
                value="no-cbs-data"
                checked={reason === 'no-cbs-data'}
                onChange={(e) => setReason(e.target.value)}
                className="w-5 h-5 text-[#0097DB] focus:ring-[#0097DB]"
              />
              <span className="text-sm text-[#374151]">Artikel gebruikt geen CBS-data</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input
                type="radio"
                name="reason"
                value="date-mismatch"
                checked={reason === 'date-mismatch'}
                onChange={(e) => setReason(e.target.value)}
                className="w-5 h-5 text-[#0097DB] focus:ring-[#0097DB]"
              />
              <span className="text-sm text-[#374151]">Datum komt niet overeen</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input
                type="radio"
                name="reason"
                value="theme-mismatch"
                checked={reason === 'theme-mismatch'}
                onChange={(e) => setReason(e.target.value)}
                className="w-5 h-5 text-[#0097DB] focus:ring-[#0097DB]"
              />
              <span className="text-sm text-[#374151]">Thema komt niet overeen</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="reason"
                value="other"
                checked={reason === 'other'}
                onChange={(e) => setReason(e.target.value)}
                className="w-5 h-5 text-[#0097DB] focus:ring-[#0097DB] mt-2"
              />
              <div className="flex-1">
                <span className="text-sm text-[#374151]">Anders:</span>
                {reason === 'other' && (
                  <input
                    type="text"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Beschrijf het probleem..."
                    className="w-full mt-2 h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097DB]"
                  />
                )}
              </div>
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 h-11 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuleren
            </button>
            <button
              onClick={() => submitFeedback('negative')}
              className="px-4 h-11 text-sm font-medium text-white bg-[#0097DB] rounded-lg hover:bg-[#007BB5] transition-colors"
            >
              Verzenden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}