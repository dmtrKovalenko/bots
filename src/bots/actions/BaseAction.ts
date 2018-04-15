import { ProcessMessageSession } from "../events/ProcessMessage";

export default abstract class BaseAction {
  private readonly regexp: RegExp | null;

  protected constructor(regexp: RegExp | null) {
    this.regexp = regexp;
  }

  private args: string[] | null;

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

  execute(session: ProcessMessageSession, args: string[] | null): Promise<boolean> {
    this.args = args;
    let result = this.action(session);
    if (typeof result == typeof true)
      return Promise.resolve(result);
    else
      return result as Promise<boolean>;
  }

  protected abstract action(session: ProcessMessageSession): boolean | Promise<boolean>;

  protected arg(index: number) {
    if (this.args == null)
      throw new Error("Args is null");

    return this.args[index];
  }
}
