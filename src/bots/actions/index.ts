
import ContactsAction from "./help/ContactsAction";
import ConversationStatedAction from "./help/ConversationStartedAction";
import HelloAction from "./help/HelloAction";
import HelpAction from "./help/HelpAction";
import WhoAreYouAction from "./help/WhoAreYouAction";
import AddServiceAction from "./teamup/AddServiceAction";
import GetServicesAction from "./teamup/GetServicesAction";
import SetKeyAction from "./teamup/SetKeyAction";
import UnknownAction from "./UnknownAction";
import SmartServiceAction from "./teamup/SmartServiceAction";

export default [
  new WhoAreYouAction(),
  new HelpAction(),
  new ContactsAction(),
  new SetKeyAction(),
  new GetServicesAction(),
  new AddServiceAction(),
  new HelloAction(),
  new ConversationStatedAction(),
  new SmartServiceAction()
];

export const Unknown = new UnknownAction();
