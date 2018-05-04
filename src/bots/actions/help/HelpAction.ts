import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import SimpleAction from "../SimpleAction";

export default class HelpAction extends SimpleAction {
  public regexp = /^(Помощь|\/help)/i;

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));
    return true;
  }
}
