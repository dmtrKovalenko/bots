
import * as R from "../../../constants/messages";
import UserRepository from "../../../db/repositories/UserRepository";
import StandManager from "../../../managers/StandManager";
import { BaseCronTask } from "../BaseCronTask";

export default class ManagerJob extends BaseCronTask {
  public cronTime = "0 0 19 * * *"; // every day at 19:00
  private standManager = new StandManager(this.serviceUserProfile);

  public async onTick() {
    const tomorrowServices = await this.standManager.getServices("завтра");
    const managers = await UserRepository.getAllManagers();
    const message = R.MANAGER_TOMORROW_SCHEDULE(tomorrowServices);

    for (const manager of managers) {
      this.sendMessageToUserChats(message, manager);
    }
  }
}
