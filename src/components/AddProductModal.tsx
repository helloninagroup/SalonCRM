import React, { useState } from 'react';
import { X, Package } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: any) => void;
}

const categories = [
  'Perawatan Rambut',
  'Penataan',
  'Kuku',
  'Perawatan Kulit',
  'Alat Salon',
  'Lainnya'
];

const suppliers = [
  'Beauty Supply Co.',
  'Natural Beauty Ltd.',
  'Style Pro Inc.',
  'Nail Art Supplies',
  'Skincare Solutions',
  'Professional Tools'
];

export default function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Perawatan Rambut',
    stock: '',
    minStock: '',
    price: '',
    cost: '',
    supplier: 'Beauty Supply Co.',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      newErrors.name = 'Nama produk wajib diisi';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stok harus berupa angka positif';
    }

    if (!formData.minStock || parseInt(formData.minStock) < 0) {
      newErrors.minStock = 'Stok minimum harus berupa angka positif';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Harga jual harus lebih dari 0';
    }

    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'Harga beli harus lebih dari 0';
    }

    if (parseFloat(formData.cost) >= parseFloat(formData.price)) {
      newErrors.price = 'Harga jual harus lebih tinggi dari harga beli';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newProduct = {
      id: Date.now(), // Simple ID generation
      name: formData.name.trim(),
      category: formData.category,
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock),
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      supplier: formData.supplier,
      description: formData.description.trim(),
      lastRestocked: new Date().toISOString().split('T')[0],
      status: parseInt(formData.stock) <= parseInt(formData.minStock) 
        ? (parseInt(formData.stock) === 0 ? 'stok habis' : 'stok rendah')
        : 'tersedia'
    };

    onAdd(newProduct);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: 'Perawatan Rambut',
      stock: '',
      minStock: '',
      price: '',
      cost: '',
      supplier: 'Beauty Supply Co.',
      description: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Tambah Produk Baru</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama Produk */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Produk *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Masukkan nama produk"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Kategori */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Stok dan Stok Minimum */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stok Awal *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`input ${errors.stock ? 'border-red-500' : ''}`}
                placeholder="0"
                min="0"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
            <div>
              <label htmlFor="minStock" className="block text-sm font-medium text-gray-700 mb-1">
                Stok Minimum *
              </label>
              <input
                type="number"
                id="minStock"
                name="minStock"
                value={formData.minStock}
                onChange={handleInputChange}
                className={`input ${errors.minStock ? 'border-red-500' : ''}`}
                placeholder="0"
                min="0"
              />
              {errors.minStock && <p className="text-red-500 text-xs mt-1">{errors.minStock}</p>}
            </div>
          </div>

          {/* Harga Beli dan Harga Jual */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                Harga Beli *
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                className={`input ${errors.cost ? 'border-red-500' : ''}`}
                placeholder="0"
                min="0"
                step="1000"
              />
              {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Harga Jual *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`input ${errors.price ? 'border-red-500' : ''}`}
                placeholder="0"
                min="0"
                step="1000"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Pemasok */}
          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
              Pemasok
            </label>
            <select
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              className="input"
            >
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi (Opsional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="input resize-none"
              placeholder="Deskripsi produk..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              <Package className="h-4 w-4 mr-2" />
              Tambah Produk
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