import IBaseContext from "./IBaseContext";
import UserProfile from "../../models/UserProfile";
import Message from "../../models/Message";

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
