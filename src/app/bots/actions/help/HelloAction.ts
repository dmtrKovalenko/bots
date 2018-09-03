import { MessageRegexp } from "../BaseAction";
import SimpleAction from "../SimpleAction";

export default class HelloAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Привет/i);

  protected execute() {
    this.sendMessage(`Привет, ${this.userProfile.name} 😉`);
  }
}
