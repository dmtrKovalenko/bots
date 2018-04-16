import UserProfile from "../models/UserProfile";
import Message from "../models/Message";

const mixpanelKey = process.env.MIXPANEL_KEY;

if (!mixpanelKey) {
  throw new Error('Mixpanel key should be provided')
}

const Mixpanel = require("mixpanel");

const mixpanel = Mixpanel.init(mixpanelKey);

export default class Logger {
  public static track(eventName: string, userId: string | number, traits?: any) {
    const data = {
      distinct_id: userId,
      ...traits
    }

    mixpanel.track(eventName, data)
  }

  public static trackError(userId: string | number, error: any) {
    Logger.track("Error", userId, { error })
  }

  public static identify({ name, telegram_id, viber_id }: UserProfile) {
    mixpanel.people.set(telegram_id || viber_id, {
      $first_name: name
    })
  }

  public static trackConversationStarted({ telegram_id, viber_id }: UserProfile) {
    Logger.track("Conversation started", telegram_id! || viber_id!)
  }

  public static trackMessageReceived(message: Message, { telegram_id, viber_id }: UserProfile) {
    Logger.track("Message received", telegram_id! || viber_id!, { text: message.text })
  }
}
