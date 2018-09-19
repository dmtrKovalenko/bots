import { UserProfile } from "bot-core";
import Message from "bot-core/build/models/Message";

export default class Logger {
  public static logConversationStarted(userProfile: UserProfile) {
    this.trackConversationStarted(userProfile);
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

    // TODO: Add some logging service here like mixpanel or smth
    console.log(eventName, data);
  }
}
