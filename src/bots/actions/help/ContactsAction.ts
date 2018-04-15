import BaseAction from "../BaseAction";
import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";

export default class ContactsAction extends BaseAction {
  public static readonly PATTERN = /^Контакты/i;

  constructor() {
    super(ContactsAction.PATTERN);
  }

  protected action(session: ProcessMessageSession) {
    session.sendTextMessage(R.CONTACTS);
    return Promise.resolve(true);
  }
}
