import SimpleAction from "../SimpleAction";
import {MessageRegexp} from "../BaseAction";

export default class HelloAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Привет/i);

  protected async execute() {
    this.sendMessage(`Привет, ${this.userProfile.name} 😉`);
  }
}
