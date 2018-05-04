import * as R from "../../../constants/messages";
import AuthManager from "../../../managers/AuthManager";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import SimpleAction from "../SimpleAction";

export default abstract class BaseTeamupAction extends SimpleAction {
  protected async checkTeamupKey(session: ProcessMessageSession) {
    const key = await AuthManager.getCalendarKey(session.context.userProfile);
    if (key == null) {
      session.sendTextMessage(R.NEED_SET_KEY);
      return false;
    }

    // set teamup key to use after
    session.context.userProfile.teamup_key = key;
    return true;
  }
}
