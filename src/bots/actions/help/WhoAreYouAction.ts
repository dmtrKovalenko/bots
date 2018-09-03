import * as R from "constants/messages";
import {MessageRegexp} from "../BaseAction";
import SimpleAction from "../SimpleAction";

export default class WhoAreYouAction extends SimpleAction {
  public regexp = new MessageRegexp(/^(Кто ты|Ты кто|Как тебя зовут)/i);

  protected execute() {
    this.sendMessage(R.ImBot(this.context.botName));
  }
}
