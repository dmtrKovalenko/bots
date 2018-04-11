import { endOfDay, format, startOfDay } from 'date-fns';
import * as messages from '../constants/messages';
import Meta from '../models/Meta';
import TeamUpEvent from '../models/TeamUpEvent';
import Parser from '../services/Parser';
import TeamUpService from '../services/TeamUpService';
import { localizedFormat } from '../utils/helpers';
import AuthManager from './AuthManager';

export default class StandManager {
  teamUpService: TeamUpService;

  constructor(private meta: Meta) {
    this.teamUpService = new TeamUpService(meta)
  }

  getServices(when: string) {
    try {
      const date = Parser.parseDate(when)
      return this.getServicesOnDate(date!)
    } catch (e) {
      return Promise.resolve(e.message)
    }
  }

  addService(userName: string, date: string, startTime: string, endTime: string) {
    let start: Date, end: Date;
    try {
      const baseDate = Parser.parseDate(date)

      start = Parser.parseTime(startTime, baseDate)
      end = Parser.parseTime(endTime, baseDate)
    } catch (e) {
      return Promise.resolve(e.message)
    }

    const event = new TeamUpEvent(userName, start, end)
    return this.teamUpService.createEvent(event)
      .then(event => messages.ADDED_SUCCESSFULLY(localizedFormat(start, 'DD MMMM в HH:mm')))
      .catch(e => {
        if (e.error.id === 'event_overlapping') {
          return this.getServicesOnDate(start)
            .then(schedule => messages.CONFLICT + schedule)
        }

        return Promise.reject(e)
      })
  }

  public authorizeKey(userId: string, key: string) {
    return this.teamUpService.verifyKey(key)
      .then(isAuthorized => {
        if (isAuthorized) {
          AuthManager.addCalendarKey(userId, key)
          return messages.KEY_AUTHORIZED
        }

        return messages.KEY_INVALID
      })
  }

  private async getServicesOnDate(date: Date) {
    const todayEvents = await this.teamUpService.getEventsCollection(startOfDay(date), endOfDay(date))

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
