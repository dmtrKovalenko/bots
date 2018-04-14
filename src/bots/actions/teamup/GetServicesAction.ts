import BaseAction from "../BaseAction";
import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import StandManager from "../../../managers/StandManager";


export default class GetServicesAction extends BaseAction {
  public static readonly PATTERN = /^Кто (записан|стоит|служит)/i;

  constructor() {
    super(GetServicesAction.PATTERN);
  }

  protected action(session: ProcessMessageSession): boolean {
    const context = session.context;

    session.sendTextMessage(R.PROCESSING);

    const manager = new StandManager(context.userProfile);

    const when = context.message.text
      .toLowerCase()
      .replace(GetServicesAction.PATTERN, '')
      .trim();

    manager.getServices(when)
      .then(servicesMsg => session.sendTextMessage(servicesMsg))
      .catch(e => session.handleError(e));

    return true;
  }
}
