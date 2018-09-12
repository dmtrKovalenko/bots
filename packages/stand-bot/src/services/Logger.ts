import { UserProfile } from "bot-core";
import Message from "bot-core/build/models/Message";
import Mixpanel from "mixpanel";

const mixpanelKey = process.env.MIXPANEL_KEY;
if (!mixpanelKey) {
  throw new Error("Mixpanel key should be provided");
}

const mixpanel = Mixpanel.init(mixpanelKey);

export default class Logger {
  public static logConversationStarted(userProfile: UserProfile) {
    this.identify(userProfile);
    this.trackConversationStarted(userProfile);
  }

  public static identify({ name, telegram_id, viber_id }: UserProfile) {
    mixpanel.people.set((telegram_id || viber_id) as string, {
      $first_name: name,
    });
  }

  public static trackConversationStarted(profile: UserProfile) {
    this.track("Conversation started", profile);
  }

  public static trackMessageReceived(message: Message, profile: UserProfile) {
    this.track("Message received", profile, { text: message.text, browser: "viber" });
  }

  public static trackError(profile: UserProfile, error: any) {
    this.track("Error", profile, { error });
  }

  private static track(eventName: string, userProfile: UserProfile, traits?: any) {
    const data = {
      $browser: userProfile.telegram_id ? "telegram" : "viber",
      distinct_id: userProfile.telegram_id || userProfile.viber_id,
      ...traits,
    };

    mixpanel.track(eventName, data);
  }
}
