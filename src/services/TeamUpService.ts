import { DateTime } from "luxon";
import fetch, { RequestInit } from "node-fetch";
import * as messages from "../constants/messages";
import AuthManager from "../managers/AuthManager";
import { CustomError } from "../models/Errors";
import TeamUpEvent from "../models/TeamUpEvent";
import UserProfile from "../models/UserProfile";

const token = process.env.TEAMUP_TOKEN;

const FORMAT_DATE = "yyyy-MM-dd";
const API_URL = "https://api.teamup.com";

export default class TeamUpService {
  constructor(private userProfile: UserProfile) { }

  public getEventsCollection(start: DateTime, end: DateTime): Promise<TeamUpEvent[]> {
    const endDate = end.toFormat(FORMAT_DATE);
    const startDate = start.toFormat(FORMAT_DATE);

    return this.teamUpFetch(`/events?startDate=${startDate}&endDate=${endDate}&`)
      .then((res) => res.events as TeamUpEvent[]);
  }

  public createEvent(event: TeamUpEvent) {
    return this.teamUpFetch("/events?", { method: "POST", body: JSON.stringify(event) })
      .then((res) => res.event as TeamUpEvent);
  }

  public verifyKey(key: string) {
    // use global fetch here to make request with passed key
    return fetch(`${API_URL}/${key}/configuration?_teamup_token=${token}`)
      .then((res) => res.json())
      .then(({ error }) => !Boolean(error));
  }

  private async teamUpFetch(url: string, options?: RequestInit) {
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

    return fetch(`${API_URL}/${calendarKey}${url}_teamup_token=${token}`, options)
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
