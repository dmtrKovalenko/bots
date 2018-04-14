import * as http from 'http';
import { Bot, Message, Events } from 'viber-bot';
import * as messages from '../constants/messages';
import StandManager from '../managers/StandManager';
import { CustomError } from '../models/Errors';
import ViberMeta from '../models/ViberMeta';
import NgrokService from '../services/NgrokService';
import logger from '../services/Logger';

const bot = new Bot({
  name: 'StandBot',
  authToken: process.env.VIBER_BOT_TOKEN,
  avatar: null
})

const say = (response: any, message: string) => response.send(new Message.Text(message))

const handleError = (e: any, response: any) => {
  if (e instanceof CustomError) {
    say(response, e.message)
    return;
  }
  console.log(e)
  logger.trackError(response.userProfile.id, e)

  say(response, messages.SOMETHING_BROKE)
}

bot.onConversationStarted((userProfile: any, isSubscribed: any, context: any, onFinish: any) => {
  logger.identify(userProfile.id, userProfile.name)

  logger.trackConversationStarted(userProfile)

  onFinish(new Message.Text(messages.HELP(bot.name, userProfile.name)))
})

bot.on(Events.MESSAGE_RECEIVED, (message: any, response: any) => {
  logger.trackMessageReceived(message, response.userProfile)
})

bot.onTextMessage(/^(Кто ты|Ты кто|Как тебя зовут|Привет)/i, (message: any, response: any) => {
  say(response, messages.IM(bot.name))
})

// Bot handlers
bot.onTextMessage(/^Помощь/i, (message: any, response: any) => {
  say(response, messages.HELP(bot.name, response.userProfile.name))
})

bot.onTextMessage(/^Контакты/i, (message: any, response: any) => {
  say(response, messages.CONTACTS)
})

bot.onTextMessage(/^Мой ключ/i, (message: any, response: any) => {
  const manager = new StandManager(new ViberMeta(message, response))

  const userId = response.userProfile.id
  const key = message.text
    .replace(/^Мой ключ/i, '')
    .trim()

  manager.authorizeKey(userId, key)
    .then(message => say(response, message))
    .catch(e => handleError(e, response))
})

bot.onTextMessage(/^Кто (записан|стоит|служит)/i, (message: any, response: any) => {
  say(response, messages.PROCESSING)
  const manager = new StandManager(new ViberMeta(message, response))

  const when = message.text
    .toLowerCase()
    .replace(/^Кто (записан|стоит|служит)/i, '')
    .trim()

  manager.getServices(when)
    .then(servicesMsg => say(response, servicesMsg))
    .catch(e => handleError(e, response))
})

bot.onTextMessage(/^Запиши меня .{1,20} с \d{2}:\d{2} до \d{2}:\d{2}/im, (message: any, response: any) => {
  say(response, messages.PROCESSING)
  const manager = new StandManager(new ViberMeta(message, response))

  const userName = response.userProfile.name;
  const [date, startTime, endTime] = message.text
    .toLowerCase()
    .replace(/^Запиши меня/i, '')
    .trim()
    .split(/\s*до\s*|\s*с\s*/)

  manager.addService(userName, date, startTime, endTime)
    .then(message => say(response, message))
    .catch(e => handleError(e, response))
})

// Start the bot 🚀
NgrokService.getPublicUrl()
  .then(publicUrl => {
    console.log('Set the new webhook to', publicUrl);

    http.createServer(bot.middleware())
      .listen(process.env.PORT || 8080, () => {
        bot.setWebhook(publicUrl)
          .then(() => console.log('Viber bot has been started'))
          .catch((e: any) => console.log('Viber bot triggered unhandled rejection', e))
      });
  })
