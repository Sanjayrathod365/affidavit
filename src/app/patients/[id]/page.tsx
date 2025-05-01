'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

// Define the structure for a single affidavit as returned by the API
interface AffidavitInfo {
  id: string;
  status: string;
  createdAt: string; // API returns ISO string
  generatedFilePath: string | null; // Added field
  template: {
    id: string;
    name: string;
  } | null;
}

// Define the structure for the patient detail data
interface PatientDetail {
  id: string;
  patientName: string;
  dateOfBirth: string | null; // API returns ISO string or null
  dateOfInjury: string | null; // API returns ISO string or null
  createdAt: string; // API returns ISO string
  updatedAt: string; // API returns ISO string
  affidavits: AffidavitInfo[];
}

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string; // Get ID from URL

  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails();
    } else {
      setError('Patient ID not found in URL.');
      setIsLoading(false);
    }
  }, [patientId]);

  const fetchPatientDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/patients?id=${patientId}`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to fetch patient details');
      }
      
      if (!responseData.data) {
        throw new Error('Patient not found');
      }

      setPatient(responseData.data);
    } catch (err) {
      console.error('Error fetching patient details:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(`Failed to load patient details: ${errorMessage}`);
      setPatient(null); // Clear patient data on error
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP'); // e.g., Jun 18, 2024
    } catch {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return <div className="container py-6 text-center">Loading patient details...</div>;
  }

  if (error) {
    return <div className="container py-6 text-center text-red-600">Error: {error}</div>;
  }

  if (!patient) {
    return <div className="container py-6 text-center">Patient not found.</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <Button variant="outline" onClick={() => router.push('/patients')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patient List
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Patient Details</h1>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{patient.patientName}</CardTitle>
          <CardDescription>Patient ID: {patient.id}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Date of Birth</p>
            <p>{formatDate(patient.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date of Injury</p>
            <p>{formatDate(patient.dateOfInjury)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Record Created</p>
            <p>{formatDate(patient.createdAt)}</p>
          </div>
           <div>
            <p className="text-sm font-medium text-gray-500">Last Updated</p>
            <p>{formatDate(patient.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Associated Affidavits Card */}
      <Card>
        <CardHeader>
          <CardTitle>Associated Affidavits</CardTitle>
        </CardHeader>
        <CardContent>
          {patient.affidavits.length === 0 ? (
            <p className="text-center text-gray-500">No affidavits found for this patient.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Affidavit ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Created On</TableHead>
                  {/* Add Actions column if needed */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.affidavits.map((affidavit) => (
                  <TableRow key={affidavit.id}>
                    <TableCell className="font-mono text-xs">{affidavit.id}</TableCell>
                    <TableCell>
                      <Badge variant={affidavit.status === 'APPROVED' ? 'default' : 'secondary'}>
                        {affidavit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{affidavit.template?.name || 'N/A'}</TableCell>
                    <TableCell>{formatDate(affidavit.createdAt)}</TableCell>
                    {/* Actions Cell */}
                    <TableCell className="text-right space-x-1">
                      {affidavit.generatedFilePath ? (
                        <>
                          <Button variant="outline" size="sm" asChild>
                            <a href={affidavit.generatedFilePath} target="_blank" rel="noopener noreferrer">View PDF</a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                             <a href={affidavit.generatedFilePath} download>Download</a>
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">No PDF</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 