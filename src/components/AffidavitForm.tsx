import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAffidavitSchema } from '@/lib/validations/affidavit';
import type { CreateAffidavitInput } from '@/lib/validations/affidavit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import { usePatients } from '@/hooks/usePatients';
import { useProviders } from '@/hooks/useProviders';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";

interface AffidavitTemplate {
  id: string;
  name: string;
  description?: string;
  version: number;
}

interface Provider {
  id: string;
  name: string;
}

interface PatientProviderLink {
  provider: Provider;
  // include other fields if needed
}

interface PatientDetailsResponse {
  data: {
    patientName: string;
    dateOfBirth: string | null;
    // Add other patient fields here if needed by the form
    providers: PatientProviderLink[];
  };
  error?: string | null;
}

interface AffidavitFormProps {
  onSubmit: (data: CreateAffidavitInput) => Promise<void>;
  initialData?: Partial<CreateAffidavitInput>;
  isLoading?: boolean;
}

export default function AffidavitForm({
  onSubmit,
  initialData,
  isLoading = false,
}: AffidavitFormProps) {
  const { patients, isLoading: isLoadingPatients, error: patientError } = usePatients();
  const { providers: allProviders, isLoading: isLoadingProviders, error: providerError } = useProviders();
  
  const patientsList = Array.isArray(patients) ? patients : [];
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [isLoadingPatientDetails, setIsLoadingPatientDetails] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(initialData?.content?.dob ? new Date(initialData.content.dob) : new Date());
  const [endDate, setEndDate] = useState<Date | null>(initialData?.content?.dateRange ? new Date(initialData.content.dateRange.split(' to ')[1]) : null);
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [templates, setTemplates] = useState<AffidavitTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  const isDataLoading = isLoadingPatients || isLoadingProviders || isLoadingTemplates;
  const dataError = patientError || providerError;

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        const response = await fetch('/api/affidavit-templates');
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        
        const data = await response.json();
        setTemplates(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load templates');
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues
  } = useForm<CreateAffidavitInput>({
    resolver: zodResolver(createAffidavitSchema),
    defaultValues: initialData,
  });

  const recordTypes = watch('content.recordTypes') || [];
  const watchTemplateId = watch('templateId');
  const watchDateRange = watch('content.dateRange');
  const watchPatientId = watch('patientId');
  const watchProviderId = watch('providerId');

  useEffect(() => {
    if (dataError) {
      toast.error(dataError);
    }
  }, [dataError]);

  useEffect(() => {
    if (startDate) {
      const startDateStr = startDate.toLocaleDateString();
      const endDateStr = endDate ? endDate.toLocaleDateString() : 'present';
      const dateRangeValue = `${startDateStr} to ${endDateStr}`;
      setValue('content.dateRange', dateRangeValue);
      console.log('Setting date range to:', dateRangeValue);
    }
  }, [startDate, endDate, setValue]);

  useEffect(() => {
    const fetchAndSetPatientData = async (patientId: string) => {
      setIsLoadingPatientDetails(true);
      setFilteredProviders([]);
      setValue('providerId', '');
      setValue('content.providerName', '');
      try {
        const res = await fetch(`/api/patients/${patientId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch patient details');
        }
        const result: PatientDetailsResponse = await res.json();
        if (result.error) {
          throw new Error(result.error);
        }
        const patientData = result.data;
        
        if (patientData) {
          setValue('content.patientName', patientData.patientName || '');
          const dobString = patientData.dateOfBirth;
          const dobDate = dobString ? new Date(dobString) : null;
          setValue('content.dob', dobDate && !isNaN(dobDate.getTime()) ? format(dobDate, 'yyyy-MM-dd') : '');

          if (patientData.providers && Array.isArray(patientData.providers)) {
            const linkedProviders = patientData.providers.map(link => link.provider).filter(p => p);
             setFilteredProviders(linkedProviders);
          } else {
            setFilteredProviders([]);
          }
        } else {
           setFilteredProviders([]);
        }
        
      } catch (error) {
        console.error("Error fetching patient details:", error);
        toast.error('Failed to load providers for the selected patient.');
        setFilteredProviders([]);
      } finally {
        setIsLoadingPatientDetails(false);
      }
    };

    if (watchPatientId && patientsList) {
      fetchAndSetPatientData(watchPatientId);
    } else {
      setValue('content.patientName', '');
      setValue('content.dob', '');
      setValue('providerId', '');
      setValue('content.providerName', '');
      setFilteredProviders([]);
    }
  }, [watchPatientId, patientsList, setValue]);

  useEffect(() => {
    if (watchProviderId && filteredProviders.length > 0) {
      const selectedProvider = filteredProviders.find(p => p.id === watchProviderId);
      if (selectedProvider) {
        setValue('content.providerName', selectedProvider.name);
      } else {
        setValue('content.providerName', '');
      }
    } else {
      setValue('content.providerName', '');
    }
  }, [watchProviderId, filteredProviders, setValue]);

  const handleRecordTypeChange = (type: string) => {
    const currentTypes = new Set(recordTypes);
    if (currentTypes.has(type)) {
      currentTypes.delete(type);
    } else {
      currentTypes.add(type);
    }
    setValue('content.recordTypes', Array.from(currentTypes));
  };

  const validateBeforeSubmit = async (data: CreateAffidavitInput) => {
    console.log("[AffidavitForm] validateBeforeSubmit triggered.");
    setFormSubmitted(true);
    
    if (!data.content.dateRange) {
      toast.error('Please select a date range');
      return;
    }
    
    console.log('Submitting form with data:', data);
    await onSubmit(data);
  };

  if (isDataLoading || isLoadingTemplates) {
    return <div>Loading data...</div>;
  }

  if (dataError) {
    return <div>Error loading data: {dataError}</div>;
  }

  if (patientsList.length === 0) {
    return <div>No patients available. Please create a patient first.</div>;
  }

  if (allProviders.length === 0) {
    return <div>No providers available. Please create a provider first.</div>;
  }

  return (
    <form onSubmit={handleSubmit(validateBeforeSubmit, (errors) => {
      console.error('[AffidavitForm] React-hook-form validation errors:', errors);
      toast.error('Please fix the errors in the form');
    })} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Template (Optional)
        </label>
        <select
          {...register('templateId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">No Template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} (v{template.version})
            </option>
          ))}
        </select>
        {watchTemplateId && (
          <p className="mt-1 text-sm text-gray-500">
            Using template will apply pre-defined structure and styling to your affidavit
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Select Patient</label>
        <select
          {...register('patientId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a patient</option>
          {patientsList.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.patientName}
            </option>
          ))}
        </select>
        {errors.patientId && (
          <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Select Provider</label>
        <select
          {...register('providerId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={!watchPatientId || isLoadingPatientDetails}
        >
          <option value="">{isLoadingPatientDetails ? 'Loading providers...' : (watchPatientId ? 'Select a provider' : 'Select patient first')}</option>
          {filteredProviders.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
        {errors.providerId && (
          <p className="mt-1 text-sm text-red-600">{errors.providerId.message}</p>
        )}
        {!isLoadingPatientDetails && watchPatientId && filteredProviders.length === 0 && (
          <p className="mt-1 text-sm text-orange-600">No providers are linked to this patient. Please link providers on the Edit Patient page.</p>
        )}
      </div>

      <input type="hidden" {...register('content.patientName')} />
      <input type="hidden" {...register('content.dob')} />
      <input type="hidden" {...register('content.providerName')} />
      <input type="hidden" {...register('content.dateRange')} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-xs text-gray-500 mb-1">Start Date <span className="text-red-500">*</span></label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formSubmitted && !startDate ? 'border-red-500' : ''}`}
              dateFormat="MM/dd/yyyy"
              placeholderText="Start date"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-xs text-gray-500 mb-1">End Date (optional)</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              dateFormat="MM/dd/yyyy"
              placeholderText="End date or leave blank for 'present'"
              minDate={startDate || undefined}
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Calculated Range for Submission: {watchDateRange || 'Select dates'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Record Types</label>
        <div className="mt-2 space-y-2">
           <div className="flex items-center">
             <input
               type="checkbox"
               checked={recordTypes.includes('Medical Records')}
               onChange={() => handleRecordTypeChange('Medical Records')}
               className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
             />
             <label className="ml-2 text-sm text-gray-700">Medical Records</label>
           </div>
           <div className="flex items-center">
             <input
               type="checkbox"
               checked={recordTypes.includes('Billing Records')}
               onChange={() => handleRecordTypeChange('Billing Records')}
               className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
             />
             <label className="ml-2 text-sm text-gray-700">Billing Records</label>
           </div>
        </div>
        {errors.content?.recordTypes && (
          <p className="mt-1 text-sm text-red-600">{errors.content.recordTypes.message}</p>
        )}
      </div>

      <div className="mt-6">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Affidavit Request'
          )}
        </Button>
      </div>
    </form>
  );
} 