import * as R from "../../constants/messages";
import { ProcessMessageSession } from "../events/ProcessMessage";
import BaseAction from "./BaseAction";

export default class UnknownAction extends BaseAction {
  public regexp = null;

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.UNKNOWN);
    return true;
  }
}
