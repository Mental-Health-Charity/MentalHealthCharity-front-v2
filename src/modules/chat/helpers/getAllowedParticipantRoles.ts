import { Roles } from "../../users/constants";
import { Chat } from "../types";

const managedChatParticipantRoles: Roles[] = [Roles.ADMIN, Roles.VOLUNTEERSUPERVISOR, Roles.REDACTOR];
const specialChatParticipantRoles: Roles[] = [Roles.ADMIN, Roles.VOLUNTEER, Roles.VOLUNTEERSUPERVISOR, Roles.REDACTOR];

const getAllowedParticipantRoles = (chat: Pick<Chat, "is_special_chat">): Roles[] =>
    chat.is_special_chat ? specialChatParticipantRoles : managedChatParticipantRoles;

export default getAllowedParticipantRoles;
