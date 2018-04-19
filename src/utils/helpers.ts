import { DateTime } from "luxon";

export const localizedFormat = (date: DateTime, formatString: string) => {
  return date.setLocale("ru").toFormat(formatString);
};

export const localizedParse = (value: string, formatString: string) => {
  return DateTime.fromFormat(value, formatString, { zone: "Europe/Kiev" });
};
