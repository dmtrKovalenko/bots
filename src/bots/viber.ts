import * as http from 'http'
import { Bot, Events, Message } from 'viber-bot'
import NgrokService from '../services/NgrokService'
import StandManager from '../managers/StandManager'

const bot = new Bot({
  name: 'StandBot',
  authToken: process.env.VIBER_BOT_TOKEN,
  avatar: null
})

const say = (response: any, message: string) => response.send(new Message.Text(message))

bot.onTextMessage(/^Кто записан сегодня$/i, (message: string, response: any) => {
  StandManager.getTodayServices()
    .then(servicesMsg => say(response, servicesMsg))
})

// Start the bot 🚀
NgrokService.getPublicUrl()
  .then(publicUrl => {
    console.log('Set the new webhook to', publicUrl);

    http.createServer(bot.middleware())
      .listen(process.env.PORT || 8080, () => {
        bot.setWebhook(publicUrl)
          .then(() => console.log('Viber bot has been started'))
          .catch(e => console.log('Viber bot triggered unhandled rejection', e))
      });
  })
