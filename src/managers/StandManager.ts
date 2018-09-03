import { DateTime } from "luxon";
import * as messages from "../constants/messages";
import { CustomError } from "../models/Errors";
import TeamUpEvent from "../models/TeamUpEvent";
import UserProfile from "../models/UserProfile";
import Parser from "../services/Parser";
import TeamUpService from "../services/TeamUpService";
import { localizedFormat } from "../utils/helpers";
import AuthManager from "./AuthManager";

export default class StandManager {
  public teamUpService: TeamUpService;

  constructor(private userProfile: UserProfile) {
    this.teamUpService = new TeamUpService(userProfile);
  }

  public getServices(when: string) {
    const date = Parser.parseDate(when);

    return this.getServicesOnDate(date!);
  }

  public addService(start: DateTime, end: DateTime) {
    const event = new TeamUpEvent(this.userProfile.name, start, end);

    return this.teamUpService.createEvent(event)
      .then(() => messages.ADDED_SUCCESSFULLY(localizedFormat(event.startDate, "dd MMMM в HH:mm")))
      .catch((e) => {
        if (e.error && e.error.id === "event_overlapping") {
          return this.getServicesOnDate(event.startDate)
            .then((schedule) => messages.CONFLICT + schedule);
        }

        return Promise.reject(e);
      });
  }

  public async authorizeKey(keyToCheck: string) {
    if (keyToCheck.startsWith("https://teamup.com/")) {
      keyToCheck = keyToCheck.replace("https://teamup.com/", "");
    }

    try {
      const { key, name } = await this.teamUpService.verifyKey(keyToCheck);
      console.log(key, name);
      await AuthManager.addCalendarKey(this.userProfile, key, name);
      return messages.KEY_AUTHORIZED;
    } catch (e) {
      throw new CustomError(messages.KEY_INVALID, e);
    }
  }

  public async getServicesOnDate(date: DateTime) {
    const todayEvents = await this.teamUpService.getEventsCollection(date.startOf("day"), date.startOf("day"));

    if (todayEvents.length === 0) {
      return messages.DAY_IS_FREE;
    }

    let response = "";
    todayEvents.forEach((event, index) => {
      const end = localizedFormat(DateTime.fromISO(event.end_dt), "HH:mm");
      const start = localizedFormat(DateTime.fromISO(event.start_dt), "HH:mm");

      response += `${start}-${end} ${event.title}`;
      if (index !== todayEvents.length - 1) {
        response += "\n"; // add linebreak
      }
    });

    return response;
  }
}
