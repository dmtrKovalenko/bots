export default class User {
  created_at: Date;
  updated_at: Date;

  constructor(
    public id: string,
    public teamup_key: string
  ) {
    this.created_at = new Date();
    this.updated_at = new Date()
  }
}
