'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PatientForm } from '@/components/PatientForm';
import { ProviderSelection, ProviderRequest } from '@/components/ProviderSelection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Provider {
  id: string;
  name: string;
}

interface Patient {
  id: string;
  patientName: string;
  dateOfBirth: string;
  dateOfInjury: string;
  endDate?: string | null;
  providerSelections?: ProviderRequest[];
}

export default function EditPatientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [providerSelections, setProviderSelections] = useState<ProviderRequest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patient data
        const patientRes = await fetch(`/api/patients/${params.id}`);
        if (!patientRes.ok) throw new Error('Failed to fetch patient');
        const { data: patientData } = await patientRes.json();
        
        console.log('Patient data from API:', patientData);
        setPatient(patientData);
        
        if (patientData.providerSelections) {
          setProviderSelections(patientData.providerSelections);
        }

        // Fetch providers
        const providersRes = await fetch('/api/providers');
        if (!providersRes.ok) throw new Error('Failed to fetch providers');
        const { data: providersData } = await providersRes.json();
        setProviders(Array.isArray(providersData) ? providersData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handlePatientUpdate = async (updatedPatient: Partial<Patient>) => {
    setSaving(true);
    try {
      // Include provider selections in the update
      const patientWithProviders = {
        ...updatedPatient,
        providerSelections
      };
      
      console.log('Sending update with data:', patientWithProviders);
      
      const response = await fetch(`/api/patients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientWithProviders),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update patient');
      }

      const data = await response.json();
      const updatedData = data.data || data;
      setPatient(updatedData);
      
      if (updatedData.providerSelections) {
        setProviderSelections(updatedData.providerSelections);
      }
      
      toast.success('Patient updated successfully');
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update patient');
    } finally {
      setSaving(false);
    }
  };

  const handleProviderSelectionsChange = (selections: ProviderRequest[]) => {
    console.log('Provider selections changed:', selections);
    setProviderSelections(selections);
  };
  
  const handleSaveAll = async () => {
    if (!patient) return;
    
    setSaving(true);
    try {
      const patientWithProviders = {
        patientName: patient.patientName,
        dateOfBirth: patient.dateOfBirth,
        dateOfInjury: patient.dateOfInjury,
        endDate: patient.endDate,
        providerSelections
      };
      
      console.log('Saving all patient data (PUT request body):', JSON.stringify(patientWithProviders, null, 2));
      
      const response = await fetch(`/api/patients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientWithProviders),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update patient');
      }

      const data = await response.json();
      const updatedData = data.data || data;
      setPatient(updatedData);
      
      if (updatedData.providerSelections) {
        setProviderSelections(updatedData.providerSelections);
      }
      
      toast.success('Patient updated successfully');
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update patient');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Patient not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Patient</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push('/patients')}
          >
            Back to Patients
          </Button>
          <Button 
            variant="default"
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientForm
              mode="edit"
              initialData={{
                id: patient.id,
                patientName: patient.patientName,
                dateOfBirth: patient.dateOfBirth,
                dateOfInjury: patient.dateOfInjury,
                endDate: patient.endDate
              }}
              isSubmitting={saving}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider Selections</CardTitle>
          </CardHeader>
          <CardContent>
            <ProviderSelection
              providers={providers}
              initialSelections={providerSelections}
              onChange={handleProviderSelectionsChange}
              dateOfInjury={patient.dateOfInjury}
              patientId={patient.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 