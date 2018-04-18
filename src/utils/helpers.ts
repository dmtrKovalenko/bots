import { format, parse } from "date-fns";
import ruLocale from "date-fns/locale/ru";

export const localizedFormat = (date: Date, formatString: string) => {
  return format(date, formatString, { locale: ruLocale });
};

export const localizedParse = (value: string, formatString: string, baseDate = new Date()) => {
  return parse(value, formatString, baseDate, { locale: ruLocale });
};
