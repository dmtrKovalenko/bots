import BaseAction, {MessageRegexp, MessageRegexpResults} from "./BaseAction";

export default abstract class SimpleAction extends BaseAction {
  protected abstract regexp: MessageRegexp | null;
  private regexpResults: MessageRegexpResults | null;

  test() {
    const regexp = this.regexp;
    return regexp != null ? regexp.test(this.context.message) : undefined;
  }

  protected async preExecute(): Promise<void> {
    const regexp = this.regexp;
    this.regexpResults = regexp != null ? regexp.execute(this.context.message) : null;
  }

  protected arg(index: number) {
    const regexpResults = this.regexpResults;
    if (regexpResults == null) {
      throw new Error("Args is null");
    }

    return regexpResults.arg(index);
  }
}
