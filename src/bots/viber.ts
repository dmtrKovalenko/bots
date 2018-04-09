import * as http from 'https'
import { Bot, Events, Message } from 'viber-bot'

import NgrokService from '../ngrok'

const bot = new Bot({
  authToken: '47aafb46bca7d095-98d0ffb21c6929ee-27a796facd83a86d',
  name: 'StandBot',
  avatar: 'https://pbs.twimg.com/profile_images/2975873011/48c35aea2519cbe64176a4a94285ea12_400x400.png'
})

bot.on(Events.MESSAGE_RECEIVED, (message, response) => {
  response.send(new Message.Text('Hello world'))
})

NgrokService()
  .then(publicUrl => {
    console.log('Set the new webhook to', publicUrl);

    http.createServer(bot.middleware())
      .listen(process.env.PORT || 8080, () => {
        bot.setWebhook(publicUrl)
          .then(() => console.log('Viber bot has been started'))
          .catch(e => console.log('Viber bot triggered unhandled rejection', e))
      });
  })
