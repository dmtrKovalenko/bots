import { ProcessMessageSession } from "../../events/ProcessMessage";
import BaseAction from "../BaseAction";

export default class HelloAction extends BaseAction {
  public regexp = /^Привет/i;

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(`Привет, ${session.context.userProfile.name} 😉`);

    return true;
  }
}
