import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Bell, Edit, Trash2, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { PersianDate, formatPersianNumber, getCurrentPersianDate } from '../utils/persianCalendar';
import { getNationalDay, getNationalDayColor, type NationalDay } from '../data/persianNationalDays';
import type { SavedDate, ReminderSettings } from '../types/calendar';
import { AddDateModal } from './AddDateModal';

type PersianCalendarProps = {
  userPhone: string;
  savedDates: SavedDate[];
  onSaveDates: (dates: SavedDate[]) => void;
};

export function PersianCalendar({ userPhone, savedDates, onSaveDates }: PersianCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => getCurrentPersianDate());
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDate, setEditingDate] = useState<SavedDate | null>(null);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);

  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const dayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const isLeapYear = (year: number): boolean => {
    // Simplified leap year calculation for Persian calendar
    const cycle = year % 128;
    const leapYears = [1, 5, 9, 13, 17, 22, 26, 30, 34, 38, 42, 46, 50, 55, 59, 63, 67, 71, 75, 79, 84, 88, 92, 96, 100, 104, 108, 112, 116, 121, 125];
    return leapYears.includes(cycle);
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = PersianDate.fromPersian(currentDate.year, currentDate.month, 1);
    const firstDayWeekday = (firstDayOfMonth.getDay() + 1) % 7; // Adjust for Persian week starting on Saturday
    
    const daysInMonth = currentDate.month <= 6 ? 31 : 
                      currentDate.month <= 11 ? 30 : 
                      (isLeapYear(currentDate.year) ? 30 : 29);
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }, [currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      if (direction === 'next') {
        if (prev.month === 12) {
          return { year: prev.year + 1, month: 1, day: 1 };
        } else {
          return { ...prev, month: prev.month + 1 };
        }
      } else {
        if (prev.month === 1) {
          return { year: prev.year - 1, month: 12, day: 1 };
        } else {
          return { ...prev, month: prev.month - 1 };
        }
      }
    });
  };

  const goToToday = () => {
    setCurrentDate(getCurrentPersianDate());
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(prev => ({ ...prev, month: monthIndex + 1 }));
    setShowMonthSelector(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(prev => ({ ...prev, year }));
    setShowYearSelector(false);
  };

  // Generate years from 1300 to current year + 10
  const currentPersianYear = getCurrentPersianDate().year;
  const availableYears = Array.from(
    { length: currentPersianYear - 1300 + 11 }, 
    (_, i) => 1300 + i
  ).reverse();
  const handleDateClick = (day: number) => {
    const clickedDate = { year: currentDate.year, month: currentDate.month, day };
    setSelectedDate(clickedDate);
    setShowAddModal(true);
  };

  const getSavedDateForDay = (day: number): SavedDate | undefined => {
    return savedDates.find(saved => 
      saved.userId === userPhone &&
      saved.date.month === currentDate.month &&
      saved.date.day === day
    );
  };

  const getNationalDayForDay = (day: number): NationalDay | undefined => {
    return getNationalDay(currentDate.month, day);
  };

  const handleSaveDate = (dateData: Omit<SavedDate, 'id' | 'createdAt'>) => {
    const newDate: SavedDate = {
      ...dateData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    if (editingDate) {
      // Update existing date
      const updatedDates = savedDates.map(date => 
        date.id === editingDate.id ? { ...newDate, id: editingDate.id, createdAt: editingDate.createdAt } : date
      );
      onSaveDates(updatedDates);
    } else {
      // Add new date
      onSaveDates([...savedDates, newDate]);
    }
    
    setShowAddModal(false);
    setEditingDate(null);
    setSelectedDate(null);
  };

  const handleEditDate = (date: SavedDate) => {
    setEditingDate(date);
    if (date?.date?.year && date.date.month && date.date.day) {
  setSelectedDate({ year: date.date.year, month: date.date.month, day: date.date.day });
}
    setShowAddModal(true);
  };

  const handleDeleteDate = (dateId: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این تاریخ را حذف کنید؟')) {
      const updatedDates = savedDates.filter(date => date.id !== dateId);
      onSaveDates(updatedDates);
    }
  };

  const getCategoryColor = (category: SavedDate['category']) => {
    switch (category) {
      case 'birthday': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'anniversary': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'holiday': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: SavedDate['category']) => {
    switch (category) {
      case 'birthday': return '🎂';
      case 'anniversary': return '💕';
      case 'meeting': return '📅';
      case 'holiday': return '🎉';
      default: return '📌';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              تقویم شمسی
            </CardTitle>
            <Button onClick={goToToday} variant="outline" className="rounded-xl">
              امروز
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigateMonth('next')}
              className="rounded-xl"
            >
              <ChevronLeft size={18} />
            </Button>
            
            <div className="text-center relative">
              <div className="flex items-center gap-3">
                {/* Month Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowMonthSelector(!showMonthSelector);
                      setShowYearSelector(false);
                    }}
                    className="text-xl font-bold text-gray-800 hover:text-[#0095da] transition-colors px-3 py-1 rounded-xl hover:bg-blue-50"
                  >
                    {monthNames[currentDate.month - 1]}
                  </button>
                  
                  {showMonthSelector && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMonthSelector(false)}
                      />
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 p-2 min-w-[200px]">
                        <div className="grid grid-cols-2 gap-1">
                          {monthNames.map((month, index) => (
                            <button
                              key={index}
                              onClick={() => handleMonthSelect(index)}
                              className={`
                                px-3 py-2 text-sm rounded-xl transition-all text-right
                                ${currentDate.month === index + 1 
                                  ? 'bg-[#0095da] text-white' 
                                  : 'hover:bg-gray-100 text-gray-700'
                                }
                              `}
                            >
                              {month}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Year Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowYearSelector(!showYearSelector);
                      setShowMonthSelector(false);
                    }}
                    className="text-xl font-bold text-gray-800 hover:text-[#0095da] transition-colors px-3 py-1 rounded-xl hover:bg-blue-50"
                  >
                    {formatPersianNumber(currentDate.year)}
                  </button>
                  
                  {showYearSelector && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowYearSelector(false)}
                      />
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 p-2 w-[300px] max-h-[300px] overflow-y-auto">
                        <div className="grid grid-cols-4 gap-1">
                          {availableYears.map((year) => (
                            <button
                              key={year}
                              onClick={() => handleYearSelect(year)}
                              className={`
                                px-3 py-2 text-sm rounded-xl transition-all
                                ${currentDate.year === year 
                                  ? 'bg-[#0095da] text-white' 
                                  : 'hover:bg-gray-100 text-gray-700'
                                }
                              `}
                            >
                              {formatPersianNumber(year)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigateMonth('prev')}
              className="rounded-xl"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, index) => (
              <div key={index} className="text-center text-sm font-semibold text-gray-600 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2"></div>;
              }

              const savedDate = getSavedDateForDay(day);
              const nationalDay = getNationalDayForDay(day);
              const isToday = currentDate.year === getCurrentPersianDate().year &&
                            currentDate.month === getCurrentPersianDate().month &&
                            day === getCurrentPersianDate().day;

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`
                    relative p-2 text-sm rounded-xl transition-all hover:bg-blue-50 hover:scale-105 min-h-[40px] flex flex-col items-center justify-center
                    ${isToday ? 'bg-blue-500 text-white font-bold' : 'text-gray-700'}
                    ${savedDate ? 'ring-2 ring-offset-1 ring-orange-400' : ''}
                    ${nationalDay ? 'bg-red-50 border border-red-200' : ''}
                  `}
                >
                  <div className="relative flex flex-col items-center">
                    {formatPersianNumber(day)}
                    
                    {/* Indicators row */}
                    <div className="flex items-center gap-1 mt-1">
                      {/* National day indicator */}
                      {nationalDay && (
                        <div className="text-xs" title={nationalDay.title}>
                          🏛️
                        </div>
                      )}
                      
                      {/* Saved date emoji indicator */}
                      {savedDate && (
                        <div className="text-xs" title={savedDate.title}>
                          {getCategoryIcon(savedDate.category)}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
              <span>روزهای ملی</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span>تاریخ‌های ذخیره شده</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>امروز</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Dates List */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star size={20} />
            تاریخ‌های ذخیره شده ({formatPersianNumber(savedDates.filter(d => d.userId === userPhone).length)})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savedDates.filter(d => d.userId === userPhone).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>هنوز تاریخی ذخیره نکرده‌اید</p>
              <p className="text-sm">روی تاریخ‌های تقویم کلیک کنید تا آن‌ها را ذخیره کنید</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedDates
                .filter(savedDate => savedDate.userId === userPhone)
                .sort((a, b) => {
               const dateA = PersianDate.fromPersian(a.date.year!, a.date.month!, a.date.day!);
const dateB = PersianDate.fromPersian(b.date.year!, b.date.month!, b.date.day!);
                  return dateA.getTime() - dateB.getTime();
                })
                .map((savedDate) => (
                  <div
                    key={savedDate.id}
                    className="border rounded-2xl p-4 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getCategoryIcon(savedDate.category)}</span>
                          <div>
                            <div className="font-semibold text-gray-800">{savedDate.title}</div>
                            <div className="text-sm text-gray-600">
                              {formatPersianNumber(savedDate.date.day)} {monthNames[savedDate.date.month - 1]} {savedDate.date.year ? formatPersianNumber(savedDate.date.year) : ''}
                            </div>
                          </div>
                        </div>
                        
                        {savedDate.description && (
                          <p className="text-sm text-gray-600 mb-2">{savedDate.description}</p>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Badge className={`rounded-xl text-xs ${getCategoryColor(savedDate.category)}`}>
                            {savedDate.category === 'birthday' ? 'تولد' :
                             savedDate.category === 'anniversary' ? 'سالگرد' :
                             savedDate.category === 'meeting' ? 'جلسه' :
                             savedDate.category === 'holiday' ? 'تعطیلات' : 'سایر'}
                          </Badge>
                          
                          {savedDate.reminderEnabled && (
                            <Badge variant="outline" className="rounded-xl text-xs flex items-center gap-1">
                              <Bell size={12} />
                              یادآوری {formatPersianNumber(savedDate.reminderDays)} روز قبل
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => handleEditDate(savedDate)}
                          className="rounded-xl p-2"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDeleteDate(savedDate.id)}
                          className="rounded-xl p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Show national day info if exists */}
                    {(() => {
                      const nationalDay = getNationalDay(savedDate.date.month, savedDate.date.day);
                      return nationalDay ? (
                        <div className="mt-3 p-2 bg-red-50 rounded-xl border border-red-200">
                          <div className="flex items-center gap-2 text-sm">
                            <span>🏛️</span>
                            <span className="font-medium text-red-800">{nationalDay.title}</span>
                          </div>
                          <div className="text-xs text-red-600 mt-1">{nationalDay.description}</div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Date Modal */}
      {showAddModal && selectedDate && (
        <AddDateModal
          selectedDate={selectedDate}
          editingDate={editingDate}
          userPhone={userPhone}
          onSave={handleSaveDate}
          onClose={() => {
            setShowAddModal(false);
            setEditingDate(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}