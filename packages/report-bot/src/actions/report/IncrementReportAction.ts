import { BaseAction } from "bot-core";
import messages from "../../constants/messages";
import ReportManager from "../../managers/ReportManager";
import ReportParser from "../../services/ReportParser";

const availableCharacters = ReportParser.availableCharacters as string[];

class IncrementReportAction extends BaseAction {
  private parts: string[];

  public test() {
    const { text } = this.context.message;
    this.parts = text.split(" ");

    return this.parts.every((part) => availableCharacters.includes(part.replace(/\d{1,3}/, "")));
  }

  public executeAsync = async () => {
    const manager = new ReportManager(this.userProfile);
    const reportValues = ReportParser.makeReportFromParts(this.parts);

    this.sendMessage(messages.REPORT_ACCEPTED(ReportParser.renderReport(reportValues)));

    await manager.incrementReport(reportValues);
    const message = messages.REPORT_THIS_MONTH(await manager.getReportText());

    this.sendMessage(message);
  }
}

export default IncrementReportAction;
