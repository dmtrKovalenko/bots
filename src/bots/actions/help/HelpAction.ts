import BaseAction from "../BaseAction";
import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";

export default class HelpAction extends BaseAction {
  public static readonly PATTERN = /^Помощь/i;

  constructor() {
    super(HelpAction.PATTERN);
  }

  protected action(session: ProcessMessageSession) {
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));
    return true;
  }
}
