import { useState, useMemo } from "react";

// ── Official Rates (Sources: Crédit du Maroc, Valfoncier, CGI 2025) ──────────
const RATES = {
  enregistrement: 0.04,           // 4% prix de vente
  conservationFonciere: 0.015,    // 1.5% prix de vente
  conservationFixe: 200,          // 100 DH droit fixe + 100 DH certificat propriété
  fraisDossier: 1250,             // ~1000–1500 DH (moyenne)
  tvaHonoraires: 0.10,            // 10% TVA sur honoraires notaire
  hypotheque: [                   // Droits inscription hypothécaire (progressif)
    { max: 250000,   rate: 0.005 },
    { max: 5000000,  rate: 0.015 },
    { max: Infinity, rate: 0.005 },
  ],
  hypothequeFixe: 75,             // 75 DH droit fixe par inscription
  honoraires: [                   // Barème honoraires notaire (décret 2-16-375, màj jan 2019)
    { max: 300000,   rate: null,  fixed: 4000 },
    { max: 1000000,  rate: 0.015, fixed: null },
    { max: 5000000,  rate: 0.0125,fixed: null },
    { max: 10000000, rate: 0.0075,fixed: null },
    { max: Infinity, rate: 0.005, fixed: null },
  ],
};

// ── Helpers ───────────────────────────────────────────────────
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
const sandDark = "#E8DFD0";
const ink = "#1A1A2E";
const inkMid = "#2D3561";
const inkLight = "#6B7280";
const gold = "#B45309";
const goldLight = "#FFF8EE";
const goldBorder = "#FDE68A";
const red = "#DC2626";
const redLight = "#FEF2F2";
const redBorder = "#FECACA";
const white = "#FFFFFF";
const gray50 = "#F9FAFB";
const gray100 = "#F3F4F6";
const gray200 = "#E5E7EB";
const gray400 = "#9CA3AF";

const TABS = [
  { id: "notaire",      icon: "📋", label: "Frais de notaire",         sub: "Calcul complet ligne par ligne" },
  { id: "enregistrement", icon: "🏛️", label: "Droits d'enregistrement", sub: "Taxes DGI sur la mutation" },
  { id: "credit",       icon: "🏦", label: "Simulation crédit",        sub: "Mensualités & coût total" },
  { id: "total",        icon: "🏠", label: "Coût total d'acquisition", sub: "Vision complète prix réel" },
];

// ── Shared Input Components ───────────────────────────────────
function PriceInput({ label, value, onChange, hint, prefix = "MAD" }) {
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
      <div style={{
        display: "flex", alignItems: "center",
        background: white,
        border: `2px solid ${value > 0 ? emerald : gray200}`,
        borderRadius: 10, overflow: "hidden",
        transition: "border-color 0.2s",
        boxShadow: value > 0 ? `0 0 0 3px ${emeraldLight}` : "none",
      }}>
        <input
          type="text" inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder="0"
          style={{
            flex: 1, border: "none", outline: "none",
            padding: "13px 16px", fontSize: 18, fontWeight: 700,
            color: ink, background: "transparent",
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        />
        <span style={{
          padding: "0 16px", fontSize: 12, fontWeight: 700,
          color: inkLight, background: gray50,
          borderLeft: `1px solid ${gray200}`,
          height: "100%", display: "flex", alignItems: "center",
          whiteSpace: "nowrap",
        }}>{prefix}</span>
      </div>
      {hint && (
        <div style={{ fontSize: 12, color: inkLight, marginTop: 5, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ color: gold }}>ℹ</span> {hint}
        </div>
      )}
    </div>
  );
}

function Toggle({ label, value, onChange, hint }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: hint ? 4 : 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: ink }}>{label}</span>
        <div
          onClick={() => onChange(!value)}
          style={{
            width: 44, height: 24, borderRadius: 12,
            background: value ? emerald : gray200,
            position: "relative", cursor: "pointer",
            transition: "background 0.2s", flexShrink: 0,
          }}
        >
          <div style={{
            position: "absolute", top: 3,
            left: value ? 23 : 3,
            width: 18, height: 18, borderRadius: "50%",
            background: white, transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }} />
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
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: emerald, cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: gray400, marginTop: 3 }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

// ── Result Row ────────────────────────────────────────────────
function Row({ label, amount, sub, highlight, faint, divider, indent, tag }) {
  if (divider) return <div style={{ height: 1, background: gray200, margin: "8px 0" }} />;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      padding: highlight ? "12px 16px" : "8px 16px",
      background: highlight ? emeraldLight : "transparent",
      borderRadius: highlight ? 10 : 0,
      marginBottom: highlight ? 4 : 0,
      border: highlight ? `1px solid ${emeraldBorder}` : "none",
    }}>
      <div style={{ paddingLeft: indent ? 14 : 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: highlight ? 14 : 13,
            fontWeight: highlight ? 700 : faint ? 400 : 500,
            color: faint ? gray400 : highlight ? emeraldDark : ink,
          }}>{label}</span>
          {tag && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 7px",
              borderRadius: 20, background: goldLight, color: gold,
              border: `1px solid ${goldBorder}`, whiteSpace: "nowrap",
            }}>{tag}</span>
          )}
        </div>
        {sub && <div style={{ fontSize: 11, color: gray400, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        fontSize: highlight ? 17 : 13,
        fontWeight: highlight ? 800 : faint ? 400 : 600,
        color: faint ? gray400 : highlight ? emerald : ink,
        whiteSpace: "nowrap", marginLeft: 12, textAlign: "right",
      }}>
        {fmt(amount)} <span style={{ fontSize: 10, color: gray400, fontWeight: 400 }}>MAD</span>
      </div>
    </div>
  );
}

function Card({ title, icon, children, accent }) {
  return (
    <div style={{
      background: white, borderRadius: 14,
      border: `1px solid ${accent ? emeraldBorder : gray200}`,
      boxShadow: accent ? `0 4px 20px rgba(10,123,92,0.08)` : "0 1px 6px rgba(0,0,0,0.04)",
      overflow: "hidden", marginBottom: 0,
    }}>
      {title && (
        <div style={{
          padding: "13px 16px",
          borderBottom: `1px solid ${gray100}`,
          display: "flex", alignItems: "center", gap: 10,
          background: accent ? emeraldLight : gray50,
        }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: accent ? emeraldDark : ink }}>{title}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

// ── TAB 1: Frais de Notaire ───────────────────────────────────
function FraisNotaire() {
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
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
      {/* INPUTS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="Votre bien immobilier" icon="🏠">
          <div style={{ padding: "16px 16px 0" }}>
            <PriceInput label="Prix de vente du bien" value={price} onChange={setPrice}
              hint="Prix tel qu'indiqué dans le compromis de vente" />
            <Toggle label="Bien acheté via agence immobilière" value={withAgency} onChange={setWithAgency}
              hint="Commission généralement entre 2.5% et 3.5%" />
            {withAgency && (
              <SliderInput label="Taux commission agence" value={agencyRate}
                onChange={setAgencyRate} min={1} max={5} step={0.5}
                display={`${agencyRate}% = ${fmt(price * agencyRate / 100)} MAD`} />
            )}
          </div>
        </Card>

        <Card title="Financement hypothécaire" icon="🏦">
          <div style={{ padding: "16px 16px 0" }}>
            <Toggle label="Achat financé par crédit bancaire" value={withMortgage} onChange={setWithMortgage}
              hint="Entraîne des droits d'inscription hypothécaire additionnels" />
            {withMortgage && (
              <PriceInput label="Montant du prêt immobilier" value={loanAmount}
                onChange={setLoanAmount}
                hint="Droits calculés selon barème progressif: 0.5% / 1.5% / 0.5%" />
            )}
          </div>
        </Card>

        {/* Rate reference card */}
        <Card title="Barème officiel (Décret 2-16-375)" icon="📐">
          <div style={{ padding: "12px 16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", color: inkLight, fontWeight: 600, paddingBottom: 6, borderBottom: `1px solid ${gray200}` }}>Tranche de prix</th>
                  <th style={{ textAlign: "right", color: inkLight, fontWeight: 600, paddingBottom: 6, borderBottom: `1px solid ${gray200}` }}>Honoraires</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["≤ 300 000 MAD",         "4 000 MAD (fixe)"],
                  ["300 001 – 1 000 000",   "1,50%"],
                  ["1 000 001 – 5 000 000", "1,25%"],
                  ["5 000 001 – 10 000 000","0,75%"],
                  ["> 10 000 000",           "0,50%"],
                ].map(([t, r], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? gray50 : white }}>
                    <td style={{ padding: "5px 8px", color: ink }}>{t}</td>
                    <td style={{ padding: "5px 8px", color: emerald, fontWeight: 700, textAlign: "right" }}>{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 10, fontSize: 11, color: inkLight, padding: "8px 10px", background: goldLight, borderRadius: 7, border: `1px solid ${goldBorder}` }}>
              ⚠️ + 10% TVA sur les honoraires notaire
            </div>
          </div>
        </Card>
      </div>

      {/* RESULTS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Big number */}
        <div style={{
          background: `linear-gradient(135deg, ${emerald} 0%, ${emeraldDark} 100%)`,
          borderRadius: 16, padding: "24px 20px", color: white,
          boxShadow: `0 8px 32px rgba(10,123,92,0.25)`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Frais totaux estimés
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-1px", marginBottom: 4 }}>
            {fmt(totalAll)} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.8 }}>MAD</span>
          </div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>
            soit <strong>{pctOfPrice}%</strong> du prix de vente
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Prix réel de revient (tout compris)</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{fmt(prixReel)} MAD</div>
          </div>
        </div>

        {/* Breakdown */}
        <Card title="Détail ligne par ligne" icon="🧾" accent>
          <div style={{ paddingTop: 4 }}>
            <Row label="Prix du bien" amount={price} tag="Base" />
            <Row divider />
            <Row label="Droits d'enregistrement" amount={enregistrement}
              sub="4% du prix de vente · payés à la DGI" indent />
            <Row label="Conservation foncière" amount={conservation}
              sub={`1,5% + ${RATES.conservationFixe} MAD fixe · ANCFCC`} indent />
            <Row label="Honoraires notaire" amount={honoraires}
              sub="Barème progressif réglementé" indent />
            <Row label="TVA sur honoraires" amount={tvaHonoraires}
              sub="10% sur les honoraires uniquement" indent faint />
            <Row label="Frais de dossier (timbres, copies...)" amount={fraisDossier}
              sub="~1 000 à 1 500 MAD selon notaire" indent faint />
            {withAgency && <Row label={`Commission agence (${agencyRate}%)`} amount={agencyFee} indent />}
            {withMortgage && <Row label="Droits inscription hypothèque" amount={hypoFees}
              sub="Barème progressif 0.5% / 1.5% / 0.5% + 75 MAD" indent />}
            <Row divider />
            <Row label="Total frais (hors prix du bien)" amount={totalAll} highlight />
            <Row label="Prix de revient total" amount={prixReel} highlight />
          </div>
        </Card>

        {/* Visual bar */}
        <Card title="Répartition des frais" icon="📊">
          <div style={{ padding: "12px 16px" }}>
            {[
              { label: "Droits d'enregistrement (4%)", value: enregistrement, color: red },
              { label: "Conservation foncière (1.5%)", value: conservation, color: gold },
              { label: "Honoraires + TVA", value: honoraires + tvaHonoraires, color: emerald },
              ...(withAgency ? [{ label: `Agence (${agencyRate}%)`, value: agencyFee, color: inkMid }] : []),
              ...(withMortgage ? [{ label: "Hypothèque", value: hypoFees, color: inkLight }] : []),
              { label: "Divers", value: fraisDossier, color: gray400 },
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
      </div>
    </div>
  );
}

// ── TAB 2: Droits d'Enregistrement ───────────────────────────
function DroitsEnregistrement() {
  const [price, setPrice] = useState(800000);
  const [type, setType] = useState("habitation");

  const rates = {
    habitation: { rate: 0.04, label: "Bien à usage d'habitation", note: "Taux standard CGI art. 133" },
    terrain:    { rate: 0.05, label: "Terrain nu / agricole", note: "Taux majoré pour terrains à bâtir" },
    commercial: { rate: 0.06, label: "Local commercial / bureau", note: "Taux spécifique foncier commercial" },
    sci:        { rate: 0.04, label: "Via société immobilière", note: "Soumis à IS — cession de parts" },
  };

  const selected = rates[type];
  const droits = price * selected.rate;
  const conservation = price * RATES.conservationFonciere + RATES.conservationFixe;
  const total = droits + conservation;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="Type de bien et transaction" icon="🏛️">
          <div style={{ padding: "16px 16px 4px" }}>
            <PriceInput label="Valeur déclarée du bien" value={price} onChange={setPrice}
              hint="La DGI peut contester si le prix déclaré est sous le référentiel DGI" />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: inkLight, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Type de bien
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(rates).map(([key, val]) => (
                  <button key={key} onClick={() => setType(key)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                    border: `2px solid ${type === key ? emerald : gray200}`,
                    borderRadius: 10, background: type === key ? emeraldLight : white,
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${type === key ? emerald : gray400}`,
                      background: type === key ? emerald : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {type === key && <div style={{ width: 6, height: 6, borderRadius: "50%", background: white }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ink }}>{val.label}</div>
                      <div style={{ fontSize: 11, color: inkLight }}>{val.note}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: 15, fontWeight: 800, color: type === key ? emerald : inkLight }}>
                      {(val.rate * 100).toFixed(0)}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Important à savoir" icon="⚠️">
          <div style={{ padding: "12px 16px" }}>
            {[
              { t: "Délai de paiement", d: "Les droits d'enregistrement doivent être payés dans les 30 jours suivant l'acte de vente, sous peine de pénalités." },
              { t: "Référentiel DGI", d: "La DGI possède un référentiel de prix au m² par zone. Si votre prix déclaré est inférieur, un redressement fiscal est possible." },
              { t: "Loi 14.25 (2025)", d: "Les actes doivent désormais être signés électroniquement et accompagnés d'une attestation d'enregistrement pour la conservation foncière." },
            ].map(item => (
              <div key={item.t} style={{ marginBottom: 10, padding: "10px 12px", background: goldLight, borderRadius: 8, border: `1px solid ${goldBorder}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: gold, marginBottom: 3 }}>{item.t}</div>
                <div style={{ fontSize: 12, color: inkLight, lineHeight: 1.5 }}>{item.d}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{
          background: `linear-gradient(135deg, ${inkMid} 0%, ${ink} 100%)`,
          borderRadius: 16, padding: "24px 20px", color: white,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Droits d'enregistrement
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-1px", marginBottom: 4 }}>
            {fmt(droits)} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.7 }}>MAD</span>
          </div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            Taux appliqué : <strong>{(selected.rate * 100).toFixed(0)}%</strong>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>+ Conservation foncière</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(conservation)} MAD</div>
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>Total taxes État</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(total)} MAD</div>
            </div>
          </div>
        </div>

        <Card title="Détail du calcul" icon="🧮" accent>
          <div style={{ paddingTop: 4 }}>
            <Row label="Valeur du bien" amount={price} />
            <Row divider />
            <Row label={`Droits d'enregistrement (${(selected.rate*100)}%)`} amount={droits}
              sub="Collectés par le notaire → DGI" indent />
            <Row label="Conservation foncière (1.5%)" amount={price * 0.015}
              sub="Inscription au titre foncier → ANCFCC" indent />
            <Row label="Certificat de propriété + droit fixe" amount={RATES.conservationFixe}
              sub="100 DH + 100 DH" indent faint />
            <Row divider />
            <Row label="Total taxes à payer à l'État" amount={total} highlight />
            <Row label="Soit en % du prix" amount={`${((total/price)*100).toFixed(2)}%`} faint />
          </div>
        </Card>

        <Card title="Qui paie quoi?" icon="👥">
          <div style={{ padding: "12px 16px" }}>
            {[
              { who: "🧑 Acheteur", what: "Droits d'enregistrement + conservation foncière + frais notaire + agence", color: red },
              { who: "🏦 Notaire", what: "Collecte les taxes et les reverse à la DGI et l'ANCFCC", color: emerald },
              { who: "🏠 Vendeur", what: "Plus-value immobilière (si applicable) — TPI 20% sur la plus-value réalisée", color: gold },
            ].map(item => (
              <div key={item.who} style={{ marginBottom: 8, display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8, background: gray50 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: item.color, minWidth: 80 }}>{item.who}</span>
                <span style={{ fontSize: 12, color: inkLight, lineHeight: 1.5 }}>{item.what}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── TAB 3: Simulation Crédit ──────────────────────────────────
function SimulationCredit() {
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
  const assurance = montant * 0.003 / 12; // ~0.3%/an estimation
  const mensualiteAssurance = mensualite + assurance;

  const hypoFees = calcHypotheque(montant);
  const fraisNotaireCredit = hypoFees;

  const tauxEndettementSalaire = mensualiteAssurance > 0 ? (mensualiteAssurance / 0.35) : 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="Paramètres du crédit" icon="🏦">
          <div style={{ padding: "16px 16px 4px" }}>
            <PriceInput label="Prix du bien" value={prix} onChange={setPrix} />
            <PriceInput label="Apport personnel" value={apport} onChange={setApport}
              hint={`Montant emprunté: ${fmt(montant)} MAD (${prix > 0 ? Math.round((montant/prix)*100) : 0}% du prix)`} />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: inkLight, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Type de financement
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { id: "amortissable", label: "Classique", sub: "Taux d'intérêt" },
                  { id: "mourabaha", label: "Mourabaha", sub: "Islamique / sans intérêt" },
                ].map(t => (
                  <button key={t.id} onClick={() => setType(t.id)} style={{
                    flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                    border: `2px solid ${type === t.id ? emerald : gray200}`,
                    background: type === t.id ? emeraldLight : white,
                    fontFamily: "inherit",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: type === t.id ? emeraldDark : ink }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: inkLight }}>{t.sub}</div>
                  </button>
                ))}
              </div>
            </div>
            <SliderInput label={type === "mourabaha" ? "Taux de marge (%)" : "Taux d'intérêt annuel (%)"}
              value={taux} onChange={setTaux} min={2} max={8} step={0.25}
              display={`${taux}%`} />
            <SliderInput label="Durée du crédit" value={duree} onChange={setDuree} min={5} max={30} step={1}
              display={`${duree} ans`} />
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{
          background: `linear-gradient(135deg, #1B5FA8 0%, #0F3D6E 100%)`,
          borderRadius: 16, padding: "24px 20px", color: white,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Mensualité estimée</div>
          <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-1px", marginBottom: 4 }}>
            {fmt(mensualite)} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.7 }}>MAD/mois</span>
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
            + assurance ~{fmt(assurance)} MAD → total {fmt(mensualiteAssurance)} MAD/mois
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {[
              { label: "Coût total crédit", value: fmt(coutCredit) + " MAD" },
              { label: "Total remboursé", value: fmt(coutTotal) + " MAD" },
              { label: "Salaire requis (35%)", value: fmt(tauxEndettementSalaire) + " MAD" },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 10, opacity: 0.6 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <Card title="Récapitulatif complet" icon="📊" accent>
          <div style={{ paddingTop: 4 }}>
            <Row label="Prix du bien" amount={prix} />
            <Row label="Apport personnel" amount={apport} indent />
            <Row label="Montant emprunté" amount={montant} indent />
            <Row divider />
            <Row label="Mensualité (hors assurance)" amount={mensualite}
              sub={`Sur ${duree} ans · taux ${taux}%`} />
            <Row label="Coût total des intérêts/marges" amount={coutCredit} indent faint />
            <Row label="Droits inscription hypothèque" amount={hypoFees}
              sub="Barème progressif + 75 MAD fixe" indent faint />
            <Row divider />
            <Row label="Coût total de l'opération" amount={prix + coutCredit + hypoFees} highlight />
          </div>
        </Card>

        <div style={{ padding: "12px 14px", background: goldLight, borderRadius: 10, border: `1px solid ${goldBorder}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: gold, marginBottom: 4 }}>💡 Règle des 35%</div>
          <div style={{ fontSize: 12, color: inkLight, lineHeight: 1.6 }}>
            Les banques marocaines accordent généralement un crédit si votre mensualité ne dépasse pas <strong>35% de votre revenu net mensuel</strong>. Pour cette mensualité, il vous faut un revenu minimum de <strong style={{ color: gold }}>{fmt(tauxEndettementSalaire)} MAD/mois</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TAB 4: Coût Total Acquisition ────────────────────────────
function CoutTotal() {
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
    ? montantCredit * (tauxMensuel * Math.pow(1 + tauxMensuel, nMois)) / (Math.pow(1 + tauxMensuel, nMois) - 1)
    : 0;
  const coutCredit = mensualite * nMois - montantCredit;

  const honoraires = calcHonoraires(prix);
  const enregistrement = prix * 0.04;
  const conservation = prix * 0.015 + RATES.conservationFixe;
  const tva = honoraires * 0.10;
  const agencyFee = withAgency ? prix * agencyRate / 100 : 0;
  const hypo = withCredit ? calcHypotheque(montantCredit) : 0;
  const divers = RATES.fraisDossier;

  const fraisAcquisition = enregistrement + conservation + honoraires + tva + divers + agencyFee + hypo;
  const totalInvesti = prix + fraisAcquisition + travaux + (withCredit ? coutCredit : 0);
  const pctFrais = ((fraisAcquisition / prix) * 100).toFixed(1);

  const items = [
    { label: "Prix du bien", amount: prix, color: ink, pct: (prix / totalInvesti * 100) },
    { label: "Frais d'acquisition", amount: fraisAcquisition, color: red, pct: (fraisAcquisition / totalInvesti * 100) },
    ...(travaux > 0 ? [{ label: "Travaux / rénovation", amount: travaux, color: gold, pct: (travaux / totalInvesti * 100) }] : []),
    ...(withCredit ? [{ label: "Coût du crédit (intérêts)", amount: coutCredit, color: emerald, pct: (coutCredit / totalInvesti * 100) }] : []),
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="Votre acquisition" icon="🏠">
          <div style={{ padding: "16px 16px 4px" }}>
            <PriceInput label="Prix du bien" value={prix} onChange={setPrix} />
            <Toggle label="Via agence immobilière" value={withAgency} onChange={setWithAgency} />
            {withAgency && (
              <SliderInput label="Taux commission" value={agencyRate} onChange={setAgencyRate}
                min={1} max={5} step={0.5} display={`${agencyRate}%`} />
            )}
            <PriceInput label="Budget travaux / rénovation" value={travaux} onChange={setTravaux}
              hint="Optionnel — incluez les travaux prévus" />
          </div>
        </Card>
        <Card title="Financement" icon="🏦">
          <div style={{ padding: "16px 16px 4px" }}>
            <Toggle label="Financement par crédit immobilier" value={withCredit} onChange={setWithCredit} />
            {withCredit && (
              <>
                <PriceInput label="Apport personnel" value={apport} onChange={setApport}
                  hint={`Crédit: ${fmt(montantCredit)} MAD · ${prix > 0 ? Math.round(montantCredit/prix*100) : 0}% du prix`} />
                <SliderInput label="Taux d'intérêt" value={taux} onChange={setTaux} min={2} max={8} step={0.25} display={`${taux}%`} />
                <SliderInput label="Durée" value={duree} onChange={setDuree} min={5} max={30} step={1} display={`${duree} ans`} />
              </>
            )}
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* THE big number */}
        <div style={{
          background: `linear-gradient(135deg, ${ink} 0%, ${inkMid} 100%)`,
          borderRadius: 16, padding: "24px 20px", color: white,
          boxShadow: "0 8px 32px rgba(26,26,46,0.25)",
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Coût total réel de l'acquisition
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1px", marginBottom: 6 }}>
            {fmt(totalInvesti)} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.6 }}>MAD</span>
          </div>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>
            vs. prix affiché de {fmt(prix)} MAD — vous payez <strong style={{ color: "#FCD34D" }}>{pctFrais}% de plus</strong>
          </div>
          {/* Stacked bar */}
          <div style={{ height: 14, borderRadius: 7, overflow: "hidden", display: "flex", marginBottom: 12 }}>
            {items.map(item => (
              <div key={item.label} style={{ width: `${item.pct}%`, background: item.color, transition: "width 0.5s" }} />
            ))}
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

        <Card title="Ventilation complète" icon="📋" accent>
          <div style={{ paddingTop: 4 }}>
            <Row label="Prix du bien" amount={prix} tag="Affiché" />
            <Row divider />
            <Row label="Frais d'acquisition" amount={fraisAcquisition}
              tag={`${pctFrais}% du prix`} />
            <Row label="Droits d'enregistrement (4%)" amount={enregistrement} indent />
            <Row label="Conservation foncière (1.5%)" amount={conservation} indent faint />
            <Row label="Honoraires notaire + TVA" amount={honoraires + tva} indent faint />
            {withAgency && <Row label={`Commission agence (${agencyRate}%)`} amount={agencyFee} indent faint />}
            {withCredit && <Row label="Droits hypothèque" amount={hypo} indent faint />}
            <Row label="Frais de dossier" amount={divers} indent faint />
            {travaux > 0 && <Row label="Budget travaux" amount={travaux} />}
            {withCredit && <Row label={`Coût crédit sur ${duree} ans`} amount={coutCredit} />}
            <Row divider />
            <Row label="Investissement total réel" amount={totalInvesti} highlight />
            {withCredit && (
              <Row label={`Mensualité estimée`} amount={mensualite}
                sub={`${fmt(mensualite)} MAD/mois sur ${duree} ans`} faint />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function ImmobilierMA() {
  const [tab, setTab] = useState("notaire");

  return (
    <div style={{
      minHeight: "100vh",
      background: sand,
      fontFamily: "'Bricolage Grotesque', 'Segoe UI', sans-serif",
      color: ink,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: ${gray200}; border-radius: 5px; }
        input[type=range] { cursor: pointer; height: 4px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .content { animation: fadeUp 0.25s ease; }
        button { cursor: pointer; }
        input:focus { outline: none; }
      `}</style>

      {/* HERO HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${ink} 0%, ${inkMid} 60%, #1a3a6e 100%)`,
        padding: "28px 24px 0",
        position: "sticky", top: 0, zIndex: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `linear-gradient(135deg, ${emerald}, ${emeraldDark})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, boxShadow: `0 4px 12px rgba(10,123,92,0.4)`,
              }}>🏡</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: white, letterSpacing: "-0.5px" }}>
                  ImmobilierMA
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  Frais de notaire · Enregistrement · Crédit · Coût total
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "✓ Données officielles CGI 2025", color: emerald },
                { label: "🇲🇦 Maroc uniquement", color: "rgba(255,255,255,0.6)" },
              ].map(b => (
                <span key={b.label} style={{
                  fontSize: 11, fontWeight: 600, padding: "4px 10px",
                  borderRadius: 20, border: `1px solid ${b.color}50`,
                  color: b.color, background: `${b.color}15`,
                }}>{b.label}</span>
              ))}
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "12px 16px", border: "none", fontFamily: "inherit",
                background: "transparent",
                borderBottom: `3px solid ${tab === t.id ? emerald : "transparent"}`,
                color: tab === t.id ? white : "rgba(255,255,255,0.55)",
                fontWeight: tab === t.id ? 700 : 500,
                fontSize: 13, whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}>
                <span style={{ marginRight: 6 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 48px" }}>
        <div className="content" key={tab}>
          {tab === "notaire"        && <FraisNotaire />}
          {tab === "enregistrement" && <DroitsEnregistrement />}
          {tab === "credit"         && <SimulationCredit />}
          {tab === "total"          && <CoutTotal />}
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: 28, padding: "12px 16px",
          background: white, borderRadius: 10,
          border: `1px solid ${gray200}`, fontSize: 11, color: gray400,
          display: "flex", gap: 8, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
          <span>
            Simulateur à titre indicatif uniquement. Données basées sur le CGI 2025, décret 2-16-375, et la loi 14.25. 
            Les taux et barèmes sont susceptibles de changer. Consultez un notaire agréé au Maroc avant toute transaction. 
            Sources: DGI, ANCFCC, Crédit du Maroc, Valfoncier.
          </span>
        </div>
      </div>
    </div>
  );
}
