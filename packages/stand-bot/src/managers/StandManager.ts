import { CustomError, UserProfile } from "bot-core";
import { DateTime } from "luxon";
import * as messages from "../constants/messages";
import TeamUpEvent from "../models/TeamUpEvent";
import TeamUpService from "../services/TeamUpService";
import { localizedFormat } from "../utils/helpers";
import AuthManager from "./AuthManager";

export default class StandManager {
  public teamUpService: TeamUpService;

  constructor(private userProfile: UserProfile) {
    this.teamUpService = new TeamUpService(userProfile);
  }

  public async addService(start: DateTime, end: DateTime) {
    const event = new TeamUpEvent(this.userProfile.name, start, end);

    try {
      return await this.teamUpService.createEvent(event);
    } catch (e) {
      if (e.error && e.error.id === "event_overlapping") {
        const schedule = await this.getServicesOnDateText(event.startDate);

        throw new CustomError(messages.CONFLICT + schedule);
      }

      throw e;
    }
  }

  public async authorizeKey(keyToCheck: string) {
    if (keyToCheck.startsWith("https://teamup.com/")) {
      keyToCheck = keyToCheck.replace("https://teamup.com/", "");
    }

    try {
      const { key, name } = await this.teamUpService.verifyKey(keyToCheck);

      await AuthManager.addCalendarKey(this.userProfile, key, name);
    } catch (e) {
      throw new CustomError(messages.KEY_INVALID, e);
    }
  }

  public async getServicesOnDate(date: DateTime) {
    return this.teamUpService.getEventsCollection(date.startOf("day"), date.startOf("day"));
  }

  public async getServicesOnDateText(date: DateTime) {
    const todayEvents = await this.getServicesOnDate(date);

    if (todayEvents.length === 0) {
      return messages.DAY_IS_FREE;
    }

    let response = "";
    todayEvents.forEach((event, index) => {
      const start = localizedFormat(event.startDate, "HH:mm");
      const end = localizedFormat(event.endDate, "HH:mm");

      response += `${start}-${end} ${event.title}`;
      if (index !== todayEvents.length - 1) {
        response += "\n"; // add linebreak
      }
    });

    return response;
  }
}
