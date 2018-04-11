import { format } from 'date-fns';
import fetch, { RequestInit } from 'node-fetch';
import * as messages from '../constants/messages';
import AuthManager from '../managers/AuthManager';
import { UnauthorizedError } from '../models/Errors';
import Meta from '../models/Meta';
import TeamUpEvent from '../models/TeamUpEvent';

const token = process.env.TEAMUP_TOKEN

const FORMAT_DATE = 'YYYY-MM-DD'
const API_URL = 'https://api.teamup.com'

export default class TeamUpService {
  constructor(private meta: Meta) { }

  private fetch(url: string, options?: RequestInit) {
    const calendarKey = AuthManager.getCalendarKey(this.meta.userId)
    if (!calendarKey) {
      return Promise.reject(new UnauthorizedError(messages.UNAUTHORIZED))
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

        console.error(payload)
        return Promise.reject(payload)
      })
  }

  getEventsCollection(start: Date, end: Date): Promise<TeamUpEvent[]> {
    const endDate = format(end, FORMAT_DATE)
    const startDate = format(start, FORMAT_DATE)

    return this.fetch(`/events?startDate=${startDate}&endDate=${endDate}&`)
      .then(res => res.events as TeamUpEvent[])
  }

  createEvent(event: TeamUpEvent) {
    return this.fetch('/events?', { method: 'POST', body: JSON.stringify(event) })
      .then(res => res.event as TeamUpEvent)
  }
}

