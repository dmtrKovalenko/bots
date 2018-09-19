import "reflect-metadata";
import { createConnection } from "typeorm";
import ReportRepository from "./repositories/ReportRepository";

createConnection({
  entities: [__dirname + "/models/*.ts"],
  type: "postgres",
  url: process.env.DATABASE_URL,
})
  .then(() => console.log("Connected to database"))
  .catch((e) => console.log("Database connection error", e));

export const reportRepository = new ReportRepository();
