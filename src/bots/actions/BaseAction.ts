import delay from "delay";
import * as R from "../../constants/messages";
import Message from "../../models/Message";
import { ProcessMessageContext } from "../events/ProcessMessage";

export default abstract class BaseAction {
  private _context: ProcessMessageContext;
  private notHandled: boolean = false;
  private finished: boolean = false;

  public async testAndExecute(context: ProcessMessageContext): Promise<boolean> {
    this.notHandled = false;
    this.finished = false;
    this._context = context;

    if (!this.test()) {
      return false;
    }

    if (!this.execute || !this.executeAsync) {
      throw new Error("Methods execute or execute async should be implemented");
    }

    await this.preExecute();
    await this.execute ? this.execute() : this.executeLongRunning();
    await this.postExecute();

    return !this.notHandled;
  }

  public isFinished() {
    return this.finished;
  }

  public sendMessage(message: string) {
    this.context.sendMessage(message);
  }

  public markNotHandled() {
    this.notHandled = true;
  }

  public markFinished() {
    this.finished = true;
  }

  get context() {
    return this._context;
  }

  protected get userProfile() {
    return this.context.userProfile;
  }

  protected async executeLongRunning() {
    const _delay = delay(600);
    _delay.then(() => this.sendMessage(R.PROCESSING)).catch();

    await this.executeAsync!();

    try {
      _delay.cancel();
    } catch (e) {
      console.log(e);
    }
  }

  protected abstract test(): boolean | undefined;

  protected async preExecute(): Promise<void> { /* nothing yet */ }
  protected execute?(): void;
  protected async executeAsync?(): Promise<void>;
  protected async postExecute(): Promise<void> { /* nothing yet */ }
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
