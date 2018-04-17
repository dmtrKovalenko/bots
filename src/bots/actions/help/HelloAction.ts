import BaseAction from "../BaseAction";
import { ProcessMessageSession } from "../../events/ProcessMessage";

export default class HelloAction extends BaseAction {
  regexp = /^Привет/i

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(`Привет, ${session.context.userProfile.name} 😉`);
    return true;
  }
}
