import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#2EE6A8",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
};

const entries = [
  {
    title: "Pchum Ben — បុណ្យភ្ជុំបិណ្ឌ",
    description:
      "Over fifteen days, the family wakes before dawn and carries food to the pagoda so the ancestors are not left hungry. Relatives who live apart all year come back for it.",
    contributor: collection.curator,
    place: "Siem Reap",
  },
  {
    title: "Khmer New Year — បុណ្យចូលឆ្នាំថ្មី",
    description:
      "The family returns to the home province to build sand mounds at the pagoda, play traditional games, and pour scented water over the hands of the elders.",
    contributor: collection.curator,
    place: "Siem Reap",
  },
  {
    title: "Water Festival Boat Racing — បុណ្យអុំទូក",
    description:
      "The whole family goes down to the river together to watch the long boats race, holding their places along the bank from morning until the last heat.",
    contributor: collection.curator,
    place: "Siem Reap, Siem Reap River",
  },
  {
    title: "School Holidays at the Grandparents' House",
    description:
      "When school closes, the children are sent to the grandparents in the province — the gathering that is not a festival, just weeks of cousins, cooking, and stories.",
    contributor: collection.curator,
    place: "Siem Reap",
  },
  {
    title: "Engagement Day — ពិធីភ្ជាប់ពាក្យ",
    description:
      "Both families gather at the bride's house with trays of fruit and gifts, and the elders on each side speak for the couple before the date is agreed.",
    contributor: collection.curator,
    place: "Siem Reap",
  },
];

export default function Home() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      {entries.map((entry) => (
        <EntryCard
          key={entry.title}
          title={entry.title}
          description={entry.description}
          contributor={entry.contributor}
          place={entry.place}
        />
      ))}

      <p style={styles.count}>entries in the archive: {entries.length}</p>

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
