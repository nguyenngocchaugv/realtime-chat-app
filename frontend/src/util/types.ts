/**
 * User
 */
export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: SearchedUser[];
}

export interface SearchedUser {
  id: string;
  username: string;
}

/**
 * Conversations
 */
export interface Conversation {
  id: string;
  participants: {
    hasSeenLatestMessage: boolean;
    user: {
      id: string;
      username: string;
    };
  }[],
  latestMessage: {
    sender: {
      id: string;
      username: string;
    }
  };
  updatedAt: string;
}

export interface ConversationsData {
  conversations: Conversation[];
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationInput {
  participantIds: string[];
}