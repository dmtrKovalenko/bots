import { telegramBot } from "../../../app/bots/telegram";
import { viberBot } from "../../../app/bots/viber";

import * as R from "../../../constants/messages";
import UserRepository from "../../../db/repositories/UserRepository";
import { BaseCronTask } from "../BaseCronTask";

export default class ManagerJob extends BaseCronTask {
  public cronTime = "0 0 19 * * *"; // every day at 19:00

  public async onTick() {
    const tomorrowServices = await this.standManager.getServices("завтра");
    const managers = await UserRepository.getAllManagers();
    const message = R.MANAGER_TOMORROW_SCHEDULE(tomorrowServices);

    for (const manager of managers) {
      if (manager.telegram_id) {
        await telegramBot.sendMessageToChat(message, manager.telegram_id);
      }

      if (manager.viber_id) {
        await viberBot.sendMessageToChat(message, manager.viber_id);
      }
    }
  }
}
