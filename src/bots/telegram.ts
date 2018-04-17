require('../app')

import * as messages from '../constants/messages';
import TelegramBot from 'node-telegram-bot-api';
import { env } from '../constants/config';
import { CustomError } from '../models/Errors';
import Message from '../models/Message';
import UserProfile from '../models/UserProfile';
import Logger from '../services/Logger';
import PublicUrlService from '../services/PublicUrlService';
import StandBot from './StandBot';
import { ProcessMessageContext } from './events/ProcessMessage';

const token = process.env.TELEGRAM_BOT_TOKEN
if (!token) {
  throw new Error('Telegram token should be provided')
}

const options = {
  polling: env !== 'production',
  // telegram typings :(
  webHook: env === 'production'
    ? { port: process.env.TELEGRAM_PORT, key: '', cert: '',  pfx: ''  }
    : false
}

const bot = new TelegramBot(token, options)

bot.on('message', ({ chat, from, text }) => {
  const userProfile = new UserProfile(`${from.first_name} ${from.last_name}`, from.id, undefined)
  const context = new TelegramProcessMessageContext('StandBot', new Message(text), userProfile, chat)

  StandBot.processMessage(context)
    .catch(context.handleError)
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
    Logger.trackError(this.userProfile.telegram_id!.toString(), e);
    this.sendMessage(messages.SOMETHING_BROKE)
  }
}

if (env === 'production') {
  // Start the bot 🚀
  PublicUrlService.getPublicUrl()
    .then(publicUrl => {
      console.log('Set telegram webhook to', publicUrl);
      bot.setWebHook(`${publicUrl}/bot${token}`)
    });
}
