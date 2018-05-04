import * as R from "../../../constants/messages";
import SimpleAction from "../SimpleAction";
import {MessageRegexp} from "../BaseAction";

export default class ContactsAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Контакты/i);

  protected async execute() {
    this.sendMessage(R.CONTACTS);
  }
}
