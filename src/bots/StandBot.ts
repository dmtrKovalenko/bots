import Logger from "../services/Logger";
import Message from "../models/Message";
import UserProfile from "../models/UserProfile";
import Actions from "./actions/Actions";

export default class StandBot {
  static conversationStarted(context: ConversationStartedContext) {
    const userProfile = context.userProfile;

    Logger.identify(userProfile);
    Logger.trackConversationStarted(userProfile);

    const session = new ConversationStartedSession(context);

    return Actions.ConversationStarted.execute(session);
  }

  static processMessage(context: ProcessTextCommandContext) {
    let message = context.message;

    Logger.trackMessageReceived(message, context.userProfile);

    const session = new ProcessMessageSession(context);
    const actions = Actions.All;
    const unknown = Actions.Unknown;

    for (const action of actions) {
      if (action.testAndExecute(session))
          return true;
    }

    return unknown.execute(session, null);
  }
}

export abstract class IBaseContext {
  public readonly botName: string;

  protected constructor(botName: string) {
    this.botName = botName;
  }
}

export abstract class ProcessTextCommandContext extends IBaseContext {
  readonly message: Message;
  readonly userProfile: UserProfile;

  protected constructor(botName: string, message: Message, userProfile: UserProfile) {
    super(botName);

    this.message = message;
    this.userProfile = userProfile;
  }

  abstract sendMessage(message: Message): void;
  abstract handleError(e: any): void;
}

export class ProcessMessageSession {
  readonly context: ProcessTextCommandContext;

  constructor(context: ProcessTextCommandContext) {
    this.context = context;
  }

  sendTextMessage(text: string) {
    this.context.sendMessage(new Message(text));
  }

  handleError(e: any) {
    this.context.handleError(e);
  }
}

export abstract class ConversationStartedContext extends IBaseContext {
  public readonly userProfile: UserProfile;

  protected constructor(botName: string, userProfile: UserProfile) {
    super(botName);
    this.userProfile = userProfile;
  }

  abstract sendMessage(message: Message): void
}

export class ConversationStartedSession {
  readonly context: ConversationStartedContext;

  constructor(context: ConversationStartedContext) {
    this.context = context;
  }

  sendTextMessage(text: string) {
    this.context.sendMessage(new Message(text));
  }
}
