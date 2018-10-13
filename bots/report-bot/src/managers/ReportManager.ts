import { CustomError, UserProfile } from "bot-core";
import { DateTime } from "luxon";
import messages from "../constants/messages";
import { reportRepository } from "../db";
import { IReport } from "../db/models/Report";
import ReportParser, { ReportValues } from "../services/ReportParser";
import { now } from "../utils/date-helpers";

class ReportManager {
  constructor(private userProfile: UserProfile) { }

  public async incrementReport(reportValues: ReportValues) {
    const currentReport = await reportRepository.findCurrentMonthReport(this.userProfile.telegram_id);
    if (!currentReport) {
      const report: IReport = {
        ...reportValues,
        month: now().startOf("month").toJSDate(),
        telegram_id: this.userProfile.telegram_id!,
      };

      return await reportRepository.create(report);
    }

    Object.keys(reportValues)
      .forEach((key) => {
        // @ts-ignore ignore warnings about index signature.
        reportValues[key] += currentReport[key];
      });

    return await reportRepository.updateById(this.userProfile.telegram_id, reportValues);
  }

  public async getReport(month?: DateTime) {
    const currentReport = await reportRepository.findOne(undefined, {
      where: {
        month: month ? month.toJSDate() : now().startOf("month").toJSDate(),
        telegram_id: this.userProfile.telegram_id!,
      },
    });

    if (!currentReport) {
      throw new CustomError(messages.NO_REPORT);
    }

    return currentReport;
  }

  public async getReportText(month?: DateTime) {
    const report = await this.getReport(month);
    return ReportParser.renderReport(report);
  }
}

export default ReportManager;
