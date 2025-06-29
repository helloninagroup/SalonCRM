import React, { useState } from 'react';
import { Plus, Search, Filter, Package, AlertTriangle, TrendingUp, TrendingDown, Building2 } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import ManageSuppliersModal from '../components/ManageSuppliersModal';

interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
}

const initialInventory = [
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
    status: 'tersedia',
    description: 'Sampo premium untuk semua jenis rambut'
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
    status: 'stok rendah',
    description: 'Kondisioner organik tanpa sulfat'
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
    status: 'tersedia',
    description: 'Gel penata rambut tahan lama'
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
    status: 'stok rendah',
    description: 'Set lengkap cat kuku berbagai warna'
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
    status: 'stok habis',
    description: 'Pelembab wajah untuk kulit sensitif'
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
    status: 'tersedia',
    description: 'Serum rambut untuk rambut rusak'
  }
];

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Beauty Supply Co.',
    contact: 'Sari Indah',
    phone: '+62 21-5555-0001',
    email: 'sari@beautysupply.co.id',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat'
  },
  {
    id: 2,
    name: 'Natural Beauty Ltd.',
    contact: 'Budi Santoso',
    phone: '+62 21-5555-0002',
    email: 'budi@naturalbeauty.com',
    address: 'Jl. Thamrin No. 456, Jakarta Pusat'
  },
  {
    id: 3,
    name: 'Style Pro Inc.',
    contact: 'Maya Putri',
    phone: '+62 21-5555-0003',
    email: 'maya@stylepro.id',
    address: 'Jl. Gatot Subroto No. 789, Jakarta Selatan'
  },
  {
    id: 4,
    name: 'Nail Art Supplies',
    contact: 'Rina Dewi',
    phone: '+62 21-5555-0004',
    email: 'rina@nailart.co.id',
    address: 'Jl. Kemang Raya No. 321, Jakarta Selatan'
  },
  {
    id: 5,
    name: 'Skincare Solutions',
    contact: 'Ahmad Fauzi',
    phone: '+62 21-5555-0005',
    email: 'ahmad@skincare.id',
    address: 'Jl. Senopati No. 654, Jakarta Selatan'
  },
  {
    id: 6,
    name: 'Professional Tools',
    contact: 'Lisa Maharani',
    phone: '+62 21-5555-0006',
    email: 'lisa@protools.co.id',
    address: 'Jl. Kuningan No. 987, Jakarta Selatan'
  }
];

const categories = ['Semua', 'Perawatan Rambut', 'Penataan', 'Kuku', 'Perawatan Kulit', 'Alat Salon', 'Lainnya'];

export default function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);

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

  const handleAddProduct = (newProduct: any) => {
    setInventory(prev => [...prev, newProduct]);
    
    // Show success message
    alert(`Produk "${newProduct.name}" berhasil ditambahkan ke inventaris!`);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
      alert('Produk berhasil dihapus!');
    }
  };

  const handleRestockProduct = (id: number) => {
    const restockAmount = prompt('Masukkan jumlah stok yang ingin ditambahkan:');
    if (restockAmount && !isNaN(Number(restockAmount)) && Number(restockAmount) > 0) {
      setInventory(prev => prev.map(item => {
        if (item.id === id) {
          const newStock = item.stock + Number(restockAmount);
          return {
            ...item,
            stock: newStock,
            lastRestocked: new Date().toISOString().split('T')[0],
            status: newStock <= item.minStock 
              ? (newStock === 0 ? 'stok habis' : 'stok rendah')
              : 'tersedia'
          };
        }
        return item;
      }));
      alert(`Stok berhasil ditambahkan sebanyak ${restockAmount} unit!`);
    }
  };

  // Supplier management functions
  const handleAddSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier = {
      ...supplierData,
      id: Math.max(...suppliers.map(s => s.id), 0) + 1
    };
    setSuppliers(prev => [...prev, newSupplier]);
    alert(`Pemasok "${supplierData.name}" berhasil ditambahkan!`);
  };

  const handleDeleteSupplier = (id: number) => {
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) return;

    // Check if supplier is being used by any products
    const productsUsingSupplier = inventory.filter(item => item.supplier === supplier.name);
    
    if (productsUsingSupplier.length > 0) {
      alert(`Tidak dapat menghapus pemasok "${supplier.name}" karena masih digunakan oleh ${productsUsingSupplier.length} produk. Hapus atau ubah pemasok produk tersebut terlebih dahulu.`);
      return;
    }

    setSuppliers(prev => prev.filter(s => s.id !== id));
    alert(`Pemasok "${supplier.name}" berhasil dihapus!`);
  };

  const handleUpdateSupplier = (id: number, supplierData: Omit<Supplier, 'id'>) => {
    const oldSupplier = suppliers.find(s => s.id === id);
    if (!oldSupplier) return;

    setSuppliers(prev => prev.map(s => 
      s.id === id ? { ...supplierData, id } : s
    ));

    // Update supplier name in inventory if it changed
    if (oldSupplier.name !== supplierData.name) {
      setInventory(prev => prev.map(item => 
        item.supplier === oldSupplier.name 
          ? { ...item, supplier: supplierData.name }
          : item
      ));
    }

    alert(`Pemasok "${supplierData.name}" berhasil diperbarui!`);
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
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowSuppliersModal(true)}
            className="btn-secondary"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Kelola Pemasok
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </button>
        </div>
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
                      {item.description && (
                        <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                      )}
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
                      <button 
                        onClick={() => handleRestockProduct(item.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Restok
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProduct}
        suppliers={suppliers.map(s => s.name)}
      />

      {/* Manage Suppliers Modal */}
      <ManageSuppliersModal
        isOpen={showSuppliersModal}
        onClose={() => setShowSuppliersModal(false)}
        suppliers={suppliers}
        onAddSupplier={handleAddSupplier}
        onDeleteSupplier={handleDeleteSupplier}
        onUpdateSupplier={handleUpdateSupplier}
      />
    </div>
  );
}