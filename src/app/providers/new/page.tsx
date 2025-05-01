'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/shared/Layout';
import ProviderForm from '@/components/providers/ProviderForm';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useProviderMutation } from '@/hooks/useProviders';

export default function NewProviderPage() {
  const router = useRouter();
  const { createProvider, isLoading } = useProviderMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await createProvider(formData);
      
      if (result) {
        toast.success('Provider created successfully');
        router.push('/providers');
        router.refresh();
      }
    } catch (error) {
      console.error('Error creating provider:', error);
      toast.error('Failed to create provider');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Provider
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Create a new provider by filling out the form below.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/providers')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Providers</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <ProviderForm
              mode="create"
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
} 