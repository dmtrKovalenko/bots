import * as http from 'http';
import { Bot as ViberBot, Message as ViberMessage, Events as ViberEvents } from 'viber-bot';
import * as messages from '../constants/messages';
import { CustomError } from '../models/Errors';
import NgrokService from '../services/NgrokService';
import logger from '../services/Logger';
import StandBot, {ConversationStartedContext, ProcessTextCommandContext} from './StandBot';
import UserProfile from "../models/UserProfile";
import Message from "../models/Message";

const bot = new ViberBot({
  name: 'StandBot',
  authToken: process.env.VIBER_BOT_TOKEN,
  avatar: null
});

const say = (response: any, message: string) => response.send(new ViberMessage.Text(message));

const handleError = (e: any, response: any) => {
  if (e instanceof CustomError) {
    say(response, e.message);
    return;
  }
  console.log(e);
  logger.trackError(response.userProfile.id, e);

  say(response, messages.SOMETHING_BROKE)
};

bot.onConversationStarted((userProfile: any, isSubscribed: any, context: any, onFinish: any) => {
  StandBot.conversationStarted(new ConversationStartedContextImpl(
    bot.name,
    new UserProfile(userProfile.id, userProfile.name),
    onFinish)
  );
});

bot.on(ViberEvents.MESSAGE_RECEIVED, (message: any, response: any) => {
  const userProfile = response.userProfile;

  StandBot.processMessage(new ProcessTextCommandContextImpl(
    bot.name,
    new Message(message.text),
    new UserProfile(userProfile.id, userProfile.name),
    response)
  );
});

class ProcessTextCommandContextImpl extends ProcessTextCommandContext {
  private readonly response: any;

  public constructor(botName: string, message: Message, userProfile: UserProfile, response: any) {
    super(botName, message, userProfile);

    this.response = response;
  }

  sendMessage(message: Message): void {
    say(this.response, message.text);
  }

  handleError(e: any): void {
    handleError(e, this.response);
  }
}

class ConversationStartedContextImpl extends ConversationStartedContext {
  private readonly onFinish: any;

  public constructor(botName: string, userProfile: UserProfile, onFinish: any) {
    super(botName, userProfile);

    this.onFinish = onFinish;
  }

  sendMessage(message: Message): void {
    this.onFinish(new ViberMessage.Text(message.text));
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
