import Logger from "../services/Logger";
import allActions, { Unknown } from "./actions";
import { ProcessMessageContext } from "./events/ProcessMessage";

export default class StandBot {
  public static async processMessage(context: ProcessMessageContext) {
    const { message, userProfile } = context;

    Logger.trackMessageReceived(message, userProfile);

    for (const action of allActions) {
      if (await action.testAndExecute(context)) {
        return true;
      }
    }

    return Unknown.execute(context);
  }
}
