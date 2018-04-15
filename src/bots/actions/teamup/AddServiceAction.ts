import { ProcessMessageSession } from "../../events/ProcessMessage";
import StandManager from "../../../managers/StandManager";
import BaseTeamupAction from "./BaseTeamupAction";

export default class AddServiceAction extends BaseTeamupAction {
  public static readonly PATTERN = /^Запиши меня(?: на)? (.{1,20}) с (\d{1,2}(?::\d{2})?) до (\d{1,2}(?::\d{2})?)/im;

  constructor() {
    super(AddServiceAction.PATTERN);
  }

  protected async action(session: ProcessMessageSession) {
    const context = session.context;

    if (await this.checkTeamupKey(session))
      return true;

    const manager = new StandManager(context.userProfile);

    const date = this.arg(0).trim();
    const startTime = this.arg(1).trim();
    const endTime = this.arg(2).trim();

    session.sendTextMessage(await manager.addService(date, startTime, endTime));

    return true;
  }
}
