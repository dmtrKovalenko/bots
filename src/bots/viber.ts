import * as http from 'http'
import { Bot, Message } from 'viber-bot'
import NgrokService from '../services/NgrokService'
import StandManager from '../managers/StandManager'
import * as messages from '../constants/messages'

const bot = new Bot({
  name: 'StandBot',
  authToken: process.env.VIBER_BOT_TOKEN,
  avatar: null
})

const say = (response: any, message: string) => response.send(new Message.Text(message))

const handleError = (response: any) => say(response, messages.SOMETHING_BROKE)

// Bot handlers
bot.onTextMessage(/^Кто (записан|стоит|служит)/i, (message: any, response: any) => {
  say(response, messages.PROCESSING)

  const when = message.text
    .toLowerCase()
    .replace(/^Кто (записан|стоит|служит)/i, '')
    .trim()

  StandManager.getServices(when)
    .then(servicesMsg => say(response, servicesMsg))
    .catch(e => handleError(response))
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
