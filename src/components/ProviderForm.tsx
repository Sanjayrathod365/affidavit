'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ProviderFormProps {
  mode?: 'create' | 'edit';
  initialData?: {
    id?: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    hipaaRequired?: boolean;
    hipaaSamplePath?: string;
  };
  onSubmit?: (data: FormData) => Promise<void>;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

export function ProviderForm({
  mode = 'create',
  initialData,
  onSubmit,
  submitButtonText = mode === 'create' ? 'Create Provider' : 'Update Provider',
  isSubmitting = false,
}: ProviderFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    address: initialData?.address || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    hipaaRequired: initialData?.hipaaRequired || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Append file if selected
      const fileInput = document.getElementById('hipaaSamplePath') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formDataToSend.append('hipaaSampleFile', fileInput.files[0]);
      }

      if (onSubmit) {
        await onSubmit(formDataToSend);
      } else {
        const url = mode === 'edit' ? `/api/providers/${initialData?.id}` : '/api/providers';
        const method = mode === 'edit' ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          body: formDataToSend,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to ${mode} provider`);
        }

        toast.success(`Provider ${mode === 'create' ? 'created' : 'updated'} successfully`);
        router.push('/providers');
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${mode} provider`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Add New Provider' : 'Edit Provider'}</CardTitle>
        <CardDescription>
          {mode === 'create' ? 'Enter provider information below' : 'Update provider information'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Provider Name</Label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hipaaRequired">HIPAA Required</Label>
          <input
            id="hipaaRequired"
            name="hipaaRequired"
            type="checkbox"
            checked={formData.hipaaRequired}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hipaaSamplePath">HIPAA Sample File</Label>
          <input
            id="hipaaSamplePath"
            name="hipaaSamplePath"
            type="file"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {initialData?.hipaaSamplePath && (
            <p className="text-sm text-gray-500">
              Current file: {initialData.hipaaSamplePath}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitButtonText}
        </Button>
      </form>
    </Card>
  );
} 