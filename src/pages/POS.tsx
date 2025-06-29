import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, CreditCard, DollarSign, Receipt, User, Percent } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

const services = [
  { id: 1, name: 'Potong Rambut', price: 450000, category: 'Rambut' },
  { id: 2, name: 'Cuci & Blow Rambut', price: 350000, category: 'Rambut' },
  { id: 3, name: 'Pewarnaan Rambut', price: 1200000, category: 'Rambut' },
  { id: 4, name: 'Highlight', price: 1500000, category: 'Rambut' },
  { id: 5, name: 'Cukur Jenggot', price: 250000, category: 'Perawatan' },
  { id: 6, name: 'Manikur', price: 400000, category: 'Kuku' },
  { id: 7, name: 'Pedikur', price: 500000, category: 'Kuku' },
  { id: 8, name: 'Perawatan Wajah', price: 800000, category: 'Perawatan Kulit' },
];

const products = [
  { id: 1, name: 'Sampo Premium', price: 280000, stock: 15, category: 'Perawatan Rambut' },
  { id: 2, name: 'Kondisioner', price: 250000, stock: 12, category: 'Perawatan Rambut' },
  { id: 3, name: 'Serum Rambut', price: 350000, stock: 8, category: 'Perawatan Rambut' },
  { id: 4, name: 'Cat Kuku', price: 150000, stock: 25, category: 'Kuku' },
  { id: 5, name: 'Masker Wajah', price: 220000, stock: 10, category: 'Perawatan Kulit' },
];

const clients = [
  { value: 'emma', label: 'Emma Wilson' },
  { value: 'michael', label: 'Michael Brown' },
  { value: 'lisa', label: 'Lisa Davis' },
  { value: 'john', label: 'John Smith' },
  { value: 'anna', label: 'Anna Johnson' },
];

// Daftar karyawan dengan komisi default
const employees = [
  { id: 1, name: 'Sarah Johnson', position: 'Senior Stylist', defaultCommission: 12 },
  { id: 2, name: 'Maria Santos', position: 'Hair Colorist', defaultCommission: 10 },
  { id: 3, name: 'Jake Wilson', position: 'Barber', defaultCommission: 8 },
  { id: 4, name: 'Lisa Chen', position: 'Nail Technician', defaultCommission: 10 },
  { id: 5, name: 'Ahmad Rahman', position: 'Junior Stylist', defaultCommission: 6 },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0].id.toString());
  const [commissionRate, setCommissionRate] = useState(employees[0].defaultCommission);
  const [showInvoice, setShowInvoice] = useState(false);

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
    const selectedEmp = employees.find(emp => emp.id.toString() === selectedEmployee);
    const clientName = getClientName();
    
    const transactionSummary = `
Transaksi berhasil!

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
    const client = clients.find(c => c.value === selectedClient);
    return client ? client.label : 'Pelanggan Walk-in';
  };

  const getEmployeeName = () => {
    const employee = employees.find(emp => emp.id.toString() === selectedEmployee);
    return employee ? employee.name : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Titik Penjualan</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="input"
          >
            <option value="">Pilih Pelanggan</option>
            {clients.map(client => (
              <option key={client.value} value={client.value}>{client.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services & Products */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'services'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Layanan
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Produk
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTab === 'services' ? (
                services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => addToCart(service, 'service')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.category}</p>
                      </div>
                      <span className="text-lg font-bold text-primary-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(service.price)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product, 'product')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-xs text-gray-500">Stok: {product.stock}</p>
                      </div>
                      <span className="text-lg font-bold text-primary-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Keranjang</h2>
              <ShoppingCart className="h-5 w-5 text-gray-400" />
            </div>

            {/* Employee Selection */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Karyawan yang Melayani</span>
              </div>
              <select
                value={selectedEmployee}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className="input text-sm"
              >
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id.toString()}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
              
              {/* Commission Rate */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Percent className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-700">Komisi:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Math.max(0, Math.min(50, parseFloat(e.target.value) || 0)))}
                    className="w-16 px-2 py-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="50"
                    step="0.5"
                  />
                  <span className="text-xs text-blue-700">%</span>
                </div>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Keranjang kosong</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)} per item
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pajak (5%):</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</span>
                  </div>
                  
                  {/* Commission Display */}
                  <div className="flex justify-between text-sm bg-green-50 p-2 rounded-md border border-green-200">
                    <span className="text-green-700 font-medium">Komisi ({commissionRate}%):</span>
                    <span className="font-bold text-green-800">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(commissionAmount)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proses Pembayaran
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="btn-secondary text-sm">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Tunai
                    </button>
                    <button 
                      onClick={handleShowInvoice}
                      className="btn-secondary text-sm"
                    >
                      <Receipt className="h-4 w-4 mr-1" />
                      Faktur
                    </button>
                  </div>
                </div>
              </>
            )}
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