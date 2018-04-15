import BaseAction from "../BaseAction";
import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";

export default class WhoAreYouAction extends BaseAction {
  public static readonly PATTERN = /^(Кто ты|Ты кто|Как тебя зовут)/i;

  constructor() {
    super(WhoAreYouAction.PATTERN);
  }

  protected action(session: ProcessMessageSession) {
    session.sendTextMessage(R.ImBot(session.context.botName));
    return true;
  }
}
