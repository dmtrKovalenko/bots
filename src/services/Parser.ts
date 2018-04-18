import { addDays, isValid } from "date-fns";
import config from "../constants/config";
import * as messages from "../constants/messages";
import { localizedParse } from "../utils/helpers";

export default class Parser  {
  public static parseDate(string: string) {
    switch (string) {
      case "позавчера":
        return addDays(new Date(), -2);
      case "вчера":
        return addDays(new Date(), -1);
      case "сегодня":
        return new Date();
      case "завтра":
        return addDays(new Date(), 1);
      case "послезавтра":
        return addDays(new Date(), 2);
      default:
        return this.parseFormattedDate(string);
    }
  }

  public static parseTime(string: string, baseDate?: Date) {
    const time = localizedParse(string, "HH:mm", baseDate);

    if (!isValid(time)) {
      throw new Error(messages.DATE_CANNOT_BE_PARSED);
    }

    return time;
  }

  private static parseFormattedDate(dateString: string) {
    let parsedDate;
    config.availableDateFormats.find((format) => {
      parsedDate = localizedParse(dateString, format);
      return isValid(parsedDate);
    });

    // if we not found any format that parsing string as date properly
    if (!isValid(parsedDate)) {
      throw new Error(messages.DATE_CANNOT_BE_PARSED);
    }

    return parsedDate;
  }
}
