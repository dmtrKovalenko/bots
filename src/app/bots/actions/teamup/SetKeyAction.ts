import * as R from "../../../../constants/messages";
import StandManager from "../../../../managers/StandManager";
import { MessageRegexp } from "../BaseAction";
import SimpleAction from "../SimpleAction";

export default class SetKeyAction extends SimpleAction {
  public regexp = new MessageRegexp(/^Мой ключ (.+)$/i);

  protected async execute() {
    const manager = new StandManager(this.userProfile);
    const key = this.arg(0).trim();

    await manager.authorizeKey(key);

    this.sendMessage(R.KEY_AUTHORIZED);
  }
}
