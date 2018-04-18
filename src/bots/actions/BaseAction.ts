import delay from "delay";
import * as R from "../../constants/messages";
import { ProcessMessageSession } from "../events/ProcessMessage";

export default abstract class BaseAction {
  protected abstract regexp: RegExp | null;
  private args: string[] | null;

  public testAndExecute(session: ProcessMessageSession) {
    const message = session.context.message;

    if (this.regexp == null) {
      throw new Error("Regexp cannot be null");
    }

    const regexpResults = this.regexp.exec(message.text);

    if (regexpResults == null) {
      return false;
    }

    regexpResults.shift();
    return this.execute(session, regexpResults);
  }

  public execute(session: ProcessMessageSession, args: string[] | null) {
    this.args = args;
    return this.action(session);
  }

  protected abstract action(session: ProcessMessageSession): Promise<boolean>;

  protected arg(index: number) {
    if (this.args == null) {
      throw new Error("Args is null");
    }

    return this.args[index];
  }

  protected processingMessageDelay(session: ProcessMessageSession) {
    const delayInstance = delay(600);
    delayInstance.then(() => session.sendTextMessage(R.PROCESSING));
    return delayInstance;
  }
}
