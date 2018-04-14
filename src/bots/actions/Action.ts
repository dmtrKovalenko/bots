import {ProcessMessageSession} from "../StandBot";
import Message from "../../models/Message";

export default abstract class Action {
  private readonly regexp: RegExp;

  protected constructor(regexp: RegExp) {
    this.regexp = regexp;
  }

  test(message: Message) {
    return this.regexp.test(message.text);
  }

  execute(session: ProcessMessageSession) {
    return this.action(session);
  }

  protected abstract action(session: ProcessMessageSession): boolean;
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
