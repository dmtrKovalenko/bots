import R from "../messages"
import { CustomError } from "../models/Errors";
import IBaseContext from "./IBaseContext";
import Message from "../models/Message";
import UserProfile from "../models/UserProfile";
import { ILogger } from "../models/ILogger";
import { BaseBot } from "../bots/BaseBot";

export class ProcessMessageContext extends IBaseContext {
  public readonly sendMessage: (msg: string) => void;

  constructor(
    bot: BaseBot,
    public readonly userProfile: UserProfile,
    public readonly message: Message,
    private readonly logger: ILogger
  ) {
    super(bot.name);
    this.sendMessage = (msg: string) => bot.sendMessageToChat(msg, userProfile.id)
  }
}
