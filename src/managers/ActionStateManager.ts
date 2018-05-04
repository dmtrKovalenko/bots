import BaseAction from "../bots/actions/BaseAction";
import {ProcessMessageContext} from "../bots/events/ProcessMessage";

export default class ActionStateManager {
  public static getCurrentAction(context: ProcessMessageContext): BaseAction | null {
    const action = this.actions.get(this.getKey(context));
    return action !== undefined ? action : null;
  }

  public static setCurrentAction(context: ProcessMessageContext, action: BaseAction | null) {
    const key = this.getKey(context);
    if (action != null) {
      this.actions.set(key, action);
    } else {
      this.actions.delete(key);
    }
  }

  private static actions: Map<string, BaseAction> = new Map<string, BaseAction>();

  private static getKey(context: ProcessMessageContext) {
    return `${context.userProfile.viber_id}/${context.userProfile.telegram_id}`;
  }
}
