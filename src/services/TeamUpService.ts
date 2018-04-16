import { format } from 'date-fns';
import fetch, { RequestInit } from 'node-fetch';
import * as messages from '../constants/messages';
import AuthManager from '../managers/AuthManager';
import { CustomError } from '../models/Errors';
import TeamUpEvent from '../models/TeamUpEvent';
import UserProfile from "../models/UserProfile";

const token = process.env.TEAMUP_TOKEN

const FORMAT_DATE = 'YYYY-MM-DD'
const API_URL = 'https://api.teamup.com'

export default class TeamUpService {
  constructor(private userProfile: UserProfile) { }

  private async teamUpFetch(url: string, options?: RequestInit) {
    const calendarKey = await AuthManager.getCalendarKey(this.userProfile)

    if (!calendarKey) {
      return Promise.reject(new CustomError(messages.UNAUTHORIZED))
    }

    if (options) {
      options.headers = {
        'Content-Type': 'application/json'
      }
    }

    return fetch(`${API_URL}/${calendarKey}${url}_teamup_token=${token}`, options)
      .then(async res => {
        if (res.ok) { return res.json()  }

        const payload = res.headers.get('content-type') === 'application/json'
          ? await res.json()
          : await res.text()

        if (payload.error && payload.error.id === 'calendar_not_found') {
          return Promise.reject(new CustomError(messages.UNAUTHORIZED))
        }

        return Promise.reject(new Error(payload))
      })
  }

  getEventsCollection(start: Date, end: Date): Promise<TeamUpEvent[]> {
    const endDate = format(end, FORMAT_DATE)
    const startDate = format(start, FORMAT_DATE)

    return this.teamUpFetch(`/events?startDate=${startDate}&endDate=${endDate}&`)
      .then(res => res.events as TeamUpEvent[])
  }

  createEvent(event: TeamUpEvent) {
    return this.teamUpFetch('/events?', { method: 'POST', body: JSON.stringify(event) })
      .then(res => res.event as TeamUpEvent)
  }

  verifyKey(key: string) {
    // use global fetch here to make request with passed key
    return fetch(`${API_URL}/${key}/configuration?_teamup_token=${token}`)
      .then(res => res.json())
      .then(({ error }) => !Boolean(error))
  }
}

