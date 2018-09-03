import * as http from "http";
import { Bot as ViberBot, Events as ViberEvents, Message as ViberMessage } from "viber-bot";
import * as R from "../constants/messages";
import Message from "../models/Message";
import UserProfile from "../models/UserProfile";
import { default as Logger } from "../services/Logger";
import publicUrl from "../services/PublicUrl";
import { ProcessMessageContext } from "./events/ProcessMessage";
import StandBot from "./StandBot";

export const bot = new ViberBot({
  authToken: process.env.VIBER_BOT_TOKEN,
  avatar: null,
  name: "StandBot",
});

bot.onConversationStarted((userProfile: any, isSubscribed: any, context: any, onFinish: any) => {
  Logger.logConversationStarted(new UserProfile(userProfile.name, undefined, userProfile.id));
  onFinish(new ViberMessage.Text(R.HELP(bot.name, userProfile.name)));
});

bot.on(ViberEvents.MESSAGE_RECEIVED, (message: any, response: any) => {
  const { userProfile } = response;

  const profile = new UserProfile(userProfile.name, undefined, userProfile.id);
  const context = new ViberProcessMessageContext(bot.name, new Message(message.text), profile, response);

  StandBot
    .processMessage(context)
    .catch(context.handleError);
});

class ViberProcessMessageContext extends ProcessMessageContext {
  private readonly response: any;

  public constructor(botName: string, message: Message, userProfile: UserProfile, response: any) {
    super(botName, message, userProfile);

    this.response = response;
  }

  public sendMessage = (message: string) => {
    this.response.send(new ViberMessage.Text(message));
  }
}

// Start the bot 🚀
if (process.env.START_VIBER === "true") {
  publicUrl().then((url) => {
    console.log("Set the new webhook to", url);

    http.createServer(bot.middleware())
      .listen(process.env.VIBER_PORT || 8080, () => {
        bot.setWebhook(url)
          .then(() => console.log("Viber bot has been started"))
          .catch((e: any) => console.log("Viber bot triggered unhandled rejection", e));
      });
  });
}
