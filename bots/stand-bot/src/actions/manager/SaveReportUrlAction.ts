import { MessageRegexp, SimpleAction } from "bot-core";
import { DateTime } from "luxon";
import * as R from "../../constants/messages";
import AuthManager from "../../managers/AuthManager";
import MetaManager from "../../managers/MetaManager";

export default class SaveReportUrlAction extends SimpleAction {
  public regexp = new MessageRegexp(
    /^Ссылка для отчетов на (.{1,25}) - (.{1,254})/i,
  );

  protected executeAsync = async () => {
    if (!(await AuthManager.isManager(this.userProfile))) {
      this.sendMessage(R.ACCESS_FORBIDDEN);
      return;
    }

    const month = DateTime.fromFormat(this.arg(0), "MMMM", {
      locale: "ru",
      zone: "utc",
    });

    await MetaManager.uploadReportUrl(month, this.arg(1));
    return this.sendMessage(R.SAVED_SUCCESSFULLY);
  }
}
