import * as R from "../../constants/messages";
import {ConversationStartedSession, ProcessMessageSession} from "../StandBot";
import StandManager from "../../managers/StandManager";
import Action from "./Action";

class HelpAction extends Action {
  public static readonly PATTERN = /^Помощь/i;

  constructor() {
    super(HelpAction.PATTERN);
  }

  protected action(session: ProcessMessageSession): boolean {
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));
    return true;
  }
}

class WhoAreYouAction extends Action {
  public static readonly PATTERN = /^(Кто ты|Ты кто|Как тебя зовут|Привет)/i;

  constructor() {
    super(WhoAreYouAction.PATTERN);
  }

  protected action(session: ProcessMessageSession): boolean {
    session.sendTextMessage(R.ImBot(session.context.botName));
    return true;
  }
}

class ContactsAction extends Action {
  public static readonly PATTERN = /^Контакты/i;

  constructor() {
    super(ContactsAction.PATTERN);
  }

  protected action(session: ProcessMessageSession): boolean {
    session.sendTextMessage(R.CONTACTS);
    return true;
  }
}

class SetKeyAction extends Action {
  public static readonly PATTERN = /^Мой ключ/i;

  constructor() {
    super(SetKeyAction.PATTERN);
  }

  protected action(session: ProcessMessageSession): boolean {
    const userProfile = session.context.userProfile;
    const message = session.context.message;

    const manager = new StandManager(userProfile);

    const userId = userProfile.id;

    const key = message.text
      .replace(SetKeyAction.PATTERN, '')
      .trim();

    manager.authorizeKey(userId, key)
      .then(message => session.sendTextMessage(message))
      .catch(e => session.handleError(e));

    return true;
  }
}

class GetServicesAction extends Action {
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

class AddServiceAction extends Action {
  public static readonly PATTERN = /^Запиши меня .{1,20} с \d{2}:\d{2} до \d{2}:\d{2}/im;

  constructor() {
    super(AddServiceAction.PATTERN);
  }

  protected action(session: ProcessMessageSession): boolean {
    session.sendTextMessage(R.PROCESSING);

    const context = session.context;
    const userProfile = context.userProfile;

    const manager = new StandManager(userProfile);

    const userName = userProfile.name;
    const [date, startTime, endTime] = context.message.text
      .toLowerCase()
      .replace(/^Запиши меня/i, '')
      .trim()
      .split(/\s*до\s*|\s*с\s*/);

    manager.addService(userName, date, startTime, endTime)
      .then(message => session.sendTextMessage(message))
      .catch(e => session.handleError(e));

    return true;
  }
}

class UnknownAction extends Action {
  public static readonly PATTERN = /^\*/;

  constructor() {
    super(UnknownAction.PATTERN);
  }

  protected action(session: ProcessMessageSession): boolean {
    session.sendTextMessage(R.UNKNOWN);
    return true;
  }
}

export default class Actions {
  private static conversationStarted(session: ConversationStartedSession) {
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));
    return true;
  }

  static readonly ConversationStarted = {execute: Actions.conversationStarted};

  static readonly All = [
    new WhoAreYouAction(),
    new HelpAction(),
    new ContactsAction(),
    new SetKeyAction(),
    new GetServicesAction(),
    new AddServiceAction()
  ];

  static readonly Unknown = new UnknownAction();
}
