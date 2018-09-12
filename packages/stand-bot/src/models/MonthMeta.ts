export default class MonthMeta {
  public created_at: Date;
  public updated_at: Date;

  constructor(
    public month: Date,
    public report_url?: string,
    public scheme_url?: number,
  ) {
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
