import * as R from "../../../../constants/messages";

import Logger from "../../../../services/Logger";
import {MessageRegexp} from "../BaseAction";
import SimpleAction from "../SimpleAction";

export default class ConversationStatedAction extends SimpleAction {
  public regexp = new MessageRegexp(/^(\/start)/i);

  protected execute() {
    Logger.logConversationStarted(this.userProfile);
    this.sendMessage(R.HELP(this.context.botName, this.userProfile.name));
  }
}
