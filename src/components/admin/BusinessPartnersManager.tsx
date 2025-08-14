import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  Building2, 
  Settings, 
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ExternalLink,
  Key,
  Shield
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { useAdmin } from '../../contexts/AdminContext';
import type { BusinessPartner, VoucherType } from '../../types/admin';

export function BusinessPartnersManager() {
  const { businessPartners, createBusinessPartner, updateBusinessPartner, deleteBusinessPartner } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<BusinessPartner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    logoUrl: '',
    category: 'ecommerce' as BusinessPartner['category'],
    apiConfig: {
      baseUrl: '',
      apiKey: 'your-api-key',
      authType: 'api_key' as BusinessPartner['apiConfig']['authType'],
      endpoints: {
        vouchers: '/vouchers',
        validate: '/validate',
        redeem: '/redeem'
      }
    },
    voucherTypes: [] as VoucherType[],
    isActive: true
  });

  const categories = [
    { value: 'telecom', label: 'مخابرات', icon: '📱' },
    { value: 'ecommerce', label: 'فروشگاه آنلاین', icon: '🛒' },
    { value: 'travel', label: 'سفر و گردشگری', icon: '✈️' },
    { value: 'food', label: 'غذا و رستوران', icon: '🍕' },
    { value: 'entertainment', label: 'سرگرمی', icon: '🎮' },
    { value: 'other', label: 'سایر', icon: '🏢' }
  ];

  const authTypes = [
    { value: 'api_key', label: 'API Key' },
    { value: 'oauth', label: 'OAuth 2.0' },
    { value: 'basic_auth', label: 'Basic Auth' }
  ];

  const filteredPartners = businessPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || partner.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPartner) {
      updateBusinessPartner(editingPartner.id, formData);
    } else {
      createBusinessPartner(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      website: '',
      logoUrl: '',
      category: 'ecommerce',
      apiConfig: {
        baseUrl: '',
        apiKey: '',
        authType: 'api_key',
        endpoints: {
          vouchers: '/vouchers',
          validate: '/validate',
          redeem: '/redeem'
        }
      },
      voucherTypes: [],
      isActive: true
    });
    setEditingPartner(null);
    setShowAddModal(false);
  };

  const handleEdit = (partner: BusinessPartner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      website: partner.website,
      logoUrl: partner.logoUrl || '',
      category: partner.category,
      apiConfig: partner.apiConfig,
      voucherTypes: partner.voucherTypes,
      isActive: partner.isActive
    });
    setShowAddModal(true);
  };

  const handleDelete = (partnerId: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این کسب‌وکار را حذف کنید؟')) {
      deleteBusinessPartner(partnerId);
    }
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[categories.length - 1];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'telecom': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ecommerce': return 'bg-green-100 text-green-800 border-green-200';
      case 'travel': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'food': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'entertainment': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">مدیریت کسب‌وکارها</h2>
          <p className="text-gray-600">مدیریت شرکای تجاری و تنظیمات API</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-purple-600 hover:bg-purple-700"
        >
          <Plus size={18} className="ml-2" />
          افزودن کسب‌وکار جدید
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl">
        <CardContent className="p-4" style={{ paddingTop: '24px' }}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در کسب‌وکارها..."
                  className="rounded-xl pr-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">همه دسته‌ها</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Badge className="rounded-xl bg-purple-100 text-purple-800">
              {filteredPartners.length} کسب‌وکار
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Partners List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPartners.map((partner) => {
          const categoryInfo = getCategoryInfo(partner.category);
          
          return (
            <Card key={partner.id} className="rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-6" style={{ paddingTop: '24px' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
                      {categoryInfo.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{partner.name}</h3>
                      <Badge className={`rounded-xl text-xs ${getCategoryColor(partner.category)}`}>
                        {categoryInfo.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {partner.isActive ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <Badge variant={partner.isActive ? 'solid' : 'secondary'} className="rounded-xl text-xs">
                      {partner.isActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe size={16} />
                    <a 
                      href={partner.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-purple-600 transition-colors"
                    >
                      {partner.website}
                    </a>
                    <ExternalLink size={12} />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Key size={16} />
                    <span>API: {authTypes.find(t => t.value === partner.apiConfig.authType)?.label}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield size={16} />
                    <span>ووچرها: {partner.voucherTypes.length} نوع</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">API Endpoints:</div>
                  <div className="bg-gray-50 rounded-xl p-3 text-xs font-mono space-y-1">
                    <div>Vouchers: {partner.apiConfig.endpoints.vouchers}</div>
                    <div>Validate: {partner.apiConfig.endpoints.validate}</div>
                    <div>Redeem: {partner.apiConfig.endpoints.redeem}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(partner)}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    <Edit size={16} className="ml-2" />
                    ویرایش
                  </Button>
                  <Button
                    onClick={() => handleDelete(partner.id)}
                    variant="outline"
                    className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={resetForm}
          />
          
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">
                    {editingPartner ? 'ویرایش کسب‌وکار' : 'افزودن کسب‌وکار جدید'}
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={resetForm}
                    className="rounded-xl p-2"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">اطلاعات پایه</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام کسب‌وکار *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="نام کسب‌وکار"
                        className="rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        دسته‌بندی *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as BusinessPartner['category'] }))}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.icon} {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      آدرس وب‌سایت *
                    </label>
                    <Input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.com"
                      className="rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      آدرس لوگو (اختیاری)
                    </label>
                    <Input
                      type="url"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {/* API Configuration */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">تنظیمات API</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base URL *
                      </label>
                      <Input
                        type="url"
                        value={formData.apiConfig.baseUrl}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          apiConfig: { ...prev.apiConfig, baseUrl: e.target.value }
                        }))}
                        placeholder="https://api.example.com"
                        className="rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع احراز هویت *
                      </label>
                      <select
                        value={formData.apiConfig.authType}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          apiConfig: { ...prev.apiConfig, authType: e.target.value as BusinessPartner['apiConfig']['authType'] }
                        }))}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        {authTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <Input
                      type="password"
                      value={formData.apiConfig.apiKey}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        apiConfig: { ...prev.apiConfig, apiKey: e.target.value }
                      }))}
                      placeholder="API Key"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vouchers Endpoint
                      </label>
                      <Input
                        value={formData.apiConfig.endpoints.vouchers}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          apiConfig: { 
                            ...prev.apiConfig, 
                            endpoints: { ...prev.apiConfig.endpoints, vouchers: e.target.value }
                          }
                        }))}
                        placeholder="/vouchers"
                        className="rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Validate Endpoint
                      </label>
                      <Input
                        value={formData.apiConfig.endpoints.validate}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          apiConfig: { 
                            ...prev.apiConfig, 
                            endpoints: { ...prev.apiConfig.endpoints, validate: e.target.value }
                          }
                        }))}
                        placeholder="/validate"
                        className="rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Redeem Endpoint
                      </label>
                      <Input
                        value={formData.apiConfig.endpoints.redeem}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          apiConfig: { 
                            ...prev.apiConfig, 
                            endpoints: { ...prev.apiConfig.endpoints, redeem: e.target.value }
                          }
                        }))}
                        placeholder="/redeem"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-800">وضعیت فعال</div>
                    <div className="text-sm text-gray-600">کسب‌وکار در سیستم فعال باشد</div>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700"
                  >
                    {editingPartner ? 'به‌روزرسانی' : 'ایجاد کسب‌وکار'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1 rounded-xl"
                  >
                    انصراف
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}