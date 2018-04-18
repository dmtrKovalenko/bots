
export default class TeamUpEvent {
  public id: string;
  public start_dt: string;
  public end_dt: string;
  public title: string;
  public who: string;
  public subcalendar_id: string;

  constructor(
    title: string,
    startDate: Date,
    endDate: Date,
    who: string = "",
  ) {
    this.who = who;
    this.title = title;
    this.subcalendar_id = process.env.TEAMUP_SUBCALENDAR_ID!;

    // Teamup doesnt understand milliseconds 😭
    this.start_dt = startDate.toISOString().split(".")[0] + "Z";
    this.end_dt = endDate.toISOString().split(".")[0] + "Z";
  }
}
