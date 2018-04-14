import BaseAction from "../BaseAction";
import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import StandManager from "../../../managers/StandManager";

export default class AddServiceAction extends BaseAction {
  public static readonly PATTERN = /^Запиши меня(?: на)? (.{1,20}) с (\d{1,2}(?::\d{2})?) до (\d{1,2}(?::\d{2})?)/im;

  constructor() {
    super(AddServiceAction.PATTERN);
  }

  protected action(session: ProcessMessageSession, args: string[] | null): boolean {
    session.sendTextMessage(R.PROCESSING);

    const context = session.context;
    const userProfile = context.userProfile;

    const manager = new StandManager(userProfile);

    const userName = userProfile.name;

    if (args == null || args.length < 3) {
      session.handleError("Похоже вы ввели данныее в неверном формате, поробуйте еще раз, пожалуйста.");
      return true;
    }

    const date = args[0].trim();
    const startTime = args[1].trim();
    const endTime = args[2].trim();

    manager.addService(userName, date, startTime, endTime)
      .then(message => session.sendTextMessage(message))
      .catch(e => session.handleError(e));

    return true;
  }
}
