import { ProcessMessageSession } from "../../events/ProcessMessage";
import StandManager from "../../../managers/StandManager";
import BaseTeamupAction from "./BaseTeamupAction";

export default class GetServicesAction extends BaseTeamupAction {
  regexp = /^Кто (?:записан|стоит|служит) (.+)$/i;

  protected async action(session: ProcessMessageSession) {
    const { userProfile } = session.context;

    const manager = new StandManager(userProfile);

    const processingMessageDelay = this.processingMessageDelay(session);

    if (!await this.checkTeamupKey(session))
      return true;

    const when = this.arg(0).trim();

    const text = await manager.getServices(when);

    processingMessageDelay.cancel();

    session.sendTextMessage(text);

    return true;
  }
}
