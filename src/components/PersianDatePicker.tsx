import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PersianDate, formatPersianNumber, getCurrentPersianDate } from '../utils/persianCalendar';

type PersianDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function PersianDatePicker({ value, onChange, placeholder, className }: PersianDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => getCurrentPersianDate());
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const dayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  // Parse existing value
  useEffect(() => {
    if (value) {
      try {
        const gregorianDate = new Date(value);
        const persianDate = new PersianDate(gregorianDate).toPersian();
        setSelectedDate(persianDate);
        setCurrentDate(persianDate);
      } catch (error) {
        console.warn('Invalid date value:', value);
      }
    }
  }, [value]);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const isLeapYear = (year: number): boolean => {
    const cycle = year % 128;
    const leapYears = [1, 5, 9, 13, 17, 22, 26, 30, 34, 38, 42, 46, 50, 55, 59, 63, 67, 71, 75, 79, 84, 88, 92, 96, 100, 104, 108, 112, 116, 121, 125];
    return leapYears.includes(cycle);
  };

  const getDaysInMonth = (year: number, month: number): number => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return isLeapYear(year) ? 30 : 29;
  };

  const generateCalendarDays = () => {
    const firstDayOfMonth = PersianDate.fromPersian(currentDate.year, currentDate.month, 1);
    const firstDayWeekday = (firstDayOfMonth.getDay() + 1) % 7;
    const daysInMonth = getDaysInMonth(currentDate.year, currentDate.month);
    
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
  };

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

  const handleDateSelect = (day: number) => {
    const newDate = { year: currentDate.year, month: currentDate.month, day };
    setSelectedDate(newDate);
    
    // Convert to Gregorian and format as ISO string
    const gregorianDate = PersianDate.fromPersian(newDate.year, newDate.month, newDate.day);
    onChange(gregorianDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const formatDisplayValue = () => {
    if (selectedDate) {
      return `${formatPersianNumber(selectedDate.day)} ${monthNames[selectedDate.month - 1]} ${formatPersianNumber(selectedDate.year)}`;
    }
    return '';
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

  const calendarDays = generateCalendarDays();
  const today = getCurrentPersianDate();

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          value={formatDisplayValue()}
          placeholder={placeholder || 'تاریخ تولد را انتخاب کنید'}
          className={className}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
        />
        <Calendar 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigateMonth('next')}
              className="rounded-xl p-2"
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
                    className="font-bold text-gray-800 hover:text-[#0095da] transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
                  >
                    {monthNames[currentDate.month - 1]}
                  </button>
                  
                  {showMonthSelector && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMonthSelector(false)}
                      />
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-2 min-w-[180px]">
                        <div className="grid grid-cols-2 gap-1">
                          {monthNames.map((month, index) => (
                            <button
                              key={index}
                              onClick={() => handleMonthSelect(index)}
                              className={`
                                px-2 py-1 text-sm rounded-lg transition-all text-right
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
                    className="font-bold text-gray-800 hover:text-[#0095da] transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
                  >
                    {formatPersianNumber(currentDate.year)}
                  </button>
                  
                  {showYearSelector && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowYearSelector(false)}
                      />
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-2 w-[250px] max-h-[200px] overflow-y-auto">
                        <div className="grid grid-cols-4 gap-1">
                          {availableYears.map((year) => (
                            <button
                              key={year}
                              onClick={() => handleYearSelect(year)}
                              className={`
                                px-2 py-1 text-sm rounded-lg transition-all
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
              variant="ghost"
              onClick={() => navigateMonth('prev')}
              className="rounded-xl p-2"
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

              const isSelected = selectedDate && 
                selectedDate.year === currentDate.year &&
                selectedDate.month === currentDate.month &&
                selectedDate.day === day;

              const isToday = currentDate.year === today.year &&
                            currentDate.month === today.month &&
                            day === today.day;

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  className={`
                    p-2 text-sm rounded-xl transition-all hover:bg-blue-50 min-h-[36px] flex items-center justify-center
                    ${isSelected ? 'bg-[#0095da] text-white font-bold' : 
                      isToday ? 'bg-blue-100 text-blue-600 font-semibold' : 
                      'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  {formatPersianNumber(day)}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                const today = getCurrentPersianDate();
                setCurrentDate(today);
                handleDateSelect(today.day);
              }}
              className="rounded-xl text-sm"
            >
              امروز
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-xl text-sm"
            >
              بستن
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}