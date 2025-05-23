'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProvidersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we check your session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Providers Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Welcome, {session?.user?.name || 'User'}</h2>
        <p className="mb-2">You are logged in as: <span className="font-medium">{session?.user?.email}</span></p>
        <p className="mb-4">Role: <span className="font-medium">{session?.user?.role || 'Unknown'}</span></p>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">What you can do:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Manage providers</li>
            <li>Create and edit templates</li>
            <li>Manage users</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 