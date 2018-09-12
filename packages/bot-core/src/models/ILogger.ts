import Message from "./Message";
import UserProfile from "./UserProfile";

export interface ILogger {
  trackMessageReceived(message: Message, userProfile: UserProfile): void;
  trackError(userProfile: UserProfile, e: Error): void;
  logConversationStarted(userProfile: UserProfile): void;
}
