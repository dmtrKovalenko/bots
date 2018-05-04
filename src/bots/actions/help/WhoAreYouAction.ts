import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import SimpleAction from "../SimpleAction";

export default class WhoAreYouAction extends SimpleAction {
  public regexp = /^(Кто ты|Ты кто|Как тебя зовут)/i;

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.ImBot(session.context.botName));
    return true;
  }
}
