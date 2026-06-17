"use client";

// Фолбэк на случай ошибки в самом корневом layout: заменяет его целиком,
// поэтому глобальные стили/шрифты недоступны → стили инлайновые, self-contained.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  const font =
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  return (
    <html lang="ru">
      <body style={{ margin: 0 }}>
        <main
          style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 16px",
            fontFamily: font,
            background:
              "radial-gradient(120% 80% at 50% -10%, #fbe9e9 0%, transparent 55%), #fafafa",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <p
              style={{
                fontSize: "clamp(96px, 18vw, 160px)",
                lineHeight: 0.9,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#c00",
                margin: 0,
              }}
            >
              500
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0f0f0f", margin: "16px 0 0" }}>
              Что-то пошло не так
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "#6b7280", margin: "16px 0 24px" }}>
              На сервере произошла ошибка. Попробуйте обновить страницу или вернуться позже.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 48,
                padding: "0 28px",
                borderRadius: 999,
                border: "1px solid transparent",
                background: "#c00",
                color: "#fff",
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Попробовать снова
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
