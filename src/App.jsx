import { useState, useMemo, useEffect } from "react";
import { BlogList, ArticleView } from "./Blog.jsx";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ── Translations ──────────────────────────────────────────────
const T = {
  fr: {
    dir: "ltr",
    font: "'Bricolage Grotesque', 'Segoe UI', sans-serif",
    tagline: "Frais de notaire · Enregistrement · Crédit · Coût total",
    taglineMobile: "Simulateur Maroc 2026",
    badge1: "✓ Données officielles CGI 2025",
    badge2: "🇲🇦 Maroc uniquement",
    tabs: [
      { id: "notaire",        icon: "📋", label: "Frais de notaire",         short: "Notaire",       sub: "Calcul complet ligne par ligne" },
      { id: "enregistrement", icon: "🏛️", label: "Droits d'enregistrement", short: "Enregistrement", sub: "Taxes DGI sur la mutation" },
      { id: "credit",         icon: "🏦", label: "Simulation crédit",        short: "Crédit",         sub: "Mensualités & coût total" },
      { id: "total",          icon: "🏠", label: "Coût total d'acquisition", short: "Coût total",     sub: "Vision complète prix réel" },
      { id: "blog",           icon: "📚", label: "Guides & Articles",        short: "Articles",       sub: "Guides FR & AR" },
    ],
    menuHint: "— Appuyer sur ☰ pour changer",
    alsoTry: "💡 Allez plus loin",
    disclaimer: "Simulateur à titre indicatif uniquement. Données basées sur le CGI 2025, décret 2-16-375, et la loi 14.25. Les taux et barèmes sont susceptibles de changer. Consultez un notaire agréé au Maroc avant toute transaction. Sources : DGI, ANCFCC, Crédit du Maroc, Valfoncier.",
    // Frais notaire
    votreBien: "Votre bien immobilier",
    prixVente: "Prix de vente du bien",
    prixHint: "Prix tel qu'indiqué dans le compromis de vente",
    withAgencyLabel: "Bien acheté via agence immobilière",
    withAgencyHint: "Commission généralement entre 2.5% et 3.5%",
    agencyRateLabel: "Taux commission agence",
    financement: "Financement hypothécaire",
    withMortgageLabel: "Achat financé par crédit bancaire",
    withMortgageHint: "Entraîne des droits d'inscription hypothécaire additionnels",
    loanLabel: "Montant du prêt immobilier",
    loanHint: "Droits calculés selon barème progressif: 0.5% / 1.5% / 0.5%",
    baremeTitle: "Barème officiel (Décret 2-16-375)",
    trancheCol: "Tranche de prix",
    honorairesCol: "Honoraires",
    tranches: [
      ["≤ 300 000 MAD",         "4 000 MAD (fixe)"],
      ["300 001 – 1 000 000",   "1,50%"],
      ["1 000 001 – 5 000 000", "1,25%"],
      ["5 000 001 – 10 000 000","0,75%"],
      ["> 10 000 000",           "0,50%"],
    ],
    tvaWarning: "⚠️ + 10% TVA sur les honoraires notaire",
    fraisTotaux: "Frais totaux estimés",
    soitPct: (p) => `soit ${p}% du prix de vente`,
    prixReel: "Prix réel de revient (tout compris)",
    detailLigne: "Détail ligne par ligne",
    prixBien: "Prix du bien",
    droitsEnreg: "Droits d'enregistrement",
    droitsSub: "4% du prix de vente · payés à la DGI",
    conservFonc: "Conservation foncière",
    conservSub: (f) => `1,5% + ${f} MAD fixe · ANCFCC`,
    honorairesNotaire: "Honoraires notaire",
    honorairesSub: "Barème progressif réglementé",
    tvaHon: "TVA sur honoraires",
    tvaSub: "10% sur les honoraires uniquement",
    fraisDossier: "Frais de dossier (timbres, copies...)",
    fraisDossierSub: "~1 000 à 1 500 MAD selon notaire",
    commAgence: (r) => `Commission agence (${r}%)`,
    droitsHypo: "Droits inscription hypothèque",
    droitsHypoSub: "Barème progressif 0.5% / 1.5% / 0.5% + 75 MAD",
    totalFrais: "Total frais (hors prix du bien)",
    prixRevient: "Prix de revient total",
    repartition: "Répartition des frais",
    droitsEnregPct: "Droits d'enregistrement (4%)",
    conservPct: "Conservation foncière (1.5%)",
    honorTva: "Honoraires + TVA",
    agencePct: (r) => `Agence (${r}%)`,
    hypo: "Hypothèque",
    divers: "Divers",
    // Enregistrement
    typeBienTitle: "Type de bien et transaction",
    valeurDeclaree: "Valeur déclarée du bien",
    valeurHint: "La DGI peut contester si le prix déclaré est sous le référentiel DGI",
    typeBien: "Type de bien",
    bienTypes: {
      habitation: { label: "Bien à usage d'habitation", note: "Taux standard CGI art. 133" },
      terrain:    { label: "Terrain nu / agricole",     note: "Taux majoré pour terrains à bâtir" },
      commercial: { label: "Local commercial / bureau", note: "Taux spécifique foncier commercial" },
      sci:        { label: "Via société immobilière",   note: "Soumis à IS — cession de parts" },
    },
    importantTitle: "Important à savoir",
    importantItems: [
      { t: "Délai de paiement", d: "Les droits d'enregistrement doivent être payés dans les 30 jours suivant l'acte de vente, sous peine de pénalités." },
      { t: "Référentiel DGI",   d: "La DGI possède un référentiel de prix au m² par zone. Si votre prix déclaré est inférieur, un redressement fiscal est possible." },
      { t: "Loi 14.25 (2025)",  d: "Les actes doivent désormais être signés électroniquement et accompagnés d'une attestation d'enregistrement pour la conservation foncière." },
    ],
    droitsTitle: "Droits d'enregistrement",
    tauxApplique: (r) => `Taux appliqué : ${r}%`,
    conservLabel: "+ Conservation foncière",
    totalTaxes: "Total taxes État",
    detailCalc: "Détail du calcul",
    valeurBien: "Valeur du bien",
    collecteLabel: "Collectés par le notaire → DGI",
    inscriptionLabel: "Inscription au titre foncier → ANCFCC",
    certifLabel: "Certificat de propriété + droit fixe",
    certifSub: "100 DH + 100 DH",
    totalEtat: "Total taxes à payer à l'État",
    soitPctPrix: "Soit en % du prix",
    quiPaieTitle: "Qui paie quoi?",
    quiPaieItems: [
      { who: "🧑 Acheteur", what: "Droits d'enregistrement + conservation foncière + frais notaire + agence" },
      { who: "🏦 Notaire",  what: "Collecte les taxes et les reverse à la DGI et l'ANCFCC" },
      { who: "🏠 Vendeur",  what: "Plus-value immobilière (si applicable) — TPI 20% sur la plus-value réalisée" },
    ],
    // Credit
    paramsCredit: "Paramètres du crédit",
    prixBienLabel: "Prix du bien",
    apportLabel: "Apport personnel",
    apportHint: (m, p) => `Montant emprunté: ${m} MAD (${p}% du prix)`,
    typeFinancement: "Type de financement",
    financTypes: [
      { id: "amortissable", label: "Classique",  sub: "Taux d'intérêt" },
      { id: "mourabaha",    label: "Mourabaha",  sub: "Islamique / sans intérêt" },
    ],
    tauxLabel: (t) => t === "mourabaha" ? "Taux de marge (%)" : "Taux d'intérêt annuel (%)",
    dureeLabel: "Durée du crédit",
    mensualiteTitle: "Mensualité estimée",
    assuranceLabel: (a, t) => `+ assurance ~${a} MAD → total ${t} MAD/mois`,
    coutTotalCredit: "Coût total crédit",
    totalRembourse: "Total remboursé",
    salaireRequis: "Salaire requis (35%)",
    recapTitle: "Récapitulatif complet",
    montantEmprunte: "Montant emprunté",
    mensualiteSub: (d, t) => `Sur ${d} ans · taux ${t}%`,
    coutInterets: "Coût total des intérêts/marges",
    droitsHypoLabel: "Droits inscription hypothèque",
    droitsHypoSub2: "Barème progressif + 75 MAD fixe",
    coutOpTotal: "Coût total de l'opération",
    regle35Title: "💡 Règle des 35%",
    regle35: (s) => `Les banques marocaines accordent généralement un crédit si votre mensualité ne dépasse pas 35% de votre revenu net mensuel. Pour cette mensualité, il vous faut un revenu minimum de ${s} MAD/mois.`,
    // Cout total
    votreAcquis: "Votre acquisition",
    viaAgence: "Via agence immobilière",
    tauxCommission: "Taux commission",
    budgetTravaux: "Budget travaux / rénovation",
    travauxHint: "Optionnel — incluez les travaux prévus",
    financementLabel: "Financement",
    creditLabel: "Financement par crédit immobilier",
    apportLabel2: "Apport personnel",
    apportHint2: (m, p) => `Crédit: ${m} MAD · ${p}% du prix`,
    tauxInteret: "Taux d'intérêt",
    duree: "Durée",
    coutTotalAcquis: "Coût total réel de l'acquisition",
    vsPrix: (p) => `vs. prix affiché de ${p} MAD — vous payez`,
    pluscher: (p) => `${p}% de plus`,
    ventilTitle: "Ventilation complète",
    fraisAcquis: "Frais d'acquisition",
    fraisAcquisTag: (p) => `${p}% du prix`,
    droitsEnreg4: "Droits d'enregistrement (4%)",
    conserv15: "Conservation foncière (1.5%)",
    honorTvaLabel: "Honoraires notaire + TVA",
    commAgence2: (r) => `Commission agence (${r}%)`,
    droitsHypo2: "Droits hypothèque",
    fraisDossier2: "Frais de dossier",
    budgetTravaux2: "Budget travaux",
    coutCredit: (d) => `Coût crédit sur ${d} ans`,
    investTotal: "Investissement total réel",
    mensualiteEst: "Mensualité estimée",
    mensualiteSub2: (m, d) => `${m} MAD/mois sur ${d} ans`,
    mensuelMad: (m) => `MAD/mois`,
  },
  ar: {
    dir: "rtl",
    font: "'Cairo', 'Segoe UI', sans-serif",
    tagline: "رسوم التوثيق · التسجيل · القرض · التكلفة الإجمالية",
    taglineMobile: "محاكي عقاري 2026",
    badge1: "✓ بيانات رسمية CGI 2025",
    badge2: "🇲🇦 المغرب فقط",
    tabs: [
      { id: "notaire",        icon: "📋", label: "رسوم التوثيق",        short: "التوثيق",    sub: "حساب تفصيلي سطراً بسطر" },
      { id: "enregistrement", icon: "🏛️", label: "رسوم التسجيل",       short: "التسجيل",    sub: "ضرائب المديرية العامة للضرائب" },
      { id: "credit",         icon: "🏦", label: "محاكاة القرض",        short: "القرض",      sub: "الأقساط والتكلفة الإجمالية" },
      { id: "total",          icon: "🏠", label: "التكلفة الإجمالية",   short: "الإجمالي",   sub: "الصورة الكاملة للسعر الحقيقي" },
      { id: "blog",           icon: "📚", label: "أدلة ومقالات",        short: "المقالات",   sub: "مقالات بالعربية والفرنسية" },
    ],
    menuHint: "— اضغط ☰ للتغيير",
    alsoTry: "💡 اكتشف المزيد",
    disclaimer: "هذا المحاكي للاستئناس فقط. البيانات مستندة إلى CGI 2025 والمرسوم 2-16-375 والقانون 14.25. قد تتغير المعدلات. استشر موثقاً معتمداً قبل أي معاملة عقارية. المصادر: المديرية العامة للضرائب، الوكالة الوطنية للمحافظة العقارية، كريدي دو ماروك.",
    // Frais notaire
    votreBien: "عقارك",
    prixVente: "سعر بيع العقار",
    prixHint: "السعر كما هو مذكور في عقد الوعد بالبيع",
    withAgencyLabel: "شراء عبر وكالة عقارية",
    withAgencyHint: "العمولة عادةً بين 2.5% و3.5%",
    agencyRateLabel: "نسبة عمولة الوكالة",
    financement: "التمويل العقاري",
    withMortgageLabel: "شراء بتمويل بنكي",
    withMortgageHint: "يستلزم رسوم تسجيل رهن إضافية",
    loanLabel: "مبلغ القرض العقاري",
    loanHint: "تُحسب الرسوم وفق شريحة تصاعدية: 0.5% / 1.5% / 0.5%",
    baremeTitle: "الجدول الرسمي (المرسوم 2-16-375)",
    trancheCol: "شريحة السعر",
    honorairesCol: "الأتعاب",
    tranches: [
      ["≤ 300 000 درهم",        "4 000 درهم (ثابتة)"],
      ["300 001 – 1 000 000",   "1.50%"],
      ["1 000 001 – 5 000 000", "1.25%"],
      ["5 000 001 – 10 000 000","0.75%"],
      ["> 10 000 000",           "0.50%"],
    ],
    tvaWarning: "⚠️ + 10% ضريبة القيمة المضافة على أتعاب الموثق",
    fraisTotaux: "إجمالي الرسوم التقديرية",
    soitPct: (p) => `أي ${p}% من سعر البيع`,
    prixReel: "السعر الحقيقي الإجمالي (شامل كل شيء)",
    detailLigne: "التفصيل سطراً بسطر",
    prixBien: "سعر العقار",
    droitsEnreg: "رسوم التسجيل",
    droitsSub: "4% من سعر البيع · تُؤدى للمديرية العامة للضرائب",
    conservFonc: "المحافظة العقارية",
    conservSub: (f) => `1.5% + ${f} درهم ثابتة · ANCFCC`,
    honorairesNotaire: "أتعاب الموثق",
    honorairesSub: "جدول تصاعدي منظم",
    tvaHon: "ضريبة القيمة المضافة على الأتعاب",
    tvaSub: "10% على الأتعاب فقط",
    fraisDossier: "مصاريف الملف (طوابع، نسخ...)",
    fraisDossierSub: "~1 000 إلى 1 500 درهم حسب الموثق",
    commAgence: (r) => `عمولة الوكالة (${r}%)`,
    droitsHypo: "رسوم تسجيل الرهن",
    droitsHypoSub: "شريحة تصاعدية 0.5% / 1.5% / 0.5% + 75 درهم",
    totalFrais: "إجمالي الرسوم (دون سعر العقار)",
    prixRevient: "التكلفة الإجمالية الشاملة",
    repartition: "توزيع الرسوم",
    droitsEnregPct: "رسوم التسجيل (4%)",
    conservPct: "المحافظة العقارية (1.5%)",
    honorTva: "الأتعاب + الضريبة",
    agencePct: (r) => `الوكالة (${r}%)`,
    hypo: "الرهن",
    divers: "متفرقات",
    // Enregistrement
    typeBienTitle: "نوع العقار والمعاملة",
    valeurDeclaree: "القيمة المصرح بها للعقار",
    valeurHint: "يمكن للمديرية العامة للضرائب الطعن إذا كان السعر أقل من المرجعي",
    typeBien: "نوع العقار",
    bienTypes: {
      habitation: { label: "عقار سكني",          note: "المعدل العادي CGI المادة 133" },
      terrain:    { label: "أرض عارية / فلاحية", note: "معدل مرتفع للأراضي البنائية" },
      commercial: { label: "محل تجاري / مكتب",  note: "معدل خاص بالعقار التجاري" },
      sci:        { label: "عبر شركة عقارية",    note: "خاضع لضريبة الشركات" },
    },
    importantTitle: "معلومات مهمة",
    importantItems: [
      { t: "أجل الأداء",            d: "يجب أداء رسوم التسجيل خلال 30 يوماً من تاريخ العقد، وإلا تعرض لغرامات التأخير." },
      { t: "المرجعي الجبائي",       d: "تمتلك المديرية العامة للضرائب مرجعياً لأسعار المتر المربع حسب المنطقة. إذا كان السعر المصرح به أقل، يمكن إجراء تصحيح جبائي." },
      { t: "القانون 14.25 (2025)",  d: "يجب الآن التوقيع على العقود إلكترونياً ومرفقة بشهادة التسجيل للمحافظة العقارية." },
    ],
    droitsTitle: "رسوم التسجيل",
    tauxApplique: (r) => `المعدل المطبق: ${r}%`,
    conservLabel: "+ المحافظة العقارية",
    totalTaxes: "إجمالي الضرائب الحكومية",
    detailCalc: "تفصيل الحساب",
    valeurBien: "قيمة العقار",
    collecteLabel: "تُجمع عبر الموثق → المديرية العامة للضرائب",
    inscriptionLabel: "تسجيل الرسم العقاري → ANCFCC",
    certifLabel: "شهادة الملكية + رسم ثابت",
    certifSub: "100 + 100 درهم",
    totalEtat: "إجمالي الضرائب المستحقة للدولة",
    soitPctPrix: "أي نسبة من السعر",
    quiPaieTitle: "من يدفع ماذا؟",
    quiPaieItems: [
      { who: "🧑 المشتري", what: "رسوم التسجيل + المحافظة العقارية + رسوم التوثيق + الوكالة" },
      { who: "🏦 الموثق",  what: "يجمع الضرائب ويؤديها للمديرية العامة للضرائب و ANCFCC" },
      { who: "🏠 البائع",  what: "ضريبة الأرباح العقارية (إن وجدت) — 20% من الربح المحقق" },
    ],
    // Credit
    paramsCredit: "معطيات القرض",
    prixBienLabel: "سعر العقار",
    apportLabel: "المساهمة الشخصية",
    apportHint: (m, p) => `المبلغ المقترض: ${m} درهم (${p}% من السعر)`,
    typeFinancement: "نوع التمويل",
    financTypes: [
      { id: "amortissable", label: "كلاسيكي",  sub: "بفائدة" },
      { id: "mourabaha",    label: "مرابحة",   sub: "إسلامي / بدون فائدة" },
    ],
    tauxLabel: (t) => t === "mourabaha" ? "نسبة هامش الربح (%)" : "معدل الفائدة السنوي (%)",
    dureeLabel: "مدة القرض",
    mensualiteTitle: "القسط الشهري التقديري",
    assuranceLabel: (a, t) => `+ تأمين ~${a} درهم → الإجمالي ${t} درهم/شهر`,
    coutTotalCredit: "إجمالي تكلفة القرض",
    totalRembourse: "إجمالي ما يُسدَّد",
    salaireRequis: "الراتب المطلوب (35%)",
    recapTitle: "ملخص كامل",
    montantEmprunte: "المبلغ المقترض",
    mensualiteSub: (d, t) => `على ${d} سنة · معدل ${t}%`,
    coutInterets: "إجمالي تكلفة الفوائد/الهامش",
    droitsHypoLabel: "رسوم تسجيل الرهن",
    droitsHypoSub2: "شريحة تصاعدية + 75 درهم ثابتة",
    coutOpTotal: "التكلفة الإجمالية للعملية",
    regle35Title: "💡 قاعدة الـ35%",
    regle35: (s) => `تمنح البنوك المغربية عموماً القرض إذا لم يتجاوز القسط الشهري 35% من دخلك الصافي. لهذا القسط، تحتاج دخلاً شهرياً لا يقل عن ${s} درهم.`,
    // Cout total
    votreAcquis: "عملية الاقتناء",
    viaAgence: "عبر وكالة عقارية",
    tauxCommission: "نسبة العمولة",
    budgetTravaux: "ميزانية الأشغال / التجديد",
    travauxHint: "اختياري — أدرج الأشغال المخططة",
    financementLabel: "التمويل",
    creditLabel: "تمويل بقرض عقاري",
    apportLabel2: "المساهمة الشخصية",
    apportHint2: (m, p) => `القرض: ${m} درهم · ${p}% من السعر`,
    tauxInteret: "معدل الفائدة",
    duree: "المدة",
    coutTotalAcquis: "التكلفة الحقيقية الإجمالية للاقتناء",
    vsPrix: (p) => `مقارنةً بالسعر المعلن ${p} درهم — ستدفع`,
    pluscher: (p) => `${p}% أكثر`,
    ventilTitle: "التوزيع الكامل",
    fraisAcquis: "رسوم الاقتناء",
    fraisAcquisTag: (p) => `${p}% من السعر`,
    droitsEnreg4: "رسوم التسجيل (4%)",
    conserv15: "المحافظة العقارية (1.5%)",
    honorTvaLabel: "أتعاب الموثق + الضريبة",
    commAgence2: (r) => `عمولة الوكالة (${r}%)`,
    droitsHypo2: "رسوم الرهن",
    fraisDossier2: "مصاريف الملف",
    budgetTravaux2: "ميزانية الأشغال",
    coutCredit: (d) => `تكلفة القرض على ${d} سنة`,
    investTotal: "إجمالي الاستثمار الحقيقي",
    mensualiteEst: "القسط الشهري التقديري",
    mensualiteSub2: (m, d) => `${m} درهم/شهر على ${d} سنة`,
    mensuelMad: () => `درهم/شهر`,
  },
};

// ── Official Rates ────────────────────────────────────────────
const RATES = {
  enregistrement: 0.04,
  conservationFonciere: 0.015,
  conservationFixe: 200,
  fraisDossier: 1250,
  tvaHonoraires: 0.10,
  hypotheque: [
    { max: 250000,   rate: 0.005 },
    { max: 5000000,  rate: 0.015 },
    { max: Infinity, rate: 0.005 },
  ],
  hypothequeFixe: 75,
  honoraires: [
    { max: 300000,   rate: null,  fixed: 4000 },
    { max: 1000000,  rate: 0.015, fixed: null },
    { max: 5000000,  rate: 0.0125,fixed: null },
    { max: 10000000, rate: 0.0075,fixed: null },
    { max: Infinity, rate: 0.005, fixed: null },
  ],
};

function fmt(n) {
  if (!n && n !== 0) return "—";
  return Math.round(n).toLocaleString("fr-MA");
}

function calcHonoraires(price) {
  const bracket = RATES.honoraires.find(b => price <= b.max);
  if (!bracket) return 0;
  return bracket.fixed !== null ? bracket.fixed : price * bracket.rate;
}

function calcHypotheque(montant) {
  let total = 0, remaining = montant;
  const thresholds = [250000, 5000000];
  const rates = [0.005, 0.015, 0.005];
  let prev = 0;
  for (let i = 0; i < thresholds.length; i++) {
    const tranche = Math.min(remaining, thresholds[i] - prev);
    if (tranche <= 0) break;
    total += tranche * rates[i];
    remaining -= tranche;
    prev = thresholds[i];
  }
  if (remaining > 0) total += remaining * rates[2];
  return total + RATES.hypothequeFixe;
}

// ── Palette ───────────────────────────────────────────────────
const emerald = "#0A7B5C";
const emeraldDark = "#075C45";
const emeraldLight = "#ECFDF5";
const emeraldBorder = "#A7F3D0";
const sand = "#F5F0E8";
const ink = "#1A1A2E";
const inkMid = "#2D3561";
const inkLight = "#6B7280";
const gold = "#B45309";
const goldLight = "#FFF8EE";
const goldBorder = "#FDE68A";
const red = "#DC2626";
const white = "#FFFFFF";
const gray50 = "#F9FAFB";
const gray100 = "#F3F4F6";
const gray200 = "#E5E7EB";
const gray400 = "#9CA3AF";

// ── Shared Components ─────────────────────────────────────────
function PriceInput({ label, value, onChange, hint, prefix = "MAD", dir }) {
  const [display, setDisplay] = useState(value ? fmt(value) : "");
  const handleChange = (e) => {
    const raw = e.target.value.replace(/\s/g, "").replace(/,/g, "");
    const digits = raw.replace(/[^\d]/g, "");
    setDisplay(digits ? parseInt(digits).toLocaleString("fr-MA") : "");
    onChange(parseInt(digits) || 0);
  };
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: inkLight, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: white, border: `2px solid ${value > 0 ? emerald : gray200}`, borderRadius: 10, overflow: "hidden", transition: "border-color 0.2s", boxShadow: value > 0 ? `0 0 0 3px ${emeraldLight}` : "none", flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
        <input type="text" inputMode="numeric" value={display} onChange={handleChange} placeholder="0"
          style={{ flex: 1, border: "none", outline: "none", padding: "13px 16px", fontSize: 18, fontWeight: 700, color: ink, background: "transparent", fontFamily: "inherit", textAlign: dir === "rtl" ? "right" : "left" }} />
        <span style={{ padding: "0 16px", fontSize: 12, fontWeight: 700, color: inkLight, background: gray50, borderLeft: dir === "rtl" ? "none" : `1px solid ${gray200}`, borderRight: dir === "rtl" ? `1px solid ${gray200}` : "none", height: "100%", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{prefix}</span>
      </div>
      {hint && <div style={{ fontSize: 12, color: inkLight, marginTop: 5, display: "flex", alignItems: "center", gap: 5 }}><span style={{ color: gold }}>ℹ</span> {hint}</div>}
    </div>
  );
}

function Toggle({ label, value, onChange, hint }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: hint ? 4 : 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: ink }}>{label}</span>
        <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? emerald : gray200, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: white, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
        </div>
      </div>
      {hint && <div style={{ fontSize: 12, color: inkLight }}>{hint}</div>}
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step, display }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: inkLight, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
        <span style={{ fontSize: 15, fontWeight: 800, color: emerald }}>{display || value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: emerald, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: gray400, marginTop: 3 }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

function Row({ label, amount, sub, highlight, faint, divider, indent, tag }) {
  if (divider) return <div style={{ height: 1, background: gray200, margin: "8px 0" }} />;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: highlight ? "12px 16px" : "8px 16px", background: highlight ? emeraldLight : "transparent", borderRadius: highlight ? 10 : 0, marginBottom: highlight ? 4 : 0, border: highlight ? `1px solid ${emeraldBorder}` : "none" }}>
      <div style={{ paddingLeft: indent ? 14 : 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: highlight ? 14 : 13, fontWeight: highlight ? 700 : faint ? 400 : 500, color: faint ? gray400 : highlight ? emeraldDark : ink }}>{label}</span>
          {tag && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: goldLight, color: gold, border: `1px solid ${goldBorder}`, whiteSpace: "nowrap" }}>{tag}</span>}
        </div>
        {sub && <div style={{ fontSize: 11, color: gray400, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: highlight ? 17 : 13, fontWeight: highlight ? 800 : faint ? 400 : 600, color: faint ? gray400 : highlight ? emerald : ink, whiteSpace: "nowrap", marginLeft: 12, textAlign: "right" }}>
        {fmt(amount)} <span style={{ fontSize: 10, color: gray400, fontWeight: 400 }}>MAD</span>
      </div>
    </div>
  );
}

function Card({ title, icon, children, accent }) {
  return (
    <div style={{ background: white, borderRadius: 14, border: `1px solid ${accent ? emeraldBorder : gray200}`, boxShadow: accent ? `0 4px 20px rgba(10,123,92,0.08)` : "0 1px 6px rgba(0,0,0,0.04)", overflow: "hidden", marginBottom: 0 }}>
      {title && (
        <div style={{ padding: "13px 16px", borderBottom: `1px solid ${gray100}`, display: "flex", alignItems: "center", gap: 10, background: accent ? emeraldLight : gray50 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: accent ? emeraldDark : ink }}>{title}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function AlsoTry({ currentTab, onSwitch, t }) {
  const suggestions = t.tabs.filter(tab => tab.id !== currentTab && tab.id !== "blog");
  return (
    <div style={{ marginTop: 14, padding: "14px 16px", background: emeraldLight, border: `1px solid ${emeraldBorder}`, borderRadius: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: emeraldDark, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.alsoTry}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {suggestions.map(tab => (
          <button key={tab.id} onClick={() => onSwitch(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: `1px solid ${emeraldBorder}`, background: white, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = emeraldLight; e.currentTarget.style.borderColor = emeraldDark; }}
            onMouseLeave={e => { e.currentTarget.style.background = white; e.currentTarget.style.borderColor = emeraldBorder; }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{tab.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: ink }}>{tab.label}</div>
              <div style={{ fontSize: 11, color: inkLight }}>{tab.sub}</div>
            </div>
            <span style={{ marginLeft: "auto", color: emerald, fontSize: 14, flexShrink: 0 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── TAB 1: Frais de Notaire ───────────────────────────────────
function FraisNotaire({ onSwitch, t }) {
  const isMobile = useIsMobile();
  const [price, setPrice] = useState(1500000);
  const [withAgency, setWithAgency] = useState(true);
  const [agencyRate, setAgencyRate] = useState(2.5);
  const [withMortgage, setWithMortgage] = useState(false);
  const [loanAmount, setLoanAmount] = useState(1000000);

  const enregistrement = price * RATES.enregistrement;
  const conservation = price * RATES.conservationFonciere + RATES.conservationFixe;
  const honoraires = calcHonoraires(price);
  const tvaHonoraires = honoraires * RATES.tvaHonoraires;
  const fraisDossier = RATES.fraisDossier;
  const agencyFee = withAgency ? price * (agencyRate / 100) : 0;
  const hypoFees = withMortgage ? calcHypotheque(loanAmount) : 0;
  const totalNotaire = enregistrement + conservation + honoraires + tvaHonoraires + fraisDossier;
  const totalAll = totalNotaire + agencyFee + hypoFees;
  const pctOfPrice = ((totalAll / price) * 100).toFixed(1);
  const prixReel = price + totalAll;

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title={t.votreBien} icon="🏠">
          <div style={{ padding: "16px 16px 0" }}>
            <PriceInput label={t.prixVente} value={price} onChange={setPrice} hint={t.prixHint} dir={t.dir} />
            <Toggle label={t.withAgencyLabel} value={withAgency} onChange={setWithAgency} hint={t.withAgencyHint} />
            {withAgency && <SliderInput label={t.agencyRateLabel} value={agencyRate} onChange={setAgencyRate} min={1} max={5} step={0.5} display={`${agencyRate}% = ${fmt(price * agencyRate / 100)} MAD`} />}
          </div>
        </Card>
        <Card title={t.financement} icon="🏦">
          <div style={{ padding: "16px 16px 0" }}>
            <Toggle label={t.withMortgageLabel} value={withMortgage} onChange={setWithMortgage} hint={t.withMortgageHint} />
            {withMortgage && <PriceInput label={t.loanLabel} value={loanAmount} onChange={setLoanAmount} hint={t.loanHint} dir={t.dir} />}
          </div>
        </Card>
        <Card title={t.baremeTitle} icon="📐">
          <div style={{ padding: "12px 16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: t.dir === "rtl" ? "right" : "left", color: inkLight, fontWeight: 600, paddingBottom: 6, borderBottom: `1px solid ${gray200}` }}>{t.trancheCol}</th>
                  <th style={{ textAlign: t.dir === "rtl" ? "left" : "right", color: inkLight, fontWeight: 600, paddingBottom: 6, borderBottom: `1px solid ${gray200}` }}>{t.honorairesCol}</th>
                </tr>
              </thead>
              <tbody>
                {t.tranches.map(([tr, r], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? gray50 : white }}>
                    <td style={{ padding: "5px 8px", color: ink }}>{tr}</td>
                    <td style={{ padding: "5px 8px", color: emerald, fontWeight: 700, textAlign: t.dir === "rtl" ? "left" : "right" }}>{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 10, fontSize: 11, color: inkLight, padding: "8px 10px", background: goldLight, borderRadius: 7, border: `1px solid ${goldBorder}` }}>{t.tvaWarning}</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: `linear-gradient(135deg, ${emerald} 0%, ${emeraldDark} 100%)`, borderRadius: 16, padding: "24px 20px", color: white, boxShadow: `0 8px 32px rgba(10,123,92,0.25)` }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.fraisTotaux}</div>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-1px", marginBottom: 4 }}>{fmt(totalAll)} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.8 }}>MAD</span></div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>{t.soitPct(pctOfPrice)}</div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{t.prixReel}</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{fmt(prixReel)} MAD</div>
          </div>
        </div>

        <Card title={t.detailLigne} icon="🧾" accent>
          <div style={{ paddingTop: 4 }}>
            <Row label={t.prixBien} amount={price} tag="Base" />
            <Row divider />
            <Row label={t.droitsEnreg} amount={enregistrement} sub={t.droitsSub} indent />
            <Row label={t.conservFonc} amount={conservation} sub={t.conservSub(RATES.conservationFixe)} indent />
            <Row label={t.honorairesNotaire} amount={honoraires} sub={t.honorairesSub} indent />
            <Row label={t.tvaHon} amount={tvaHonoraires} sub={t.tvaSub} indent faint />
            <Row label={t.fraisDossier} amount={fraisDossier} sub={t.fraisDossierSub} indent faint />
            {withAgency && <Row label={t.commAgence(agencyRate)} amount={agencyFee} indent />}
            {withMortgage && <Row label={t.droitsHypo} amount={hypoFees} sub={t.droitsHypoSub} indent />}
            <Row divider />
            <Row label={t.totalFrais} amount={totalAll} highlight />
            <Row label={t.prixRevient} amount={prixReel} highlight />
          </div>
        </Card>

        <Card title={t.repartition} icon="📊">
          <div style={{ padding: "12px 16px" }}>
            {[
              { label: t.droitsEnregPct, value: enregistrement, color: red },
              { label: t.conservPct,     value: conservation,   color: gold },
              { label: t.honorTva,       value: honoraires + tvaHonoraires, color: emerald },
              ...(withAgency  ? [{ label: t.agencePct(agencyRate), value: agencyFee, color: inkMid }] : []),
              ...(withMortgage? [{ label: t.hypo, value: hypoFees, color: inkLight }] : []),
              { label: t.divers, value: fraisDossier, color: gray400 },
            ].map(item => {
              const pct = totalAll > 0 ? (item.value / totalAll * 100) : 0;
              return (
                <div key={item.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: item.color, display: "inline-block", flexShrink: 0 }} />
                      <span style={{ color: ink }}>{item.label}</span>
                    </span>
                    <span style={{ fontWeight: 700, color: ink }}>{fmt(item.value)} MAD</span>
                  </div>
                  <div style={{ height: 5, background: gray100, borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: item.color, borderRadius: 5, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <AlsoTry currentTab="notaire" onSwitch={onSwitch} t={t} />
      </div>
    </div>
  );
}

// ── TAB 2: Droits d'Enregistrement ───────────────────────────
function DroitsEnregistrement({ onSwitch, t }) {
  const isMobile = useIsMobile();
  const [price, setPrice] = useState(800000);
  const [type, setType] = useState("habitation");

  const rates = { habitation: 0.04, terrain: 0.05, commercial: 0.06, sci: 0.04 };
  const selectedRate = rates[type];
  const selectedInfo = t.bienTypes[type];
  const droits = price * selectedRate;
  const conservation = price * RATES.conservationFonciere + RATES.conservationFixe;
  const total = droits + conservation;

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title={t.typeBienTitle} icon="🏛️">
          <div style={{ padding: "16px 16px 4px" }}>
            <PriceInput label={t.valeurDeclaree} value={price} onChange={setPrice} hint={t.valeurHint} dir={t.dir} />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: inkLight, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.typeBien}</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(rates).map(([key, rate]) => (
                  <button key={key} onClick={() => setType(key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: `2px solid ${type === key ? emerald : gray200}`, borderRadius: 10, background: type === key ? emeraldLight : white, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: `2px solid ${type === key ? emerald : gray400}`, background: type === key ? emerald : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {type === key && <div style={{ width: 6, height: 6, borderRadius: "50%", background: white }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ink }}>{t.bienTypes[key].label}</div>
                      <div style={{ fontSize: 11, color: inkLight }}>{t.bienTypes[key].note}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: 15, fontWeight: 800, color: type === key ? emerald : inkLight }}>{(rate * 100).toFixed(0)}%</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title={t.importantTitle} icon="⚠️">
          <div style={{ padding: "12px 16px" }}>
            {t.importantItems.map(item => (
              <div key={item.t} style={{ marginBottom: 10, padding: "10px 12px", background: goldLight, borderRadius: 8, border: `1px solid ${goldBorder}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: gold, marginBottom: 3 }}>{item.t}</div>
                <div style={{ fontSize: 12, color: inkLight, lineHeight: 1.5 }}>{item.d}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: `linear-gradient(135deg, ${inkMid} 0%, ${ink} 100%)`, borderRadius: 16, padding: "24px 20px", color: white }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.droitsTitle}</div>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-1px", marginBottom: 4 }}>{fmt(droits)} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.7 }}>MAD</span></div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>{t.tauxApplique((selectedRate * 100).toFixed(0))}</div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><div style={{ fontSize: 11, opacity: 0.6 }}>{t.conservLabel}</div><div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(conservation)} MAD</div></div>
            <div><div style={{ fontSize: 11, opacity: 0.6 }}>{t.totalTaxes}</div><div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(total)} MAD</div></div>
          </div>
        </div>

        <Card title={t.detailCalc} icon="🧮" accent>
          <div style={{ paddingTop: 4 }}>
            <Row label={t.valeurBien} amount={price} />
            <Row divider />
            <Row label={`${t.droitsEnreg} (${(selectedRate*100)}%)`} amount={droits} sub={t.collecteLabel} indent />
            <Row label={t.conservFonc + " (1.5%)"} amount={price * 0.015} sub={t.inscriptionLabel} indent />
            <Row label={t.certifLabel} amount={RATES.conservationFixe} sub={t.certifSub} indent faint />
            <Row divider />
            <Row label={t.totalEtat} amount={total} highlight />
            <Row label={t.soitPctPrix} amount={`${((total/price)*100).toFixed(2)}%`} faint />
          </div>
        </Card>

        <Card title={t.quiPaieTitle} icon="👥">
          <div style={{ padding: "12px 16px" }}>
            {t.quiPaieItems.map((item, i) => (
              <div key={i} style={{ marginBottom: 8, display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8, background: gray50 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: [red, emerald, gold][i], minWidth: 80 }}>{item.who}</span>
                <span style={{ fontSize: 12, color: inkLight, lineHeight: 1.5 }}>{item.what}</span>
              </div>
            ))}
          </div>
        </Card>
        <AlsoTry currentTab="enregistrement" onSwitch={onSwitch} t={t} />
      </div>
    </div>
  );
}

// ── TAB 3: Simulation Crédit ──────────────────────────────────
function SimulationCredit({ onSwitch, t }) {
  const isMobile = useIsMobile();
  const [prix, setPrix] = useState(1200000);
  const [apport, setApport] = useState(300000);
  const [duree, setDuree] = useState(20);
  const [taux, setTaux] = useState(4.5);
  const [type, setType] = useState("amortissable");

  const montant = Math.max(0, prix - apport);
  const tauxMensuel = taux / 100 / 12;
  const nMois = duree * 12;

  let mensualite = 0;
  if (type === "amortissable" && tauxMensuel > 0 && montant > 0) {
    mensualite = montant * (tauxMensuel * Math.pow(1 + tauxMensuel, nMois)) / (Math.pow(1 + tauxMensuel, nMois) - 1);
  } else if (type === "mourabaha") {
    const marge = montant * (taux / 100) * duree;
    mensualite = (montant + marge) / nMois;
  }

  const coutTotal = mensualite * nMois;
  const coutCredit = coutTotal - montant;
  const assurance = montant * 0.003 / 12;
  const mensualiteAssurance = mensualite + assurance;
  const hypoFees = calcHypotheque(montant);
  const tauxEndettementSalaire = mensualiteAssurance > 0 ? (mensualiteAssurance / 0.35) : 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title={t.paramsCredit} icon="🏦">
          <div style={{ padding: "16px 16px 4px" }}>
            <PriceInput label={t.prixBienLabel} value={prix} onChange={setPrix} dir={t.dir} />
            <PriceInput label={t.apportLabel} value={apport} onChange={setApport} hint={t.apportHint(fmt(montant), prix > 0 ? Math.round((montant/prix)*100) : 0)} dir={t.dir} />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: inkLight, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.typeFinancement}</label>
              <div style={{ display: "flex", gap: 8 }}>
                {t.financTypes.map(ft => (
                  <button key={ft.id} onClick={() => setType(ft.id)} style={{ flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer", border: `2px solid ${type === ft.id ? emerald : gray200}`, background: type === ft.id ? emeraldLight : white, fontFamily: "inherit" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: type === ft.id ? emeraldDark : ink }}>{ft.label}</div>
                    <div style={{ fontSize: 11, color: inkLight }}>{ft.sub}</div>
                  </button>
                ))}
              </div>
            </div>
            <SliderInput label={t.tauxLabel(type)} value={taux} onChange={setTaux} min={2} max={8} step={0.25} display={`${taux}%`} />
            <SliderInput label={t.dureeLabel} value={duree} onChange={setDuree} min={5} max={30} step={1} display={`${duree} ${t.dir === "rtl" ? "سنة" : "ans"}`} />
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: `linear-gradient(135deg, #1B5FA8 0%, #0F3D6E 100%)`, borderRadius: 16, padding: "24px 20px", color: white }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.mensualiteTitle}</div>
          <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-1px", marginBottom: 4 }}>{fmt(mensualite)} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.7 }}>{t.mensuelMad()}</span></div>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>{t.assuranceLabel(fmt(assurance), fmt(mensualiteAssurance))}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {[
              { label: t.coutTotalCredit,  value: fmt(coutCredit) + " MAD" },
              { label: t.totalRembourse,   value: fmt(coutTotal) + " MAD" },
              { label: t.salaireRequis,    value: fmt(tauxEndettementSalaire) + " MAD" },
            ].map(item => (
              <div key={item.label}><div style={{ fontSize: 10, opacity: 0.6 }}>{item.label}</div><div style={{ fontSize: 13, fontWeight: 700 }}>{item.value}</div></div>
            ))}
          </div>
        </div>

        <Card title={t.recapTitle} icon="📊" accent>
          <div style={{ paddingTop: 4 }}>
            <Row label={t.prixBienLabel} amount={prix} />
            <Row label={t.apportLabel} amount={apport} indent />
            <Row label={t.montantEmprunte} amount={montant} indent />
            <Row divider />
            <Row label={t.mensualiteTitle} amount={mensualite} sub={t.mensualiteSub(duree, taux)} />
            <Row label={t.coutInterets} amount={coutCredit} indent faint />
            <Row label={t.droitsHypoLabel} amount={hypoFees} sub={t.droitsHypoSub2} indent faint />
            <Row divider />
            <Row label={t.coutOpTotal} amount={prix + coutCredit + hypoFees} highlight />
          </div>
        </Card>

        <div style={{ padding: "12px 14px", background: goldLight, borderRadius: 10, border: `1px solid ${goldBorder}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: gold, marginBottom: 4 }}>{t.regle35Title}</div>
          <div style={{ fontSize: 12, color: inkLight, lineHeight: 1.6 }}>{t.regle35(fmt(tauxEndettementSalaire))}</div>
        </div>
        <AlsoTry currentTab="credit" onSwitch={onSwitch} t={t} />
      </div>
    </div>
  );
}

// ── TAB 4: Coût Total ─────────────────────────────────────────
function CoutTotal({ onSwitch, t }) {
  const isMobile = useIsMobile();
  const [prix, setPrix] = useState(1500000);
  const [withAgency, setWithAgency] = useState(true);
  const [withCredit, setWithCredit] = useState(true);
  const [apport, setApport] = useState(400000);
  const [taux, setTaux] = useState(4.5);
  const [duree, setDuree] = useState(20);
  const [travaux, setTravaux] = useState(0);
  const [agencyRate, setAgencyRate] = useState(2.5);

  const montantCredit = Math.max(0, prix - apport);
  const tauxMensuel = taux / 100 / 12;
  const nMois = duree * 12;
  const mensualite = montantCredit > 0 && tauxMensuel > 0
    ? montantCredit * (tauxMensuel * Math.pow(1 + tauxMensuel, nMois)) / (Math.pow(1 + tauxMensuel, nMois) - 1) : 0;
  const coutCredit = mensualite * nMois - montantCredit;
  const honoraires = calcHonoraires(prix);
  const enregistrement = prix * 0.04;
  const conservation = prix * 0.015 + RATES.conservationFixe;
  const tvaHon = honoraires * 0.10;
  const agencyFee = withAgency ? prix * agencyRate / 100 : 0;
  const hypo = withCredit ? calcHypotheque(montantCredit) : 0;
  const divers = RATES.fraisDossier;
  const fraisAcquisition = enregistrement + conservation + honoraires + tvaHon + divers + agencyFee + hypo;
  const totalInvesti = prix + fraisAcquisition + travaux + (withCredit ? coutCredit : 0);
  const pctFrais = ((fraisAcquisition / prix) * 100).toFixed(1);

  const items = [
    { label: t.prixBien, amount: prix, color: ink, pct: prix / totalInvesti * 100 },
    { label: t.fraisAcquis, amount: fraisAcquisition, color: red, pct: fraisAcquisition / totalInvesti * 100 },
    ...(travaux > 0 ? [{ label: t.budgetTravaux2, amount: travaux, color: gold, pct: travaux / totalInvesti * 100 }] : []),
    ...(withCredit ? [{ label: t.coutCredit(duree), amount: coutCredit, color: emerald, pct: coutCredit / totalInvesti * 100 }] : []),
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title={t.votreAcquis} icon="🏠">
          <div style={{ padding: "16px 16px 4px" }}>
            <PriceInput label={t.prixBienLabel} value={prix} onChange={setPrix} dir={t.dir} />
            <Toggle label={t.viaAgence} value={withAgency} onChange={setWithAgency} />
            {withAgency && <SliderInput label={t.tauxCommission} value={agencyRate} onChange={setAgencyRate} min={1} max={5} step={0.5} display={`${agencyRate}%`} />}
            <PriceInput label={t.budgetTravaux} value={travaux} onChange={setTravaux} hint={t.travauxHint} dir={t.dir} />
          </div>
        </Card>
        <Card title={t.financementLabel} icon="🏦">
          <div style={{ padding: "16px 16px 4px" }}>
            <Toggle label={t.creditLabel} value={withCredit} onChange={setWithCredit} />
            {withCredit && (
              <>
                <PriceInput label={t.apportLabel2} value={apport} onChange={setApport} hint={t.apportHint2(fmt(montantCredit), prix > 0 ? Math.round(montantCredit/prix*100) : 0)} dir={t.dir} />
                <SliderInput label={t.tauxInteret} value={taux} onChange={setTaux} min={2} max={8} step={0.25} display={`${taux}%`} />
                <SliderInput label={t.duree} value={duree} onChange={setDuree} min={5} max={30} step={1} display={`${duree} ${t.dir === "rtl" ? "سنة" : "ans"}`} />
              </>
            )}
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: `linear-gradient(135deg, ${ink} 0%, ${inkMid} 100%)`, borderRadius: 16, padding: "24px 20px", color: white, boxShadow: "0 8px 32px rgba(26,26,46,0.25)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.coutTotalAcquis}</div>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1px", marginBottom: 6 }}>{fmt(totalInvesti)} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.6 }}>MAD</span></div>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>{t.vsPrix(fmt(prix))} <strong style={{ color: "#FCD34D" }}>{t.pluscher(pctFrais)}</strong></div>
          <div style={{ height: 14, borderRadius: 7, overflow: "hidden", display: "flex", marginBottom: 12 }}>
            {items.map(item => <div key={item.label} style={{ width: `${item.pct}%`, background: item.color, transition: "width 0.5s" }} />)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
            {items.map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                <span style={{ opacity: 0.8 }}>{item.label} ({item.pct.toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>

        <Card title={t.ventilTitle} icon="📋" accent>
          <div style={{ paddingTop: 4 }}>
            <Row label={t.prixBien} amount={prix} tag={t.fraisAcquisTag(pctFrais)} />
            <Row divider />
            <Row label={t.fraisAcquis} amount={fraisAcquisition} />
            <Row label={t.droitsEnreg4} amount={enregistrement} indent />
            <Row label={t.conserv15} amount={conservation} indent faint />
            <Row label={t.honorTvaLabel} amount={honoraires + tvaHon} indent faint />
            {withAgency && <Row label={t.commAgence2(agencyRate)} amount={agencyFee} indent faint />}
            {withCredit && <Row label={t.droitsHypo2} amount={hypo} indent faint />}
            <Row label={t.fraisDossier2} amount={divers} indent faint />
            {travaux > 0 && <Row label={t.budgetTravaux2} amount={travaux} />}
            {withCredit && <Row label={t.coutCredit(duree)} amount={coutCredit} />}
            <Row divider />
            <Row label={t.investTotal} amount={totalInvesti} highlight />
            {withCredit && <Row label={t.mensualiteEst} amount={mensualite} sub={t.mensualiteSub2(fmt(mensualite), duree)} faint />}
          </div>
        </Card>
        <AlsoTry currentTab="total" onSwitch={onSwitch} t={t} />
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function ImmobilierMA() {
  const [tab, setTab] = useState("notaire");
  const [articleSlug, setArticleSlug] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState("fr");
  const isMobile = useIsMobile();
  const t = T[lang];

  const switchTab = (newTab) => {
    setTab(newTab);
    setMenuOpen(false);
    setArticleSlug(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLang = () => setLang(l => l === "fr" ? "ar" : "fr");

  return (
    <div style={{ minHeight: "100vh", background: sand, fontFamily: t.font, color: ink, direction: t.dir }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800;900&family=Cairo:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: ${gray200}; border-radius: 5px; }
        input[type=range] { cursor: pointer; height: 4px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .content { animation: fadeUp 0.25s ease; }
        button { cursor: pointer; }
        input:focus { outline: none; }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div style={{ background: `linear-gradient(135deg, ${ink} 0%, ${inkMid} 60%, #1a3a6e 100%)`, padding: isMobile ? "16px 16px 0" : "28px 24px 0", position: "sticky", top: 0, zIndex: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isMobile ? 14 : 20, gap: 12 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${emerald}, ${emeraldDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: `0 4px 12px rgba(10,123,92,0.4)` }}>🏡</div>
              <div>
                <div style={{ fontSize: isMobile ? 17 : 22, fontWeight: 900, color: white, letterSpacing: "-0.5px" }}>ImmobilierMA</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{isMobile ? t.taglineMobile : t.tagline}</div>
              </div>
            </div>

            {/* Right side: badges + lang toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {!isMobile && (
                <>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, border: `1px solid ${emerald}50`, color: emerald, background: `${emerald}15` }}>{t.badge1}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, border: `1px solid rgba(255,255,255,0.3)`, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.08)" }}>{t.badge2}</span>
                </>
              )}
              {/* Language Toggle */}
              <button onClick={toggleLang} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: `1px solid rgba(255,255,255,0.35)`, background: "rgba(255,255,255,0.12)", color: white, fontSize: 13, fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
                {lang === "fr" ? "🇲🇦 العربية" : "🇫🇷 Français"}
              </button>

              {/* Hamburger mobile */}
              {isMobile && (
                <button onClick={() => setMenuOpen(o => !o)} style={{ background: menuOpen ? "rgba(10,123,92,0.3)" : "rgba(255,255,255,0.1)", border: `1px solid ${menuOpen ? emerald : "rgba(255,255,255,0.2)"}`, borderRadius: 10, padding: "8px 13px", color: white, fontSize: 18, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {menuOpen ? "✕" : "☰"}
                </button>
              )}
            </div>
          </div>

          {/* Mobile dropdown */}
          {isMobile && menuOpen && (
            <div style={{ background: "#0f1525", borderRadius: "12px 12px 0 0", border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none", overflow: "hidden" }}>
              {t.tabs.map((tb, i) => (
                <button key={tb.id} onClick={() => switchTab(tb.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", border: "none", borderBottom: i < t.tabs.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none", background: tab === tb.id ? "rgba(10,123,92,0.25)" : "transparent", cursor: "pointer", fontFamily: "inherit", textAlign: t.dir === "rtl" ? "right" : "left" }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: tab === tb.id ? "rgba(10,123,92,0.4)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{tb.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: tab === tb.id ? emerald : white }}>{tb.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{tb.sub}</div>
                  </div>
                  {tab === tb.id && <span style={{ color: emerald, fontSize: 18, flexShrink: 0 }}>✓</span>}
                </button>
              ))}
            </div>
          )}

          {/* Desktop tabs */}
          {!isMobile && (
            <div style={{ display: "flex", gap: 2 }}>
              {t.tabs.map(tb => (
                <button key={tb.id} onClick={() => switchTab(tb.id)} style={{ padding: "12px 16px", border: "none", fontFamily: "inherit", background: "transparent", borderBottom: `3px solid ${tab === tb.id ? emerald : "transparent"}`, color: tab === tb.id ? white : "rgba(255,255,255,0.55)", fontWeight: tab === tb.id ? 700 : 500, fontSize: 13, whiteSpace: "nowrap", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{tb.icon}</span>{tb.label}
                </button>
              ))}
            </div>
          )}

          {/* Mobile active tab pill */}
          {isMobile && !menuOpen && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 0 12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(10,123,92,0.25)", border: `1px solid ${emerald}50`, borderRadius: 20, padding: "5px 14px" }}>
                <span>{t.tabs.find(tb => tb.id === tab)?.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: white }}>{t.tabs.find(tb => tb.id === tab)?.label}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{t.menuHint}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px 12px 48px" : "24px 16px 48px" }}>
        <div className="content" key={tab + articleSlug + lang}>
          {tab === "notaire"        && <FraisNotaire onSwitch={switchTab} t={t} />}
          {tab === "enregistrement" && <DroitsEnregistrement onSwitch={switchTab} t={t} />}
          {tab === "credit"         && <SimulationCredit onSwitch={switchTab} t={t} />}
          {tab === "total"          && <CoutTotal onSwitch={switchTab} t={t} />}
          {tab === "blog" && !articleSlug && (
            <BlogList onArticle={(slug) => setArticleSlug(slug)} lang={lang} />
          )}
          {tab === "blog" && articleSlug && (
            <ArticleView
              slug={articleSlug}
              onBack={(pairSlug) => {
                if (pairSlug && typeof pairSlug === "string") setArticleSlug(pairSlug);
                else setArticleSlug(null);
              }}
              onCTA={(targetTab) => switchTab(targetTab)}
              lang={lang}
            />
          )}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 20, padding: "12px 16px", background: white, borderRadius: 10, border: `1px solid ${gray200}`, fontSize: 11, color: gray400, display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
          <span>{t.disclaimer}</span>
        </div>
      </div>
    </div>
  );
}
