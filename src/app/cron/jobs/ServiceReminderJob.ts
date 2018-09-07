import { DateTime } from "luxon";
import * as R from "../../../constants/messages";
import AuthManager from "../../../managers/AuthManager";
import { localizedFormat } from "../../../utils/helpers";
import { BaseCronTask } from "../BaseCronTask";

export default class ReminderJob extends BaseCronTask {
  public cronTime = "0 0 18 * * *"; // every day at 18:00
  private authManager = new AuthManager(this.teamUpService);

  public async onTick() {
    const tomorrow = DateTime.local().setZone("Europe/Kiev").plus({ days: 1 });
    const events = await this.teamUpService.getEventsCollection(tomorrow, tomorrow);

    if (events.length > 0) {
      const tomorrowSchedule = await this.standManager.getServicesOnDateText(tomorrow);

      for (const event of events) {
        const user = await this.authManager.getEventAuthor(event);

        if (user) {
          const end = localizedFormat(event.endDate, "HH:mm");
          const start = localizedFormat(event.startDate, "HH:mm");

          this.sendMessageToUserChats(R.REMINDER(start, end, tomorrowSchedule), user);
        }
      }
    }
  }
}
