import delay from "delay";
import * as R from "../../constants/messages";
import Message from "../../models/Message";
import { ProcessMessageContext } from "../events/ProcessMessage";

export default abstract class BaseAction {
  private _context: ProcessMessageContext;
  private notHandled: boolean = false;
  private finished: boolean = false;

  public async testAndExecute(context: ProcessMessageContext): Promise<boolean> {
    this._context = context;

    if (this.test() === false) {
      return false;
    }

    await this.preExecute();
    await this.execute();

    return !this.notHandled;
  }

  public isFinished() {
    return this.finished;
  }

  protected test(): boolean | undefined {
    return undefined;
  }

  protected async preExecute(): Promise<void> { /* nothing yet */ }
  protected abstract execute(): Promise<void>;

  protected get context() {
    return this._context;
  }

  protected get userProfile() {
    return this.context.userProfile;
  }

  protected async longRunningOperation(action: () => Promise<void>) {
    try {
      const _delay = delay(600);
      _delay.then(() => this.sendMessage(R.PROCESSING)).catch();

      await action();

      _delay.cancel();
    } catch (e) {
      e.toString();
    }
  }

  protected sendMessage(message: string) {
    this.context.sendMessage(message);
  }

  protected markNotHandled() {
    this.notHandled = true;
  }

  protected markFinished() {
    this.finished = true;
  }
}

export class MessageRegexp {
  public constructor(private regexp: RegExp) { }

  public test(message: Message): boolean {
    return this.getRegexpResults(message.text) != null;
  }

  public execute(message: Message): RegExpExecArray {
    const regexpResults = this.getRegexpResults(message.text);

    if (regexpResults == null) {
      throw new Error("Regexp expression does not match the message!");
    }

    return regexpResults;
  }

  private getRegexpResults(message: string): RegExpExecArray | null {
    const results = this.regexp.exec(message);
    if (results == null) {
      return null;
    }

    if (results != null) {
      results.shift();
    }

    return results;
  }
}
