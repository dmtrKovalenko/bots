import SimpleAction from "./SimpleAction";

export default abstract class CompositeAction<T, K extends object> extends SimpleAction {
  public static isComposite = true;
  public abstract async executeStep(step: T, meta: K): Promise<void>;

  protected setActionStep(step: number, meta: K) {
    const actionKey = this.constructor.name; // get name of class
    return this.actionStateService.setActionState(this.userProfile, actionKey, step, meta);
  }

  protected finishAction() {
    return this.actionStateService.removeActionState(this.userProfile);
  }
}
