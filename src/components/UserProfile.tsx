import React, { useState, useMemo } from 'react';

import { 
  User, 
  Gift, 
  Calendar, 
  Settings, 
  LogOut, 
  Phone, 
  Mail, 
  Edit, 
  Save, 
  X,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Download,
  Share2,
  Eye,
  EyeOff,
  Filter,
  Search,
  Grid,
  List,
  MoreVertical,
  ShoppingCart
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useUser } from '../contexts/UserContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PersianCalendar } from './PersianCalendar';
import { PersianDatePicker } from './PersianDatePicker';
import { GiftCardDetails } from './GiftCardDetails';
import { UserInterestsManager } from './UserInterestsManager.tsx';
import { SocialSetup } from './SocialSetup';
import { CartManager } from './CartManager';
import { formatPrice } from '../utils/pricing';
import { OCCASIONS } from '../data/occasions';
import type { GiftCard, CartItem } from '../types';
import type { SavedDate } from '../types/calendar';

type UserProfileProps = {
  onLogout: () => void;
  onNavigateToSocial?: () => void;
};

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'active' | 'used' | 'expired';

export function UserProfile({ onLogout, onNavigateToSocial }: UserProfileProps) {
  const { userAccounts, loggedInUser, updateUserAccount, cartItems } = useUser();
  const [savedDates, setSavedDates] = useLocalStorage<SavedDate[]>('savedDates', []);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'giftCards' | 'cart' | 'calendar' | 'social' | 'settings'>('giftCards');
  const [isEditing, setIsEditing] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [showInterests, setShowInterests] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [giftCardView, setGiftCardView] = useState<'received' | 'sent'>('received');

  // Settings tab switches state
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Form states for editing
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    nationalId: '',
    birthDate: ''
  });

  const currentUser = userAccounts.find(user => user.phone === loggedInUser);

  React.useEffect(() => {
    if (currentUser && isEditing) {
      setEditForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        nationalId: currentUser.nationalId || '',
        birthDate: currentUser.birthDate || ''
      });
    }
  }, [currentUser, isEditing]);

  const handleSaveProfile = () => {
    if (currentUser) {
      updateUserAccount(currentUser.phone, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        nationalId: editForm.nationalId,
        birthDate: editForm.birthDate,
        name: `${editForm.firstName} ${editForm.lastName}`.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (currentUser) {
      setEditForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        nationalId: currentUser.nationalId || '',
        birthDate: currentUser.birthDate || ''
      });
    }
  };

  // Filter and search gift cards
  const filteredGiftCards = useMemo(() => {
    if (!currentUser?.giftCards) return [];
    
    let filtered = currentUser.giftCards;
    
    // Filter by view type (received vs sent)
    if (giftCardView === 'received') {
      // Show cards where current user is the recipient
      filtered = filtered.filter(card => 
        card.recipientPhone === currentUser.phone
      );
    } else if (giftCardView === 'sent') {
      // Show cards where current user is the sender
      filtered = filtered.filter(card => 
        card.senderPhone === currentUser.phone
      );
    }
    
    // Apply filter
    switch (filterType) {
      case 'active':
        filtered = filtered.filter(card => card.status === 'active');
        break;
      case 'used':
        filtered = filtered.filter(card => card.status === 'used');
        break;
      case 'expired':
        filtered = filtered.filter(card => card.status === 'expired');
        break;
    }
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(card => 
        card.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.occasion?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [currentUser?.giftCards, filterType, searchQuery, giftCardView, currentUser?.phone]);

  const getOccasionLabel = (occasion: string) => {
    const found = OCCASIONS.find(o => o.key === occasion);
    return found ? found.label : occasion;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'used': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'used': return <Clock size={16} />;
      case 'expired': return <AlertCircle size={16} />;
      default: return <Gift size={16} />;
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <AlertCircle size={48} className="mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">کاربر یافت نشد</h2>
        <p className="text-gray-600 mb-4">لطفاً دوباره وارد شوید</p>
        <Button onClick={onLogout} className="rounded-xl">
          بازگشت به صفحه ورود
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white">
                <User size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'کاربر'}
                </h1>
                <p className="text-sm text-gray-600">{currentUser.phone}</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline" className="rounded-xl">
              <LogOut size={18} className="ml-2" />
              خروج
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
                    onClick={() => setActiveTab('giftCards')}
                    className={`w-full flex items-center gap-3 px-3 py-3 mx-1 rounded-xl transition-all ${
                      activeTab === 'giftCards' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Gift size={20} />
                    <span>کارت‌های هدیه</span>
                    {currentUser.giftCards?.length > 0 && (
                      <Badge className="rounded-full bg-orange-100 text-orange-800 text-xs">
                        {currentUser.giftCards.length}
                      </Badge>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('cart')}
                    className={`w-full flex items-center gap-3 px-3 py-3 mx-1 rounded-xl transition-all ${
                      activeTab === 'cart' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ShoppingCart size={20} />
                    <span>سبد خرید</span>
                    {cartItems.length > 0 && (
                      <Badge className="rounded-full bg-red-100 text-red-800 text-xs">
                        {cartItems.length}
                      </Badge>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('calendar')}
                    className={`w-full flex items-center gap-3 px-3 py-3 mx-1 rounded-xl transition-all ${
                      activeTab === 'calendar' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Calendar size={20} />
                    <span>تقویم مناسبت</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('social')}
                    className={`w-full flex items-center gap-3 px-3 py-3 mx-1 rounded-xl transition-all ${
                      activeTab === 'social' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User size={20} />
                    <span>شبکه اجتماعی</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-3 mx-1 rounded-xl transition-all ${
                      activeTab === 'profile' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User size={20} />
                    <span>پروفایل</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-3 py-3 mx-1 rounded-xl transition-all ${
                      activeTab === 'settings' 
                        ? 'bg-[#0095da] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Settings size={20} />
                    <span>تنظیمات</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Overview */}
                <Card className="rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User size={20} />
                        اطلاعات شخصی
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">نمایش اطلاعات:</span>
                          <Switch
                            checked={showPersonalInfo}
                            onCheckedChange={setShowPersonalInfo}
                          />
                          {showPersonalInfo ? <Eye size={16} /> : <EyeOff size={16} />}
                        </div>
                        <Button
                          onClick={() => setIsEditing(!isEditing)}
                          variant={isEditing ? "outline" : "solid"}
                          className="rounded-xl"
                        >
                          {isEditing ? <X size={18} /> : <Edit size={18} />}
                          {isEditing ? 'انصراف' : 'ویرایش'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showPersonalInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
                          {isEditing ? (
                            <Input
                              value={editForm.firstName}
                              onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                              placeholder="نام خود را وارد کنید"
                              className="rounded-xl"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl">
                              {currentUser.firstName || 'وارد نشده'}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
                          {isEditing ? (
                            <Input
                              value={editForm.lastName}
                              onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                              placeholder="نام خانوادگی خود را وارد کنید"
                              className="rounded-xl"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl">
                              {currentUser.lastName || 'وارد نشده'}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">شماره موبایل</label>
                          <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                            <Phone size={16} className="inline ml-2" />
                            {currentUser.phone}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                          {isEditing ? (
                            <Input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="ایمیل خود را وارد کنید"
                              className="rounded-xl"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl">
                              <Mail size={16} className="inline ml-2" />
                              {currentUser.email || 'وارد نشده'}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">کد ملی</label>
                          {isEditing ? (
                            <Input
                              value={editForm.nationalId}
                              onChange={(e) => setEditForm(prev => ({ ...prev, nationalId: e.target.value }))}
                              placeholder="کد ملی خود را وارد کنید"
                              className="rounded-xl"
                              maxLength={10}
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl">
                              {currentUser.nationalId || 'وارد نشده'}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ تولد</label>
                          {isEditing ? (
                            <PersianDatePicker
                              value={editForm.birthDate}
                             onChange={(dateString) => setEditForm(prev => ({ ...prev, birthDate: dateString }))}
                              placeholder="تاریخ تولد را انتخاب کنید"
                              className="rounded-xl"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl">
                              {currentUser.birthDate ? new Date(currentUser.birthDate).toLocaleDateString('fa-IR') : 'وارد نشده'}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <EyeOff size={48} className="mx-auto mb-4 opacity-50" />
                        <p>اطلاعات شخصی مخفی شده است</p>
                        <p className="text-sm">برای نمایش، گزینه "نمایش اطلاعات" را فعال کنید</p>
                      </div>
                    )}

                    {isEditing && showPersonalInfo && (
                      <div className="flex gap-3 mt-6 pt-6 border-t">
                        <Button onClick={handleSaveProfile} className="rounded-xl">
                          <Save size={18} className="ml-2" />
                          ذخیره تغییرات
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" className="rounded-xl">
                          انصراف
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* User Interests */}
                <Card className="rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Star size={20} />
                        علاقمندی‌ها
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">نمایش علاقمندی‌ها:</span>
                          <Switch
                            checked={showInterests}
                            onCheckedChange={setShowInterests}
                          />
                          {showInterests ? <Eye size={16} /> : <EyeOff size={16} />}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showInterests ? (
                      <UserInterestsManager
                        userPhone={currentUser.phone}
                        currentInterests={currentUser.interests}
                        onUpdateInterests={(interests) => {
                          updateUserAccount(currentUser.phone, { interests });
                        }}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <EyeOff size={48} className="mx-auto mb-4 opacity-50" />
                        <p>علاقمندی‌ها مخفی شده است</p>
                        <p className="text-sm">برای مشاهده و ویرایش، گزینه "نمایش علاقمندی‌ها" را فعال کنید</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="rounded-2xl">
                    <CardContent className="p-6 text-center" style={{ paddingTop: '24px' }}>
                      <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-3">
                        <Gift size={24} />
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {currentUser.giftCards?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">کارت هدیه دریافتی</div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardContent className="p-6 text-center" style={{ paddingTop: '24px' }}>
                      <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-3">
                        <CheckCircle size={24} />
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {currentUser.giftCards?.filter(card => card.status === 'active').length || 0}
                      </div>
                      <div className="text-sm text-gray-600">کارت فعال</div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardContent className="p-6 text-center" style={{ paddingTop: '24px' }}>
                      <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mx-auto mb-3">
                        <Star size={24} />
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {formatPrice(currentUser.giftCards?.reduce((sum, card) => sum + (card.totalValue || card.totalPrice || 0), 0) || 0)}
                      </div>
                      <div className="text-sm text-gray-600">کل ارزش دریافتی (تومان)</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Gift Cards Tab */}
            {activeTab === 'giftCards' && (
              <div className="space-y-6">
                {/* Filters and Search */}
                <Card className="rounded-2xl">
                  <CardContent className="p-4" style={{ paddingTop: '20px' }}>
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                      <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-80">
                          <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="جستجو در کارت‌های هدیه..."
                            className="rounded-xl pr-10"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Filter size={18} className="text-gray-600" />
                          <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as FilterType)}
                            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0095da]"
                          >
                            <option value="all">همه</option>
                            <option value="active">فعال</option>
                            <option value="used">استفاده شده</option>
                            <option value="expired">منقضی</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setViewMode('grid')}
                          variant={viewMode === 'grid' ? 'solid' : 'outline'}
                          className="rounded-xl p-2"
                        >
                          <Grid size={18} />
                        </Button>
                        <Button
                          onClick={() => setViewMode('list')}
                          variant={viewMode === 'list' ? 'solid' : 'outline'}
                          className="rounded-xl p-2"
                        >
                          <List size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Gift Cards Display */}
                {/* Gift Card View Tabs */}
                <Card className="rounded-2xl">
                  <CardContent className="p-4" style={{ paddingTop: '24px' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">نوع کارت‌های هدیه</h3>
                      <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                        <button
                          onClick={() => setGiftCardView('received')}
                          className={`px-4 py-2 text-sm transition-colors ${
                            giftCardView === 'received' 
                              ? 'bg-[#0095da] text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Gift size={16} className="inline ml-1" />
                          دریافتی
                        </button>
                        <button
                          onClick={() => setGiftCardView('sent')}
                          className={`px-4 py-2 text-sm transition-colors border-r border-gray-300 ${
                            giftCardView === 'sent' 
                              ? 'bg-[#0095da] text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Gift size={16} className="inline ml-1" />
                          ارسالی
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {giftCardView === 'received' 
                        ? 'کارت‌های هدیه‌ای که دیگران برای شما خریده‌اند'
                        : 'کارت‌های هدیه‌ای که برای دیگران خریده‌اید در اینجا نمایش داده می‌شود'
                      }
                    </div>
                  </CardContent>
                </Card>
                {filteredGiftCards.length === 0 ? (
                  <Card className="rounded-2xl">
                    <CardContent className="p-12 text-center">
                      <Gift size={64} className="mx-auto mb-4 text-gray-300" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {searchQuery || filterType !== 'all' ? 'نتیجه‌ای یافت نشد' : 
                         giftCardView === 'received' ? 'هنوز کارت هدیه‌ای دریافت نکرده‌اید' : 
                         'هنوز کارت هدیه‌ای ارسال نکرده‌اید'}
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery || filterType !== 'all' 
                          ? 'فیلترها یا جستجو را تغییر دهید'
                          : giftCardView === 'received' 
                            ? 'کارت‌های هدیه دریافتی شما در اینجا نمایش داده می‌شود'
                            : 'کارت‌های هدیه ارسالی شما در اینجا نمایش داده می‌شود'
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
                    {filteredGiftCards.map((giftCard) => (
                      <GiftCardDetails 
                        key={giftCard.id} 
                        giftCard={giftCard}
                        onUseVoucher={(voucherId) => {
                          // Handle voucher usage
                          console.log('Using voucher:', voucherId);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === 'cart' && (
              <CartManager />
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
              <PersianCalendar
                userPhone={currentUser.phone}
                savedDates={savedDates}
                onSaveDates={setSavedDates}
              />
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <SocialSetup
                userPhone={currentUser.phone}
                userName={currentUser.name}
                onNavigateToSocial={onNavigateToSocial}
              />
            )}
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings size={20} />
                      تنظیمات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-800">اعلان‌های ایمیل</div>
                        <div className="text-sm text-gray-600">دریافت اعلان‌ها از طریق ایمیل</div>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-800">اعلان‌های پیامکی</div>
                        <div className="text-sm text-gray-600">دریافت اعلان‌ها از طریق پیامک</div>
                      </div>
                      <Switch checked={true} onCheckedChange={() => {}} />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-800">یادآوری تاریخ‌های مهم</div>
                        <div className="text-sm text-gray-600">یادآوری تولد و مناسبت‌های مهم</div>
                      </div>
                      <Switch checked={true} onCheckedChange={() => {}} />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800">مدیریت حساب</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="rounded-xl justify-start">
                          <Download size={18} className="ml-2" />
                          دانلود اطلاعات حساب
                        </Button>
                        
                        <Button variant="outline" className="rounded-xl justify-start text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 size={18} className="ml-2" />
                          حذف حساب کاربری
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}