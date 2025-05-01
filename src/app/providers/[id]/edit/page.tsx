'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/shared/Layout';
import ProviderForm from '@/components/providers/ProviderForm';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useProvider, useProviderMutation } from '@/hooks/useProviders';

interface EditProviderPageProps {
  params: {
    id: string;
  };
}

export default function EditProviderPage({ params }: EditProviderPageProps) {
  const router = useRouter();
  const { provider, isLoading, error } = useProvider(params.id);
  const { updateProvider, isLoading: isUpdating } = useProviderMutation();

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching provider: ${error}`);
      router.push('/providers');
    }
  }, [error, router]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await updateProvider(params.id, formData);
      
      if (result) {
        toast.success('Provider updated successfully');
        
        // First refresh data, then navigate after a small delay to ensure cache is cleared
        router.refresh();
        
        // Wait a moment to allow the refresh to take effect
        setTimeout(() => {
          router.push('/providers');
        }, 300);
      }
    } catch (error) {
      console.error('Error updating provider:', error);
      toast.error('Failed to update provider');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-gray-600">Loading provider details...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-red-600">Error loading provider data. Redirecting...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!provider) {
    return null;
  }

  // Create a safe initialData object ensuring required fields have values
  const initialData = {
    id: provider.id,
    name: provider.name || '',
    address: provider.address || '',
    email: provider.email || '',
    phone: provider.phone || '',
    hipaaRequired: provider.hipaaRequired === true,
    fax: provider.fax,
    zipCode: provider.zipCode,
    city: provider.city,
    state: provider.state,
    attentionInfo: provider.attentionInfo,
    hipaaSample: provider.hipaaSample,
    brFaxNumber: provider.brFaxNumber,
    mrFaxNumber: provider.mrFaxNumber,
    brEmailId: provider.brEmailId,
    mrEmailId: provider.mrEmailId,
    brMailingAddress: provider.brMailingAddress,
    mrMailingAddress: provider.mrMailingAddress,
    brSmartPortal: provider.brSmartPortal || '',
    mrSmartPortal: provider.mrSmartPortal || '',
    smartFolder: provider.smartFolder || '',
    usesFax: provider.usesFax === true,
    usesEmail: provider.usesEmail === true,
    usesMail: provider.usesMail === true,
    usesSmartPortal: provider.usesSmartPortal === true,
    brSubmissionMethod: provider.brSubmissionMethod || 'NONE',
    mrSubmissionMethod: provider.mrSubmissionMethod || 'NONE',
    brAffidavitTemplateId: provider.brAffidavitTemplateId,
    mrAffidavitTemplateId: provider.mrAffidavitTemplateId,
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Provider
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Update the provider details using the form below.
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
              mode="edit"
              initialData={initialData}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
} 