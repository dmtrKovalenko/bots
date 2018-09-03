import * as R from "../../constants/messages";
import { CustomError } from "../../models/Errors";
import Message from "../../models/Message";
import UserProfile from "../../models/UserProfile";
import Logger from "../../services/Logger";
import IBaseContext from "./IBaseContext";

export abstract class ProcessMessageContext extends IBaseContext {
  public readonly message: Message;
  public readonly userProfile: UserProfile;

  public abstract sendMessage: (message: string) => void;

  protected constructor(botName: string, message: Message, userProfile: UserProfile) {
    super(botName);

    this.message = message;
    this.userProfile = userProfile;
  }

  public handleError = (e: any) => {
    if (e instanceof CustomError) {
      this.sendMessage(e.message);
      return;
    }

    console.log(e);
    Logger.trackError(this.userProfile, e);

    this.sendMessage(R.SOMETHING_BROKE);
  }
}
