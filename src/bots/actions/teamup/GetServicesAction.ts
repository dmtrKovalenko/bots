import StandManager from "../../../managers/StandManager";
import {MessageRegexp} from "../BaseAction";
import BaseTeamupAction from "./BaseTeamupAction";

export default class GetServicesAction extends BaseTeamupAction {
  public regexp = new MessageRegexp(/^Кто (?:записан|стоит|служит) (.+)$/i);

  protected async execute() {
    const manager = new StandManager(this.userProfile);

    if (!await this.checkTeamupKey()) {
        return;
      }

    const when = this.arg(0).trim();
    this.sendMessage(await manager.getServices(when));
  }
}
