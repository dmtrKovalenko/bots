import { DateTime } from "luxon";
import { localizedFormat } from "../utils/date-helpers";

export default {
  NO_REPORT: "Вы не отправили ни одного отчета за запрошенный месяц",
  REPORT_ACCEPTED: (reportText: string) => `Хорошо, я запишу в отчет: ${reportText}`,
  REPORT_MONTH: (date: DateTime, reportText: string) => `Отчет за ${localizedFormat(date, "LLLL")}: ${reportText}`,
  REPORT_THIS_MONTH: (reportText: string) => `Отчет за текущий месяц: ${reportText}`,
};
