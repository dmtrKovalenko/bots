import { startOfDay, endOfDay, format, isBefore } from 'date-fns'
import TeamUpService from '../services/TeamUpService'

export default class StandManager {
  static async getTodayServices() {
    let response = ''
    const todayEvents = await TeamUpService.getEventsCollection(startOfDay(new Date()), endOfDay(new Date()))

    todayEvents
      .sort((a, b) => isBefore(a.start_dt, b.end_dt) ? -1 : 1)
      .forEach(event => {
        const start = format(event.start_dt, 'HH:mm')
        const end = format(event.end_dt, 'HH:mm')

        response += `${start}-${end} ${event.title} \n`
      })

    return response;
  }
}
