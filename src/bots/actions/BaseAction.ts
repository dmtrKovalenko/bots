import delay from "delay";
import * as R from "../../constants/messages";
import {ProcessMessageContext} from "../events/ProcessMessage";

export default abstract class BaseAction {
  private _context: ProcessMessageContext;
  private notHandled: boolean;

  public async testAndExecute(context: ProcessMessageContext): Promise<boolean> {
    if (!this.test(context)) {
      return false;
    }

    return this.execute(context);
  }

  public abstract test(context: ProcessMessageContext): boolean;
  public async execute(context: ProcessMessageContext): Promise<boolean> {
    this._context = context;
    await this.action();
    return !this.notHandled;
  }

  protected abstract action(): Promise<void>;

  protected context() {
    return this._context;
  }

  protected userProfile() {
    return this.context().userProfile;
  }

  protected async longRunningOperation(action: () => Promise<void>) {
    const _delay = delay(600);
    _delay.then(() => this.sendMessage(R.PROCESSING));

    await action();

    _delay.cancel();
  }

  protected sendMessage(message: string) {
    this.context().sendMessage(message);
  }

  // noinspection JSUnusedGlobalSymbols
  protected markNotHandled() {
    this.notHandled = true;
  }
}
