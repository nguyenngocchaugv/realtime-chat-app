// import { ConversationParticipant } from "./types";

export const formatUsernames = (
  participants: any[],
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

  return usernames.join(", ");
};