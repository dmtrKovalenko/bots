import { startOfDay, endOfDay, format } from 'date-fns'
import TeamUpService from '../services/TeamUpService'
import * as messages from '../constants/messages'
import Parser from '../services/Parser';
import TeamUpEvent from '../models/TeamUpEvent';
import { localizedFormat } from '../utils/helpers';

export default class StandManager {
  static getServices(when: string) {
    try {
      const date = Parser.parseDate(when)
      return this.getServicesOnDate(date!)
    } catch(e) {
      return Promise.resolve(e.message)
    }
  }

  static addService(userName: string, date: string, startTime: string, endTime: string) {
    let start: Date, end: Date;
    try {
      const baseDate = Parser.parseDate(date)

      start = Parser.parseTime(startTime, baseDate)
      end = Parser.parseTime(endTime, baseDate)
    } catch(e) {
      return Promise.resolve(e.message)
    }

    const event = new TeamUpEvent(userName, start, end)
    return TeamUpService.createEvent(event)
      .then(event => messages.ADDED_SUCCESSFULLY(localizedFormat(start, 'DD MMMM в HH:mm')))
      .catch(e => {
        if (e.error.id === 'event_overlapping') {
          return this.getServicesOnDate(start)
            .then(schedule => messages.CONFLICT + schedule)
        }

        return Promise.reject(e)
      })
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
