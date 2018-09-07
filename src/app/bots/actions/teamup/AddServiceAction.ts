import StandManager from "../../../../managers/StandManager";
import Parser from "../../../../services/Parser";
import { MessageRegexp } from "../BaseAction";
import BaseTeamupAction from "./BaseTeamupAction";

export default class AddServiceAction extends BaseTeamupAction {
  public regexp = new MessageRegexp(/^Запиши меня(?: на)? (.{1,20}) с (\d{1,2}(?::\d{2})?) до (\d{1,2}(?::\d{2})?)/i);

  protected executeAsync = async () => {
    const standManager = new StandManager(this.userProfile);

    if (!await this.checkTeamupKey()) {
      return;
    }

    const date = Parser.parseDate(this.arg(0).trim());
    const start = Parser.parseTime(this.arg(1).trim(), date);
    const end = Parser.parseTime(this.arg(2).trim(), date);

    this.sendMessage(await standManager.addService(start, end));
  }
}
