import CompositeAction from "../CompositeAction";
import {MessageRegexp} from "../BaseAction";

export default class SmartServiceAction extends CompositeAction<State> {
  private readonly initialMessage = new MessageRegexp(/^Записаться/i);

  protected async execute() {
    if (!this.initialMessage.test(this.context.message)) {
      this.markNotHandled();
      return;
    }
    this.sendMessage("hahaha");
  }

  protected getDefaultState(): State {
    return State.None;
  }
}

enum State {
  None,
}
