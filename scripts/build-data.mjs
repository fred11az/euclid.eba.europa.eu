import fs from 'node:fs';

const LOCALES = ['en', 'fr', 'de', 'it', 'pt', 'es', 'ar'];

/* ------------------------------------------------------------------ */
/* Country names                                                       */
/* ------------------------------------------------------------------ */
const COUNTRIES = {
  AT: ['Austria', 'Autriche', 'Österreich', 'Austria', 'Áustria', 'Austria', 'النمسا'],
  BE: ['Belgium', 'Belgique', 'Belgien', 'Belgio', 'Bélgica', 'Bélgica', 'بلجيكا'],
  BG: ['Bulgaria', 'Bulgarie', 'Bulgarien', 'Bulgaria', 'Bulgária', 'Bulgaria', 'بلغاريا'],
  CY: ['Cyprus', 'Chypre', 'Zypern', 'Cipro', 'Chipre', 'Chipre', 'قبرص'],
  CZ: ['Czechia', 'Tchéquie', 'Tschechien', 'Cechia', 'Chéquia', 'Chequia', 'التشيك'],
  DE: ['Germany', 'Allemagne', 'Deutschland', 'Germania', 'Alemanha', 'Alemania', 'ألمانيا'],
  DK: ['Denmark', 'Danemark', 'Dänemark', 'Danimarca', 'Dinamarca', 'Dinamarca', 'الدنمارك'],
  EE: ['Estonia', 'Estonie', 'Estland', 'Estonia', 'Estónia', 'Estonia', 'إستونيا'],
  ES: ['Spain', 'Espagne', 'Spanien', 'Spagna', 'Espanha', 'España', 'إسبانيا'],
  FI: ['Finland', 'Finlande', 'Finnland', 'Finlandia', 'Finlândia', 'Finlandia', 'فنلندا'],
  FR: ['France', 'France', 'Frankreich', 'Francia', 'França', 'Francia', 'فرنسا'],
  GR: ['Greece', 'Grèce', 'Griechenland', 'Grecia', 'Grécia', 'Grecia', 'اليونان'],
  HR: ['Croatia', 'Croatie', 'Kroatien', 'Croazia', 'Croácia', 'Croacia', 'كرواتيا'],
  HU: ['Hungary', 'Hongrie', 'Ungarn', 'Ungheria', 'Hungria', 'Hungría', 'المجر'],
  IE: ['Ireland', 'Irlande', 'Irland', 'Irlanda', 'Irlanda', 'Irlanda', 'أيرلندا'],
  IS: ['Iceland', 'Islande', 'Island', 'Islanda', 'Islândia', 'Islandia', 'أيسلندا'],
  IT: ['Italy', 'Italie', 'Italien', 'Italia', 'Itália', 'Italia', 'إيطاليا'],
  LI: ['Liechtenstein', 'Liechtenstein', 'Liechtenstein', 'Liechtenstein', 'Listenstaine', 'Liechtenstein', 'ليختنشتاين'],
  LT: ['Lithuania', 'Lituanie', 'Litauen', 'Lituania', 'Lituânia', 'Lituania', 'ليتوانيا'],
  LU: ['Luxembourg', 'Luxembourg', 'Luxemburg', 'Lussemburgo', 'Luxemburgo', 'Luxemburgo', 'لوكسمبورغ'],
  LV: ['Latvia', 'Lettonie', 'Lettland', 'Lettonia', 'Letónia', 'Letonia', 'لاتفيا'],
  MT: ['Malta', 'Malte', 'Malta', 'Malta', 'Malta', 'Malta', 'مالطا'],
  NL: ['Netherlands', 'Pays-Bas', 'Niederlande', 'Paesi Bassi', 'Países Baixos', 'Países Bajos', 'هولندا'],
  NO: ['Norway', 'Norvège', 'Norwegen', 'Norvegia', 'Noruega', 'Noruega', 'النرويج'],
  PL: ['Poland', 'Pologne', 'Polen', 'Polonia', 'Polónia', 'Polonia', 'بولندا'],
  PT: ['Portugal', 'Portugal', 'Portugal', 'Portogallo', 'Portugal', 'Portugal', 'البرتغال'],
  RO: ['Romania', 'Roumanie', 'Rumänien', 'Romania', 'Roménia', 'Rumanía', 'رومانيا'],
  SE: ['Sweden', 'Suède', 'Schweden', 'Svezia', 'Suécia', 'Suecia', 'السويد'],
  SI: ['Slovenia', 'Slovénie', 'Slowenien', 'Slovenia', 'Eslovénia', 'Eslovenia', 'سلوفينيا'],
  SK: ['Slovakia', 'Slovaquie', 'Slowakei', 'Slovacchia', 'Eslováquia', 'Eslovaquia', 'سلوفاكيا'],
};

/* Institution kinds, phrased naturally per language (indefinite noun phrase). */
const KINDS = {
  universal:  ['a universal bank', 'une banque universelle', 'eine Universalbank', 'una banca universale', 'um banco universal', 'un banco universal', 'بنك شامل'],
  retail:     ['a retail bank', 'une banque de détail', 'eine Privatkundenbank', 'una banca al dettaglio', 'um banco de retalho', 'un banco minorista', 'بنك تجزئة'],
  cooperative:['a cooperative bank', 'une banque coopérative', 'eine Genossenschaftsbank', 'una banca cooperativa', 'um banco cooperativo', 'un banco cooperativo', 'بنك تعاوني'],
  investment: ['an investment bank', "une banque d'investissement", 'eine Investmentbank', 'una banca d’investimento', 'um banco de investimento', 'un banco de inversión', 'بنك استثماري'],
  private:    ['a private bank', 'une banque privée', 'eine Privatbank', 'una banca privata', 'um banco privado', 'un banco privado', 'بنك خاص'],
  mortgage:   ['a mortgage credit institution', 'un établissement de crédit hypothécaire', 'ein Hypothekarkreditinstitut', 'un istituto di credito ipotecario', 'uma instituição de crédito hipotecário', 'una entidad de crédito hipotecario', 'مؤسسة ائتمان عقاري'],
  digital:    ['a digital-first bank', 'une banque nativement numérique', 'eine digitale Direktbank', 'una banca digitale', 'um banco digital', 'un banco digital', 'بنك رقمي'],
  payment:    ['a payment institution', 'un établissement de paiement', 'ein Zahlungsinstitut', 'un istituto di pagamento', 'uma instituição de pagamento', 'una entidad de pago', 'مؤسسة دفع'],
  emoney:     ['an electronic money institution', "un établissement de monnaie électronique", 'ein E-Geld-Institut', 'un istituto di moneta elettronica', 'uma instituição de moeda eletrónica', 'una entidad de dinero electrónico', 'مؤسسة نقود إلكترونية'],
};

/* Sentence templates: (kind, city, country, founded, regulators) -> description */
const DESC = {
  en: (k, city, ctry, y, regs) =>
    `${k[0].toUpperCase()}${k.slice(1)} headquartered in ${city}, ${ctry}. Established in ${y}, it holds a valid authorisation to operate and is supervised by ${regs}.`,
  fr: (k, city, ctry, y, regs) =>
    `${k[0].toUpperCase()}${k.slice(1)} dont le siège social se situe à ${city} (${ctry}). Créée en ${y}, elle dispose d'un agrément en cours de validité et est supervisée par ${regs}.`,
  de: (k, city, ctry, y, regs) =>
    `${k[0].toUpperCase()}${k.slice(1)} mit Sitz in ${city}, ${ctry}. Das ${y} gegründete Institut verfügt über eine gültige Zulassung und wird von ${regs} beaufsichtigt.`,
  it: (k, city, ctry, y, regs) =>
    `${k[0].toUpperCase()}${k.slice(1)} con sede a ${city}, ${ctry}. Fondata nel ${y}, dispone di un'autorizzazione valida ed è vigilata da ${regs}.`,
  pt: (k, city, ctry, y, regs) =>
    `${k[0].toUpperCase()}${k.slice(1)} com sede em ${city}, ${ctry}. Fundado em ${y}, dispõe de autorização válida e é supervisionado por ${regs}.`,
  es: (k, city, ctry, y, regs) =>
    `${k[0].toUpperCase()}${k.slice(1)} con sede en ${city}, ${ctry}. Fundado en ${y}, cuenta con una autorización vigente y está supervisado por ${regs}.`,
  ar: (k, city, ctry, y, regs) =>
    `${k} يقع مقره في ${city}، ${ctry}. تأسس عام ${y}، ويحمل ترخيصاً سارياً للعمل ويخضع لإشراف ${regs}.`,
};

const AND = { en: 'and', fr: 'et', de: 'und', it: 'e', pt: 'e', es: 'y', ar: 'و' };

function joinRegs(list, li) {
  const w = AND[LOCALES[li]];
  if (list.length === 1) return list[0];
  return list.slice(0, -1).join(', ') + ` ${w} ` + list[list.length - 1];
}

/* ------------------------------------------------------------------ */
/* Source records                                                      */
/* ------------------------------------------------------------------ */
// [name, country, city, bic, founded, kind, tags, regulators, website, score, status, extras]
const R = [
  ['Deutsche Bank AG','DE','Frankfurt am Main','DEUTDEFF',1870,'universal',['retail','investment','corporate'],['ECB','BaFin'],'https://www.db.com',78],
  ['Commerzbank AG','DE','Frankfurt am Main','COBADEFF',1870,'universal',['retail','corporate'],['ECB','BaFin'],'https://www.commerzbank.de',76],
  ['DZ BANK AG','DE','Frankfurt am Main','GENODEFF',1883,'cooperative',['corporate','cooperative'],['ECB','BaFin'],'https://www.dzbank.de',79],
  ['ING-DiBa AG','DE','Frankfurt am Main','INGDDEFF',1965,'retail',['retail','digital'],['ECB','BaFin'],'https://www.ing.de',80],
  ['N26 Bank SE','DE','Berlin','NTSBDEB1',2013,'digital',['retail','digital'],['ECB','BaFin'],'https://n26.com',70],
  ['BNP Paribas SA','FR','Paris','BNPAFRPP',1848,'universal',['retail','investment','corporate'],['ECB','ACPR'],'https://group.bnpparibas',82],
  ['Crédit Agricole SA','FR','Montrouge','AGRIFRPP',1894,'cooperative',['retail','cooperative','corporate'],['ECB','ACPR'],'https://www.credit-agricole.com',81],
  ['Société Générale','FR','Paris','SOGEFRPP',1864,'universal',['retail','investment','corporate'],['ECB','ACPR'],'https://www.societegenerale.com',77],
  ['Groupe BPCE','FR','Paris','CCBPFRPP',2009,'cooperative',['retail','cooperative'],['ECB','ACPR'],'https://groupebpce.com',78],
  ['La Banque Postale','FR','Paris','PSSTFRPP',2006,'retail',['retail'],['ECB','ACPR'],'https://www.labanquepostale.fr',79],
  ['Intesa Sanpaolo S.p.A.','IT','Torino','BCITITMM',2007,'universal',['retail','corporate','investment'],['ECB',"Banca d'Italia"],'https://group.intesasanpaolo.com',80],
  ['UniCredit S.p.A.','IT','Milano','UNCRITMM',1870,'universal',['retail','corporate','investment'],['ECB',"Banca d'Italia"],'https://www.unicreditgroup.eu',79],
  ['Banco BPM S.p.A.','IT','Milano','BAPPIT21',2017,'retail',['retail','corporate'],['ECB',"Banca d'Italia"],'https://gruppo.bancobpm.it',73],
  ['Mediobanca S.p.A.','IT','Milano','MEDBITMM',1946,'investment',['investment','corporate'],['ECB',"Banca d'Italia"],'https://www.mediobanca.com',76],
  ['Banco Santander S.A.','ES','Madrid','BSCHESMM',1857,'universal',['retail','corporate','investment'],['ECB','Banco de España'],'https://www.santander.com',81],
  ['Banco Bilbao Vizcaya Argentaria S.A.','ES','Bilbao','BBVAESMM',1857,'universal',['retail','corporate','digital'],['ECB','Banco de España'],'https://www.bbva.com',80],
  ['CaixaBank S.A.','ES','València','CAIXESBB',1904,'retail',['retail','corporate'],['ECB','Banco de España'],'https://www.caixabank.com',79],
  ['Banco de Sabadell S.A.','ES','Alacant','BSABESBB',1881,'retail',['retail','corporate'],['ECB','Banco de España'],'https://www.grupbancsabadell.com',74],
  ['ING Bank N.V.','NL','Amsterdam','INGBNL2A',1991,'universal',['retail','corporate','digital'],['ECB','DNB'],'https://www.ing.com',81],
  ['Coöperatieve Rabobank U.A.','NL','Utrecht','RABONL2U',1972,'cooperative',['retail','cooperative','corporate'],['ECB','DNB'],'https://www.rabobank.com',82],
  ['ABN AMRO Bank N.V.','NL','Amsterdam','ABNANL2A',1991,'universal',['retail','corporate'],['ECB','DNB'],'https://www.abnamro.com',78],
  ['bunq B.V.','NL','Amsterdam','BUNQNL2A',2012,'digital',['retail','digital'],['ECB','DNB'],'https://www.bunq.com',68],
  ['Adyen N.V.','NL','Amsterdam','ADYBNL2A',2006,'payment',['corporate','payments'],['DNB'],'https://www.adyen.com',78],
  ['KBC Bank NV','BE','Brussel','KREDBEBB',1998,'universal',['retail','corporate'],['ECB','NBB'],'https://www.kbc.com',80],
  ['Belfius Bank NV','BE','Brussel','GKCCBEBB',2011,'retail',['retail','corporate'],['ECB','NBB'],'https://www.belfius.be',76],
  ['BNP Paribas Fortis SA','BE','Brussel','GEBABEBB',1822,'universal',['retail','corporate'],['ECB','NBB'],'https://www.bnpparibasfortis.be',79],
  ['Wise Europe SA','BE','Brussel','TRWIBEB1',2020,'emoney',['retail','payments','digital'],['NBB'],'https://wise.com',72],
  ['Erste Group Bank AG','AT','Wien','GIBAATWG',1819,'universal',['retail','corporate'],['ECB','FMA'],'https://www.erstegroup.com',79],
  ['Raiffeisen Bank International AG','AT','Wien','RZBAATWW',1927,'universal',['corporate','retail'],['ECB','FMA'],'https://www.rbinternational.com',74],
  ['BAWAG P.S.K. AG','AT','Wien','BAWAATWW',1922,'retail',['retail','digital'],['ECB','FMA'],'https://www.bawaggroup.com',77],
  ['Caixa Geral de Depósitos S.A.','PT','Lisboa','CGDIPTPL',1876,'retail',['retail','corporate'],['ECB','Banco de Portugal'],'https://www.cgd.pt',76],
  ['Banco Comercial Português S.A.','PT','Porto','BCOMPTPL',1985,'retail',['retail','corporate'],['ECB','Banco de Portugal'],'https://ind.millenniumbcp.pt',73],
  ['Novo Banco S.A.','PT','Lisboa','BESCPTPL',2014,'retail',['retail','corporate'],['ECB','Banco de Portugal'],'https://www.novobanco.pt',70],
  ['AIB Group plc','IE','Dublin','AIBKIE2D',1966,'retail',['retail','corporate'],['ECB','Central Bank of Ireland'],'https://aib.ie',76],
  ['Bank of Ireland Group plc','IE','Dublin','BOFIIE2D',1783,'retail',['retail','corporate'],['ECB','Central Bank of Ireland'],'https://www.bankofireland.com',77],
  ["Banque et Caisse d'Épargne de l'État",'LU','Luxembourg','BCEELULL',1856,'retail',['retail','corporate'],['ECB','CSSF'],'https://www.spuerkeess.lu',84],
  ['Banque Internationale à Luxembourg S.A.','LU','Luxembourg','BILLLULL',1856,'private',['private','corporate'],['ECB','CSSF'],'https://www.bil.com',75],
  ['PayPal (Europe) S.à r.l. et Cie SCA','LU','Luxembourg','PPLXLUL2',2007,'emoney',['retail','payments','digital'],['CSSF'],'https://www.paypal.com',76],
  ['Nordea Bank Abp','FI','Helsinki','NDEAFIHH',1820,'universal',['retail','corporate'],['ECB','FIN-FSA'],'https://www.nordea.com',81],
  ['OP Corporate Bank plc','FI','Helsinki','OKOYFIHH',1902,'cooperative',['corporate','cooperative'],['ECB','FIN-FSA'],'https://www.op.fi',80],
  ['Skandinaviska Enskilda Banken AB','SE','Stockholm','ESSESESS',1856,'universal',['retail','corporate','investment'],['Finansinspektionen'],'https://sebgroup.com',80],
  ['Svenska Handelsbanken AB','SE','Stockholm','HANDSESS',1871,'retail',['retail','corporate'],['Finansinspektionen'],'https://www.handelsbanken.com',81],
  ['Swedbank AB','SE','Stockholm','SWEDSESS',1820,'retail',['retail','corporate'],['Finansinspektionen'],'https://www.swedbank.com',78],
  ['Klarna Bank AB','SE','Stockholm','KLRNSESS',2005,'digital',['retail','digital','payments'],['Finansinspektionen'],'https://www.klarna.com',70],
  ['Danske Bank A/S','DK','København','DABADKKK',1871,'universal',['retail','corporate'],['Finanstilsynet'],'https://danskebank.com',76],
  ['Jyske Bank A/S','DK','Silkeborg','JYBADKKK',1967,'retail',['retail','corporate'],['Finanstilsynet'],'https://www.jyskebank.dk',75],
  ['Nykredit Bank A/S','DK','København','NYKBDKKK',1851,'mortgage',['retail','mortgage'],['Finanstilsynet'],'https://www.nykredit.dk',77],
  ['PKO Bank Polski S.A.','PL','Warszawa','BPKOPLPW',1919,'retail',['retail','corporate'],['KNF'],'https://www.pkobp.pl',78],
  ['Bank Polska Kasa Opieki S.A.','PL','Warszawa','PKOPPLPW',1929,'universal',['retail','corporate'],['KNF'],'https://www.pekao.com.pl',76],
  ['mBank S.A.','PL','Warszawa','BREXPLPW',1986,'digital',['retail','digital'],['KNF'],'https://www.mbank.pl',74],
  ['National Bank of Greece S.A.','GR','Athína','ETHNGRAA',1841,'retail',['retail','corporate'],['ECB','Bank of Greece'],'https://www.nbg.gr',71],
  ['Eurobank S.A.','GR','Athína','ERBKGRAA',1990,'retail',['retail','corporate'],['ECB','Bank of Greece'],'https://www.eurobank.gr',72],
  ['Alpha Bank S.A.','GR','Athína','CRBAGRAA',1879,'retail',['retail','corporate'],['ECB','Bank of Greece'],'https://www.alpha.gr',71],
  ['Piraeus Bank S.A.','GR','Athína','PIRBGRAA',1916,'retail',['retail','corporate'],['ECB','Bank of Greece'],'https://www.piraeusbank.gr',70],
  ['Česká spořitelna a.s.','CZ','Praha','GIBACZPX',1825,'retail',['retail','corporate'],['ČNB'],'https://www.csas.cz',79],
  ['Komerční banka a.s.','CZ','Praha','KOMBCZPP',1990,'retail',['retail','corporate'],['ČNB'],'https://www.kb.cz',78],
  ['Československá obchodní banka a.s.','CZ','Praha','CEKOCZPP',1964,'universal',['retail','corporate'],['ČNB'],'https://www.csob.cz',79],
  ['OTP Bank Nyrt.','HU','Budapest','OTPVHUHB',1949,'universal',['retail','corporate'],['MNB'],'https://www.otpbank.hu',75],
  ['K&H Bank Zrt.','HU','Budapest','OKHBHUHB',1987,'retail',['retail','corporate'],['MNB'],'https://www.kh.hu',74],
  ['Banca Transilvania S.A.','RO','Cluj-Napoca','BTRLRO22',1993,'retail',['retail','corporate'],['BNR'],'https://www.bancatransilvania.ro',74],
  ['BRD – Groupe Société Générale S.A.','RO','București','BRDEROBU',1923,'retail',['retail','corporate'],['BNR'],'https://www.brd.ro',73],
  ['Zagrebačka banka d.d.','HR','Zagreb','ZABAHR2X',1914,'retail',['retail','corporate'],['ECB','HNB'],'https://www.zaba.hr',74],
  ['Privredna banka Zagreb d.d.','HR','Zagreb','PBZGHR2X',1966,'retail',['retail','corporate'],['ECB','HNB'],'https://www.pbz.hr',74],
  ['Slovenská sporiteľňa a.s.','SK','Bratislava','GIBASKBX',1825,'retail',['retail','corporate'],['ECB','NBS'],'https://www.slsp.sk',76],
  ['Všeobecná úverová banka a.s.','SK','Bratislava','SUBASKBX',1990,'retail',['retail','corporate'],['ECB','NBS'],'https://www.vub.sk',74],
  ['Nova Ljubljanska banka d.d.','SI','Ljubljana','LJBASI2X',1889,'retail',['retail','corporate'],['ECB','Banka Slovenije'],'https://www.nlb.si',73],
  ['UniCredit Bulbank AD','BG','Sofia','UNCRBGSF',1964,'retail',['retail','corporate'],['ECB','BNB'],'https://www.unicreditbulbank.bg',73],
  ['DSK Bank AD','BG','Sofia','STSABGSF',1951,'retail',['retail'],['ECB','BNB'],'https://dskbank.bg',72],
  ['Šiaulių bankas AB','LT','Šiauliai','CBSBLT26',1992,'retail',['retail','corporate'],['ECB','Lietuvos bankas'],'https://www.sb.lt',71],
  ['Revolut Bank UAB','LT','Vilnius','REVOLT21',2018,'digital',['retail','digital','payments'],['ECB','Lietuvos bankas'],'https://www.revolut.com',71],
  ['Citadele banka AS','LV','Rīga','PARXLV22',2010,'retail',['retail','corporate'],['ECB','Latvijas Banka'],'https://www.citadele.lv',70],
  ['LHV Pank AS','EE','Tallinn','LHVBEE22',2009,'retail',['retail','digital'],['ECB','Finantsinspektsioon'],'https://www.lhv.ee',72],
  ['Bank of Cyprus Public Company Ltd','CY','Lefkosía','BCYPCY2N',1899,'retail',['retail','corporate'],['ECB','CBC'],'https://www.bankofcyprus.com',70],
  ['Bank of Valletta plc','MT','Santa Venera','VALLMTMT',1974,'retail',['retail','corporate'],['ECB','MFSA'],'https://www.bov.com',71],
  ['DNB Bank ASA','NO','Oslo','DNBANOKK',1822,'universal',['retail','corporate'],['Finanstilsynet (NO)'],'https://www.dnb.no',80],
  ['Landsbankinn hf.','IS','Reykjavík','NBIIISRE',2008,'retail',['retail','corporate'],['Seðlabanki Íslands'],'https://www.landsbankinn.is',72],
  ['LGT Bank AG','LI','Vaduz','BLFLLI2X',1920,'private',['private','corporate'],['FMA Liechtenstein'],'https://www.lgt.com',78],
];

const slug = (s) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
   .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const institutions = R.map(([name, country, city, bic, founded, kind, tags, regulators, website, score]) => {
  const nameLoc = {};
  const descLoc = {};
  LOCALES.forEach((l, i) => {
    nameLoc[l] = name; // legal names are not translated
    const k = KINDS[kind][i];
    const ctry = COUNTRIES[country][i];
    descLoc[l] = DESC[l](k, city, ctry, founded, joinRegs(regulators, i));
  });
  const isBank = !['payment', 'emoney'].includes(kind);
  return {
    id: slug(name),
    name: nameLoc,
    legalName: name,
    country,
    city,
    kind,
    logo: null,
    website,
    bic,
    ibanPrefix: country,
    lei: null,
    founded,
    regulators,
    status: 'AUTHORIZED',
    licenceType: isBank ? 'CREDIT_INSTITUTION' : kind === 'payment' ? 'PAYMENT_INSTITUTION' : 'EMONEY_INSTITUTION',
    depositGuarantee: isBank,
    mifid2Compliant: ['universal', 'investment', 'private', 'retail', 'cooperative'].includes(kind),
    psd2Compliant: true,
    passporting: true,
    description: descLoc,
    tags,
    solidityScore: score,
  };
});

/* ------------------------------------------------------------------ */
/* News                                                                */
/* ------------------------------------------------------------------ */
const NEWS_TPL = {
  REGULATION: {
    title: {
      en: (b, r) => `${r} publishes updated prudential requirements applying to ${b}`,
      fr: (b, r) => `${r} publie des exigences prudentielles actualisées applicables à ${b}`,
      de: (b, r) => `${r} veröffentlicht aktualisierte Aufsichtsanforderungen für ${b}`,
      it: (b, r) => `${r} pubblica requisiti prudenziali aggiornati applicabili a ${b}`,
      pt: (b, r) => `${r} publica requisitos prudenciais atualizados aplicáveis a ${b}`,
      es: (b, r) => `${r} publica requisitos prudenciales actualizados aplicables a ${b}`,
      ar: (b, r) => `${r} تنشر متطلبات رقابية محدَّثة تنطبق على ${b}`,
    },
    snippet: {
      en: (b, r) => `The supervisor set out revised capital and liquidity expectations. ${b} keeps its authorisation and remains fully operational for its customers.`,
      fr: (b, r) => `Le superviseur a précisé des attentes révisées en matière de capital et de liquidité. ${b} conserve son agrément et reste pleinement opérationnelle pour ses clients.`,
      de: (b, r) => `Die Aufsicht hat überarbeitete Kapital- und Liquiditätserwartungen dargelegt. ${b} behält die Zulassung und bleibt für Kundinnen und Kunden voll handlungsfähig.`,
      it: (b, r) => `L'autorità di vigilanza ha definito aspettative riviste su capitale e liquidità. ${b} mantiene l'autorizzazione e resta pienamente operativa per la clientela.`,
      pt: (b, r) => `O supervisor definiu expectativas revistas de capital e liquidez. O ${b} mantém a sua autorização e continua plenamente operacional para os clientes.`,
      es: (b, r) => `El supervisor fijó expectativas revisadas de capital y liquidez. ${b} mantiene su autorización y sigue plenamente operativo para sus clientes.`,
      ar: (b, r) => `حددت الجهة الرقابية توقعات معدَّلة لرأس المال والسيولة. ويحتفظ ${b} بترخيصه ويواصل عمله بالكامل تجاه عملائه.`,
    },
  },
  AUTHORISATION: {
    title: {
      en: (b, r) => `${b} confirmed on the ${r} register of authorised institutions`,
      fr: (b, r) => `${b} confirmée au registre des établissements agréés de ${r}`,
      de: (b, r) => `${b} im Register zugelassener Institute von ${r} bestätigt`,
      it: (b, r) => `${b} confermata nel registro degli enti autorizzati di ${r}`,
      pt: (b, r) => `${b} confirmado no registo de instituições autorizadas de ${r}`,
      es: (b, r) => `${b} confirmado en el registro de entidades autorizadas de ${r}`,
      ar: (b, r) => `تأكيد إدراج ${b} في سجل المؤسسات المرخّصة لدى ${r}`,
    },
    snippet: {
      en: (b, r) => `The entry confirms the scope of services the institution may offer and the Member States it may passport into.`,
      fr: (b, r) => `L'inscription confirme le périmètre des services que l'établissement peut proposer et les États membres couverts par son passeport.`,
      de: (b, r) => `Der Eintrag bestätigt den Umfang der zulässigen Dienstleistungen sowie die Mitgliedstaaten, in die das Institut passportieren darf.`,
      it: (b, r) => `L'iscrizione conferma l'ambito dei servizi che l'ente può offrire e gli Stati membri coperti dal passaporto.`,
      pt: (b, r) => `O registo confirma o âmbito dos serviços que a instituição pode oferecer e os Estados-Membros abrangidos pelo passaporte.`,
      es: (b, r) => `La inscripción confirma el alcance de los servicios que la entidad puede prestar y los Estados miembros cubiertos por el pasaporte.`,
      ar: (b, r) => `يؤكد القيد نطاق الخدمات التي يجوز للمؤسسة تقديمها والدول الأعضاء المشمولة بجواز التمرير.`,
    },
  },
  CONSUMER: {
    title: {
      en: (b, r) => `How to check that ${b} is authorised before you open an account`,
      fr: (b, r) => `Comment vérifier que ${b} est agréée avant d'ouvrir un compte`,
      de: (b, r) => `So prüfen Sie vor der Kontoeröffnung, ob ${b} zugelassen ist`,
      it: (b, r) => `Come verificare che ${b} sia autorizzata prima di aprire un conto`,
      pt: (b, r) => `Como verificar se o ${b} está autorizado antes de abrir conta`,
      es: (b, r) => `Cómo comprobar que ${b} está autorizado antes de abrir una cuenta`,
      ar: (b, r) => `كيف تتحقق من أن ${b} مرخّص قبل فتح حساب`,
    },
    snippet: {
      en: (b, r) => `Look up the legal name in the official ${r} register, check the licence type, and confirm that deposits are covered by a guarantee scheme.`,
      fr: (b, r) => `Recherchez la dénomination sociale dans le registre officiel de ${r}, vérifiez le type d'agrément et confirmez que les dépôts sont couverts par un système de garantie.`,
      de: (b, r) => `Suchen Sie den Firmennamen im offiziellen Register von ${r}, prüfen Sie die Art der Zulassung und ob die Einlagen durch ein Sicherungssystem gedeckt sind.`,
      it: (b, r) => `Cercate la denominazione legale nel registro ufficiale di ${r}, verificate il tipo di autorizzazione e la copertura del sistema di garanzia dei depositi.`,
      pt: (b, r) => `Procure a denominação legal no registo oficial de ${r}, verifique o tipo de autorização e confirme a cobertura do fundo de garantia de depósitos.`,
      es: (b, r) => `Busque la denominación legal en el registro oficial de ${r}, compruebe el tipo de autorización y confirme la cobertura del fondo de garantía de depósitos.`,
      ar: (b, r) => `ابحث عن الاسم القانوني في السجل الرسمي لدى ${r}، وتحقق من نوع الترخيص ومن تغطية نظام ضمان الودائع.`,
    },
  },
  TECHNOLOGY: {
    title: {
      en: (b, r) => `${b} extends instant payments and strong customer authentication`,
      fr: (b, r) => `${b} étend les virements instantanés et l'authentification forte du client`,
      de: (b, r) => `${b} baut Echtzeitzahlungen und starke Kundenauthentifizierung aus`,
      it: (b, r) => `${b} estende i pagamenti istantanei e l'autenticazione forte del cliente`,
      pt: (b, r) => `${b} alarga os pagamentos imediatos e a autenticação forte do cliente`,
      es: (b, r) => `${b} amplía los pagos inmediatos y la autenticación reforzada del cliente`,
      ar: (b, r) => `${b} يوسّع المدفوعات الفورية والمصادقة القوية للعملاء`,
    },
    snippet: {
      en: (b, r) => `The rollout follows the PSD2 framework and the EU instant payments rules, with no change to the institution's authorisation status.`,
      fr: (b, r) => `Le déploiement suit le cadre DSP2 et les règles européennes sur les virements instantanés, sans changement du statut d'agrément.`,
      de: (b, r) => `Die Einführung folgt dem PSD2-Rahmen und den EU-Regeln zu Echtzeitzahlungen; am Zulassungsstatus ändert sich nichts.`,
      it: (b, r) => `L'introduzione segue il quadro PSD2 e le regole UE sui pagamenti istantanei, senza modifiche allo stato di autorizzazione.`,
      pt: (b, r) => `A implementação segue o quadro DSP2 e as regras da UE sobre pagamentos imediatos, sem alteração do estatuto de autorização.`,
      es: (b, r) => `El despliegue sigue el marco PSD2 y las normas de la UE sobre pagos inmediatos, sin cambios en el estado de autorización.`,
      ar: (b, r) => `يأتي التنفيذ وفق إطار PSD2 وقواعد الاتحاد الأوروبي للمدفوعات الفورية، دون تغيير في حالة الترخيص.`,
    },
  },
  RATING_CHANGE: {
    title: {
      en: (b, r) => `Solidity indicator for ${b} reviewed after latest supervisory disclosures`,
      fr: (b, r) => `Indicateur de solidité de ${b} révisé après les dernières publications prudentielles`,
      de: (b, r) => `Soliditätsindikator für ${b} nach jüngsten Aufsichtsangaben überprüft`,
      it: (b, r) => `Indicatore di solidità di ${b} rivisto dopo le ultime informative di vigilanza`,
      pt: (b, r) => `Indicador de solidez do ${b} revisto após as últimas divulgações prudenciais`,
      es: (b, r) => `Indicador de solidez de ${b} revisado tras las últimas divulgaciones prudenciales`,
      ar: (b, r) => `مراجعة مؤشر المتانة لـ ${b} بعد آخر الإفصاحات الرقابية`,
    },
    snippet: {
      en: (b, r) => `Euclide's solidity indicator is editorial and is not a credit rating. It summarises published capital, liquidity and supervisory data.`,
      fr: (b, r) => `L'indicateur de solidité d'Euclide est éditorial et ne constitue pas une notation de crédit. Il résume des données publiées de capital, de liquidité et de supervision.`,
      de: (b, r) => `Der Soliditätsindikator von Euclide ist redaktionell und kein Kreditrating. Er fasst veröffentlichte Kapital-, Liquiditäts- und Aufsichtsdaten zusammen.`,
      it: (b, r) => `L'indicatore di solidità di Euclide è editoriale e non è un rating di credito. Sintetizza dati pubblicati su capitale, liquidità e vigilanza.`,
      pt: (b, r) => `O indicador de solidez da Euclide é editorial e não é uma notação de crédito. Resume dados publicados de capital, liquidez e supervisão.`,
      es: (b, r) => `El indicador de solidez de Euclide es editorial y no es una calificación crediticia. Resume datos publicados de capital, liquidez y supervisión.`,
      ar: (b, r) => `مؤشر المتانة لدى «إقليدس» تحريري وليس تصنيفاً ائتمانياً. وهو يلخّص بيانات منشورة عن رأس المال والسيولة والإشراف.`,
    },
  },
  MERGER: {
    title: {
      en: (b, r) => `${b} notifies a change in its group structure to ${r}`,
      fr: (b, r) => `${b} notifie à ${r} une modification de sa structure de groupe`,
      de: (b, r) => `${b} zeigt ${r} eine Änderung der Gruppenstruktur an`,
      it: (b, r) => `${b} notifica a ${r} una modifica della struttura di gruppo`,
      pt: (b, r) => `${b} notifica ${r} de uma alteração na estrutura do grupo`,
      es: (b, r) => `${b} notifica a ${r} un cambio en su estructura de grupo`,
      ar: (b, r) => `${b} يُخطر ${r} بتغيير في هيكل المجموعة`,
    },
    snippet: {
      en: (b, r) => `Customer contracts, account numbers and deposit protection are unaffected while the supervisor assesses the notification.`,
      fr: (b, r) => `Les contrats clients, les numéros de compte et la garantie des dépôts ne sont pas affectés pendant l'examen par le superviseur.`,
      de: (b, r) => `Kundenverträge, Kontonummern und Einlagensicherung bleiben während der aufsichtlichen Prüfung unverändert.`,
      it: (b, r) => `Contratti della clientela, numeri di conto e tutela dei depositi restano invariati durante la valutazione della vigilanza.`,
      pt: (b, r) => `Os contratos de clientes, os números de conta e a proteção de depósitos não são afetados durante a avaliação do supervisor.`,
      es: (b, r) => `Los contratos de clientes, los números de cuenta y la protección de depósitos no se ven afectados durante la evaluación del supervisor.`,
      ar: (b, r) => `لا تتأثر عقود العملاء وأرقام الحسابات وحماية الودائع أثناء تقييم الجهة الرقابية للإخطار.`,
    },
  },
};

const CATS = Object.keys(NEWS_TPL);
const news = [];
let seed = 20250601;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;

for (let i = 0; i < 60; i++) {
  const inst = institutions[Math.floor(rnd() * institutions.length)];
  const cat = CATS[i % CATS.length];
  const reg = inst.regulators[0];
  const d = new Date(Date.UTC(2026, 7, 20) - Math.floor(rnd() * 330) * 86400000);
  const title = {}, snippet = {};
  for (const l of LOCALES) {
    title[l] = NEWS_TPL[cat].title[l](inst.legalName, reg);
    snippet[l] = NEWS_TPL[cat].snippet[l](inst.legalName, reg);
  }
  news.push({
    id: `news-${String(i + 1).padStart(3, '0')}`,
    institutionId: inst.id,
    country: inst.country,
    date: d.toISOString().slice(0, 10),
    category: cat,
    title,
    snippet,
    source: reg,
    sourceUrl: inst.website,
  });
}
news.sort((a, b) => (a.date < b.date ? 1 : -1));

fs.writeFileSync('src/data/institutions.json', JSON.stringify(institutions, null, 2));
fs.writeFileSync('src/data/news.json', JSON.stringify(news, null, 2));
console.log(`institutions: ${institutions.length}, news: ${news.length}, countries: ${new Set(institutions.map(i => i.country)).size}`);
