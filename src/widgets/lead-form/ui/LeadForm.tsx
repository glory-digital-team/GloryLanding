"use client";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import styles from "./LeadForm.module.scss";

// Блок-форма «Оставить заявку» (Figma «Frame 2147223060» 191:325).
export function LeadForm() {
  return (
    <section className={styles.section} id="lead-form">
      <form className={styles.card} onSubmit={(e) => e.preventDefault()}>
        <h2 className={styles.title}>Обсудить точки роста</h2>

        <div className={styles.fields}>
          <Input aria-label="Имя" placeholder="Ваше имя" autoComplete="name" />
          <Input
            label="Телефон"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
          />

          <label className={styles.consent}>
            <input type="checkbox" className={styles.checkbox} />
            <span>
              Согласен на обработку персональных данных.{" "}
              <a href="#" className={styles.policy}>
                Политика конфиденциальности
              </a>
            </span>
          </label>
        </div>

        <div className={styles.actions}>
          <Button type="submit" variant="primary" className={styles.fullBtn}>
            Начать проект
          </Button>
          <Button type="button" className={styles.fullBtn} data-soft="true">
            Перейти в конфигуратор
          </Button>
        </div>
      </form>
    </section>
  );
}
