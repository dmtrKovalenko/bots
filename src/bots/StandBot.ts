import Logger from "../services/Logger";
import allActions, { Unknown } from "./actions";
import { ProcessMessageContext, ProcessMessageSession} from "./events/ProcessMessage";

export default class StandBot {
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
