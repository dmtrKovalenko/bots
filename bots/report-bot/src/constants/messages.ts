import { DateTime } from "luxon";
import { localizedFormat } from "../utils/date-helpers";

const HELP = (name: string) => `Привет, ${name}. Я бот который поможет тебе в записи отчетов :)
Чтобы воспользоваться мной просто напиши свой отчет в таком формате:
  - 1ч 30м 5п 1в 2пп (тоесть 1 час, 30 минут, 5 публикаций, 1 видео и 2 повторных)
  - 2ч 11м 1в
Если хочешь полный отчет на текущий месяц напши мне "Отчет"
`;

export default {
  HELP,
  NO_REPORT: "Вы не отправили ни одного отчета за запрошенный месяц",
  REPORT_ACCEPTED: (reportText: string) => `Хорошо, я запишу в отчет: ${reportText}`,
  REPORT_MONTH: (date: DateTime, reportText: string) => `Отчет за ${localizedFormat(date, "LLLL")}: ${reportText}`,
  REPORT_THIS_MONTH: (reportText: string) => `Отчет за текущий месяц: ${reportText}`,
};
