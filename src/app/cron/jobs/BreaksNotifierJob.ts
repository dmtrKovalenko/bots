import { DateTime } from "luxon";
import config from "../../../constants/config";
import { NOTIFY_BREAKS } from "../../../constants/messages";
import UserRepository from "../../../db/repositories/UserRepository";
import TeamUpEvent from "../../../models/TeamUpEvent";
import { localizedFormat } from "../../../utils/helpers";
import { BaseCronTask } from "../BaseCronTask";

interface IBreak {
  start: DateTime;
  end: DateTime;
}

interface IBreakMap {
  [key: string]: IBreak[];
}

export default class BreaksNotifierJob extends BaseCronTask {
  public cronTime = "0 0 10 * * 3"; // every Tuesday at 10:00

  public async onTick() {
    const breaksMap: IBreakMap = {};
    const daysToCheck = config.weekDaysWorking
      .map((weekday) => DateTime.local().set({ weekday }));

    for (const day of daysToCheck) {
      const services = await this.standManager.getServicesOnDate(day);
      const breaksForDay = this.findBreaksInDaySchedule(services);

      breaksMap[day.toISO()] = breaksForDay;
    }

    if (Object.keys(breaksMap).length > 0) {
      const managers = await UserRepository.getAllManagers();
      const message = NOTIFY_BREAKS(this.buildBreaksListText(breaksMap));

      this.sendMessageToUserChats(message, managers[0]);
    }
  }

  private findBreaksInDaySchedule(services: TeamUpEvent[]): IBreak[] {
    const breaks: IBreak[] = [];

    services.forEach((serviceToCheck, i) => {
      const nextService = services[i + 1]; // services are already sorted by time
      if (!nextService) { return; }

      const isBreaking = nextService.startDate.diff(serviceToCheck.endDate).as("minutes") > 30;

      if (isBreaking) {
        breaks.push({
          end: nextService.startDate,
          start: serviceToCheck.endDate,
        });
      }
    });

    return breaks;
  }

  private buildBreaksListText(breakMap: IBreakMap) {
    let text = "";

    Object.keys(breakMap)
      .filter((date) => breakMap[date].length > 0)
      .forEach((date) => {
        text += `${localizedFormat(DateTime.fromISO(date), "d MMMM")}: `;

        breakMap[date].forEach((breakItem, i) => {
          text += `${localizedFormat(breakItem.start, "HH:mm")} - ${localizedFormat(breakItem.end, "HH:mm")}`;
          if (i !== breakMap[date].length - 1) {
            text += ", ";
          }
        });

        text += "\n";
      });

    return text;
  }
}
