import { DateTime } from "luxon";

export const now = () => DateTime.local().setZone("Europe/Kiev");

export const parseMonth = (text: string) => DateTime.fromFormat(text, "MMMM", { locale: "ru", zone: "Europe/Kiev" });

export const localizedFormat = (date: DateTime, format: string) => {
  return date.setLocale("ru").setZone("Europe/Kiev").toFormat(format);
};
