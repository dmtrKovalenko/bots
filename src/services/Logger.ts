import { User } from "node-telegram-bot-api";
import Message from "../models/Message";
import UserProfile from "../models/UserProfile";

// tslint:disable-next-line
const Mixpanel = require('mixpanel')
const mixpanelKey = process.env.MIXPANEL_KEY;

if (!mixpanelKey) {
  throw new Error("Mixpanel key should be provided");
}

const mixpanel = Mixpanel.init(mixpanelKey);

export default class Logger {
  public static track(eventName: string, userId: string | number, traits?: any) {
    const data = {
      distinct_id: userId,
      ...traits,
    };

    mixpanel.track(eventName, data);
  }

  public static trackError(userId: string | number, error: any) {
    Logger.track("Error", userId, { error });
  }

  public static logConversationStarted(userProfile: UserProfile) {
    this.identify(userProfile);
    this.trackConversationStarted(userProfile);
  }

  public static identify({ name, telegram_id, viber_id }: UserProfile) {
    mixpanel.people.set(telegram_id || viber_id, {
      $first_name: name,
    });
  }

  public static trackConversationStarted({ telegram_id, viber_id }: UserProfile) {
    Logger.track("Conversation started", telegram_id! || viber_id!);
  }

  public static trackMessageReceived(message: Message, { telegram_id, viber_id }: UserProfile) {
    Logger.track("Message received", telegram_id! || viber_id!, { text: message.text });
  }
}
