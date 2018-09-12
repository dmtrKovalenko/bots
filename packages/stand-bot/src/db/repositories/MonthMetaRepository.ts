import { DateTime } from "luxon";
import MonthMeta from "../../models/MonthMeta";
import MonthMetaModel from "../models/MonthMetaModel";
import GenericRepository from "./GenericRepository";

class MonthMetaRepository extends GenericRepository<MonthMeta> {
  public getCurrentMonthMeta() {
    const startOfMonth = DateTime.local().setZone("utc").startOf("month").toJSDate();

    return this.find({ month: startOfMonth });
  }
}

export default new MonthMetaRepository(MonthMetaModel);
