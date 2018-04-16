import * as http from 'http';
import { Bot as ViberBot, Message as ViberMessage, Events as ViberEvents } from 'viber-bot';
import * as messages from '../constants/messages';
import { CustomError } from '../models/Errors';
import Message from "../models/Message";
import UserProfile from "../models/UserProfile";
import logger from '../services/Logger';
import NgrokService from '../services/NgrokService';
import StandBot from './StandBot';
import { ConversationStartedContext } from './events/ConversationStarted';
import { ProcessMessageContext } from './events/ProcessMessage';

const bot = new ViberBot({
  name: 'StandBot',
  authToken: process.env.VIBER_BOT_TOKEN,
  avatar: null
});

bot.onConversationStarted((userProfile: any, isSubscribed: any, context: any, onFinish: any) => {
  StandBot.conversationStarted(new ViberConversationStartedContext(
    bot.name,
    new UserProfile(userProfile.id, userProfile.name),
    onFinish
  ));
});

bot.on(ViberEvents.MESSAGE_RECEIVED, (message: any, response: any) => {
  const { userProfile } = response;

  const profile = new UserProfile(userProfile.id, userProfile.name)
  const context = new ViberProcessMessageContext(bot.name, new Message(message.text), profile, response)

  StandBot.processMessage(context)
    .catch(context.handleError);
});


class ViberProcessMessageContext extends ProcessMessageContext {
  private readonly response: any;

  public constructor(botName: string, message: Message, userProfile: UserProfile, response: any) {
    super(botName, message, userProfile);

    this.response = response;
  }

  sendMessage(message: string): void {
    this.response.send(new ViberMessage.Text(message));
  }

  handleError(e: any): void {
    if (e instanceof CustomError) {
      this.sendMessage(e.message)
      return;
    }

    console.log(e);
    logger.trackError(this.response.userProfile.id, e);

    this.sendMessage(messages.SOMETHING_BROKE)
  }
}

class ViberConversationStartedContext extends ConversationStartedContext {
  private readonly onFinish: any;

  public constructor(botName: string, userProfile: UserProfile, onFinish: any) {
    super(botName, userProfile);

    this.onFinish = onFinish;
  }

  sendMessage(message: string): void {
    this.onFinish(new ViberMessage.Text(message));
  }
}

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
  });
