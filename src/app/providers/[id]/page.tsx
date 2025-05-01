'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/shared/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash } from 'lucide-react';
import { useProvider, useProviderMutation } from '@/hooks/useProviders';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProviderDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProviderDetailPage({ params }: ProviderDetailPageProps) {
  const router = useRouter();
  const { provider, isLoading, error } = useProvider(params.id);
  const { deleteProvider, isLoading: isDeleting } = useProviderMutation();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this provider?')) {
      return;
    }
    
    try {
      const result = await deleteProvider(params.id);
      
      if (result) {
        toast.success('Provider deleted successfully');
        router.push('/providers');
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error('Failed to delete provider');
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
    toast.error(error);
    router.push('/providers');
    return null;
  }

  if (!provider) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {provider.name}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Provider details and information
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push('/providers')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Providers</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/providers/${params.id}/edit`)}
                className="flex items-center space-x-2"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center space-x-2"
              >
                <Trash className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Contact details for this provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1">
                  {provider.address || 'Not provided'}
                  {provider.city && provider.state && (
                    <>
                      <br />
                      {provider.city}, {provider.state} {provider.zipCode}
                    </>
                  )}
                  {provider.attentionInfo && (
                    <>
                      <br />
                      <span className="text-sm text-gray-500">
                        Attention: {provider.attentionInfo}
                      </span>
                    </>
                  )}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1">{provider.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{provider.email || provider.brEmailId || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Fax</h3>
                <p className="mt-1">{provider.fax || 'Not provided'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Additional information about this provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">HIPAA Required</h3>
                <div className="mt-1">
                  {provider.hipaaRequired ? (
                    <Badge variant="destructive">Required</Badge>
                  ) : (
                    <Badge variant="outline">Not Required</Badge>
                  )}
                </div>
              </div>
              
              {provider.hipaaSamplePath && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">HIPAA Sample File</h3>
                  <p className="mt-1">
                    <a 
                      href={provider.hipaaSamplePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Sample File
                    </a>
                  </p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p className="mt-1">
                  {provider.createdAt 
                    ? new Date(provider.createdAt).toLocaleDateString() 
                    : 'Unknown'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1">
                  {provider.updatedAt 
                    ? new Date(provider.updatedAt).toLocaleDateString() 
                    : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {(provider.brEmailId || provider.mrEmailId || provider.brFaxNumber || provider.mrFaxNumber || 
            provider.brMailingAddress || provider.mrMailingAddress) && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Department Details</CardTitle>
                <CardDescription>
                  Specific contact information for different departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Billing Records */}
                  {(provider.brEmailId || provider.brFaxNumber || provider.brMailingAddress) && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Billing Records Department</h3>
                      
                      {provider.brEmailId && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Email</h4>
                          <p className="mt-1">{provider.brEmailId}</p>
                        </div>
                      )}
                      
                      {provider.brFaxNumber && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Fax</h4>
                          <p className="mt-1">{provider.brFaxNumber}</p>
                        </div>
                      )}
                      
                      {provider.brMailingAddress && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Mailing Address</h4>
                          <p className="mt-1 whitespace-pre-line">{provider.brMailingAddress}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Medical Records */}
                  {(provider.mrEmailId || provider.mrFaxNumber || provider.mrMailingAddress) && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Medical Records Department</h3>
                      
                      {provider.mrEmailId && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Email</h4>
                          <p className="mt-1">{provider.mrEmailId}</p>
                        </div>
                      )}
                      
                      {provider.mrFaxNumber && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Fax</h4>
                          <p className="mt-1">{provider.mrFaxNumber}</p>
                        </div>
                      )}
                      
                      {provider.mrMailingAddress && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Mailing Address</h4>
                          <p className="mt-1 whitespace-pre-line">{provider.mrMailingAddress}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
} 