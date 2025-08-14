import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Gift,
  Calendar,
  MapPin,
  Verified,
  Plus,
  Filter,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { useSocial } from '../../contexts/SocialContext';
import { useUser } from '../../contexts/UserContext';
import { formatPrice } from '../../utils/pricing';
import { OCCASIONS } from '../../data/occasions';
import type { SocialPost } from '../../types/social';

export function SocialFeed() {
  const { socialPosts, socialProfiles, likePost } = useSocial();
  const { loggedInUser } = useUser();
  const [filter, setFilter] = useState<'all' | 'following' | 'gifts'>('all');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const currentUserProfile = socialProfiles.find(p => p.userId === loggedInUser);

  const filteredPosts = useMemo(() => {
    let posts = socialPosts;
    
    if (filter === 'following' && currentUserProfile) {
      posts = posts.filter(post => 
        currentUserProfile.following.includes(post.authorId) || 
        post.authorId === loggedInUser
      );
    } else if (filter === 'gifts') {
      posts = posts.filter(post => 
        post.type === 'gift_received' || 
        post.type === 'gift_given' || 
        post.type === 'gift_used'
      );
    }
    
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [socialPosts, filter, currentUserProfile, loggedInUser]);

  const getPostAuthor = (authorId: string) => {
    return socialProfiles.find(p => p.userId === authorId);
  };

  const getOccasionLabel = (occasion: string) => {
    const found = OCCASIONS.find(o => o.key === occasion);
    return found ? found.label : occasion;
  };

  const getPostTypeIcon = (type: SocialPost['type']) => {
    switch (type) {
      case 'gift_received': return '🎁';
      case 'gift_given': return '💝';
      case 'gift_used': return '✨';
      case 'celebration': return '🎉';
      default: return '';
    }
  };

  const getPostTypeLabel = (type: SocialPost['type']) => {
    switch (type) {
      case 'gift_received': return 'هدیه دریافت کرد';
      case 'gift_given': return 'هدیه داد';
      case 'gift_used': return 'از هدیه استفاده کرد';
      case 'celebration': return 'جشن گرفت';
      default: return '';
    }
  };

  const handleLike = (postId: string) => {
    if (loggedInUser) {
      likePost(postId, loggedInUser);
    }
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
      {/* Feed Header */}
      <Card className="rounded-2xl">
        <CardContent className="p-4" style={{ paddingTop: '24px' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">فید اجتماعی</h2>
            <Button
              onClick={() => setShowCreatePost(true)}
              className="rounded-xl bg-gradient-to-r from-[#0095da] to-[#ff4f00]"
            >
              <Plus size={18} className="ml-2" />
              پست جدید
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'solid' : 'outline'}
              onClick={() => setFilter('all')}
              className="rounded-xl"
            >
              همه پست‌ها
            </Button>
            <Button
              variant={filter === 'following' ? 'solid' : 'outline'}
              onClick={() => setFilter('following')}
              className="rounded-xl"
            >
              دنبال شده‌ها
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

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-12 text-center" style={{ paddingTop: '48px' }}>
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {filter === 'following' ? 'هنوز کسی را دنبال نمی‌کنید' : 'هنوز پستی وجود ندارد'}
            </h3>
            <p className="text-gray-600">
              {filter === 'following' 
                ? 'کاربران جالب را پیدا کنید و دنبال کنید'
                : 'اولین نفری باشید که پست می‌گذارد!'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredPosts.map((post) => {
          const author = getPostAuthor(post.authorId);
          const isLiked = post.likes.includes(loggedInUser || '');
          
          return (
            <Card key={post.id} className="rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-0" style={{ paddingTop: '0px' }}>
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white font-bold">
                        {author?.displayName.charAt(0) || '؟'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {author?.displayName || 'کاربر ناشناس'}
                          </span>
                          {author?.isVerified && (
                            <Verified size={16} className="text-blue-500" />
                          )}
                          {post.type !== 'text' && (
                            <Badge className="rounded-xl text-xs bg-orange-100 text-orange-800">
                              {getPostTypeIcon(post.type)} {getPostTypeLabel(post.type)}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{author?.username} • {formatTimeAgo(post.createdAt)}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" className="rounded-xl p-2">
                      <MoreHorizontal size={18} />
                    </Button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                  
                  {/* Gift Data */}
                  {post.giftData && (
                    <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-4 mb-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift size={20} className="text-[#0095da]" />
                        <span className="font-semibold text-gray-800">
                          {getOccasionLabel(post.giftData.occasion)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {post.giftData.items.join('، ')}
                      </div>
                      <div className="text-lg font-bold text-[#0095da]">
                        {formatPrice(post.giftData.totalValue)} تومان
                      </div>
                    </div>
                  )}
                  
                  {/* Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4 rounded-2xl overflow-hidden">
                      {post.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
                          <span className="text-gray-500">🖼️ تصویر</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                        <span className="text-sm font-medium">{post.likes.length}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle size={20} />
                        <span className="text-sm font-medium">{post.comments.length}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                        <Share2 size={20} />
                        <span className="text-sm font-medium">{post.shares.length}</span>
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      {post.isPublic ? '🌍 عمومی' : '🔒 خصوصی'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}