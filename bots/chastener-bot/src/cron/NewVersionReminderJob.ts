import { BaseCronTask } from "bot-core";
import config from "../constants/config";

export default class NewVersionReminderJob extends BaseCronTask {
  public cronTime = "0 0 12 * * 3"; // every wednesday at 12:00

  public async onTick() {
    this.sendMessageToUserChats(`Скотынякы, вы обновили версию на портале?`, config.chats);
  }
}
