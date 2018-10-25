import Message from "../models/Message";
import UserProfile from "../models/UserProfile";

abstract class BaseLogger {
  public abstract track(eventName: string, userProfile: UserProfile, traits?: any): void;

  public logConversationStarted(userProfile: UserProfile) {
    this.trackConversationStarted(userProfile);
  }

  public trackConversationStarted(profile: UserProfile) {
    this.track("Conversation started", profile);
  }

  public trackMessageReceived(message: Message, profile: UserProfile) {
    this.track("Message received", profile, { text: message.text, browser: "viber" });
  }

  public trackError(profile: UserProfile, error: any) {
    this.track("Error", profile, { error });
  }
}

export default BaseLogger;
