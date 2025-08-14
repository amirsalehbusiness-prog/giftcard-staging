import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAdmin } from '../../contexts/AdminContext';
import { handleError } from '../../utils/errorHandling';

type AdminLoginProps = {
  onLogin: (username: string) => void;
  onBackToHome: () => void;
};

export function AdminLogin({ onLogin, onBackToHome }: AdminLoginProps) {
  const { adminUsers, setLoggedInAdmin } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('نام کاربری و رمز عبور الزامی است');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check admin credentials
      const adminUser = adminUsers.find(admin =>
        admin.username === username && admin.password === password && admin.isActive
      );

      if (adminUser) {
        // Update last login
        const updatedUsers = adminUsers.map(user =>
          user.id === adminUser.id
            ? { ...user, lastLogin: new Date().toISOString() }
            : user
        );
        // Note: In a real app, you'd call updateAdminUser here
        
        setLoggedInAdmin(adminUser.username);
        onLogin(adminUser.username);
      } else {
        setError('نام کاربری یا رمز عبور اشتباه است');
      }
    } catch (err) {
      setError(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
            <Shield size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">پنل مدیریت</h1>
          <p className="text-purple-200">ورود به داشبورد مدیریتی</p>
        </div>

        <Card className="rounded-3xl shadow-2xl border-purple-200/20 bg-white/95 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl text-gray-800">
              اطلاعات ورود مدیر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام کاربری
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="نام کاربری مدیر"
                    className="pr-10 rounded-xl border-purple-200 focus:ring-purple-500"
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
                    placeholder="رمز عبور"
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

              {/* Demo Credentials */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm">
                <div className="font-semibold text-purple-800 mb-2">اطلاعات ورود نمونه:</div>
                <div className="text-purple-700 space-y-1">
                  <div>نام کاربری: <code className="bg-purple-100 px-2 py-1 rounded">admin</code></div>
                  <div>رمز عبور: <code className="bg-purple-100 px-2 py-1 rounded">admin</code></div>
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
                    ورود به پنل مدیریت
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
          <p>سیستم مدیریت هدیه همراه</p>
          <p className="text-xs mt-1">نسخه ۱.۰.۰</p>
        </div>
      </div>
    </div>
  );
}