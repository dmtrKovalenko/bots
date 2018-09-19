import { MessageRegexp, SimpleAction } from "bot-core";
import messages from "../../constants/messages";
import ReportManager from "../../managers/ReportManager";
import { now, parseMonth } from "../../utils/date-helpers";

export default class MonthReportAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Отчет( за)?(.+)?/i);

  protected async execute() {
    const manager = new ReportManager(this.userProfile);
    const monthText = this.arg(1);

    const month = monthText
      ? parseMonth(monthText.trim())
      : now().startOf("month");

    const report = await manager.getReportText(month);
    const message = monthText
      ? messages.REPORT_MONTH(month, report)
      : messages.REPORT_THIS_MONTH(report);

    this.sendMessage(message);
  }
}
