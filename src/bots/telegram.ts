import TelegramBot from 'node-telegram-bot-api'
import StandBot from './StandBot';
import { ProcessMessageContext } from './events/ProcessMessage';
import UserProfile from '../models/UserProfile';
import Message from '../models/Message';
import Logger from '../services/Logger';
import { CustomError } from '../models/Errors';
import * as messages from '../constants/messages';

const token = process.env.TELEGRAM_BOT_TOKEN
if (!token) {
  throw new Error('Telegram token should be provided')
}

const bot = new TelegramBot(token, { polling: true })

bot.on('message', ({ chat, from, text }) => {
  const userProfile = new UserProfile(from.id.toString(), `${from.first_name} ${from.last_name}`)
  const context = new TelegramProcessMessageContext('StandBot', new Message(text), userProfile, chat)

  StandBot.processMessage(context)
});

class TelegramProcessMessageContext extends ProcessMessageContext {
  private readonly chat: any;

  public constructor(botName: string, message: Message, userProfile: UserProfile, chat: any) {
    super(botName, message, userProfile);

    this.chat = chat;
  }

  sendMessage(message: string): void {
    bot.sendMessage(this.chat.id, message);
  }

  handleError(e: any): void {
    if (e instanceof CustomError) {
      this.sendMessage(e.message);
      return;
    }

    console.log(e);
    Logger.trackError(this.userProfile.id, e);

    this.sendMessage(messages.SOMETHING_BROKE)
  }
}
