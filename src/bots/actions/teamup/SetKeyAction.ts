import StandManager from "../../../managers/StandManager";
import BaseTeamupAction from "./BaseTeamupAction";

export default class SetKeyAction extends BaseTeamupAction {
  public regexp = /^Мой ключ (.+)$/i;

  protected async action() {
    const manager = new StandManager(this.userProfile());
    const key = this.arg(0).trim();

    return this.longRunningOperation(async () => {
      this.sendMessage(await manager.authorizeKey(key));
    });
  }
}
