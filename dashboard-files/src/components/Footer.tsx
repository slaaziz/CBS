export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="mx-auto px-20 py-6">
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex gap-8">
            <a href="#" className="hover:text-gray-900 transition-colors">Over</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Voorwaarden</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
          <div>
            © 2025 Insight Navigator. Alle rechten voorbehouden.
          </div>
        </div>
      </div>
    </footer>
  );
}