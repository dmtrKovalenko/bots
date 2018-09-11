import * as http from "http";
import { Bot as ViberBotApi, Events as ViberEvents, Message as ViberMessage } from "viber-bot";
import { BaseBot } from "./BaseBot";
import { ILogger } from "../models/ILogger";
import ActionExecutor from "../ActionExecutor";
import UserProfile from "../models/UserProfile";
import * as R from '../messages'
import Message from "../models/Message";
import PublicUrl from "../services/PublicUrl";

class ViberBot extends BaseBot {
  private bot: any;

  public constructor(
    token: string | undefined,
    botName: string,
    logger: ILogger,
    private executor: ActionExecutor,
    private port: number = 8080,
  ) {
    super(botName, logger);

    this.bot = new ViberBotApi({
      authToken: token,
      avatar: null,
      name: "StandBot",
    });

    this.subscribeListeners()
  }

  private subscribeListeners() {
    this.bot.onConversationStarted(this.handleConversationStarted)
    this.bot.on(ViberEvents.MESSAGE_RECEIVED, this.handleMessageReceived)
  }

  private handleConversationStarted = (userProfile: any, isSubscribed: any, context: any, onFinish: any) => {
    const profile = new UserProfile(userProfile.name, undefined, userProfile.id);
    this.logger.logConversationStarted(new UserProfile(userProfile.name));

    this.executor.processMessage(this, profile, new Message('/start')) // little hack here :)
  };

  private handleMessageReceived = (message: any, response: any) => {
    const { userProfile } = response;
    const profile = new UserProfile(userProfile.name, undefined, userProfile.id);

    this.executor.processMessage(this, profile, new Message(message.text))
      .catch(e => this.handleError(e, userProfile));
  }

  public sendMessageToChat = (message: string, chatId: string) => {
    this.bot.sendMessage({ id: chatId }, new ViberMessage.Text(message));
  }

  public listen = () => {
    PublicUrl().then((url) => {
      console.log("Set the new webhook to", url);

      http.createServer(this.bot.middleware())
        .listen(this.port, () => {
          this.bot.setWebhook(url)
            .then(() => console.log("Viber bot has been started"))
            .catch((e: any) => console.log("Viber bot triggered unhandled rejection", e));
        });
    });
  }
}

export default ViberBot;
