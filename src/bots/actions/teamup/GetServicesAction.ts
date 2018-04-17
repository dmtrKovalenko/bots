import { ProcessMessageSession } from "../../events/ProcessMessage";
import StandManager from "../../../managers/StandManager";
import BaseTeamupAction from "./BaseTeamupAction";

export default class GetServicesAction extends BaseTeamupAction {
  regexp = /^Кто (?:записан|стоит|служит) (.+)$/i;

  protected async action(session: ProcessMessageSession) {
    const userProfile = session.context.userProfile;

    if (!await this.checkTeamupKey(session))
      return true;

    const when = this.arg(0).trim();

    const manager = new StandManager(userProfile);

    session.sendTextMessage(await manager.getServices(when));

    return true;
  }
}
