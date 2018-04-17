import { ProcessMessageSession } from "../events/ProcessMessage";
import Delay from "../../utils/Delay";
import * as R from "../../constants/messages";

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

  protected processingMessageDelay(session: ProcessMessageSession) {
    const delay = new Delay(600);
    delay.then(() => session.sendTextMessage(R.PROCESSING));
    return delay;
  }
}
