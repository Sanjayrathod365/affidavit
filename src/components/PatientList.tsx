'use client';

import React, { useState, useEffect } from 'react';
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
import { Eye, Pencil, Send, Trash2, FileText, Mail, Printer } from 'lucide-react';
import { usePatientMutation, usePatients } from '@/hooks/usePatients';
import { format } from 'date-fns';
import Link from 'next/link';

// Use the Patient interface again (should be correct via hook now)
interface Patient {
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
  affidavitTypes: string;
}

// Remove unused link interface
/*
interface PatientProviderLink {
  linkId: string; 
  patientId: string;
  patientName: string;
  dateOfBirth: string | null;
  dateOfInjury: string | null;
  providerId: string;
  providerName: string;
  requestType: string;
}
*/

// Helper function to format request type strings
const formatRequestType = (type: string): string => {
  if (!type) return 'N/A';
  return type
    .split('_') // Split by underscore
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
    .join(' '); // Join with spaces
};

// Helper function to format dates safely
const formatDateSafe = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy'); // Example format
  } catch (error) {
    console.error("Date formatting error:", error);
    return 'Invalid Date';
  }
};

// Interface for data needed for the send dialog
interface SendRequestInfo {
  patientId: string;
  linkId: string;
  providerName: string;
}

export function PatientList() {
  const router = useRouter();
  const { 
    patients, 
    isLoading, 
    error, 
    pagination, 
    currentPage, 
    setCurrentPage,
    mutate // Get mutate from usePatients to refresh list 
  } = usePatients();
  
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const { deletePatient, isLoading: isDeleting, error: deleteError } = usePatientMutation();

  // State for Send Request Dialog
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [sendRequestInfo, setSendRequestInfo] = useState<SendRequestInfo | null>(null);
  const [isSending, setIsSending] = useState(false); // Loading state for send operation

  const handleEdit = (patientId: string) => {
    router.push(`/patients/${patientId}/edit`);
  };

  // General Send action (not used for provider links)
  const handleSend = (patientId: string) => {
    console.log("Send action for patient:", patientId);
    toast.info("Send functionality not yet implemented.");
  };

  const handleDelete = (patientId: string) => {
    setPatientToDelete(patientId);
  };

  const handleViewProviderLink = (patientId: string, linkId: string) => {
    console.log(`View action for patient ${patientId}, provider link ${linkId}`);
    toast.info("View affidavit functionality for this provider link not yet implemented.");
  };

  // --- Updated handleSendProviderLink to open dialog --- 
  const handleSendProviderLink = (patientId: string, linkId: string, providerName: string) => {
    setSendRequestInfo({ patientId, linkId, providerName });
    setIsSendDialogOpen(true);
  };

  const handleEditProviderLink = (patientId: string, linkId: string) => {
    console.log(`Edit action for patient ${patientId}, provider link ${linkId}`);
    toast.info("Edit functionality for this provider link not yet implemented.");
  };

  const handleDeleteProviderLink = (patientId: string, linkId: string) => {
    console.log(`Delete action for patient ${patientId}, provider link ${linkId}`);
    toast.warning("Delete functionality for this provider link not yet implemented. API endpoint needed.");
  };

  // --- Function to call the API --- 
  const confirmSendRequest = async (method: 'email' | 'fax') => {
    if (!sendRequestInfo) return;
    
    setIsSending(true);
    const { patientId, linkId } = sendRequestInfo;

    try {
      const response = await fetch('/api/send-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId, linkId, method }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to send request via ${method}`);
      }

      toast.success(result.message || 'Request sent successfully!');
      setIsSendDialogOpen(false); // Close dialog on success
      setSendRequestInfo(null);
      mutate(); // Refresh the patient list to show potential status changes
    } catch (err) {
      console.error('Error sending request:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast.error(`Send failed: ${errorMessage}`);
      // Keep dialog open on error to allow retry?
    } finally {
      setIsSending(false);
    }
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    console.log("Confirming delete for patient ID:", patientToDelete);
    
    // Call the mutation
    const result = await deletePatient(patientToDelete);
    
    // Check for errors after the mutation completes
    if (deleteError || result === null) { 
      // Simplify error message extraction
      const errorMessage = 
        (deleteError as any)?.message || // Try accessing .message if deleteError exists
        (typeof deleteError === 'string' ? deleteError : null) || // Use if it's a string
        'Failed to delete patient. Check related records.'; // Default fallback
      toast.error(errorMessage);
    } else {
      toast.success('Patient deleted successfully.');
      // Refresh or update list logic
      if (patients?.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      // Assuming usePatients hook handles revalidation/update automatically
      // If not, trigger manual refetch here: mutate('/api/patients'); 
    }
    setPatientToDelete(null); // Clear the state regardless of outcome
  };

  if (isLoading) {
    return <div>Loading patients...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patients</h2>
        <Button onClick={() => router.push('/patients/new')}>
          Add New Patient
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            {/* Revert Table Headers */}
            <TableHead>Patient Name</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>DOI</TableHead>
            <TableHead>Provider(s)</TableHead>
            <TableHead>Type of Affidavit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Ensure no extra whitespace around conditional rendering */}
          {!patients || patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No patients found.
              </TableCell>
            </TableRow>
          ) : ( // Ensure map directly follows
            patients.map((patient: Patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.patientName}</TableCell>
                <TableCell>{formatDateSafe(patient.dateOfBirth)}</TableCell>
                <TableCell>{formatDateSafe(patient.dateOfInjury)}</TableCell>
                <TableCell>
                  {/* Display list of provider names */}
                  {patient.providers && patient.providers.length > 0 ? (
                    <div className="flex flex-col gap-2"> {/* Increased gap slightly */}
                      {patient.providers.map((provider) => (
                        <div key={provider.linkId} className="flex items-center justify-between border-b border-gray-100 py-1 last:border-b-0">
                          <div className="flex-1 truncate pr-2">
                             <span 
                                className="text-sm font-medium hover:underline cursor-pointer"
                                title={`View Provider Details: ${provider.name}`}
                                onClick={() => router.push(`/providers/${provider.providerId}`)}
                              >
                                {provider.name || 'N/A'}
                              </span>
                            <span className="text-xs text-gray-500 block">{formatRequestType(provider.requestType)}</span>
                          </div>
                          <div className="flex items-center space-x-0.5"> {/* Reduced space between buttons */} 
                            {/* Provider Link Actions */}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Affidavit (if generated)"
                              onClick={() => handleViewProviderLink(patient.id, provider.linkId)}
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Send Request (Fax/Email)"
                              onClick={() => handleSendProviderLink(patient.id, provider.linkId, provider.name)}
                            >
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit Link Details"
                              onClick={() => handleEditProviderLink(patient.id, provider.linkId)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete Provider Link"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProviderLink(patient.id, provider.linkId)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>{patient.affidavitTypes}</TableCell>
                <TableCell className="text-right space-x-1">
                  {/* Actions */}
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
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Patient: {patient.patientName}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the patient record,
                          associated provider links, and potentially related affidavits.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel> 
                        <AlertDialogAction 
                           onClick={confirmDelete} // Use confirmDelete for patient
                           disabled={isDeleting} // Use isDeleting state
                           className="bg-red-600 hover:bg-red-700">
                          {isDeleting ? 'Deleting...' : 'Confirm Delete Patient'} 
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
          {/* Ensure no extra whitespace before closing tag */}
        </TableBody>
      </Table>

      {/* --- Send Request Dialog --- */}
      <AlertDialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Request to {sendRequestInfo?.providerName || 'Provider'}</AlertDialogTitle>
            <AlertDialogDescription>
              Select the method to send the latest generated affidavit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:justify-center"> {/* Center buttons on small screens */} 
            <Button 
              onClick={() => confirmSendRequest('email')} 
              disabled={isSending} 
              variant="outline"
            >
              <Mail className="mr-2 h-4 w-4" /> {isSending ? 'Sending Email...' : 'Send via Email'}
            </Button>
            <Button 
              onClick={() => confirmSendRequest('fax')} 
              disabled={isSending}
              variant="outline"
            >
              <Printer className="mr-2 h-4 w-4" /> {isSending ? 'Sending Fax...' : 'Send via Fax'}
            </Button>
             <AlertDialogCancel onClick={() => setSendRequestInfo(null)} disabled={isSending}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
} 