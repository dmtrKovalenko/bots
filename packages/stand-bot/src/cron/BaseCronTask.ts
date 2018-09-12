import { CronJob } from "cron";
import { telegramBot } from "../app";
import config from "../constants/config";
import StandManager from "../managers/StandManager";
import User from "../models/User";
import TeamUpService from "../services/TeamUpService";

export abstract class BaseCronTask {
  public timeZone = "Europe/Kiev";
  public teamUpService = new TeamUpService(config.serviceUserProfile);
  public standManager = new StandManager(config.serviceUserProfile);

  public abstract cronTime: string;
  public abstract async onTick(): Promise<void>;

  public toCronJob(): CronJob {
    return new CronJob({
      cronTime: this.cronTime,
      onTick: () => this.onTick().catch(console.log), // mock async calls
      timeZone: this.timeZone,
    });
  }

  protected async sendMessageToUserChats(message: string, user: User) {
    if (user.telegram_id) {
      await telegramBot.sendMessageToChat(message, user.telegram_id);
    }

    if (user.viber_id) {
      // await ViberStandBot.sendMessageToChat(message, user.viber_id);
    }
  }
}
