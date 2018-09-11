import BaseAction, { MessageRegexp } from "./BaseAction"

export default abstract class SimpleAction extends BaseAction {
  protected abstract regexp: MessageRegexp | null;
  private regexpResults: RegExpExecArray | null;

  public test() {
    const regexp = this.regexp;
    this.regexpResults = regexp ? regexp.test(this.context.message) : null;

    return Boolean(this.regexpResults);
  }

  protected arg(index: number) {
    const regexpResults = this.regexpResults;
    if (regexpResults == null) {
      throw new Error("Args is null");
    }

    return regexpResults[index];
  }
}

