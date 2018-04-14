import * as R from "../constants/messages";
import {ProcessMessageSession} from "./StandBot";
import Action from "./Action";

export default class Actions {
  private static whoAreYou(session: ProcessMessageSession) {
    session.sendTextMessage(R.ImBot(session.context.botName));
    return true;
  };

  private static unknown(session: ProcessMessageSession) {
    session.sendTextMessage(R.UNKNOWN);
    return true;
  };

  static readonly WhoAreYou = new Action(/^(Кто ты|Ты кто|Как тебя зовут|Привет)/i, Actions.whoAreYou);

  static readonly All = [
    Actions.WhoAreYou
  ];

  static readonly Unknown = new Action(/^\*/, Actions.unknown);
}
