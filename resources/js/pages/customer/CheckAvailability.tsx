import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone, Users, MapPin, Calendar, CheckCircle, XCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Booking {
  id: number;
  reference_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  total_price?: number;
}

interface DayAvailability {
  status: 'available' | 'limited' | 'fully-booked' | 'maintenance';
  booking_count: number;
  total_capacity: number;
  bookings: Booking[];
  resource_status?: string;
}

type AvailabilityData = Record<string, DayAvailability>;

interface Resource {
  id: number;
  resort_name?: string;
  room_number?: string;
  room_type?: string;
  description?: string;
  capacity?: number;
  pax?: number;
  price_per_day?: number;
  price_per_night?: number;
  image_url?: string;
  status?: string;
  amenities?: string[];
  contact?: string;
  resort_email?: string;
}

interface CheckAvailabilityProps {
  reservationType: string;
  resource?: Resource;
  availabilityData: AvailabilityData;
  currentMonth: number;
  currentYear: number;
}

const CheckAvailability: React.FC<CheckAvailabilityProps> = ({
  reservationType,
  resource,
  availabilityData,
  currentMonth,
  currentYear
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(currentYear, currentMonth - 1));
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(resource?.id || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fetch available resources when component mounts
  useEffect(() => {
    if (reservationType === 'resort') {
      fetchAvailableResorts();
    }
    // Add more resource types as needed
  }, [reservationType]);

  const fetchAvailableResorts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/available-resorts');
      const data = await response.json();
      setAvailableResources(data);
    } catch (error) {
      console.error('Error fetching resorts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceSelection = (resourceId: number) => {
    setSelectedResourceId(resourceId);
    setIsNavigating(true);
    // Navigate to the selected resource's availability
    router.get(`/availability/${reservationType}/${resourceId}`, {
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    });
  };

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
    setIsNavigating(true);

    // Navigate to new month data via Inertia
    const url = selectedResourceId
      ? `/availability/${reservationType}/${selectedResourceId}`
      : `/availability/${reservationType}`;

    router.get(url, {
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear()
    }, {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => setIsNavigating(false)
    });
  };

  const getStatusClasses = (status: string, isToday: boolean = false) => {
    let baseClasses = "group relative p-4 min-h-[80px] border-2 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-sm font-medium rounded-lg";

    if (isToday) {
      baseClasses += " ring-2 ring-blue-400 ring-offset-2";
    }

    switch (status) {
      case 'fully-booked':
        return baseClasses + " bg-gradient-to-br from-red-50 to-red-100 border-red-300 text-red-800 hover:from-red-100 hover:to-red-200 hover:shadow-md";
      case 'limited':
        return baseClasses + " bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 text-yellow-800 hover:from-yellow-100 hover:to-yellow-200 hover:shadow-md";
      case 'available':
        return baseClasses + " bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-800 hover:from-green-100 hover:to-green-200 hover:shadow-md";
      case 'maintenance':
        return baseClasses + " bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 text-gray-600 hover:from-gray-100 hover:to-gray-200 cursor-not-allowed";
      default:
        return baseClasses + " bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md";
    }
  };

  const handleDateClick = (dateKey: string) => {
    const dayData = availabilityData[dateKey];
    if (dayData?.status !== 'maintenance') {
      setSelectedDate(selectedDate === dateKey ? null : dateKey);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4 min-h-[80px]"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayData = availabilityData[dateKey];
      const isToday = dateKey === todayString;
      const isSelected = dateKey === selectedDate;

      let cellClasses = getStatusClasses(dayData?.status || 'available', isToday);

      if (isSelected) {
        cellClasses += " ring-2 ring-purple-500 ring-offset-2 scale-105";
      }

      days.push(
        <div
          key={day}
          className={cellClasses}
          onClick={() => handleDateClick(dateKey)}
        >
          <span className="text-xl font-bold mb-1">{day}</span>
          {dayData && dayData.booking_count > 0 && dayData.status !== 'maintenance' && (
            <span className="text-xs px-2 py-1 bg-white/80 rounded-full font-semibold mt-1">
              {dayData.booking_count}/{dayData.total_capacity}
            </span>
          )}
          {dayData?.status === 'maintenance' && (
            <span className="text-xs mt-1 font-medium">Under Maintenance</span>
          )}
          {isToday && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
          )}
          {dayData?.status === 'available' && (
            <CheckCircle className="w-4 h-4 absolute bottom-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          )}
          {dayData?.status === 'fully-booked' && (
            <XCircle className="w-4 h-4 absolute bottom-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      );
    }

    return days;
  };

  const getReservationTypeTitle = (type: string) => {
    return type.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  };

  // Don't show calendar if no resource is selected for resort/hotel types
  if ((reservationType === 'resort' || reservationType === 'hotel') && !resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Select Your {getReservationTypeTitle(reservationType)}
            </h1>
            <p className="text-gray-600 text-lg">
              Choose a {reservationType} to check real-time availability
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <span className="ml-3 text-lg text-gray-600">Loading available {reservationType}s...</span>
            </div>
          )}

          {/* Resources Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableResources.map((res) => (
                <Card key={res.id} className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-400 overflow-hidden">
                  <CardContent className="p-0">
                    {res.image_url && (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={res.image_url}
                          alt={res.resort_name || res.room_type || 'Resource'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${
                            res.status === 'available'
                              ? 'bg-green-500/90 text-white'
                              : 'bg-red-500/90 text-white'
                          }`}>
                            {res.status || 'Available'}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                            {res.resort_name || res.room_type || 'Unnamed'}
                          </h3>
                        </div>
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      {res.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {res.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Up to {res.pax || res.capacity || 'N/A'} guests</span>
                      </div>

                      {/* Amenities Preview */}
                      {res.amenities && res.amenities.length > 0 && (
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {res.amenities.slice(0, 3).map((amenity, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                              >
                                {amenity}
                              </span>
                            ))}
                            {res.amenities.length > 3 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                +{res.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                        <div>
                          <span className="text-sm text-gray-500 block">Starting from</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {formatPrice(res.price_per_day || res.price_per_night)}
                          </span>
                          <span className="text-sm text-gray-500">/day</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleResourceSelection(res.id)}
                        disabled={isNavigating}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isNavigating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5" />
                            Check Availability
                          </>
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && availableResources.length === 0 && (
            <div className="text-center py-20">
              <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No {reservationType}s Available</h3>
              <p className="text-gray-500">Please check back later or contact us for more information.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              className="flex gap-2 items-center hover:bg-white shadow-sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to selection
            </Button>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {resource ?
              (resource.resort_name || resource.room_type || 'Resource') :
              getReservationTypeTitle(reservationType)
            }
          </h1>
          <p className="text-gray-600 text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Check availability and booking details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-2 border-gray-100">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth(-1)}
                    disabled={isNavigating}
                    className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <CardTitle className="text-3xl font-bold text-center">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>

                  <button
                    onClick={() => navigateMonth(1)}
                    disabled={isNavigating}
                    className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="px-6 py-8">
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded"></div>
                    <span className="text-sm font-medium text-gray-700">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded"></div>
                    <span className="text-sm font-medium text-gray-700">Fully Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm font-medium text-gray-700">Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Today</span>
                  </div>
                </div>

                {/* Calendar Grid */}
                {isNavigating && (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                  </div>
                )}

                {!isNavigating && (
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day headers */}
                    {dayNames.map(day => (
                      <div key={day} className="p-4 text-center text-sm font-bold text-gray-700 bg-gray-100 rounded-lg">
                        {day}
                      </div>
                    ))}
                    {/* Calendar days */}
                    {renderCalendar()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Resource Info */}
            {resource && (
              <Card className="shadow-xl border-2 border-gray-100 overflow-hidden">
                <CardContent className="p-0">
                  {resource.image_url && (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={resource.image_url}
                        alt={resource.resort_name || resource.room_type}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                          {resource.resort_name || resource.room_type}
                        </h3>
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    {/* Description */}
                    {resource.description && (
                      <div className="pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {resource.description}
                        </p>
                      </div>
                    )}

                    {/* Key Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="text-xs text-gray-500 block">Capacity</span>
                          <span className="font-semibold text-gray-900">{resource.pax || resource.capacity} guests</span>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                        <span className="text-xs text-gray-600 block mb-1">Price per day</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {formatPrice(resource.price_per_day || resource.price_per_night)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          resource.status === 'available'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}>
                          {resource.status}
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    {resource.amenities && resource.amenities.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {resource.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg text-xs font-medium border border-blue-200"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    {(resource.contact || resource.resort_email) && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          {resource.contact && (
                            <a
                              href={`tel:${resource.contact}`}
                              className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                            >
                              <Phone className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-medium text-green-700 group-hover:text-green-800">
                                {resource.contact}
                              </span>
                            </a>
                          )}

                          {resource.resort_email && (
                            <a
                              href={`mailto:${resource.resort_email}`}
                              className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                            >
                              <Mail className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800 break-all">
                                {resource.resort_email}
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Date Details */}
            <Card className="shadow-xl border-2 border-gray-100">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl">
                <CardTitle className="text-lg">
                  {selectedDate ? `Details for ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 'Select a date'}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                {selectedDate && availabilityData[selectedDate] ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${
                      availabilityData[selectedDate].status === 'fully-booked'
                        ? 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200'
                        : availabilityData[selectedDate].status === 'maintenance'
                        ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200'
                        : 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200'
                    }`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-700">Status</span>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
                          availabilityData[selectedDate].status === 'fully-booked'
                            ? 'bg-red-500 text-white'
                            : availabilityData[selectedDate].status === 'maintenance'
                            ? 'bg-gray-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}>
                          {availabilityData[selectedDate].status.replace('-', ' ')}
                        </span>
                      </div>

                      {availabilityData[selectedDate].status !== 'maintenance' && (
                        <div className="text-center py-3">
                          <div className="text-3xl font-bold text-gray-900">
                            {availabilityData[selectedDate].status === 'fully-booked' ? 'Fully Booked' : 'Available'}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {reservationType === 'resort' ? 'Entire resort' : 'This resource'}
                          </div>
                        </div>
                      )}
                    </div>

                    {availabilityData[selectedDate].bookings.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Active Bookings ({availabilityData[selectedDate].bookings.length})
                        </h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                          {availabilityData[selectedDate].bookings.map((booking, index) => (
                            <div key={index} className="bg-white border-2 border-gray-200 p-4 rounded-xl hover:shadow-lg transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-gray-900">#{booking.reference_id}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  booking.status === 'accepted'
                                    ? 'bg-green-500 text-white'
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-500 text-white'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  <span>{booking.guests} guests</span>
                                </div>
                                <div className="text-xs bg-gray-50 p-2 rounded">
                                  {new Date(booking.check_in).toLocaleDateString()} → {new Date(booking.check_out).toLocaleDateString()}
                                </div>
                                {booking.total_price && (
                                  <div className="text-sm font-bold text-green-600 pt-2 border-t border-gray-200">
                                    {formatPrice(booking.total_price)}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Click on a date to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckAvailability;
