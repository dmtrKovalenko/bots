import StandManager from "../../../managers/StandManager";
import BaseTeamupAction from "./BaseTeamupAction";

export default class GetServicesAction extends BaseTeamupAction {
  public regexp = /^Кто (?:записан|стоит|служит) (.+)$/i;

  protected async action() {
    const manager = new StandManager(this.userProfile());

    return this.longRunningOperation(async () => {
      if (!await this.checkTeamupKey()) {
        return;
      }

      const when = this.arg(0).trim();
      this.sendMessage(await manager.getServices(when));
    });
  }
}
