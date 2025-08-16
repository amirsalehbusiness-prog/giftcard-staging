import React, { useState, useMemo } from 'react';
import { 
  Search, 
  TrendingUp, 
  Users, 
  Hash, 
  MapPin, 
  Filter,
  UserPlus,
  UserCheck,
  Star,
  Gift,
  Calendar,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useSocial } from '../../contexts/SocialContext';
import { useUser } from '../../contexts/UserContext';
import { getUserInterestsSummary } from '../../data/interests';
import type { SocialProfile } from '../../types/social';

type SocialExploreProps = {
  onBack?: () => void;
};

export function SocialExplore({ onBack }: SocialExploreProps) {
  const { socialProfiles, socialPosts, followUser } = useSocial();
  const { userAccounts, loggedInUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'users' | 'posts' | 'hashtags'>('users');
  const [locationFilter, setLocationFilter] = useState('');

  const currentUserProfile = socialProfiles.find(p => p.userId === loggedInUser);

  // Trending hashtags (mock data)
  const trendingHashtags = [
    { tag: 'هدیه_همراه', count: 1250 },
    { tag: 'تولد_مبارک', count: 890 },
    { tag: 'کارت_هدیه', count: 654 },
    { tag: 'همراه_اول', count: 432 },
    { tag: 'جشن_تولد', count: 321 }
  ];

  // Suggested users based on interests and activity
  const suggestedUsers = useMemo(() => {
    return socialProfiles
      .filter(profile => profile.userId !== loggedInUser)
      .filter(profile => !currentUserProfile?.following.includes(profile.userId))
      .sort((a, b) => b.stats.followersCount - a.stats.followersCount)
      .slice(0, 10);
  }, [socialProfiles, loggedInUser, currentUserProfile]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    switch (searchType) {
      case 'users':
        return socialProfiles.filter(profile => 
          profile.displayName.toLowerCase().includes(query) ||
          profile.username.toLowerCase().includes(query) ||
          profile.bio?.toLowerCase().includes(query)
        );
      
      case 'posts':
        return socialPosts.filter(post => 
          post.content.toLowerCase().includes(query) ||
          post.giftData?.occasion.toLowerCase().includes(query)
        );
      
      case 'hashtags':
        return trendingHashtags.filter(hashtag => 
          hashtag.tag.toLowerCase().includes(query)
        );
      
      default:
        return [];
    }
  }, [searchQuery, searchType, socialProfiles, socialPosts]);

  const handleFollow = (userId: string) => {
    if (loggedInUser) {
      followUser(loggedInUser, userId);
    }
  };

  const isFollowing = (userId: string) => {
    return currentUserProfile?.following.includes(userId) || false;
  };

  const getUserAccount = (userId: string) => {
    return userAccounts.find(account => account.phone === userId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search Header */}
      <Card className="rounded-2xl">
        <CardContent className="p-6" style={{ paddingTop: '24px' }}>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو کاربران، پست‌ها، یا هشتگ‌ها..."
                className="rounded-2xl pr-12 text-lg py-3"
              />
            </div>

            {/* Search Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setSearchType('users')}
                  className={`px-4 py-2 text-sm transition-colors ${
                    searchType === 'users' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users size={16} className="inline ml-1" />
                  کاربران
                </button>
                <button
                  onClick={() => setSearchType('posts')}
                  className={`px-4 py-2 text-sm transition-colors border-x border-gray-300 ${
                    searchType === 'posts' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle size={16} className="inline ml-1" />
                  پست‌ها
                </button>
                <button
                  onClick={() => setSearchType('hashtags')}
                  className={`px-4 py-2 text-sm transition-colors ${
                    searchType === 'hashtags' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Hash size={16} className="inline ml-1" />
                  هشتگ‌ها
                </button>
              </div>

              {searchType === 'users' && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-600" />
                  <Input
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="فیلتر بر اساس موقعیت..."
                    className="rounded-xl w-48"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Results */}
          {searchQuery.trim() ? (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>
                  نتایج جستجو برای "{searchQuery}" 
                  <Badge className="rounded-xl mr-2">
                    {searchResults.length} نتیجه
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent style={{ paddingTop: '0px' }}>
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search size={48} className="mx-auto mb-4 opacity-50" />
                    <p>نتیجه‌ای یافت نشد</p>
                    <p className="text-sm mt-1">کلمات کلیدی دیگری را امتحان کنید</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchType === 'users' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(searchResults as SocialProfile[]).map((profile) => {
                          const userAccount = getUserAccount(profile.userId);
                          
                          return (
                            <div key={profile.id} className="border rounded-2xl p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                  {profile.displayName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-800">{profile.displayName}</h4>
                                    {profile.isVerified && (
                                      <Badge className="rounded-xl bg-blue-100 text-blue-800 text-xs">
                                        تایید شده
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">@{profile.username}</p>
                                </div>
                              </div>
                              
                              {profile.bio && (
                                <p className="text-sm text-gray-700 mb-3">{profile.bio}</p>
                              )}
                              
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <span>{profile.stats.followersCount} دنبال‌کننده</span>
                                <span>{profile.stats.postsCount} پست</span>
                                {profile.showGiftStats && (
                                  <span>{profile.stats.giftsReceived} هدیه</span>
                                )}
                              </div>
                              
                              <Button
                                onClick={() => handleFollow(profile.userId)}
                                variant={isFollowing(profile.userId) ? "outline" : "solid"}
                                className="w-full rounded-xl"
                                disabled={profile.userId === loggedInUser}
                              >
                                {profile.userId === loggedInUser ? 'شما' :
                                 isFollowing(profile.userId) ? (
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
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {searchType === 'posts' && (
                      <div className="space-y-4">
                        {searchResults.map((post: any) => {
                          const author = socialProfiles.find(p => p.userId === post.authorId);
                          
                          return (
                            <div key={post.id} className="border rounded-2xl p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                  {author?.displayName.charAt(0) || '؟'}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800">
                                    {author?.displayName || 'کاربر ناشناس'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                                  </div>
                                </div>
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
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {searchType === 'hashtags' && (
                      <div className="space-y-3">
                        {searchResults.map((hashtag: any) => (
                          <div key={hashtag.tag} className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Hash size={20} className="text-blue-500" />
                              <div>
                                <div className="font-semibold text-gray-800">#{hashtag.tag}</div>
                                <div className="text-sm text-gray-600">{hashtag.count.toLocaleString('fa-IR')} پست</div>
                              </div>
                            </div>
                            <TrendingUp size={16} className="text-green-500" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Trending Content */
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  محتوای ترند
                </CardTitle>
              </CardHeader>
              <CardContent style={{ paddingTop: '0px' }}>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">هشتگ‌های ترند</h4>
                    <div className="space-y-2">
                      {trendingHashtags.slice(0, 5).map((hashtag, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                            <Hash size={16} className="text-blue-500" />
                            <span className="font-medium">#{hashtag.tag}</span>
                          </div>
                          <span className="text-sm text-gray-600">{hashtag.count.toLocaleString('fa-IR')} پست</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Users */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                پیشنهاد دنبال کردن
              </CardTitle>
            </CardHeader>
            <CardContent style={{ paddingTop: '0px' }}>
              <div className="space-y-3">
                {suggestedUsers.slice(0, 5).map((profile) => {
                  const userAccount = getUserAccount(profile.userId);
                  
                  return (
                    <div key={profile.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {profile.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{profile.displayName}</div>
                          <div className="text-xs text-gray-600">@{profile.username}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleFollow(profile.userId)}
                        variant="outline"
                        className="rounded-xl text-xs px-3 py-1"
                      >
                        <UserPlus size={12} className="ml-1" />
                        دنبال
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star size={20} />
                آمار سریع
              </CardTitle>
            </CardHeader>
            <CardContent style={{ paddingTop: '0px' }}>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">کل کاربران:</span>
                  <span className="font-semibold">{socialProfiles.length.toLocaleString('fa-IR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">کل پست‌ها:</span>
                  <span className="font-semibold">{socialPosts.length.toLocaleString('fa-IR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">فعال امروز:</span>
                  <span className="font-semibold text-green-600">
                    {Math.floor(socialProfiles.length * 0.3).toLocaleString('fa-IR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}