"use client";

import styles from "./about.module.css";

/** A seventh, optional surface; never part of the six-stop scroll itinerary. */
export default function ArchiveLink() {
  function navigate(action: "archive" | "back") {
    window.dispatchEvent(new CustomEvent("about:navigate", { detail: action }));
  }
  return <aside id="original-site" className={`${styles.card} ${styles.satellite}`} data-satellite="archive" aria-labelledby="heading-original" onClickCapture={event => {
    // Capture even image-anchor clicks: the first click only focuses the satellite.
    const enhanced = event.currentTarget.closest("main")?.dataset.scene === "true";
    if (enhanced && event.currentTarget.dataset.settled !== "true") {
      event.preventDefault(); event.stopPropagation(); navigate("archive");
    }
  }}>
    <h2 id="heading-original" className={styles.satelliteTitle}>NEET DIVISION ORIGINAL SITE</h2>
    <button type="button" data-archive-enter className={styles.satelliteEnter} onClick={() => navigate("archive")} aria-label="原サイトのカードに移動" />
    <div data-archive-panel className={styles.archivePanel} role="region" aria-label="原サイトのアーカイブ">
      <a href="https://neetdi.vision/" target="_blank" rel="noopener noreferrer" className={styles.archiveImageLink} aria-label="NEET DIVISION ORIGINAL SITEを開く">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/original-slum.png" alt="NEET DIVISION ORIGINAL" width="841" height="475" className={styles.archiveImage} />
      </a>
    </div>
    <button type="button" data-archive-back className={styles.archiveBack} onClick={() => navigate("back")} aria-label="Bossに戻る"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7" /></svg></button>
  </aside>;
}
