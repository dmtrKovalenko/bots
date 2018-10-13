import { BaseBot } from "./bots/BaseBot";
import { ProcessMessageContext } from "./contexts/ProcessMessageContext";
import BaseAction from "./core/BaseAction";
import R from "./messages";
import { ILogger } from "./models/ILogger";
import Message from "./models/Message";
import UserProfile from "./models/UserProfile";
import ActionStateService, { Cache } from "./services/ActionStateService";

export interface InstantiableAction<T = any> {
  new (context: ProcessMessageContext, actionStateService: ActionStateService): T;
}

export default class ActionExecutor {
  private actionStateService: ActionStateService;

  constructor(
    private allActions: Array<InstantiableAction<BaseAction>>,
    private logger: ILogger,
    cache: Cache,
  ) {
    const compositeActions = allActions.filter((action) => (action as any).isComposite);
    this.actionStateService = new ActionStateService(cache, compositeActions as any);
  }

  public async processMessage(bot: BaseBot, userProfile: UserProfile, message: Message) {
    const context = new ProcessMessageContext(bot, userProfile, message, this.logger);
    this.logger.trackMessageReceived(message, userProfile);

    if (await this.executeCompositeAction(context)) {
      return true;
    }

    for (const Action of this.allActions) {
      const action = new Action(context, this.actionStateService);
      if (await action.testAndExecute()) {
        return true;
      }
    }

    context.sendMessage(R.UNKNOWN);
    return true;
  }

  private async executeCompositeAction(context: ProcessMessageContext) {
    const executingSession = await this.actionStateService.getExecutingSession(context.userProfile);
    if (!executingSession) {
      return false;
    }

    const { Action, step, meta } = executingSession;

    if (this.testDiscardMessage(context.message.text)) {
      this.actionStateService.removeActionState(context.userProfile);
      return true;
    }

    const compositeAction = new Action(context, this.actionStateService);
    await compositeAction.executeStep(step, meta);
    return true;
  }

  private testDiscardMessage(message: string) {
    return /^(Все|\/Отмена)/i.test(message);
  }
}
