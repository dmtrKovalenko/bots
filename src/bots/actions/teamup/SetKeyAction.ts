import BaseAction from "../BaseAction";
import * as R from "../../../constants/messages";
import { ProcessMessageSession } from "../../events/ProcessMessage";
import StandManager from "../../../managers/StandManager";

export default class SetKeyAction extends BaseAction {
  public static readonly PATTERN = /^Мой ключ (.+)$/i;

  constructor() {
    super(SetKeyAction.PATTERN);
  }

  protected action(session: ProcessMessageSession, args: string[] | null): boolean {
    const userProfile = session.context.userProfile;

    const manager = new StandManager(userProfile);

    const userId = userProfile.id;

    if (args == null || args.length < 1) {
      // TODO move to the messages
      session.handleError("Похоже вы ввели ключ в неверном формате, поробуйте еще раз, пожалуйста.");
      return true;
    }

    const key = args[0].trim();

    manager.authorizeKey(userId, key)
      .then(message => session.sendTextMessage(message))
      .catch(e => session.handleError(e));

    return true;
  }
}

