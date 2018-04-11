
export default class TeamUpEvent {
  id: string;
  start_dt: string;
  end_dt: string;
  title: string;
  who: string;
  subcalendar_id: string;

  constructor(
    title: string,
    startDate: Date,
    endDate: Date,
    who: string = ''
  ) {
    this.who = who
    this.title = title;
    this.subcalendar_id = process.env.TEAMUP_SUBCALENDAR_ID!;

    // Teamup doesnt understand milliseconds 😭
    this.start_dt = startDate.toISOString().split('.')[0]+"Z";
    this.end_dt = endDate.toISOString().split('.')[0]+"Z";
  }
}
