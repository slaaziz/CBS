// Script to categorize articles based on content analysis
import { mockArticles, filterCategories } from '../data/mockData';

// Category keywords mapping
const categoryKeywords: Record<string, string[]> = {
  'Economie': ['economie', 'economisch', 'bbp', 'groei', 'inflatie', 'conjunctuur', 'omzet', 'faillissement', 'bedrijven', 'handel', 'export', 'import', 'financieel', 'investering', 'loonkosten', 'prijzen', 'markt'],
  'Arbeidsmarkt': ['werkloosheid', 'werkgelegenheid', 'banen', 'arbeid', 'zzp', 'zelfstandig', 'werk', 'loonsverhoging', 'salaris', 'vacature', 'personeel', 'werknemer', 'werkgever', 'uitzend'],
  'Demografie': ['bevolking', 'geboorte', 'sterfte', 'migratie', 'vergrijzing', 'inwoners', 'huishouden', 'demografisch', 'levensverwachting', 'immigratie', 'emigratie'],
  'Wonen': ['woning', 'woningmarkt', 'huis', 'huizen', 'hypotheek', 'huur', 'bouw', 'vastgoed', 'woonruimte', 'woningtekort', 'leefbaarheid', 'buurt'],
  'Energie': ['energie', 'gas', 'elektriciteit', 'aardgas', 'stroom', 'lng', 'energieprijzen', 'energietransitie', 'wind', 'zon', 'kolen', 'olie'],
  'Zorg': ['zorg', 'zorgsector', 'verpleeg', 'ziekenhuis', 'patient', 'medisch', 'gezondheid'],
  'Milieu': ['milieu', 'klimaat', 'co2', 'uitstoot', 'duurzaamheid', 'duurzaam', 'natuur', 'vervuiling', 'recycling', 'afval', 'stikstof', 'broeikas'],
  'Onderwijs': ['onderwijs', 'school', 'student', 'universiteit', 'opleiding', 'studie', 'leraar', 'docent', 'lesuur'],
  'Veiligheid': ['veiligheid', 'criminaliteit', 'overlast', 'politie', 'misdaad', 'diefstal', 'fraude', 'cybercrime', 'hack', 'gegevensmisbruik'],
  'Mobiliteit': ['verkeer', 'transport', 'auto', 'mobiliteit', 'vervoer', 'fiets', 'openbaar vervoer', 'trein', 'weg', 'straat'],
  'Landbouw': ['landbouw', 'boer', 'boeren', 'agrarisch', 'veeteelt', 'akkerbouw', 'glastuinbouw', 'gewas', 'oogst'],
  'Toerisme': ['toerisme', 'toerist', 'vakantie', 'recreatie', 'verblijf', 'hotel'],
  'Gezondheidszorg': ['gezondheid', 'corona', 'covid', 'virus', 'epidemie', 'pandemie', 'vaccinatie', 'levensverwachting', 'gezond', 'dieet', 'voeding', 'vegetarisch', 'vlees'],
  'Technologie': ['digitaal', 'internet', 'ict', 'digitalisering', 'computer', 'software', 'cyber', 'online', 'technologie', 'ai', 'data']
};

function categorizeArticle(article: any): string {
  const searchText = `${article.title} ${article.snippet} ${article.body} ${article.parentTitle || ''}`.toLowerCase();
  
  const scores: Record<string, number> = {};
  
  // Calculate scores for each category
  for (const category of filterCategories) {
    const keywords = categoryKeywords[category] || [];
    let score = 0;
    
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}`, 'gi');
      const matches = searchText.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    
    scores[category] = score;
  }
  
  // Find category with highest score
  let maxScore = 0;
  let bestCategory = 'Economie'; // Default category
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

// Process all articles
console.log('Categorizing articles...');
const categorizedArticles = mockArticles.map(article => {
  const category = categorizeArticle(article);
  return {
    ...article,
    category
  };
});

// Generate statistics
const categoryCounts: Record<string, number> = {};
categorizedArticles.forEach(article => {
  categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
});

console.log('\nCategory distribution:');
Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`${cat}: ${count} articles`);
});

// Export the result
export const categorizedMockArticles = categorizedArticles;
