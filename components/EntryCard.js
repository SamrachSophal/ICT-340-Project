const styles = {
  card: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.3,
  },
  description: {
    fontSize: 16,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: "12px 0 20px",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 32,
    paddingTop: 16,
    borderTop: "1px solid #2E3644",
  },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  value: {
    fontSize: 15,
    margin: "6px 0 0",
  },
};

export default function EntryCard({ title, description, contributor, place }) {
  return (
    <article style={styles.card}>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.description}>{description}</p>
      <div style={styles.meta}>
        <div>
          <p style={styles.label}>CONTRIBUTED BY</p>
          <p style={styles.value}>{contributor}</p>
        </div>
        <div>
          <p style={styles.label}>PLACE</p>
          <p style={styles.value}>{place}</p>
        </div>
      </div>
    </article>
  );
}
