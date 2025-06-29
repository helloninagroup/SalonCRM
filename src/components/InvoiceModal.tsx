import React from 'react';
import { X, Printer } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  clientName?: string;
  employeeName?: string;
  commissionRate?: number;
  commissionAmount?: number;
  subtotal: number;
  tax: number;
  total: number;
}

export default function InvoiceModal({ 
  isOpen, 
  onClose, 
  cart, 
  clientName = 'Pelanggan Walk-in',
  employeeName = '',
  commissionRate = 0,
  commissionAmount = 0,
  subtotal,
  tax,
  total 
}: InvoiceModalProps) {
  if (!isOpen) return null;

  const currentDate = new Date();
  const invoiceNumber = `INV-${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  const transactionId = `TRX-${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Faktur - ${invoiceNumber}</title>
              <style>
                body { 
                  font-family: 'Courier New', monospace; 
                  margin: 0; 
                  padding: 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                }
                .invoice-container { 
                  max-width: 300px; 
                  margin: 0 auto; 
                  border: 1px solid #ddd;
                  padding: 15px;
                }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .font-bold { font-weight: bold; }
                .border-t { border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px; }
                .border-b { border-bottom: 1px solid #ddd; margin-bottom: 10px; padding-bottom: 10px; }
                .mb-2 { margin-bottom: 8px; }
                .mb-4 { margin-bottom: 16px; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .logo { width: 60px; height: 60px; margin: 0 auto 10px; }
                @media print {
                  body { margin: 0; }
                  .invoice-container { border: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        
        // Wait for content to load before printing
        printWindow.onload = function() {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Faktur</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title="Cetak Faktur"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div id="invoice-content" className="p-6">
          <div className="invoice-container">
            {/* Logo and Business Info */}
            <div className="text-center mb-4">
              <div className="logo mx-auto mb-2 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">S</span>
              </div>
              <h1 className="font-bold text-lg">SALON CRM</h1>
              <p className="text-sm text-gray-600">Alamat lengkap salon</p>
              <p className="text-sm text-gray-600">Tlp 021 - 7XXX XXX</p>
            </div>

            {/* Transaction Info */}
            <div className="border-b mb-4 pb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm">{currentDate.toLocaleDateString('id-ID')}</span>
                <span className="text-sm">{currentDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Transaksi</span>
                <span className="text-sm">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pesanan</span>
                <span className="text-sm">{invoiceNumber}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="text-center mb-4">
              <p className="font-bold">Tipe Pesanan</p>
              <p className="text-sm text-gray-600">{clientName}</p>
            </div>

            {/* Items */}
            <div className="mb-4">
              {cart.map((item, index) => (
                <div key={item.id} className="mb-2">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="flex justify-between text-sm">
                    <span>{item.quantity} x {item.price.toLocaleString('id-ID')}</span>
                    <span>{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm">{subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Service Charge (5%)</span>
                <span className="text-sm">{Math.round(subtotal * 0.05).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-sm">Pajak (5%)</span>
                <span className="text-sm">{Math.round(tax).toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>{Math.round(total + (subtotal * 0.05)).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-xs text-gray-500">
              <p>----Terima kasih----</p>
              <p>atas kunjungan anda di SALON CRM</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 p-4 border-t bg-gray-50">
          <button
            onClick={handlePrint}
            className="flex-1 btn-primary"
          >
            <Printer className="h-4 w-4 mr-2" />
            Cetak Faktur
          </button>
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}