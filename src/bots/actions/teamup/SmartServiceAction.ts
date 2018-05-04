import {MessageRegexp} from "../BaseAction";
import CompositeAction from "../CompositeAction";

export default class SmartServiceAction extends CompositeAction<State> {
  protected async execute() {
    if (this.state == null) {
      this.state = new DefaultState();
    }
    await this.state.run(this);
  }
}

abstract class State {
  public abstract run(action: SmartServiceAction): Promise<void>;
}

class DefaultState extends State {
  private readonly initialMessage = new MessageRegexp(/^Записаться/i);

  public async run(action: SmartServiceAction) {
    if (!this.initialMessage.test(action.context.message)) {
      action.markNotHandled();
      return;
    }
    action.sendMessage("Начало");
    action.state = new FinalState();
  }
}

class FinalState extends State {
  public async run(action: SmartServiceAction) {
    const text = action.context.message.text;

    if (text === "все") {
      action.markFinished();
      action.sendMessage(`Завершено`);
      return;
    } else if (text === "ошибка") {
      throw new Error("Моя ошибки");
    }

    action.sendMessage(`Вы написали: ${text}`);
  }
}
