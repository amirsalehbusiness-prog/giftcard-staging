import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { 
  SocialProfile, 
  SocialPost, 
  FollowRequest, 
  ChatConversation, 
  ChatMessage,
  SocialNotification 
} from '../types/social';

type SocialContextType = {
  // Profiles
  socialProfiles: SocialProfile[];
  setSocialProfiles: (profiles: SocialProfile[] | ((prev: SocialProfile[]) => SocialProfile[])) => void;
  
  // Posts
  socialPosts: SocialPost[];
  setSocialPosts: (posts: SocialPost[] | ((prev: SocialPost[]) => SocialPost[])) => void;
  
  // Follow Requests
  followRequests: FollowRequest[];
  setFollowRequests: (requests: FollowRequest[] | ((prev: FollowRequest[]) => FollowRequest[])) => void;
  
  // Chat
  conversations: ChatConversation[];
  setConversations: (conversations: ChatConversation[] | ((prev: ChatConversation[]) => ChatConversation[])) => void;
  
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  
  // Notifications
  notifications: SocialNotification[];
  setNotifications: (notifications: SocialNotification[] | ((prev: SocialNotification[]) => SocialNotification[])) => void;
  
  // Helper functions
  createSocialProfile: (userId: string, profileData: Partial<SocialProfile>) => void;
  updateSocialProfile: (profileId: string, updates: Partial<SocialProfile>) => void;
  createPost: (postData: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  likePost: (postId: string, userId: string) => void;
  followUser: (fromUserId: string, toUserId: string) => void;
  acceptFollowRequest: (requestId: string) => void;
  rejectFollowRequest: (requestId: string) => void;
};

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export function SocialProvider({ children }: { children: ReactNode }) {
  const [socialProfiles, setSocialProfiles] = useLocalStorage<SocialProfile[]>('socialProfiles', []);
  const [socialPosts, setSocialPosts] = useLocalStorage<SocialPost[]>('socialPosts', []);
  const [followRequests, setFollowRequests] = useLocalStorage<FollowRequest[]>('followRequests', []);
  const [conversations, setConversations] = useLocalStorage<ChatConversation[]>('conversations', []);
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('messages', []);
  const [notifications, setNotifications] = useLocalStorage<SocialNotification[]>('notifications', []);

  const createSocialProfile = (userId: string, profileData: Partial<SocialProfile>) => {
    const newProfile: SocialProfile = {
      id: Date.now().toString(),
      userId,
      username: profileData.username || `user_${userId.slice(-6)}`,
      displayName: profileData.displayName || 'کاربر جدید',
      bio: profileData.bio || '',
      profileImage: profileData.profileImage,
      coverImage: profileData.coverImage,
      location: profileData.location,
      website: profileData.website,
      isVerified: false,
      isPrivate: profileData.isPrivate || false,
      showInterests: profileData.showInterests || true,
      showBirthday: profileData.showBirthday || true,
      showGiftStats: profileData.showGiftStats || true,
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        giftsReceived: 0,
        giftsGiven: 0,
        totalGiftValue: 0
      }
    };
    
    setSocialProfiles(prev => [...prev, newProfile]);
  };

  const updateSocialProfile = (profileId: string, updates: Partial<SocialProfile>) => {
    setSocialProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, ...updates, updatedAt: new Date().toISOString() }
          : profile
      )
    );
  };

  const createPost = (postData: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: SocialPost = {
      ...postData,
      id: Date.now().toString(),
      likes: [],
      comments: [],
      shares: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSocialPosts(prev => [newPost, ...prev]);
    
    // Update author's post count
    setSocialProfiles(prev => 
      prev.map(profile => 
        profile.userId === postData.authorId
          ? { 
              ...profile, 
              stats: { ...profile.stats, postsCount: profile.stats.postsCount + 1 },
              updatedAt: new Date().toISOString()
            }
          : profile
      )
    );
  };

  const likePost = (postId: string, userId: string) => {
    setSocialPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(userId);
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(id => id !== userId)
              : [...post.likes, userId],
            updatedAt: new Date().toISOString()
          };
        }
        return post;
      })
    );
  };

  const followUser = (fromUserId: string, toUserId: string) => {
    const targetProfile = socialProfiles.find(p => p.userId === toUserId);
    
    if (targetProfile?.isPrivate) {
      // Create follow request for private accounts
      const newRequest: FollowRequest = {
        id: Date.now().toString(),
        fromUserId,
        toUserId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setFollowRequests(prev => [...prev, newRequest]);
    } else {
      // Direct follow for public accounts
      setSocialProfiles(prev => 
        prev.map(profile => {
          if (profile.userId === fromUserId) {
            return {
              ...profile,
              following: [...profile.following, toUserId],
              stats: { ...profile.stats, followingCount: profile.stats.followingCount + 1 }
            };
          }
          if (profile.userId === toUserId) {
            return {
              ...profile,
              followers: [...profile.followers, fromUserId],
              stats: { ...profile.stats, followersCount: profile.stats.followersCount + 1 }
            };
          }
          return profile;
        })
      );
    }
  };

  const acceptFollowRequest = (requestId: string) => {
    const request = followRequests.find(r => r.id === requestId);
    if (!request) return;

    // Update follow relationships
    setSocialProfiles(prev => 
      prev.map(profile => {
        if (profile.userId === request.fromUserId) {
          return {
            ...profile,
            following: [...profile.following, request.toUserId],
            stats: { ...profile.stats, followingCount: profile.stats.followingCount + 1 }
          };
        }
        if (profile.userId === request.toUserId) {
          return {
            ...profile,
            followers: [...profile.followers, request.fromUserId],
            stats: { ...profile.stats, followersCount: profile.stats.followersCount + 1 }
          };
        }
        return profile;
      })
    );

    // Update request status
    setFollowRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' as const } : req
      )
    );
  };

  const rejectFollowRequest = (requestId: string) => {
    setFollowRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  return (
    <SocialContext.Provider value={{
      socialProfiles,
      setSocialProfiles,
      socialPosts,
      setSocialPosts,
      followRequests,
      setFollowRequests,
      conversations,
      setConversations,
      messages,
      setMessages,
      notifications,
      setNotifications,
      createSocialProfile,
      updateSocialProfile,
      createPost,
      likePost,
      followUser,
      acceptFollowRequest,
      rejectFollowRequest
    }}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
}