import SmartServiceAction from "./composite/SmartServiceAction";
import ContactsAction from "./help/ContactsAction";
import ConversationStatedAction from "./help/ConversationStartedAction";
import HelloAction from "./help/HelloAction";
import HelpAction from "./help/HelpAction";
import WhoAreYouAction from "./help/WhoAreYouAction";
import SaveReportUrlAction from "./manager/SaveReportUrlAction";
import AddServiceAction from "./teamup/AddServiceAction";
import GetServicesAction from "./teamup/GetServicesAction";
import SetKeyAction from "./teamup/SetKeyAction";

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
  SaveReportUrlAction,
];
