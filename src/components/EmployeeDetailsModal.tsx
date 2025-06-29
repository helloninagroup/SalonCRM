import React, { useState, useEffect } from 'react';
import { X, User, Edit3, Save, Star, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  hireDate: string;
  defaultCommission: number;
  status: 'aktif' | 'tidak_aktif';
  address?: string;
  emergencyContact?: string;
  skills: string[];
  totalEarnings: number;
  totalTransactions: number;
  averageRating: number;
}

interface CommissionData {
  totalCommission: number;
  totalTransactions: number;
  totalSales: number;
  transactions: any[];
}

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onUpdate: (id: number, data: Partial<Employee>) => void;
  commissionData: CommissionData | null;
}

const positions = [
  'Senior Stylist',
  'Hair Colorist',
  'Barber',
  'Nail Technician',
  'Junior Stylist',
  'Massage Therapist',
  'Receptionist',
  'Manager'
];

export default function EmployeeDetailsModal({ 
  isOpen, 
  onClose, 
  employee, 
  onUpdate,
  commissionData 
}: EmployeeDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultCommission' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = () => {
    if (employee && formData) {
      onUpdate(employee.id, formData);
      setIsEditing(false);
      alert('Data karyawan berhasil diperbarui!');
    }
  };

  const handleCancel = () => {
    setFormData(employee);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Detail Karyawan</h2>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md"
              >
                <Edit3 className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md"
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-700">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'aktif' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{employee.position}</p>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(employee.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">({employee.averageRating})</span>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Komisi Bulan Ini</span>
              </div>
              <p className="text-lg font-bold text-green-900 mt-1">
                {commissionData ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(commissionData.totalCommission) : 'Rp 0'}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Transaksi Bulan Ini</span>
              </div>
              <p className="text-lg font-bold text-blue-900 mt-1">
                {commissionData?.totalTransactions || 0}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Total Pendapatan</span>
              </div>
              <p className="text-lg font-bold text-purple-900 mt-1">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(employee.totalEarnings)}
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Informasi Dasar</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900">{employee.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posisi
                </label>
                {isEditing ? (
                  <select
                    name="position"
                    value={formData.position || ''}
                    onChange={handleInputChange}
                    className="input"
                  >
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{employee.position}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900">{employee.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900">{employee.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Bergabung
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate || ''}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900">{new Date(employee.hireDate).toLocaleDateString('id-ID')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Komisi Default
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="defaultCommission"
                    value={formData.defaultCommission || 0}
                    onChange={handleInputChange}
                    className="input"
                    min="0"
                    max="50"
                    step="0.5"
                  />
                ) : (
                  <p className="text-gray-900">{employee.defaultCommission}%</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Keahlian</h4>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Informasi Tambahan</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    rows={2}
                    className="input resize-none"
                  />
                ) : (
                  <p className="text-gray-900">{employee.address || 'Tidak ada data'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kontak Darurat
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact || ''}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900">{employee.emergencyContact || 'Tidak ada data'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          {commissionData && commissionData.transactions.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Transaksi Terbaru</h4>
              <div className="space-y-2">
                {commissionData.transactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.clientName}</p>
                      <p className="text-sm text-gray-600">{transaction.services.join(', ')}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.total)}
                      </p>
                      <p className="text-sm text-green-600">
                        Komisi: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.commission)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}