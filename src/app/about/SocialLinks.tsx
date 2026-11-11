import { socials } from "./data";
import styles from "./about.module.css";

export default function SocialLinks() {
  return <ul className={styles.socials} aria-label="k4senのソーシャルメディア">
    {socials.map(({ name, href, path }) => <li key={name}>
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={name} title={name}>
        <span className={styles.socialDisc}><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d={path} /></svg></span>
      </a>
    </li>)}
  </ul>;
}
