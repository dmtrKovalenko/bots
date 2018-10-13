import { MessageRegexp, SimpleAction } from "bot-core";
import * as R from "../../constants/messages";

export default class WhoAreYouAction extends SimpleAction {
  public regexp = new MessageRegexp(/^(Кто ты|Ты кто|Как тебя зовут)/i);

  protected execute() {
    this.sendMessage(R.I_AM_BOT(this.context.botName));
  }
}
