import * as R from "../../constants/messages";
import { ProcessMessageSession } from "../events/ProcessMessage";
import SimpleAction from "./SimpleAction";

export default class UnknownAction extends SimpleAction {
  public regexp = null;

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.UNKNOWN);
    return true;
  }
}
