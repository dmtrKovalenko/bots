import * as R from '../../constants/messages';
import { ConversationStartedSession } from "../events/ConversationStarted";
import WhoAreYouAction from './help/WhoAreYouAction';
import HelpAction from './help/HelpAction';
import ContactsAction from './help/ContactsAction';
import SetKeyAction from './teamup/SetKeyAction';
import GetServicesAction from './teamup/GetServicesAction';
import AddServiceAction from './teamup/AddServiceAction';
import UnknownAction from './UnknownAction';
import HelloAction from "./help/HelloAction";

export default [
  new WhoAreYouAction(),
  new HelpAction(),
  new ContactsAction(),
  new SetKeyAction(),
  new GetServicesAction(),
  new AddServiceAction(),
  new HelloAction()
];

export const Unknown = new UnknownAction();

export const ConversationStarted = {
  execute: (session: ConversationStartedSession) => {
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));
    return true;
  }
};
