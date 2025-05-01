import { useState, useEffect, useCallback } from 'react';

interface Provider {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  brEmailId?: string;
  mrEmailId?: string;
  fax?: string;
  hipaaRequired?: boolean;
  hipaaSample?: string;
  createdAt?: string;
  updatedAt?: string;
  // Additional fields used in components
  email?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  attentionInfo?: string;
  brFaxNumber?: string;
  mrFaxNumber?: string;
  brMailingAddress?: string;
  mrMailingAddress?: string;
  brSmartPortal?: string;
  mrSmartPortal?: string;
  smartFolder?: string;
  usesFax?: boolean;
  usesEmail?: boolean;
  usesMail?: boolean;
  usesSmartPortal?: boolean;
  brSubmissionMethod?: string;
  mrSubmissionMethod?: string;
  // Add new template ID fields
  brAffidavitTemplateId?: string | null;
  mrAffidavitTemplateId?: string | null;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export function useProviders(initialPage = 1, initialPageSize = 10) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [pagination, setPagination] = useState<PaginationState | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async (page: number, size: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/providers?page=${page}&pageSize=${size}`);
      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }
      const data = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        setProviders(data.data);
        setPagination(data.pagination || null);
      } else {
        console.warn('Provider data not in expected format, using empty array');
        setProviders([]);
        setPagination(null);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProviders([]); // Clear providers on error
      setPagination(null); // Clear pagination on error
      console.error('Error fetching providers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array: fetchProviders function itself doesn't change

  useEffect(() => {
    fetchProviders(currentPage, pageSize);
  }, [currentPage, pageSize, fetchProviders]); // Re-fetch when page, size, or function changes

  // Function to change page
  const goToPage = (newPage: number) => {
    if (newPage > 0 && (!pagination || newPage <= pagination.totalPages)) {
      setCurrentPage(newPage);
    }
  };

  return { 
    providers, 
    isLoading, 
    error, 
    pagination, 
    currentPage, 
    pageSize, 
    setCurrentPage: goToPage, // Expose function to change page 
    setPageSize // Expose function to change page size if needed
  };
}

export function useProvider(id: string | undefined) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/providers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch provider');
        }
        const data = await response.json();
        
        if (data && data.data) {
          setProvider(data.data);
        } else {
          setError('Provider data not found');
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
        console.error('Error fetching provider:', err);
      }
    };

    fetchProvider();
  }, [id]);

  return { provider, isLoading, error };
}

export function useProviderMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createProvider = async (providerData: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/providers', {
        method: 'POST',
        body: providerData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create provider');
      }

      setSuccess(true);
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating provider:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProvider = async (id: string, providerData: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/providers/${id}`, {
        method: 'PUT',
        body: providerData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update provider');
      }

      setSuccess(true);
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating provider:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProvider = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/providers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete provider');
      }

      setSuccess(true);
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting provider:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProvider,
    updateProvider,
    deleteProvider,
    isLoading,
    error,
    success,
  };
} 