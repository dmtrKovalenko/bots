import { MessageRegexp, SimpleAction } from "bot-core";
import * as R from "../../constants/messages";

export default class ContactsAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Контакты/i);

  protected execute() {
    this.sendMessage(R.CONTACTS);
  }
}
