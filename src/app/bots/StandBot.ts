import * as R from "constants/messages";
import ActionStateManager from "managers/ActionStateManager";
import { ProcessMessageContext } from "models/ProcessMessageContext";
import Logger from "services/Logger";
import allActions from "./actions";

export default class StandBot {
  public static async processMessage(context: ProcessMessageContext) {
    const { message, userProfile } = context;
    Logger.trackMessageReceived(message, userProfile);

    if (await this.executeCompositeAction(context)) {
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

  private static async executeCompositeAction(context: ProcessMessageContext) {
    const executingSession = await ActionStateManager.getExecutingSession(context.userProfile);
    if (!executingSession) {
      return false;
    }

    const { Action, step, meta } = executingSession;

    if (this.testDiscardMessage(context.message.text)) {
      ActionStateManager.removeActionState(context.userProfile);
      return true;
    }

    const compositeAction = new Action(context);
    await compositeAction.executeStep(step, meta);
    return true;
  }

  private static testDiscardMessage(message: string) {
    return /^(Все|\/Отмена)/i.test(message);
  }
}
