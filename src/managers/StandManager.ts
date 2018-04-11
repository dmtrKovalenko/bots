import { addDays, startOfDay, endOfDay, format, isValid } from 'date-fns'
import TeamUpService from '../services/TeamUpService'
import * as messages from '../constants/messages'
import config from '../constants/config';
import { localizedParse } from '../utils/helpers';

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
        const date = this.parseDate(when)

        return date
          ? this.getServicesOnDate(date)
          : Promise.resolve(messages.DATE_CANNOT_BE_PARSED)
    }
  }

  private static parseDate(dateString: string) {
    let parsedDate = null
    config.availableDateFormats.find(format => {
      parsedDate = localizedParse(dateString, format)
      return isValid(parsedDate)
    })

    return isValid(parsedDate) ? parsedDate : null
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
