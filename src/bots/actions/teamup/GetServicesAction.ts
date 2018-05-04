import StandManager from "../../../managers/StandManager";
import BaseTeamupAction from "./BaseTeamupAction";
import {MessageRegexp} from "../BaseAction";

export default class GetServicesAction extends BaseTeamupAction {
  public regexp = new MessageRegexp(/^Кто (?:записан|стоит|служит) (.+)$/i);

  protected async execute() {
    const manager = new StandManager(this.userProfile);

    return this.longRunningOperation(async () => {
      if (!await this.checkTeamupKey()) {
        return;
      }

      const when = this.arg(0).trim();
      this.sendMessage(await manager.getServices(when));
    });
  }
}
