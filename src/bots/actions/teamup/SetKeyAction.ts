import { ProcessMessageSession } from "../../events/ProcessMessage";
import StandManager from "../../../managers/StandManager";
import BaseTeamupAction from "./BaseTeamupAction";

export default class SetKeyAction extends BaseTeamupAction {
  constructor() {
    super(/^Мой ключ (.+)$/i);
  }

  protected async action(session: ProcessMessageSession) {
    const manager = new StandManager(session.context.userProfile);

    const key = this.arg(0).trim();

    session.sendTextMessage(await manager.authorizeKey(key));

    return true;
  }
}
