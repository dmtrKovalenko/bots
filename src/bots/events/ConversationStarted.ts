import UserProfile from "../../models/UserProfile";
import IBaseContext from "./IBaseContext";

export abstract class ConversationStartedContext extends IBaseContext {
  public readonly userProfile: UserProfile;

  protected constructor(botName: string, userProfile: UserProfile) {
    super(botName);
    this.userProfile = userProfile;
  }

  public abstract sendMessage(message: string): void;
}

export class ConversationStartedSession {
  public readonly context: ConversationStartedContext;

  constructor(context: ConversationStartedContext) {
    this.context = context;
  }

  public sendTextMessage(text: string) {
    this.context.sendMessage(text);
  }
}
