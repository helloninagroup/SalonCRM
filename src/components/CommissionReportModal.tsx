import React, { useState } from 'react';
import { X, Download, Calendar, DollarSign, TrendingUp, Users, FileText } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';

interface Employee {
  id: number;
  name: string;
  position: string;
  defaultCommission: number;
  status: string;
}

interface Transaction {
  id: number;
  employeeId: number;
  clientName: string;
  services: string[];
  total: number;
  commission: number;
  commissionRate: number;
  date: string;
  rating?: number;
}

interface CommissionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  transactions: Transaction[];
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export default function CommissionReportModal({
  isOpen,
  onClose,
  employees,
  transactions,
  selectedMonth,
  onMonthChange
}: CommissionReportModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<number | 'all'>('all');

  if (!isOpen) return null;

  const startDate = startOfMonth(selectedMonth);
  const endDate = endOfMonth(selectedMonth);

  // Filter transactions by month and employee
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const isInMonth = transactionDate >= startDate && transactionDate <= endDate;
    const isSelectedEmployee = selectedEmployee === 'all' || t.employeeId === selectedEmployee;
    return isInMonth && isSelectedEmployee;
  });

  // Calculate commission data for each employee
  const employeeCommissionData = employees.map(employee => {
    const employeeTransactions = filteredTransactions.filter(t => t.employeeId === employee.id);
    const totalCommission = employeeTransactions.reduce((sum, t) => sum + t.commission, 0);
    const totalSales = employeeTransactions.reduce((sum, t) => sum + t.total, 0);
    const transactionCount = employeeTransactions.length;
    const averageCommissionRate = transactionCount > 0 
      ? employeeTransactions.reduce((sum, t) => sum + t.commissionRate, 0) / transactionCount 
      : employee.defaultCommission;

    return {
      employee,
      totalCommission,
      totalSales,
      transactionCount,
      averageCommissionRate,
      transactions: employeeTransactions
    };
  }).filter(data => data.transactionCount > 0 || selectedEmployee === 'all');

  // Overall statistics
  const totalCommissions = employeeCommissionData.reduce((sum, data) => sum + data.totalCommission, 0);
  const totalSales = employeeCommissionData.reduce((sum, data) => sum + data.totalSales, 0);
  const totalTransactions = employeeCommissionData.reduce((sum, data) => sum + data.transactionCount, 0);
  const activeEmployees = employeeCommissionData.filter(data => data.transactionCount > 0).length;

  const handleExportReport = () => {
    const reportData = {
      period: format(selectedMonth, 'MMMM yyyy', { locale: id }),
      summary: {
        totalCommissions,
        totalSales,
        totalTransactions,
        activeEmployees
      },
      employees: employeeCommissionData.map(data => ({
        name: data.employee.name,
        position: data.employee.position,
        totalCommission: data.totalCommission,
        totalSales: data.totalSales,
        transactionCount: data.transactionCount,
        averageCommissionRate: data.averageCommissionRate
      }))
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-komisi-${format(selectedMonth, 'yyyy-MM')}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert('Laporan berhasil diunduh!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Laporan Komisi</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportReport}
              className="btn-secondary"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Periode:</label>
              <input
                type="month"
                value={format(selectedMonth, 'yyyy-MM')}
                onChange={(e) => onMonthChange(new Date(e.target.value + '-01'))}
                className="input"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Karyawan:</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="input"
              >
                <option value="all">Semua Karyawan</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Total Komisi</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalCommissions)}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Total Penjualan</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalSales)}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Total Transaksi</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{totalTransactions}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Karyawan Aktif</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{activeEmployees}</p>
            </div>
          </div>

          {/* Employee Commission Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detail Komisi per Karyawan - {format(selectedMonth, 'MMMM yyyy', { locale: id })}
            </h3>
            
            {employeeCommissionData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Tidak ada data komisi untuk periode yang dipilih</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Karyawan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posisi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaksi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Penjualan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rata-rata Komisi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Komisi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employeeCommissionData
                      .sort((a, b) => b.totalCommission - a.totalCommission)
                      .map((data) => (
                        <tr key={data.employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-primary-700">
                                  {data.employee.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{data.employee.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.employee.position}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.transactionCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.totalSales)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.averageCommissionRate.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-green-600">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.totalCommission)}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900">
                        TOTAL
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalSales)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {totalTransactions > 0 ? (totalCommissions / totalSales * 100).toFixed(1) : 0}%
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalCommissions)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Detailed Transactions (if single employee selected) */}
          {selectedEmployee !== 'all' && filteredTransactions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Transaksi</h3>
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{transaction.clientName}</h4>
                        <p className="text-sm text-gray-600">{transaction.services.join(', ')}</p>
                        <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('id-ID')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.total)}
                        </p>
                        <p className="text-sm text-green-600">
                          Komisi ({transaction.commissionRate}%): {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.commission)}
                        </p>
                        {transaction.rating && (
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className={`text-xs ${i < transaction.rating! ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}