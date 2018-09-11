import TelegramBot from "node-telegram-bot-api";
import { CustomError } from "../models/Errors";
import UserProfile from "../models/UserProfile";
import { ILogger } from "../models/ILogger";
import R from '../messages'

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

