import StandManager from "../../../managers/StandManager";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import BaseTeamupAction from "./BaseTeamupAction";

export default class GetServicesAction extends BaseTeamupAction {
  public regexp = /^Кто (?:записан|стоит|служит) (.+)$/i;

  protected async action(session: ProcessMessageSession) {
    const { userProfile } = session.context;
    const manager = new StandManager(userProfile);

    if (!await this.checkTeamupKey(session)) {
      return true;
    }

    const processingMessageDelay = this.processingMessageDelay(session);

    const when = this.arg(0).trim();
    session.sendTextMessage(await manager.getServices(when));

    processingMessageDelay.cancel();
    return true;
  }
}
