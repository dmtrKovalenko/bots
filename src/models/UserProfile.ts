export default class UserProfile {
  public teamup_key: string;

  constructor(
    public name: string,
    public telegram_id?: number,
    public viber_id?: string,
  ) { }
}
