import { CronJob } from "cron";
import requireAll from "require-all";

requireAll({
  dirname: __dirname,
  filter: /(.+Job)\.ts$/,
  resolve: (jobModule: any) => {
    const job = jobModule.default;
    if (!(job instanceof CronJob)) {
      throw new Error("Cron jobs should be instances of cron`s CronJob");
    }

    job.start();
  },
});
