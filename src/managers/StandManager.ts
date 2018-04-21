import { DateTime } from "luxon";
import * as messages from "../constants/messages";
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
    try {
      const date = Parser.parseDate(when);
      return this.getServicesOnDate(date!);
    } catch (e) {
      return Promise.resolve(e.message);
    }
  }

  public addService(date: string, startTime: string, endTime: string) {
    let start: DateTime;
    let end: DateTime;

    try {
      const baseDate = Parser.parseDate(date);

      start = Parser.parseTime(startTime, baseDate);
      end = Parser.parseTime(endTime, baseDate);
    } catch (e) {
      return Promise.resolve(e.message);
    }

    const event = new TeamUpEvent(this.userProfile.name, start, end);
    return this.teamUpService.createEvent(event)
      .then(() => messages.ADDED_SUCCESSFULLY(localizedFormat(start, "dd MMMM в HH:mm")))
      .catch((e) => {
        if (e.error && e.error.id === "event_overlapping") {
          return this.getServicesOnDate(start)
            .then((schedule) => messages.CONFLICT + schedule);
        }

        return Promise.reject(e);
      });
  }

  public async authorizeKey(key: string) {
    if (key.startsWith("https://teamup.com/")) {
      key = key.replace("https://teamup.com/", "");
    }

    const isAuthorized = await this.teamUpService.verifyKey(key);
    if (!isAuthorized) {
      return messages.KEY_INVALID;
    }

    await AuthManager.addCalendarKey(this.userProfile, key);
    return messages.KEY_AUTHORIZED;
  }

  private async getServicesOnDate(date: DateTime) {
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
