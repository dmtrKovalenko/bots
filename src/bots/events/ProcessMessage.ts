import Message from "../../models/Message";
import UserProfile from "../../models/UserProfile";
import IBaseContext from "./IBaseContext";

export abstract class ProcessMessageContext extends IBaseContext {
  public readonly message: Message;
  public readonly userProfile: UserProfile;

  public abstract handleError: (e: any) => void;
  public abstract sendMessage: (message: string) => void;

  protected constructor(botName: string, message: Message, userProfile: UserProfile) {
    super(botName);

    this.message = message;
    this.userProfile = userProfile;
  }
}
