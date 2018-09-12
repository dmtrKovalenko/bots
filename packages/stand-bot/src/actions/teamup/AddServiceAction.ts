import { MessageRegexp, SimpleAction } from "bot-core";
import * as R from "../../constants/messages";
import AuthManager from "../../managers/AuthManager";
import StandManager from "../../managers/StandManager";
import Parser from "../../services/Parser";
import { localizedFormat } from "../../utils/helpers";

export default class AddServiceAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Запиши меня(?: на)? (.{1,20}) с (\d{1,2}(?::\d{2})?) до (\d{1,2}(?::\d{2})?)/i);

  protected executeAsync = async () => {
    await AuthManager.checkTeamupKey(this.userProfile);
    const standManager = new StandManager(this.userProfile);

    const date = Parser.parseDate(this.arg(0).trim());
    const start = Parser.parseTime(this.arg(1).trim(), date);
    const end = Parser.parseTime(this.arg(2).trim(), date);

    await standManager.addService(start, end);
    this.sendMessage(R.ADDED_SUCCESSFULLY(localizedFormat(start, "dd MMMM в HH:mm")));
  }
}
