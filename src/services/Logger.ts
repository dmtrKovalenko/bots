const mixpanelKey = process.env.MIXPANEL_KEY;

if (!mixpanelKey) {
  throw new Error('Mixpanel key should be provided')
}

const Mixpanel = require("mixpanel");

const mixpanel = Mixpanel.init(mixpanelKey)

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

  public static identify(userId: string, name: string) {
    mixpanel.people.set(userId, {
      $first_name: name
    })
  }

  public static trackConversationStarted(userProfile: any) {
    Logger.track("Conversation started", userProfile.id)
  }

  public static trackMessageReceived(message: any, userProfile: any) {
    Logger.track("Message received", userProfile.id, {text: message.text})
  }
}
