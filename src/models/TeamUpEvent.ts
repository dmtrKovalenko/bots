import { parse } from 'date-fns'

export default class TeamUpEvent {
  id: string;
  start_dt: string;
  end_dt: string;
  title: string;
  who: string;

  get startDate() {
    return parse(this.start_dt)
  }

  get endDate() {
    return parse(this.end_dt)
  }
}
