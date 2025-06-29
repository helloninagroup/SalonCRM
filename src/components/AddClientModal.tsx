import React, { useState } from 'react';
import { X, User, Plus, Mail, Phone, MapPin, Star } from 'lucide-react';

interface Client {
  name: string;
  email: string;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  preferredStylist?: string;
  notes?: string;
  allergies?: string;
  emergencyContact?: string;
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: Client) => void;
  stylists: string[];
}

export default function AddClientModal({ isOpen, onClose, onAdd, stylists }: AddClientModalProps) {
  const [formData, setFormData] = useState<Client>({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    preferredStylist: '',
    notes: '',
    allergies: '',
    emergencyContact: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama klien wajib diisi';
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

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Tanggal lahir tidak boleh di masa depan';
      }
    }

    if (formData.emergencyContact && !/^[\+]?[0-9\-\s\(\)]+$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'Format nomor kontak darurat tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const clientData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address?.trim(),
      notes: formData.notes?.trim(),
      allergies: formData.allergies?.trim(),
      emergencyContact: formData.emergencyContact?.trim()
    };

    onAdd(clientData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      preferredStylist: '',
      notes: '',
      allergies: '',
      emergencyContact: ''
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
            <h2 className="text-lg font-semibold text-gray-900">Tambah Klien Baru</h2>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+62 812-3456-7890"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="input pl-10 resize-none"
                    placeholder="Alamat lengkap klien"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Preferensi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="preferredStylist" className="block text-sm font-medium text-gray-700 mb-1">
                  Penata Rambut Pilihan
                </label>
                <select
                  id="preferredStylist"
                  name="preferredStylist"
                  value={formData.preferredStylist}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Pilih Penata Rambut</option>
                  {stylists.map(stylist => (
                    <option key={stylist} value={stylist}>{stylist}</option>
                  ))}
                </select>
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
                  className={`input ${errors.emergencyContact ? 'border-red-500' : ''}`}
                  placeholder="+62 812-3456-7890"
                />
                {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Informasi Tambahan</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                  Alergi & Sensitivitas
                </label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={2}
                  className="input resize-none"
                  placeholder="Contoh: Alergi sulfat, kulit sensitif, dll."
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan Khusus
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="input resize-none"
                  placeholder="Catatan khusus tentang klien, preferensi gaya, dll."
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
              Tambah Klien
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