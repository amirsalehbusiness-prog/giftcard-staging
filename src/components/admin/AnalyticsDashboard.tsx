import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAdmin } from '../../contexts/AdminContext';
import { formatPrice } from '../../utils/pricing';

export function AnalyticsDashboard() {
  const { analyticsData } = useAdmin();
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month'>('day');
  const [voucherFilter, setVoucherFilter] = useState<string>('all');

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">در حال بارگذاری داده‌های آنالیتیکس...</p>
        </div>
      </div>
    );
  }

  const getFilteredData = () => {
    switch (timeFilter) {
      case 'week':
        return analyticsData.salesByWeek;
      case 'month':
        return analyticsData.salesByMonth;
      default:
        return analyticsData.salesByDay.slice(-7); // Last 7 days
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">آنالیتیکس و گزارش‌ها</h2>
          <p className="text-gray-600">تحلیل عملکرد و آمار فروش</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl">
            <Download size={18} className="ml-2" />
            خروجی Excel
          </Button>
          <Button variant="outline" className="rounded-xl">
            <RefreshCw size={18} className="ml-2" />
            به‌روزرسانی
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-600" />
                <span className="text-sm font-medium">بازه زمانی:</span>
                <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setTimeFilter('day')}
                    className={`px-3 py-2 text-sm transition-colors ${
                      timeFilter === 'day' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    روزانه
                  </button>
                  <button
                    onClick={() => setTimeFilter('week')}
                    className={`px-3 py-2 text-sm transition-colors border-x border-gray-300 ${
                      timeFilter === 'week' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    هفتگی
                  </button>
                  <button
                    onClick={() => setTimeFilter('month')}
                    className={`px-3 py-2 text-sm transition-colors ${
                      timeFilter === 'month' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ماهانه
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <select
                  value={voucherFilter}
                  onChange={(e) => setVoucherFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">همه ووچرها</option>
                  <option value="internet">اینترنت</option>
                  <option value="voice">مکالمه</option>
                  <option value="digikala">دیجی‌کالا</option>
                  <option value="flytoday">فلای‌تودی</option>
                </select>
              </div>
            </div>

            <Badge className="rounded-xl bg-purple-100 text-purple-800">
              آخرین به‌روزرسانی: امروز
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل فروش</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatPrice(analyticsData.totalSales)}
                </p>
                <p className="text-xs text-green-600 mt-1">↗ +12.5% نسبت به ماه قبل</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل سفارشات</p>
                <p className="text-2xl font-bold text-gray-800">
                  {analyticsData.totalOrders.toLocaleString('fa-IR')}
                </p>
                <p className="text-xs text-green-600 mt-1">↗ +8.2% نسبت به ماه قبل</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <ShoppingCart size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل کاربران</p>
                <p className="text-2xl font-bold text-gray-800">
                  {analyticsData.totalUsers.toLocaleString('fa-IR')}
                </p>
                <p className="text-xs text-green-600 mt-1">↗ +15.3% نسبت به ماه قبل</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Users size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">میانگین سفارش</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatPrice(Math.round(analyticsData.totalSales / analyticsData.totalOrders))}
                </p>
                <p className="text-xs text-red-600 mt-1">↘ -2.1% نسبت به ماه قبل</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <TrendingUp size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} />
              نمودار فروش ({timeFilter === 'day' ? 'روزانه' : timeFilter === 'week' ? 'هفتگی' : 'ماهانه'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 p-4">
              {filteredData.map((item, index) => {
                const maxAmount = Math.max(...filteredData.map(d => d.amount));
                const height = (item.amount / maxAmount) * 200;
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div className="text-xs text-gray-600 text-center">
                      {formatPrice(item.amount)}
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${height}px`, minHeight: '20px' }}
                    />
                    <div className="text-xs text-gray-500 text-center">
                      {timeFilter === 'day' 
                        ? new Date((item as any).date || '').getDate().toString()
                        : timeFilter === 'week' 
                        ? (item as any).week 
                        : (item as any).month
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Voucher Sales */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart size={20} />
              فروش بر اساس نوع ووچر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.voucherSales.map((voucher, index) => {
                const totalSales = analyticsData.voucherSales.reduce((sum, v) => sum + v.amount, 0);
                const percentage = (voucher.amount / totalSales) * 100;
                
                const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500'];
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                        <span className="font-medium">{voucher.voucherType}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(voucher.amount)} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {voucher.count.toLocaleString('fa-IR')} سفارش
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Business Partners */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>برترین شرکای تجاری</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topBusinessPartners.map((partner, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{partner.name}</div>
                    <div className="text-sm text-gray-600">شریک تجاری</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">
                    {formatPrice(partner.sales)} تومان
                  </div>
                  <div className="text-sm text-gray-600">
                    {((partner.sales / analyticsData.totalSales) * 100).toFixed(1)}% از کل فروش
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}