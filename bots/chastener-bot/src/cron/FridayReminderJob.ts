import { BaseCronTask } from "bot-core";
import config from "../constants/config";

export default class ManagerJob extends BaseCronTask {
  public cronTime = "0 0 12 * * 5"; // every friday at 12:00

  public async onTick() {
    this.sendMessageToUserChats(`Не забудьте про планит, плебеи`, config.chats);
  }
}
