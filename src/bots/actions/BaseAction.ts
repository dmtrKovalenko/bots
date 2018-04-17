import { ProcessMessageSession } from "../events/ProcessMessage";

export default abstract class BaseAction {
  private args: string[] | null;
  protected abstract regexp: RegExp | null;

  testAndExecute(session: ProcessMessageSession) {
    const message = session.context.message;

    if (this.regexp == null)
      throw new Error("Regexp cannot be null");

    const regexpResults = this.regexp.exec(message.text);

    if (regexpResults == null)
      return false;

    regexpResults.shift();

    return this.execute(session, regexpResults);
  }

  execute(session: ProcessMessageSession, args: string[] | null) {
    this.args = args;
    return this.action(session);
  }

  protected abstract action(session: ProcessMessageSession): Promise<boolean>;

  protected arg(index: number) {
    if (this.args == null)
      throw new Error("Args is null");

    return this.args[index];
  }
}
