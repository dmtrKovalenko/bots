import { DateTime } from "luxon";
import * as R from "../../constants/messages";
import AuthManager from "../../managers/AuthManager";
import MetaManager from "../../managers/MetaManager";
import { BaseCronTask } from "../BaseCronTask";

export default class ReminderJob extends BaseCronTask {
  public cronTime = "0 15 * * * *"; // every 15`s minute of hour
  private authManager = new AuthManager(this.teamUpService);

  public async onTick() {
    const today = DateTime.local().setZone("Europe/Kiev").startOf("day");

    const events = await this.standManager.getServicesOnDate(today);
    const reportUrl = await MetaManager.getReportUrl();

    const eventsToRemind = events.filter((event) => {
      const diffFromNow = event.endDate.diffNow().as("hours");
      return diffFromNow < 0 && diffFromNow > -1;
    });

    for (const event of eventsToRemind) {
      const user = await this.authManager.getEventAuthor(event);

      if (user) {
        this.sendMessageToUserChats(R.PLEASE_SEND_REPORT(reportUrl), user);
      }
    }
  }
}
