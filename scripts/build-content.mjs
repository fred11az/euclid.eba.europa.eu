import fs from 'node:fs';
const L = ['en', 'fr', 'de', 'it', 'pt', 'es', 'ar'];
const pack = (vals) => Object.fromEntries(L.map((l, i) => [l, vals[i]]));

/* ---------------- Glossary ---------------- */
const GLOSSARY = [
  {
    slug: 'authorisation',
    label: ['Authorisation','Agrément','Zulassung','Autorizzazione','Autorização','Autorización','الترخيص'],
    body: [
      'An authorisation is the permission a national authority gives a company to carry out financial business. It is granted to a named legal entity, for a defined list of services, and it can be restricted or withdrawn at any time — which is why the register, not the company website, is the source to trust.',
      "Un agrément est l'autorisation qu'une autorité nationale accorde à une société pour exercer une activité financière. Il est délivré à une entité juridique nommément désignée, pour une liste de services définie, et peut être restreint ou retiré à tout moment — d'où l'importance de se fier au registre plutôt qu'au site de la société.",
      'Eine Zulassung ist die Erlaubnis einer nationalen Behörde, Finanzgeschäfte zu betreiben. Sie wird einer namentlich bestimmten juristischen Person für eine festgelegte Liste von Dienstleistungen erteilt und kann jederzeit eingeschränkt oder entzogen werden — deshalb zählt das Register, nicht die Website des Unternehmens.',
      "L'autorizzazione è il permesso che un'autorità nazionale concede a una società per svolgere attività finanziaria. È rilasciata a un soggetto giuridico nominativo, per un elenco definito di servizi, e può essere limitata o revocata in qualsiasi momento: per questo fa fede il registro, non il sito della società.",
      'A autorização é a permissão que uma autoridade nacional concede a uma sociedade para exercer atividade financeira. É atribuída a uma entidade jurídica identificada, para uma lista definida de serviços, e pode ser restringida ou retirada a qualquer momento — por isso o que conta é o registo, não o sítio da empresa.',
      'La autorización es el permiso que una autoridad nacional concede a una sociedad para ejercer actividad financiera. Se otorga a una entidad jurídica identificada, para una lista definida de servicios, y puede restringirse o retirarse en cualquier momento: por eso vale el registro, no la web de la empresa.',
      'الترخيص هو الإذن الذي تمنحه سلطة وطنية لشركة لمزاولة نشاط مالي. ويُمنح لكيان قانوني محدّد بالاسم، ولقائمة خدمات معيّنة، ويمكن تقييده أو سحبه في أي وقت — ولهذا فإن السجل، لا موقع الشركة، هو المرجع.',
    ],
  },
  {
    slug: 'supervisor',
    label: ['Supervisor','Superviseur','Aufsichtsbehörde','Autorità di vigilanza','Supervisor','Supervisor','الجهة المشرفة'],
    body: [
      'The supervisor is the public authority that checks, on an ongoing basis, that an authorised institution still meets its obligations. Every European country has one; the largest banks in the euro area are supervised jointly with the European Central Bank.',
      "Le superviseur est l'autorité publique qui vérifie en continu qu'un établissement agréé respecte toujours ses obligations. Chaque pays européen dispose du sien ; les plus grandes banques de la zone euro sont supervisées conjointement avec la Banque centrale européenne.",
      'Die Aufsichtsbehörde prüft laufend, ob ein zugelassenes Institut seine Pflichten weiterhin erfüllt. Jedes europäische Land hat eine; die größten Banken des Euroraums werden gemeinsam mit der Europäischen Zentralbank beaufsichtigt.',
      "L'autorità di vigilanza è l'ente pubblico che verifica in via continuativa che un ente autorizzato rispetti i propri obblighi. Ogni Paese europeo ha la sua; le maggiori banche dell'area euro sono vigilate insieme alla Banca centrale europea.",
      'O supervisor é a autoridade pública que verifica continuamente se uma instituição autorizada cumpre as suas obrigações. Cada país europeu tem o seu; os maiores bancos da área do euro são supervisionados em conjunto com o Banco Central Europeu.',
      'El supervisor es la autoridad pública que comprueba de forma continua que una entidad autorizada sigue cumpliendo sus obligaciones. Cada país europeo tiene el suyo; los mayores bancos de la zona del euro se supervisan junto con el Banco Central Europeo.',
      'الجهة المشرفة هي السلطة العامة التي تتحقق باستمرار من استيفاء المؤسسة المرخّصة لالتزاماتها. ولكل بلد أوروبي جهته؛ أما أكبر بنوك منطقة اليورو فتخضع لإشراف مشترك مع البنك المركزي الأوروبي.',
    ],
  },
  {
    slug: 'deposit-guarantee',
    label: ['Deposit guarantee','Garantie des dépôts','Einlagensicherung','Garanzia dei depositi','Garantia de depósitos','Garantía de depósitos','ضمان الودائع'],
    body: [
      'In the European Union, deposits held with an authorised credit institution are covered up to €100,000 per depositor and per institution, by the guarantee scheme of the country that granted the licence. Payment and e-money institutions are not covered: they must instead keep client funds separate from their own, which protects you differently.',
      "Dans l'Union européenne, les dépôts détenus auprès d'un établissement de crédit agréé sont couverts jusqu'à 100 000 € par déposant et par établissement, par le système de garantie du pays ayant délivré l'agrément. Les établissements de paiement et de monnaie électronique n'en bénéficient pas : ils doivent cantonner les fonds des clients, ce qui protège autrement.",
      'In der Europäischen Union sind Einlagen bei einem zugelassenen Kreditinstitut bis 100.000 € je Einleger und Institut durch das Sicherungssystem des Zulassungslandes gedeckt. Zahlungs- und E-Geld-Institute fallen nicht darunter: Sie müssen Kundengelder getrennt halten, was anders schützt.',
      "Nell'Unione europea i depositi presso un ente creditizio autorizzato sono coperti fino a 100.000 € per depositante e per ente dal sistema di garanzia del Paese che ha rilasciato l'autorizzazione. Gli istituti di pagamento e di moneta elettronica non lo sono: devono segregare i fondi della clientela, con una tutela di natura diversa.",
      'Na União Europeia, os depósitos junto de uma instituição de crédito autorizada estão cobertos até 100 000 € por depositante e por instituição, pelo sistema de garantia do país que concedeu a autorização. As instituições de pagamento e de moeda eletrónica não estão: têm de segregar os fundos dos clientes, o que protege de outra forma.',
      'En la Unión Europea, los depósitos en una entidad de crédito autorizada están cubiertos hasta 100 000 € por depositante y entidad, por el sistema de garantía del país que concedió la licencia. Las entidades de pago y de dinero electrónico no lo están: deben segregar los fondos de clientes, lo que protege de otro modo.',
      'في الاتحاد الأوروبي، تُغطّى الودائع لدى مؤسسة ائتمان مرخّصة حتى 100000 يورو لكل مودع ولكل مؤسسة، عبر نظام الضمان في البلد المانح للترخيص. أما مؤسسات الدفع والنقود الإلكترونية فلا تشملها التغطية: إذ يجب عليها فصل أموال العملاء، وهي حماية من نوع آخر.',
    ],
  },
  {
    slug: 'passporting',
    label: ['EEA passporting','Passeport européen','EWR-Pass','Passaporto SEE','Passaporte EEE','Pasaporte EEE','جواز التمرير الأوروبي'],
    body: [
      'An institution authorised in one European Economic Area country may offer its services in the others without asking for a new licence. So the bank serving you may be supervised abroad: read the country on its record, because that country decides which register applies and which guarantee scheme covers you.',
      "Un établissement agréé dans un pays de l'Espace économique européen peut proposer ses services dans les autres sans nouvel agrément. La banque qui vous sert peut donc être supervisée à l'étranger : lisez le pays indiqué sur sa fiche, car c'est lui qui détermine le registre applicable et le système de garantie qui vous couvre.",
      'Ein in einem EWR-Land zugelassenes Institut darf seine Dienste in den anderen ohne neue Zulassung anbieten. Ihre Bank kann also im Ausland beaufsichtigt werden: Achten Sie auf das Land im Eintrag, denn es bestimmt das maßgebliche Register und das für Sie geltende Sicherungssystem.',
      "Un ente autorizzato in un Paese SEE può offrire i propri servizi negli altri senza una nuova autorizzazione. La banca che vi serve può quindi essere vigilata all'estero: leggete il Paese indicato nella scheda, perché determina il registro applicabile e il sistema di garanzia che vi copre.",
      'Uma instituição autorizada num país do EEE pode prestar serviços nos restantes sem nova autorização. O banco que o serve pode, assim, ser supervisionado no estrangeiro: veja o país indicado na ficha, pois é ele que determina o registo aplicável e o sistema de garantia que o cobre.',
      'Una entidad autorizada en un país del EEE puede prestar servicios en los demás sin nueva licencia. El banco que le atiende puede estar supervisado en el extranjero: mire el país de su ficha, porque determina el registro aplicable y el sistema de garantía que le cubre.',
      'يجوز للمؤسسة المرخّصة في أحد بلدان المنطقة الاقتصادية الأوروبية أن تقدّم خدماتها في البلدان الأخرى دون ترخيص جديد. لذا قد يكون البنك الذي تتعامل معه خاضعاً لإشراف خارجي: انظر إلى البلد المذكور في صفحته، فهو الذي يحدّد السجل المعتمد ونظام الضمان الذي يحميك.',
    ],
  },
  {
    slug: 'bic',
    label: ['BIC / SWIFT code','Code BIC / SWIFT','BIC-/SWIFT-Code','Codice BIC / SWIFT','Código BIC / SWIFT','Código BIC / SWIFT','رمز BIC / SWIFT'],
    body: [
      'The BIC identifies a financial institution internationally, usually in eight or eleven characters: four for the institution, two for the country, two for the location. It tells you where an institution is established, but on its own it is not proof that the institution is authorised.',
      "Le BIC identifie un établissement financier à l'international, généralement sur huit ou onze caractères : quatre pour l'établissement, deux pour le pays, deux pour la localité. Il indique où l'établissement est établi, mais ne prouve pas à lui seul qu'il est agréé.",
      'Der BIC identifiziert ein Finanzinstitut international, meist mit acht oder elf Zeichen: vier für das Institut, zwei für das Land, zwei für den Ort. Er zeigt den Sitz, ist für sich genommen aber kein Nachweis einer Zulassung.',
      "Il BIC identifica un ente finanziario a livello internazionale, di norma con otto o undici caratteri: quattro per l'ente, due per il Paese, due per la località. Indica dove l'ente è stabilito, ma da solo non prova che sia autorizzato.",
      'O BIC identifica uma instituição financeira internacionalmente, em geral com oito ou onze caracteres: quatro para a instituição, dois para o país, dois para a localidade. Indica onde está estabelecida, mas por si só não prova que está autorizada.',
      'El BIC identifica a una entidad financiera internacionalmente, normalmente con ocho u once caracteres: cuatro de la entidad, dos del país, dos de la localidad. Indica dónde está establecida, pero por sí solo no prueba que esté autorizada.',
      'يعرّف رمز BIC المؤسسة المالية دولياً، وهو عادة من ثمانية أو أحد عشر حرفاً: أربعة للمؤسسة، وحرفان للبلد، وحرفان للموقع. وهو يدل على مكان تأسيسها، لكنه وحده ليس دليلاً على أنها مرخّصة.',
    ],
  },
  {
    slug: 'iban',
    label: ['IBAN','IBAN','IBAN','IBAN','IBAN','IBAN','رقم الحساب المصرفي الدولي (IBAN)'],
    body: [
      'An IBAN starts with the two-letter code of the country where the account is held. A company may quote you an IBAN from a country other than yours and that is lawful under the single market — but it tells you which register and which guarantee scheme actually apply to your money.',
      "Un IBAN commence par le code à deux lettres du pays où le compte est tenu. Une société peut vous communiquer un IBAN d'un autre pays que le vôtre, ce qui est licite dans le marché unique — mais cela vous indique quel registre et quel système de garantie s'appliquent réellement à votre argent.",
      'Eine IBAN beginnt mit dem zweistelligen Ländercode des kontoführenden Landes. Ein Unternehmen darf Ihnen eine IBAN aus einem anderen Land nennen — im Binnenmarkt ist das zulässig, zeigt Ihnen aber, welches Register und welches Sicherungssystem für Ihr Geld gelten.',
      "Un IBAN inizia con il codice di due lettere del Paese in cui è tenuto il conto. Una società può indicarvi un IBAN di un Paese diverso dal vostro: è lecito nel mercato unico, ma vi dice quale registro e quale sistema di garanzia si applicano davvero al vostro denaro.",
      'Um IBAN começa pelo código de duas letras do país onde a conta é mantida. Uma empresa pode indicar-lhe um IBAN de outro país — é lícito no mercado único, mas indica qual o registo e o sistema de garantia que se aplicam ao seu dinheiro.',
      'Un IBAN empieza por el código de dos letras del país donde se mantiene la cuenta. Una empresa puede darle un IBAN de otro país: es lícito en el mercado único, pero le indica qué registro y qué sistema de garantía se aplican a su dinero.',
      'يبدأ رقم الـIBAN برمز البلد المكوّن من حرفين حيث يُحتفظ بالحساب. وقد تعطيك شركة رقم IBAN من بلد غير بلدك، وهذا مشروع في السوق الموحّدة — لكنه يدلّك على السجل ونظام الضمان اللذين ينطبقان فعلاً على أموالك.',
    ],
  },
  {
    slug: 'psd2',
    label: ['PSD2','DSP2','PSD2','PSD2','DSP2','PSD2','توجيه الدفع PSD2'],
    body: [
      'The second Payment Services Directive governs payment accounts across the Union. In practice it gives you strong customer authentication, a right to dispute unauthorised transactions, and the ability to let a licensed third party access your account only with your explicit consent.',
      "La deuxième directive sur les services de paiement encadre les comptes de paiement dans l'Union. Concrètement, elle vous apporte l'authentification forte, un droit de contestation des opérations non autorisées et la possibilité de laisser un tiers agréé accéder à votre compte avec votre seul consentement explicite.",
      'Die zweite Zahlungsdiensterichtlinie regelt Zahlungskonten in der Union. Praktisch bringt sie starke Kundenauthentifizierung, ein Recht auf Widerspruch gegen nicht autorisierte Zahlungen und den Zugriff lizenzierter Dritter nur mit Ihrer ausdrücklichen Zustimmung.',
      'La seconda direttiva sui servizi di pagamento disciplina i conti di pagamento nell\'Unione. In pratica offre autenticazione forte, il diritto di contestare operazioni non autorizzate e l\'accesso di terzi autorizzati al conto solo con il vostro consenso esplicito.',
      'A segunda diretiva dos serviços de pagamento regula as contas de pagamento na União. Na prática, dá-lhe autenticação forte, o direito de contestar operações não autorizadas e o acesso de terceiros autorizados à conta apenas com o seu consentimento explícito.',
      'La segunda directiva de servicios de pago regula las cuentas de pago en la Unión. En la práctica le da autenticación reforzada, derecho a impugnar operaciones no autorizadas y el acceso de terceros autorizados a su cuenta solo con su consentimiento explícito.',
      'ينظّم توجيه خدمات الدفع الثاني حسابات الدفع في الاتحاد. وهو يمنحك عملياً مصادقة قوية، وحق الاعتراض على العمليات غير المصرّح بها، وإتاحة وصول طرف ثالث مرخّص إلى حسابك بموافقتك الصريحة وحدها.',
    ],
  },
  {
    slug: 'mifid2',
    label: ['MiFID II','MiFID II','MiFID II','MiFID II','DMIF II','MiFID II','MiFID II'],
    body: [
      'MiFID II covers investment services: advice, order execution, portfolio management. An institution authorised under it must assess whether a product suits you, disclose its costs, and tell you how it is paid — obligations that do not apply to a plain payment account.',
      "MiFID II encadre les services d'investissement : conseil, exécution d'ordres, gestion de portefeuille. Un établissement agréé à ce titre doit évaluer si un produit vous convient, en publier les coûts et vous indiquer comment il est rémunéré — des obligations qui ne s'appliquent pas à un simple compte de paiement.",
      'MiFID II regelt Wertpapierdienstleistungen: Beratung, Orderausführung, Portfolioverwaltung. Ein danach zugelassenes Institut muss die Eignung eines Produkts prüfen, Kosten offenlegen und seine Vergütung nennen — Pflichten, die für ein reines Zahlungskonto nicht gelten.',
      "La MiFID II disciplina i servizi di investimento: consulenza, esecuzione di ordini, gestione di portafogli. L'ente autorizzato deve valutare l'adeguatezza del prodotto, indicarne i costi e dichiarare come viene remunerato — obblighi che non valgono per un semplice conto di pagamento.",
      'A DMIF II abrange os serviços de investimento: aconselhamento, execução de ordens, gestão de carteiras. A instituição autorizada deve avaliar se o produto lhe é adequado, divulgar os custos e indicar como é remunerada — obrigações que não se aplicam a uma simples conta de pagamento.',
      'MiFID II regula los servicios de inversión: asesoramiento, ejecución de órdenes, gestión de carteras. La entidad autorizada debe evaluar si el producto le conviene, publicar sus costes e indicar cómo se remunera: obligaciones que no rigen para una simple cuenta de pago.',
      'يغطّي MiFID II خدمات الاستثمار: المشورة وتنفيذ الأوامر وإدارة المحافظ. وعلى المؤسسة المرخّصة بموجبه أن تقيّم ملاءمة المنتج لك، وتفصح عن تكاليفه، وتبيّن كيف تتقاضى أجرها — وهي التزامات لا تنطبق على حساب دفع بسيط.',
    ],
  },
];

/* ---------------- Licence explainers ---------------- */
const LICENCES = [
  {
    slug: 'credit-institution',
    type: 'CREDIT_INSTITUTION',
    summary: [
      'A credit institution — what most people call a bank — is authorised to take deposits from the public and to grant credit. It is the most demanding licence in the European framework: capital requirements, liquidity rules and ongoing supervision all apply.',
      "Un établissement de crédit — ce que l'on appelle couramment une banque — est agréé pour recevoir des dépôts du public et octroyer des crédits. C'est l'agrément le plus exigeant du cadre européen : exigences de capital, règles de liquidité et supervision continue s'y appliquent.",
      'Ein Kreditinstitut — umgangssprachlich eine Bank — darf Einlagen des Publikums entgegennehmen und Kredite vergeben. Es ist die anspruchsvollste Zulassung im europäischen Rahmen: Kapitalanforderungen, Liquiditätsregeln und laufende Aufsicht gelten.',
      "Un ente creditizio — ciò che comunemente si chiama banca — è autorizzato a raccogliere depositi dal pubblico e a concedere credito. È l'autorizzazione più esigente del quadro europeo: requisiti di capitale, regole di liquidità e vigilanza continua.",
      'Uma instituição de crédito — o que se chama vulgarmente um banco — está autorizada a receber depósitos do público e a conceder crédito. É a autorização mais exigente do quadro europeu: requisitos de capital, regras de liquidez e supervisão contínua.',
      'Una entidad de crédito — lo que se llama comúnmente un banco — está autorizada a captar depósitos del público y conceder crédito. Es la autorización más exigente del marco europeo: requisitos de capital, normas de liquidez y supervisión continua.',
      'مؤسسة الائتمان — وهي ما يسميه الناس بنكاً — مرخّص لها بتلقّي الودائع من الجمهور ومنح الائتمان. وهي أكثر التراخيص تشدّداً في الإطار الأوروبي: تنطبق عليها متطلبات رأس المال وقواعد السيولة والإشراف المستمر.',
    ],
    protects: [
      'Your deposits are covered up to €100,000 per depositor by the national guarantee scheme of the country that granted the licence, even if the bank fails.',
      "Vos dépôts sont couverts jusqu'à 100 000 € par déposant par le système national de garantie du pays ayant délivré l'agrément, même en cas de défaillance de la banque.",
      'Ihre Einlagen sind bis 100.000 € je Einleger durch das nationale Sicherungssystem des Zulassungslandes gedeckt — auch bei Ausfall der Bank.',
      'I vostri depositi sono coperti fino a 100.000 € per depositante dal sistema nazionale di garanzia del Paese che ha rilasciato l\'autorizzazione, anche in caso di dissesto della banca.',
      'Os seus depósitos estão cobertos até 100 000 € por depositante pelo sistema nacional de garantia do país que concedeu a autorização, mesmo em caso de falência do banco.',
      'Sus depósitos están cubiertos hasta 100 000 € por depositante por el sistema nacional de garantía del país que concedió la licencia, incluso si el banco quiebra.',
      'ودائعك مغطّاة حتى 100000 يورو لكل مودع عبر نظام الضمان الوطني في البلد المانح للترخيص، حتى لو تعثّر البنك.',
    ],
  },
  {
    slug: 'payment-institution',
    type: 'PAYMENT_INSTITUTION',
    summary: [
      'A payment institution may execute transfers, process card payments and initiate payments on your behalf. It may not take deposits, and it may not lend your money on — the funds it holds are there to be moved, not to be invested.',
      "Un établissement de paiement peut exécuter des virements, traiter des paiements par carte et initier des paiements pour votre compte. Il ne peut ni recevoir de dépôts ni prêter votre argent — les fonds qu'il détient sont là pour circuler, pas pour être investis.",
      'Ein Zahlungsinstitut darf Überweisungen ausführen, Kartenzahlungen abwickeln und Zahlungen für Sie auslösen. Einlagen darf es nicht entgegennehmen und Ihr Geld nicht weiterverleihen — die gehaltenen Mittel sollen bewegt, nicht angelegt werden.',
      "Un istituto di pagamento può eseguire bonifici, trattare pagamenti con carta e disporre pagamenti per vostro conto. Non può raccogliere depositi né prestare il vostro denaro: i fondi detenuti servono a circolare, non a essere investiti.",
      'Uma instituição de pagamento pode executar transferências, processar pagamentos com cartão e iniciar pagamentos em seu nome. Não pode receber depósitos nem emprestar o seu dinheiro — os fundos que detém servem para circular, não para investir.',
      'Una entidad de pago puede ejecutar transferencias, procesar pagos con tarjeta e iniciar pagos por su cuenta. No puede captar depósitos ni prestar su dinero: los fondos que mantiene están para moverse, no para invertirse.',
      'يجوز لمؤسسة الدفع تنفيذ التحويلات ومعالجة مدفوعات البطاقات وبدء المدفوعات نيابة عنك. ولا يجوز لها تلقّي الودائع ولا إقراض أموالك — فالأموال التي تحتفظ بها للتحريك لا للاستثمار.',
    ],
    protects: [
      'Your money is not covered by deposit guarantee. It is protected by safeguarding: client funds must be held separately from the firm’s own money, so they can be returned if the firm fails.',
      "Votre argent n'est pas couvert par la garantie des dépôts. Il est protégé par le cantonnement : les fonds des clients doivent être détenus séparément des fonds propres, afin de pouvoir être restitués en cas de défaillance.",
      'Ihr Geld ist nicht von der Einlagensicherung gedeckt. Es wird durch Trennung geschützt: Kundengelder müssen getrennt vom Firmenvermögen gehalten und bei Ausfall zurückgegeben werden.',
      'Il vostro denaro non è coperto dalla garanzia dei depositi. È tutelato dalla segregazione: i fondi della clientela vanno tenuti separati dal patrimonio della società e restituiti in caso di dissesto.',
      'O seu dinheiro não está coberto pela garantia de depósitos. É protegido por segregação: os fundos dos clientes têm de ser mantidos separados dos da empresa e devolvidos em caso de falência.',
      'Su dinero no está cubierto por la garantía de depósitos. Se protege mediante segregación: los fondos de clientes deben mantenerse separados de los de la empresa y devolverse si quiebra.',
      'أموالك غير مغطّاة بضمان الودائع، بل تُحمى بالفصل: إذ يجب الاحتفاظ بأموال العملاء منفصلة عن أموال الشركة لتُردّ إليهم عند التعثّر.',
    ],
  },
  {
    slug: 'emoney-institution',
    type: 'EMONEY_INSTITUTION',
    summary: [
      'An electronic money institution issues stored value — the balance behind a prepaid card or a wallet — against funds you hand over. It carries out payments like a payment institution, and additionally issues that electronic money, but it is still not a bank.',
      "Un établissement de monnaie électronique émet de la valeur stockée — le solde derrière une carte prépayée ou un portefeuille — en contrepartie des fonds que vous remettez. Il exécute des paiements comme un établissement de paiement et émet en outre cette monnaie électronique, mais ce n'est toujours pas une banque.",
      'Ein E-Geld-Institut gibt gespeicherten Wert aus — das Guthaben hinter einer Prepaid-Karte oder Wallet — gegen von Ihnen übergebene Mittel. Es führt Zahlungen aus wie ein Zahlungsinstitut und gibt zusätzlich dieses E-Geld aus, ist aber weiterhin keine Bank.',
      "Un istituto di moneta elettronica emette valore memorizzato — il saldo dietro una carta prepagata o un wallet — a fronte dei fondi che consegnate. Esegue pagamenti come un istituto di pagamento e in più emette tale moneta elettronica, ma non è una banca.",
      'Uma instituição de moeda eletrónica emite valor armazenado — o saldo por trás de um cartão pré-pago ou de uma carteira — contra os fundos que entrega. Executa pagamentos como uma instituição de pagamento e emite essa moeda eletrónica, mas não é um banco.',
      'Una entidad de dinero electrónico emite valor almacenado — el saldo tras una tarjeta prepago o un monedero — contra los fondos que usted entrega. Ejecuta pagos como una entidad de pago y además emite ese dinero electrónico, pero no es un banco.',
      'تُصدر مؤسسة النقود الإلكترونية قيمة مخزّنة — الرصيد خلف بطاقة مسبقة الدفع أو محفظة — مقابل الأموال التي تسلّمها. وهي تنفّذ المدفوعات كمؤسسة دفع وتُصدر إضافة إلى ذلك تلك النقود الإلكترونية، لكنها تبقى غير مصرف.',
    ],
    protects: [
      'As with a payment institution, there is no deposit guarantee: funds are safeguarded separately, and you keep a right to redeem your electronic money at face value at any time.',
      "Comme pour un établissement de paiement, il n'y a pas de garantie des dépôts : les fonds sont cantonnés, et vous conservez le droit de rembourser votre monnaie électronique à sa valeur nominale à tout moment.",
      'Wie beim Zahlungsinstitut gibt es keine Einlagensicherung: Mittel werden getrennt gesichert, und Sie behalten jederzeit das Recht, Ihr E-Geld zum Nennwert zurückzutauschen.',
      "Come per l'istituto di pagamento non c'è garanzia dei depositi: i fondi sono segregati e conservate il diritto di rimborsare la moneta elettronica al valore nominale in ogni momento.",
      'Tal como numa instituição de pagamento, não há garantia de depósitos: os fundos são segregados e mantém o direito de reembolsar a sua moeda eletrónica pelo valor nominal a qualquer momento.',
      'Como en una entidad de pago, no hay garantía de depósitos: los fondos se segregan y conserva el derecho a reembolsar su dinero electrónico por su valor nominal en cualquier momento.',
      'كما في مؤسسة الدفع، لا يوجد ضمان للودائع: تُفصل الأموال، ويظل لك حق استرداد نقودك الإلكترونية بقيمتها الاسمية في أي وقت.',
    ],
  },
];

const out = {
  glossary: GLOSSARY.map((g) => ({ slug: g.slug, label: pack(g.label), body: pack(g.body) })),
  licences: LICENCES.map((l) => ({
    slug: l.slug,
    type: l.type,
    summary: pack(l.summary),
    protects: pack(l.protects),
  })),
};
fs.writeFileSync('src/data/content.json', JSON.stringify(out, null, 2) + '\n');
console.log(`glossary: ${out.glossary.length}, licences: ${out.licences.length}`);
