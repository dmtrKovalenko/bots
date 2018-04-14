import {ProcessMessageSession} from "./StandBot";
import Message from "../models/Message";

export default class Action {
  regexp: RegExp;
  action: (session: ProcessMessageSession) => boolean;

  constructor(regexp: RegExp, action: (session: ProcessMessageSession) => boolean) {
    this.regexp = regexp;
    this.action = action;
  }

  test(message: Message) {
    return this.regexp.test(message.text);
  }

  execute(session: ProcessMessageSession) {
    return this.action(session);
  }
}
