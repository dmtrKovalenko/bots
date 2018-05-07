import SmartServiceAction from "../bots/actions/composite/SmartServiceAction";
import UserProfile from "../models/UserProfile";
import Redis from "../services/Redis";

const actionsMap = new Map<string, any>();
actionsMap.set(SmartServiceAction.name, SmartServiceAction);

interface IActionState {
  Action: any;
  step: number;
  meta: object;
}

export default class ActionStateManager {
  public static setActionState(userProfile: UserProfile, action: string, step: number, meta: object) {
    return Redis.set(userProfile.id.toString(), { step, action, meta: JSON.stringify(meta) });
  }

  public static removeActionState(userProfile: UserProfile) {
    return Redis.delete(userProfile.id.toString());
  }

  public static async getExecutingSession(userProfile: UserProfile): Promise<IActionState | null> {
    const session = await Redis.get(userProfile.id.toString());

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
}
