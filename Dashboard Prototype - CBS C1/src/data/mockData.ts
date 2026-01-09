export interface Article {
  id: string;
  title: string;
  snippet: string;
  date: string;
  source: string;
  category: string;
  vertrouwensscore: number;
  body: string;
  tags: string[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keyThemes: string[];
}

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Klimaatbeleid Hervormingen Aangekondigd op Internationale Top',
    snippet: 'Wereldleiders komen overeen met ambitieuze doelstellingen voor CO2-reductie voor 2030, wat een belangrijke verschuiving in milieubeleid markeert.',
    date: '2025-11-15',
    source: 'Wereldwijd Beleidsoverzicht',
    category: 'Milieu',
    vertrouwensscore: 87,
    body: 'In een baanbrekende beslissing op de Internationale Klimaattop hebben vertegenwoordigers van 147 landen zich gecommitteerd aan ongekende doelstellingen voor CO2-reductie. De overeenkomst, die bindende doelen stelt voor de komende vijf jaar, vertegenwoordigt een cruciale stap voorwaarts in wereldwijd milieubeheer.\n\nBelangrijke bepalingen omvatten een vermindering van 45% in CO2-uitstoot tegen 2030, uitgebreide herbebossingsprogramma\'s en aanzienlijke investeringen in hernieuwbare energie-infrastructuur. Ontwikkelingslanden zullen technologische en financiële ondersteuning ontvangen om hun overgang naar duurzame energiebronnen te vergemakkelijken.\n\nDeskundigen hebben dit geprezen als een keerpunt, hoewel sommige critici beweren dat de doelen onvoldoende blijven om catastrofale klimaatverandering te voorkomen. Uitvoeringsmechanismen en handhavingsprotocollen zullen in de komende maanden worden afgerond.',
    tags: ['klimaat', 'beleid', 'internationaal', 'milieu'],
    sentiment: { positive: 65, neutral: 25, negative: 10 },
    keyThemes: ['CO2-reductie', 'Internationale Samenwerking', 'Hernieuwbare Energie', 'Beleidshervorming']
  },
  {
    id: '2',
    title: 'Techgiganten Geconfronteerd met Nieuw Regelgevingskader in Europa',
    snippet: 'Europese Commissie introduceert uitgebreide regelgeving voor digitale diensten die grote technologieplatforms beïnvloedt.',
    date: '2025-11-14',
    source: 'Technologiebeleid Journal',
    category: 'Technologie',
    vertrouwensscore: 82,
    body: 'De Europese Commissie heeft ingrijpende nieuwe regelgeving onthuld die fundamenteel zal hervormen hoe grote technologiebedrijven binnen de EU opereren. De Wet op Digitale Diensten en Markten stelt duidelijke richtlijnen vast voor platformbeheer, gegevensbescherming en concurrentiepraktijken.\n\nOnder het nieuwe kader zullen bedrijven die bepaalde gebruikersdrempels overschrijden worden aangemerkt als "poortwachters" en onderworpen aan verscherpt toezicht. Dit omvat vereisten voor gegevensportabiliteit, interoperabiliteitsnormen en beperkingen op zelfbevoordeling in zoekresultaten en app stores.\n\nReacties uit de industrie zijn gemengd, waarbij sommigen de duidelijkheid van de regelgeving prijzen terwijl anderen waarschuwen voor mogelijke innovatiebelemmeringen. Implementatie zal in fasen plaatsvinden gedurende de komende 18 maanden.',
    tags: ['technologie', 'regelgeving', 'europa', 'digitaal beleid'],
    sentiment: { positive: 40, neutral: 45, negative: 15 },
    keyThemes: ['Digitale Regelgeving', 'Concurrentiebeleid', 'Gegevensbescherming', 'Platformbeheer']
  },
  {
    id: '3',
    title: 'Gezondheidszorg Innovatie: AI Diagnostiek Toont Veelbelovende Resultaten',
    snippet: 'Nieuwe AI-aangedreven diagnostische hulpmiddelen tonen 94% nauwkeurigheid bij vroege ziekte-detectie over meerdere aandoeningen.',
    date: '2025-11-13',
    source: 'Medische Innovatie Vandaag',
    category: 'Gezondheidszorg',
    vertrouwensscore: 68,
    body: 'Een baanbrekende studie gepubliceerd in het Journal of Medical AI onthult dat machine learning-algoritmen nu vroege tekenen van ziekten met opmerkelijke nauwkeurigheid kunnen detecteren. Het onderzoek, uitgevoerd in 50 ziekenhuizen, testte diagnostische AI op meer dan 100.000 patiëntencases.\n\nDe AI-systemen toonden bijzonder veel belofte bij het identificeren van kanker in vroeg stadium, cardiovasculaire aandoeningen en neurologische stoornissen. Onderzoekers benadrukken dat deze hulpmiddelen zijn ontworpen om menselijke medische expertise aan te vullen, niet te vervangen.\n\nRegelgevende goedkeuringsprocessen zijn gaande in verschillende landen, met proefprogramma\'s die naar verwachting medio 2026 in grote medische centra van start gaan. Zorgprofessionals hebben voorzichtig optimisme geuit over het potentieel van de technologie om patiëntresultaten te verbeteren.',
    tags: ['gezondheidszorg', 'AI', 'medische technologie', 'diagnostiek'],
    sentiment: { positive: 75, neutral: 20, negative: 5 },
    keyThemes: ['Medische AI', 'Vroege Detectie', 'Gezondheidszorg Innovatie', 'Klinische Onderzoeken']
  },
  {
    id: '4',
    title: 'Economische Groei-indicatoren Wijzen op Gematigde Expansie',
    snippet: 'Derde kwartaal BBP-gegevens tonen gestage groei over grote economieën ondanks aanhoudende uitdagingen.',
    date: '2025-11-12',
    source: 'Economisch Kwartaalblad',
    category: 'Economie',
    vertrouwensscore: 72,
    body: 'Recente economische gegevens wijzen op aanhoudende gematigde groei over ontwikkelde economieën, met een BBP-expansie van gemiddeld 2,3% in Q3 2025. Dit vertegenwoordigt een stabiel traject ondanks aanhoudende inflatieproblemen en geopolitieke onzekerheden.\n\nConsumentenbestedingen blijven robuust in de meeste sectoren, met name in diensten en technologie. De productie-output vertoont echter gemengde signalen, waarbij sommige industrieën te maken hebben met beperkingen in de toeleveringsketen.\n\nCentrale banken handhaven hun huidige beleidskoersen, waarbij zij zorgvuldig de groeidoelstellingen afwegen tegen inflatie-beheersing. Economen voorspellen aanhoudende gematigde expansie tot en met 2026, hoewel risico\'s verhoogd blijven.',
    tags: ['economie', 'BBP', 'groei', 'markten'],
    sentiment: { positive: 55, neutral: 40, negative: 5 },
    keyThemes: ['Economische Groei', 'BBP', 'Consumentenbestedingen', 'Monetair Beleid']
  },
  {
    id: '5',
    title: 'Onderwijshervorming Initiatief Richt zich op Digitale Geletterdheid',
    snippet: 'Nationaal programma beoogt uitgebreide training in digitale vaardigheden te integreren in het K-12 curriculum.',
    date: '2025-11-11',
    source: 'Onderwijsbeleid Vandaag',
    category: 'Onderwijs',
    vertrouwensscore: 65,
    body: 'Een nieuw nationaal initiatief beoogt het onderwijs in digitale geletterdheid op scholen te transformeren, waarbij het kritieke belang van technologische vaardigheden in de moderne arbeidsmarkt wordt erkend. Het programma zal de komende drie jaar worden uitgerold over 15.000 scholen.\n\nHet curriculum benadrukt niet alleen technische vaardigheid, maar ook kritische evaluatie van digitale informatie, online veiligheid en ethisch technologiegebruik. Lerarenopleidingsprogramma\'s zullen de uitrol begeleiden om effectieve implementatie te waarborgen.\n\nVroege proefprogramma\'s hebben veelbelovende resultaten getoond, waarbij studenten verbeterde analytische vaardigheden en digitaal vertrouwen demonstreerden. Financiering is toegewezen via een combinatie van federale subsidies en partnerschappen met de particuliere sector.',
    tags: ['onderwijs', 'digitale geletterdheid', 'curriculum', 'beleid'],
    sentiment: { positive: 80, neutral: 15, negative: 5 },
    keyThemes: ['Digitale Geletterdheid', 'Onderwijshervorming', 'K-12 Beleid', 'Lerarenopleiding']
  },
  {
    id: '6',
    title: 'Infrastructuur Investeringsplan Goedgekeurd voor Metropool Regio\'s',
    snippet: 'Uitgebreide transport- en nutsupgrades gepland voor implementatie in grote stedelijke gebieden.',
    date: '2025-11-10',
    source: 'Stedelijke Ontwikkeling Review',
    category: 'Infrastructuur',
    vertrouwensscore: 78,
    body: 'Een baanbrekende infrastructuurwet is goedgekeurd, waarbij aanzienlijke financiering wordt toegewezen voor transportnetwerken, watersystemen en breedbanduitbreiding in metropolitane gebieden. Het programma van $450 miljard vertegenwoordigt een van de grootste infrastructuurinvesteringen in de recente geschiedenis.\n\nBelangrijke componenten omvatten modernisering van openbaar vervoerssystemen, brug- en wegenreparaties, uitbreiding van laadnetwerken voor elektrische voertuigen en upgrade van verouderde waterinfrastructuur. Toegang tot breedband op het platteland wordt ook geprioriteerd om de digitale kloof aan te pakken.\n\nProjecttijdlijnen strekken zich uit over zeven jaar, met schattingen van banengroei van meer dan 2 miljoen arbeidsplaatsen. Implementatie zal worden gecoördineerd via federale, staats- en lokale partnerschappen.',
    tags: ['infrastructuur', 'transport', 'stedelijke ontwikkeling', 'investering'],
    sentiment: { positive: 70, neutral: 25, negative: 5 },
    keyThemes: ['Infrastructuur Investering', 'Transport', 'Stedelijke Ontwikkeling', 'Banengroei']
  },
  {
    id: '7',
    title: 'Hernieuwbare Energie Capaciteit Bereikt Nieuwe Mijlpaal',
    snippet: 'Zonne- en windinstallaties overtreffen conventionele energiebronnen in nieuwe capaciteitstoevoegingen voor het eerst.',
    date: '2025-11-09',
    source: 'Energie Transitie Monitor',
    category: 'Energie',
    vertrouwensscore: 91,
    body: 'De hernieuwbare energiesector heeft een historische mijlpaal bereikt, waarbij nieuwe zonne- en windinstallaties goed zijn voor 65% van alle nieuwe stroomopwekkingscapaciteit die dit jaar wereldwijd is toegevoegd. Dit markeert een fundamentele verschuiving in het energielandschap.\n\nKostenverlagingen in zonnepanelen en windturbines, gecombineerd met verbeterde energieopslagoplossingen, hebben hernieuwbare energie steeds concurrerender gemaakt met fossiele brandstoffen. Verschillende regio\'s genereren nu meer dan 50% van hun elektriciteit uit hernieuwbare bronnen.\n\nIndustrie-analisten voorspellen voortdurende snelle groei, waarbij hernieuwbare energie naar verwachting nieuwe capaciteitstoevoegingen zal domineren voor de nabije toekomst. Grid-moderniseringsinspanningen zijn gaande om de variabele aard van hernieuwbare energiebronnen te accommoderen.',
    tags: ['hernieuwbare energie', 'zonne-energie', 'windenergie', 'klimaat'],
    sentiment: { positive: 85, neutral: 12, negative: 3 },
    keyThemes: ['Hernieuwbare Energie', 'Zonne-energie', 'Windenergie', 'Energie Transitie']
  },
  {
    id: '8',
    title: 'Cybersecurity Bedreigingen Evolueren met Nieuwe Aanvalsvectoren',
    snippet: 'Beveiligingsonderzoekers identificeren opkomende bedreigingspatronen gericht op kritieke infrastructuur en financiële systemen.',
    date: '2025-11-08',
    source: 'Cybersecurity Inzichten',
    category: 'Technologie',
    vertrouwensscore: 58,
    body: 'Recente analyses van toonaangevende cybersecurity-bedrijven onthullen steeds geavanceerdere aanvalsmethoden die door dreigingsactoren worden gebruikt. De rapporten benadrukken bijzondere zorgen over kwetsbaarheden in kritieke infrastructuur en financiële systeembeveiliging.\n\nAI-aangedreven aanvalshulpmiddelen maken efficiëntere identificatie van beveiligingszwaktes mogelijk, terwijl social engineering-tactieken blijven evolueren. Organisaties reageren met verbeterde beveiligingsprotocollen en medewerkeropleidingsprogramma\'s.\n\nOverheidsinstanties en leiders uit de particuliere sector werken samen aan verbeterde uitwisseling van bedreigingsinformatie en gecoördineerde responsframeworks. Investering in cybersecurity-infrastructuur zal naar verwachting aanzienlijk toenemen in het komende begrotingsjaar.',
    tags: ['cybersecurity', 'technologie', 'infrastructuur', 'bedreigingen'],
    sentiment: { positive: 20, neutral: 50, negative: 30 },
    keyThemes: ['Cybersecurity', 'Kritieke Infrastructuur', 'Bedreigingsinformatie', 'AI Beveiliging']
  },
  {
    id: '9',
    title: 'Landbouw Innovatie Pakt Voedselzekerheid Uitdagingen Aan',
    snippet: 'Geavanceerde landbouwtechnieken en gewasrassen tonen potentieel om opbrengsten te verhogen terwijl milieu-impact wordt verminderd.',
    date: '2025-11-07',
    source: 'Landbouw Wetenschap Journal',
    category: 'Landbouw',
    vertrouwensscore: 70,
    body: 'Baanbrekende ontwikkelingen in landbouwwetenschap bieden nieuwe oplossingen voor mondiale voedselzekerheiduitdagingen. Innovaties omvatten droogteresistente gewasrassen, precisie-landbouwtechnologieën en duurzame bodembeheersingspraktijken.\n\nVeldproeven hebben opbrengstverhogingen van 20-30% aangetoond terwijl tegelijkertijd waterverbruik en gebruik van chemische meststoffen werden verminderd. Deze vooruitgang is bijzonder significant voor regio\'s die te maken hebben met klimaatgerelateerde landbouwstress.\n\nInternationale landbouworganisaties werken eraan om deze technologieën toegankelijk te maken voor kleinschalige boeren in ontwikkelingslanden. Opleidingsprogramma\'s en infrastructuurondersteuning worden ontwikkeld om adoptie te vergemakkelijken.',
    tags: ['landbouw', 'voedselzekerheid', 'innovatie', 'duurzaamheid'],
    sentiment: { positive: 78, neutral: 18, negative: 4 },
    keyThemes: ['Landbouw Innovatie', 'Voedselzekerheid', 'Duurzaamheid', 'Klimaat Aanpassing']
  },
  {
    id: '10',
    title: 'Stedenbouwkundige Strategieën Richten zich op Duurzame Ontwikkeling',
    snippet: 'Steden wereldwijd nemen nieuwe kaders aan met nadruk op groene ruimtes, openbaar vervoer en gemengd gebruik ontwikkeling.',
    date: '2025-11-06',
    source: 'Stedenbouw Review',
    category: 'Stedelijke Ontwikkeling',
    vertrouwensscore: 45,
    body: 'Een groeiend aantal steden implementeert uitgebreide stedenbouwkundige strategieën die duurzaamheid, leefbaarheid en gemeenschapsbetrokkenheid prioriteit geven. Deze benaderingen vertegenwoordigen een verschuiving weg van auto-centrische ontwikkelingsmodellen.\n\nBelangrijke elementen omvatten uitbreiding van groene ruimtes, ontwikkeling van voetgangersvriendelijke buurten, investering in openbaar vervoer en bevordering van gemengd gebruik zoning. Verschillende proefprojecten hebben positieve resultaten getoond op het gebied van verminderde emissies en verbeterde levenskwaliteit.\n\nUitdagingen blijven bestaan rond de financiering van deze transformaties en het beheer van de overgangsperiode. Stedenbouwkundigen delen best practices via internationale netwerken om adoptie van succesvolle strategieën te versnellen.',
    tags: ['stedenbouw', 'duurzaamheid', 'ontwikkeling', 'steden'],
    sentiment: { positive: 72, neutral: 23, negative: 5 },
    keyThemes: ['Stedenbouw', 'Duurzame Ontwikkeling', 'Groene Ruimtes', 'Openbaar Vervoer']
  },
  {
    id: '11',
    title: 'Financiële Markten Reageren op Centrale Bank Beleidsignalen',
    snippet: 'Investeerders passen strategieën aan naar aanleiding van hints over mogelijke monetaire beleidsverschuivingen in grote economieën.',
    date: '2025-11-05',
    source: 'Marktanalyse Wekelijks',
    category: 'Financiën',
    vertrouwensscore: 52,
    body: 'Mondiale financiële markten hebben deze week verhoogde gevoeligheid getoond voor communicatie van centrale banken, waarbij investeerders verklaringen analyseren voor indicaties van toekomstige beleidsrichting. Commentaren van Federal Reserve en ECB-functionarissen hebben opmerkelijke marktbewegingen veroorzaakt.\n\nObligatierendementen zijn aangepast als reactie op waargenomen verschuivingen in de inflatie-outlook, terwijl aandelenmarkten sectorrotatie hebben vertoond terwijl investeerders portefeuilles herpositioneren. Valutamarkten hebben toegenomen volatiliteit ervaren.\n\nAnalisten benadrukken het belang van datagestuurde beleidsbeslissingen en waarschuwen tegen overinterpretatie van individuele verklaringen. Marktdeelnemers volgen aankomende economische indicatoren nauwlettend voor verdere begeleiding.',
    tags: ['financiën', 'markten', 'monetair beleid', 'centrale banken'],
    sentiment: { positive: 35, neutral: 55, negative: 10 },
    keyThemes: ['Monetair Beleid', 'Financiële Markten', 'Centrale Banken', 'Investeringsstrategie']
  },
  {
    id: '12',
    title: 'Ruimtevaart Initiatieven Treden Nieuwe Fase Binnen',
    snippet: 'Meerdere agentschappen en particuliere bedrijven kondigen gecoördineerde inspanningen aan voor maan- en Marsmissies.',
    date: '2025-11-04',
    source: 'Ruimtetechnologie Vandaag',
    category: 'Ruimtevaart',
    vertrouwensscore: 48,
    body: 'De ruimteverkenningsgemeenschap heeft ambitieuze plannen onthuld voor het komende decennium, met ongekende samenwerking tussen overheidsinstanties en partners uit de particuliere sector. De initiatieven omvatten ontwikkeling van maanbases en voorbereidende Mars verkenningsmissies.\n\nTechnologische vooruitgang in voortstuwingssystemen, levensondersteuning en habitatconstructie maken deze uitgebreide doelstellingen mogelijk. Internationale samenwerkingsframeworks worden opgezet om activiteiten te coördineren en middelen te delen.\n\nHoewel tijdlijnen onderhevig blijven aan technische en budgettaire beperkingen, markeert het niveau van gecoördineerde planning een belangrijke stap voorwaarts. Educatieve en wetenschappelijke voordelen worden verwacht zich ruim uit te strekken voorbij de directe missiedoelstellingen.',
    tags: ['ruimtevaart', 'verkenning', 'technologie', 'wetenschap'],
    sentiment: { positive: 88, neutral: 10, negative: 2 },
    keyThemes: ['Ruimtevaart Verkenning', 'Internationale Samenwerking', 'Technologie Ontwikkeling', 'Wetenschappelijk Onderzoek']
  }
];

export const filterCategories = [
  'Milieu',
  'Technologie',
  'Gezondheidszorg',
  'Economie',
  'Onderwijs',
  'Infrastructuur',
  'Energie',
  'Landbouw',
  'Stedelijke Ontwikkeling',
  'Financiën',
  'Ruimtevaart'
];

export const filterSources = [
  'Wereldwijd Beleidsoverzicht',
  'Technologiebeleid Journal',
  'Medische Innovatie Vandaag',
  'Economisch Kwartaalblad',
  'Onderwijsbeleid Vandaag',
  'Stedelijke Ontwikkeling Review',
  'Energie Transitie Monitor',
  'Cybersecurity Inzichten',
  'Landbouw Wetenschap Journal',
  'Stedenbouw Review',
  'Marktanalyse Wekelijks',
  'Ruimtetechnologie Vandaag'
];

export const filterTimeRanges = [
  { label: 'Laatste 24 uur', value: '24h' },
  { label: 'Laatste 7 dagen', value: '7d' },
  { label: 'Laatste 30 dagen', value: '30d' },
  { label: 'Laatste 90 dagen', value: '90d' },
  { label: 'Alle tijd', value: 'all' }
];

export const filterThemes = [
  'Beleidshervorming',
  'Innovatie',
  'Duurzaamheid',
  'Internationale Samenwerking',
  'Economische Groei',
  'Digitale Transformatie',
  'Klimaat Actie',
  'Volksgezondheid',
  'Infrastructuur Ontwikkeling',
  'Toegang tot Onderwijs'
];