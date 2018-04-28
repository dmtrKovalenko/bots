import { DateTime } from "luxon";
import config from "../constants/config";
import * as messages from "../constants/messages";
import { CustomError } from "../models/Errors";
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

  public static parseTime(dateString: string, baseDate?: DateTime) {
    const time = this.parseMultipleFormats(dateString, config.availableTimeFormats);

    if (baseDate) {
      return baseDate.set({
        hour: time.get("hour"),
        minute: time.get("minute"),
      });
    }

    return time;
  }

  public static parseFormattedDate(dateString: string) {
    return this.parseMultipleFormats(dateString, config.availableDateFormats);
  }

  private static parseMultipleFormats(value: string, formats: string[]) {
    let parsedDate: DateTime;

    formats.find((format) => {
      parsedDate = localizedParse(value, format);
      return parsedDate.isValid;
    });

    if (!parsedDate!.isValid) {
      throw new CustomError(messages.DATE_CANNOT_BE_PARSED);
    }

    return parsedDate!;
  }
}
