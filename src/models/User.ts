export default class User {
  created_at: Date;
  updated_at: Date;

  public static create(id: string,
                       teamup_key: string) {
    return new User(id, teamup_key);
  }

  private constructor(
    public id: string,
    public teamup_key: string
  ) {
    this.created_at = new Date();
    this.updated_at = new Date()
  }
}
