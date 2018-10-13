import { now } from "../../utils/date-helpers";
import { IReport, Report } from "../models/Report";
import { GenericRepository } from "./GenericReposirory";

class ReportRepository extends GenericRepository<IReport, Report> {
  constructor() {
    super(Report);
  }

  public findCurrentMonthReport(id: any) {
    return this.findOne(undefined, {
      where: {
        month: now().startOf("month").toJSDate(),
        telegram_id: id,
      },
    });
  }
}

export default ReportRepository;
