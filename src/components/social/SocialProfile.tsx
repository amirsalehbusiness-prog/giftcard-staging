import React, { useState, useMemo } from 'react';
import { 
  User, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Gift, 
  Heart, 
  Users, 
  Settings,
  UserPlus,
  UserCheck,
  MessageCircle,
  MoreHorizontal,
  Camera,
  Edit,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useSocial } from '../../contexts/SocialContext';
import { useUser } from '../../contexts/UserContext';
import { formatPrice } from '../../utils/pricing';
import { getUserInterestsSummary } from '../../data/interests';
import type { SocialProfile as SocialProfileType } from '../../types/social';

type SocialProfileProps = {
  profileId?: string;
  isOwnProfile?: boolean;
};

export function SocialProfile({ profileId, isOwnProfile = false }: SocialProfileProps) {
  const { socialProfiles, socialPosts, followUser } = useSocial();
  const { userAccounts, loggedInUser } = useUser();
  const [activeTab, setActiveTab] = useState<'posts' | 'gifts' | 'stats'>('posts');

  const profile = profileId 
    ? socialProfiles.find(p => p.id === profileId)
    : socialProfiles.find(p => p.userId === loggedInUser);

  const userAccount = profile ? userAccounts.find(u => u.phone === profile.userId) : null;
  const userPosts = socialPosts.filter(post => post.authorId === profile?.userId);
  const currentUserProfile = socialProfiles.find(p => p.userId === loggedInUser);

  const isFollowing = currentUserProfile?.following.includes(profile?.userId || '') || false;
  const isFollower = profile?.followers.includes(loggedInUser || '') || false;

  const giftStats = useMemo(() => {
    if (!userAccount?.giftCards) return { received: 0, given: 0, totalValue: 0 };
    
    const received = userAccount.giftCards.length;
    const totalValue = userAccount.giftCards.reduce((sum, card) => sum + (card.totalValue || card.totalPrice || 0), 0);
    
    return { received, given: 0, totalValue }; // TODO: Calculate given gifts
  }, [userAccount]);

  const handleFollow = () => {
    if (profile && loggedInUser && !isFollowing) {
      followUser(loggedInUser, profile.userId);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-2xl">
          <CardContent className="p-12 text-center" style={{ paddingTop: '48px' }}>
            <User size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">پروفایل یافت نشد</h3>
            <p className="text-gray-600">این کاربر هنوز پروفایل اجتماعی ندارد</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="rounded-2xl overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-[#0095da] to-[#ff4f00] relative">
          {/* Cover Image Placeholder */}
          <div className="absolute inset-0 bg-black/20"></div>
          {isOwnProfile && (
            <Button
              variant="outline"
              className="absolute top-4 right-4 rounded-xl bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Camera size={16} className="ml-2" />
              تغییر کاور
            </Button>
          )}
        </div>
        
        <CardContent className="relative" style={{ paddingTop: '0px' }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-16 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
              {/* Profile Image */}
              <div className="relative">
                <div className="h-32 w-32 rounded-2xl bg-white p-2 shadow-lg">
                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.displayName.charAt(0)}
                  </div>
                </div>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full p-2 bg-white shadow-lg"
                  >
                    <Camera size={16} />
                  </Button>
                )}
              </div>
              
              {/* Profile Info */}
              <div className="lg:mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-800">{profile.displayName}</h1>
                  {profile.isVerified && (
                    <Badge className="rounded-xl bg-blue-100 text-blue-800">
                      <Award size={12} className="ml-1" />
                      تایید شده
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-2">@{profile.username}</p>
                {profile.bio && (
                  <p className="text-gray-700 mb-3 max-w-md">{profile.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-1">
                      <LinkIcon size={16} />
                      <a href={profile.website} className="text-[#0095da] hover:underline">
                        وب‌سایت
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>عضو از {new Date(profile.createdAt).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 lg:mt-0">
              {isOwnProfile ? (
                <Button variant="outline" className="rounded-xl">
                  <Edit size={16} className="ml-2" />
                  ویرایش پروفایل
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "solid"}
                    className="rounded-xl"
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={16} className="ml-2" />
                        دنبال می‌کنید
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} className="ml-2" />
                        دنبال کردن
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    <MessageCircle size={16} className="ml-2" />
                    پیام
                  </Button>
                  <Button variant="ghost" className="rounded-xl p-2">
                    <MoreHorizontal size={18} />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{profile.stats.postsCount}</div>
              <div className="text-sm text-gray-600">پست</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{profile.stats.followersCount}</div>
              <div className="text-sm text-gray-600">دنبال‌کننده</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{profile.stats.followingCount}</div>
              <div className="text-sm text-gray-600">دنبال شده</div>
            </div>
            {profile.showGiftStats && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{giftStats.received}</div>
                  <div className="text-sm text-gray-600">هدیه دریافتی</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{formatPrice(giftStats.totalValue)}</div>
                  <div className="text-sm text-gray-600">ارزش کل (تومان)</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Interests */}
          {profile.showInterests && userAccount?.interests && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star size={18} />
                  علاقمندی‌ها
                </CardTitle>
              </CardHeader>
              <CardContent style={{ paddingTop: '0px' }}>
                <p className="text-sm text-gray-600">
                  {getUserInterestsSummary(userAccount.interests)}
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Gift Stats */}
          {profile.showGiftStats && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gift size={18} />
                  آمار هدایا
                </CardTitle>
              </CardHeader>
              <CardContent style={{ paddingTop: '0px' }}>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">هدایا دریافتی:</span>
                    <span className="font-semibold">{giftStats.received}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">کل ارزش:</span>
                    <span className="font-semibold">{formatPrice(giftStats.totalValue)} تومان</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Card className="rounded-2xl">
            <CardContent className="p-4" style={{ paddingTop: '24px' }}>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'posts' ? 'solid' : 'outline'}
                  onClick={() => setActiveTab('posts')}
                  className="rounded-xl"
                >
                  پست‌ها ({userPosts.length})
                </Button>
                <Button
                  variant={activeTab === 'gifts' ? 'solid' : 'outline'}
                  onClick={() => setActiveTab('gifts')}
                  className="rounded-xl"
                >
                  <Gift size={16} className="ml-1" />
                  هدایا ({giftStats.received})
                </Button>
                <Button
                  variant={activeTab === 'stats' ? 'solid' : 'outline'}
                  onClick={() => setActiveTab('stats')}
                  className="rounded-xl"
                >
                  <TrendingUp size={16} className="ml-1" />
                  آمار
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <Card className="rounded-2xl">
                  <CardContent className="p-12 text-center" style={{ paddingTop: '48px' }}>
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">هنوز پستی نداشته</h3>
                    <p className="text-gray-600">
                      {isOwnProfile ? 'اولین پست خود را بنویسید!' : 'این کاربر هنوز پستی منتشر نکرده'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                userPosts.map((post) => (
                  <Card key={post.id} className="rounded-2xl">
                    <CardContent className="p-4" style={{ paddingTop: '24px' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                        </div>
                        {post.type !== 'text' && (
                          <Badge className="rounded-xl text-xs">
                            {post.type === 'gift_received' ? '🎁 هدیه دریافت کرد' :
                             post.type === 'gift_given' ? '💝 هدیه داد' :
                             post.type === 'gift_used' ? '✨ از هدیه استفاده کرد' : ''}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-800 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart size={16} />
                          {post.likes.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          {post.comments.length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'gifts' && (
            <Card className="rounded-2xl">
              <CardContent className="p-12 text-center" style={{ paddingTop: '48px' }}>
                <Gift size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">بخش هدایا</h3>
                <p className="text-gray-600">نمایش تاریخچه هدایا در نسخه‌های آینده اضافه می‌شود</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'stats' && (
            <Card className="rounded-2xl">
              <CardContent className="p-12 text-center" style={{ paddingTop: '48px' }}>
                <TrendingUp size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">آمار تفصیلی</h3>
                <p className="text-gray-600">نمودارها و آمار تفصیلی در نسخه‌های آینده اضافه می‌شود</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}