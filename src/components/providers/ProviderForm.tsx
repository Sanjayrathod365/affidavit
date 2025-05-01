'use client';

import React, { useEffect, ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clientLogger from '@/lib/utils/client-logger';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Interface for Affidavit Template data
interface AffidavitTemplate {
  id: string;
  name: string;
  version: number;
}

// Create enum for submission methods to match Prisma schema
const SubmissionMethod = {
  FAX: 'FAX',
  EMAIL: 'EMAIL',
  MAIL: 'MAIL',
  SMART_PORTAL: 'SMART_PORTAL',
  NONE: 'NONE'
} as const;

type SubmissionMethodType = (typeof SubmissionMethod)[keyof typeof SubmissionMethod];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  hipaaRequired: z.boolean(),
  streetAddress: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  attentionInfo: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  hipaaSampleFile: z.any().optional()
    .refine(
      (val) => {
        // If hipaaRequired is true, then hipaaSampleFile is required
        // This will be checked in a custom validation later with access to form.watch
        return true;
      },
      { message: 'HIPAA sample file is required' }
    ),
  // Deprecated fields - keeping for backward compatibility
  usesFax: z.boolean().optional(),
  usesEmail: z.boolean().optional(),
  usesMail: z.boolean().optional(),
  usesSmartPortal: z.boolean().optional(),
  // New submission method fields
  brSubmissionMethod: z.enum([
    SubmissionMethod.FAX, 
    SubmissionMethod.EMAIL, 
    SubmissionMethod.MAIL, 
    SubmissionMethod.SMART_PORTAL, 
    SubmissionMethod.NONE
  ]).default(SubmissionMethod.NONE),
  mrSubmissionMethod: z.enum([
    SubmissionMethod.FAX, 
    SubmissionMethod.EMAIL, 
    SubmissionMethod.MAIL, 
    SubmissionMethod.SMART_PORTAL, 
    SubmissionMethod.NONE
  ]).default(SubmissionMethod.NONE),
  // Contact fields
  brFaxNumber: z.string().optional(),
  mrFaxNumber: z.string().optional(),
  brMailingAddress: z.string().optional(),
  mrMailingAddress: z.string().optional(),
  brEmailId: z.string().email().optional(),
  mrEmailId: z.string().email().optional(),
  brSmartPortal: z.string().optional(),
  mrSmartPortal: z.string().optional(),
  smartFolder: z.string().optional(),
  // Add new template ID fields to Zod schema
  brAffidavitTemplateId: z.string().optional().nullable(),
  mrAffidavitTemplateId: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface DatabaseProvider {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  fax?: string | null;
  zipCode?: string | null;
  city?: string | null;
  state?: string | null;
  attentionInfo?: string | null;
  hipaaRequired: boolean;
  hipaaSample?: string | null;
  usesFax?: boolean | null;
  usesEmail?: boolean | null;
  usesMail?: boolean | null;
  usesSmartPortal?: boolean | null;
  brSubmissionMethod?: string | null;
  mrSubmissionMethod?: string | null;
  brFaxNumber?: string | null;
  mrFaxNumber?: string | null;
  brEmailId?: string | null;
  mrEmailId?: string | null;
  brMailingAddress?: string | null;
  mrMailingAddress?: string | null;
  brSmartPortal?: string | null;
  mrSmartPortal?: string | null;
  smartFolder?: string | null;
  // Add new template ID fields
  brAffidavitTemplateId?: string | null;
  mrAffidavitTemplateId?: string | null;
}

interface ProviderFormProps {
  mode: 'create' | 'edit';
  initialData?: DatabaseProvider;
  onSubmit: (data: FormData) => Promise<void>;
}

const formatPhoneNumber = (value: string) => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

const extractFilenameFromPath = (path: string | null | undefined): string => {
  if (!path) return 'Unknown document';
  // Extract filename from path like /uploads/hipaa/uuid-filename.pdf
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  // If filename is a UUID, show a friendly name instead
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z]+$/i.test(filename)) {
    return `Document-${filename.substring(0, 8)}${path.substring(path.lastIndexOf('.'))}`;
  }
  return filename;
};

export default function ProviderForm({ mode, initialData, onSubmit }: ProviderFormProps) {
  // Debug log the initial data
  console.log('ProviderForm initialData:', initialData);
  console.log('Initial BR Submission Method:', initialData?.brSubmissionMethod);
  console.log('Initial MR Submission Method:', initialData?.mrSubmissionMethod);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [deleteHipaaFile, setDeleteHipaaFile] = useState(false);
  const [affidavitTemplates, setAffidavitTemplates] = useState<AffidavitTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [useSameTemplate, setUseSameTemplate] = useState(false);
  const router = useRouter();

  // Fetch affidavit templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const response = await fetch('/api/affidavit-templates'); // Adjust API endpoint if needed
        if (!response.ok) {
          throw new Error('Failed to fetch affidavit templates');
        }
        const data = await response.json();
        // Assuming API returns { data: templates[] }
        setAffidavitTemplates(data.data || data || []); 
      } catch (error) {
        console.error('Error fetching affidavit templates:', error);
        toast.error('Failed to load affidavit templates.');
        setAffidavitTemplates([]);
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      streetAddress: initialData?.address ?? '',
      zipCode: initialData?.zipCode ?? '',
      city: initialData?.city ?? '',
      state: initialData?.state ?? '',
      attentionInfo: initialData?.attentionInfo ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      fax: initialData?.fax ?? '',
      hipaaRequired: initialData?.hipaaRequired ?? false,
      hipaaSampleFile: undefined,
      usesFax: initialData?.usesFax ?? false,
      usesEmail: initialData?.usesEmail ?? false,
      usesMail: initialData?.usesMail ?? false,
      usesSmartPortal: initialData?.usesSmartPortal ?? false,
      brSubmissionMethod: initialData?.brSubmissionMethod as SubmissionMethodType ?? SubmissionMethod.NONE,
      mrSubmissionMethod: initialData?.mrSubmissionMethod as SubmissionMethodType ?? SubmissionMethod.NONE,
      brFaxNumber: initialData?.brFaxNumber ?? '',
      mrFaxNumber: initialData?.mrFaxNumber ?? '',
      brEmailId: initialData?.brEmailId ?? '',
      mrEmailId: initialData?.mrEmailId ?? '',
      brMailingAddress: initialData?.brMailingAddress ?? '',
      mrMailingAddress: initialData?.mrMailingAddress ?? '',
      brSmartPortal: initialData?.brSmartPortal ?? '',
      mrSmartPortal: initialData?.mrSmartPortal ?? '',
      smartFolder: initialData?.smartFolder ?? '',
      brAffidavitTemplateId: initialData?.brAffidavitTemplateId ?? null,
      mrAffidavitTemplateId: initialData?.mrAffidavitTemplateId ?? null,
    },
  });

  // useEffect to update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('Setting form values from initialData');
      // Update the form with initialData
      form.setValue('name', initialData.name || '');
      form.setValue('hipaaRequired', initialData.hipaaRequired || false);
      
      // Set submission methods from initialData
      if (initialData.brSubmissionMethod) {
        console.log('Setting brSubmissionMethod:', initialData.brSubmissionMethod);
        form.setValue('brSubmissionMethod', initialData.brSubmissionMethod as SubmissionMethodType);
      }
      
      if (initialData.mrSubmissionMethod) {
        console.log('Setting mrSubmissionMethod:', initialData.mrSubmissionMethod);
        form.setValue('mrSubmissionMethod', initialData.mrSubmissionMethod as SubmissionMethodType);
      }
      
      // Set all other form fields
      form.setValue('streetAddress', initialData.address ?? '');
      form.setValue('zipCode', initialData.zipCode ?? '');
      form.setValue('city', initialData.city ?? '');
      form.setValue('state', initialData.state ?? '');
      form.setValue('attentionInfo', initialData.attentionInfo ?? '');
      form.setValue('email', initialData.email ?? '');
      form.setValue('phone', initialData.phone ?? '');
      form.setValue('fax', initialData.fax ?? '');
      form.setValue('usesFax', initialData.usesFax ?? false);
      form.setValue('usesEmail', initialData.usesEmail ?? false);
      form.setValue('usesMail', initialData.usesMail ?? false);
      form.setValue('usesSmartPortal', initialData.usesSmartPortal ?? false);
      form.setValue('brFaxNumber', initialData.brFaxNumber ?? '');
      form.setValue('mrFaxNumber', initialData.mrFaxNumber ?? '');
      form.setValue('brEmailId', initialData.brEmailId ?? '');
      form.setValue('mrEmailId', initialData.mrEmailId ?? '');
      form.setValue('brMailingAddress', initialData.brMailingAddress ?? '');
      form.setValue('mrMailingAddress', initialData.mrMailingAddress ?? '');
      form.setValue('brSmartPortal', initialData.brSmartPortal ?? '');
      form.setValue('mrSmartPortal', initialData.mrSmartPortal ?? '');
      form.setValue('smartFolder', initialData.smartFolder ?? '');
      form.setValue('brAffidavitTemplateId', initialData.brAffidavitTemplateId ?? null);
      form.setValue('mrAffidavitTemplateId', initialData.mrAffidavitTemplateId ?? null);
    }
  }, [initialData, form]);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = form;

  const hipaaRequired = watch('hipaaRequired');
  const zipCode = watch('zipCode');
  const brSubmissionMethod = watch('brSubmissionMethod');
  const mrSubmissionMethod = watch('mrSubmissionMethod');
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);
  const [locationError, setLocationError] = React.useState<string | null>(null);

  const documentFilename = initialData?.hipaaSample 
    ? extractFilenameFromPath(initialData.hipaaSample) 
    : '';

  useEffect(() => {
    const fetchLocationData = async (zip: string) => {
      if (zip.length !== 5) return;
      
      setIsLoadingLocation(true);
      setLocationError(null);
      
      try {
        const response = await fetch(`/api/location?zipCode=${zip}`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch location data');
        }
        
        const data = await response.json();
        setValue('city', data.city);
        setValue('state', data.state);
      } catch (error) {
        setLocationError(error instanceof Error ? error.message : 'Failed to fetch location data');
        clientLogger.error('Failed to fetch location data', { error });
      } finally {
        setIsLoadingLocation(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (zipCode?.length === 5) {
        fetchLocationData(zipCode);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [zipCode, setValue]);

  // Since we're using FormValues as our form data type
  type FormSubmitHandler = (data: Record<string, any>) => Promise<void>;

  const handleFormSubmit: FormSubmitHandler = async (data) => {
    try {
      // Check if HIPAA file is required but missing
      if (hipaaRequired) {
        const fileList = data.hipaaSampleFile as unknown as FileList;
        const hasFile = fileList && fileList.length > 0;
        const hasExistingFile = !!initialData?.hipaaSample;
        
        if (!hasFile && !hasExistingFile) {
          form.setError('hipaaSampleFile', {
            type: 'manual',
            message: 'HIPAA sample file is required'
          });
          return; // Prevent form submission
        }
      }

      const formData = new FormData();
      
      // Log the raw form data
      console.log('Raw form data:', data);

      // Handle file field first to ensure it's properly processed
      const fileList = data.hipaaSampleFile as unknown as FileList;
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        console.log('Attaching file to form:', file.name, 'size:', file.size);
        formData.append('hipaaSampleFile', file);
      } else {
        console.log('No file selected for upload');
      }

      // Append all other form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'hipaaSampleFile' && value !== undefined && value !== null) {
          // Append template IDs, ensuring null is sent as an empty string or omitted
          if (key === 'brAffidavitTemplateId' || key === 'mrAffidavitTemplateId') {
            if (value) { // Only append if value is not null/undefined/empty string
              formData.append(key, String(value));
              console.log(`Appending ${key}:`, value);
            } else {
              // Optionally append as empty string if backend expects it, otherwise omit
              // formData.append(key, ''); 
              console.log(`Omitting ${key} as it is null or empty`);
            }
          } else {
            formData.append(key, String(value));
            console.log(`Appending ${key}:`, value);
          }
        }
      });

      // Log the FormData entries
      try {
        Array.from(formData.entries()).forEach(([key, value]) => {
          console.log(`FormData entry - ${key}:`, typeof value === 'object' ? `File: ${(value as File).name}` : value);
        });
      } catch (error) {
        console.error('Error logging FormData entries:', error);
      }

      console.log('Watched hipaaRequired:', hipaaRequired);
      console.log('Watched brSubmissionMethod:', brSubmissionMethod);
      console.log('Watched mrSubmissionMethod:', mrSubmissionMethod);

      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit provider form:', error);
    }
  };

  // Function to handle file deletion
  const handleDeleteFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear the file input and value
    form.setValue('hipaaSampleFile', undefined);
    
    // If we're in edit mode and there's an existing file, we'll need to submit the form
    // with a special flag to indicate the file should be deleted
    if (mode === 'edit' && initialData?.hipaaSample) {
      // We can either set a special form field or handle this when form is submitted
      if (confirm('Do you want to remove the current HIPAA sample file?')) {
        // Here we're adding a field to indicate deletion when form is submitted
        const formData = new FormData();
        formData.append('id', initialData.id);
        formData.append('deleteHipaaSample', 'true');
        
        // Submit the form data to delete just the file
        onSubmit(formData);
      }
    }
  };

  // useEffect to sync MR template if useSameTemplate is checked and BR template changes
  useEffect(() => {
    if (useSameTemplate) {
      setValue('mrAffidavitTemplateId', watch('brAffidavitTemplateId'));
    }
  }, [watch('brAffidavitTemplateId'), useSameTemplate, setValue]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900">General Information</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Provider Name</Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone', {
                onChange: (e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  e.target.value = formatted;
                }
              })}
              placeholder="(XXX) XXX-XXXX"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="fax">Fax Number</Label>
            <Input
              id="fax"
              type="tel"
              {...register('fax', {
                onChange: (e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  e.target.value = formatted;
                }
              })}
              placeholder="(XXX) XXX-XXXX"
            />
            {errors.fax && (
              <p className="text-sm text-red-600">{errors.fax.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              type="text"
              {...register('streetAddress')}
            />
            {errors.streetAddress && (
              <p className="text-sm text-red-600">{errors.streetAddress.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <div className="relative">
              <Input
                id="zipCode"
                type="text"
                {...register('zipCode')}
                maxLength={5}
              />
              {isLoadingLocation && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                </div>
              )}
            </div>
            {errors.zipCode && (
              <p className="text-sm text-red-600">{errors.zipCode.message}</p>
            )}
            {locationError && (
              <p className="text-sm text-red-600">{locationError}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              {...register('city')}
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              type="text"
              {...register('state')}
            />
            {errors.state && (
              <p className="text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="attentionInfo">Attention Information</Label>
          <Textarea
            id="attentionInfo"
            rows={3}
            {...register('attentionInfo')}
          />
          {errors.attentionInfo && (
            <p className="text-sm text-red-600">{errors.attentionInfo.message}</p>
          )}
        </div>

        <div className="mt-6 flex items-center">
          <input
            type="checkbox"
            id="hipaaRequired"
            {...register('hipaaRequired')}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <Label htmlFor="hipaaRequired" className="ml-2">HIPAA Required</Label>
          {errors.hipaaRequired && (
            <p className="text-sm text-red-500 ml-2">
              {(errors.hipaaRequired.message as string) || 'Invalid input'}
            </p>
          )}
        </div>

        {hipaaRequired && (
          <div className="space-y-2 mt-4 p-4 bg-gray-50 rounded-md">
            <Label htmlFor="hipaaSampleFile">HIPAA Sample File</Label>
            <div className="flex flex-col space-y-1">
              <div className="relative">
                <Input
                  id="hipaaSampleFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      console.log("File selected:", files[0].name, "size:", files[0].size);
                      // Setting as the FileList object directly
                      form.setValue('hipaaSampleFile', files);
                      form.clearErrors('hipaaSampleFile');
                      
                      // Show immediate feedback that file was selected
                      const feedbackElement = e.target.nextElementSibling as HTMLElement;
                      if (feedbackElement) {
                        feedbackElement.classList.remove('hidden');
                        feedbackElement.textContent = `File selected: ${files[0].name}`;
                      }
                    } else {
                      console.log("No file selected");
                      const feedbackElement = e.target.nextElementSibling as HTMLElement;
                      if (feedbackElement) {
                        feedbackElement.classList.add('hidden');
                      }
                    }
                  }}
                />
                <p className="text-xs text-green-600 hidden ml-1">File selected. Click "Save Provider" to upload.</p>
              </div>
              
              {/* File actions */}
              {initialData?.hipaaSample && (
                <div className="flex flex-col space-y-1 mt-1">
                  <p className="text-sm font-medium">
                    Current file: <span className="text-indigo-600">{documentFilename}</span>
                  </p>
                  <div className="flex items-center space-x-2">
                    <a
                      href={initialData.hipaaSample}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Document
                    </a>
                    <button
                      type="button"
                      onClick={handleDeleteFile}
                      className="inline-flex items-center text-sm text-red-600 hover:text-red-500"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
              
              {errors.hipaaSampleFile && (
                <p className="text-sm text-red-500">
                  {String(errors.hipaaSampleFile.message || 'Invalid file')}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6 mt-8">
          <h3 className="text-lg font-medium text-gray-900">Submission Methods</h3>
          <p className="text-sm text-gray-500 mt-1">Configure how to submit records to this provider</p>
          
          <div className="mt-6 space-y-8">
            {/* Billing Records (BR) Submission Method */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-md">
              <div>
                <h4 className="text-base font-medium text-gray-800">Billing Records (BR) Submission Method</h4>
                <div className="mt-2">
                  <Select
                    value={brSubmissionMethod}
                    onValueChange={(value: SubmissionMethodType) => {
                      setValue('brSubmissionMethod', value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a submission method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SubmissionMethod.NONE}>None</SelectItem>
                      <SelectItem value={SubmissionMethod.FAX}>Via Fax</SelectItem>
                      <SelectItem value={SubmissionMethod.EMAIL}>Via Email</SelectItem>
                      <SelectItem value={SubmissionMethod.MAIL}>Via Mail</SelectItem>
                      <SelectItem value={SubmissionMethod.SMART_PORTAL}>Via Smart Portal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conditionally render BR Template Dropdown if method requires affidavit */}
              {brSubmissionMethod && 
               ([SubmissionMethod.FAX, SubmissionMethod.EMAIL, SubmissionMethod.MAIL] as SubmissionMethodType[])
               .includes(brSubmissionMethod) && (
                <div className="space-y-2">
                  <Label htmlFor="brAffidavitTemplateId">BR Affidavit Template</Label>
                  <Select
                    value={watch('brAffidavitTemplateId') ?? ''} // Keep this: null/undefined becomes empty string for Select
                    onValueChange={(value) => {
                      // Convert 'none' back to null for form state
                      const actualValue = value === "none" ? null : value;
                      setValue('brAffidavitTemplateId', actualValue);
                      // If using same template, sync MR immediately
                      if (useSameTemplate) {
                         setValue('mrAffidavitTemplateId', actualValue);
                      }
                    }}
                    disabled={isLoadingTemplates}
                  >
                    <SelectTrigger id="brAffidavitTemplateId">
                      <SelectValue placeholder={isLoadingTemplates ? "Loading templates..." : "Select a template (optional)"} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Use value="none" for the clear/no template option */}
                      <SelectItem value="none">No Template</SelectItem> 
                      {affidavitTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} (v{template.version})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* BR Fax Number */}
              {brSubmissionMethod === SubmissionMethod.FAX && (
                <div>
                  <Label htmlFor="brFaxNumber">BR Fax Number</Label>
                  <Input
                    id="brFaxNumber"
                    type="tel"
                    {...register('brFaxNumber', {
                      onChange: (e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        e.target.value = formatted;
                      }
                    })}
                    placeholder="(XXX) XXX-XXXX"
                  />
                  {errors.brFaxNumber && (
                    <p className="text-sm text-red-600">{errors.brFaxNumber.message}</p>
                  )}
                </div>
              )}

              {/* BR Email */}
              {brSubmissionMethod === SubmissionMethod.EMAIL && (
                <div>
                  <Label htmlFor="brEmailId">BR Email</Label>
                  <Input
                    id="brEmailId"
                    type="email"
                    {...register('brEmailId')}
                    placeholder="billing@example.com"
                  />
                  {errors.brEmailId && (
                    <p className="text-sm text-red-600">{errors.brEmailId.message}</p>
                  )}
                </div>
              )}

              {/* BR Mailing Address */}
              {brSubmissionMethod === SubmissionMethod.MAIL && (
                <div>
                  <Label htmlFor="brMailingAddress">BR Mailing Address</Label>
                  <Textarea
                    id="brMailingAddress"
                    rows={3}
                    {...register('brMailingAddress')}
                    placeholder="Enter billing mailing address"
                  />
                  {errors.brMailingAddress && (
                    <p className="text-sm text-red-600">{errors.brMailingAddress.message}</p>
                  )}
                </div>
              )}

              {/* BR Smart Portal */}
              {brSubmissionMethod === SubmissionMethod.SMART_PORTAL && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="brSmartPortal">BR Smart Portal URL</Label>
                    <Input
                      id="brSmartPortal"
                      type="text"
                      {...register('brSmartPortal')}
                      placeholder="https://portal.example.com/billing"
                    />
                    {errors.brSmartPortal && (
                      <p className="text-sm text-red-600">{errors.brSmartPortal.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="smartFolder">Smart Folder</Label>
                    <Input
                      id="smartFolder"
                      type="text"
                      {...register('smartFolder')}
                      placeholder="Provider's folder ID or path"
                    />
                    {errors.smartFolder && (
                      <p className="text-sm text-red-600">{errors.smartFolder.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* "Use Same Template" Checkbox */}
            <div className="flex items-center space-x-2 my-4">
              <input
                type="checkbox"
                id="useSameTemplate"
                checked={useSameTemplate}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setUseSameTemplate(checked);
                  if (checked) {
                    // Sync MR template to BR template when checked
                    setValue('mrAffidavitTemplateId', watch('brAffidavitTemplateId'));
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="useSameTemplate">Use same template for BR and MR</Label>
            </div>

            {/* Medical Records (MR) Submission Method */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-md">
              <div>
                <h4 className="text-base font-medium text-gray-800">Medical Records (MR) Submission Method</h4>
                <div className="mt-2">
                  <Select
                    value={mrSubmissionMethod}
                    onValueChange={(value: SubmissionMethodType) => {
                      setValue('mrSubmissionMethod', value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a submission method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SubmissionMethod.NONE}>None</SelectItem>
                      <SelectItem value={SubmissionMethod.FAX}>Via Fax</SelectItem>
                      <SelectItem value={SubmissionMethod.EMAIL}>Via Email</SelectItem>
                      <SelectItem value={SubmissionMethod.MAIL}>Via Mail</SelectItem>
                      <SelectItem value={SubmissionMethod.SMART_PORTAL}>Via Smart Portal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conditionally render MR Template Dropdown if method requires affidavit */}
              {mrSubmissionMethod && 
               ([SubmissionMethod.FAX, SubmissionMethod.EMAIL, SubmissionMethod.MAIL] as SubmissionMethodType[])
               .includes(mrSubmissionMethod) && (
                <div className="space-y-2">
                  <Label htmlFor="mrAffidavitTemplateId">MR Affidavit Template</Label>
                  <Select
                    value={watch('mrAffidavitTemplateId') ?? ''} // Keep this: null/undefined becomes empty string for Select
                    onValueChange={(value) => {
                      // Convert 'none' back to null for form state
                      const actualValue = value === "none" ? null : value;
                      setValue('mrAffidavitTemplateId', actualValue);
                    }}
                    disabled={useSameTemplate || isLoadingTemplates} // Disable if same template or loading
                  >
                    <SelectTrigger id="mrAffidavitTemplateId">
                      <SelectValue placeholder={isLoadingTemplates ? "Loading templates..." : "Select a template (optional)"} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Use value="none" for the clear/no template option */}
                      <SelectItem value="none">No Template</SelectItem>
                      {affidavitTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} (v{template.version})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* MR Fax Number */}
              {mrSubmissionMethod === SubmissionMethod.FAX && (
                <div>
                  <Label htmlFor="mrFaxNumber">MR Fax Number</Label>
                  <Input
                    id="mrFaxNumber"
                    type="tel"
                    {...register('mrFaxNumber', {
                      onChange: (e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        e.target.value = formatted;
                      }
                    })}
                    placeholder="(XXX) XXX-XXXX"
                  />
                  {errors.mrFaxNumber && (
                    <p className="text-sm text-red-600">{errors.mrFaxNumber.message}</p>
                  )}
                </div>
              )}

              {/* MR Email */}
              {mrSubmissionMethod === SubmissionMethod.EMAIL && (
                <div>
                  <Label htmlFor="mrEmailId">MR Email</Label>
                  <Input
                    id="mrEmailId"
                    type="email"
                    {...register('mrEmailId')}
                    placeholder="medical@example.com"
                  />
                  {errors.mrEmailId && (
                    <p className="text-sm text-red-600">{errors.mrEmailId.message}</p>
                  )}
                </div>
              )}

              {/* MR Mailing Address */}
              {mrSubmissionMethod === SubmissionMethod.MAIL && (
                <div>
                  <Label htmlFor="mrMailingAddress">MR Mailing Address</Label>
                  <Textarea
                    id="mrMailingAddress"
                    rows={3}
                    {...register('mrMailingAddress')}
                    placeholder="Enter medical records mailing address"
                  />
                  {errors.mrMailingAddress && (
                    <p className="text-sm text-red-600">{errors.mrMailingAddress.message}</p>
                  )}
                </div>
              )}

              {/* MR Smart Portal */}
              {mrSubmissionMethod === SubmissionMethod.SMART_PORTAL && (
                <div>
                  <Label htmlFor="mrSmartPortal">MR Smart Portal URL</Label>
                  <Input
                    id="mrSmartPortal"
                    type="text"
                    {...register('mrSmartPortal')}
                    placeholder="https://portal.example.com/medical"
                  />
                  {errors.mrSmartPortal && (
                    <p className="text-sm text-red-600">{errors.mrSmartPortal.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Provider'}
          </button>
        </div>
      </form>
    </Form>
  );
} 