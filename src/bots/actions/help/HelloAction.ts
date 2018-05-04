import SimpleAction from "../SimpleAction";

export default class HelloAction extends SimpleAction {
  public regexp = /^Привет/i;

  protected async action() {
    this.sendMessage(`Привет, ${this.userProfile().name} 😉`);
  }
}
