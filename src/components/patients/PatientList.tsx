'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, Pencil, Send, Trash2, PlusCircle } from 'lucide-react'; 
// Import hook and the exported Patient type
import { usePatientMutation, usePatients, Patient } from '@/hooks/usePatients'; 
import { format } from 'date-fns';
import Link from 'next/link';

// Helper function to format dates safely
const formatDateSafe = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy'); 
  } catch (error) {
    console.error("Date formatting error:", error);
    return 'Invalid Date';
  }
};

export function PatientList() {
  const router = useRouter();
  // Use state/functions from the hook
  const { 
    patients, 
    isLoading, 
    error, 
    pagination, 
    currentPage, 
    setCurrentPage, 
    mutate // Get mutate function from the hook
  } = usePatients();
  
  // Local state for delete dialog
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  // Mutation hook
  const { deletePatient, isLoading: isDeleting, error: deleteError } = usePatientMutation(); 

  const handleEdit = (patientId: string) => {
    router.push(`/patients/${patientId}/edit`);
  };

  const handleSend = (patientId: string) => {
    console.log("Send action for patient:", patientId);
    toast.info("Send functionality not yet implemented.");
  };

  const handleDelete = (patientId: string) => {
    setPatientToDelete(patientId);
  };

  // Confirm delete function with refresh logic
  const confirmDelete = async () => {
    if (!patientToDelete) return;
    console.log("Confirming delete for patient ID:", patientToDelete);
    
    const result = await deletePatient(patientToDelete);
    
    if (deleteError || result === null) { 
      const errorMessage = 
        (deleteError as any)?.message || 
        (typeof deleteError === 'string' ? deleteError : null) || 
        'Failed to delete patient. Check related records.';
      toast.error(errorMessage);
    } else {
      toast.success('Patient deleted successfully.');
      // Refresh list data using mutate
      mutate(); // Call SWR mutate to revalidate/refetch
      // Optional: Optimistic UI update before calling mutate
      // mutate(currentData => ({ 
      //    ...currentData,
      //    data: currentData.data.filter(p => p.id !== patientToDelete)
      // }), false); // Set revalidate to false for optimistic update
      
      // Handle pagination if needed (optional, mutate might handle this depending on setup)
      if (patients?.length === 1 && currentPage > 1) {
         setCurrentPage(currentPage - 1); 
      }
      // No need for explicit refreshData call anymore
    }
    setPatientToDelete(null); 
  };

  // Use hook's loading state
  if (isLoading) {
    return <div>Loading patients...</div>;
  }

  // Use hook's error state
  if (error) {
      return <div className="text-red-600">Error loading patients: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patients</h2>
        <Button onClick={() => router.push('/patients/new')}>
          <PlusCircle className="mr-2 h-4 w-4" /> 
          Add New Patient
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>DOI</TableHead>
            <TableHead>Provider(s)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!patients || patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No patients found.
              </TableCell>
            </TableRow>
          ) : ( 
            // Explicitly use the imported Patient type
            patients.map((patient: Patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.patientName}</TableCell>
                <TableCell>{formatDateSafe(patient.dateOfBirth)}</TableCell>
                <TableCell>{formatDateSafe(patient.dateOfInjury)}</TableCell>
                <TableCell>
                  {/* Iterate through detailed providers */}
                  {patient.providers && patient.providers.length > 0 ? (
                    <div className="space-y-2">
                      {/* Use correct inline type for the detailed provider object */}
                      {patient.providers.map((prov: { linkId: string; providerId: string; name: string; requestType: string }) => (
                        <div key={prov.linkId} className="flex items-center justify-between border-b border-gray-100 py-1 last:border-b-0">
                          <div className="flex flex-col">
                             <Link 
                              href={`/providers/${prov.providerId}`} 
                              target="_blank"
                              className="text-sm font-medium text-blue-600 hover:underline truncate"
                              title={`View Provider ${prov.name}`}
                             >
                              {prov.name || 'N/A'}
                             </Link>
                             <span className="text-xs text-gray-500">
                               Request Type: {prov.requestType || 'N/A'}
                             </span>
                          </div>
                          {/* Provider-specific actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                title={`View Provider ${prov.name}`}
                                onClick={() => router.push(`/providers/${prov.providerId}`)}
                                className="h-6 w-6 text-gray-600"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                title={`Send Request to ${prov.name}`}
                                // onClick={() => handleSendProvider(prov.linkId)} // Placeholder
                                onClick={() => toast.info('Send functionality not implemented yet.')}
                                className="h-6 w-6 text-gray-600"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                title={`Edit Provider ${prov.name}`}
                                onClick={() => router.push(`/providers/${prov.providerId}/edit`)}
                                className="h-6 w-6 text-gray-600"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                title={`Remove link to ${prov.name}`}
                                // onClick={() => handleDeleteProviderLink(prov.linkId)} // Placeholder
                                onClick={() => toast.info('Removing provider link not implemented yet.')}
                                className="h-6 w-6 text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  {/* Action Buttons */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title={`View Patient ${patient.patientName}`} 
                    onClick={() => router.push(`/patients/${patient.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(patient.id)}
                    title={`Edit Patient ${patient.patientName}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSend(patient.id)}
                    title="Send Request (Patient)"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  {/* Delete Dialog */}                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(patient.id)}
                        title={`Delete Patient ${patient.patientName}`}
                        className="text-red-600 hover:text-red-700"
                        disabled={isDeleting} // Disable button when delete is in progress
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Patient: {patient?.patientName || 'this patient'}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the patient record,
                          associated provider links, and potentially related affidavits.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                          {isDeleting ? 'Deleting...' : 'Delete'} 
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage(currentPage - 1); }}
                className={currentPage === 1 ? 'pointer-events-none text-gray-400' : ''}
              />
            </PaginationItem>
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              // Simple pagination display logic
              if (page === 1 || page === pagination.totalPages || Math.abs(page - currentPage) <= 1) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      href="#"
                      onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (Math.abs(page - currentPage) === 2) {
                  return <PaginationEllipsis key={`ellipsis-${page}`} />;
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage(currentPage + 1); }}
                className={currentPage === pagination.totalPages ? 'pointer-events-none text-gray-400' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}