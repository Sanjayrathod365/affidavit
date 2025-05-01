import React from 'react';
import Link from 'next/link';
import Layout from '@/components/shared/Layout';

export default function ProviderNotFound() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">Provider not found</p>
        <div className="mt-6">
          <Link
            href="/providers"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Go back to providers
          </Link>
        </div>
      </div>
    </Layout>
  );
} 