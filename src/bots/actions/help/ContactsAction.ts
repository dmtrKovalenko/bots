import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import BaseAction from "../BaseAction";

export default class ContactsAction extends BaseAction {
  public regexp = /^Контакты/i;

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.CONTACTS);
    return true;
  }
}
