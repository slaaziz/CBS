# How to Automatically Categorize Articles

Your articles are showing "Uncategorized" because the CSV data doesn't have category information. Here's how to fix it:

## Option 1: Quick Manual Fix (Recommended)

Copy this JavaScript code and run it in your browser console while viewing your app:

```javascript
// This will categorize articles in memory (client-side only)
// Add this to a component that processes articles before display

const categoryKeywords = {
  'Economie': /economie|economisch|bbp|groei|inflatie|conjunctuur|omzet|faillissement|bedrijven|handel|export|import|financieel|investering|loonkosten|prijzen|markt|afzet/i,
  'Arbeidsmarkt': /werkloosheid|werkgelegenheid|banen|arbeid|zzp|zelfstandig|werk|loonsverhoging|salaris|vacature|personeel|werknemer|werkgever|uitzend|beroep/i,
  'Demografie': /bevolking|geboorte|sterfte|migratie|vergrijzing|inwoners|huishouden|demografisch|levensverwachting|immigratie|emigratie/i,
  'Wonen': /woning|woningmarkt|huis|huizen|hypotheek|huur|bouw|vastgoed|woonruimte|woningtekort|leefbaarheid|buurt|wonen/i,
  'Energie': /energie|gas|elektriciteit|aardgas|stroom|lng|energieprijzen|energietransitie|wind|zon|kolen|olie|energieverbruik/i,
  'Zorg': /zorg|zorgsector|verpleeg|ziekenhuis|patient|medisch/i,
  'Milieu': /milieu|klimaat|co2|uitstoot|duurzaamheid|duurzaam|natuur|vervuiling|recycling|afval|stikstof|broeikas|certificaat|hout|palmolie|agro-grondstof/i,
  'Onderwijs': /onderwijs|school|student|universiteit|opleiding|studie|leraar|docent|lesuur|vaardigheid|digitale vaardigheid/i,
  'Veiligheid': /veiligheid|criminaliteit|overlast|politie|misdaad|diefstal|fraude|cybercrime|hack|gegevensmisbruik|woonoverlast|maffia/i,
  'Mobiliteit': /verkeer|transport|auto|mobiliteit|vervoer|fiets|openbaar vervoer|trein|weg|straat|motor/i,
  'Landbouw': /landbouw|boer|boeren|agrarisch|veeteelt|akkerbouw|glastuinbouw|gewas|oogst/i,
  'Toerisme': /toerisme|toerist|vakantie|recreatie|verblijf|hotel/i,
  'Gezondheidszorg': /gezondheid|corona|covid|virus|epidemie|pandemie|vaccinatie|levensverwachting|gezond|dieet|voeding|vegetarisch|vlees|eten|maaltijd/i,
  'Technologie': /digitaal|internet|ict|digitalisering|computer|software|cyber|online|technologie|ai|data|informatie|communicatie/i
};

function categorizeArticle(article) {
  const searchText = `${article.title} ${article.snippet} ${article.body} ${article.parentTitle || ''}`;
  
  let bestCategory = 'Economie';
  let maxMatches = 0;
  
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

// Apply to all articles
mockArticles = mockArticles.map(article => ({
  ...article,
  category: categorizeArticle(article)
}));
```

## Option 2: Create a Client-Side Helper Component

I've created a helper script at `/scripts/updateCategories.js` that you can use.

To run it:

1. Make sure you have Node.js installed
2. Navigate to your project directory
3. Run: `node scripts/updateCategories.js`

This will update your mockData.ts file with proper categories.

## Option 3: Runtime Categorization (Easiest)

Add this utility function to your project and use it to categorize articles at runtime:

Create `/utils/categorizeArticle.ts`:

```typescript
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
  'Onderwijs': /onderwijs|school|student|universiteit|opleiding|studie|leraar|docent/i,
  'Mobiliteit': /verkeer|transport|auto|mobiliteit|vervoer|fiets|trein|weg|straat|motor/i,
  'Landbouw': /landbouw|boer|agrarisch|veeteelt|akkerbouw|glastuinbouw|gewas|oogst/i,
  'Toerisme': /toerisme|toerist|vakantie|recreatie|verblijf|hotel/i,
  'Zorg': /zorg|zorgsector|verpleeg|ziekenhuis|patient|medisch/i
};

export function categorizeArticle(article: Article): string {
  if (article.category && article.category !== 'Uncategorized') {
    return article.category;
  }
  
  const searchText = `${article.title} ${article.snippet} ${article.body} ${article.parentTitle || ''}`;
  
  let bestCategory = 'Economie';
  let maxMatches = 0;
  
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
```

Then import and use it in components:

```typescript
import { mockArticles } from '../data/mockData';
import { categorizeArticles } from '../utils/categorizeArticle';

const categorizedArticles = categorizeArticles(mockArticles);
```

## Why This Happened

Your CSV data doesn't include category information, so all articles defaulted to "Uncategorized". The categorization needs to be done based on article content analysis.
