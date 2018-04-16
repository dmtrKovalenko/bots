import BaseAction from "../BaseAction";
import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";

export default class WhoAreYouAction extends BaseAction {
  constructor() {
    super(/^(Кто ты|Ты кто|Как тебя зовут)/i);
  }

  protected async action(session: ProcessMessageSession) {
    session.sendTextMessage(R.ImBot(session.context.botName));
    return true;
  }
}
