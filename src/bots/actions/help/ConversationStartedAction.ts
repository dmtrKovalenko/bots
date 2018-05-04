import * as R from "../../../constants/messages";

import Logger from "../../../services/Logger";
import SimpleAction from "../SimpleAction";

export default class ConversationStatedAction extends SimpleAction {
  public regexp = /^(\/start)/i;

  protected async action() {
    Logger.logConversationStarted(this.userProfile());
    this.sendMessage(R.HELP(this.context().botName, this.userProfile().name));
  }
}
