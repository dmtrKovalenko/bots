import * as R from "../../constants/messages";
import SimpleAction from "./SimpleAction";

export default class UnknownAction extends SimpleAction {
  public regexp = null;

  protected async execute() {
    this.sendMessage(R.UNKNOWN);
  }
}
