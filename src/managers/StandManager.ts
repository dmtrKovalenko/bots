import { addDays, startOfDay, endOfDay, format } from 'date-fns'
import TeamUpService from '../services/TeamUpService'
import * as messages from '../constants/messages'

export default class StandManager {
  static getServices(when: string) {
    switch (when) {
      case 'позавчера':
        return this.getServicesOnDate(addDays(new Date(), -2))
      case 'вчера':
        return this.getServicesOnDate(addDays(new Date(), -1))
      case 'сегодня':
        return this.getServicesOnDate(new Date())
      case 'завтра':
        return this.getServicesOnDate(addDays(new Date(), 1))
      case 'послезавтра':
        return this.getServicesOnDate(addDays(new Date(), 2))
      default:
        return Promise.resolve(messages.DATE_CANNOT_BE_PARSED)
    }
  }

  static async getServicesOnDate(date: Date) {
    let response = ''
    const todayEvents = await TeamUpService.getEventsCollection(startOfDay(date), endOfDay(date))

    todayEvents
      .forEach(event => {
        const start = format(event.start_dt, 'HH:mm')
        const end = format(event.end_dt, 'HH:mm')

        response += `${start}-${end} ${event.title} \n`
      })

    return response;
  }
}
