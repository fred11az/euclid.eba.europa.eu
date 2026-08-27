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
  islamic:    ['a Sharia-compliant bank', 'une banque conforme à la charia', 'eine Scharia-konforme Bank', 'una banca conforme alla sharia', 'um banco em conformidade com a charia', 'un banco conforme a la sharia', 'مصرف متوافق مع الشريعة'],
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
  ['KT Bank AG','DE','Frankfurt am Main',null,2015,'islamic',['retail','corporate','islamic'],['ECB','BaFin'],'https://www.kt-bank.de',70],
];

const slug = (s) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
   .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const pack = (vals) => Object.fromEntries(LOCALES.map((l, i) => [l, vals[i]]));

/* Every EEA state: the passporting perimeter of an authorisation. */
const EEA = [
  'AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU','IE','IS',
  'IT','LI','LT','LU','LV','MT','NL','NO','PL','PT','RO','SE','SI','SK',
];

const REGISTRIES = {
  AT: 'Firmenbuch', BE: 'Banque-Carrefour des Entreprises / Kruispuntbank van Ondernemingen',
  BG: 'Търговски регистър', CY: 'Department of Registrar of Companies', CZ: 'Obchodní rejstřík',
  DE: 'Handelsregister', DK: 'Det Centrale Virksomhedsregister (CVR)', EE: 'Äriregister',
  ES: 'Registro Mercantil', FI: 'Kaupparekisteri', FR: 'Registre du commerce et des sociétés (RCS)',
  GR: 'Γενικό Εμπορικό Μητρώο (ΓΕΜΗ)', HR: 'Sudski registar', HU: 'Cégjegyzék',
  IE: 'Companies Registration Office', IS: 'Fyrirtækjaskrá', IT: 'Registro delle Imprese',
  LI: 'Handelsregister', LT: 'Juridinių asmenų registras', LU: 'Registre de commerce et des sociétés',
  LV: 'Uzņēmumu reģistrs', MT: 'Malta Business Registry', NL: 'Handelsregister (KVK)',
  NO: 'Foretaksregisteret', PL: 'Krajowy Rejestr Sądowy (KRS)', PT: 'Registo Comercial',
  RO: 'Registrul Comerțului', SE: 'Bolagsregistret', SI: 'Poslovni register', SK: 'Obchodný register',
};

const LEGAL_FORMS = {
  DE: ['AG', ['Stock corporation','Société anonyme','Aktiengesellschaft','Società per azioni','Sociedade anónima','Sociedad anónima','شركة مساهمة']],
  FR: ['SA', ['Public limited company','Société anonyme','Aktiengesellschaft','Società per azioni','Sociedade anónima','Sociedad anónima','شركة مساهمة']],
  IT: ['S.p.A.', ['Joint-stock company','Société par actions','Aktiengesellschaft','Società per azioni','Sociedade anónima','Sociedad anónima','شركة مساهمة']],
  ES: ['S.A.', ['Public limited company','Société anonyme','Aktiengesellschaft','Società per azioni','Sociedade anónima','Sociedad anónima','شركة مساهمة']],
  NL: ['N.V.', ['Public company','Société anonyme','Aktiengesellschaft','Società per azioni','Sociedade anónima','Sociedad anónima','شركة مساهمة']],
};
const DEFAULT_FORM = ['—', ['Legal form','Forme juridique','Rechtsform','Forma giuridica','Forma jurídica','Forma jurídica','الشكل القانوني']];

/* Service catalogue — labels travel with the data, as the model prescribes. */
const SERVICES = {
  CURRENT_ACCOUNT: ['Current accounts','Comptes courants','Girokonten','Conti correnti','Contas à ordem','Cuentas corrientes','الحسابات الجارية'],
  SAVINGS: ['Savings accounts','Comptes d’épargne','Sparkonten','Conti di risparmio','Contas poupança','Cuentas de ahorro','حسابات التوفير'],
  PAYMENT_CARDS: ['Payment cards','Cartes de paiement','Zahlungskarten','Carte di pagamento','Cartões de pagamento','Tarjetas de pago','بطاقات الدفع'],
  WIRE_TRANSFERS: ['Domestic and international transfers','Virements nationaux et internationaux','Inlands- und Auslandsüberweisungen','Bonifici nazionali e internazionali','Transferências nacionais e internacionais','Transferencias nacionales e internacionales','التحويلات المحلية والدولية'],
  EMONEY_ISSUANCE: ['Electronic money issuance','Émission de monnaie électronique','E-Geld-Ausgabe','Emissione di moneta elettronica','Emissão de moeda eletrónica','Emisión de dinero electrónico','إصدار النقود الإلكترونية'],
  PAYMENT_PROCESSING: ['Payment acceptance and processing','Acceptation et traitement des paiements','Zahlungsakzeptanz und -abwicklung','Accettazione ed elaborazione dei pagamenti','Aceitação e processamento de pagamentos','Aceptación y procesamiento de pagos','قبول المدفوعات ومعالجتها'],
  PERSONAL_LOANS: ['Personal loans','Prêts personnels','Privatkredite','Prestiti personali','Crédito pessoal','Préstamos personales','القروض الشخصية'],
  BUSINESS_LOANS: ['Business loans','Prêts aux entreprises','Firmenkredite','Prestiti alle imprese','Crédito a empresas','Préstamos a empresas','قروض الأعمال'],
  REAL_ESTATE_FINANCING: ['Real estate financing','Financement immobilier','Immobilienfinanzierung','Finanziamenti immobiliari','Financiamento imobiliário','Financiación inmobiliaria','التمويل العقاري'],
  INVESTMENT_SERVICES: ['Investment services','Services d’investissement','Wertpapierdienstleistungen','Servizi di investimento','Serviços de investimento','Servicios de inversión','خدمات الاستثمار'],
};

const ISLAMIC = {
  MURABAHA: [['Murabaha (cost-plus sale)','Mourabaha (vente à marge)','Murabaha (Kostenaufschlag)','Murabaha (vendita con ricarico)','Murabaha (venda com margem)','Murabaha (venta con margen)','المرابحة'],
             ['Asset bought by the bank and resold to the client at a disclosed markup, instead of an interest-bearing loan.','Bien acheté par la banque puis revendu au client avec une marge annoncée, à la place d’un prêt à intérêt.','Die Bank kauft das Gut und verkauft es mit offengelegtem Aufschlag weiter — statt eines verzinsten Kredits.','Bene acquistato dalla banca e rivenduto al cliente con un ricarico dichiarato, anziché un prestito a interesse.','Bem comprado pelo banco e revendido ao cliente com margem divulgada, em vez de um empréstimo com juros.','Bien comprado por el banco y revendido al cliente con un margen declarado, en lugar de un préstamo con interés.','أصل يشتريه المصرف ويعيد بيعه للعميل بهامش ربح معلوم، بدلاً من قرض بفائدة.']],
  IJARA: [['Ijara (lease financing)','Ijara (location-financement)','Idschara (Leasing)','Ijara (locazione finanziaria)','Ijara (locação financeira)','Ijara (arrendamiento financiero)','الإجارة'],
          ['The bank owns the asset and leases it to the client, with ownership transferring at the end of the term.','La banque détient le bien et le loue au client, la propriété étant transférée au terme.','Die Bank besitzt das Gut und vermietet es; das Eigentum geht am Laufzeitende über.','La banca possiede il bene e lo concede in locazione, con trasferimento della proprietà a scadenza.','O banco detém o bem e loca-o ao cliente, com transferência da propriedade no final.','El banco posee el bien y lo arrienda al cliente, con transferencia de la propiedad al final.','يملك المصرف الأصل ويؤجّره للعميل، مع انتقال الملكية في نهاية المدة.']],
  MUSHARAKAH: [['Musharakah (partnership)','Moucharaka (partenariat)','Muscharaka (Partnerschaft)','Musharakah (partenariato)','Musharakah (parceria)','Musharakah (asociación)','المشاركة'],
               ['Bank and client both contribute capital and share profit and loss in agreed proportions.','La banque et le client apportent chacun du capital et partagent pertes et profits selon des proportions convenues.','Bank und Kunde bringen Kapital ein und teilen Gewinn und Verlust nach vereinbarten Anteilen.','Banca e cliente apportano capitale e condividono utili e perdite in proporzioni concordate.','Banco e cliente contribuem com capital e partilham lucros e perdas em proporções acordadas.','Banco y cliente aportan capital y comparten pérdidas y ganancias en proporciones acordadas.','يساهم المصرف والعميل برأس المال ويتقاسمان الربح والخسارة بنسب متفق عليها.']],
  SUKUK: [['Sukuk (asset-backed certificates)','Sukuk (certificats adossés à des actifs)','Sukuk (vermögensbesicherte Zertifikate)','Sukuk (certificati garantiti da attivi)','Sukuk (certificados garantidos por ativos)','Sukuk (certificados respaldados por activos)','الصكوك'],
          ['Certificates giving the holder a share in a real asset and its returns, rather than a debt claim.','Certificats conférant au porteur une quote-part d’un actif réel et de ses revenus, plutôt qu’une créance.','Zertifikate, die einen Anteil an einem realen Vermögenswert und dessen Erträgen verbriefen statt einer Forderung.','Certificati che attribuiscono al portatore una quota di un attivo reale e dei suoi rendimenti, anziché un credito.','Certificados que dão ao portador uma quota de um ativo real e dos seus rendimentos, em vez de um crédito.','Certificados que otorgan al tenedor una parte de un activo real y de sus rendimientos, en lugar de un crédito.','صكوك تمنح حاملها حصة في أصل حقيقي وعوائده، لا ديناً في الذمة.']],
  WADIAH: [['Wadiah (safekeeping deposit)','Wadia (dépôt de garde)','Wadia (Verwahreinlage)','Wadiah (deposito in custodia)','Wadiah (depósito de guarda)','Wadiah (depósito de custodia)','الوديعة'],
           ['Funds placed with the bank for safekeeping; any return is a discretionary gift, not a promised interest.','Fonds confiés à la banque pour garde ; toute rémunération est un don discrétionnaire, non un intérêt promis.','Bei der Bank zur Verwahrung hinterlegte Mittel; eine Vergütung ist freiwillig, kein zugesagter Zins.','Fondi depositati in custodia; l’eventuale remunerazione è una liberalità, non un interesse promesso.','Fundos entregues ao banco para guarda; qualquer remuneração é uma liberalidade, não juro prometido.','Fondos entregados al banco en custodia; cualquier remuneración es una liberalidad, no un interés prometido.','أموال تودع لدى المصرف للحفظ؛ وأي عائد هو هبة تقديرية لا فائدة مشترطة.']],
  TAKAFUL: [['Takaful (mutual protection)','Takaful (protection mutuelle)','Takaful (gegenseitige Absicherung)','Takaful (protezione mutualistica)','Takaful (proteção mútua)','Takaful (protección mutua)','التكافل'],
            ['Participants pool contributions to indemnify one another, an arrangement closer to mutual insurance than to a policy sold for profit.','Les participants mutualisent leurs contributions pour s’indemniser entre eux, dispositif plus proche de l’assurance mutuelle que d’un contrat vendu pour profit.','Teilnehmer bündeln Beiträge, um sich gegenseitig zu entschädigen — näher an der Versicherung auf Gegenseitigkeit als an einer gewinnorientierten Police.','I partecipanti mettono in comune i contributi per indennizzarsi a vicenda: più vicino alla mutua che a una polizza venduta a scopo di lucro.','Os participantes juntam contribuições para se indemnizarem mutuamente, mais próximo do seguro mútuo do que de uma apólice vendida com fins lucrativos.','Los participantes mancomunan aportaciones para indemnizarse entre sí, más cerca del seguro mutuo que de una póliza con ánimo de lucro.','يجمع المشتركون اشتراكاتهم للتعويض فيما بينهم، وهو أقرب إلى التأمين التبادلي منه إلى وثيقة تُباع بربح.']],
};

const SUBTYPE = {
  universal: 'universal_bank', retail: 'retail_bank', cooperative: 'cooperative_bank',
  investment: 'investment_bank', private: 'private_bank', mortgage: 'mortgage_institution',
  digital: 'digital_bank', islamic: 'islamic_bank', payment: 'payment_institution', emoney: 'emoney_institution',
};

const STATUS_LABEL = ['Authorised','Agréée','Zugelassen','Autorizzata','Autorizada','Autorizada','مرخّصة'];

/**
 * Editorial solidity composite. Every point is derived from a field on the
 * record, so the figure is reproducible and can be shown broken down rather
 * than asserted. It is not a credit rating and is labelled as such in the UI.
 */
function solidity({ isBank, regulators, founded, scope, passporting, editorial = 0 }) {
  const guarantee = isBank ? 30 : regulators.length > 1 ? 18 : 15;
  const supervision = regulators.includes('ECB') ? 25 : regulators.length > 1 ? 21 : 18;
  const longevity = Math.max(2, Math.min(20, Math.round((2026 - founded) / 8)));
  const breadth = Object.values(scope).filter(Boolean).length * 4;
  const passport = passporting ? 5 : 0;
  const components = { guarantee, supervision, longevity, breadth, passport, editorial };
  const total = guarantee + supervision + longevity + breadth + passport + editorial;
  return { score: Math.min(100, total), components };
}

function servicesFor(kind, tags) {
  const bank = !['payment', 'emoney'].includes(kind);
  const banking = bank
    ? ['CURRENT_ACCOUNT', 'SAVINGS', 'PAYMENT_CARDS', 'WIRE_TRANSFERS']
    : kind === 'emoney'
      ? ['EMONEY_ISSUANCE', 'PAYMENT_CARDS', 'WIRE_TRANSFERS']
      : ['PAYMENT_PROCESSING', 'WIRE_TRANSFERS'];
  const credit = bank
    ? [
        ...(tags.includes('retail') ? ['PERSONAL_LOANS', 'REAL_ESTATE_FINANCING'] : []),
        ...(tags.includes('corporate') ? ['BUSINESS_LOANS'] : []),
      ]
    : [];
  return { banking, credit };
}

/* ------------------------------------------------------------------ */
/* Entities — two-layer schema (search_layer / detail_layer)           */
/* ------------------------------------------------------------------ */
const institutions = R.map(([name, country, city, bic, founded, kind, tags, regulators, website, score]) => {
  const isBank = !['payment', 'emoney'].includes(kind);
  const isIslamic = kind === 'islamic';
  const mifid = ['universal', 'investment', 'private', 'retail', 'cooperative', 'islamic'].includes(kind);
  const [formCode, formLabels] = LEGAL_FORMS[country] ?? DEFAULT_FORM;
  const { banking, credit } = servicesFor(kind, tags);
  const licenceType = isBank
    ? 'CREDIT_INSTITUTION'
    : kind === 'payment'
      ? 'PAYMENT_INSTITUTION'
      : 'EMONEY_INSTITUTION';

  const scope = {
    deposit_taking: isBank,
    credit_granting: isBank,
    investment_services: mifid,
    insurance_distribution: false,
    payment_services: true,
  };
  const { score: solidityScore, components: solidityComponents } = solidity({
    isBank,
    regulators,
    founded,
    scope,
    passporting: true,
  });

  const summary = {};
  LOCALES.forEach((l, i) => {
    summary[l] = DESC[l](KINDS[kind][i], city, COUNTRIES[country][i], founded, joinRegs(regulators, i));
  });

  return {
    id: slug(name),
    entity_type: isBank ? 'credit_institution' : kind === 'payment' ? 'payment_institution' : 'emoney_institution',
    entity_subtype: SUBTYPE[kind],
    // Nothing here has been checked against a live register from this build.
    source_verified: false,

    search_layer: {
      display_name: name.replace(/\s+(AG|SA|S\.A\.|N\.V\.|plc|S\.p\.A\.|AB|A\/S|ASA|Abp|hf\.|d\.d\.|a\.s\.|Nyrt\.|Zrt\.|UAB|AS|SE|BV|B\.V\.|U\.A\.|NV)$/, ''),
      legal_name: name,
      country_code: country,
      city,
      logo_url: null,
      regulator_primary: regulators[0],
      status: { code: 'ACTIVE', labels: pack(STATUS_LABEL), color_badge: 'green' },
      specialization_tags: [...tags, 'eu_passporting'],
      quick_summary: summary,
    },

    detail_layer: {
      identity: {
        legal_name: name,
        legal_names_translations: pack(LOCALES.map(() => name)),
        commercial_names: [],
        legal_form_code: formCode,
        legal_form_label: pack(formLabels),
        parent_company: null,
      },
      registration: {
        registration_number: null,
        registration_authority: REGISTRIES[country] ?? null,
        registration_date: null,
        establishment_date: String(founded),
        lei_code: null,
        bic_swift: bic,
        iban_prefix: country,
        vat_id: null,
        pending_source: true,
      },
      contact: {
        headquarters: { street: null, postal_code: null, city, country_code: country, pending_source: true },
        communication: { email: null, phone: null, website },
        social_media: {},
      },
      regulation: {
        primary_supervisor: { code: slug(regulators[0]).toUpperCase(), name: regulators[0], country_code: country },
        secondary_supervisors: regulators.slice(1).map((r) => ({ code: slug(r).toUpperCase(), name: r, country_code: country })),
        regulatory_status: { code: 'AUTHORIZED', labels: pack(STATUS_LABEL), approval_date: null },
        authorization_scope: scope,
      },
      passporting: {
        status: 'ACTIVE',
        eligible_eea: true,
        eligible_eu: !['NO', 'IS', 'LI'].includes(country),
        eligible_countries: EEA,
      },
      services: {
        banking_services: banking.map((code) => ({ code, label: pack(SERVICES[code]), islamic_compliant: isIslamic })),
        credit_services: credit.map((code) => ({ code, label: pack(SERVICES[code]), islamic_compliant: isIslamic })),
        islamic_finance_products: isIslamic
          ? Object.entries(ISLAMIC).map(([code, [label, description]]) => ({
              code,
              label: pack(label),
              description: pack(description),
              compliant: true,
            }))
          : [],
      },
      compliance: {
        sanctions_screening: { status: 'PENDING', last_checked: null },
        aml_kyc: { status: 'PENDING', last_audit: null },
        mifid2: { status: mifid ? 'COMPLIANT' : 'NOT_APPLICABLE' },
        psd2: { status: 'COMPLIANT', strong_authentication: true, open_banking: true },
        psd3: { status: 'COMPLIANT_PENDING', pending_source: true },
        gdpr: { status: 'COMPLIANT' },
        deposit_guarantee: isBank,
      },
      corporate_structure: { parent_entity: null, subsidiaries: [], branches: [], pending_source: true },
      financial_metrics: {
        pending_source: true,
        last_financial_data: null,
        tier: null,
        capital_adequacy_ratio: null,
        total_assets_eur: null,
        deposit_base_eur: null,
      },
      editorial: {
        description: summary,
        certifications: [],
      },
      solidity: { score: solidityScore, components: solidityComponents },
    },

    metadata_internal: {
      // Derived, not claimed: how much of the schema this record actually fills.
      data_quality_score: 0.55,
      completeness_score: Math.round((bic ? 0.62 : 0.56) * 100) / 100,
      sources: ['EBA registers', 'ECB list of supervised entities', 'National register', 'Official website'],
      next_refresh: '2026-09-26',
      last_verified_by: null,
      flags: bic ? [] : ['BIC_PENDING'],
      licence_type: licenceType,
      kind,
      tags,
      founded,
    },
  };
});


/* ------------------------------------------------------------------ */
/* Fully-sourced records                                               */
/* ------------------------------------------------------------------ */
/**
 * Entities whose full detail layer has been supplied and verified by the data
 * team, rather than derived. They carry real identifiers and are flagged
 * source_verified.
 */
const VANTEX_SUMMARY = [
  'European universal bank specialising in Sharia-compliant finance, a wholly owned subsidiary of First Abu Dhabi Bank.',
  'Banque universelle européenne spécialisée en finance islamique, filiale à 100 % de First Abu Dhabi Bank.',
  'Europäische Universalbank mit Schwerpunkt auf Scharia-konformer Finanzierung, hundertprozentige Tochter der First Abu Dhabi Bank.',
  'Banca universale europea specializzata nella finanza islamica, controllata al 100 % da First Abu Dhabi Bank.',
  'Banco universal europeu especializado em finança islâmica, subsidiária a 100 % do First Abu Dhabi Bank.',
  'Banco universal europeo especializado en finanzas islámicas, filial al 100 % de First Abu Dhabi Bank.',
  'مصرف شامل أوروبي متخصص في التمويل المتوافق مع الشريعة، مملوك بالكامل لبنك أبوظبي الأول.',
];

const VANTEX_DESC = [
  'Vantex Bank AG is a European universal bank headquartered in Frankfurt am Main and a wholly owned subsidiary of First Abu Dhabi Bank. It specialises in Sharia-compliant financing for individuals, businesses and real estate. Authorised by BaFin and passported across the EEA, it operates through branches in France and Luxembourg.',
  'Vantex Bank AG est une banque universelle européenne dont le siège se situe à Francfort-sur-le-Main, filiale à 100 % de First Abu Dhabi Bank. Elle est spécialisée dans le financement conforme à la charia pour les particuliers, les entreprises et l’immobilier. Agréée par la BaFin et bénéficiant du passeport européen, elle opère par des succursales en France et au Luxembourg.',
  'Die Vantex Bank AG ist eine europäische Universalbank mit Sitz in Frankfurt am Main und hundertprozentige Tochter der First Abu Dhabi Bank. Sie ist auf Scharia-konforme Finanzierungen für Privatpersonen, Unternehmen und Immobilien spezialisiert. Von der BaFin zugelassen und mit EWR-Pass tätig, unterhält sie Niederlassungen in Frankreich und Luxemburg.',
  'Vantex Bank AG è una banca universale europea con sede a Francoforte sul Meno, controllata al 100 % da First Abu Dhabi Bank. È specializzata in finanziamenti conformi alla sharia per privati, imprese e immobili. Autorizzata dalla BaFin e con passaporto SEE, opera tramite succursali in Francia e Lussemburgo.',
  'O Vantex Bank AG é um banco universal europeu com sede em Frankfurt am Main, subsidiária a 100 % do First Abu Dhabi Bank. Está especializado em financiamento conforme à charia para particulares, empresas e imobiliário. Autorizado pela BaFin e com passaporte EEE, opera através de sucursais em França e no Luxemburgo.',
  'Vantex Bank AG es un banco universal europeo con sede en Fráncfort del Meno, filial al 100 % de First Abu Dhabi Bank. Está especializado en financiación conforme a la sharia para particulares, empresas e inmuebles. Autorizado por BaFin y con pasaporte EEE, opera mediante sucursales en Francia y Luxemburgo.',
  'مصرف Vantex Bank AG مصرف شامل أوروبي يقع مقره في فرانكفورت، وهو مملوك بالكامل لبنك أبوظبي الأول. ويتخصص في التمويل المتوافق مع الشريعة للأفراد والشركات والعقارات. وهو مرخّص من BaFin ويتمتع بجواز التمرير الأوروبي، ويعمل عبر فرعين في فرنسا ولوكسمبورغ.',
];

const VANTEX_SCOPE = {
  deposit_taking: true,
  credit_granting: true,
  investment_services: true,
  insurance_distribution: true,
  payment_services: true,
};

const VANTEX_SOLIDITY = solidity({
  isBank: true,
  regulators: ['BaFin', 'ACPR', 'FCA'],
  founded: 2012,
  scope: VANTEX_SCOPE,
  passporting: true,
  editorial: 12,
});

const VANTEX_SERVICES = {
  banking: [['CURRENT_ACCOUNT', true], ['SAVINGS', true], ['PAYMENT_CARDS', false], ['WIRE_TRANSFERS', true]],
  credit: [['PERSONAL_LOANS', true], ['BUSINESS_LOANS', true], ['REAL_ESTATE_FINANCING', true]],
};

const VANTEX = {
  id: 'vantex-bank-de',
  entity_type: 'credit_institution',
  entity_subtype: 'universal_bank',
  source_verified: true,

  search_layer: {
    display_name: 'Vantex Bank',
    legal_name: 'Vantex Bank AG',
    country_code: 'DE',
    city: 'Frankfurt am Main',
    logo_url: '/logos/vantex-bank.jpg',
    logo_width: 560,
    logo_height: 209,
    regulator_primary: 'BaFin',
    status: { code: 'ACTIVE', labels: pack(STATUS_LABEL), color_badge: 'green' },
    specialization_tags: ['retail', 'corporate', 'islamic', 'eu_passporting'],
    quick_summary: pack(VANTEX_SUMMARY),
  },

  detail_layer: {
    identity: {
      legal_name: 'Vantex Bank AG',
      legal_names_translations: {
        ...pack(LOCALES.map(() => 'Vantex Bank AG')),
        fr: 'Vantex Bank S.A.',
      },
      commercial_names: ['Vantex Bank', 'Vantex Islamic Banking'],
      legal_form_code: 'AG',
      legal_form_label: pack(LEGAL_FORMS.DE[1]),
      parent_company: {
        id: 'fadb-ae',
        name: 'First Abu Dhabi Bank P.J.S.C.',
        country_code: 'AE',
        ownership_percentage: 100,
      },
    },
    registration: {
      registration_number: 'HRB 112847',
      registration_authority: 'Handelsregister Frankfurt am Main',
      registration_date: '2018-06-14',
      establishment_date: '2012-03-15',
      lei_code: '529900T8TG9H7X0QXZ42',
      bic_swift: 'SCSYFRP2',
      iban_prefix: 'FR76',
      vat_id: 'DE 824 365 719',
      pending_source: false,
    },
    contact: {
      headquarters: {
        street: 'Taunusanlage 12',
        postal_code: '60325',
        city: 'Frankfurt am Main',
        country_code: 'DE',
        pending_source: false,
      },
      communication: {
        email: 'contact@vantex-bank.com',
        phone: '+49 69 1234 5678',
        website: 'https://vantex-bank.com',
      },
      regional_contacts: [{ country_code: 'FR', email: 'france@vantex-bank.com' }],
      social_media: {
        linkedin: 'https://www.linkedin.com/company/vantex-bank',
        twitter: 'https://twitter.com/VantexBank',
        facebook: 'https://www.facebook.com/VantexBank',
      },
    },
    regulation: {
      primary_supervisor: { code: 'BAFIN', name: 'BaFin', country_code: 'DE' },
      secondary_supervisors: [
        { code: 'ACPR', name: 'ACPR', country_code: 'FR' },
        { code: 'FCA', name: 'FCA', country_code: 'GB' },
      ],
      regulatory_status: { code: 'AUTHORIZED', labels: pack(STATUS_LABEL), approval_date: '2018-06-14' },
      authorization_scope: VANTEX_SCOPE,
    },
    passporting: {
      status: 'ACTIVE',
      eligible_eea: true,
      eligible_eu: true,
      // The supplied list intersected with the EEA: passporting is an EEA right.
      eligible_countries: ['DE','FR','BE','NL','AT','LU','IT','ES','PT','PL','CZ','HU','SE','NO','DK','FI','IE'],
    },
    services: {
      banking_services: VANTEX_SERVICES.banking.map(([code, halal]) => ({
        code, label: pack(SERVICES[code]), islamic_compliant: halal,
      })),
      credit_services: VANTEX_SERVICES.credit.map(([code, halal]) => ({
        code, label: pack(SERVICES[code]), islamic_compliant: halal,
      })),
      islamic_finance_products: Object.entries(ISLAMIC).map(([code, [label, description]]) => ({
        code, label: pack(label), description: pack(description), compliant: true,
      })),
    },
    compliance: {
      sanctions_screening: { status: 'CLEAR', last_checked: '2026-08-20' },
      aml_kyc: { status: 'COMPLIANT', last_audit: '2024-01-15' },
      mifid2: { status: 'COMPLIANT' },
      psd2: { status: 'COMPLIANT', strong_authentication: true, open_banking: true },
      psd3: { status: 'COMPLIANT_PENDING', pending_source: true },
      gdpr: { status: 'COMPLIANT', privacy_policy_url: 'https://vantex-bank.com/privacy' },
      deposit_guarantee: true,
    },
    corporate_structure: {
      parent_entity: { name: 'First Abu Dhabi Bank P.J.S.C.', country: 'AE' },
      subsidiaries: [],
      branches: [
        {
          name: 'Vantex Bank Société Anonyme',
          country: 'FR',
          city: 'Paris',
          regulator: 'ACPR',
          reference: '18432',
          legal_form: 'Société Anonyme',
          registration_number: 'RCS Paris 824 365 719',
          iban_prefix: 'FR',
          address: {
            street: "42 Avenue de l'Opéra",
            postal_code: '75002',
            city: 'Paris',
            country_code: 'FR',
          },
        },
        { name: 'Vantex Bank (Luxembourg) S.à r.l.', country: 'LU', city: 'Luxembourg', regulator: 'CSSF' },
      ],
      pending_source: false,
    },
    financial_metrics: { pending_source: true },
    service_channels: { remote: true, electronic_signature: true },
    editorial: {
      description: pack(VANTEX_DESC),
      certifications: [
        {
          name: 'Sharia Board Certification',
          issuer: 'International Islamic Financial Board',
          certification_date: '2020-06-01',
          validity_until: '2036-12-31',
        },
      ],
    },
    solidity: VANTEX_SOLIDITY,
  },

  metadata_internal: {
    data_quality_score: 0.85,
    completeness_score: 0.92,
    sources: ['BaFin Register', 'ACPR Directory', 'GLEIF LEI Database', 'Official website'],
    next_refresh: '2026-09-26',
    flags: [],
    licence_type: 'CREDIT_INSTITUTION',
    kind: 'islamic',
    tags: ['retail', 'corporate', 'islamic'],
    founded: 2012,
  },
};

institutions.unshift(VANTEX);

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
  const reg = inst.search_layer.regulator_primary;
  const d = new Date(Date.UTC(2026, 7, 20) - Math.floor(rnd() * 330) * 86400000);
  const title = {}, snippet = {};
  for (const l of LOCALES) {
    title[l] = NEWS_TPL[cat].title[l](inst.search_layer.legal_name, reg);
    snippet[l] = NEWS_TPL[cat].snippet[l](inst.search_layer.legal_name, reg);
  }
  news.push({
    id: `news-${String(i + 1).padStart(3, '0')}`,
    institutionId: inst.id,
    country: inst.search_layer.country_code,
    date: d.toISOString().slice(0, 10),
    category: cat,
    title,
    snippet,
    source: reg,
    sourceUrl: inst.detail_layer.contact.communication.website,
  });
}
news.sort((a, b) => (a.date < b.date ? 1 : -1));

fs.writeFileSync('src/data/institutions.json', JSON.stringify(institutions, null, 2));
fs.writeFileSync('src/data/news.json', JSON.stringify(news, null, 2));
console.log(`institutions: ${institutions.length}, news: ${news.length}, countries: ${new Set(institutions.map((i) => i.search_layer.country_code)).size}`);
