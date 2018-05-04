import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import SimpleAction from "../SimpleAction";

export default class ContactsAction extends SimpleAction {
  public regexp = /^Контакты/i;

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.CONTACTS);
    return true;
  }
}
