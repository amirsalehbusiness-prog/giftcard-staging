import React, { useState, useEffect } from 'react';
import { X, Calendar, Bell, Mail, MessageSquare, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import type { SavedDate } from '../types/calendar';
import { formatPersianNumber } from '../utils/persianCalendar';

type AddDateModalProps = {
  selectedDate: { year?: number; month: number; day: number };
  editingDate: SavedDate | null;
  userPhone: string;
  onSave: (dateData: Omit<SavedDate, 'id' | 'createdAt'>) => void;
  onClose: () => void;
};

export function AddDateModal({ selectedDate, editingDate, userPhone, onSave, onClose }: AddDateModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SavedDate['category']>('other');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDays, setReminderDays] = useState(1);
  const [emailReminder, setEmailReminder] = useState(true);
  const [smsReminder, setSmsReminder] = useState(true);
  const [selectedYear, setSelectedYear] = useState(selectedDate.year || new Date().getFullYear());

  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const categories = [
    { value: 'birthday', label: 'تولد', icon: '🎂' },
    { value: 'anniversary', label: 'سالگرد', icon: '💕' },
    { value: 'meeting', label: 'جلسه', icon: '📅' },
    { value: 'holiday', label: 'تعطیلات', icon: '🎉' },
    { value: 'other', label: 'سایر', icon: '📌' }
  ];

  // Load editing data
  useEffect(() => {
    if (editingDate) {
      setTitle(editingDate.title);
      setDescription(editingDate.description || '');
      setCategory(editingDate.category);
      setReminderEnabled(editingDate.reminderEnabled);
      setReminderDays(editingDate.reminderDays);
      setSelectedYear(editingDate.date.year || new Date().getFullYear());
    }
  }, [editingDate]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('لطفاً عنوان را وارد کنید');
      return;
    }

    const dateData: Omit<SavedDate, 'id' | 'createdAt'> = {
      userId: userPhone,
      title: title.trim(),
      description: description.trim(),
      date: { ...selectedDate, year: selectedYear },
      category,
      reminderEnabled,
      reminderDays: reminderEnabled ? reminderDays : 0
    };

    onSave(dateData);
  };

  // Generate years from 1300 to current year + 10
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 1300 + 11 }, 
    (_, i) => 1300 + i
  ).reverse();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {editingDate ? 'ویرایش تاریخ' : 'ذخیره تاریخ'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatPersianNumber(selectedDate.day)} {monthNames[selectedDate.month - 1]} {formatPersianNumber(selectedYear)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={onClose}
                className="rounded-xl p-2"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: تولد احمد، جلسه کاری، ..."
                className="rounded-xl"
              />
            </div>

            {/* Year Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سال (اختیاری)
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0095da]"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {formatPersianNumber(year)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                دسته‌بندی
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value as SavedDate['category'])}
                    className={`
                      flex items-center gap-2 p-3 rounded-xl border transition-all
                      ${category === cat.value 
                        ? 'border-[#0095da] bg-[#0095da]/10 text-[#0095da]' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات (اختیاری)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات اضافی..."
                rows={3}
                className="rounded-xl"
              />
            </div>

            {/* Reminder Settings */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-gray-600" />
                  <span className="font-medium text-gray-800">یادآوری</span>
                </div>
                <Switch
                  checked={reminderEnabled}
                  onCheckedChange={setReminderEnabled}
                />
              </div>

              {reminderEnabled && (
                <div className="space-y-4 bg-gray-50 rounded-2xl p-4">
                  {/* Reminder Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      چند روز قبل یادآوری شود؟
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 7, 14, 30].map((days) => (
                        <button
                          key={days}
                          onClick={() => setReminderDays(days)}
                          className={`
                            px-3 py-2 rounded-xl text-sm font-medium transition-all
                            ${reminderDays === days
                              ? 'bg-[#0095da] text-white'
                              : 'bg-white border border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          {formatPersianNumber(days)} روز
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reminder Methods */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      روش یادآوری
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-600" />
                          <span className="text-sm">ایمیل</span>
                        </div>
                        <Switch
                          checked={emailReminder}
                          onCheckedChange={setEmailReminder}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={16} className="text-gray-600" />
                          <span className="text-sm">پیامک به {userPhone}</span>
                        </div>
                        <Switch
                          checked={smsReminder}
                          onCheckedChange={setSmsReminder}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reminder Preview */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <div className="text-sm text-blue-800">
                      <strong>پیش‌نمایش یادآوری:</strong>
                      <br />
                      {formatPersianNumber(reminderDays)} روز قبل از "{title || 'عنوان'}" 
                      {emailReminder && smsReminder ? ' ایمیل و پیامک' : 
                       emailReminder ? ' ایمیل' : 
                       smsReminder ? ' پیامک' : ''} دریافت خواهید کرد.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white rounded-b-3xl border-t border-gray-200 p-6 pt-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl"
              >
                انصراف
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#0095da] to-[#ff4f00] text-white"
              >
                <Save size={18} className="ml-2" />
                {editingDate ? 'به‌روزرسانی' : 'ذخیره'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}