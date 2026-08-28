interface QuotaPipsProps {
  /** Free readings remaining today + rewarded credits. */
  remaining: number;
  /** Free readings per day (pip count baseline). */
  total: number;
}

/** Golden pips showing the readings left today. */
export function QuotaPips({ remaining, total }: QuotaPipsProps) {
  const count = Math.max(total, remaining);
  return (
    <div className="quota-pips" title="Tirages restants aujourd'hui">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`quota-pips__pip${i < remaining ? ' quota-pips__pip--on' : ''}`} />
      ))}
    </div>
  );
}
