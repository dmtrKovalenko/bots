import StandManager from "../../../managers/StandManager";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import BaseTeamupAction from "./BaseTeamupAction";

export default class SetKeyAction extends BaseTeamupAction {
  public regexp = /^Мой ключ (.+)$/i;

  protected async action(session: ProcessMessageSession) {
    const processingMessageDelay = this.processingMessageDelay(session);

    const manager = new StandManager(session.context.userProfile);
    const key = this.arg(0).trim();

    session.sendTextMessage(await manager.authorizeKey(key));

    processingMessageDelay.cancel();
    return true;
  }
}
