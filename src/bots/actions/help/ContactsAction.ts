import * as R from "../../../constants/messages";
import SimpleAction from "../SimpleAction";

export default class ContactsAction extends SimpleAction {
  public regexp = /^Контакты/i;

  protected async action() {
    this.sendMessage(R.CONTACTS);
  }
}
