import ContactsAction from "./help/ContactsAction";
import ConversationStatedAction from "./help/ConversationStartedAction";
import HelloAction from "./help/HelloAction";
import HelpAction from "./help/HelpAction";
import WhoAreYouAction from "./help/WhoAreYouAction";
import AddServiceAction from "./teamup/AddServiceAction";
import GetServicesAction from "./teamup/GetServicesAction";
import SetKeyAction from "./teamup/SetKeyAction";
import SmartServiceAction from "./teamup/SmartServiceAction";
import UnknownAction from "./UnknownAction";

export default [
  WhoAreYouAction,
  HelpAction,
  ContactsAction,
  SetKeyAction,
  GetServicesAction,
  AddServiceAction,
  HelloAction,
  ConversationStatedAction,
  SmartServiceAction,
];

export const Unknown = UnknownAction;
