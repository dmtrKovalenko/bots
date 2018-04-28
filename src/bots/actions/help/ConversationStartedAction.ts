import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";

import Logger from "../../../services/Logger";
import BaseAction from "../BaseAction";

export default class ConversationStatedAction extends BaseAction {
  public regexp = /^(\/start)/i;

  protected async action(session: ProcessMessageSession) {
    Logger.logConversationStarted(session.context.userProfile);
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));

    return true;
  }
}
