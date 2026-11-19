/** Giant type that slides with the scroll: one outlined row, one solid row moving the other way. */
const rowA = "Scan — Model — Map — LiDAR — Revit — ArcGIS — ";
const rowB = ["Point cloud", "BIM", "GIS"];

export function ScrollBand() {
  const solid = Array.from({ length: 4 }, () => rowB).flat();
  return (
    <section aria-hidden className="relative overflow-hidden border-y bg-void py-10 sm:py-14">
      <div className="band-track font-display text-[clamp(64px,13vw,220px)] leading-[0.9] font-medium tracking-[-0.05em] whitespace-nowrap">
        <span className="outline-type">{rowA.repeat(3)}</span>
      </div>
      <div className="band-track mt-2 font-display text-[clamp(64px,13vw,220px)] leading-[0.9] font-medium tracking-[-0.05em] whitespace-nowrap text-ink/90 [animation-direction:reverse]">
        {solid.map((w, i) => (
          <span key={i}>
            {w} <span className="text-map">→</span>{" "}
          </span>
        ))}
      </div>
    </section>
  );
}
