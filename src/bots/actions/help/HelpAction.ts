import * as R from "../../../constants/messages";
import SimpleAction from "../SimpleAction";
import {MessageRegexp} from "../BaseAction";

export default class HelpAction extends SimpleAction {
  public regexp = new MessageRegexp(/^(Помощь|\/help)/i);

  protected async execute() {
    this.sendMessage(R.HELP(this.context.botName, this.userProfile.name));
  }
}
