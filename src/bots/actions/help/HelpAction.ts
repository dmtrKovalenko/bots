import * as R from "../../../constants/messages";
import {MessageRegexp} from "../BaseAction";
import SimpleAction from "../SimpleAction";

export default class HelpAction extends SimpleAction {
  public regexp = new MessageRegexp(/^(Помощь|\/help)/i);

  protected async execute() {
    this.sendMessage(R.HELP(this.context.botName, this.userProfile.name));
  }
}
