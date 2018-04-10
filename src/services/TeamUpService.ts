import fetch from 'node-fetch';
import { format } from 'date-fns';
import TeamUpEvent from '../models/TeamUpEvent';

const token = process.env.TEAMUP_TOKEN
const calendarKey = process.env.TEAMUP_CALENDAR_KEY

const FORMAT_DATE = 'YYYY-MM-DD'

class TeamUpService {
  apiUrl = 'https://api.teamup.com'

  private fetch(url: string) {
    return fetch(`${this.apiUrl}/${calendarKey}${url}_teamup_token=${token}`)
      .then(async res => {
        if (res.ok) { return res.json()  }
        const message = await res.text();

        console.error(message)
        return Promise.reject(message)
      })
  }

  getEventsCollection(start: Date, end: Date): Promise<TeamUpEvent[]> {
    const endDate = format(end, FORMAT_DATE)
    const startDate = format(start, FORMAT_DATE)

    return this.fetch(`/events?startDate=${startDate}&endDate=${endDate}&`)
      .then(res => res.events as TeamUpEvent[])
  }
}

export default new TeamUpService()
