import path from "path";
import requireAll from "require-all";
import UserProfile from "../models/UserProfile";
import Redis from "../services/Redis";

const actionsMap = new Map<string, any>();
requireAll({
  dirname: path.resolve(__dirname, "..", "bots", "actions", "composite"),
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
    return Redis.set(key, { step, action, meta: JSON.stringify(meta) });
  }

  public static removeActionState(userProfile: UserProfile) {
    return Redis.delete(this.getSessionKey(userProfile));
  }

  public static async getExecutingSession(userProfile: UserProfile): Promise<IActionState | null> {
    const session = await Redis.get(this.getSessionKey(userProfile));

    if (!session) {
      return null;
    }

    const Action = actionsMap.get(session.action as string);
    if (!Action) {
      throw new ReferenceError("Action not found");
    }

    return {
      Action,
      meta: JSON.parse(session.meta as string),
      step: Number(session.step),
    };
  }

  private static getSessionKey(userProfile: UserProfile) {
    return `${userProfile.id.toString()}_session`;
  }
}
