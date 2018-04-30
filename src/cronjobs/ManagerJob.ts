
import { bot as TelegramBot } from "../bots/telegram";
import UserRepository from "../db/repositories/UserRepository";
import { BaseCronTask } from "./BaseCronTask";

export default class ManagerJob extends BaseCronTask {
  public cronTime = "0,10,20,30,40,50 * * * * *";

  public async onTick() {
    const managers = await UserRepository.getAllManagers();

    for (const manager of managers) {
      await TelegramBot.sendMessage(manager.telegram_id!, "I am sending it each 10 seconds");
    }
  }
}
