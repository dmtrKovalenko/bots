import path from "path";
import requireAll from "require-all";
import UserProfile from "../models/UserProfile";
import cache from "../services/cache";

const actionsMap = new Map<string, any>();
requireAll({
  dirname: path.resolve(__dirname, "..", "app", "bots", "actions", "composite"),
  filter: /(.+Action)\.(js|ts)$/,
  resolve: ({ default: Action }: any) => actionsMap.set(Action.name, Action),
});

export interface IActionState {
  Action: any;
  step: number;
  meta: object;
}

export default class ActionStateManager {
  public static setActionState(userProfile: UserProfile, action: string, step: number, meta: object) {
    const key = this.getSessionKey(userProfile);
    return cache.set(key, { step, action, meta }, { ttl: 3600 });
  }

  public static removeActionState(userProfile: UserProfile) {
    return cache.del(this.getSessionKey(userProfile));
  }

  public static async getExecutingSession(userProfile: UserProfile): Promise<IActionState | null> {
    const session = await cache.get(this.getSessionKey(userProfile));

    if (!session) {
      return null;
    }

    const Action = actionsMap.get(session.action as string);
    if (!Action) {
      throw new ReferenceError("Action not found");
    }

    return {
      Action,
      meta: session.meta,
      step: session.step,
    };
  }

  private static getSessionKey(userProfile: UserProfile) {
    return `${userProfile.id.toString()}_session`;
  }
}
