import { ProcessMessageSession } from "../../events/ProcessMessage";
import SimpleAction from "../SimpleAction";

export default class HelloAction extends SimpleAction {
  public regexp = /^Привет/i;

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(`Привет, ${session.context.userProfile.name} 😉`);

    return true;
  }
}
