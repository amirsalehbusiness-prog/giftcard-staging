import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Bell, 
  MessageCircle, 
  User, 
  Users,
  TrendingUp,
  Settings,
  Gift
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { SocialFeed } from './SocialFeed';
import { SocialProfile } from './SocialProfile';
import { SocialMessaging } from './SocialMessaging';
import { SocialNotifications } from './SocialNotifications';
import { SocialExplore } from './SocialExplore';
import { useSocial } from '../../contexts/SocialContext';
import { useUser } from '../../contexts/UserContext';

type SocialLayoutProps = {
  onBackToMain: () => void;
};

export function SocialLayout({ onBackToMain }: SocialLayoutProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'profile' | 'messages' | 'notifications'>('feed');
  const { socialProfiles, notifications } = useSocial();
  const { loggedInUser } = useUser();

  const currentUserProfile = socialProfiles.find(p => p.userId === loggedInUser);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white">
                <Users size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">شبکه اجتماعی هدیه همراه</h1>
                <p className="text-sm text-gray-600">با دوستان خود هدیه به اشتراک بگذارید</p>
              </div>
            </div>
            <Button onClick={onBackToMain} variant="outline" className="rounded-xl">
              بازگشت به اصلی
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl sticky top-24">
              <CardContent className="p-4" style={{ paddingTop: '24px' }}>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('feed')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      activeTab === 'feed' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Home size={20} />
                    <span>خانه</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('explore')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      activeTab === 'explore' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Search size={20} />
                    <span>کاوش</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      activeTab === 'notifications' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Bell size={20} />
                    <span>اعلان‌ها</span>
                    {unreadNotifications > 0 && (
                      <Badge className="rounded-full bg-red-500 text-white text-xs min-w-[20px] h-5">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      activeTab === 'messages' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MessageCircle size={20} />
                    <span>پیام‌ها</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      activeTab === 'profile' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User size={20} />
                    <span>پروفایل</span>
                  </button>
                </nav>

                {/* Quick Stats */}
                {currentUserProfile && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-3">آمار سریع</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">پست‌ها:</span>
                        <span className="font-medium">{currentUserProfile.stats.postsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">دنبال‌کننده:</span>
                        <span className="font-medium">{currentUserProfile.stats.followersCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">دنبال شده:</span>
                        <span className="font-medium">{currentUserProfile.stats.followingCount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'feed' && <SocialFeed />}
            
            {activeTab === 'explore' && (
              <SocialExplore />
            )}
            
            {activeTab === 'notifications' && (
              <SocialNotifications />
            )}
            
            {activeTab === 'messages' && (
              <SocialMessaging />
            )}
            
            {activeTab === 'profile' && (
              <SocialProfile isOwnProfile={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}