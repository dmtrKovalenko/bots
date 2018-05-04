import CompositeAction from "../CompositeAction";

export default class SmartServiceAction extends CompositeAction<State> {
  public test(): boolean {
    return false;
  }

  protected async execute() {
    this.sendMessage("it's works!");
  }

  protected getDefaultState(): State {
    return State.None;
  }
}

enum State {
  None
}
