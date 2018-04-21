import { DateTime } from "luxon";

export const localizedFormat = (date: DateTime, formatString: string) => {
  return date.setLocale("ru").setZone("Europe/Kiev").toFormat(formatString);
};

export const localizedParse = (value: string, formatString: string) => {
  return DateTime.fromFormat(value, formatString, { zone: "Europe/Kiev" });
};
