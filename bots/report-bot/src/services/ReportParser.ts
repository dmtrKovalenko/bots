import { CustomError } from "bot-core";
import pluralize from "pluralize-ru";
import { IReport } from "../db/models/Report";

export type AvailableCharacter = "м" | "п" | "пп" | "ч" | "в";
export type ReportValues = Omit<IReport, "telegram_id" | "month">;

export default class ReportParser {
  public static charactersMap = new Map<AvailableCharacter, keyof ReportValues>([
    ["м", "minutes"],
    ["п", "publications"],
    ["пп", "visits"],
    ["в", "videos"],
  ]);

  public static hourCharacter: AvailableCharacter = "ч";
  public static availableCharacters = [...ReportParser.charactersMap.keys(), ReportParser.hourCharacter];

  public static makeReportFromParts(parts: string[]) {
    const finalReport: ReportValues = {
      minutes: 0,
      publications: 0,
      videos: 0,
      visits: 0,
    };

    parts.forEach((part) => {
      const leadingCharacter = this.availableCharacters.find((char) => part.includes(char));
      if (!leadingCharacter) {
        throw new CustomError("You should provide proper character");
      }

      const count = Number(part.replace(leadingCharacter, ""));

      if (leadingCharacter === this.hourCharacter) {
        finalReport.minutes += count * 60;
        return;
      }

      const position = this.charactersMap.get(leadingCharacter)!;
      finalReport[position] += count;
    });

    return finalReport;
  }

  public static renderReport(report: ReportValues) {
    let finalString = "";

    const hours = Math.floor(report.minutes / 60);
    const minutes = report.minutes - (hours * 60);

    const values = { ...report, hours, minutes };
    const positions = [...this.pluralizeLabels.keys()].filter((position) => values[position] > 0);

    positions.forEach((position, i) => {
      const count = values[position];

      const text = this.pluralizeLabels.get(position)!(count);
      finalString += text;

      if (i < positions.length - 1) {
        finalString += ", ";
      }
    });

    return finalString;
  }

  private static pluralizeLabels = new Map<keyof ReportValues | "hours", (count: number) => string>([
    ["hours", (count) => pluralize(count, "нет часов", "%d час", "%d часа", "%d часов")],
    ["minutes", (count) => pluralize(count, "нет минут", "%d минута", "%d минуты", "%d минут")],
    ["publications", (count) => pluralize(count, "нет публикаций", "%d публикация", "%d публикации", "%d публикаций")],
    ["videos", (count) => pluralize(count, "нет минут", "%d видео", "%d видео", "%d видео")],
    ["visits", (count) => pluralize(count, "нет минут", "%d повторное", "%d повторных", "%d повторных")],
  ]);
}
