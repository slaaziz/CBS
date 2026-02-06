import { Article } from '../data/mockData';
import { useNavigate } from 'react-router';
import { ImpactBadge } from './ImpactBadge';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${article.id}`);
  };

  // Format date to dd-mm-yyyy
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Onbekend';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <tr 
      onClick={handleClick}
      className="border-b border-gray-200 hover:bg-[#F5F5F5] cursor-pointer transition-colors"
    >
      <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
        {formatDate(article.date)}
      </td>
      <td className="py-4 px-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-[#1C3664] hover:text-[#0097DB]">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-1">
            {article.snippet || 'Geen samenvatting beschikbaar'}
          </p>
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <ImpactBadge score={article.vertrouwensscore} />
      </td>
    </tr>
  );
}