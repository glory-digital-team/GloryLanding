import type { ReactNode } from "react";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Icon, ICON_NAMES } from "@/shared/ui/Icon";
import { IconButton } from "@/shared/ui/IconButton";
import { Input } from "@/shared/ui/Input";
import { Logo } from "@/shared/ui/Logo";
import { siteConfig } from "@/shared/config";
import { colorSwatches, typeScale, fontWeights } from "../model";
import styles from "./UiKitPage.module.scss";

// ── Карточка-секция (белая, с шапкой и знаком «G» в углу) ──
function KitCard({
  title,
  subtitle,
  wide = false,
  children,
}: {
  title: string;
  subtitle: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={wide ? `${styles.card} ${styles.cardWide}` : styles.card}>
      <header className={styles.cardHead}>
        <div>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardSubtitle}>{subtitle}</p>
        </div>
        <Logo markOnly size={32} />
      </header>
      <div className={styles.cardBody}>{children}</div>
    </section>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.group}>
      <span className={styles.groupLabel}>{label}</span>
      {children}
    </div>
  );
}

export function UiKitPage() {
  return (
    <main className={styles.page}>
      <div className={styles.intro}>
        <Logo invert size={44} />
        <h1 className={styles.introTitle}>Дизайн-система</h1>
        <p className={styles.introText}>
          Типографическая система на основе Inter Font Family. Цвета, типографика и
          компоненты лендинга «Глори.Цифра».
        </p>
      </div>

      <div className={styles.grid}>
        {/* ── Foundations: Colors ── */}
        <KitCard title="Colors" subtitle="Палитра дизайн-системы">
          <div className={styles.swatches}>
            {colorSwatches.map((s) => (
              <div key={s.name} className={styles.swatch}>
                <span
                  className={styles.swatchChip}
                  style={{
                    background: s.value,
                    border: s.bordered ? "1px solid var(--kit-border)" : "none",
                  }}
                />
                <span className={styles.swatchName}>{s.name}</span>
                <span className={styles.swatchValue}>{s.value}</span>
              </div>
            ))}
          </div>
        </KitCard>

        {/* ── Foundations: Typography ── */}
        <KitCard title="Typography" subtitle="Inter — шкала размеров и веса">
          <div className={styles.typeScale}>
            {typeScale.map((t) => (
              <div key={t.label} className={styles.typeRow}>
                <span className={styles.typeMeta}>
                  {t.label} · {t.size} · {t.weight}
                </span>
                <span
                  className={styles.typeSample}
                  style={{ fontSize: t.size, fontWeight: t.weight }}
                >
                  {t.sample}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.weights}>
            {fontWeights.map((w) => (
              <span
                key={w.weight}
                className={styles.weightItem}
                style={{ fontWeight: w.weight }}
              >
                Aa {w.label} {w.weight}
              </span>
            ))}
          </div>
        </KitCard>

        {/* ── Icons ── */}
        <KitCard
          title="Icons"
          subtitle="Типографическая система на основе Inter Font Family"
        >
          <div className={styles.icons}>
            {ICON_NAMES.map((name) => (
              <span key={name} className={styles.iconCell} title={name}>
                <Icon name={name} size={24} />
              </span>
            ))}
          </div>
        </KitCard>

        {/* ── Buttons & Badges ── */}
        <KitCard title="Buttons & Badges" subtitle="Кнопки интерфейса">
          <Group label="Buttons">
            <div className={styles.buttonsRow}>
              <div className={styles.buttonsCol}>
                <Button variant="primary">Начать проект</Button>
                <Button variant="primary" iconLeft="chevron-left">
                  Начать проект
                </Button>
                <Button variant="primary" iconRight="arrow-right">
                  Начать проект
                </Button>
              </div>
              <div className={styles.buttonsCol}>
                <Button variant="secondary">Начать проект</Button>
                <Button variant="secondary" iconLeft="chevron-left">
                  Начать проект
                </Button>
                <Button variant="secondary" iconRight="chevron-right">
                  Начать проект
                </Button>
              </div>
            </div>
          </Group>

          <Group label="Icon Button">
            <div className={styles.iconButtons}>
              <IconButton icon="shield-check" label="Действие" />
              <IconButton icon="shield-check" label="Действие" />
            </div>
          </Group>

          <Group label="Badge">
            <div className={styles.badges}>
              <Badge size="sm">Одна студия для бизнеса</Badge>
              <Badge>Digital-студия для бизнеса</Badge>
            </div>
          </Group>

          <Group label="Email">
            <div className={styles.inputs}>
              <Input placeholder="Ваше имя" />
              <Input placeholder="Ваше имя" />
            </div>
          </Group>
        </KitCard>

        {/* ── Landing Components ── */}
        <KitCard
          title="Landing Components"
          subtitle="Типографическая система на основе Inter Font Family"
          wide
        >
          <Group label="Header">
            <div className={styles.headerDemo}>
              <Logo size={30} />
              <nav className={styles.headerNav}>
                {siteConfig.nav.map((item) => (
                  <span key={item.href}>{item.label}</span>
                ))}
              </nav>
              <Button variant="primary" size="md">
                Начать проект
              </Button>
            </div>
          </Group>

          <Group label="Card">
            <Card title="Цена без сюрпризов">
              Вы видите цену каждого этапа до старта работ. Никаких скрытых наценок и
              доплат в процессе.
            </Card>
          </Group>
        </KitCard>
      </div>
    </main>
  );
}
