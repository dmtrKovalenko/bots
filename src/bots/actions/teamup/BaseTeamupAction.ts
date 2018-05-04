import * as R from "../../../constants/messages";
import AuthManager from "../../../managers/AuthManager";
import SimpleAction from "../SimpleAction";

export default abstract class BaseTeamupAction extends SimpleAction {
  // noinspection JSMethodCanBeStatic
  protected async checkTeamupKey() {
    const key = await AuthManager.getCalendarKey(this.userProfile);
    if (key == null) {
      this.sendMessage(R.NEED_SET_KEY);
      return false;
    }

    // set teamup key to use after
    this.userProfile.teamup_key = key;
    return true;
  }
}
