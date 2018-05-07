import ActionStateManager from "../../../managers/ActionStateManager";
import BaseAction from "../SimpleAction";

export default abstract class CompositeAction<T, K extends object> extends BaseAction {
  public abstract async executeStep(step: T, meta: object): Promise<void>;

  protected setActionStep(step: number, meta: K) {
    const actionKey = this.constructor.name; // get name of class
    return ActionStateManager.setActionState(this.userProfile, actionKey, step, meta);
  }

  protected finishAction() {
    return ActionStateManager.removeActionState(this.userProfile);
  }
}
