import delay from "delay";
import R from "../messages";
import Message from "../models/Message";
import { ProcessMessageContext } from "../contexts/ProcessMessageContext";
import ActionStateService from "../services/ActionStateService";

export default abstract class BaseAction {
  constructor(
    public readonly context: ProcessMessageContext,
    public readonly actionStateService: ActionStateService
  ) {}

  protected get userProfile() {
    return this.context.userProfile;
  }

  public async testAndExecute() {
    if (!this.test()) {
      return false;
    }

    if (!this.execute && !this.executeAsync) {
      throw new ReferenceError("Methods execute or execute async should be implemented");
    }

    this.execute
      ? await this.execute!()
      : await this.longRunning(this.executeAsync!);

    return true;
  }

  public sendMessage(message: string) {
    this.context.sendMessage(message);
  }

  protected abstract test(): boolean | undefined;
  protected execute?(): void;
  protected async executeAsync?(): Promise<void>;

  protected async longRunning(action: () => Promise<void>) {
    const _delay = delay(600);
    _delay.then(() => this.sendMessage(R.PROCESSING)).catch();

    await action();

    try {
      _delay.clear();
    } catch (e) {
      console.log(e);
    }
  }
}

export class MessageRegexp {
  public constructor(private regexp: RegExp) { }

  public test(message: Message) {
    return this.getRegexpResults(message.text);
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
