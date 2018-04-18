import Message from "../../models/Message";
import UserProfile from "../../models/UserProfile";
import IBaseContext from "./IBaseContext";

export abstract class ProcessMessageContext extends IBaseContext {
  public readonly message: Message;
  public readonly userProfile: UserProfile;

  protected constructor(botName: string, message: Message, userProfile: UserProfile) {
    super(botName);

    this.message = message;
    this.userProfile = userProfile;
  }

  public abstract sendMessage(message: string): void;
  public abstract handleError(e: any): void;
}

export class ProcessMessageSession {
  public readonly context: ProcessMessageContext;

  constructor(context: ProcessMessageContext) {
    this.context = context;
  }

  public sendTextMessage(text: string) {
    this.context.sendMessage(text);
   }

  public handleError(e: any) {
    this.context.handleError(e);
  }
}
