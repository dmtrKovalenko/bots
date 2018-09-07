import { DateTime } from "luxon";
import MonthMetaRepository from "../db/repositories/MonthMetaRepository";
import MonthMeta from "../models/MonthMeta";

export default class MetaManager {
  public static getReportUrl() {
    return MonthMetaRepository.getCurrentMonthMeta()
      .then((meta) => meta ? meta.report_url : null);
  }

  public static async uploadReportUrl(month: DateTime, url: string) {
    const meta = new MonthMeta(month.toJSDate(), url);

    return MonthMetaRepository.upsert(meta, { month: month.toJSDate() });
  }
}
