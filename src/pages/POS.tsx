import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, CreditCard, DollarSign, Receipt } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

const services = [
  { id: 1, name: 'Hair Cut', price: 45, category: 'Hair' },
  { id: 2, name: 'Hair Wash & Blow Dry', price: 35, category: 'Hair' },
  { id: 3, name: 'Hair Color', price: 120, category: 'Hair' },
  { id: 4, name: 'Highlights', price: 150, category: 'Hair' },
  { id: 5, name: 'Beard Trim', price: 25, category: 'Grooming' },
  { id: 6, name: 'Manicure', price: 40, category: 'Nails' },
  { id: 7, name: 'Pedicure', price: 50, category: 'Nails' },
  { id: 8, name: 'Facial Treatment', price: 80, category: 'Skincare' },
];

const products = [
  { id: 1, name: 'Shampoo Premium', price: 28, stock: 15, category: 'Hair Care' },
  { id: 2, name: 'Conditioner', price: 25, stock: 12, category: 'Hair Care' },
  { id: 3, name: 'Hair Serum', price: 35, stock: 8, category: 'Hair Care' },
  { id: 4, name: 'Nail Polish', price: 15, stock: 25, category: 'Nails' },
  { id: 5, name: 'Face Mask', price: 22, stock: 10, category: 'Skincare' },
];

const clients = [
  { value: 'emma', label: 'Emma Wilson' },
  { value: 'michael', label: 'Michael Brown' },
  { value: 'lisa', label: 'Lisa Davis' },
  { value: 'john', label: 'John Smith' },
  { value: 'anna', label: 'Anna Johnson' },
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    // Handle checkout logic
    alert('Checkout completed!');
    setCart([]);
  };

  const handleShowInvoice = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Add items to generate invoice.');
      return;
    }
    setShowInvoice(true);
  };

  const getClientName = () => {
    const client = clients.find(c => c.value === selectedClient);
    return client ? client.label : 'Walk-in Customer';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="input"
          >
            <option value="">Select Client</option>
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
                Services
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Products
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
                      <span className="text-lg font-bold text-primary-600">${service.price}</span>
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
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      </div>
                      <span className="text-lg font-bold text-primary-600">${product.price}</span>
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
              <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
              <ShoppingCart className="h-5 w-5 text-gray-400" />
            </div>

            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.price} each</p>
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
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%):</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payment
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="btn-secondary text-sm">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Cash
                    </button>
                    <button 
                      onClick={handleShowInvoice}
                      className="btn-secondary text-sm"
                    >
                      <Receipt className="h-4 w-4 mr-1" />
                      Invoice
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
        subtotal={subtotal}
        tax={tax}
        total={total}
      />
    </div>
  );
}