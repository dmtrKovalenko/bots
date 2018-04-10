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

bot.onTextMessage(/^Кто записан/i, (message: any, response: any) => {
  const when = message.text.replace('Кто записан', '').trim().toLowerCase()

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
          .catch(e => console.log('Viber bot triggered unhandled rejection', e))
      });
  })
