import { CronJob } from "cron";
import * as http from "http";
import path from "path";
import requireAll from "require-all";

requireAll({
  dirname: path.resolve(__dirname, "jobs"),
  filter: /(.+Job)\.(ts|js)$/,
  resolve: ({ default: Job }: any) => {
    // get instance of BaseCronTask and convert to CronJob
    const job = new Job().toCronJob();

    if (!(job instanceof CronJob)) {
      throw new Error("Cron jobs should be instances of cron`s CronJob");
    }

    job.start();
  },
});

if (process.env.NOW_URL) {
  // Mock web server for cloud provider
  http.createServer(() => { /* fake */ }).listen(8080);
}
