import { BaseCronTask } from "../BaseCronTask";

export default class ReminderJob extends BaseCronTask {
  public cronTime = "* 0 18 * * *"; // every day at 18:00

  public async onTick() {
    const tomorrowServices = await this.standManager.getServices("завтра");
    console.log(tomorrowServices);
  }
}
