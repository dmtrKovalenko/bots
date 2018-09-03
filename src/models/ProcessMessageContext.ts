import * as R from "../constants/messages";
import Logger from "../services/Logger";
import { Bot } from "./Bots";
import { CustomError } from "./Errors";
import IBaseContext from "./IBaseContext";
import Message from "./Message";
import UserProfile from "./UserProfile";

export class ProcessMessageContext extends IBaseContext {
  constructor(
    bot: Bot,
    public readonly userProfile: UserProfile,
    public readonly message: Message,
    public readonly sendMessage: (message: string) => void,
  ) {
    super(bot.name);
  }

  public handleError = (e: any) => {
    console.log(e);
    if (e instanceof CustomError) {
      this.sendMessage(e.message);
      return;
    }

    Logger.trackError(this.userProfile, e);
    this.sendMessage(R.SOMETHING_BROKE);
  }
}
