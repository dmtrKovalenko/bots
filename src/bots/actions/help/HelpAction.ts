import BaseAction from "../BaseAction";
import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";

export default class HelpAction extends BaseAction {
  constructor() {
    super(/^Помощь/i);
  }

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));
    return true;
  }
}
