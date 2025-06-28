import React, { useState } from 'react';
import { Calendar, Plus, Search, Filter, Clock, User, Scissors } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

const appointments = [
  { id: 1, client: 'Emma Wilson', service: 'Hair Cut & Style', time: '10:00 AM', duration: '1h', stylist: 'Sarah', status: 'confirmed' },
  { id: 2, client: 'Michael Brown', service: 'Beard Trim', time: '10:30 AM', duration: '30m', stylist: 'Jake', status: 'confirmed' },
  { id: 3, client: 'Lisa Davis', service: 'Hair Color', time: '11:00 AM', duration: '2h', stylist: 'Maria', status: 'pending' },
  { id: 4, client: 'John Smith', service: 'Full Service', time: '11:30 AM', duration: '1.5h', stylist: 'Sarah', status: 'confirmed' },
  { id: 5, client: 'Anna Johnson', service: 'Manicure', time: '2:00 PM', duration: '45m', stylist: 'Lisa', status: 'confirmed' },
  { id: 6, client: 'David Wilson', service: 'Hair Wash', time: '3:00 PM', duration: '30m', stylist: 'Jake', status: 'cancelled' },
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
];

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Calendar
            </button>
          </div>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            className="input pl-10"
          />
        </div>
        <button className="btn-secondary">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="input"
        />
      </div>

      {viewMode === 'list' ? (
        /* List View */
        <div className="card">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.client}</h3>
                    <p className="text-sm text-gray-600">{appointment.service}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                    <p className="text-xs text-gray-500">{appointment.duration}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{appointment.stylist}</p>
                    <p className="text-xs text-gray-500">Stylist</p>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="card">
          <div className="grid grid-cols-8 gap-4">
            <div className="col-span-1">
              <div className="space-y-2">
                {timeSlots.map((time) => (
                  <div key={time} className="h-16 flex items-center justify-end pr-4 text-sm text-gray-500">
                    {time}
                  </div>
                ))}
              </div>
            </div>
            
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(startOfWeek(selectedDate), i);
              return (
                <div key={i} className="col-span-1">
                  <div className="text-center mb-4">
                    <p className="text-sm font-medium text-gray-900">
                      {format(date, 'EEE')}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {format(date, 'd')}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {timeSlots.map((time, timeIndex) => (
                      <div key={timeIndex} className="h-16 border border-gray-200 rounded-md p-1">
                        {/* Sample appointments for demo */}
                        {timeIndex === 2 && i === 1 && (
                          <div className="h-full bg-primary-100 rounded text-xs p-1 text-primary-800">
                            <p className="font-medium">Emma W.</p>
                            <p>Hair Cut</p>
                          </div>
                        )}
                        {timeIndex === 3 && i === 1 && (
                          <div className="h-full bg-secondary-100 rounded text-xs p-1 text-secondary-800">
                            <p className="font-medium">Michael B.</p>
                            <p>Beard Trim</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}