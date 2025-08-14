// Social Network Types
export type SocialProfile = {
  id: string;
  userId: string; // Reference to UserAccount
  username: string;
  displayName: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  isPrivate: boolean;
  showInterests: boolean;
  showBirthday: boolean;
  showGiftStats: boolean;
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  createdAt: string;
  updatedAt: string;
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
    giftsReceived: number;
    giftsGiven: number;
    totalGiftValue: number;
  };
};

export type SocialPost = {
  id: string;
  authorId: string;
  content: string;
  images?: string[];
  videos?: string[];
  type: 'text' | 'gift_received' | 'gift_given' | 'gift_used' | 'celebration';
  giftData?: {
    giftCardId: string;
    occasion: string;
    totalValue: number;
    items: string[];
  };
  likes: string[]; // Array of user IDs who liked
  comments: SocialComment[];
  shares: string[]; // Array of user IDs who shared
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SocialComment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  likes: string[];
  replies: SocialComment[];
  createdAt: string;
};

export type FollowRequest = {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
};

export type ChatConversation = {
  id: string;
  participants: string[]; // Array of user IDs
  lastMessage?: ChatMessage;
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'gift_card' | 'system';
  attachments?: string[];
  giftCardId?: string;
  isRead: boolean;
  createdAt: string;
};

export type SocialNotification = {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'follow_request' | 'gift_received' | 'mention';
  fromUserId: string;
  postId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};