import Logger from "../services/Logger";
import allActions, { Unknown, ConversationStarted } from './actions'
import { ConversationStartedSession, ConversationStartedContext } from "./events/ConversationStarted";
import { ProcessMessageSession, ProcessMessageContext} from "./events/ProcessMessage";

export default class StandBot {
  static conversationStarted(context: ConversationStartedContext) {
    const { userProfile } = context;
    const session = new ConversationStartedSession(context);

    Logger.identify(userProfile);
    Logger.trackConversationStarted(userProfile);

    return ConversationStarted.execute(session);
  }

  static async processMessage(context: ProcessMessageContext) {
    const { message, userProfile } = context;
    const session = new ProcessMessageSession(context);

    Logger.trackMessageReceived(message, userProfile);

    for (const action of allActions) {
      if (await action.testAndExecute(session))
          return true;
    }

    return Unknown.execute(session, null);
  }
}
