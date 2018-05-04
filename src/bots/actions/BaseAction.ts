import delay from "delay";
import * as R from "../../constants/messages";
import { ProcessMessageSession } from "../events/ProcessMessage";

export default abstract class BaseAction {
  public async testAndExecute(session: ProcessMessageSession): Promise<boolean> {
    if (!this.test(session))
      return false;

    return this.execute(session);
  }

  public abstract test(session: ProcessMessageSession): boolean;
  public abstract execute(session: ProcessMessageSession): Promise<boolean>;

  protected processingMessageDelay(session: ProcessMessageSession) {
    const delayInstance = delay(600);
    delayInstance.then(() => session.sendTextMessage(R.PROCESSING));
    return delayInstance;
  }
}
