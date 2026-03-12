import { article1FR } from './articles/article1FR.js';
import { article1AR } from './articles/article1AR.js';
import { article2FR } from './articles/article2FR.js';
import { article2AR } from './articles/article2AR.js';
import { article3FR } from './articles/article3FR.js';
import { article3AR } from './articles/article3AR.js';

const ARTICLES = {
  "frais-notaire-maroc-2026":                  article1FR,
  "frais-notaire-maroc-2026-ar":               article1AR,
  "droits-enregistrement-immobilier-maroc":    article2FR,
  "droits-enregistrement-immobilier-maroc-ar": article2AR,
  "simulation-credit-immobilier-maroc-2026":   article3FR,
  "simulation-credit-immobilier-maroc-2026-ar":article3AR,
};

const C = {
  emerald: "#0A7B5C", emeraldDark: "#075C45", emeraldLight: "#ECFDF5",
  emeraldBorder: "#A7F3D0", ink: "#1A1A2E", inkMid: "#374151",
  inkLight: "#6B7280", gold: "#B45309", goldLight: "#FFF8EE",
  goldBorder: "#FDE68A", red: "#DC2626", redLight: "#FEF2F2",
  redBorder: "#FECACA", white: "#FFFFFF", gray50: "#F9FAFB",
  gray100: "#F3F4F6", gray200: "#E5E7EB", gray400: "#9CA3AF",
  sand: "#F5F0E8",
};

function Block({ block, onCTA }) {
  switch (block.type) {
    case "intro":
      return (
        <p style={{
          fontSize: 17, lineHeight: 1.8, color: C.inkMid,
          background: C.emeraldLight, border: `1px solid ${C.emeraldBorder}`,
          borderRadius: 12, padding: "18px 22px", marginBottom: 28,
          fontWeight: 500,
        }}>{block.text}</p>
      );
    case "h2":
      return (
        <h2 style={{
          fontSize: 22, fontWeight: 800, color: C.ink,
          marginTop: 36, marginBottom: 14,
          paddingBottom: 10, borderBottom: `2px solid ${C.gray100}`,
        }}>{block.text}</h2>
      );
    case "p":
      return (
        <p style={{
          fontSize: 15, lineHeight: 1.85, color: C.inkMid,
          marginBottom: 16, whiteSpace: "pre-line",
        }}>{block.text}</p>
      );
    case "example":
      return (
        <div style={{
          background: C.gray50, border: `1px solid ${C.gray200}`,
          borderLeft: `4px solid ${C.emerald}`,
          borderRadius: "0 10px 10px 0", padding: "14px 18px",
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.emerald, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {block.title}
          </div>
          <pre style={{ fontSize: 14, color: C.ink, whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: 1.7 }}>
            {block.text}
          </pre>
        </div>
      );
    case "warning":
      return (
        <div style={{
          background: C.redLight, border: `1px solid ${C.redBorder}`,
          borderRadius: 10, padding: "12px 16px", marginBottom: 20,
          fontSize: 14, color: C.red, lineHeight: 1.7,
        }}>{block.text}</div>
      );
    case "tip":
      return (
        <div style={{
          background: C.goldLight, border: `1px solid ${C.goldBorder}`,
          borderRadius: 10, padding: "12px 16px", marginBottom: 20,
          fontSize: 14, color: C.gold, lineHeight: 1.7,
        }}>{block.text}</div>
      );
    case "table":
      return (
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: C.ink }}>
                {block.headers.map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 14px", color: C.white,
                    fontWeight: 700, textAlign: "left",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.white : C.gray50 }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      padding: "9px 14px", color: j === 0 ? C.ink : C.inkMid,
                      fontWeight: j === 0 ? 600 : 400,
                      borderBottom: `1px solid ${C.gray200}`,
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "cta":
      return (
        <div style={{
          background: `linear-gradient(135deg, ${C.emerald}, ${C.emeraldDark})`,
          borderRadius: 14, padding: "24px 24px",
          marginBottom: 28, marginTop: 8,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, flexWrap: "wrap",
          boxShadow: `0 6px 24px rgba(10,123,92,0.25)`,
        }}>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 1.6, margin: 0, flex: 1 }}>
            {block.text}
          </p>
          <button onClick={() => onCTA(block.tab)} style={{
            background: C.white, color: C.emeraldDark,
            border: "none", borderRadius: 10,
            padding: "12px 20px", fontSize: 14, fontWeight: 800,
            cursor: "pointer", whiteSpace: "nowrap",
            fontFamily: "inherit",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
            {block.label}
          </button>
        </div>
      );
    case "faq":
      return (
        <div style={{ marginBottom: 24 }}>
          {block.items.map((item, i) => (
            <details key={i} style={{
              marginBottom: 10, background: C.white,
              border: `1px solid ${C.gray200}`, borderRadius: 10,
              overflow: "hidden",
            }}>
              <summary style={{
                padding: "14px 18px", fontWeight: 700, fontSize: 14,
                color: C.ink, cursor: "pointer", listStyle: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                {item.q}
                <span style={{ color: C.emerald, fontSize: 18, flexShrink: 0, marginLeft: 10 }}>+</span>
              </summary>
              <div style={{
                padding: "0 18px 14px", fontSize: 14,
                color: C.inkMid, lineHeight: 1.7,
                borderTop: `1px solid ${C.gray100}`, paddingTop: 12,
              }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      );
    case "disclaimer":
      return (
        <div style={{
          fontSize: 12, color: C.gray400, lineHeight: 1.7,
          borderTop: `1px solid ${C.gray200}`, paddingTop: 20, marginTop: 32,
        }}>
          {block.text}
        </div>
      );
    default:
      return null;
  }
}

// ── Blog List ─────────────────────────────────────────────────
const BLOG_CARDS = [
  {
    slug: "frais-notaire-maroc-2026",
    slugAR: "frais-notaire-maroc-2026-ar",
    icon: "📋",
    titleFR: "Frais de Notaire au Maroc 2026 : Guide Complet",
    titleAR: "رسوم التوثيق العقاري بالمغرب 2026 : دليل شامل",
    descFR: "Tout savoir sur les frais de notaire : droits d'enregistrement, conservation foncière, honoraires. Avec exemples et calculateur.",
    descAR: "كل ما تحتاج معرفته عن رسوم التوثيق العقاري : رسوم التسجيل، المحافظة العقارية، الأتعاب. مع أمثلة وحاسبة.",
    readFR: "8 min", readAR: "8 دقائق",
    tag: "⭐ Le plus lu",
  },
  {
    slug: "droits-enregistrement-immobilier-maroc",
    slugAR: "droits-enregistrement-immobilier-maroc-ar",
    icon: "🏛️",
    titleFR: "Droits d'Enregistrement Immobilier au Maroc : Guide 2026",
    titleAR: "رسوم التسجيل العقاري بالمغرب : الدليل الشامل 2026",
    descFR: "Taux, calcul, délais et risques fiscaux. Tout ce que vous devez savoir sur les droits d'enregistrement avant d'acheter.",
    descAR: "المعدلات، طريقة الحساب، الآجال والمخاطر الجبائية. كل ما تحتاج معرفته قبل الشراء.",
    readFR: "6 min", readAR: "6 دقائق",
  },
  {
    slug: "simulation-credit-immobilier-maroc-2026",
    slugAR: "simulation-credit-immobilier-maroc-2026-ar",
    icon: "🏦",
    titleFR: "Simulation Crédit Immobilier Maroc 2026",
    titleAR: "محاكاة القرض العقاري بالمغرب 2026",
    descFR: "Calculez votre mensualité, comprenez la règle des 35%, et choisissez entre crédit classique et Mourabaha.",
    descAR: "احسب قسطك الشهري وافهم قاعدة 35% واختر بين القرض التقليدي والمرابحة.",
    readFR: "7 min", readAR: "7 دقائق",
  },
];

export function BlogList({ onArticle, lang }) {
  const isFR = lang === "fr";
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.ink, marginBottom: 8 }}>
          {isFR ? "📚 Guides & Articles" : "📚 الأدلة والمقالات"}
        </h1>
        <p style={{ fontSize: 15, color: C.inkLight }}>
          {isFR
            ? "Tout savoir sur la fiscalité et les frais immobiliers au Maroc"
            : "كل ما تحتاج معرفته عن الجبايات والرسوم العقارية بالمغرب"}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {BLOG_CARDS.map(card => (
          <div key={card.slug} style={{
            background: C.white, border: `1px solid ${C.gray200}`,
            borderRadius: 14, padding: "20px 22px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            cursor: "pointer", transition: "all 0.15s",
          }}
            onClick={() => onArticle(isFR ? card.slug : card.slugAR)}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.emerald}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.gray200}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: C.emeraldLight, border: `1px solid ${C.emeraldBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>{card.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: C.ink, margin: 0 }}>
                    {isFR ? card.titleFR : card.titleAR}
                  </h2>
                  {card.tag && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px",
                      background: C.goldLight, color: C.gold,
                      border: `1px solid ${C.goldBorder}`, borderRadius: 20,
                    }}>{card.tag}</span>
                  )}
                </div>
                <p style={{ fontSize: 14, color: C.inkLight, lineHeight: 1.6, margin: 0, marginBottom: 10 }}>
                  {isFR ? card.descFR : card.descAR}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: C.gray400 }}>
                    ⏱ {isFR ? card.readFR : card.readAR}
                  </span>
                  <span style={{ fontSize: 13, color: C.emerald, fontWeight: 700 }}>
                    {isFR ? "Lire →" : "← اقرأ"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Article View ──────────────────────────────────────────────
export function ArticleView({ slug, onBack, onCTA, lang }) {
  const article = ARTICLES[slug];
  if (!article) return null;
  const isAR = article.dir === "rtl";

  // Get pair slug for language toggle
  const pairs = {
    "frais-notaire-maroc-2026": "frais-notaire-maroc-2026-ar",
    "frais-notaire-maroc-2026-ar": "frais-notaire-maroc-2026",
    "droits-enregistrement-immobilier-maroc": "droits-enregistrement-immobilier-maroc-ar",
    "droits-enregistrement-immobilier-maroc-ar": "droits-enregistrement-immobilier-maroc",
    "simulation-credit-immobilier-maroc-2026": "simulation-credit-immobilier-maroc-2026-ar",
    "simulation-credit-immobilier-maroc-2026-ar": "simulation-credit-immobilier-maroc-2026",
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px 60px" }} dir={isAR ? "rtl" : "ltr"}>
      {/* Back + lang toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <button onClick={onBack} style={{
          background: "none", border: `1px solid ${C.gray200}`,
          borderRadius: 8, padding: "7px 14px",
          fontSize: 13, color: C.inkLight, cursor: "pointer",
          fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
        }}>
          {isAR ? "→ العودة" : "← Retour"}
        </button>
        <button onClick={() => onBack(pairs[slug])} style={{
          background: C.emeraldLight, border: `1px solid ${C.emeraldBorder}`,
          borderRadius: 8, padding: "7px 14px",
          fontSize: 13, color: C.emeraldDark, cursor: "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>
          {isAR ? "🇫🇷 Lire en français" : "🇲🇦 اقرأ بالعربية"}
        </button>
      </div>

      {/* Article header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontSize: 28, fontWeight: 900, color: C.ink,
          lineHeight: 1.3, marginBottom: 12,
        }}>{article.title}</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: C.inkLight }}>📅 {article.date}</span>
          <span style={{ fontSize: 13, color: C.inkLight }}>⏱ {article.readTime}</span>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "3px 10px",
            background: C.emeraldLight, color: C.emeraldDark,
            border: `1px solid ${C.emeraldBorder}`, borderRadius: 20,
          }}>🇲🇦 Maroc 2026</span>
        </div>
      </div>

      {/* Content */}
      {article.content.map((block, i) => (
        <Block key={i} block={block} onCTA={onCTA} />
      ))}
    </div>
  );
}
