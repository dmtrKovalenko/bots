import requireAll from "require-all";
import { telegramBot } from "../app";

requireAll({
  dirname: __dirname,
  filter: /(.+Job)\.(ts|js)$/,
  resolve: ({ default: Job }: any) => {
    // get instance of BaseCronTask and convert to CronJob
    const job = new Job(telegramBot).toCronJob();

    job.start();
  },
});
