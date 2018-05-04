import * as R from "../../../constants/messages";
import SimpleAction from "../SimpleAction";
import {MessageRegexp} from "../BaseAction";

export default class WhoAreYouAction extends SimpleAction {
  public regexp = new MessageRegexp(/^(Кто ты|Ты кто|Как тебя зовут)/i);

  protected async execute() {
    this.sendMessage(R.ImBot(this.context.botName));
  }
}
