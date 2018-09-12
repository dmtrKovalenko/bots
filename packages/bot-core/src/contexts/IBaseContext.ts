export default abstract class IBaseContext {
  public readonly botName: string;

  protected constructor(botName: string) {
    this.botName = botName;
  }
}
