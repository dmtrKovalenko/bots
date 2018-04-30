import { CronJob } from "cron";

export abstract class BaseCronTask {
  public timeZone = "Europe/Kiev";
  public abstract cronTime: string;

  public abstract async onTick(): Promise<void>;

  public toCronJob(): CronJob {
    return new CronJob({
      cronTime: this.cronTime,
      onTick: () => this.onTick().catch(console.log), // mock async calls
      timeZone: this.timeZone,
    });
  }
}
