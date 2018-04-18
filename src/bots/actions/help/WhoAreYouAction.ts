import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import BaseAction from "../BaseAction";

export default class WhoAreYouAction extends BaseAction {
  public regexp = /^(Кто ты|Ты кто|Как тебя зовут)/i;

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.ImBot(session.context.botName));
    return true;
  }
}
