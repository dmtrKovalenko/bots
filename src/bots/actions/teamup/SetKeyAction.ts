import { ProcessMessageSession } from "../../events/ProcessMessage";
import StandManager from "../../../managers/StandManager";
import BaseTeamupAction from "./BaseTeamupAction";

export default class SetKeyAction extends BaseTeamupAction {
  regexp = /^Мой ключ (.+)$/i

  protected async action(session: ProcessMessageSession) {
    const manager = new StandManager(session.context.userProfile);

    const key = this.arg(0).trim();

    const processingMessageDelay = this.processingMessageDelay(session);

    const text = await manager.authorizeKey(key);

    processingMessageDelay.cancel();

    session.sendTextMessage(text);

    return true;
  }
}
