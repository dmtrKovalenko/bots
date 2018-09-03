import { CronJob } from "cron";
import { telegramBot } from "../../app/bots/telegram";
import { viberBot } from "../../app/bots/viber";
import config from "../../constants/config";
import User from "../../models/User";

export abstract class BaseCronTask {
  public abstract cronTime: string;

  public timeZone = "Europe/Kiev";
  protected serviceUserProfile = config.serviceUserProfile;

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
      await viberBot.sendMessageToChat(message, user.viber_id);
    }
  }
}
