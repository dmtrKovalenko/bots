export default class Delay extends Promise<void> {
  private timer: NodeJS.Timer | null = null;

  constructor(interval: number) {
    super((resolve) => {
      this.timer = global.setTimeout(() => {
        this.timer = null;
        resolve();
      }, interval);
    });
  }

  public cancel() {
    if (!this.timer)
      return;

    global.clearTimeout(this.timer);
    this.timer = null;
  }
}
