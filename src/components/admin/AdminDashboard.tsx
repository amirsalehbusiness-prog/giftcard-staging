import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Settings, 
  LogOut, 
  Shield,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  UserPlus,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminUsersManager } from './AdminUsersManager';
import { BusinessPartnersManager } from './BusinessPartnersManager';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { formatPrice } from '../../utils/pricing';
import type { AdminUser } from '../../types/admin';

type AdminDashboardProps = {
  onLogout: () => void;
};

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { adminUsers, loggedInAdmin, businessPartners, analyticsData, setAnalyticsData } = useAdmin();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'users' | 'business' | 'settings'>('overview');
  
  const currentAdmin = adminUsers.find(admin => admin.username === loggedInAdmin);

  // Generate mock analytics data
  useEffect(() => {
    if (!analyticsData) {
      const mockData = {
        totalSales: 15750000,
        totalOrders: 342,
        totalUsers: 1250,
        salesByDay: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 500000) + 100000,
          orders: Math.floor(Math.random() * 20) + 5
        })),
        salesByWeek: Array.from({ length: 12 }, (_, i) => ({
          week: `هفته ${i + 1}`,
          amount: Math.floor(Math.random() * 2000000) + 500000,
          orders: Math.floor(Math.random() * 100) + 20
        })),
        salesByMonth: Array.from({ length: 6 }, (_, i) => ({
          month: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'][i],
          amount: Math.floor(Math.random() * 5000000) + 2000000,
          orders: Math.floor(Math.random() * 300) + 100
        })),
        voucherSales: [
          { voucherType: 'اینترنت', amount: 5200000, count: 120 },
          { voucherType: 'مکالمه', amount: 3800000, count: 95 },
          { voucherType: 'دیجی‌کالا', amount: 4200000, count: 78 },
          { voucherType: 'فلای‌تودی', amount: 2550000, count: 49 }
        ],
        topBusinessPartners: [
          { name: 'همراه اول', sales: 9000000 },
          { name: 'دیجی‌کالا', sales: 4200000 },
          { name: 'فلای‌تودی', sales: 2550000 }
        ],
        userGrowth: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          newUsers: Math.floor(Math.random() * 15) + 2,
          totalUsers: 1200 + i * 2
        }))
      };
      setAnalyticsData(mockData);
    }
  }, [analyticsData, setAnalyticsData]);

  const hasPermission = (permission: string) => {
    return currentAdmin?.permissions.includes(permission as any) || false;
  };

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Shield size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">دسترسی غیرمجاز</h2>
          <p className="text-gray-600 mb-4">لطفاً دوباره وارد شوید</p>
          <Button onClick={onLogout} className="rounded-xl">
            بازگشت به صفحه ورود
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">پنل مدیریت</h1>
                <p className="text-sm text-gray-600">
                  خوش آمدید، {currentAdmin.username} ({currentAdmin.role === 'super_admin' ? 'مدیر کل' : 'مدیر'})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="rounded-xl bg-green-100 text-green-800">
                آنلاین
              </Badge>
              <Button onClick={onLogout} variant="outline" className="rounded-xl">
                <LogOut size={18} className="ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl sticky top-24">
              <CardContent className="p-4" style={{ paddingTop: '24px' }}>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      activeTab === 'overview' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 size={20} />
                    <span>خلاصه</span>
                  </button>
                  
                  {hasPermission('analytics_view') && (
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        activeTab === 'analytics' 
                          ? 'bg-purple-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <TrendingUp size={20} />
                      <span>آنالیتیکس</span>
                    </button>
                  )}
                  
                  {hasPermission('admin_users_management') && (
                    <button
                      onClick={() => setActiveTab('users')}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        activeTab === 'users' 
                          ? 'bg-purple-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Users size={20} />
                      <span>مدیران</span>
                    </button>
                  )}
                  
                  {hasPermission('business_management') && (
                    <button
                      onClick={() => setActiveTab('business')}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        activeTab === 'business' 
                          ? 'bg-purple-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Building2 size={20} />
                      <span>کسب‌وکارها</span>
                      {businessPartners.length > 0 && (
                        <Badge className="rounded-full bg-orange-100 text-orange-800 text-xs">
                          {businessPartners.length}
                        </Badge>
                      )}
                    </button>
                  )}
                  
                  {hasPermission('system_settings') && (
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        activeTab === 'settings' 
                          ? 'bg-purple-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Settings size={20} />
                      <span>تنظیمات</span>
                    </button>
                  )}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                {analyticsData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="rounded-2xl">
                      <CardContent className="p-6" style={{ paddingTop: '24px' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">کل فروش</p>
                            <p className="text-2xl font-bold text-gray-800">
                              {formatPrice(analyticsData.totalSales)}
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center">
                            <DollarSign size={24} className="text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                      <CardContent className="p-6" style={{ paddingTop: '24px' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">کل سفارشات</p>
                            <p className="text-2xl font-bold text-gray-800">
                              {analyticsData.totalOrders.toLocaleString('fa-IR')}
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                            <ShoppingCart size={24} className="text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                      <CardContent className="p-6" style={{ paddingTop: '24px' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">کل کاربران</p>
                            <p className="text-2xl font-bold text-gray-800">
                              {analyticsData.totalUsers.toLocaleString('fa-IR')}
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                            <UserPlus size={24} className="text-purple-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                      <CardContent className="p-6" style={{ paddingTop: '24px' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">کسب‌وکارها</p>
                            <p className="text-2xl font-bold text-gray-800">
                              {businessPartners.length.toLocaleString('fa-IR')}
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                            <Building2 size={24} className="text-orange-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>فعالیت‌های اخیر</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                          <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <ShoppingCart size={16} className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">سفارش جدید</p>
                            <p className="text-xs text-gray-600">کارت هدیه ۵۰۰ هزار تومانی</p>
                          </div>
                          <span className="text-xs text-gray-500">۲ دقیقه پیش</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <UserPlus size={16} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">کاربر جدید</p>
                            <p className="text-xs text-gray-600">ثبت‌نام کاربر جدید</p>
                          </div>
                          <span className="text-xs text-gray-500">۱۵ دقیقه پیش</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                          <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Building2 size={16} className="text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">کسب‌وکار جدید</p>
                            <p className="text-xs text-gray-600">درخواست همکاری</p>
                          </div>
                          <span className="text-xs text-gray-500">۱ ساعت پیش</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>برترین کسب‌وکارها</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData?.topBusinessPartners.map((partner, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium">{partner.name}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {formatPrice(partner.sales)} تومان
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && hasPermission('analytics_view') && (
              <AnalyticsDashboard />
            )}

            {/* Admin Users Tab */}
            {activeTab === 'users' && hasPermission('admin_users_management') && (
              <AdminUsersManager />
            )}

            {/* Business Partners Tab */}
            {activeTab === 'business' && hasPermission('business_management') && (
              <BusinessPartnersManager />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && hasPermission('system_settings') && (
              <div className="space-y-6">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle>تنظیمات سیستم</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">تنظیمات سیستم در نسخه‌های آینده اضافه خواهد شد.</p>
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