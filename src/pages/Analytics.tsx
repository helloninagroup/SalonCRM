import React, { useState } from 'react';
import { Calendar, TrendingUp, Users, DollarSign, Clock, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 12400, appointments: 156 },
  { month: 'Feb', revenue: 11200, appointments: 142 },
  { month: 'Mar', revenue: 15800, appointments: 198 },
  { month: 'Apr', revenue: 14600, appointments: 184 },
  { month: 'May', revenue: 16200, appointments: 203 },
  { month: 'Jun', revenue: 18400, appointments: 231 },
];

const serviceData = [
  { name: 'Hair Cut', value: 35, color: '#0284c7' },
  { name: 'Hair Color', value: 25, color: '#a855f7' },
  { name: 'Styling', value: 20, color: '#10b981' },
  { name: 'Nails', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 8, color: '#ef4444' },
];

const topClients = [
  { name: 'Emma Wilson', visits: 12, spent: 1240 },
  { name: 'Lisa Davis', visits: 15, spent: 2100 },
  { name: 'Anna Johnson', visits: 20, spent: 3200 },
  { name: 'Sarah Miller', visits: 8, spent: 890 },
  { name: 'Jessica Brown', visits: 11, spent: 1450 },
];

const staffPerformance = [
  { name: 'Sarah', appointments: 89, revenue: 4200, rating: 4.9 },
  { name: 'Maria', appointments: 76, revenue: 3800, rating: 4.8 },
  { name: 'Jake', appointments: 65, revenue: 2900, rating: 4.7 },
  { name: 'Lisa', appointments: 58, revenue: 2600, rating: 4.8 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="input"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$88,600</p>
              <p className="text-sm text-green-600">+15.3% from last period</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">1,114</p>
              <p className="text-sm text-green-600">+8.2% from last period</p>
            </div>
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-green-600">+12.1% from last period</p>
            </div>
            <Users className="h-8 w-8 text-secondary-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-sm text-green-600">+0.2 from last period</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `$${value}` : value,
                name === 'revenue' ? 'Revenue' : 'Appointments'
              ]} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0284c7" 
                strokeWidth={3}
                dot={{ fill: '#0284c7', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clients</h3>
          <div className="space-y-3">
            {topClients.map((client, index) => (
              <div key={client.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.visits} visits</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${client.spent}</p>
                  <p className="text-sm text-gray-600">total spent</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Performance</h3>
          <div className="space-y-3">
            {staffPerformance.map((staff) => (
              <div key={staff.name} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{staff.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{staff.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Appointments</p>
                    <p className="font-medium">{staff.appointments}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-medium">${staff.revenue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments by Hour */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { hour: '9 AM', appointments: 12 },
            { hour: '10 AM', appointments: 18 },
            { hour: '11 AM', appointments: 25 },
            { hour: '12 PM', appointments: 22 },
            { hour: '1 PM', appointments: 15 },
            { hour: '2 PM', appointments: 28 },
            { hour: '3 PM', appointments: 32 },
            { hour: '4 PM', appointments: 26 },
            { hour: '5 PM', appointments: 20 },
            { hour: '6 PM', appointments: 14 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="appointments" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}