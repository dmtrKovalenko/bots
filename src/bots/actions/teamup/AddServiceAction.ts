import StandManager from "../../../managers/StandManager";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import BaseTeamupAction from "./BaseTeamupAction";

export default class AddServiceAction extends BaseTeamupAction {
  public regexp = /^Запиши меня(?: на)? (.{1,20}) с (\d{1,2}(?::\d{2})?) до (\d{1,2}(?::\d{2})?)/i;

  protected async action(session: ProcessMessageSession) {
    const context = session.context;
    const manager = new StandManager(context.userProfile);

    const processingMessageDelay = this.processingMessageDelay(session);

    if (!await this.checkTeamupKey(session)) {
      return true;
    }

    const date = this.arg(0).trim();
    const startTime = this.arg(1).trim();
    const endTime = this.arg(2).trim();

    session.sendTextMessage(await manager.addService(date, startTime, endTime));

    processingMessageDelay.cancel();
    return true;
  }
}
