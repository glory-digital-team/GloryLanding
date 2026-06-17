// Декоративная графика CTA-блока (Figma «Group 24» 155:1561) — изометрическая
// «стеклянная» стопка-часы. Геометрия (fillGeometry), матрицы и ЭФФЕКТЫ
// декодированы 1:1 из canvas.fig; контейнер 420×327.
//
// Слои снизу вверх (порядок отрисовки макета):
//   Group 6  — красная «подушка» #CC0000
//   Group 7  — градиентная грань + drop-shadow 0/66/52.78 #FF5872 50%
//   Group 10 — малая красная грань + drop-shadow 0/22.4/29.03 #FF3038
//   Group 8  — белая «подушка» 50% + BACKGROUND BLUR 26.39 (матовое стекло)
//   Group 9  — белая грань 50% + BACKGROUND BLUR 26.39 + градиентная обводка
//   Group 11 — стрелки часов: статичный «росчерк» в позе 12:20 (как в макете)
//
// Белые слои — div'ы с backdrop-filter (SVG так не умеет): они реально
// размывают красные слои под собой, как в Figma. Позиции групп заданы
// в Cta.module.scss (left/top), изометрия — на внутренних элементах.

// Изометрическая «подушка» 374.3×215.23 (узлы 155:1563 / 155:1569)
const DIAMOND =
  "M17.15 130.69C-4.91 118.36 -5.24 83.09 13.57 73.19L147.09 9.56C169.18 -3.19 204.99 -3.19 227.08 9.56L359.61 72.54C380.06 82.76 379.11 117.95 357.02 130.69L227.08 205.67C204.99 218.41 169.18 218.41 147.09 205.67L17.15 130.69Z";
// Скруглённый квадрат 242.37×242.37, r46.18 (узел 155:1565)
const ROUNDED_SQ =
  "M0 46.18C0 20.68 20.68 0 46.18 0L196.19 0C221.7 0 242.37 20.68 242.37 46.18L242.37 196.19C242.37 221.7 221.7 242.37 196.19 242.37L46.18 242.37C20.68 242.37 0 221.7 0 196.19L0 46.18Z";
// Грань 176×174.4 со скруглёнными углами (узел 155:1567)
const FACE2 =
  "M0 0L110.05 0C146.49 0 176.03 29.54 176.03 65.98L176.03 174.42L26.39 174.42C11.82 174.42 0 162.61 0 148.03L0 0Z";
// Стрелки часов. В макете (узел 155:1573) это один path-«росчерк»: вертикальный
// штрих 18×~69 и диагональный к (60.78, 88.09), сходящиеся в точке (9.01, 68.5).
// Росчерк разобран на два отрезка с круглыми торцами той же толщины (18.02);
// статичная поза 12:20 совпадает с исходной геометрией макета.
const CLOCK_PIVOT = { x: 9.01, y: 68.5 };
// Минутная — исходный вертикальный штрих: торец-полукруг на (9.01, 8.82)
const MINUTE_TIP = { x: 9.01, y: 8.82 };
// Часовая — исходный диагональный штрих (направление 0.864/0.504, длина ~48)
const HOUR_TIP = { x: 50.5, y: 92.7 };

export function CtaGraphic({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {/* Group 6 — красная «подушка» (зад) */}
      <div className="ctaLayer ctaRedDiamond">
        <svg width="374.3" height="215.23" viewBox="0 0 374.3 215.23" fill="none">
          <path d={DIAMOND} fill="#CC0000" />
        </svg>
      </div>

      {/* Group 7 — градиентная грань с розовым свечением */}
      <div className="ctaLayer ctaGradSquare">
        <div className="ctaIsoSquare">
          <svg width="242.37" height="242.37" viewBox="0 0 242.37 242.37" fill="none">
            <defs>
              {/* fill: linear #F41D1D → #FF4160 (transform из canvas.fig) */}
              <linearGradient
                id="ctaGrad"
                gradientUnits="userSpaceOnUse"
                x1="130.23"
                y1="250.31"
                x2="112.15"
                y2="-7.93"
              >
                <stop offset="0.20551" stopColor="#F41D1D" />
                <stop offset="0.61642" stopColor="#FF4160" />
              </linearGradient>
              {/* stroke: white 43% → 44% (84.7%) → 0 */}
              <linearGradient
                id="ctaGradEdge"
                gradientUnits="userSpaceOnUse"
                x1="56.6"
                y1="60.6"
                x2="162.9"
                y2="160.4"
              >
                <stop stopColor="#FFFFFF" stopOpacity="0.43" />
                <stop offset="0.847" stopColor="#FFFFFF" stopOpacity="0.44" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={ROUNDED_SQ}
              fill="url(#ctaGrad)"
              stroke="url(#ctaGradEdge)"
              strokeWidth="1.979"
            />
          </svg>
        </div>
      </div>

      {/* Group 10 — малая красная грань с алым свечением */}
      <div className="ctaLayer ctaRedFace">
        <div className="ctaIsoFace">
          <svg width="176.03" height="174.42" viewBox="0 0 176.03 174.42" fill="none">
            <path d={FACE2} fill="#CC0000" />
          </svg>
        </div>
      </div>

      {/* Group 8 — белая матовая «подушка» (backdrop blur 26.39) */}
      <div className="ctaLayer ctaWhiteDiamond" />

      {/* Group 9 — белая матовая грань с градиентной кромкой */}
      <div className="ctaLayer ctaWhiteSquare">
        <div className="ctaIsoSquare ctaGlassSquare">
          <svg
            className="ctaGlassEdge"
            width="242.37"
            height="242.37"
            viewBox="0 0 242.37 242.37"
            fill="none"
          >
            <defs>
              {/* stroke: white 9% → 79% (84.7%) → 17% */}
              <linearGradient
                id="ctaGlassEdgeGrad"
                gradientUnits="userSpaceOnUse"
                x1="65.2"
                y1="68.3"
                x2="175.8"
                y2="172.9"
              >
                <stop stopColor="#FFFFFF" stopOpacity="0.09" />
                <stop offset="0.847" stopColor="#FFFFFF" stopOpacity="0.79" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.17" />
              </linearGradient>
            </defs>
            <rect
              x="0.99"
              y="0.99"
              width="240.39"
              height="240.39"
              rx="45.19"
              stroke="url(#ctaGlassEdgeGrad)"
              strokeWidth="1.979"
            />
          </svg>
        </div>
      </div>

      {/* Group 11 — стрелки часов: статичная поза 12:20 на стеклянной грани */}
      <div className="ctaLayer ctaSwoosh">
        <svg
          className="ctaSwooshSvg"
          width="65.2"
          height="104.49"
          viewBox="0 0 65.2 104.49"
          fill="none"
        >
          <g className="ctaHourHand">
            <line
              x1={CLOCK_PIVOT.x}
              y1={CLOCK_PIVOT.y}
              x2={HOUR_TIP.x}
              y2={HOUR_TIP.y}
              stroke="#CC0000"
              strokeWidth="18.02"
              strokeLinecap="round"
            />
          </g>
          <g className="ctaMinuteHand">
            <line
              x1={CLOCK_PIVOT.x}
              y1={CLOCK_PIVOT.y}
              x2={MINUTE_TIP.x}
              y2={MINUTE_TIP.y}
              stroke="#CC0000"
              strokeWidth="18.02"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
