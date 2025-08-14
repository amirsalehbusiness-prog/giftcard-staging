import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Shield, 
  User, 
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { useAdmin } from '../../contexts/AdminContext';
import { ADMIN_ROLES, PERMISSION_LABELS, type AdminUser, type AdminPermission } from '../../types/admin';

export function AdminUsersManager() {
  const { adminUsers, createAdminUser, updateAdminUser, deleteAdminUser } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin' as AdminUser['role'],
    permissions: [] as AdminPermission[],
    isActive: true
  });

  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      updateAdminUser(editingUser.id, {
        ...formData,
        permissions: ADMIN_ROLES.find(r => r.id === formData.role)?.permissions || []
      });
    } else {
      createAdminUser({
        ...formData,
        permissions: ADMIN_ROLES.find(r => r.id === formData.role)?.permissions || [],
        createdBy: 'admin' // In real app, get from current user
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'admin',
      permissions: [],
      isActive: true
    });
    setEditingUser(null);
    setShowAddModal(false);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      role: user.role,
      permissions: user.permissions,
      isActive: user.isActive
    });
    setShowAddModal(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟')) {
      deleteAdminUser(userId);
    }
  };

  const getRoleName = (role: string) => {
    return ADMIN_ROLES.find(r => r.id === role)?.name || role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analyst': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">مدیریت کاربران مدیریتی</h2>
          <p className="text-gray-600">مدیریت دسترسی‌ها و کاربران مدیریتی سیستم</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-purple-600 hover:bg-purple-700"
        >
          <Plus size={18} className="ml-2" />
          افزودن مدیر جدید
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
                  placeholder="جستجو در کاربران..."
                  className="rounded-xl pr-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">همه نقش‌ها</option>
                  {ADMIN_ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <Badge className="rounded-xl bg-purple-100 text-purple-800">
              {filteredUsers.length} کاربر
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="rounded-2xl hover:shadow-lg transition-shadow">
            <CardContent className="p-6" style={{ paddingTop: '24px' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{user.username}</h3>
                    <Badge className={`rounded-xl text-xs ${getRoleColor(user.role)}`}>
                      {getRoleName(user.role)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {user.isActive ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <XCircle size={20} className="text-red-500" />
                  )}
                  <Badge variant={user.isActive ? 'solid' : 'secondary'} className="rounded-xl text-xs">
                    {user.isActive ? 'فعال' : 'غیرفعال'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>ایجاد: {new Date(user.createdAt).toLocaleDateString('fa-IR')}</span>
                </div>
                
                {user.lastLogin && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield size={16} />
                    <span>آخرین ورود: {new Date(user.lastLogin).toLocaleDateString('fa-IR')}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">دسترسی‌ها:</div>
                <div className="flex flex-wrap gap-1">
                  {user.permissions.slice(0, 3).map((permission) => (
                    <Badge key={permission} variant="secondary" className="rounded-lg text-xs">
                      {PERMISSION_LABELS[permission]}
                    </Badge>
                  ))}
                  {user.permissions.length > 3 && (
                    <Badge variant="secondary" className="rounded-lg text-xs">
                      +{user.permissions.length - 3} مورد دیگر
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(user)}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  <Edit size={16} className="ml-2" />
                  ویرایش
                </Button>
                <Button
                  onClick={() => handleDelete(user.id)}
                  variant="outline"
                  className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                  disabled={user.role === 'super_admin'}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={resetForm}
          />
          
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">
                    {editingUser ? 'ویرایش مدیر' : 'افزودن مدیر جدید'}
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

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام کاربری *
                  </label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="نام کاربری"
                    className="rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رمز عبور *
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="رمز عبور"
                    className="rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نقش *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as AdminUser['role'] }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {ADMIN_ROLES.filter(role => role.id !== 'super_admin').map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-800">وضعیت فعال</div>
                    <div className="text-sm text-gray-600">کاربر می‌تواند وارد سیستم شود</div>
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
                    {editingUser ? 'به‌روزرسانی' : 'ایجاد مدیر'}
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