import Message from "../models/Message";
import UserProfile from "../models/UserProfile";

const mixpanelKey = process.env.MIXPANEL_KEY;

if (!mixpanelKey) {
  throw new Error('Mixpanel key should be provided')
}

const Mixpanel = require("mixpanel");

const mixpanel = Mixpanel.init(mixpanelKey);

export default class Logger {
  public static track(eventName: string, userId: string, traits?: any) {
    const data = Object.assign(
      {distinct_id: userId},
      traits
    );

    mixpanel.track(eventName, data)
  }

  public static trackError(userId: string, error: any) {
    Logger.track("Error", userId, {error: error})
  }

  public static identify(userProfile: UserProfile) {
    mixpanel.people.set(userProfile.id, {
      $first_name: userProfile.name
    })
  }

  public static trackConversationStarted(userProfile: UserProfile) {
    Logger.track("Conversation started", userProfile.id)
  }

  public static trackMessageReceived(message: Message, userProfile: UserProfile) {
    Logger.track("Message received", userProfile.id, {text: message.text})
  }
}
