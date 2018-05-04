import * as R from "../../../constants/messages";
import SimpleAction from "../SimpleAction";

export default class HelpAction extends SimpleAction {
  public regexp = /^(Помощь|\/help)/i;

  protected async action() {
    this.sendMessage(R.HELP(this.context().botName, this.userProfile().name));
  }
}
