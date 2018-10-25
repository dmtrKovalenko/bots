import R from "../messages";
import { CustomError } from "../models/Errors";
import { ILogger } from "../models/ILogger";
import UserProfile from "../models/UserProfile";

export abstract class BaseBot {
  public readonly name: string;
  public abstract sendMessageToChat: (message: string, id: string | number) => void;
  public abstract listen: (createWebhook?: (url: string) => string) => void;

  protected constructor(botName: string, protected readonly logger: ILogger) {
    this.name = botName;
  }

  public handleError = (e: any, userProfile: UserProfile) => {
    console.log(e);
    if (e instanceof CustomError) {
      this.sendMessageToChat(e.message, userProfile.id);
      return;
    }

    this.logger.trackError(userProfile, e);
    this.sendMessageToChat(R.SOMETHING_BROKE, userProfile.id);
  }
}
