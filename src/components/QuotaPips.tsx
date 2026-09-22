import { useEffect, useRef } from 'react';

interface QuotaPipsProps {
  /** Free readings remaining today + rewarded credits. */
  remaining: number;
  /** Free readings per day (pip count baseline). */
  total: number;
}

/** Golden pips showing the readings left today; pips animate as they are
 * spent (shake out) or earned (pop in). */
export function QuotaPips({ remaining, total }: QuotaPipsProps) {
  const prevRef = useRef(remaining);
  const prev = prevRef.current;

  useEffect(() => {
    prevRef.current = remaining;
  }, [remaining]);

  const count = Math.max(total, remaining, prev);
  return (
    <div className="quota-pips" title="Tirages restants aujourd'hui">
      {Array.from({ length: count }, (_, i) => {
        const on = i < remaining;
        const spent = !on && i < prev;
        const gained = on && i >= prev;
        return (
          <span
            key={`${i}-${remaining}`}
            className={`quota-pips__pip${on ? ' quota-pips__pip--on' : ''}${
              spent ? ' quota-pips__pip--spent' : ''
            }${gained ? ' quota-pips__pip--gain' : ''}`}
          />
        );
      })}
    </div>
  );
}
