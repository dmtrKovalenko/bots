import { CronJob } from "cron";

export default new CronJob({
  cronTime: "10,20,30,40,50 * * * * *",
  onTick: () => {
    console.log('H')
  },
  timeZone: "Europe/Kiev",
});
