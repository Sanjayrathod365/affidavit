'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AffidavitForm from '@/components/AffidavitForm';
import { createAffidavit } from '@/hooks/useAffidavits';
import type { CreateAffidavitInput } from '@/lib/validations/affidavit';
import { toast } from 'react-hot-toast';

export default function NewAffidavitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] = useState<Partial<CreateAffidavitInput> | undefined>(undefined);

  // Extract query parameters
  useEffect(() => {
    const patientId = searchParams.get('patientId');
    const providerId = searchParams.get('providerId');
    const requestType = searchParams.get('requestType');

    if (patientId || providerId) {
      // Initialize with empty content that will be populated by the form component's useEffect
      const initialData: Partial<CreateAffidavitInput> = {
        content: {
          patientName: '',
          dob: '',
          providerName: '',
          dateRange: '',
          recordTypes: []
        }
      };

      if (patientId) {
        initialData.patientId = patientId;
      }

      if (providerId) {
        initialData.providerId = providerId;
      }

      // If requestType includes with_affidavit, update record types
      if (requestType && requestType.includes('with_affidavit')) {
        // Set record types based on requestType
        const recordTypes: string[] = [];
        if (requestType.includes('br_')) {
          recordTypes.push('billing_records');
        }
        if (requestType.includes('mr_')) {
          recordTypes.push('medical_records');
        }
        
        if (initialData.content && recordTypes.length > 0) {
          initialData.content.recordTypes = recordTypes;
        }
      }

      setInitialFormData(initialData);
    }
  }, [searchParams]);

  const handleSubmit = async (data: CreateAffidavitInput) => {
    setIsSubmitting(true);
    try {
      await createAffidavit(data);
      toast.success('Affidavit created successfully');
      router.push('/affidavits');
    } catch (error) {
      console.error('Failed to create affidavit:', error);
      toast.error('Failed to create affidavit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create New Affidavit</h1>
          <button
            onClick={() => router.push('/affidavits')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Affidavits
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <AffidavitForm 
            onSubmit={handleSubmit} 
            isLoading={isSubmitting} 
            initialData={initialFormData}
          />
        </div>
      </div>
    </div>
  );
} 