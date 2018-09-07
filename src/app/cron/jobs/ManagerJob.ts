import { DateTime } from "luxon";
import * as R from "../../../constants/messages";
import UserRepository from "../../../db/repositories/UserRepository";
import { BaseCronTask } from "../BaseCronTask";

export default class ManagerJob extends BaseCronTask {
  public cronTime = "0 0 19 * * *"; // every day at 19:00

  public async onTick() {
    const tomorrow = DateTime.local().setZone("Europe/Kiev").plus({ days: 1 });
    const tomorrowServices = await this.standManager.getServicesOnDateText(tomorrow);

    const managers = await UserRepository.getAllManagers();
    const message = R.MANAGER_TOMORROW_SCHEDULE(tomorrowServices);

    for (const manager of managers) {
      this.sendMessageToUserChats(message, manager);
    }
  }
}
