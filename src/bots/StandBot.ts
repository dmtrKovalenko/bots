import Logger from "../services/Logger";
import Message from "../models/Message";
import UserProfile from "../models/UserProfile";
import Actions from "./Actions";

export default class StandBot {
  static processMessage(message: Message, userProfile: UserProfile, context: IProcessTextCommandContext) {
    Logger.trackMessageReceived(message, userProfile);

    const session = new ProcessMessageSession(context);
    const actions = Actions.All;
    const unknown = Actions.Unknown;

    for (const action of actions) {
      if (action.test(message) && action.execute(session))
          return true;
    }

    return unknown.execute(session);
  }
}

export class ProcessMessageSession {
  readonly context: IProcessTextCommandContext;

  constructor(context: IProcessTextCommandContext) {
    this.context = context;
  }

  sendTextMessage(text: string) {
    this.context.sendMessage(new Message(text));
  }
}

export abstract class IProcessTextCommandContext {
  public readonly botName: string;

  protected constructor(botName: string) {
    this.botName = botName;
  }

  abstract sendMessage(message: Message): void
}
