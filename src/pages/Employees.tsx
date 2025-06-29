import React, { useState } from 'react';
import { Plus, Search, Filter, Users, DollarSign, Calendar, Star, TrendingUp, Edit3, Trash2, Eye } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EmployeeDetailsModal from '../components/EmployeeDetailsModal';
import CommissionReportModal from '../components/CommissionReportModal';

interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  hireDate: string;
  defaultCommission: number;
  status: 'aktif' | 'tidak_aktif';
  avatar?: string;
  address?: string;
  emergencyContact?: string;
  skills: string[];
  totalEarnings: number;
  totalTransactions: number;
  averageRating: number;
}

interface Transaction {
  id: number;
  employeeId: number;
  clientName: string;
  services: string[];
  total: number;
  commission: number;
  commissionRate: number;
  date: string;
  rating?: number;
}

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'Senior Stylist',
    email: 'sarah@salon.com',
    phone: '+62 812-1111-0001',
    hireDate: '2022-01-15',
    defaultCommission: 12,
    status: 'aktif',
    address: 'Jl. Sudirman No. 123, Jakarta',
    emergencyContact: '+62 813-2222-0001',
    skills: ['Potong Rambut', 'Pewarnaan', 'Highlight', 'Penataan'],
    totalEarnings: 15420000,
    totalTransactions: 89,
    averageRating: 4.9
  },
  {
    id: 2,
    name: 'Maria Santos',
    position: 'Hair Colorist',
    email: 'maria@salon.com',
    phone: '+62 812-1111-0002',
    hireDate: '2022-03-20',
    defaultCommission: 10,
    status: 'aktif',
    address: 'Jl. Thamrin No. 456, Jakarta',
    emergencyContact: '+62 813-2222-0002',
    skills: ['Pewarnaan Rambut', 'Highlight', 'Balayage', 'Ombre'],
    totalEarnings: 12380000,
    totalTransactions: 76,
    averageRating: 4.8
  },
  {
    id: 3,
    name: 'Jake Wilson',
    position: 'Barber',
    email: 'jake@salon.com',
    phone: '+62 812-1111-0003',
    hireDate: '2022-06-10',
    defaultCommission: 8,
    status: 'aktif',
    address: 'Jl. Kemang No. 789, Jakarta',
    emergencyContact: '+62 813-2222-0003',
    skills: ['Cukur Rambut Pria', 'Cukur Jenggot', 'Styling Pria'],
    totalEarnings: 8290000,
    totalTransactions: 65,
    averageRating: 4.7
  },
  {
    id: 4,
    name: 'Lisa Chen',
    position: 'Nail Technician',
    email: 'lisa@salon.com',
    phone: '+62 812-1111-0004',
    hireDate: '2022-08-05',
    defaultCommission: 10,
    status: 'aktif',
    address: 'Jl. Senopati No. 321, Jakarta',
    emergencyContact: '+62 813-2222-0004',
    skills: ['Manikur', 'Pedikur', 'Nail Art', 'Gel Polish'],
    totalEarnings: 9760000,
    totalTransactions: 58,
    averageRating: 4.8
  },
  {
    id: 5,
    name: 'Ahmad Rahman',
    position: 'Junior Stylist',
    email: 'ahmad@salon.com',
    phone: '+62 812-1111-0005',
    hireDate: '2023-02-15',
    defaultCommission: 6,
    status: 'aktif',
    address: 'Jl. Kuningan No. 654, Jakarta',
    emergencyContact: '+62 813-2222-0005',
    skills: ['Potong Rambut', 'Cuci Rambut', 'Blow Dry'],
    totalEarnings: 4520000,
    totalTransactions: 42,
    averageRating: 4.6
  }
];

// Sample transaction data for commission reports
const sampleTransactions: Transaction[] = [
  {
    id: 1,
    employeeId: 1,
    clientName: 'Emma Wilson',
    services: ['Potong Rambut', 'Pewarnaan'],
    total: 1650000,
    commission: 198000,
    commissionRate: 12,
    date: '2024-01-15',
    rating: 5
  },
  {
    id: 2,
    employeeId: 2,
    clientName: 'Lisa Davis',
    services: ['Highlight', 'Penataan'],
    total: 1800000,
    commission: 180000,
    commissionRate: 10,
    date: '2024-01-14',
    rating: 5
  },
  {
    id: 3,
    employeeId: 3,
    clientName: 'Michael Brown',
    services: ['Cukur Jenggot'],
    total: 250000,
    commission: 20000,
    commissionRate: 8,
    date: '2024-01-13',
    rating: 4
  }
];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [transactions] = useState<Transaction[]>(sampleTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'aktif' | 'tidak_aktif'>('semua');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'semua' || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddEmployee = (employeeData: Omit<Employee, 'id' | 'totalEarnings' | 'totalTransactions' | 'averageRating'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Math.max(...employees.map(e => e.id), 0) + 1,
      totalEarnings: 0,
      totalTransactions: 0,
      averageRating: 0
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleUpdateEmployee = (id: number, employeeData: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, ...employeeData } : emp
    ));
  };

  const handleDeleteEmployee = (id: number) => {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;

    if (confirm(`Apakah Anda yakin ingin menghapus karyawan "${employee.name}"?`)) {
      setEmployees(prev => prev.filter(e => e.id !== id));
      alert(`Karyawan "${employee.name}" berhasil dihapus!`);
    }
  };

  const getCommissionData = (employeeId: number, month: Date) => {
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);
    
    const employeeTransactions = transactions.filter(t => 
      t.employeeId === employeeId &&
      new Date(t.date) >= startDate &&
      new Date(t.date) <= endDate
    );

    const totalCommission = employeeTransactions.reduce((sum, t) => sum + t.commission, 0);
    const totalTransactions = employeeTransactions.length;
    const totalSales = employeeTransactions.reduce((sum, t) => sum + t.total, 0);

    return {
      totalCommission,
      totalTransactions,
      totalSales,
      transactions: employeeTransactions
    };
  };

  const totalActiveEmployees = employees.filter(e => e.status === 'aktif').length;
  const totalCommissionThisMonth = employees.reduce((sum, emp) => {
    const commissionData = getCommissionData(emp.id, new Date());
    return sum + commissionData.totalCommission;
  }, 0);
  const averageCommissionRate = employees.reduce((sum, emp) => sum + emp.defaultCommission, 0) / employees.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Karyawan</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCommissionModal(true)}
            className="btn-secondary"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Laporan Komisi
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Karyawan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Karyawan Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{totalActiveEmployees}</p>
            </div>
            <Users className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Komisi Bulan Ini</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalCommissionThisMonth)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Komisi</p>
              <p className="text-2xl font-bold text-gray-900">{averageCommissionRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-secondary-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(employees.reduce((sum, emp) => sum + emp.averageRating, 0) / employees.length).toFixed(1)}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari karyawan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="input"
        >
          <option value="semua">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="tidak_aktif">Tidak Aktif</option>
        </select>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => {
          const commissionData = getCommissionData(employee.id, new Date());
          
          return (
            <div key={employee.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary-700">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(employee.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({employee.averageRating})</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'aktif' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Komisi Default:</span>
                  <span className="font-medium">{employee.defaultCommission}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Komisi Bulan Ini:</span>
                  <span className="font-medium text-green-600">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(commissionData.totalCommission)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaksi Bulan Ini:</span>
                  <span className="font-medium">{commissionData.totalTransactions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Pendapatan:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(employee.totalEarnings)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowDetailsModal(true);
                  }}
                  className="flex-1 btn-secondary text-sm"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Detail
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md text-sm"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Tidak ada karyawan yang ditemukan</p>
        </div>
      )}

      {/* Modals */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddEmployee}
      />

      <EmployeeDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        employee={selectedEmployee}
        onUpdate={handleUpdateEmployee}
        commissionData={selectedEmployee ? getCommissionData(selectedEmployee.id, new Date()) : null}
      />

      <CommissionReportModal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        employees={employees}
        transactions={transactions}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />
    </div>
  );
}