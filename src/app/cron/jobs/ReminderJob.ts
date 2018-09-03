import { DateTime } from "luxon";
import { BaseCronTask } from "../BaseCronTask";

export default class ReminderJob extends BaseCronTask {
  public cronTime = "*/10 * * * * *"; // every day at 18:00

  public async onTick() {
    const tomorrow = DateTime.local().setZone("Europe/Kiev").plus({ days: 1 });
    const tomorrowServices = await this.standManager.getServicesOnDate(tomorrow);
    console.log(tomorrowServices);
  }
}
