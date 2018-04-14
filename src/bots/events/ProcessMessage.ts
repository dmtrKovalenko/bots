import IBaseContext from "./IBaseContext";
import Message from "../../models/Message";
import UserProfile from "../../models/UserProfile";

export abstract class ProcessMessageContext extends IBaseContext {
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
  readonly context: ProcessMessageContext;

  constructor(context: ProcessMessageContext) {
    this.context = context;
  }

  sendTextMessage(text: string) {
    this.context.sendMessage(new Message(text));
  }

  handleError(e: any) {
    this.context.handleError(e);
  }
}
