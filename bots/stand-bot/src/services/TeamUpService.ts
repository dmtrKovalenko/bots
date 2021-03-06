import { CustomError, UserProfile } from "bot-core";
import { DateTime } from "luxon";
import fetch, { RequestInit } from "node-fetch";
import URLSearchParams from "url-search-params";
import config from "../constants/config";
import * as messages from "../constants/messages";
import AuthManager from "../managers/AuthManager";
import TeamUpEvent from "../models/TeamUpEvent";

const token = process.env.TEAMUP_TOKEN;
const subcalendarId = process.env.TEAMUP_SUBCALENDAR_ID;

const FORMAT_DATE = "yyyy-MM-dd";

export default class TeamUpService {
  constructor(private userProfile: UserProfile) { }

  /** Pass here the same start & end to fetch events for 24 hours */
  public getEventsCollection(start: DateTime, end: DateTime): Promise<TeamUpEvent[]> {
    const endDate = end.toFormat(FORMAT_DATE);
    const startDate = start.toFormat(FORMAT_DATE);

    return this.teamUpFetch(`events`, { startDate, endDate, "subcalendarId[]": subcalendarId! })
      .then((res) => res.events.map((event: object) => TeamUpEvent.fromTeamUpEvent(event)));
  }

  public createEvent(event: TeamUpEvent) {
    return this.teamUpFetch(`events`, {}, { method: "POST", body: JSON.stringify(event) })
      .then((res) => res.event as TeamUpEvent);
  }

  public getAuxiliaryInfo(eventId: string): Promise<any> {
    return this.teamUpFetch(`events/${eventId}/aux`, {});
  }

  public verifyKey(key: string): Promise<{ key: string, name: string }> {
    // use global fetch here to make request with passed key
    return fetch(`${config.teamUpApiUrl}/${key}/configuration?_teamup_token=${token}`)
      .then((res) => res.json())
      .then((res) => res.error ? Promise.reject() : res.configuration.link);
  }

  private async teamUpFetch(url: string, search: { [key: string]: string }, options?: RequestInit) {
    let calendarKey = this.userProfile.teamup_key;

    if (!calendarKey) { // if we get there without key for some reason
      const key = await AuthManager.getCalendarKey(this.userProfile);
      if (!key) {
        return Promise.reject(new CustomError(messages.UNAUTHORIZED));
      }

      calendarKey = key;
    }

    if (options) {
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const params = new URLSearchParams(`_teamup_token=${token}`);
    Object.keys(search).forEach((key) => params.append(key, search[key]));

    return fetch(`${config.teamUpApiUrl}/${calendarKey}/${url}?${params.toString()}`, options)
      .then(async (res) => {
        if (res.ok) { return res.json();  }

        const payload = res.headers.get("content-type") === "application/json"
          ? await res.json()
          : await res.text();

        if (payload.error && payload.error.id === "calendar_not_found") {
          return Promise.reject(new CustomError(messages.UNAUTHORIZED));
        }

        return Promise.reject(payload);
      });
  }
}
