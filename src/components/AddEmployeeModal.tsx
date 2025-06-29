import React, { useState } from 'react';
import { X, User, Plus } from 'lucide-react';

interface Employee {
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
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: Employee) => void;
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

const availableSkills = [
  'Potong Rambut',
  'Pewarnaan Rambut',
  'Highlight',
  'Balayage',
  'Ombre',
  'Penataan',
  'Cukur Jenggot',
  'Styling Pria',
  'Manikur',
  'Pedikur',
  'Nail Art',
  'Gel Polish',
  'Cuci Rambut',
  'Blow Dry',
  'Massage',
  'Facial',
  'Perawatan Kulit'
];

export default function AddEmployeeModal({ isOpen, onClose, onAdd }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState<Employee>({
    name: '',
    position: positions[0],
    email: '',
    phone: '',
    hireDate: new Date().toISOString().split('T')[0],
    defaultCommission: 10,
    status: 'aktif',
    address: '',
    emergencyContact: '',
    skills: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultCommission' ? parseFloat(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama karyawan wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[\+]?[0-9\-\s\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (formData.defaultCommission < 0 || formData.defaultCommission > 50) {
      newErrors.defaultCommission = 'Komisi harus antara 0-50%';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Pilih minimal satu keahlian';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const employeeData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address?.trim(),
      emergencyContact: formData.emergencyContact?.trim()
    };

    onAdd(employeeData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      position: positions[0],
      email: '',
      phone: '',
      hireDate: new Date().toISOString().split('T')[0],
      defaultCommission: 10,
      status: 'aktif',
      address: '',
      emergencyContact: '',
      skills: []
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Tambah Karyawan Baru</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Masukkan nama lengkap"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Posisi
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="input"
                >
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`input ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+62 812-3456-7890"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Bergabung
                </label>
                <input
                  type="date"
                  id="hireDate"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="aktif">Aktif</option>
                  <option value="tidak_aktif">Tidak Aktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Commission */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Komisi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="defaultCommission" className="block text-sm font-medium text-gray-700 mb-1">
                  Komisi Default (%) *
                </label>
                <input
                  type="number"
                  id="defaultCommission"
                  name="defaultCommission"
                  value={formData.defaultCommission}
                  onChange={handleInputChange}
                  className={`input ${errors.defaultCommission ? 'border-red-500' : ''}`}
                  placeholder="10"
                  min="0"
                  max="50"
                  step="0.5"
                />
                {errors.defaultCommission && <p className="text-red-500 text-xs mt-1">{errors.defaultCommission}</p>}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Keahlian *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableSkills.map(skill => (
                <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
            {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Informasi Tambahan</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="input resize-none"
                  placeholder="Alamat lengkap karyawan"
                />
              </div>

              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Kontak Darurat
                </label>
                <input
                  type="tel"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="+62 812-3456-7890"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Karyawan
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 btn-secondary"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}