import BaseAction from "./BaseAction";

export default abstract class CompositeAction<T> extends BaseAction {
  public state: T | null;
}
