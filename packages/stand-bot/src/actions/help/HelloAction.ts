import { MessageRegexp, SimpleAction } from "bot-core";

export default class HelloAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Привет/i);

  protected execute() {
    this.sendMessage(`Привет, ${this.userProfile.name} 😉`);
  }
}
