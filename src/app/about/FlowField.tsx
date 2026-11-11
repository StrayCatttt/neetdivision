import styles from "./about.module.css";

/** Open, page-wide contours, not a detached object. Pure SVG also renders without JS. */
export default function FlowField({ variant }: { variant: "hero" | "page" }) {
  const hero = variant === "hero";
  const gradient = `about-flow-${variant}`;
  return (
    <svg
      className={hero ? styles.heroFlow : styles.pageFlow}
      viewBox={hero ? "0 0 1600 1000" : "0 0 1600 3000"}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1500" y2={hero ? "850" : "2800"} gradientUnits="userSpaceOnUse">
          <stop stopColor="#c0b8a5" stopOpacity=".02" />
          <stop offset=".32" stopColor="#e6dfcc" stopOpacity=".38" />
          <stop offset=".56" stopColor="#a9b08c" stopOpacity=".09" />
          <stop offset=".78" stopColor="#ccff00" stopOpacity=".34" />
          <stop offset="1" stopColor="#c8b49b" stopOpacity=".03" />
        </linearGradient>
      </defs>
      <g className={styles.flowContours} stroke={`url(#${gradient})`}>
        {Array.from({ length: hero ? 34 : 24 }, (_, i) => (
          <path
            key={i}
            d={hero
              ? `M -240 ${700 + i * 9} C ${240 + i * 4} ${1100 + i * 3}, ${370 + i * 5} ${400 + i * 7}, 850 ${590 + i * 7} S ${1280 + i * 3} ${130 + i * 6}, 1840 ${250 + i * 10}`
              : `M ${1450 + i * 12} -100 C ${1000 + i * 13} 430, ${180 + i * 9} 500, ${320 + i * 9} 1030 S ${1530 + i * 4} 1600, ${1120 + i * 8} 2050 S ${-100 + i * 10} 2450, ${200 + i * 9} 3150`}
            strokeWidth={i % 8 === 0 ? 1.5 : .65}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
