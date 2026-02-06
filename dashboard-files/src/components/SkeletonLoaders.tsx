export function SkeletonArticleCard() {
  return (
    <tr className="border-b border-gray-200 animate-pulse">
      <td className="py-4 px-6">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </td>
      <td className="py-4 px-6">
        <div className="space-y-2">
          <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="flex gap-2 mt-3">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex justify-end">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );
}

export function SkeletonCardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded mb-4"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonNetworkGraph() {
  return (
    <div className="w-full h-[600px] bg-white rounded-lg shadow-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#0097DB] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500">Netwerk wordt geladen...</p>
      </div>
    </div>
  );
}

export function SkeletonFilterSection() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
