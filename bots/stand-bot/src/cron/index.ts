import { CronJob } from "cron";

import path from "path";
import requireAll from "require-all";
import { telegramBot, viberBot } from "../app";

requireAll({
  dirname: path.resolve(__dirname, "jobs"),
  filter: /(.+Job)\.(ts|js)$/,
  resolve: ({ default: Job }: any) => {
    // get instance of BaseCronTask and convert to CronJob
    const job = new Job(telegramBot, viberBot).toCronJob();

    if (!(job instanceof CronJob)) {
      throw new Error("Cron jobs should be instances of cron`s CronJob");
    }

    job.start();
  },
});
