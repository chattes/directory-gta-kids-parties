export default function KidFitMeter({ info }) {
  if (!info) return null;
  return (
    <span className="kidfit" title={info.title}>
      <span className="balloons" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < info.score ? 'balloon' : 'balloon balloon-empty'}>
            🎈
          </span>
        ))}
      </span>
      <span className="kidfit-label">{info.label}</span>
    </span>
  );
}
