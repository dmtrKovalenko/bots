import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import BaseAction from "../BaseAction";

export default class HelpAction extends BaseAction {
  public regexp = /^(Помощь|\/start|\/help)/i;

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));
    return true;
  }
}
