"use client";

import { useEffect, useRef } from "react";
import { activities } from "./data";
import styles from "./about.module.css";

/** Native details preserve all copy and keyboard operation even without JavaScript. */
export default function ActivitySwitch() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cleanups = Array.from(root.current!.querySelectorAll("details")).map(details => {
      const summary = details.querySelector("summary")!;
      const panel = details.querySelector<HTMLElement>(`.${styles.activityPanel}`)!;
      let animation: Animation | null = null;
      let desired = details.open;
      const click = (event: MouseEvent) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        event.preventDefault();
        desired = !desired;
        const start = panel.getBoundingClientRect().height;
        animation?.cancel();
        details.open = true;
        const end = desired ? panel.scrollHeight : 0;
        animation = panel.animate([{ height: `${start}px`, opacity: start ? 1 : 0 }, { height: `${end}px`, opacity: desired ? 1 : 0 }], { duration: 380, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
        animation.onfinish = () => { details.open = desired; animation?.cancel(); animation = null; };
      };
      summary.addEventListener("click", click);
      return () => { summary.removeEventListener("click", click); animation?.cancel(); };
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, []);
  return <div ref={root} className={styles.activityContent}>
    {activities.map(activity => <details key={activity.id} className={styles.activityRow} open={activity.id === "flex"}>
      <summary className={styles.activityTrigger}><h3>{activity.label}</h3><span className={styles.activityPlus} aria-hidden="true" /></summary>
      <div className={styles.activityPanel}><div className={styles.activityPanelInner}><p>{activity.description}</p></div></div>
    </details>)}
  </div>;
}
