import { BaseBot } from "../bots/BaseBot";
import R from "../messages";
import { CustomError } from "../models/Errors";
import { ILogger } from "../models/ILogger";
import Message from "../models/Message";
import UserProfile from "../models/UserProfile";
import IBaseContext from "./IBaseContext";

export class ProcessMessageContext extends IBaseContext {
  public readonly sendMessage: (msg: string) => void;

  constructor(
    bot: BaseBot,
    public readonly userProfile: UserProfile,
    public readonly message: Message,
    private readonly logger: ILogger,
  ) {
    super(bot.name);
    this.sendMessage = (msg: string) => bot.sendMessageToChat(msg, userProfile.id);
  }
}
