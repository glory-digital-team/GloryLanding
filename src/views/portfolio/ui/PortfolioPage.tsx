/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { PROJECTS } from "../model/projects";
import styles from "./PortfolioPage.module.scss";

export function PortfolioPage() {
  // Получаем все уникальные теги
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    PROJECTS.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  const [selectedTag, setSelectedTag] = useState<string>("Все");

  // Фильтруем проекты по выбранному тегу
  const filteredProjects = useMemo(() => {
    if (selectedTag === "Все") {
      return PROJECTS;
    }
    return PROJECTS.filter((project) => project.tags.includes(selectedTag));
  }, [selectedTag]);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.content}>
        <section className={styles.section} id="portfolio">
          <div className={styles.inner}>
            <h1 className={styles.title}>Наши проекты</h1>

            {/* Фильтры по тегам */}
            <div className={styles.filters}>
              <button
                key="all"
                className={`${styles.filter} ${selectedTag === "Все" ? styles.filterActive : ""}`}
                onClick={() => setSelectedTag("Все")}
              >
                Все
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`${styles.filter} ${selectedTag === tag ? styles.filterActive : ""}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className={styles.grid}>
              {filteredProjects.map((project) => (
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
