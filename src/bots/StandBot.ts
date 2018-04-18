import Logger from "../services/Logger";
import allActions, { ConversationStarted, Unknown } from "./actions";
import { ConversationStartedContext, ConversationStartedSession } from "./events/ConversationStarted";
import { ProcessMessageContext, ProcessMessageSession} from "./events/ProcessMessage";

export default class StandBot {
  public static conversationStarted(context: ConversationStartedContext) {
    const { userProfile } = context;
    const session = new ConversationStartedSession(context);

    Logger.identify(userProfile);
    Logger.trackConversationStarted(userProfile);

    return ConversationStarted.execute(session);
  }

  public static async processMessage(context: ProcessMessageContext) {
    const { message, userProfile } = context;
    const session = new ProcessMessageSession(context);

    Logger.trackMessageReceived(message, userProfile);

    for (const action of allActions) {
      if (await action.testAndExecute(session)) {
          return true;
      }
    }

    return Unknown.execute(session, null);
  }
}
