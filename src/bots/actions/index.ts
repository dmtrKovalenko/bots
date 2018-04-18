import * as R from "../../constants/messages";
import { ConversationStartedSession } from "../events/ConversationStarted";
import ContactsAction from "./help/ContactsAction";
import HelloAction from "./help/HelloAction";
import HelpAction from "./help/HelpAction";
import WhoAreYouAction from "./help/WhoAreYouAction";
import AddServiceAction from "./teamup/AddServiceAction";
import GetServicesAction from "./teamup/GetServicesAction";
import SetKeyAction from "./teamup/SetKeyAction";
import UnknownAction from "./UnknownAction";

export default [
  new WhoAreYouAction(),
  new HelpAction(),
  new ContactsAction(),
  new SetKeyAction(),
  new GetServicesAction(),
  new AddServiceAction(),
  new HelloAction(),
];

export const Unknown = new UnknownAction();

export const ConversationStarted = {
  execute: (session: ConversationStartedSession) => {
    session.sendTextMessage(R.HELP(session.context.botName, session.context.userProfile.name));
    return true;
  },
};
