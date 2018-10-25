import { BaseLogger, UserProfile } from "bot-core";

class Logger extends BaseLogger {
  public track(eventName: string, userProfile: UserProfile, traits?: any) {
    const data = {
      $browser: userProfile.telegram_id ? "telegram" : "viber",
      distinct_id: userProfile.telegram_id || userProfile.viber_id,
      ...traits,
    };

    console.log(eventName, data);
  }
}

export default new Logger();
