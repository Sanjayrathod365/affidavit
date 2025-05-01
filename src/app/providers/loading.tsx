import React from 'react';
import Layout from '@/components/shared/Layout';

export default function ProvidersLoading() {
  return (
    <Layout>
      <div className="animate-pulse">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="mt-2 h-4 w-96 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="mt-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <div className="min-w-full divide-y divide-gray-300">
              <div className="bg-gray-50 px-6 py-3">
                <div className="h-6 w-full bg-gray-200 rounded"></div>
              </div>
              <div className="divide-y divide-gray-200 bg-white">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 