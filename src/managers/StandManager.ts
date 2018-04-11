import { startOfDay, endOfDay, format } from 'date-fns'
import TeamUpService from '../services/TeamUpService'
import * as messages from '../constants/messages'
import Parser from '../services/Parser';

export default class StandManager {
  static getServices(when: string) {
    try {
      const date = Parser.parseDate(when)
      return this.getServicesOnDate(date!)
    } catch(e) {
      return Promise.resolve(e.message)
    }
  }

  private static async getServicesOnDate(date: Date) {
    const todayEvents = await TeamUpService.getEventsCollection(startOfDay(date), endOfDay(date))

    if (todayEvents.length === 0) {
      return messages.DAY_IS_FREE
    }

    let response = ''
    todayEvents.forEach(event => {
      const start = format(event.start_dt, 'HH:mm')
      const end = format(event.end_dt, 'HH:mm')

      response += `${start}-${end} ${event.title} \n`
    })

    return response
  }
}
