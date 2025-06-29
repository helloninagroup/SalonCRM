import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Phone, Mail, Calendar, Star, Edit3, Trash2 } from 'lucide-react';
import AddClientModal from '../components/AddClientModal';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  preferredStylist: string;
  rating: number;
  notes: string;
  address?: string;
  dateOfBirth?: string;
  allergies?: string;
  emergencyContact?: string;
}

const initialClients: Client[] = [
  {
    id: 1,
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+62 812-3456-7890',
    lastVisit: '2024-01-15',
    totalVisits: 12,
    totalSpent: 1240000,
    preferredStylist: 'Sarah',
    rating: 5,
    notes: 'Lebih suka warna rambut natural, alergi sulfat',
    address: 'Jl. Sudirman No. 123, Jakarta',
    dateOfBirth: '1990-05-15',
    allergies: 'Sulfat',
    emergencyContact: '+62 813-1111-0001'
  },
  {
    id: 2,
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+62 813-4567-8901',
    lastVisit: '2024-01-10',
    totalVisits: 8,
    totalSpent: 680000,
    preferredStylist: 'Jake',
    rating: 4,
    notes: 'Perawatan jenggot rutin, suka potongan pendek',
    address: 'Jl. Thamrin No. 456, Jakarta',
    dateOfBirth: '1985-08-22',
    emergencyContact: '+62 813-1111-0002'
  },
  {
    id: 3,
    name: 'Lisa Davis',
    email: 'lisa.davis@email.com',
    phone: '+62 814-5678-9012',
    lastVisit: '2024-01-12',
    totalVisits: 15,
    totalSpent: 2100000,
    preferredStylist: 'Maria',
    rating: 5,
    notes: 'Suka warna berani, sering highlight',
    address: 'Jl. Kemang No. 789, Jakarta',
    dateOfBirth: '1992-03-10',
    emergencyContact: '+62 813-1111-0003'
  },
  {
    id: 4,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+62 815-6789-0123',
    lastVisit: '2024-01-08',
    totalVisits: 6,
    totalSpent: 420000,
    preferredStylist: 'Sarah',
    rating: 4,
    notes: 'Profesional bisnis, gaya klasik',
    address: 'Jl. Senopati No. 321, Jakarta',
    dateOfBirth: '1988-11-05',
    emergencyContact: '+62 813-1111-0004'
  },
  {
    id: 5,
    name: 'Anna Johnson',
    email: 'anna.johnson@email.com',
    phone: '+62 816-7890-1234',
    lastVisit: '2024-01-14',
    totalVisits: 20,
    totalSpent: 3200000,
    preferredStylist: 'Lisa',
    rating: 5,
    notes: 'Klien VIP, penggemar nail art',
    address: 'Jl. Kuningan No. 654, Jakarta',
    dateOfBirth: '1987-07-18',
    allergies: 'Latex',
    emergencyContact: '+62 813-1111-0005'
  }
];

// Fungsi untuk mengambil data dari localStorage
const getClientsFromStorage = (): Client[] => {
  try {
    const stored = localStorage.getItem('salon_clients');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading clients from storage:', error);
  }
  return initialClients;
};

const saveClientsToStorage = (clients: Client[]) => {
  try {
    localStorage.setItem('salon_clients', JSON.stringify(clients));
    // Trigger custom event untuk memberitahu komponen lain
    window.dispatchEvent(new CustomEvent('clientsUpdated'));
  } catch (error) {
    console.error('Error saving clients to storage:', error);
  }
};

// Fungsi untuk mengambil daftar stylist dari data karyawan
const getStylistsFromStorage = (): string[] => {
  try {
    const stored = localStorage.getItem('salon_employees');
    if (stored) {
      const employees = JSON.parse(stored);
      return employees
        .filter((emp: any) => emp.status === 'aktif')
        .map((emp: any) => emp.name);
    }
  } catch (error) {
    console.error('Error loading stylists from storage:', error);
  }
  return ['Sarah', 'Maria', 'Jake', 'Lisa', 'Ahmad']; // Default stylists
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stylists, setStylists] = useState<string[]>([]);

  // Load data saat komponen dimount
  useEffect(() => {
    const loadedClients = getClientsFromStorage();
    const loadedStylists = getStylistsFromStorage();
    setClients(loadedClients);
    setStylists(loadedStylists);
  }, []);

  // Listen untuk perubahan data karyawan
  useEffect(() => {
    const handleEmployeesUpdate = () => {
      const loadedStylists = getStylistsFromStorage();
      setStylists(loadedStylists);
    };

    window.addEventListener('employeesUpdated', handleEmployeesUpdate);
    return () => {
      window.removeEventListener('employeesUpdated', handleEmployeesUpdate);
    };
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (clientData: Omit<Client, 'id' | 'lastVisit' | 'totalVisits' | 'totalSpent' | 'rating'>) => {
    const newClient: Client = {
      ...clientData,
      id: Math.max(...clients.map(c => c.id), 0) + 1,
      lastVisit: new Date().toISOString().split('T')[0],
      totalVisits: 0,
      totalSpent: 0,
      rating: 0
    };
    
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    saveClientsToStorage(updatedClients);
    
    alert(`Klien "${newClient.name}" berhasil ditambahkan!`);
  };

  const handleDeleteClient = (id: number) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    if (confirm(`Apakah Anda yakin ingin menghapus klien "${client.name}"?`)) {
      const updatedClients = clients.filter(c => c.id !== id);
      setClients(updatedClients);
      saveClientsToStorage(updatedClients);
      
      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
      
      alert(`Klien "${client.name}" berhasil dihapus!`);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Klien</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Klien
        </button>
      </div>

      {/* Search and Filters - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari klien..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <button className="btn-secondary w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Client List - Mobile Optimized */}
        <div className="lg:col-span-2">
          <div className="card p-4 lg:p-6">
            <div className="space-y-3 lg:space-y-4">
              {filteredClients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Tidak ada klien yang ditemukan</p>
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
                        <div className="h-10 w-10 lg:h-12 lg:w-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm lg:text-lg font-semibold text-primary-700">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{client.name}</h3>
                          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 text-xs lg:text-sm text-gray-600 space-y-1 lg:space-y-0">
                            <span className="flex items-center truncate">
                              <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </span>
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                              {client.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-2">
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 lg:h-4 lg:w-4 ${
                                  i < client.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs lg:text-sm text-gray-600">{client.totalVisits} kunjungan</p>
                          <p className="text-xs lg:text-sm font-medium text-gray-900">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(client.totalSpent)}
                          </p>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id);
                          }}
                          className="p-1.5 lg:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                          title="Hapus Klien"
                        >
                          <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Client Details - Mobile Optimized */}
        <div className="lg:col-span-1">
          {selectedClient ? (
            <div className="card p-4 lg:p-6">
              <div className="text-center mb-4 lg:mb-6">
                <div className="h-16 w-16 lg:h-20 lg:w-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl lg:text-2xl font-bold text-primary-700">
                    {selectedClient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">{selectedClient.name}</h2>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 lg:h-4 lg:w-4 ${
                        i < selectedClient.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Informasi Kontak</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs lg:text-sm text-gray-600">
                      <Mail className="h-3 w-3 lg:h-4 lg:w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center text-xs lg:text-sm text-gray-600">
                      <Phone className="h-3 w-3 lg:h-4 lg:w-4 mr-2 flex-shrink-0" />
                      {selectedClient.phone}
                    </div>
                    {selectedClient.address && (
                      <div className="flex items-start text-xs lg:text-sm text-gray-600">
                        <Mail className="h-3 w-3 lg:h-4 lg:w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{selectedClient.address}</span>
                      </div>
                    )}
                    {selectedClient.emergencyContact && (
                      <div className="flex items-center text-xs lg:text-sm text-gray-600">
                        <Phone className="h-3 w-3 lg:h-4 lg:w-4 mr-2 flex-shrink-0" />
                        Darurat: {selectedClient.emergencyContact}
                      </div>
                    )}
                  </div>
                </div>

                {selectedClient.dateOfBirth && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</h3>
                    <p className="text-xs lg:text-sm text-gray-600">
                      {new Date(selectedClient.dateOfBirth).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Riwayat Kunjungan</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs lg:text-sm">
                      <span className="text-gray-600">Total Kunjungan:</span>
                      <span className="font-medium">{selectedClient.totalVisits}</span>
                    </div>
                    <div className="flex justify-between text-xs lg:text-sm">
                      <span className="text-gray-600">Total Dibelanjakan:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedClient.totalSpent)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs lg:text-sm">
                      <span className="text-gray-600">Kunjungan Terakhir:</span>
                      <span className="font-medium">
                        {new Date(selectedClient.lastVisit).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs lg:text-sm">
                      <span className="text-gray-600">Penata Rambut Pilihan:</span>
                      <span className="font-medium">{selectedClient.preferredStylist}</span>
                    </div>
                  </div>
                </div>

                {selectedClient.allergies && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Alergi & Sensitivitas</h3>
                    <p className="text-xs lg:text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      {selectedClient.allergies}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Catatan</h3>
                  <p className="text-xs lg:text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {selectedClient.notes}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <button className="btn-primary flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Buat Janji Temu
                  </button>
                  <button className="btn-secondary">Edit</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-4 lg:p-6">
              <div className="text-center text-gray-500">
                <p>Pilih klien untuk melihat detail</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddClient}
        stylists={stylists}
      />
    </div>
  );
}