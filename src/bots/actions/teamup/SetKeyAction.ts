import StandManager from "managers/StandManager";
import { MessageRegexp } from "../BaseAction";
import BaseTeamupAction from "./BaseTeamupAction";

export default class SetKeyAction extends BaseTeamupAction {
  public regexp = new MessageRegexp(/^Мой ключ (.+)$/i);

  protected async execute() {
    const manager = new StandManager(this.userProfile);
    const key = this.arg(0).trim();

    this.sendMessage(await manager.authorizeKey(key));
  }
}
