import TelegramBot from "node-telegram-bot-api";
import { Message } from "viber-bot";

export abstract class Bot {
  public readonly name: string;
  public abstract sendMessageToChat: (message: string, id: string | number) => void;

  protected constructor(botName: string) {
    this.name = botName;
  }
}

export class TelegramStandBot extends Bot {
  public constructor(
    botName: string,
    private readonly bot: TelegramBot,
  ) {
    super(botName);
  }

  public sendMessageToChat = (message: string, chatId: number) => {
    this.bot.sendMessage(chatId, message);
  }
}

export class ViberStandBot extends Bot {
  public constructor(
    private readonly bot: any,
  ) {
    super(bot.name);
  }

  public sendMessageToChat = (message: string, chatId: string) => {
    this.bot.sendMessage({ id: chatId }, new Message.Text(message));
  }

  public sendMessageToPublicChat = (message: string, chatId: string) => {
    this.bot.postToPublicChat({ id: chatId }, new Message.Text(message));
  }
}
