import React, { useState } from 'react';
import { Users, Lock, User, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LoadingSpinner } from './common/LoadingSpinner';
import { useUser } from '../contexts/UserContext';
import { useSocial } from '../contexts/SocialContext';
import { validatePhone } from '../utils/validation';
import { handleError } from '../utils/errorHandling';

type SocialLoginProps = {
  onLogin: (phone: string) => void;
  onBackToHome: () => void;
};

export function SocialLogin({ onLogin, onBackToHome }: SocialLoginProps) {
  const { userAccounts } = useUser();
  const { socialProfiles } = useSocial();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setError('شماره موبایل معتبر نیست');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if user exists and has correct credentials
      const userAccount = userAccounts.find(account =>
        account.phone === phone && account.password === password
      );

      if (userAccount) {
        // Check if user has social profile
        const socialProfile = socialProfiles.find(p => p.userId === phone);
        
        if (socialProfile) {
          onLogin(phone);
        } else {
          setError('شما هنوز پروفایل اجتماعی ندارید. لطفاً ابتدا از طریق پروفایل کاربری، پروفایل اجتماعی ایجاد کنید.');
        }
      } else {
        // Check if phone exists but password is wrong
        const phoneExists = userAccounts.find(acc => acc.phone === phone);
        if (phoneExists) {
          setError(`رمز عبور اشتباه است. رمز عبور باید ${phone} باشد.`);
        } else {
          setError('شماره موبایل یا رمز عبور اشتباه است. لطفاً ابتدا کارت هدیه ایجاد کنید.');
        }
      }
    } catch (err) {
      setError(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
            <Users size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ورود به شبکه اجتماعی</h1>
          <p className="text-purple-200">با دوستان خود هدیه به اشتراک بگذارید</p>
        </div>

        <Card className="rounded-3xl shadow-2xl border-purple-200/20 bg-white/95 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl text-gray-800">
              ورود با اطلاعات حساب کاربری
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شماره موبایل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789"
                    className="pr-10 rounded-xl border-purple-200 focus:ring-purple-500"
                    maxLength={11}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رمز عبور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="رمز عبور خود را وارد کنید"
                    className="pr-10 pl-10 rounded-xl border-purple-200 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Info Box */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm">
                <div className="font-semibold text-purple-800 mb-2">نکته مهم:</div>
                <div className="text-purple-700 space-y-1">
                  <div>• برای ورود به شبکه اجتماعی، ابتدا باید حساب کاربری داشته باشید</div>
                  <div>• نام کاربری و رمز عبور همان اطلاعات حساب کاربری شماست</div>
                  <div>• اگر هنوز حساب ندارید، ابتدا کارت هدیه ایجاد کنید</div>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="text-white" className="ml-2" />
                    در حال ورود...
                  </>
                ) : (
                  <>
                    <LogIn size={18} className="ml-2" />
                    ورود به شبکه اجتماعی
                  </>
                )}
              </Button>

              {/* Back to Home */}
              <Button
                type="button"
                variant="outline"
                onClick={onBackToHome}
                className="w-full rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                بازگشت به صفحه اصلی
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-purple-200">
          <p>شبکه اجتماعی هدیه همراه</p>
          <p className="text-xs mt-1">با دوستان خود هدیه به اشتراک بگذارید</p>
        </div>
      </div>
    </div>
  );
}