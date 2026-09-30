/* eslint-disable @next/next/no-img-element */
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { PROJECTS } from "../model/projects";
import styles from "./PortfolioPage.module.scss";

export function PortfolioPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.content}>
        <section className={styles.section} id="portfolio">
          <div className={styles.inner}>
            <h1 className={styles.title}>Наши проекты</h1>

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
                    <h2 className={styles.cardTitle}>{project.title}</h2>
                    <p className={styles.cardSubtitle}>{project.subtitle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
