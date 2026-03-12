// PrivacyPolicy.jsx — Required for Google AdSense approval
export default function PrivacyPolicy() {
  return (
    <div style={{
      maxWidth: 800, margin: "0 auto", padding: "40px 20px",
      fontFamily: "'Bricolage Grotesque', sans-serif",
      color: "#1A1A2E", lineHeight: 1.8,
    }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Politique de Confidentialité</h1>
      <p style={{ color: "#6B7280", marginBottom: 32 }}>Dernière mise à jour : Mars 2026</p>

      {[
        {
          title: "1. Collecte des données",
          content: "ImmobilierMA ne collecte aucune donnée personnelle. Le simulateur fonctionne entièrement dans votre navigateur. Aucune donnée saisie (prix, revenus, etc.) n'est transmise à nos serveurs."
        },
        {
          title: "2. Cookies et publicités",
          content: "Ce site utilise Google AdSense pour afficher des publicités. Google peut utiliser des cookies pour personnaliser les annonces affichées. Vous pouvez désactiver la personnalisation des annonces via les paramètres Google à l'adresse g.co/adsettings."
        },
        {
          title: "3. Google Analytics",
          content: "Nous utilisons Google Analytics pour mesurer l'audience du site (nombre de visiteurs, pages consultées). Ces données sont anonymisées et ne permettent pas d'identifier un visiteur individuel."
        },
        {
          title: "4. Responsabilité",
          content: "Les résultats du simulateur sont fournis à titre indicatif uniquement et ne constituent pas un conseil juridique, fiscal ou financier. ImmobilierMA ne saurait être tenu responsable d'un écart entre les estimations affichées et les montants réels facturés par un notaire ou une administration."
        },
        {
          title: "5. Contact",
          content: "Pour toute question relative à cette politique de confidentialité, contactez-nous à : contact@immobilier-ma.com"
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#0A7B5C" }}>{section.title}</h2>
          <p style={{ color: "#374151" }}>{section.content}</p>
        </div>
      ))}

      <div style={{
        marginTop: 40, padding: "16px 20px",
        background: "#F0FDF4", borderRadius: 10,
        border: "1px solid #A7F3D0", fontSize: 13, color: "#065F46",
      }}>
        Ce site est conforme au Règlement Général sur la Protection des Données (RGPD) et à la loi marocaine 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.
      </div>
    </div>
  );
}
