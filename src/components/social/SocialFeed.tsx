import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Gift,
  TrendingUp,
  Users,
  Filter,
  RefreshCw,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CreatePostModal } from './CreatePostModal';
import { useSocial } from '../../contexts/SocialContext';
import { useUser } from '../../contexts/UserContext';
import { OCCASIONS } from '../../data/occasions';
import { formatPrice } from '../../utils/pricing';
import type { SocialPost } from '../../types/social';

export function SocialFeed() {
  const { socialPosts, socialProfiles, likePost } = useSocial();
  const { loggedInUser, userAccounts } = useUser();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'gifts' | 'trending'>('all');

  const currentUserProfile = socialProfiles.find(p => p.userId === loggedInUser);

  const filteredPosts = useMemo(() => {
    let filtered = socialPosts;

    switch (feedFilter) {
      case 'following':
        if (currentUserProfile) {
          filtered = filtered.filter(post => 
            currentUserProfile.following.includes(post.authorId) || post.authorId === loggedInUser
          );
        }
        break;
      case 'gifts':
        filtered = filtered.filter(post => 
          post.type === 'gift_received' || post.type === 'gift_given' || post.type === 'gift_used'
        );
        break;
      case 'trending':
        filtered = filtered.filter(post => post.likes.length > 0 || post.comments.length > 0);
        break;
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [socialPosts, feedFilter, currentUserProfile, loggedInUser]);

  const handleLike = (postId: string) => {
    if (loggedInUser) {
      likePost(postId, loggedInUser);
    }
  };

  const getAuthorProfile = (authorId: string) => {
    return socialProfiles.find(p => p.userId === authorId);
  };

  const getOccasionLabel = (occasion: string) => {
    const found = OCCASIONS.find(o => o.key === occasion);
    return found ? found.label : occasion;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'همین الان';
    if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعت پیش`;
    return `${Math.floor(diffInMinutes / 1440)} روز پیش`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card className="rounded-2xl">
        <CardContent className="p-4" style={{ paddingTop: '24px' }}>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {currentUserProfile?.displayName.charAt(0) || '؟'}
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex-1 text-right bg-gray-100 hover:bg-gray-200 rounded-2xl px-4 py-3 text-gray-600 transition-colors"
            >
              چه خبر؟ چیزی برای به اشتراک گذاشتن دارید؟
            </button>
            <Button
              onClick={() => setShowCreatePost(true)}
              className="rounded-xl bg-gradient-to-r from-[#0095da] to-[#ff4f00] text-white"
            >
              <Plus size={18} className="ml-2" />
              پست جدید
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed Filters */}
      <Card className="rounded-2xl">
        <CardContent className="p-4" style={{ paddingTop: '24px' }}>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={feedFilter === 'all' ? 'solid' : 'outline'}
                onClick={() => setFeedFilter('all')}
                className="rounded-xl"
              >
                <TrendingUp size={16} className="ml-1" />
                همه
              </Button>
              <Button
                variant={feedFilter === 'following' ? 'solid' : 'outline'}
                onClick={() => setFeedFilter('following')}
                className="rounded-xl"
              >
                <Users size={16} className="ml-1" />
                دنبال شده‌ها
              </Button>
              <Button
                variant={feedFilter === 'gifts' ? 'solid' : 'outline'}
                onClick={() => setFeedFilter('gifts')}
                className="rounded-xl"
              >
                <Gift size={16} className="ml-1" />
                هدایا
              </Button>
              <Button
                variant={feedFilter === 'trending' ? 'solid' : 'outline'}
                onClick={() => setFeedFilter('trending')}
                className="rounded-xl"
              >
                <Star size={16} className="ml-1" />
                ترند
              </Button>
            </div>
            
            <Button variant="ghost" className="rounded-xl p-2">
              <RefreshCw size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="p-12 text-center" style={{ paddingTop: '48px' }}>
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feedFilter === 'all' ? 'هنوز پستی وجود ندارد' :
                 feedFilter === 'following' ? 'هیچ پستی از دنبال شده‌هایتان' :
                 feedFilter === 'gifts' ? 'هیچ پست هدیه‌ای' :
                 'هیچ پست ترندی'}
              </h3>
              <p className="text-gray-600">
                {feedFilter === 'all' ? 'اولین نفری باشید که پست می‌گذارد!' :
                 feedFilter === 'following' ? 'کاربران بیشتری را دنبال کنید' :
                 feedFilter === 'gifts' ? 'هنوز کسی هدیه‌ای به اشتراک نگذاشته' :
                 'منتظر پست‌های محبوب باشید'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => {
            const author = getAuthorProfile(post.authorId);
            const isLiked = post.likes.includes(loggedInUser || '');
            
            return (
              <Card key={post.id} className="rounded-2xl hover:shadow-lg transition-shadow">
                <CardContent className="p-6" style={{ paddingTop: '24px' }}>
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {author?.displayName.charAt(0) || '؟'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-800">
                            {author?.displayName || 'کاربر ناشناس'}
                          </h4>
                          {author?.isVerified && (
                            <Badge className="rounded-xl bg-blue-100 text-blue-800 text-xs">
                              تایید شده
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>@{author?.username || 'username'}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" className="rounded-xl p-2">
                      <MoreHorizontal size={18} />
                    </Button>
                  </div>

                  {/* Post Type Badge */}
                  {post.type !== 'text' && (
                    <div className="mb-3">
                      <Badge className="rounded-xl">
                        {post.type === 'gift_received' ? '🎁 هدیه دریافت کرد' :
                         post.type === 'gift_given' ? '💝 هدیه داد' :
                         post.type === 'gift_used' ? '✨ از هدیه استفاده کرد' :
                         post.type === 'celebration' ? '🎉 جشن می‌گیرد' : ''}
                      </Badge>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed">{post.content}</p>
                  </div>

                  {/* Gift Data */}
                  {post.giftData && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift size={18} className="text-purple-600" />
                        <span className="font-semibold text-purple-800">
                          {getOccasionLabel(post.giftData.occasion)}
                        </span>
                      </div>
                      <div className="text-sm text-purple-700 mb-2">
                        ارزش: {formatPrice(post.giftData.totalValue)} تومان
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {post.giftData.items.map((item, index) => (
                          <Badge key={index} variant="secondary" className="rounded-lg text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mb-4">
                      <div className={`grid gap-2 rounded-2xl overflow-hidden ${
                        post.images.length === 1 ? 'grid-cols-1' :
                        post.images.length === 2 ? 'grid-cols-2' :
                        'grid-cols-2'
                      }`}>
                        {post.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            <img
                              src={image}
                              alt=""
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                        <span className="text-sm font-medium">{post.likes.length}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                        <MessageCircle size={20} />
                        <span className="text-sm font-medium">{post.comments.length}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                        <Share2 size={20} />
                        <span className="text-sm font-medium">{post.shares.length}</span>
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {post.isPublic ? '🌍 عمومی' : '🔒 خصوصی'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </div>
  );
}