import useSWR from 'swr';
import { AffidavitStatus } from '@/types/affidavit';

export type AffidavitWithRelations = {
  id: string;
  patientId: string;
  providerId: string;
  templateId: string | null;
  content: string;
  status: AffidavitStatus | string;
  verificationCode: string | null;
  generatedFilePath: string | null;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    patientName: string;
  };
  provider: {
    id: string;
    name: string;
  };
  template?: {
    id: string;
    name: string;
  } | null;
};

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

async function fetchAffidavits(url: string): Promise<AffidavitWithRelations[]> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch data');
  }
  const response: ApiResponse<AffidavitWithRelations[]> = await res.json();
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

async function fetchAffidavit(url: string): Promise<AffidavitWithRelations> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch data');
  }
  const response: ApiResponse<AffidavitWithRelations> = await res.json();
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

export function useAffidavits() {
  const { data, error, mutate } = useSWR<AffidavitWithRelations[]>(
    '/api/affidavit',
    fetchAffidavits
  );

  return {
    affidavits: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useAffidavit(id: string) {
  const { data, error, mutate } = useSWR<AffidavitWithRelations>(
    id ? `/api/affidavit?id=${id}` : null,
    fetchAffidavit
  );

  return {
    affidavit: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export async function createAffidavit(data: {
  patientId: string;
  providerId: string;
  templateId?: string;
  content: Record<string, any>;
}) {
  const { patientId, providerId, templateId, content } = data;
  
  console.log('Creating new affidavit record with data:', data);

  const res = await fetch('/api/affidavits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientId,
      providerId,
      templateId,
      content,
    }),
  });

  const responseText = await res.text();
  console.log('Server response for create affidavit:', responseText);
  
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error('Error parsing response as JSON:', e);
    throw new Error('Invalid response from server');
  }

  if (!res.ok) {
    throw new Error(responseData.error || responseData.message || 'Failed to create affidavit');
  }

  return responseData;
}

export async function updateAffidavit(data: {
  id: string;
  content?: Record<string, any>;
  status?: AffidavitStatus | string;
}) {
  console.log('Updating affidavit with data:', data);
  
  const res = await fetch('/api/affidavit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseText = await res.text();
  console.log('Server response:', responseText);
  
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error('Error parsing response as JSON:', e);
    throw new Error('Invalid response from server');
  }

  if (!res.ok) {
    throw new Error(responseData.error || responseData.message || 'Failed to update affidavit');
  }

  return responseData;
}

export async function deleteAffidavit(id: string) {
  console.log('Deleting affidavit with ID:', id);
  
  const res = await fetch(`/api/affidavit?id=${id}`, {
    method: 'DELETE',
  });

  const responseText = await res.text();
  console.log('Server response:', responseText);
  
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error('Error parsing response as JSON:', e);
    throw new Error('Invalid response from server');
  }

  if (!res.ok) {
    throw new Error(responseData.error || responseData.message || 'Failed to delete affidavit');
  }

  return responseData;
} 