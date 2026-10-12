// MVP-заглушка отправки отклика. Бэкенда для кандидатов пока нет:
// ждём, генерируем номер отклика и возвращаем его, как будто заявка принята.
// TODO: POST в платформу «Глори» (`/cabinet/api/...`, тип заявки «кандидат»)
// или в Telegram-бота HR — см. предложения в Notion.
export interface ApplicationPayload {
  vacancyId: string | null;
  name: string;
  contact: string;
  link: string;
  message: string;
}

export interface ApplicationReceipt {
  number: string;
}

export async function submitApplication(payload: ApplicationPayload): Promise<ApplicationReceipt> {
  await new Promise((r) => setTimeout(r, 1100));
  if (typeof window !== "undefined") {
    try {
      const key = "glory-careers-applications";
      const saved = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown[];
      window.localStorage.setItem(key, JSON.stringify([...saved, { ...payload, at: Date.now() }]));
    } catch {
      /* приватный режим — не критично */
    }
  }
  return { number: `GL-${String(Math.floor(1000 + Math.random() * 9000))}` };
}
