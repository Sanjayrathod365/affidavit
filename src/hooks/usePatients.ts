import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr'; // Import useSWR
import { useProviders } from './useProviders';

interface Provider {
  id: string;
  name: string;
}

// Revert to Patient interface matching API list response
export interface Patient {
  id: string;
  patientName: string;
  dateOfBirth: string | null;
  dateOfInjury: string | null;
  createdAt?: string;
  updatedAt?: string;
  providers: {
    linkId: string;       // ID of the PatientProvider record
    providerId: string;   // ID of the Provider
    name: string;         // Name of the Provider
    requestType: string;  // Type of request for this link
  }[];
  affidavitTypes: string; // Add the field returned by the updated API
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Define the expected API response structure
interface PatientsApiResponse {
  data: Patient[];
  pagination: PaginationState;
  error: string | null;
}

// Define the fetcher function for SWR
const fetcher = async (url: string): Promise<PatientsApiResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch patients' }));
    throw new Error(errorData.error || 'Failed to fetch patients');
  }
  const data = await response.json();
  // Basic validation of the response structure
  if (!data || !data.data || !data.pagination) {
      throw new Error('Invalid API response structure for patients');
  }
  return data;
};

export function usePatients(initialPage = 1, initialPageSize = 10) {
  // State for pagination controls
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // SWR key will include page and pageSize to refetch on change
  const swrKey = `/api/patients?page=${currentPage}&pageSize=${pageSize}`;

  // Use the useSWR hook
  const { data: apiResponse, error, isLoading, mutate } = useSWR<PatientsApiResponse>(
      swrKey, 
      fetcher, 
      { 
          // Optional: Configuration like revalidation settings
          // revalidateOnFocus: false,
          // keepPreviousData: true, // Useful for pagination to avoid flashing loading state
      }
  );

  // Extract data and pagination from the SWR response
  const patients = apiResponse?.data || [];
  const pagination = apiResponse?.pagination || null;

  // Function to change page
  const goToPage = (newPage: number) => {
    if (newPage > 0 && (!pagination || newPage <= pagination.totalPages)) {
      setCurrentPage(newPage);
      // SWR will automatically refetch because swrKey changes
    }
  };
  
  // Note: refreshData is now just mutate() from SWR
  // const refreshData = useCallback(() => { ... }); // Remove old refreshData

  return { 
    patients, // Data from SWR
    isLoading, // Loading state from SWR
    error: error ? (error.message || 'An error occurred') : null, // Error state from SWR (extract message)
    pagination, // Pagination info from SWR response
    currentPage, // Current page state 
    pageSize, // Current page size state
    setCurrentPage: goToPage, // Function to change page
    setPageSize, // Function to change page size (will trigger refetch)
    mutate // Expose SWR's mutate function 
  };
}

// NOTE: usePatient hook likely needs adjustment too if it fetches from the same endpoint
// For now, we assume it fetches from /api/patients/[id] which has a different structure
export function usePatient(id: string | undefined) {
  // Define Patient detail type (might differ from list item)
  interface PatientDetail {
    id: string;
    patientName: string;
    dateOfBirth: string | null;
    dateOfInjury: string | null;
    createdAt?: string;
    updatedAt?: string;
    affidavits?: any[]; // Define affidavit type if needed
    providers?: any[]; // Define provider selection type if needed
    providerSelections?: any[]; // This seems to be the formatted one
  }

  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/patients/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient');
        }
        const data = await response.json();
        
        if (data && data.data) {
          setPatient(data.data);
        } else {
          setError('Patient data not found');
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
        console.error('Error fetching patient:', err);
      }
    };

    fetchPatient();
  }, [id]);

  return { patient, isLoading, error };
}

export function usePatientMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createPatient = async (patientData: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        body: patientData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create patient');
      }

      setSuccess(true);
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating patient:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatient = async (id: string, patientData: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        body: patientData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update patient');
      }

      setSuccess(true);
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating patient:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete patient');
      }

      setSuccess(true);
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting patient:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPatient,
    updatePatient,
    deletePatient,
    isLoading,
    error,
    success,
  };
} 