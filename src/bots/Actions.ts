import * as R from "../constants/messages";
import {ConversationStartedSession, ProcessMessageSession} from "./StandBot";
import Action from "./Action";
import StandManager from "../managers/StandManager";

export default class Actions {
  private static conversationStarted(session: ConversationStartedSession) {
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));
    return true;
  }

  static readonly ConversationStarted = {execute: Actions.conversationStarted};

  private static whoAreYou(session: ProcessMessageSession) {
    session.sendTextMessage(R.ImBot(session.context.botName));
    return true;
  };

  private static help(session: ProcessMessageSession) {
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));
    return true;
  }

  private static contacts(session: ProcessMessageSession) {
    session.sendTextMessage(R.CONTACTS);
    return true;
  }

  private static setKey(session: ProcessMessageSession) {
    const userProfile = session.context.userProfile;
    const message = session.context.message;

    const manager = new StandManager(userProfile);

    const userId = userProfile.id;

    const key = message.text
      .replace(/^Мой ключ/i, '')
      .trim();

    manager.authorizeKey(userId, key)
      .then(message => session.sendTextMessage(message))
      .catch(e => session.handleError(e));

    return true;
  }

  private static getServices(session: ProcessMessageSession) {
    const context = session.context;

    session.sendTextMessage(R.PROCESSING);

    const manager = new StandManager(context.userProfile);

    const when = context.message.text
      .toLowerCase()
      .replace(/^Кто (записан|стоит|служит)/i, '')
      .trim();

    manager.getServices(when)
      .then(servicesMsg => session.sendTextMessage(servicesMsg))
      .catch(e => session.handleError(e));

    return true;
  }

  private static addService(session: ProcessMessageSession) {
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

  static readonly All = [
    new Action(/^(Кто ты|Ты кто|Как тебя зовут|Привет)/i, Actions.whoAreYou),
    new Action(/^Помощь/i, Actions.help),
    new Action(/^Контакты/i, Actions.contacts),
    new Action(/^Мой ключ/i, Actions.setKey),
    new Action(/^Кто (записан|стоит|служит)/i, Actions.getServices),
    new Action(/^Запиши меня .{1,20} с \d{2}:\d{2} до \d{2}:\d{2}/im, Actions.addService)
  ];

  private static unknown(session: ProcessMessageSession) {
    session.sendTextMessage(R.UNKNOWN);
    return true;
  };

  static readonly Unknown = new Action(/^\*/, Actions.unknown);
}
