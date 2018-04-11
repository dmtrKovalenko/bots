import fetch, { RequestInit, Headers }from 'node-fetch';
import { format } from 'date-fns';
import TeamUpEvent from '../models/TeamUpEvent';

const token = process.env.TEAMUP_TOKEN
const calendarKey = process.env.TEAMUP_CALENDAR_KEY

const FORMAT_DATE = 'YYYY-MM-DD'

class TeamUpService {
  apiUrl = 'https://api.teamup.com'

  private fetch(url: string, options?: RequestInit) {
    if (options) {
      options.headers = {
        'Content-Type': 'application/json'
      }
    }

    return fetch(`${this.apiUrl}/${calendarKey}${url}_teamup_token=${token}`, options)
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

export default new TeamUpService()
