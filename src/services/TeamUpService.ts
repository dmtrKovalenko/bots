import fetch from 'node-fetch';
import { format } from 'date-fns';
import TeamUpEvent from '../models/TeamUpEvent';

const token = process.env.TEAMUP_TOKEN
const calendarKey = process.env.TEAMUP_CALENDAR_KEY

class TeamUpService {
  apiUrl = 'https://api.teamup.com'

  private fetch(url: string) {
    return fetch(`${this.apiUrl}/${calendarKey}${url}?_teamup_token=${token}`)
  }

  getEventsCollection(start: Date, end: Date): Promise<TeamUpEvent[]> {
    return this.fetch('/events')
      .then(res => res.json())
      .then(res => res.events as TeamUpEvent[])
  }
}

export default new TeamUpService()
