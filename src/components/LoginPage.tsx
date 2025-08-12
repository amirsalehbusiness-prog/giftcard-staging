import { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, LogIn, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LoadingSpinner } from './common/LoadingSpinner';
import { useUser } from '../contexts/UserContext';
import { validatePhone } from '../utils/validation';
import { handleError } from '../utils/errorHandling';

type LoginPageProps = {
  onLogin: (phone: string) => void;
  onBackToHome: () => void;
  onLoginSuccess?: () => void; // ← اضافه شد
};

export function LoginPage({ onLogin, onBackToHome, onLoginSuccess }: LoginPageProps) {
  const { userAccounts, setLoggedInUser } = useUser();
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

      // Check login credentials
      const userAccount = userAccounts.find(account =>
        account.phone === phone && account.password === password
      );

      if (userAccount) {
        setLoggedInUser(phone);
        onLogin(phone);
        onLoginSuccess?.(); // ← فراخوانی بعد از ورود موفق
      } else {
        // Check if phone exists but password is wrong
        const phoneExists = userAccounts.find(acc => acc.phone === phone);
        if (phoneExists) {
          setError('رمز عبور اشتباه است.');
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
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#0095da]/10 to-[#ff4f00]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white mx-auto mb-4">
            <Gift size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ورود به حساب کاربری</h1>
          <p className="text-gray-600">برای دریافت کارت هدیه خود وارد شوید</p>
        </div>

        <Card className="rounded-3xl shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg">اطلاعات ورود</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شماره موبایل
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789"
                    className="pr-10 rounded-xl"
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
                    className="pr-10 pl-10 rounded-xl"
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

              {/* Demo Credentials */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm">
                <div className="font-semibold text-orange-800 mb-1">نکته مهم:</div>
                <div className="text-orange-700">
                  برای ورود، ابتدا باید کارت هدیه ایجاد کنید.<br />
                  سپس با شماره موبایل گیرنده و رمز تولید شده وارد شوید.
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-[#0095da] to-[#ff4f00] hover:opacity-90 text-white py-3"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="text-white" className="ml-2" />
                    در حال ورود...
                  </>
                ) : (
                  <>
                    <LogIn size={18} className="ml-2" />
                    ورود به حساب
                  </>
                )}
              </Button>

              {/* Back to Home */}
              <Button
                type="button"
                variant="outline"
                onClick={onBackToHome}
                className="w-full rounded-xl"
              >
                بازگشت به صفحه اصلی
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>مشکل در ورود دارید؟</p>
          <button className="text-[#0095da] hover:underline">
            درخواست رمز یکبار مصرف (OTP)
          </button>
        </div>
      </div>
    </div>
  );
}
