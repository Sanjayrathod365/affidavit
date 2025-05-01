'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAffidavit, updateAffidavit } from '@/hooks/useAffidavits';
import AffidavitForm from '@/components/AffidavitForm';
import type { UpdateAffidavitInput } from '@/lib/validations/affidavit';
import { toast } from 'sonner';
import { AffidavitVerificationInfo } from '@/components/AffidavitVerificationInfo';

interface AffidavitDetailPageProps {
  params: {
    id: string;
  };
}

export default function AffidavitDetailPage({ params }: AffidavitDetailPageProps) {
  const router = useRouter();
  const { affidavit, isLoading, isError, mutate } = useAffidavit(params.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Error loading affidavit</div>;
  }

  if (!affidavit) {
    return <div className="p-4">Affidavit not found</div>;
  }

  const handleSubmit = async (data: UpdateAffidavitInput) => {
    setIsSubmitting(true);
    try {
      await updateAffidavit({
        id: affidavit.id,
        content: data.content,
      });
      await mutate();
      toast.success('Affidavit updated successfully');
      router.push('/affidavits');
    } catch (error) {
      console.error('Failed to update affidavit:', error);
      toast.error('Failed to update affidavit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    setIsSubmitting(true);
    try {
      await updateAffidavit({
        id: affidavit.id,
        status,
      });
      await mutate();
      toast.success(`Affidavit status changed to ${status}`);
    } catch (error) {
      console.error('Failed to update affidavit status:', error);
      toast.error('Failed to update affidavit status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = JSON.parse(affidavit.content);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Edit Affidavit</h1>
            <button
              onClick={() => router.push('/affidavits')}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Affidavits
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            {affidavit.template && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                <h3 className="text-md font-medium text-blue-800">Template: {affidavit.template.name}</h3>
                {affidavit.template.description && (
                  <p className="text-sm text-blue-600 mt-1">{affidavit.template.description}</p>
                )}
                <p className="text-xs text-blue-500 mt-1">Version: {affidavit.template.version}</p>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Status</h2>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleStatusChange('SUBMITTED')}
                  disabled={isSubmitting || affidavit.status === 'SUBMITTED'}
                  className={`px-4 py-2 rounded-md ${
                    affidavit.status === 'SUBMITTED'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  Submit for Review
                </button>
                <button
                  onClick={() => handleStatusChange('APPROVED')}
                  disabled={isSubmitting || affidavit.status === 'APPROVED'}
                  className={`px-4 py-2 rounded-md ${
                    affidavit.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange('REJECTED')}
                  disabled={isSubmitting || affidavit.status === 'REJECTED'}
                  className={`px-4 py-2 rounded-md ${
                    affidavit.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>

            <AffidavitForm
              onSubmit={(formData) => handleSubmit({
                id: affidavit.id,
                content: formData.content
              })}
              initialData={{
                patientId: affidavit.patientId,
                providerId: affidavit.providerId,
                templateId: affidavit.templateId || undefined,
                content,
              }}
              isLoading={isSubmitting}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <AffidavitVerificationInfo 
            affidavitId={affidavit.id}
            verificationCode={affidavit.verificationCode || ''}
            status={affidavit.status}
          />
        </div>
      </div>
    </div>
  );
} 