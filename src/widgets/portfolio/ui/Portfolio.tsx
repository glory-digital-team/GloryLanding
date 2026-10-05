/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { PROJECTS } from "@/views/portfolio/model/projects";
import styles from "./Portfolio.module.scss";

// Секция «Наши проекты» (Figma «Portfolio» 184:967) — 4 карточки 548×548,
// геометрия и слои 1:1 с макетом.
export function Portfolio() {
  return (
    <section className={styles.portfolio}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Наши проекты</h2>

        <div className={styles.grid}>
          {PROJECTS.map((project) => (
            <a
              key={project.id}
              className={`${styles.card} ${styles[project.cardClass]}`}
              href={project.href}
              target={project.href.startsWith("http") ? "_blank" : undefined}
              rel={project.href.startsWith("http") ? "noreferrer" : undefined}
              aria-label={`Открыть проект ${project.title}`}
            >
              {project.id === "ii-govori" ? (
                <span className={styles.imageGovori} aria-hidden="true">
                  <img src={project.image.src} alt={project.image.alt} />
                </span>
              ) : (
                <img
                  className={styles[project.image.className || ""]}
                  src={project.image.src}
                  alt={project.image.alt}
                />
              )}

              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className={`${styles.text} ${project.textBlur ? styles.textBlur : ""}`}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardSubtitle}>{project.subtitle}</p>
              </div>
            </a>
          ))}
        </div>

        <div className={styles.buttonContainer}>
          <Link href="/portfolio">
            <Button variant="secondary" size="md">
              Все проекты
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
