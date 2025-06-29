import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, CreditCard, DollarSign, Receipt, User, Percent, Sparkles, Heart, Scissors } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

const services = [
  { id: 1, name: 'Potong Rambut', price: 450000, category: 'Rambut', color: 'bg-gradient-to-br from-pink-100 to-rose-200', icon: '✂️' },
  { id: 2, name: 'Cuci & Blow Rambut', price: 350000, category: 'Rambut', color: 'bg-gradient-to-br from-blue-100 to-cyan-200', icon: '💧' },
  { id: 3, name: 'Pewarnaan Rambut', price: 1200000, category: 'Rambut', color: 'bg-gradient-to-br from-purple-100 to-violet-200', icon: '🎨' },
  { id: 4, name: 'Highlight', price: 1500000, category: 'Rambut', color: 'bg-gradient-to-br from-yellow-100 to-amber-200', icon: '✨' },
  { id: 5, name: 'Cukur Jenggot', price: 250000, category: 'Perawatan', color: 'bg-gradient-to-br from-green-100 to-emerald-200', icon: '🧔' },
  { id: 6, name: 'Manikur', price: 400000, category: 'Kuku', color: 'bg-gradient-to-br from-orange-100 to-peach-200', icon: '💅' },
  { id: 7, name: 'Pedikur', price: 500000, category: 'Kuku', color: 'bg-gradient-to-br from-teal-100 to-cyan-200', icon: '🦶' },
  { id: 8, name: 'Perawatan Wajah', price: 800000, category: 'Perawatan Kulit', color: 'bg-gradient-to-br from-indigo-100 to-purple-200', icon: '🧴' },
];

const products = [
  { id: 1, name: 'Sampo Premium', price: 280000, stock: 15, category: 'Perawatan Rambut', color: 'bg-gradient-to-br from-pink-100 to-rose-200', icon: '🧴' },
  { id: 2, name: 'Kondisioner', price: 250000, stock: 12, category: 'Perawatan Rambut', color: 'bg-gradient-to-br from-lavender-100 to-purple-200', icon: '💜' },
  { id: 3, name: 'Serum Rambut', price: 350000, stock: 8, category: 'Perawatan Rambut', color: 'bg-gradient-to-br from-amber-100 to-yellow-200', icon: '✨' },
  { id: 4, name: 'Cat Kuku', price: 150000, stock: 25, category: 'Kuku', color: 'bg-gradient-to-br from-red-100 to-pink-200', icon: '💅' },
  { id: 5, name: 'Masker Wajah', price: 220000, stock: 10, category: 'Perawatan Kulit', color: 'bg-gradient-to-br from-green-100 to-mint-200', icon: '🥒' },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

interface Employee {
  id: number;
  name: string;
  position: string;
  defaultCommission: number;
  status: 'aktif' | 'tidak_aktif';
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferredStylist?: string;
}

// Fungsi untuk mengambil data karyawan dari localStorage
const getEmployeesFromStorage = (): Employee[] => {
  try {
    const stored = localStorage.getItem('salon_employees');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading employees from storage:', error);
  }
  
  // Data default jika tidak ada di localStorage
  return [
    { id: 1, name: 'Sarah Johnson', position: 'Senior Stylist', defaultCommission: 12, status: 'aktif' },
    { id: 2, name: 'Maria Santos', position: 'Hair Colorist', defaultCommission: 10, status: 'aktif' },
    { id: 3, name: 'Jake Wilson', position: 'Barber', defaultCommission: 8, status: 'aktif' },
    { id: 4, name: 'Lisa Chen', position: 'Nail Technician', defaultCommission: 10, status: 'aktif' },
    { id: 5, name: 'Ahmad Rahman', position: 'Junior Stylist', defaultCommission: 6, status: 'aktif' },
  ];
};

// Fungsi untuk mengambil data klien dari localStorage
const getClientsFromStorage = (): Client[] => {
  try {
    const stored = localStorage.getItem('salon_clients');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading clients from storage:', error);
  }
  
  // Data default jika tidak ada di localStorage
  return [
    { id: 1, name: 'Emma Wilson', email: 'emma.wilson@email.com', phone: '+62 812-3456-7890' },
    { id: 2, name: 'Michael Brown', email: 'michael.brown@email.com', phone: '+62 813-4567-8901' },
    { id: 3, name: 'Lisa Davis', email: 'lisa.davis@email.com', phone: '+62 814-5678-9012' },
    { id: 4, name: 'John Smith', email: 'john.smith@email.com', phone: '+62 815-6789-0123' },
    { id: 5, name: 'Anna Johnson', email: 'anna.johnson@email.com', phone: '+62 816-7890-1234' },
  ];
};

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [selectedClient, setSelectedClient] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [commissionRate, setCommissionRate] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);

  // Load data saat komponen dimount
  useEffect(() => {
    const loadedEmployees = getEmployeesFromStorage();
    const loadedClients = getClientsFromStorage();
    const activeEmployees = loadedEmployees.filter(emp => emp.status === 'aktif');
    
    setEmployees(activeEmployees);
    setClients(loadedClients);
    
    // Set karyawan pertama sebagai default jika ada
    if (activeEmployees.length > 0) {
      setSelectedEmployee(activeEmployees[0].id.toString());
      setCommissionRate(activeEmployees[0].defaultCommission);
    }
  }, []);

  // Listen untuk perubahan data dari halaman lain
  useEffect(() => {
    const handleDataChange = () => {
      const loadedEmployees = getEmployeesFromStorage();
      const loadedClients = getClientsFromStorage();
      const activeEmployees = loadedEmployees.filter(emp => emp.status === 'aktif');
      
      setEmployees(activeEmployees);
      setClients(loadedClients);
      
      // Jika karyawan yang dipilih tidak ada lagi, pilih yang pertama
      const currentEmployee = activeEmployees.find(emp => emp.id.toString() === selectedEmployee);
      if (!currentEmployee && activeEmployees.length > 0) {
        setSelectedEmployee(activeEmployees[0].id.toString());
        setCommissionRate(activeEmployees[0].defaultCommission);
      }
    };

    // Listen untuk perubahan localStorage
    window.addEventListener('storage', handleDataChange);
    
    // Listen untuk custom event saat data berubah
    window.addEventListener('employeesUpdated', handleDataChange);
    window.addEventListener('clientsUpdated', handleDataChange);

    return () => {
      window.removeEventListener('storage', handleDataChange);
      window.removeEventListener('employeesUpdated', handleDataChange);
      window.removeEventListener('clientsUpdated', handleDataChange);
    };
  }, [selectedEmployee]);

  const addToCart = (item: typeof services[0] | typeof products[0], type: 'service' | 'product') => {
    const cartItemId = `${type}-${item.id}`;
    const existingItem = cart.find(cartItem => cartItem.id === cartItemId);

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === cartItemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        id: cartItemId,
        name: item.name,
        price: item.price,
        quantity: 1,
        type
      }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    const employee = employees.find(emp => emp.id.toString() === employeeId);
    if (employee) {
      setCommissionRate(employee.defaultCommission);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;
  const commissionAmount = (total * commissionRate) / 100;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Keranjang kosong. Tambahkan item untuk melakukan transaksi.');
      return;
    }

    if (!selectedEmployee) {
      alert('Pilih karyawan yang melayani untuk melanjutkan transaksi.');
      return;
    }

    const selectedEmp = employees.find(emp => emp.id.toString() === selectedEmployee);
    const clientName = getClientName();
    
    // Simpan transaksi untuk laporan komisi
    const transaction = {
      id: Date.now(),
      employeeId: parseInt(selectedEmployee),
      clientName,
      services: cart.filter(item => item.type === 'service').map(item => item.name),
      products: cart.filter(item => item.type === 'product').map(item => item.name),
      total,
      commission: commissionAmount,
      commissionRate,
      date: new Date().toISOString(),
      items: cart
    };

    // Simpan ke localStorage untuk laporan
    try {
      const existingTransactions = JSON.parse(localStorage.getItem('salon_transactions') || '[]');
      existingTransactions.push(transaction);
      localStorage.setItem('salon_transactions', JSON.stringify(existingTransactions));
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
    
    const transactionSummary = `
Transaksi berhasil! ✨

Pelanggan: ${clientName}
Karyawan: ${selectedEmp?.name} (${selectedEmp?.position})
Total Transaksi: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}
Komisi (${commissionRate}%): ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(commissionAmount)}

Komisi akan ditambahkan ke akun karyawan.
    `;
    
    alert(transactionSummary);
    setCart([]);
  };

  const handleShowInvoice = () => {
    if (cart.length === 0) {
      alert('Keranjang kosong. Tambahkan item untuk membuat faktur.');
      return;
    }
    setShowInvoice(true);
  };

  const getClientName = () => {
    if (!selectedClient) return 'Pelanggan Walk-in';
    
    const client = clients.find(c => c.id.toString() === selectedClient);
    return client ? client.name : 'Pelanggan Walk-in';
  };

  const getEmployeeName = () => {
    const employee = employees.find(emp => emp.id.toString() === selectedEmployee);
    return employee ? employee.name : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        {/* Header dengan gradient yang cantik - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/20 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 lg:p-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl shadow-lg">
              <Scissors className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Titik Penjualan
              </h1>
              <p className="text-xs lg:text-sm text-gray-500">Sistem kasir salon yang cantik</p>
            </div>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="relative">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="appearance-none w-full bg-gradient-to-r from-blue-100 to-purple-100 border-0 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-purple-300 focus:outline-none shadow-md text-sm"
              >
                <option value="">✨ Pilih Pelanggan</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id.toString()}>
                    {client.name} - {client.phone}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Heart className="h-4 w-4 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Services & Products - Mobile First */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Tab Navigation dengan gradient - Mobile Optimized */}
              <div className="flex bg-gradient-to-r from-pink-100 to-purple-100 p-1 m-3 lg:m-4 rounded-xl">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`flex-1 px-3 lg:px-6 py-2 lg:py-3 font-medium text-xs lg:text-sm rounded-lg transition-all duration-300 ${
                    activeTab === 'services'
                      ? 'bg-white text-purple-700 shadow-lg transform scale-105'
                      : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                    <Sparkles className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span>Layanan</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex-1 px-3 lg:px-6 py-2 lg:py-3 font-medium text-xs lg:text-sm rounded-lg transition-all duration-300 ${
                    activeTab === 'products'
                      ? 'bg-white text-purple-700 shadow-lg transform scale-105'
                      : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                    <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span>Produk</span>
                  </div>
                </button>
              </div>

              {/* Grid Items dengan warna pastel - Mobile Responsive */}
              <div className="p-3 lg:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {activeTab === 'services' ? (
                  services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => addToCart(service, 'service')}
                      className={`${service.color} p-4 lg:p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/30 group`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
                            <span className="text-lg lg:text-2xl">{service.icon}</span>
                            <div>
                              <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors text-sm lg:text-base">
                                {service.name}
                              </h3>
                              <p className="text-xs lg:text-sm text-gray-600 bg-white/50 px-2 py-1 rounded-full inline-block">
                                {service.category}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm lg:text-lg font-bold text-gray-800 bg-white/70 px-2 lg:px-3 py-1 rounded-full">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(service.price)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/50 rounded-lg p-2 text-center">
                          <span className="text-xs lg:text-sm text-gray-700 font-medium">Klik untuk menambah ke keranjang</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => addToCart(product, 'product')}
                      className={`${product.color} p-4 lg:p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/30 group`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
                            <span className="text-lg lg:text-2xl">{product.icon}</span>
                            <div>
                              <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors text-sm lg:text-base">
                                {product.name}
                              </h3>
                              <p className="text-xs lg:text-sm text-gray-600 bg-white/50 px-2 py-1 rounded-full inline-block">
                                {product.category}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 bg-white/40 px-2 py-1 rounded-full inline-block">
                                Stok: {product.stock}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm lg:text-lg font-bold text-gray-800 bg-white/70 px-2 lg:px-3 py-1 rounded-full">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/50 rounded-lg p-2 text-center">
                          <span className="text-xs lg:text-sm text-gray-700 font-medium">Klik untuk menambah ke keranjang</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Cart - Mobile First, Sticky on Mobile */}
          <div className="order-1 lg:order-2 lg:col-span-1 lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Cart Header */}
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 lg:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div className="p-1.5 lg:p-2 bg-white/20 rounded-lg">
                      <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5" />
                    </div>
                    <h2 className="text-base lg:text-lg font-semibold">Keranjang Belanja</h2>
                  </div>
                  <div className="bg-white/20 px-2 lg:px-3 py-1 rounded-full">
                    <span className="text-xs lg:text-sm font-medium">{cart.length} item</span>
                  </div>
                </div>
              </div>

              <div className="p-4 lg:p-6">
                {/* Employee Selection dengan design cantik - Mobile Optimized */}
                <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-1.5 lg:p-2 bg-blue-400 rounded-lg">
                      <User className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-blue-900">Karyawan yang Melayani</span>
                  </div>
                  
                  {employees.length === 0 ? (
                    <div className="p-3 lg:p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <p className="text-xs lg:text-sm text-yellow-800">
                        Belum ada karyawan aktif. Silakan tambahkan karyawan melalui menu "Karyawan".
                      </p>
                    </div>
                  ) : (
                    <>
                      <select
                        value={selectedEmployee}
                        onChange={(e) => handleEmployeeChange(e.target.value)}
                        className="w-full bg-white border-0 rounded-xl px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-md"
                      >
                        <option value="">Pilih Karyawan</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id.toString()}>
                            {employee.name} - {employee.position}
                          </option>
                        ))}
                      </select>
                      
                      {/* Commission Rate dengan design cantik */}
                      {selectedEmployee && (
                        <div className="mt-3 flex items-center justify-between bg-white/70 p-2 lg:p-3 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <Percent className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                            <span className="text-xs lg:text-sm text-blue-700 font-medium">Komisi:</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={commissionRate}
                              onChange={(e) => setCommissionRate(Math.max(0, Math.min(50, parseFloat(e.target.value) || 0)))}
                              className="w-12 lg:w-16 px-1 lg:px-2 py-1 text-xs lg:text-sm border-0 bg-white rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
                              min="0"
                              max="50"
                              step="0.5"
                            />
                            <span className="text-xs lg:text-sm text-blue-700 font-medium">%</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 lg:py-12">
                    <div className="p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                      <ShoppingCart className="h-12 lg:h-16 w-12 lg:w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-base lg:text-lg font-medium">Keranjang kosong</p>
                      <p className="text-xs lg:text-sm text-gray-400 mt-1">Pilih layanan atau produk untuk memulai</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Cart Items dengan design cantik - Mobile Optimized */}
                    <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6 max-h-48 lg:max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm lg:text-base truncate">{item.name}</h4>
                            <p className="text-xs lg:text-sm text-gray-600">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)} per item
                            </p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              item.type === 'service' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {item.type === 'service' ? '🎨 Layanan' : '🛍️ Produk'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 lg:space-x-3 ml-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 lg:p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                            >
                              <Minus className="h-3 w-3 lg:h-4 lg:w-4 text-red-600" />
                            </button>
                            <span className="w-6 lg:w-8 text-center font-bold text-sm lg:text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 lg:p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                            >
                              <Plus className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Section dengan gradient cantik - Mobile Optimized */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-xl p-3 lg:p-4 space-y-2 lg:space-y-3">
                      <div className="flex justify-between text-xs lg:text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs lg:text-sm">
                        <span className="text-gray-600">Pajak (5%):</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(tax)}
                        </span>
                      </div>
                      <div className="flex justify-between text-base lg:text-lg font-bold border-t border-purple-200 pt-2 lg:pt-3">
                        <span>Total:</span>
                        <span className="text-purple-700">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(total)}
                        </span>
                      </div>
                      
                      {/* Commission Display dengan design cantik */}
                      {selectedEmployee && commissionRate > 0 && (
                        <div className="flex justify-between text-xs lg:text-sm bg-gradient-to-r from-green-100 to-emerald-100 p-2 lg:p-3 rounded-xl border border-green-200">
                          <span className="text-green-700 font-medium flex items-center">
                            <Sparkles className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            Komisi ({commissionRate}%):
                          </span>
                          <span className="font-bold text-green-800">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(commissionAmount)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons dengan gradient cantik - Mobile Optimized */}
                    <div className="mt-4 lg:mt-6 space-y-2 lg:space-y-3">
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 lg:py-4 px-4 lg:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm lg:text-base"
                        disabled={!selectedEmployee || employees.length === 0}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <CreditCard className="h-4 w-4 lg:h-5 lg:w-5" />
                          <span>Proses Pembayaran</span>
                          <Sparkles className="h-3 w-3 lg:h-4 lg:w-4" />
                        </div>
                      </button>
                      
                      <div className="grid grid-cols-2 gap-2 lg:gap-3">
                        <button className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-2 lg:py-3 px-3 lg:px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md text-sm">
                          <div className="flex items-center justify-center space-x-1">
                            <DollarSign className="h-3 w-3 lg:h-4 lg:w-4" />
                            <span>Tunai</span>
                          </div>
                        </button>
                        <button 
                          onClick={handleShowInvoice}
                          className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium py-2 lg:py-3 px-3 lg:px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
                        >
                          <div className="flex items-center justify-center space-x-1">
                            <Receipt className="h-3 w-3 lg:h-4 lg:w-4" />
                            <span>Faktur</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        cart={cart}
        clientName={getClientName()}
        employeeName={getEmployeeName()}
        commissionRate={commissionRate}
        commissionAmount={commissionAmount}
        subtotal={subtotal}
        tax={tax}
        total={total}
      />
    </div>
  );
}