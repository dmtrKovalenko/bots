import StandManager from "../../../managers/StandManager";
import BaseTeamupAction from "./BaseTeamupAction";

export default class AddServiceAction extends BaseTeamupAction {
  public regexp = /^Запиши меня(?: на)? (.{1,20}) с (\d{1,2}(?::\d{2})?) до (\d{1,2}(?::\d{2})?)/i;

  protected async action() {
    const manager = new StandManager(this.userProfile());

    return this.longRunningOperation(async () => {
      if (!await this.checkTeamupKey()) {
        return;
      }

      const date = this.arg(0).trim();
      const startTime = this.arg(1).trim();
      const endTime = this.arg(2).trim();

      this.sendMessage(await manager.addService(date, startTime, endTime));
    });
  }
}
