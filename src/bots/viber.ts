// tslint:disable-next-line
require("../app");

import * as http from "http";
import { Bot as ViberBot, Events as ViberEvents, Message as ViberMessage } from "viber-bot";
import * as R from "../constants/messages";
import { CustomError } from "../models/Errors";
import Message from "../models/Message";
import UserProfile from "../models/UserProfile";
import { default as Logger, default as logger } from "../services/Logger";
import publicUrl from "../services/PublicUrl";
import { ProcessMessageContext } from "./events/ProcessMessage";
import StandBot from "./StandBot";

const bot = new ViberBot({
  authToken: process.env.VIBER_BOT_TOKEN,
  avatar: null,
  name: "StandBot",
});

bot.onConversationStarted((userProfile: any, isSubscribed: any, context: any, onFinish: any) => {
  Logger.logConversationStarted(new UserProfile(userProfile.id, userProfile.name));
  onFinish(R.HELP);
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

  public handleError = (e: any) => {
    if (e instanceof CustomError) {
      this.sendMessage(e.message);
      return;
    }

    console.log(e);
    logger.trackError(this.userProfile.viber_id!, e);

    this.sendMessage(R.SOMETHING_BROKE);
  }
}

// Start the bot 🚀
publicUrl()
  .then((url) => {
    console.log("Set the new webhook to", url);

    http.createServer(bot.middleware())
      .listen(process.env.VIBER_PORT || 8080, () => {
        bot.setWebhook(url)
          .then(() => console.log("Viber bot has been started"))
          .catch((e: any) => console.log("Viber bot triggered unhandled rejection", e));
      });
  });
