import { Info, Check } from 'lucide-react';

interface MatchExplanationProps {
  vertrouwensscore: number;
  sharedKeywords: string[];
  dateMatch: string;
  numericalData: string[];
  theme: string;
  onFeedback?: () => void;
}

export function MatchExplanation({
  vertrouwensscore,
  sharedKeywords,
  dateMatch,
  numericalData,
  theme,
  onFeedback,
}: MatchExplanationProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-6 h-6 rounded-full bg-[#E6F5FC] flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 text-[#0097DB]" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[#111827] mb-1">
            Waarom dit artikel is gekoppeld
          </h3>
          <div className="text-2xl font-bold text-[#0097DB] mt-2">
            Vertrouwensscore: {vertrouwensscore}%
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Shared Keywords */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#374151] mb-2">
              Gedeelde trefwoorden ({sharedKeywords.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {sharedKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#F3F4F6] text-[#374151] text-sm rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Date Match */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#374151] mb-1">Datum overeenkomst:</p>
            <p className="text-sm text-[#6B7280]">{dateMatch}</p>
          </div>
        </div>

        {/* Numerical Data */}
        {numericalData.length > 0 && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[#374151] mb-2">
                Numerieke data:
              </p>
              <p className="text-sm text-[#6B7280]">
                {numericalData.length} cijfers komen overeen ({numericalData.join(', ')})
              </p>
            </div>
          </div>
        )}

        {/* Theme */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#374151] mb-1">Thema:</p>
            <p className="text-sm text-[#6B7280]">{theme}</p>
          </div>
        </div>
      </div>

      {/* Feedback Button */}
      {onFeedback && (
        <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
          <button
            onClick={onFeedback}
            className="px-4 h-10 text-sm font-medium text-[#0097DB] bg-[#E6F5FC] rounded-lg hover:bg-[#CCE9F7] transition-colors"
          >
            Feedback geven
          </button>
        </div>
      )}
    </div>
  );
}
