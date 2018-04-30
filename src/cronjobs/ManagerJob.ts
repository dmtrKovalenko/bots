import { Message } from "viber-bot";
import { bot as TelegramBot } from "../bots/telegram";
import { bot as ViberBot } from "../bots/viber";

import config from "../constants/config";
import * as R from "../constants/messages";
import UserRepository from "../db/repositories/UserRepository";
import StandManager from "../managers/StandManager";
import { BaseCronTask } from "./BaseCronTask";

export default class ManagerJob extends BaseCronTask {
  public cronTime = "0 0 19 * * *"; // every day at 19:00

  public async onTick() {
    const standManager = new StandManager(config.serviceUserProfile);

    const tomorrowServices = await standManager.getServices("завтра");
    const managers = await UserRepository.getAllManagers();
    const message = R.MANAGER_TOMORROW_SCHEDULE(tomorrowServices);

    for (const manager of managers) {
      if (manager.telegram_id) {
        await TelegramBot.sendMessage(manager.telegram_id, message);
      }

      if (manager.viber_id) {
        await ViberBot.sendMessage({ id: manager.viber_id }, new Message.Text(message));
      }
    }
  }
}
