import StandManager from "../../../managers/StandManager";
import BaseTeamupAction from "./BaseTeamupAction";
import {MessageRegexp} from "../BaseAction";

export default class SetKeyAction extends BaseTeamupAction {
  public regexp = new MessageRegexp(/^Мой ключ (.+)$/i);

  protected async execute() {
    const manager = new StandManager(this.userProfile);
    const key = this.arg(0).trim();

    return this.longRunningOperation(async () => {
      this.sendMessage(await manager.authorizeKey(key));
    });
  }
}
