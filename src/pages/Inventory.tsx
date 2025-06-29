import React, { useState } from 'react';
import { Plus, Search, Filter, Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const inventory = [
  {
    id: 1,
    name: 'Sampo Premium',
    category: 'Perawatan Rambut',
    stock: 15,
    minStock: 10,
    price: 280000,
    cost: 180000,
    supplier: 'Beauty Supply Co.',
    lastRestocked: '2024-01-10',
    status: 'tersedia'
  },
  {
    id: 2,
    name: 'Kondisioner Organik',
    category: 'Perawatan Rambut',
    stock: 8,
    minStock: 10,
    price: 250000,
    cost: 150000,
    supplier: 'Natural Beauty Ltd.',
    lastRestocked: '2024-01-05',
    status: 'stok rendah'
  },
  {
    id: 3,
    name: 'Gel Penata Rambut',
    category: 'Penataan',
    stock: 25,
    minStock: 15,
    price: 220000,
    cost: 120000,
    supplier: 'Style Pro Inc.',
    lastRestocked: '2024-01-12',
    status: 'tersedia'
  },
  {
    id: 4,
    name: 'Set Cat Kuku',
    category: 'Kuku',
    stock: 3,
    minStock: 5,
    price: 450000,
    cost: 250000,
    supplier: 'Nail Art Supplies',
    lastRestocked: '2023-12-28',
    status: 'stok rendah'
  },
  {
    id: 5,
    name: 'Pelembab Wajah',
    category: 'Perawatan Kulit',
    stock: 0,
    minStock: 8,
    price: 350000,
    cost: 200000,
    supplier: 'Skincare Solutions',
    lastRestocked: '2023-12-15',
    status: 'stok habis'
  },
  {
    id: 6,
    name: 'Serum Rambut',
    category: 'Perawatan Rambut',
    stock: 12,
    minStock: 8,
    price: 350000,
    cost: 220000,
    supplier: 'Beauty Supply Co.',
    lastRestocked: '2024-01-08',
    status: 'tersedia'
  }
];

const categories = ['Semua', 'Perawatan Rambut', 'Penataan', 'Kuku', 'Perawatan Kulit'];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('name');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tersedia': return 'bg-green-100 text-green-800';
      case 'stok rendah': return 'bg-yellow-100 text-yellow-800';
      case 'stok habis': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'tersedia': return <TrendingUp className="h-4 w-4" />;
      case 'stok rendah': return <AlertTriangle className="h-4 w-4" />;
      case 'stok habis': return <TrendingDown className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredInventory = inventory
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'Semua' || item.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'stock': return a.stock - b.stock;
        case 'price': return a.price - b.price;
        case 'status': return a.status.localeCompare(b.status);
        default: return a.name.localeCompare(b.name);
      }
    });

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.status === 'stok rendah').length;
  const outOfStockItems = inventory.filter(item => item.status === 'stok habis').length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.cost), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Inventaris</h1>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Item</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <Package className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stok Rendah</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stok Habis</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Nilai</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalValue)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input"
        >
          <option value="name">Urutkan berdasarkan Nama</option>
          <option value="stock">Urutkan berdasarkan Stok</option>
          <option value="price">Urutkan berdasarkan Harga</option>
          <option value="status">Urutkan berdasarkan Status</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pemasok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Terakhir distok ulang: {new Date(item.lastRestocked).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.stock} unit</div>
                    <div className="text-xs text-gray-500">Min: {item.minStock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Biaya: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.cost)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        Edit
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Restok
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}