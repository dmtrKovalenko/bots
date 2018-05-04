import ActionStateManager from "../managers/ActionStateManager";
import Logger from "../services/Logger";
import allActions, { Unknown } from "./actions";
import BaseAction from "./actions/BaseAction";
import { ProcessMessageContext } from "./events/ProcessMessage";

export default class StandBot {
  public static async processMessage(context: ProcessMessageContext) {
    const { message, userProfile } = context;
    Logger.trackMessageReceived(message, userProfile);

    const currentAction = ActionStateManager.getCurrentAction(context);

    if (currentAction != null) {
      if (await this.executeAction(context, currentAction)) {
        return true;
      }
    } else {
      for (const action of allActions) {
        if (await this.executeAction(context, action)) {
          return true;
        }
      }
    }

    return Unknown.testAndExecute(context);
  }

  private static async executeAction(context: ProcessMessageContext, action: BaseAction): Promise<boolean> {
    const result = await action.testAndExecute(context);
    if (!result) {
      return false;
    }

    if (!action.isFinished()) {
      ActionStateManager.setCurrentAction(context, action);
    } else {
      ActionStateManager.setCurrentAction(context, null);
    }

    return result;
  }
}
