import { DateTime } from "luxon";

export default class TeamUpEvent {
  public id: string;
  public start_dt: string;
  public end_dt: string;
  public title: string;
  public who: string;
  public subcalendar_id: string;

  constructor(
    title: string,
    public startDate: DateTime,
    public endDate: DateTime,
    who: string = "",
  ) {
    this.who = who;
    this.title = title;
    this.subcalendar_id = process.env.TEAMUP_SUBCALENDAR_ID!;

    this.start_dt = this.getTeamUpDateTimeString(startDate);
    this.end_dt = this.getTeamUpDateTimeString(endDate);
  }

  // Teamup doesnt understand milliseconds in ISO string 😭
  public getTeamUpDateTimeString(date: DateTime) {
    return date.toFormat("yyyy-LL-dd'T'HH:mmZZ");
  }
}
