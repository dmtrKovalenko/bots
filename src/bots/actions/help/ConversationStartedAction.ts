import * as R from "../../../constants/messages";

import Logger from "../../../services/Logger";
import SimpleAction from "../SimpleAction";
import {MessageRegexp} from "../BaseAction";

export default class ConversationStatedAction extends SimpleAction {
  public regexp = new MessageRegexp(/^(\/start)/i);

  protected async execute() {
    Logger.logConversationStarted(this.userProfile);
    this.sendMessage(R.HELP(this.context.botName, this.userProfile.name));
  }
}
