import {ProcessMessageSession} from "../StandBot";

export default abstract class Action {
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

export class SimpleAction extends Action {
  private readonly _action: (session: ProcessMessageSession) => boolean;

  public constructor(regexp: RegExp, action: (session: ProcessMessageSession) => boolean) {
    super(regexp);

    this._action = action;
  }

  protected action(session: ProcessMessageSession): boolean {
    return this._action(session);
  }
}
