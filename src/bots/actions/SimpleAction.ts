import BaseAction from "./BaseAction";
import {ProcessMessageContext} from "../events/ProcessMessage";

export default abstract class SimpleAction extends BaseAction {
  protected abstract regexp: RegExp | null;
  private args: string[] | null;

  test(context: ProcessMessageContext): boolean {
    return this.getRegexpResults(context) != null;
  }

  public async execute(context: ProcessMessageContext): Promise<boolean> {
    const regexpResults = this.getRegexpResults(context);

    if (regexpResults == null) {
      return false;
    }

    regexpResults.shift();
    return super.execute(context);
  }

  protected arg(index: number) {
    if (this.args == null) {
      throw new Error("Args is null");
    }

    return this.args[index];
  }

  private getRegexpResults(context: ProcessMessageContext): RegExpExecArray | null {
    const message = context.message;

    if (this.regexp == null) {
      throw new Error("Regexp cannot be null");
    }

    return this.regexp.exec(message.text);
  }
}
