import { CronJob } from "cron";
import config from "../../constants/config";
import StandManager from "../../managers/StandManager";

export abstract class BaseCronTask {
  public timeZone = "Europe/Kiev";
  public abstract cronTime: string;
  protected standManager = new StandManager(config.serviceUserProfile);

  public abstract async onTick(): Promise<void>;

  public toCronJob(): CronJob {
    return new CronJob({
      cronTime: this.cronTime,
      onTick: () => this.onTick().catch(console.log), // mock async calls
      timeZone: this.timeZone,
    });
  }
}
