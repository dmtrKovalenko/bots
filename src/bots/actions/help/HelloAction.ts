import BaseAction from "../BaseAction";
import {ProcessMessageSession} from "../../events/ProcessMessage";

export default class HelloAction extends BaseAction {
  constructor() {
    super(/^Привет/i);
  }

  protected action(session: ProcessMessageSession) {
    session.sendTextMessage(`Привет, ${session.context.userProfile.name} 😉`);
    return true;
  }
}
