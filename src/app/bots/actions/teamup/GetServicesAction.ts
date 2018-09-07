import StandManager from "../../../../managers/StandManager";
import Parser from "../../../../services/Parser";
import { MessageRegexp } from "../BaseAction";
import SimpleAction from "../SimpleAction";

export default class GetServicesAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Кто (?:записан|стоит|служит) (.+)$/i);

  protected async execute() {
    const manager = new StandManager(this.userProfile);

    if (!await this.checkTeamupKey()) {
      return;
    }

    const when = this.arg(0).trim();
    const date = Parser.parseDate(when);

    this.sendMessage(await manager.getServicesOnDateText(date));
  }
}
