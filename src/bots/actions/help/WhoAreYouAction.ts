import * as R from "../../../constants/messages";
import SimpleAction from "../SimpleAction";

export default class WhoAreYouAction extends SimpleAction {
  public regexp = /^(Кто ты|Ты кто|Как тебя зовут)/i;

  protected async action() {
    this.sendMessage(R.ImBot(this.context().botName));
  }
}
