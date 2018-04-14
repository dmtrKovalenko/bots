import { ProcessMessageSession } from "../events/ProcessMessage";

export default abstract class BaseAction {
  private readonly regexp: RegExp | null;

  protected constructor(regexp: RegExp | null) {
    this.regexp = regexp;
  }

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
    return this.action(session, args);
  }

  protected abstract action(session: ProcessMessageSession, args: string[] | null): boolean;
}
