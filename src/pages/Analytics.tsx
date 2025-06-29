import React, { useState } from 'react';
import { Calendar, TrendingUp, Users, DollarSign, Clock, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 124000000, appointments: 156 },
  { month: 'Feb', revenue: 112000000, appointments: 142 },
  { month: 'Mar', revenue: 158000000, appointments: 198 },
  { month: 'Apr', revenue: 146000000, appointments: 184 },
  { month: 'Mei', revenue: 162000000, appointments: 203 },
  { month: 'Jun', revenue: 184000000, appointments: 231 },
];

const serviceData = [
  { name: 'Potong Rambut', value: 35, color: '#0284c7' },
  { name: 'Pewarnaan Rambut', value: 25, color: '#a855f7' },
  { name: 'Penataan', value: 20, color: '#10b981' },
  { name: 'Kuku', value: 12, color: '#f59e0b' },
  { name: 'Lainnya', value: 8, color: '#ef4444' },
];

const topClients = [
  { name: 'Emma Wilson', visits: 12, spent: 12400000 },
  { name: 'Lisa Davis', visits: 15, spent: 21000000 },
  { name: 'Anna Johnson', visits: 20, spent: 32000000 },
  { name: 'Sarah Miller', visits: 8, spent: 8900000 },
  { name: 'Jessica Brown', visits: 11, spent: 14500000 },
];

const staffPerformance = [
  { name: 'Sarah', appointments: 89, revenue: 42000000, rating: 4.9 },
  { name: 'Maria', appointments: 76, revenue: 38000000, rating: 4.8 },
  { name: 'Jake', appointments: 65, revenue: 29000000, rating: 4.7 },
  { name: 'Lisa', appointments: 58, revenue: 26000000, rating: 4.8 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analitik & Laporan</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="input"
        >
          <option value="1month">Bulan Lalu</option>
          <option value="3months">3 Bulan Terakhir</option>
          <option value="6months">6 Bulan Terakhir</option>
          <option value="1year">Tahun Lalu</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(886000000)}
              </p>
              <p className="text-sm text-green-600">+15.3% dari periode lalu</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Janji Temu</p>
              <p className="text-2xl font-bold text-gray-900">1.114</p>
              <p className="text-sm text-green-600">+8.2% dari periode lalu</p>
            </div>
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Klien Aktif</p>
              <p className="text-2xl font-bold text-gray-900">1.247</p>
              <p className="text-sm text-green-600">+12.1% dari periode lalu</p>
            </div>
            <Users className="h-8 w-8 text-secondary-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Penilaian</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-sm text-green-600">+0.2 dari periode lalu</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tren Pendapatan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value)) : value,
                name === 'revenue' ? 'Pendapatan' : 'Janji Temu'
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Layanan</h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Klien Teratas</h3>
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
                    <p className="text-sm text-gray-600">{client.visits} kunjungan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(client.spent)}
                  </p>
                  <p className="text-sm text-gray-600">total dibelanjakan</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kinerja Staf</h3>
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
                    <p className="text-gray-600">Janji Temu</p>
                    <p className="font-medium">{staff.appointments}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pendapatan</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(staff.revenue)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments by Hour */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analisis Jam Sibuk</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { hour: '09:00', appointments: 12 },
            { hour: '10:00', appointments: 18 },
            { hour: '11:00', appointments: 25 },
            { hour: '12:00', appointments: 22 },
            { hour: '13:00', appointments: 15 },
            { hour: '14:00', appointments: 28 },
            { hour: '15:00', appointments: 32 },
            { hour: '16:00', appointments: 26 },
            { hour: '17:00', appointments: 20 },
            { hour: '18:00', appointments: 14 },
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