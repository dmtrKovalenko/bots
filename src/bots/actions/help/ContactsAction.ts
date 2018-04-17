import BaseAction from "../BaseAction";
import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";

export default class ContactsAction extends BaseAction {
  regexp = /^Контакты/i

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.CONTACTS);
    return true;
  }
}
