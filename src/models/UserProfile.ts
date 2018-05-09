export default class UserProfile {
  constructor(
    public name: string,
    public telegram_id?: number,
    public viber_id?: string,
    public teamup_key?: string,
  ) { }

  public get id() {
    return this.telegram_id! || this.viber_id!;
  }
}
