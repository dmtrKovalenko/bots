import { DateTime } from "luxon";
import config from "../constants/config";
import * as messages from "../constants/messages";
import { localizedParse } from "../utils/helpers";

export default class Parser  {
  public static parseDate(string: string) {
    const now = DateTime.local().setZone("Europe/Kiev");

    switch (string) {
      case "позавчера":
        return now.minus({ days: 2 });
      case "вчера":
        return now.minus({ days: 1 });
      case "сегодня":
        return now;
      case "завтра":
        return now.plus({ days: 1 });
      case "послезавтра":
        return now.plus({ days: 2 });
      default:
        return this.parseFormattedDate(string);
    }
  }

  public static parseTime(string: string, baseDate?: DateTime) {
    const time = localizedParse(string, "HH:mm");

    if (!time.isValid) {
      throw new Error(messages.DATE_CANNOT_BE_PARSED);
    }

    if (baseDate) {
      return baseDate.set({
        hour: time.get("hour"),
        minute: time.get("minute"),
      });
    }

    return time;
  }

  private static parseFormattedDate(dateString: string) {
    let parsedDate: DateTime;

    config.availableDateFormats.find((format) => {
      parsedDate = localizedParse(dateString, format);
      return parsedDate.isValid;
    });

    if (!parsedDate!.isValid) {
      throw new Error(messages.DATE_CANNOT_BE_PARSED);
    }

    return parsedDate!;
  }
}
