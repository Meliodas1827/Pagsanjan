import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type AvailabilityStatus = 'fully-booked' | 'available';
type AvailabilityData = Record<string, AvailabilityStatus>;

const AvailabilityCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample availability data - you can modify this
  const availabilityData: AvailabilityData = {
    '2025-08-15': 'fully-booked',
    '2025-08-18': 'fully-booked',
    '2025-08-22': 'fully-booked',
    '2025-08-25': 'fully-booked',
    '2025-08-28': 'fully-booked',
    '2025-08-12': 'available',
    '2025-08-13': 'available',
    '2025-08-14': 'available',
    '2025-08-16': 'available',
    '2025-08-19': 'available',
    '2025-08-20': 'available',
    '2025-08-21': 'available',
    '2025-08-23': 'available',
    '2025-08-26': 'available',
    '2025-08-27': 'available',
    '2025-08-29': 'available',
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-3 h-16"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
      const availability = availabilityData[dateKey];
      
      let cellClasses = "p-3 h-16 border border-gray-200 text-center cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center text-sm font-medium";
      
      if (availability === 'fully-booked') {
        cellClasses += " bg-red-100 text-red-800 hover:bg-red-200";
      } else if (availability === 'available') {
        cellClasses += " bg-green-100 text-green-800 hover:bg-green-200";
      }

      days.push(
        <div key={day} className={cellClasses}>
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <Card className="w-full max-w-5xl mx-auto" >
      <CardContent className='px-10 py-2'>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-xl"
            aria-label="Previous month"
          >
            ←
          </button>
          <h2 className="text-2xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-xl"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-sm text-gray-600">Fully Booked</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 h-12 flex items-center justify-center">
              {day}
            </div>
          ))}
          {/* Calendar days */}
          {renderCalendar()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;