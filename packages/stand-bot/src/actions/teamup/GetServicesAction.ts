import { MessageRegexp, SimpleAction } from "bot-core";
import AuthManager from "../../managers/AuthManager";
import StandManager from "../../managers/StandManager";
import Parser from "../../services/Parser";

export default class GetServicesAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Кто (?:записан|стоит|служит) (.+)$/i);

  protected async execute() {
    await AuthManager.checkTeamupKey(this.userProfile);
    const manager = new StandManager(this.userProfile);

    const when = this.arg(0).trim();
    const date = Parser.parseDate(when);

    this.sendMessage(await manager.getServicesOnDateText(date));
  }
}
