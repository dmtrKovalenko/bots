import * as http from "http";
import { DateTime } from "luxon";

export const localizedFormat = (date: DateTime, formatString: string) => {
  return date.setLocale("ru").setZone("Europe/Kiev").toFormat(formatString);
};

export const localizedParse = (value: string, formatString: string) => {
  return DateTime.fromFormat(value, formatString, { locale: "ru", zone: "Europe/Kiev" });
};

export const mockWebServer = () => {
  if (process.env.NOW_URL) {
    // Mock web server for cloud provider
    http.createServer(() => { /* fake */ }).listen(8080);
  }
};
