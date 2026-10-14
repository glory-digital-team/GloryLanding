import { postSite } from "@/shared/api/cabinet";

// Отклик уходит в «Глори.Штат» (подпроект 12): раздел «Команда → Отклики», уведомление команде, кандидату — номер.
export interface ApplicationPayload {
  vacancyId: string | null;
  /** Название вакансии — для вакансии из встроенного списка (Штат недоступен), у неё нет id Штата. */
  vacancyTitle: string | null;
  name: string;
  contact: string;
  link: string;
  message: string;
  consent: boolean;
}

export interface ApplicationReceipt {
  number: string;
}

/** Ссылку без протокола («github.com/me») дополняем до https: Штат принимает только веб-адреса. */
const webLink = (value: string): string | null => {
  const link = value.trim();
  if (link === "") return null;
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function submitApplication(payload: ApplicationPayload): Promise<ApplicationReceipt> {
  const fromPlatform = payload.vacancyId !== null && UUID.test(payload.vacancyId);
  const message =
    !fromPlatform && payload.vacancyTitle !== null
      ? `Вакансия: ${payload.vacancyTitle}\n\n${payload.message}`.trim()
      : payload.message;
  return postSite<ApplicationReceipt>(
    "/applications",
    {
      vacancyId: fromPlatform ? payload.vacancyId : null,
      name: payload.name,
      contact: payload.contact,
      link: webLink(payload.link),
      message: message.trim() === "" ? null : message,
      consent: payload.consent,
    },
    "Не получилось отправить отклик — попробуйте ещё раз или напишите нам в Telegram",
  );
}
