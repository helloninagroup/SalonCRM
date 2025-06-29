import React, { useState } from 'react';
import { X, Plus, Trash2, Building2, Edit3, Check, AlertTriangle } from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
}

interface ManageSuppliersModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  onDeleteSupplier: (id: number) => void;
  onUpdateSupplier: (id: number, supplier: Omit<Supplier, 'id'>) => void;
}

export default function ManageSuppliersModal({ 
  isOpen, 
  onClose, 
  suppliers, 
  onAddSupplier, 
  onDeleteSupplier,
  onUpdateSupplier 
}: ManageSuppliersModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      name: '',
      contact: '',
      phone: '',
      email: '',
      address: ''
    });
    setErrors({});
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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
      newErrors.name = 'Nama pemasok wajib diisi';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Nama kontak wajib diisi';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[\+]?[0-9\-\s\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Check for duplicate supplier name
    const isDuplicate = suppliers.some(supplier => 
      supplier.name.toLowerCase() === formData.name.toLowerCase() && 
      supplier.id !== editingId
    );
    
    if (isDuplicate) {
      newErrors.name = 'Nama pemasok sudah ada';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const supplierData = {
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim()
    };

    if (editingId) {
      onUpdateSupplier(editingId, supplierData);
    } else {
      onAddSupplier(supplierData);
    }

    resetForm();
  };

  const handleEdit = (supplier: Supplier) => {
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address
    });
    setEditingId(supplier.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pemasok "${name}"?`)) {
      onDeleteSupplier(id);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Kelola Pemasok</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Add Supplier Button */}
          {!showAddForm && (
            <div className="mb-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pemasok Baru
              </button>
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Pemasok' : 'Tambah Pemasok Baru'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Pemasok */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Pemasok *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`input ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Masukkan nama pemasok"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Nama Kontak */}
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Kontak *
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className={`input ${errors.contact ? 'border-red-500' : ''}`}
                      placeholder="Nama person in charge"
                    />
                    {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                  </div>

                  {/* Nomor Telepon */}
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

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="email@pemasok.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Alamat */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat (Opsional)
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="input resize-none"
                    placeholder="Alamat lengkap pemasok"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {editingId ? 'Update Pemasok' : 'Tambah Pemasok'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Suppliers List */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Daftar Pemasok ({suppliers.length})
            </h3>
            
            {suppliers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada pemasok yang terdaftar</p>
                <p className="text-sm">Tambahkan pemasok pertama Anda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{supplier.contact}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Telepon:</span> {supplier.phone}
                          </div>
                          {supplier.email && (
                            <div>
                              <span className="font-medium">Email:</span> {supplier.email}
                            </div>
                          )}
                          {supplier.address && (
                            <div className="md:col-span-2">
                              <span className="font-medium">Alamat:</span> {supplier.address}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md"
                          title="Edit Pemasok"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id, supplier.name)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                          title="Hapus Pemasok"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="btn-secondary"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}