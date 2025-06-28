import React, { useState } from 'react';
import { Plus, Search, Filter, Phone, Mail, Calendar, Star } from 'lucide-react';

const clients = [
  {
    id: 1,
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+1 (555) 123-4567',
    lastVisit: '2024-01-15',
    totalVisits: 12,
    totalSpent: 1240,
    preferredStylist: 'Sarah',
    rating: 5,
    notes: 'Prefers natural hair colors, allergic to sulfates'
  },
  {
    id: 2,
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1 (555) 234-5678',
    lastVisit: '2024-01-10',
    totalVisits: 8,
    totalSpent: 680,
    preferredStylist: 'Jake',
    rating: 4,
    notes: 'Regular beard maintenance, prefers short cuts'
  },
  {
    id: 3,
    name: 'Lisa Davis',
    email: 'lisa.davis@email.com',
    phone: '+1 (555) 345-6789',
    lastVisit: '2024-01-12',
    totalVisits: 15,
    totalSpent: 2100,
    preferredStylist: 'Maria',
    rating: 5,
    notes: 'Loves bold colors, frequent highlights'
  },
  {
    id: 4,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 456-7890',
    lastVisit: '2024-01-08',
    totalVisits: 6,
    totalSpent: 420,
    preferredStylist: 'Sarah',
    rating: 4,
    notes: 'Business professional, classic styles'
  },
  {
    id: 5,
    name: 'Anna Johnson',
    email: 'anna.johnson@email.com',
    phone: '+1 (555) 567-8901',
    lastVisit: '2024-01-14',
    totalVisits: 20,
    totalSpent: 3200,
    preferredStylist: 'Lisa',
    rating: 5,
    notes: 'VIP client, nail art enthusiast'
  }
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button className="btn-secondary">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary-700">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {client.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {client.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < client.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{client.totalVisits} visits</p>
                      <p className="text-sm font-medium text-gray-900">${client.totalSpent}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-1">
          {selectedClient ? (
            <div className="card">
              <div className="text-center mb-6">
                <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">
                    {selectedClient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{selectedClient.name}</h2>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < selectedClient.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedClient.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {selectedClient.phone}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Visit History</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Visits:</span>
                      <span className="font-medium">{selectedClient.totalVisits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-medium">${selectedClient.totalSpent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Visit:</span>
                      <span className="font-medium">{selectedClient.lastVisit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Preferred Stylist:</span>
                      <span className="font-medium">{selectedClient.preferredStylist}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {selectedClient.notes}
                  </p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button className="btn-primary flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </button>
                  <button className="btn-secondary">Edit</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center text-gray-500">
                <p>Select a client to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}