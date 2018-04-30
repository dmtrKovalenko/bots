import { CronJob } from "cron";
import * as http from "http";
import requireAll from "require-all";

requireAll({
  dirname: __dirname,
  filter: /(.+Job)\.ts$/,
  resolve: (jobModule: any) => {
    // get instance of BaseCronTask and convert to CronJob
    const job = new jobModule.default().toCronJob();

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
