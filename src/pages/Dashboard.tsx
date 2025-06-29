import React from 'react';
import { Calendar, Users, DollarSign, TrendingUp, Clock, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const stats = [
  { name: 'Pendapatan Hari Ini', value: 'Rp 2.847.000', icon: DollarSign, change: '+12%', changeType: 'positive' },
  { name: 'Janji Temu Hari Ini', value: '24', icon: Calendar, change: '+3', changeType: 'positive' },
  { name: 'Klien Aktif', value: '1.247', icon: Users, change: '+18', changeType: 'positive' },
  { name: 'Rata-rata Penilaian', value: '4.8', icon: Star, change: '+0.2', changeType: 'positive' },
];

const revenueData = [
  { name: 'Sen', revenue: 2400000 },
  { name: 'Sel', revenue: 1398000 },
  { name: 'Rab', revenue: 9800000 },
  { name: 'Kam', revenue: 3908000 },
  { name: 'Jum', revenue: 4800000 },
  { name: 'Sab', revenue: 3800000 },
  { name: 'Min', revenue: 4300000 },
];

const appointmentData = [
  { name: 'Jan', appointments: 65 },
  { name: 'Feb', appointments: 59 },
  { name: 'Mar', appointments: 80 },
  { name: 'Apr', appointments: 81 },
  { name: 'Mei', appointments: 56 },
  { name: 'Jun', appointments: 55 },
];

const upcomingAppointments = [
  { id: 1, client: 'Emma Wilson', service: 'Potong & Tata Rambut', time: '10:00', stylist: 'Sarah' },
  { id: 2, client: 'Michael Brown', service: 'Cukur Jenggot', time: '10:30', stylist: 'Jake' },
  { id: 3, client: 'Lisa Davis', service: 'Pewarnaan Rambut', time: '11:00', stylist: 'Maria' },
  { id: 4, client: 'John Smith', service: 'Layanan Lengkap', time: '11:30', stylist: 'Sarah' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dasbor</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} dari kemarin
                </p>
              </div>
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pendapatan Mingguan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => [new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value)), 'Pendapatan']} />
              <Bar dataKey="revenue" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tren Janji Temu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#a855f7" 
                strokeWidth={3}
                dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Janji Temu Hari Ini</h3>
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {appointment.client.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{appointment.client}</p>
                  <p className="text-sm text-gray-600">{appointment.service}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{appointment.time}</p>
                <p className="text-sm text-gray-600">dengan {appointment.stylist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}