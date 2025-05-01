'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {session ? (
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/affidavits"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Affidavits
              </h2>
              <p className="mt-2 text-gray-600">
                Manage and track all affidavits in the system.
              </p>
            </Link>
            <Link
              href="/providers"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Providers
              </h2>
              <p className="mt-2 text-gray-600">
                Manage healthcare providers and their information.
              </p>
            </Link>
            <Link
              href="/patients"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Patients
              </h2>
              <p className="mt-2 text-gray-600">
                Manage patient records and their affidavits.
              </p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Affidavit Management System
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Please sign in to access the system.
          </p>
        </div>
      )}
    </div>
  );
} 