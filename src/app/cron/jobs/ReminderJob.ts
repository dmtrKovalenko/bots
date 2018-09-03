import { DateTime } from "luxon";
import * as R from "../../../constants/messages";
import UserRepository from "../../../db/repositories/UserRepository";
import TeamUpService from "../../../services/TeamUpService";
import { localizedFormat } from "../../../utils/helpers";
import { BaseCronTask } from "../BaseCronTask";

export default class ReminderJob extends BaseCronTask {
  public cronTime = "*/30 * * * * *"; // every day at 18:00
  private teamUpService = new TeamUpService(this.serviceUserProfile);

  public async onTick() {
    const tomorrow = DateTime.local().setZone("Europe/Kiev").plus({ days: 1 });
    const events = await this.teamUpService.getEventsCollection(tomorrow, tomorrow);

    for (const event of events) {
      const auxInfo = await this.teamUpService.getAuxiliaryInfo(event.id);
      const author = auxInfo.history.created.by;

      const user = await UserRepository.findByTeamupName(author);

      if (user) {
        const end = localizedFormat(DateTime.fromISO(event.end_dt), "HH:mm");
        const start = localizedFormat(DateTime.fromISO(event.start_dt), "HH:mm");

        this.sendMessageToUserChats(R.REMINDER(start, end), user);
      }
    }
  }
}
