import { MessageRegexp, SimpleAction } from "bot-core";
import * as R from "../../constants/messages";

export default class HelpAction extends SimpleAction {
  public regexp = new MessageRegexp(/^(Помощь|\/help)/i);

  protected execute() {
    this.sendMessage(R.HELP(this.context.botName, this.userProfile.name));
  }
}
