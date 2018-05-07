import * as R from "../constants/messages";
import ActionStateManager from "../managers/ActionStateManager";
import Logger from "../services/Logger";
import allActions from "./actions";
import CompositeAction from "./actions/composite/CompositeAction";
import { ProcessMessageContext } from "./events/ProcessMessage";

export default class StandBot {
  public static async processMessage(context: ProcessMessageContext) {
    const { message, userProfile } = context;
    Logger.trackMessageReceived(message, userProfile);

    const executingSession = await ActionStateManager.getExecutingSession(userProfile);
    if (executingSession) {
      const { Action, step, meta } = executingSession;
      const compositeAction: CompositeAction<any, any> = new Action(context);

      await compositeAction.executeStep(step, meta);
      return true;
    }

    for (const Action of allActions) {
      const action = new Action(context);
      if (await action.testAndExecute()) {
        return true;
      }
    }

    context.sendMessage(R.UNKNOWN);
    return true;
  }
}
