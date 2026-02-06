import { Article } from '../data/mockData';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ImpactBadgeProps {
  score: number;
}

export function ImpactBadge({ score }: ImpactBadgeProps) {
  // Determine color, icon, and label based on score
  const getBadgeInfo = (score: number) => {
    if (score >= 90) {
      return {
        color: 'bg-green-50 text-green-700 border-green-300',
        icon: CheckCircle,
        label: 'Zeer Hoog'
      };
    }
    if (score >= 80) {
      return {
        color: 'bg-blue-50 text-blue-700 border-blue-300',
        icon: CheckCircle,
        label: 'Hoog'
      };
    }
    if (score >= 70) {
      return {
        color: 'bg-yellow-50 text-yellow-700 border-yellow-300',
        icon: AlertCircle,
        label: 'Gemiddeld'
      };
    }
    if (score >= 50) {
      return {
        color: 'bg-amber-50 text-amber-700 border-amber-300',
        icon: AlertCircle,
        label: 'Matig'
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