import BaseAction from "./BaseAction";

export default abstract class CompositeAction<T> extends BaseAction {
  protected abstract getDefaultState() : T;
}
