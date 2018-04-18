import * as R from "../../../constants/messages";
import AuthManager from "../../../managers/AuthManager";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import BaseAction from "../BaseAction";

export default abstract class BaseTeamupAction extends BaseAction {
  protected async checkTeamupKey(session: ProcessMessageSession) {
    const key = await AuthManager.getCalendarKey(session.context.userProfile);
    if (key == null) {
      session.sendTextMessage(R.NEED_SET_KEY);
      return false;
    }

    return true;
  }
}
