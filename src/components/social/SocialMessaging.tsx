import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Paperclip,
  Smile,
  Image,
  Mic,
  ArrowLeft,
  Circle,
  Check,
  CheckCheck
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useSocial } from '../../contexts/SocialContext';
import { useUser } from '../../contexts/UserContext';
import type { ChatConversation, ChatMessage } from '../../types/social';

type SocialMessagingProps = {
  onBack?: () => void;
};

export function SocialMessaging({ onBack }: SocialMessagingProps) {
  const { conversations, messages, setMessages, socialProfiles } = useSocial();
  const { loggedInUser } = useUser();
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserProfile = socialProfiles.find(p => p.userId === loggedInUser);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const otherParticipants = conv.participants.filter(p => p !== loggedInUser);
    return otherParticipants.some(participantId => {
      const profile = socialProfiles.find(p => p.userId === participantId);
      return profile?.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             profile?.username.toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  const conversationMessages = selectedConversation 
    ? messages.filter(msg => msg.conversationId === selectedConversation.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation || !loggedInUser) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: loggedInUser,
      content: messageText.trim(),
      type: 'text',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  const getOtherParticipant = (conversation: ChatConversation) => {
    const otherParticipantId = conversation.participants.find(p => p !== loggedInUser);
    return socialProfiles.find(p => p.userId === otherParticipantId);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'همین الان';
    if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعت پیش`;
    return date.toLocaleDateString('fa-IR');
  };

  return (
    <div className="h-[600px] bg-white rounded-2xl overflow-hidden border border-gray-200 flex">
      {/* Conversations List */}
      <div className="w-1/3 border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">پیام‌ها</h3>
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="rounded-xl p-2">
                <ArrowLeft size={18} />
              </Button>
            )}
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در مکالمات..."
              className="rounded-xl pr-9 text-sm"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm">هنوز مکالمه‌ای ندارید</p>
              <p className="text-xs mt-1">با دوستان خود شروع به گفتگو کنید</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                const lastMessage = conversation.lastMessage;
                const isSelected = selectedConversation?.id === conversation.id;
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-3 rounded-xl text-right transition-colors ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {otherParticipant?.displayName.charAt(0) || '؟'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800 truncate">
                            {otherParticipant?.displayName || 'کاربر ناشناس'}
                          </span>
                          {lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        
                        {lastMessage && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {lastMessage.type === 'text' ? lastMessage.content : 
                               lastMessage.type === 'image' ? '📷 تصویر' :
                               lastMessage.type === 'gift_card' ? '🎁 کارت هدیه' : 'پیام'}
                            </p>
                            {!lastMessage.isRead && lastMessage.senderId !== loggedInUser && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {getOtherParticipant(selectedConversation)?.displayName.charAt(0) || '؟'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {getOtherParticipant(selectedConversation)?.displayName || 'کاربر ناشناس'}
                    </h4>
                    <p className="text-xs text-green-600">آنلاین</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="rounded-xl p-2">
                    <Phone size={18} />
                  </Button>
                  <Button variant="ghost" className="rounded-xl p-2">
                    <Video size={18} />
                  </Button>
                  <Button variant="ghost" className="rounded-xl p-2">
                    <MoreHorizontal size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <div className="text-4xl mb-3">👋</div>
                  <p className="text-sm">شروع مکالمه با {getOtherParticipant(selectedConversation)?.displayName}</p>
                  <p className="text-xs mt-1">اولین پیام خود را بفرستید</p>
                </div>
              ) : (
                conversationMessages.map((message) => {
                  const isOwn = message.senderId === loggedInUser;
                  const senderProfile = socialProfiles.find(p => p.userId === message.senderId);
                  
                  return (
                    <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-2xl px-4 py-2 ${
                          isOwn 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {message.type === 'text' && (
                            <p className="text-sm">{message.content}</p>
                          )}
                          {message.type === 'image' && (
                            <div className="space-y-2">
                              <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                                <Image size={24} className="text-gray-500" />
                              </div>
                              {message.content && <p className="text-sm">{message.content}</p>}
                            </div>
                          )}
                          {message.type === 'gift_card' && (
                            <div className="space-y-2">
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="text-lg">🎁</div>
                                  <span className="text-sm font-medium">کارت هدیه</span>
                                </div>
                                <p className="text-xs opacity-90">کارت هدیه ارسال شد</p>
                              </div>
                              {message.content && <p className="text-sm">{message.content}</p>}
                            </div>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                          isOwn ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{formatMessageTime(message.createdAt)}</span>
                          {isOwn && (
                            <div className="flex items-center">
                              {message.isRead ? (
                                <CheckCheck size={12} className="text-blue-500" />
                              ) : (
                                <Check size={12} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!isOwn && (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold order-1 mr-2 mt-auto">
                          {senderProfile?.displayName.charAt(0) || '؟'}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="rounded-xl p-2">
                  <Paperclip size={18} />
                </Button>
                <Button variant="ghost" className="rounded-xl p-2">
                  <Image size={18} />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="پیام خود را بنویسید..."
                    className="rounded-2xl pl-12"
                  />
                  <Button variant="ghost" className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-xl p-1">
                    <Smile size={16} />
                  </Button>
                </div>
                
                <Button variant="ghost" className="rounded-xl p-2">
                  <Mic size={18} />
                </Button>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">پیام‌رسان</h3>
              <p className="text-sm">یک مکالمه را انتخاب کنید تا شروع کنید</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}