import AboutStage from "./AboutStage";
import ArchiveLink from "./ArchiveLink";
import BrandWordmark from "./BrandWordmark";
import SocialLinks from "./SocialLinks";
import { activities, bossParagraph, identityParagraphs, noteHref } from "./data";
import styles from "./about.module.css";

export default function About() {
  return <AboutStage>
    <header className={styles.hero} data-surface="hero">
      <h1 className={styles.title}>ABOUT <span>US</span></h1>
      <BrandWordmark className={styles.wordmark} variant="inline" />
    </header>
    <section id="division" className={styles.card} data-surface="division" aria-labelledby="heading-division">
      <h2 id="heading-division" aria-label="NEET DIVISION"><span aria-hidden="true"><BrandWordmark className={styles.divisionWordmark} variant="inline" /></span></h2>
      <div className={styles.identityCopy}>{identityParagraphs.map(text => <p key={text}>{text}</p>)}</div>
    </section>
    {activities.map((activity, index) => <section id={activity.id} key={activity.id} className={styles.card} data-surface={activity.id} aria-labelledby={`heading-${activity.id}`}>
      <div className={styles.activityMast}><h2 className={styles.activityHeading}>ACTIVITY</h2><div className={styles.activityIndex}><div className={styles.triptych} aria-hidden="true">{activities.map((item, segment) => <i key={item.id} data-lit={segment === index} />)}</div><span className={styles.activityNumber}>0{index + 1} / 03</span></div></div>
      <h3 id={`heading-${activity.id}`}>{activity.label}</h3>
      <p className={styles.activityDescription}>{activity.description}</p>
    </section>)}
    <section id="boss" className={`${styles.card} ${styles.boss}`} data-surface="boss" aria-labelledby="heading-boss">
      <h2 id="heading-boss">OUR BOSS</h2>
      <div className={styles.bossBody}>
        {/* Native img remains the same accessible DOM asset inside either renderer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className={styles.bossPortrait}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/boss-icon.webp" alt="k4sen" width="417" height="417" className={styles.bossImage} />
        </div>
        <div><h3>k4sen</h3><p className={styles.bossSubtitle}>THE LEGENDARY STREAMER</p>
          <p className={styles.bossDescription}>{bossParagraph}</p>
          <a href={noteHref} target="_blank" rel="noopener noreferrer" className={styles.noteLink}>k4senについて知る <span aria-hidden="true">↗</span></a>
          <SocialLinks />
        </div>
      </div>
    </section>
    <ArchiveLink />
  </AboutStage>;
}
