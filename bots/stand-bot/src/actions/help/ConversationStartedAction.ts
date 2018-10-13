import * as R from "../../constants/messages";

import { MessageRegexp, SimpleAction } from "bot-core";
import Logger from "../../services/Logger";

export default class ConversationStatedAction extends SimpleAction {
  public regexp = new MessageRegexp(/^(\/start)/i);

  protected execute() {
    Logger.logConversationStarted(this.userProfile);
    this.sendMessage(R.HELP(this.context.botName, this.userProfile.name));
  }
}
