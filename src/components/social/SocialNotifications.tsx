import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Gift, 
  Star,
  Check,
  X,
  Filter,
  MoreHorizontal,
  Trash2,
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useSocial } from '../../contexts/SocialContext';
import { useUser } from '../../contexts/UserContext';
import type { SocialNotification } from '../../types/social';

type SocialNotificationsProps = {
  onBack?: () => void;
};

export function SocialNotifications({ onBack }: SocialNotificationsProps) {
  const { notifications, setNotifications, socialProfiles, followRequests, acceptFollowRequest, rejectFollowRequest } = useSocial();
  const { loggedInUser } = useUser();
  const [filter, setFilter] = useState<'all' | 'unread' | 'likes' | 'comments' | 'follows' | 'gifts'>('all');

  const userNotifications = notifications.filter(notif => notif.userId === loggedInUser);
  const userFollowRequests = followRequests.filter(req => req.toUserId === loggedInUser && req.status === 'pending');

  const filteredNotifications = useMemo(() => {
    let filtered = userNotifications;
    
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(notif => !notif.isRead);
        break;
      case 'likes':
        filtered = filtered.filter(notif => notif.type === 'like');
        break;
      case 'comments':
        filtered = filtered.filter(notif => notif.type === 'comment');
        break;
      case 'follows':
        filtered = filtered.filter(notif => notif.type === 'follow' || notif.type === 'follow_request');
        break;
      case 'gifts':
        filtered = filtered.filter(notif => notif.type === 'gift_received');
        break;
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [userNotifications, filter]);

  const unreadCount = userNotifications.filter(notif => !notif.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.userId === loggedInUser ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (type: SocialNotification['type']) => {
    switch (type) {
      case 'like': return <Heart size={20} className="text-red-500" />;
      case 'comment': return <MessageCircle size={20} className="text-blue-500" />;
      case 'follow': return <UserPlus size={20} className="text-green-500" />;
      case 'follow_request': return <UserPlus size={20} className="text-orange-500" />;
      case 'gift_received': return <Gift size={20} className="text-purple-500" />;
      case 'mention': return <Star size={20} className="text-yellow-500" />;
      default: return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type: SocialNotification['type']) => {
    switch (type) {
      case 'like': return 'bg-red-50 border-red-200';
      case 'comment': return 'bg-blue-50 border-blue-200';
      case 'follow': return 'bg-green-50 border-green-200';
      case 'follow_request': return 'bg-orange-50 border-orange-200';
      case 'gift_received': return 'bg-purple-50 border-purple-200';
      case 'mention': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const notifDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notifDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'همین الان';
    if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعت پیش`;
    return `${Math.floor(diffInMinutes / 1440)} روز پیش`;
  };

  const getSenderProfile = (senderId: string) => {
    return socialProfiles.find(p => p.userId === senderId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={24} className="text-blue-600" />
              <div>
                <CardTitle className="text-xl">اعلان‌ها</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount} اعلان خوانده نشده` : 'همه اعلان‌ها خوانده شده'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  className="rounded-xl"
                >
                  <Check size={16} className="ml-2" />
                  همه را خوانده علامت بزن
                </Button>
              )}
              <Button variant="ghost" className="rounded-xl p-2">
                <Settings size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent style={{ paddingTop: '0px' }}>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={filter === 'all' ? 'solid' : 'outline'}
              onClick={() => setFilter('all')}
              className="rounded-xl"
            >
              همه ({userNotifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'solid' : 'outline'}
              onClick={() => setFilter('unread')}
              className="rounded-xl"
            >
              خوانده نشده ({unreadCount})
            </Button>
            <Button
              variant={filter === 'likes' ? 'solid' : 'outline'}
              onClick={() => setFilter('likes')}
              className="rounded-xl"
            >
              <Heart size={16} className="ml-1" />
              پسندها
            </Button>
            <Button
              variant={filter === 'comments' ? 'solid' : 'outline'}
              onClick={() => setFilter('comments')}
              className="rounded-xl"
            >
              <MessageCircle size={16} className="ml-1" />
              نظرات
            </Button>
            <Button
              variant={filter === 'follows' ? 'solid' : 'outline'}
              onClick={() => setFilter('follows')}
              className="rounded-xl"
            >
              <UserPlus size={16} className="ml-1" />
              دنبال‌کنندگان
            </Button>
            <Button
              variant={filter === 'gifts' ? 'solid' : 'outline'}
              onClick={() => setFilter('gifts')}
              className="rounded-xl"
            >
              <Gift size={16} className="ml-1" />
              هدایا
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Follow Requests */}
      {userFollowRequests.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus size={20} />
              درخواست‌های دنبال کردن ({userFollowRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent style={{ paddingTop: '0px' }}>
            <div className="space-y-3">
              {userFollowRequests.map((request) => {
                const senderProfile = getSenderProfile(request.fromUserId);
                
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {senderProfile?.displayName.charAt(0) || '؟'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {senderProfile?.displayName || 'کاربر ناشناس'}
                        </div>
                        <div className="text-sm text-gray-600">
                          @{senderProfile?.username} می‌خواهد شما را دنبال کند
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTimeAgo(request.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => acceptFollowRequest(request.id)}
                        className="rounded-xl bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check size={16} className="ml-1" />
                        تایید
                      </Button>
                      <Button
                        onClick={() => rejectFollowRequest(request.id)}
                        variant="outline"
                        className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X size={16} className="ml-1" />
                        رد
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="p-12 text-center" style={{ paddingTop: '48px' }}>
              <Bell size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {filter === 'all' ? 'اعلانی وجود ندارد' : 'اعلان مطابق فیلتر یافت نشد'}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'وقتی کسی با پست‌های شما تعامل کند، اینجا نمایش داده می‌شود'
                  : 'فیلتر را تغییر دهید یا منتظر اعلان‌های جدید باشید'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification, index) => {
            const senderProfile = getSenderProfile(notification.fromUserId);
            
            return (
              <Card 
                key={`${notification.id}-${index}`} 
                className={`rounded-2xl transition-all hover:shadow-md ${
                  !notification.isRead ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
                }`}
              >
                <CardContent className="p-4" style={{ paddingTop: '24px' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex items-start gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {senderProfile?.displayName.charAt(0) || '؟'}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">
                              {senderProfile?.displayName || 'کاربر ناشناس'}
                            </span>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          className="rounded-xl p-2"
                          title="علامت‌گذاری به عنوان خوانده شده"
                        >
                          <Check size={16} />
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => deleteNotification(notification.id)}
                        variant="ghost"
                        className="rounded-xl p-2 text-red-600 hover:bg-red-50"
                        title="حذف اعلان"
                      >
                        <Trash2 size={16} />
                      </Button>
                      
                      <Button variant="ghost" className="rounded-xl p-2">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}