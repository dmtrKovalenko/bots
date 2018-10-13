import Message from "../models/Message";
import BaseAction from "./BaseAction";

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

export class MessageRegexp {
  public constructor(private regexp: RegExp) { }

  public test(message: Message) {
    return this.getRegexpResults(message.text);
  }

  public execute(message: Message): RegExpExecArray {
    const regexpResults = this.getRegexpResults(message.text);

    if (regexpResults == null) {
      throw new Error("Regexp expression does not match the message!");
    }

    return regexpResults;
  }

  private getRegexpResults(message: string): RegExpExecArray | null {
    const results = this.regexp.exec(message);
    if (results == null) {
      return null;
    }

    if (results != null) {
      results.shift();
    }

    return results;
  }
}
