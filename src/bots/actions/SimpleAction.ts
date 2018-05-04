import BaseAction, { MessageRegexp } from "./BaseAction";

export default abstract class SimpleAction extends BaseAction {
  protected abstract regexp: MessageRegexp | null;
  private regexpResults: RegExpExecArray | null;

  public test() {
    const regexp = this.regexp;
    return regexp != null ? regexp.test(this.context.message) : undefined;
  }

  protected async preExecute(): Promise<void> {
    const regexp = this.regexp;
    this.regexpResults = regexp != null ? regexp.execute(this.context.message) : null;
  }

  protected async postExecute(): Promise<void> {
    this.markFinished();
  }

  protected arg(index: number) {
    const regexpResults = this.regexpResults;
    if (regexpResults == null) {
      throw new Error("Args is null");
    }

    return regexpResults[index];
  }
}
