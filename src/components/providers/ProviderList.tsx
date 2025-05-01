'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import clientLogger from '@/lib/utils/client-logger';

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
}

export default function ProviderList() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/providers');
        if (!response.ok) {
          throw new Error('Failed to fetch providers');
        }
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        clientLogger.error('Error fetching providers', error);
      }
    };

    fetchProviders();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/providers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete provider');
      }

      setProviders((prevProviders) => prevProviders.filter((provider) => provider.id !== id));
    } catch (error) {
      clientLogger.error('Failed to delete provider', error);
      alert('Failed to delete provider. Please try again.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
              Name
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Phone
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Location
            </th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                {provider.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {provider.email}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {provider.phone}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {provider.city}, {provider.state}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <Link
                  href={`/providers/${provider.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this provider?')) {
                      handleDelete(provider.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 