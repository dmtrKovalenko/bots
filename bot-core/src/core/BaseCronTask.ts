import { CronJob } from "cron";
import TelegramBot from "../bots/TelegramBot";
import ViberBot from "../bots/ViberBot";

export abstract class BaseCronTask {
  public timeZone = "Europe/Kiev";
  public abstract cronTime: string;

  constructor(
    private readonly telegramBot: TelegramBot,
    private readonly viberBot: ViberBot,
  ) { }

  public abstract async onTick(): Promise<void>;

  public toCronJob(): CronJob {
    return new CronJob({
      cronTime: this.cronTime,
      onTick: () => this.onTick().catch(console.log), // mock async calls
      timeZone: this.timeZone,
    });
  }

  protected async sendMessageToUserChats(message: string, user: { telegram_id?: number, viber_id?: string}) {
    if (user.telegram_id) {
      await this.telegramBot.sendMessageToChat(message, user.telegram_id);
    }

    if (user.viber_id) {
      // await ViberStandBot.sendMessageToChat(message, user.viber_id);
    }
  }
}
