import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  Edit, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Globe, 
  Lock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  Gift,
  MessageCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useSocial } from '../contexts/SocialContext';
import { validatePhone } from '../utils/validation';

type SocialSetupProps = {
  userPhone: string;
  userName: string;
};

export function SocialSetup({ userPhone, userName }: SocialSetupProps) {
  const { socialProfiles, createSocialProfile, updateSocialProfile } = useSocial();
  const [step, setStep] = useState<'check' | 'setup' | 'profile'>('check');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    displayName: userName || '',
    bio: '',
    location: '',
    website: '',
    isPrivate: false,
    showInterests: true,
    showBirthday: true,
    showGiftStats: true
  });

  const existingProfile = socialProfiles.find(p => p.userId === userPhone);

  useEffect(() => {
    if (existingProfile) {
      setStep('profile');
      setFormData({
        username: existingProfile.username,
        displayName: existingProfile.displayName,
        bio: existingProfile.bio || '',
        location: existingProfile.location || '',
        website: existingProfile.website || '',
        isPrivate: existingProfile.isPrivate,
        showInterests: existingProfile.showInterests,
        showBirthday: existingProfile.showBirthday,
        showGiftStats: existingProfile.showGiftStats
      });
    } else {
      setStep('check');
      setFormData(prev => ({
        ...prev,
        username: `user_${userPhone.slice(-6)}`,
        displayName: userName || ''
      }));
    }
  }, [existingProfile, userPhone, userName]);

  const handleCreateProfile = () => {
    if (!formData.username.trim() || !formData.displayName.trim()) {
      alert('نام کاربری و نام نمایشی الزامی است');
      return;
    }

    // Check if username is already taken
    const usernameExists = socialProfiles.some(p => 
      p.username.toLowerCase() === formData.username.toLowerCase() && p.userId !== userPhone
    );

    if (usernameExists) {
      alert('این نام کاربری قبلاً انتخاب شده است');
      return;
    }

    createSocialProfile(userPhone, formData);
    setStep('profile');
  };

  const handleUpdateProfile = () => {
    if (!existingProfile) return;

    // Check if username is already taken by another user
    const usernameExists = socialProfiles.some(p => 
      p.username.toLowerCase() === formData.username.toLowerCase() && p.userId !== userPhone
    );

    if (usernameExists) {
      alert('این نام کاربری قبلاً انتخاب شده است');
      return;
    }

    updateSocialProfile(existingProfile.id, {
      ...formData,
      updatedAt: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const handleEnterSocialNetwork = () => {
    if (confirm('آیا می‌خواهید وارد شبکه اجتماعی هدیه همراه شوید؟')) {
      // Navigate to social network (this would be handled by parent component)
      window.location.hash = '#social';
      // In a real app, you might use React Router or similar
    }
  };

  // Step 1: Check if user wants social profile
  if (step === 'check') {
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white mx-auto mb-4">
                <Users size={32} />
              </div>
              <CardTitle className="text-xl mb-2">شبکه اجتماعی هدیه همراه</CardTitle>
              <p className="text-gray-600">
                با ایجاد پروفایل اجتماعی، می‌توانید با دوستان خود تعامل کنید و هدایا را به اشتراک بگذارید
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <MessageCircle size={32} className="mx-auto mb-2 text-blue-600" />
                  <h4 className="font-semibold text-gray-800 mb-1">چت و پیام</h4>
                  <p className="text-sm text-gray-600">با دوستان خود چت کنید</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                  <Gift size={32} className="mx-auto mb-2 text-green-600" />
                  <h4 className="font-semibold text-gray-800 mb-1">اشتراک هدایا</h4>
                  <p className="text-sm text-gray-600">هدایای خود را نمایش دهید</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <Star size={32} className="mx-auto mb-2 text-purple-600" />
                  <h4 className="font-semibold text-gray-800 mb-1">پروفایل شخصی</h4>
                  <p className="text-sm text-gray-600">پروفایل اجتماعی بسازید</p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-700 font-medium">
                  آیا می‌خواهید در شبکه اجتماعی هدیه همراه عضو شوید؟
                </p>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setStep('setup')}
                    className="rounded-xl bg-gradient-to-r from-[#0095da] to-[#ff4f00] text-white px-8"
                  >
                    <Users size={18} className="ml-2" />
                    بله، عضو می‌شوم
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="rounded-xl px-8"
                    onClick={() => {
                      // Maybe later functionality
                      alert('می‌توانید بعداً از طریق تنظیمات پروفایل اجتماعی ایجاد کنید');
                    }}
                  >
                    فعلاً نه
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Setup social profile
  if (step === 'setup') {
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              تنظیم پروفایل اجتماعی
            </CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              اطلاعات پروفایل اجتماعی خود را تکمیل کنید
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام کاربری * (منحصر به فرد)
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">@</span>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                    placeholder="username"
                    className="rounded-xl pr-8"
                    maxLength={20}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  فقط حروف انگلیسی، اعداد و _ مجاز است
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام نمایشی *
                </label>
                <Input
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="نام شما که دیگران می‌بینند"
                  className="rounded-xl"
                  required
                />
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData(prev => ({ ...prev, displayName: userName || '' }))}
                    className="rounded-lg text-xs px-3 py-1"
                  >
                    استفاده از نام حساب کاربری ({userName})
                  </Button>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  بیوگرافی (اختیاری)
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="کمی درباره خودتان بنویسید..."
                  rows={3}
                  className="rounded-xl"
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/150 کاراکتر
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موقعیت (اختیاری)
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="شهر یا کشور شما"
                  className="rounded-xl"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وب‌سایت (اختیاری)
                </label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                  className="rounded-xl"
                />
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
                <h4 className="font-semibold text-gray-800">تنظیمات حریم خصوصی</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {formData.isPrivate ? (
                      <Lock size={18} className="text-gray-600" />
                    ) : (
                      <Globe size={18} className="text-green-600" />
                    )}
                    <div>
                      <div className="font-medium text-gray-800">
                        {formData.isPrivate ? 'پروفایل خصوصی' : 'پروفایل عمومی'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formData.isPrivate 
                          ? 'فقط دنبال‌کنندگان تایید شده می‌توانند پست‌هایتان را ببینند'
                          : 'همه می‌توانند پست‌ها و پروفایل شما را ببینند'
                        }
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">نمایش علاقمندی‌ها</div>
                    <div className="text-sm text-gray-600">علاقمندی‌هایتان در پروفایل نمایش داده شود</div>
                  </div>
                  <Switch
                    checked={formData.showInterests}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showInterests: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">نمایش تاریخ تولد</div>
                    <div className="text-sm text-gray-600">تاریخ تولدتان در پروفایل نمایش داده شود</div>
                  </div>
                  <Switch
                    checked={formData.showBirthday}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showBirthday: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">نمایش آمار هدایا</div>
                    <div className="text-sm text-gray-600">آمار هدایای دریافتی و ارسالی نمایش داده شود</div>
                  </div>
                  <Switch
                    checked={formData.showGiftStats}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showGiftStats: checked }))}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateProfile}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#0095da] to-[#ff4f00] text-white"
                >
                  <Save size={18} className="ml-2" />
                  ایجاد پروفایل اجتماعی
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setStep('check')}
                  className="rounded-xl"
                >
                  <X size={18} className="ml-2" />
                  انصراف
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Manage existing profile
  if (step === 'profile' && existingProfile) {
    return (
      <div className="space-y-6">
        {/* Profile Overview */}
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                پروفایل اجتماعی شما
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="rounded-xl bg-green-100 text-green-800">
                  <CheckCircle size={14} className="ml-1" />
                  فعال
                </Badge>
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
            <div className="space-y-6">
              {/* Profile Preview */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl border border-blue-200">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {existingProfile.displayName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-800">{existingProfile.displayName}</h3>
                    {existingProfile.isVerified && (
                      <Badge className="rounded-xl bg-blue-100 text-blue-800 text-xs">
                        تایید شده
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">@{existingProfile.username}</p>
                  {existingProfile.bio && (
                    <p className="text-gray-700 text-sm mt-1">{existingProfile.bio}</p>
                  )}
                </div>
              </div>

              {/* Profile Stats */}
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-800">{existingProfile.stats.postsCount}</div>
                  <div className="text-sm text-gray-600">پست</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">{existingProfile.stats.followersCount}</div>
                  <div className="text-sm text-gray-600">دنبال‌کننده</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">{existingProfile.stats.followingCount}</div>
                  <div className="text-sm text-gray-600">دنبال شده</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">{existingProfile.stats.giftsReceived}</div>
                  <div className="text-sm text-gray-600">هدیه</div>
                </div>
              </div>

              {/* Edit Form */}
              {isEditing && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام کاربری
                      </label>
                      <div className="relative">
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">@</span>
                        <Input
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                          className="rounded-xl pr-8"
                          maxLength={20}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام نمایشی
                      </label>
                      <Input
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      بیوگرافی
                    </label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="کمی درباره خودتان بنویسید..."
                      rows={3}
                      className="rounded-xl"
                      maxLength={150}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        موقعیت
                      </label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="شهر یا کشور"
                        className="rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        وب‌سایت
                      </label>
                      <Input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://example.com"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleUpdateProfile}
                      className="rounded-xl bg-green-600 hover:bg-green-700"
                    >
                      <Save size={18} className="ml-2" />
                      ذخیره تغییرات
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="rounded-xl"
                    >
                      انصراف
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              {/* Enter Social Network */}
              <div className="text-center space-y-4">
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    آماده ورود به شبکه اجتماعی هستید؟
                  </h4>
                  <p className="text-gray-600 mb-4">
                    با دوستان خود چت کنید، پست بگذارید و هدایا را به اشتراک بگذارید
                  </p>
                  
                  <Button
                    onClick={handleEnterSocialNetwork}
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3"
                  >
                    <ArrowRight size={18} className="ml-2" />
                    ورود به شبکه اجتماعی
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}