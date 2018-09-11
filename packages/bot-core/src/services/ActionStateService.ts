import UserProfile from "../models/UserProfile"
import { InstantiableAction } from "../ActionExecutor";
import CompositeAction from "../core/CompositeAction";
import { caching } from "cache-manager";

type CompositeActionType = InstantiableAction<CompositeAction<any, any>>
export type Cache = ReturnType<typeof caching>

export interface IActionState {
  Action: any;
  step: number;
  meta: object;
}

export default class ActionStateService {
  private readonly actionsMap = new Map<string, any>();

  constructor(private cache: Cache, private actions: CompositeActionType[]) {
    actions.forEach(action => this.actionsMap.set(action.name, action))
  }

  public setActionState(userProfile: UserProfile, action: string, step: number, meta: object) {
    const key = this.getSessionKey(userProfile);
    return this.cache.set(key, { step, action, meta }, { ttl: 3600 });
  }

  public removeActionState(userProfile: UserProfile) {
    return this.cache.del(this.getSessionKey(userProfile));
  }

  public async getExecutingSession(userProfile: UserProfile): Promise<IActionState | null> {
    const session = await this.cache.get(this.getSessionKey(userProfile));

    if (!session) {
      return null;
    }

    const Action = this.actionsMap.get(session.action as string);
    if (!Action) {
      throw new ReferenceError("Action not found");
    }

    return {
      Action,
      meta: session.meta,
      step: session.step,
    };
  }

  private getSessionKey(userProfile: UserProfile) {
    return `${userProfile.id.toString()}_session`;
  }
}
