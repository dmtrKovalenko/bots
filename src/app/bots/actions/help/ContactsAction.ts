import * as R from "../../../../constants/messages";
import { MessageRegexp } from "../BaseAction";
import SimpleAction from "../SimpleAction";

export default class ContactsAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Контакты/i);

  protected execute() {
    this.sendMessage(R.CONTACTS);
  }
}
