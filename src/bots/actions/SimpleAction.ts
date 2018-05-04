import BaseAction from "./BaseAction";
import {ProcessMessageSession} from "../events/ProcessMessage";

export default abstract class SimpleAction extends BaseAction {
  protected abstract regexp: RegExp | null;
  private args: string[] | null;

  test(session: ProcessMessageSession): boolean {
    return this.getRegexpResults(session) != null;
  }

  public async execute(session: ProcessMessageSession): Promise<boolean> {
    const regexpResults = this.getRegexpResults(session);

    if (regexpResults == null) {
      return false;
    }

    regexpResults.shift();
    return this.action(session);
  }

  protected abstract action(session: ProcessMessageSession): Promise<boolean>;

  protected arg(index: number) {
    if (this.args == null) {
      throw new Error("Args is null");
    }

    return this.args[index];
  }

  private getRegexpResults(session: ProcessMessageSession): RegExpExecArray | null {
    const message = session.context.message;

    if (this.regexp == null) {
      throw new Error("Regexp cannot be null");
    }

    return this.regexp.exec(message.text);
  }
}
