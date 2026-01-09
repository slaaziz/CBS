import { Article } from '../data/mockData';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ImpactBadgeProps {
  score: number;
}

export function ImpactBadge({ score }: ImpactBadgeProps) {
  // Determine color, icon, and label based on score
  const getBadgeInfo = (score: number) => {
    if (score >= 75) {
      return {
        color: 'bg-green-50 text-green-700 border-green-300',
        icon: CheckCircle,
        label: 'Hoog'
      };
    }
    if (score >= 50) {
      return {
        color: 'bg-amber-50 text-amber-700 border-amber-300',
        icon: AlertCircle,
        label: 'Gemiddeld'
      };
    }
    return {
      color: 'bg-red-50 text-red-700 border-red-300',
      icon: XCircle,
      label: 'Laag'
    };
  };

  const badgeInfo = getBadgeInfo(score);
  const Icon = badgeInfo.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${badgeInfo.color}`}>
      <Icon className="w-4 h-4" />
      <span className="font-semibold">{score}%</span>
    </span>
  );
}