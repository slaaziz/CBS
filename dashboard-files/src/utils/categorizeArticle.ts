import { Article } from '../data/mockData';

const categoryKeywords: Record<string, RegExp> = {
  'Economie': /economie|economisch|bbp|groei|inflatie|conjunctuur|omzet|faillissement|bedrijven|handel|export|import|financieel|investering|loonkosten|prijzen|markt|afzet/i,
  'Arbeidsmarkt': /werkloosheid|werkgelegenheid|banen|arbeid|zzp|zelfstandig|werk|loonsverhoging|salaris|vacature|personeel|werknemer|werkgever|uitzend|beroep/i,
  'Demografie': /bevolking|geboorte|sterfte|migratie|vergrijzing|inwoners|huishouden|demografisch|levensverwachting|immigratie|emigratie/i,
  'Wonen': /woning|woningmarkt|huis|huizen|hypotheek|huur|bouw|vastgoed|woonruimte|woningtekort|leefbaarheid|buurt|wonen/i,
  'Energie': /energie|gas|elektriciteit|aardgas|stroom|lng|energieprijzen|energietransitie|wind|zon|kolen|olie|energieverbruik/i,
  'Veiligheid': /veiligheid|criminaliteit|overlast|politie|misdaad|diefstal|fraude|cybercrime|hack|gegevensmisbruik|woonoverlast|maffia/i,
  'Milieu': /milieu|klimaat|co2|uitstoot|duurzaamheid|duurzaam|natuur|vervuiling|recycling|afval|stikstof|broeikas|certificaat|hout|palmolie|agro/i,
  'Gezondheidszorg': /gezondheid|corona|covid|virus|epidemie|pandemie|vaccinatie|levensverwachting|gezond|dieet|voeding|vegetarisch|vlees|eten|maaltijd/i,
  'Technologie': /digitaal|internet|ict|digitalisering|computer|software|cyber|online|technologie|ai|data|informatie|communicatie/i,
  'Onderwijs': /onderwijs|school|student|universiteit|opleiding|studie|leraar|docent|vaardigheid/i,
  'Mobiliteit': /verkeer|transport|auto|mobiliteit|vervoer|fiets|trein|weg|straat|motor/i,
  'Landbouw': /landbouw|boer|agrarisch|veeteelt|akkerbouw|glastuinbouw|gewas|oogst/i,
  'Toerisme': /toerisme|toerist|vakantie|recreatie|verblijf|hotel/i,
  'Zorg': /zorg|zorgsector|verpleeg|ziekenhuis|patient|medisch/i
};

export function categorizeArticle(article: Article): string {
  // If already categorized (not Uncategorized), return existing category
  if (article.category && article.category !== 'Uncategorized') {
    return article.category;
  }
  
  const searchText = `${article.title} ${article.snippet} ${article.body} ${article.parentTitle || ''}`;
  
  let bestCategory = 'Economie'; // Default category
  let maxMatches = 0;
  
  // Find category with most keyword matches
  for (const [category, regex] of Object.entries(categoryKeywords)) {
    const matches = searchText.match(new RegExp(regex.source, 'gi'));
    const count = matches ? matches.length : 0;
    
    if (count > maxMatches) {
      maxMatches = count;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

export function categorizeArticles(articles: Article[]): Article[] {
  return articles.map(article => ({
    ...article,
    category: categorizeArticle(article)
  }));
}
