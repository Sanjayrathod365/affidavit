'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalPatients: number;
  totalProviders: number;
  totalAffidavits: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalProviders: 0,
    totalAffidavits: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, providersRes, affidavitsRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/providers'),
          fetch('/api/affidavits'),
        ]);

        const patients = await patientsRes.json();
        const providers = await providersRes.json();
        const affidavits = await affidavitsRes.json();

        setStats({
          totalPatients: patients.length,
          totalProviders: providers.length,
          totalAffidavits: affidavits.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Patients</h2>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalPatients}</p>
          <Link href="/patients" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
            View all patients →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Providers</h2>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalProviders}</p>
          <Link href="/providers" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
            View all providers →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Affidavits</h2>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalAffidavits}</p>
          <Link href="/affidavits" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
            View all affidavits →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              href="/patients/new"
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Patient
            </Link>
            <Link
              href="/providers/new"
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Provider
            </Link>
            <Link
              href="/affidavits/new"
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create New Affidavit
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-gray-600">No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  );
} 