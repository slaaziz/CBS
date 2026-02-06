// Node.js script to update article categories in mockData.ts
const fs = require('fs');
const path = require('path');

// Category keywords mapping
const categoryKeywords = {
  'Economie': ['economie', 'economisch', 'bbp', 'groei', 'inflatie', 'conjunctuur', 'omzet', 'faillissement', 'bedrijven', 'handel', 'export', 'import', 'financieel', 'investering', 'loonkosten', 'prijzen', 'markt', 'afzet'],
  'Arbeidsmarkt': ['werkloosheid', 'werkgelegenheid', 'banen', 'arbeid', 'zzp', 'zelfstandig', 'werk', 'loonsverhoging', 'salaris', 'vacature', 'personeel', 'werknemer', 'werkgever', 'uitzend', 'beroep'],
  'Demografie': ['bevolking', 'geboorte', 'sterfte', 'migratie', 'vergrijzing', 'inwoners', 'huishouden', 'demografisch', 'levensverwachting', 'immigratie', 'emigratie'],
  'Wonen': ['woning', 'woningmarkt', 'huis', 'huizen', 'hypotheek', 'huur', 'bouw', 'vastgoed', 'woonruimte', 'woningtekort', 'leefbaarheid', 'buurt', 'wonen'],
  'Energie': ['energie', 'gas', 'elektriciteit', 'aardgas', 'stroom', 'lng', 'energieprijzen', 'energietransitie', 'wind', 'zon', 'kolen', 'olie', 'energieverbruik'],
  'Zorg': ['zorg', 'zorgsector', 'verpleeg', 'ziekenhuis', 'patient', 'medisch'],
  'Milieu': ['milieu', 'klimaat', 'co2', 'uitstoot', 'duurzaamheid', 'duurzaam', 'natuur', 'vervuiling', 'recycling', 'afval', 'stikstof', 'broeikas', 'certificaat', 'hout', 'palmolie', 'agro-grondstof'],
  'Onderwijs': ['onderwijs', 'school', 'student', 'universiteit', 'opleiding', 'studie', 'leraar', 'docent', 'lesuur', 'vaardigheid', 'digitale vaardigheid'],
  'Veiligheid': ['veiligheid', 'criminaliteit', 'overlast', 'politie', 'misdaad', 'diefstal', 'fraude', 'cybercrime', 'hack', 'gegevensmisbruik', 'woonoverlast', 'maffia'],
  'Mobiliteit': ['verkeer', 'transport', 'auto', 'mobiliteit', 'vervoer', 'fiets', 'openbaar vervoer', 'trein', 'weg', 'straat', 'motor'],
  'Landbouw': ['landbouw', 'boer', 'boeren', 'agrarisch', 'veeteelt', 'akkerbouw', 'glastuinbouw', 'gewas', 'oogst'],
  'Toerisme': ['toerisme', 'toerist', 'vakantie', 'recreatie', 'verblijf', 'hotel'],
  'Gezondheidszorg': ['gezondheid', 'corona', 'covid', 'virus', 'epidemie', 'pandemie', 'vaccinatie', 'levensverwachting', 'gezond', 'dieet', 'voeding', 'vegetarisch', 'vlees', 'eten', 'maaltijd'],
  'Technologie': ['digitaal', 'internet', 'ict', 'digitalisering', 'computer', 'software', 'cyber', 'online', 'technologie', 'ai', 'data', 'informatie', 'communicatie']
};

const filterCategories = [
  'Economie',
  'Arbeidsmarkt',
  'Demografie',
  'Wonen',
  'Energie',
  'Zorg',
  'Milieu',
  'Onderwijs',
  'Veiligheid',
  'Mobiliteit',
  'Landbouw',
  'Toerisme',
  'Gezondheidszorg',
  'Technologie'
];

function categorizeArticle(article) {
  const searchText = `${article.title || ''} ${article.snippet || ''} ${article.body || ''} ${article.parentTitle || ''}`.toLowerCase();
  
  const scores = {};
  
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

// Read the mockData.ts file
const mockDataPath = path.join(__dirname, '../data/mockData.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

// Parse articles from the file using regex
const articlesMatch = content.match(/export const mockArticles: Article\[\] = \[([\s\S]*?)\];/);
if (!articlesMatch) {
  console.error('Could not find mockArticles in file');
  process.exit(1);
}

// Update categories in the content
let updatedContent = content;
let replacementCount = 0;

// Use regex to find and replace each "category": "Uncategorized"
updatedContent = updatedContent.replace(
  /"category":\s*"Uncategorized"/g,
  (match, offset) => {
    // Find the article object containing this category
    // Look backwards to find the opening brace
    const beforeMatch = updatedContent.substring(0, offset);
    const articleStart = beforeMatch.lastIndexOf('{');
    const articleEnd = updatedContent.indexOf('}', offset) + 1;
    const articleText = updatedContent.substring(articleStart, articleEnd);
    
    // Extract article data
    const idMatch = articleText.match(/"id":\s*"([^"]+)"/);
    const titleMatch = articleText.match(/"title":\s*"([^"]+)"/);
    const snippetMatch = articleText.match(/"snippet":\s*"([^"]+)"/);
    const bodyMatch = articleText.match(/"body":\s*"([^"]+)"/);
    const parentTitleMatch = articleText.match(/"parentTitle":\s*"([^"]+)"/);
    
    if (!titleMatch) return match;
    
    const article = {
      id: idMatch ? idMatch[1] : '',
      title: titleMatch[1],
      snippet: snippetMatch ? snippetMatch[1] : '',
      body: bodyMatch ? bodyMatch[1] : '',
      parentTitle: parentTitleMatch ? parentTitleMatch[1] : ''
    };
    
    const category = categorizeArticle(article);
    replacementCount++;
    
    if (replacementCount <= 10) {
      console.log(`Article "${article.title.substring(0, 50)}..." → ${category}`);
    }
    
    return `"category": "${category}"`;
  }
);

// Write back to file
fs.writeFileSync(mockDataPath, updatedContent, 'utf8');

console.log(`\n✓ Updated ${replacementCount} articles with categories`);
console.log('\nCategory assignment complete!');
