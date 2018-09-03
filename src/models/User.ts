export default class User {
  public created_at: Date;
  public updated_at: Date;

  constructor(
    public teamup_key: string,
    public teamup_user_name: string,
    public telegram_id?: number,
    public viber_id?: string,
  ) {
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
