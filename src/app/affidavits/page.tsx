'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, AlertCircle, Play, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/shared/Layout';
import { format } from 'date-fns'; // For date formatting
import { AffidavitStatus } from '@/types/affidavit'; // Import our custom enum
import { updateAffidavit, deleteAffidavit } from '@/hooks/useAffidavits'; // Import update and delete functions
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import SelectGroup, SelectLabel
import { useSWRConfig } from 'swr'; // Import SWRConfig for mutation
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

interface AffidavitListItem {
  id: string;
  patientName: string;
  providerName: string;
  templateName: string;
  status: AffidavitStatus; // Use Enum
  generatedFilePath: string | null;
  createdAt: string;
  patient?: { patientName: string };
  provider?: { name: string };
  template?: { name: string };
}

// Define the order of statuses for the dropdown
const STATUS_OPTIONS: AffidavitStatus[] = [
  AffidavitStatus.DRAFT,
  AffidavitStatus.GENERATED,
  AffidavitStatus.SENT,
  AffidavitStatus.RECEIVED,
  AffidavitStatus.ERROR,
];

// Add interface for fetched templates
interface BasicTemplateInfo {
  id: string;
  name: string;
}

interface SelectedTemplateState {
  [affidavitId: string]: { id: string; type: 'STANDARD' | 'CUSTOM' } | null;
}

export default function AffidavitsPage() {
  const [affidavits, setAffidavits] = useState<AffidavitListItem[]>([]);
  const [standardTemplates, setStandardTemplates] = useState<BasicTemplateInfo[]>([]);
  const [customTemplates, setCustomTemplates] = useState<BasicTemplateInfo[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<SelectedTemplateState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useSWRConfig();
  const [affidavitToDelete, setAffidavitToDelete] = useState<string | null>(null);

  const fetchAffidavits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the correct endpoint from useAffidavits hook
      const response = await fetch('/api/affidavit');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch affidavits');
      }
      const result = await response.json();
      if (result && result.data && Array.isArray(result.data)) {
        // Map status string from API to Enum if needed, though API should return enum string
        setAffidavits(result.data.map((aff: any) => ({...aff, status: aff.status as AffidavitStatus})));
        // Initialize selectedTemplates based on fetched affidavits
        const initialSelections: SelectedTemplateState = {};
        result.data.forEach((aff: any) => {
            if (aff.status === AffidavitStatus.DRAFT && aff.templateId) {
                // Default selection to the template already linked via Provider
                initialSelections[aff.id] = { id: aff.templateId, type: 'STANDARD' }; 
            }
        });
        setSelectedTemplates(initialSelections);
      } else {
        setAffidavits([]);
        console.warn('Affidavit data not in expected format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error(`Error fetching affidavits: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Standard and Custom Templates
  useEffect(() => {
    const fetchAllTemplates = async () => {
        setTemplatesLoading(true);
        try {
            const [stdRes, customRes] = await Promise.all([
                fetch('/api/affidavit-templates?active=true'), // Fetch only active standard templates
                fetch('/api/custom-templates') // Fetch custom templates
            ]);

            if (!stdRes.ok) console.error('Failed to fetch standard templates');
            if (!customRes.ok) console.error('Failed to fetch custom templates');

            const stdData = stdRes.ok ? (await stdRes.json()).data : [];
            const customData = customRes.ok ? await customRes.json() : []; // Custom endpoint returns array directly

            setStandardTemplates(stdData || []);
            setCustomTemplates(customData || []);

        } catch (err) {
            console.error("Error fetching templates:", err);
            toast.error('Failed to load available templates.');
        } finally {
            setTemplatesLoading(false);
        }
    };
    fetchAllTemplates();
  }, []);

  useEffect(() => {
    fetchAffidavits();
  }, [fetchAffidavits]);

  const getStatusBadgeVariant = (status: AffidavitStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) { // Use Enum directly
      case AffidavitStatus.DRAFT:
        return 'secondary';
      case AffidavitStatus.GENERATED:
      case AffidavitStatus.SENT:
        return 'default';
      case AffidavitStatus.ERROR:
        return 'destructive';
      case AffidavitStatus.RECEIVED:
        return 'outline'; // Or choose another variant for RECEIVED
      default:
        return 'outline';
    }
  };

  const handleStatusChange = async (affidavitId: string, newStatus: AffidavitStatus) => {
    const originalAffidavits = [...affidavits];
    // Optimistic UI update
    setAffidavits(prev => prev.map(aff => aff.id === affidavitId ? { ...aff, status: newStatus } : aff));

    try {
      toast.promise(
        updateAffidavit({ id: affidavitId, status: newStatus }),
        {
          loading: 'Updating status...',
          success: (apiResponse) => {
            // Invalidate cache to refetch
            mutate('/api/affidavit');
            // Access status from the nested data object
            const newStatus = apiResponse?.data?.status;
            return `Status updated to ${newStatus || 'Unknown'}`;
          },
          error: (err) => {
            // Revert optimistic update on error
            setAffidavits(originalAffidavits);
            return `Failed to update status: ${err.message}`;
          },
        }
      );
    } catch (error) {
      // This catch might not be strictly necessary due to toast.promise handling
      console.error("Error initiating status update:", error);
      setAffidavits(originalAffidavits); // Ensure revert on unexpected error
      toast.error("An unexpected error occurred while updating status.");
    }
  };

  // Handle template selection change for a specific affidavit row
  const handleTemplateSelect = (affidavitId: string, value: string) => {
    if (!value) { // Handle deselection if needed (e.g., show placeholder)
        setSelectedTemplates(prev => ({ ...prev, [affidavitId]: null }));
        return;
    }
    const [type, id] = value.split('::'); // e.g., "STANDARD::template_id" 
    if (type === 'STANDARD' || type === 'CUSTOM') {
        setSelectedTemplates(prev => ({ ...prev, [affidavitId]: { id, type } }));
    }
  };

  // Update handleGenerateClick to use selected template state
  const handleGenerateClick = async (affidavitId: string) => {
    // Get selected template for this affidavit
    const selectedTemplateInfo = selectedTemplates[affidavitId];

    if (!selectedTemplateInfo) {
        toast.error('Please select a template before generating.');
        return;
    }

    const { id: templateId, type: templateType } = selectedTemplateInfo;

    toast.loading(`Generating PDF for affidavit ${affidavitId}...`, { id: `generate-${affidavitId}` });
    try {
        // No need to fetch details just for templateId anymore
        // const detailRes = await fetch(`/api/affidavit?id=${affidavitId}`);
        // ...
        
        // Call the generation endpoint with selected template info
        const response = await fetch(`/api/affidavit/${affidavitId}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                templateId: templateId,      // Use selected ID
                templateType: templateType,  // Use selected Type
            }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `Failed to generate affidavit (HTTP ${response.status})`);
        }
        
        // Get the path from result.generatedFilePath
        const generatedFilePath = result.generatedFilePath; 
        if (!generatedFilePath) { // Check if the correct path exists
           throw new Error('Generation succeeded but no file path was returned in the response.'); // Updated error message
        }

        toast.success(`Affidavit generated successfully!`, { id: `generate-${affidavitId}` });

        // Update the specific affidavit in the list with the correct file path
        setAffidavits(prev =>
          prev.map(aff =>
            aff.id === affidavitId
              ? { ...aff, status: AffidavitStatus.GENERATED, generatedFilePath: generatedFilePath } // Use generatedFilePath here
              : aff
          )
        );

        // Optionally trigger a full revalidation if needed
        mutate('/api/affidavit');

    } catch (err) {
      console.error("Error generating affidavit:", err);
      toast.error(`Generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`, { id: `generate-${affidavitId}` });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!affidavitToDelete) return;

    const idToDelete = affidavitToDelete;
    setAffidavitToDelete(null); // Close dialog

    // Optimistic UI update (optional but improves UX)
    const originalAffidavits = [...affidavits];
    setAffidavits(prev => prev.filter(aff => aff.id !== idToDelete));

    try {
      toast.promise(
        deleteAffidavit(idToDelete),
        {
          loading: 'Deleting affidavit...',
          success: () => {
            // No need to update state here, mutate will refetch
            mutate('/api/affidavit');
            return `Affidavit deleted successfully`;
          },
          error: (err) => {
            // Revert optimistic update on error
            setAffidavits(originalAffidavits);
            return `Failed to delete affidavit: ${err.message}`;
          },
        }
      );
    } catch (error) {
      console.error("Error initiating affidavit deletion:", error);
      setAffidavits(originalAffidavits); // Ensure revert on unexpected error
      toast.error("An unexpected error occurred while deleting the affidavit.");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          Loading affidavits...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6 bg-red-100 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" /> Error fetching affidavits: {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Generated Affidavits</h1>
          <Link href="/affidavits/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Affidavit
            </Button>
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Generated On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affidavits && affidavits.length > 0 ? (
                affidavits.map((affidavit) => (
                  <TableRow key={affidavit.id}>
                    <TableCell className="font-medium">
                      {affidavit.patient?.patientName || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {affidavit.provider?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {affidavit.template?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {/* Status Update Dropdown */}
                      <Select
                        value={affidavit.status}
                        onValueChange={(newStatus: AffidavitStatus) => {
                          handleStatusChange(affidavit.id, newStatus);
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <Badge variant={getStatusBadgeVariant(affidavit.status)} className="mr-2">
                            {affidavit.status || 'UNKNOWN'}
                          </Badge>
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((statusOption) => (
                            <SelectItem key={statusOption} value={statusOption}>
                              {statusOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {format(new Date(affidavit.createdAt), 'PPp')} {/* Format date */}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {affidavit.generatedFilePath ? (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild // Use asChild to make Button act like Link
                          >
                            <Link href={affidavit.generatedFilePath} target="_blank" download>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            <FileText className="h-4 w-4 mr-2" />
                            No File
                          </Button>
                        )}

                        {/* Template Select Dropdown (Show for DRAFT status) */} 
                        {affidavit.status === AffidavitStatus.DRAFT && (
                             <Select 
                                value={selectedTemplates[affidavit.id] ? `${selectedTemplates[affidavit.id]?.type}::${selectedTemplates[affidavit.id]?.id}` : ''}
                                onValueChange={(value) => handleTemplateSelect(affidavit.id, value)}
                                disabled={templatesLoading} // Disable while templates load
                             >
                                <SelectTrigger className="w-[200px]"> {/* Adjust width */}
                                    <SelectValue placeholder="Select Template..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {templatesLoading ? (
                                        <SelectItem value="loading" disabled>Loading templates...</SelectItem>
                                    ) : (
                                        <>
                                            <SelectGroup>
                                                <SelectLabel>Standard Templates</SelectLabel>
                                                {standardTemplates.length > 0 ? (
                                                    standardTemplates.map(t => (
                                                        <SelectItem key={`std-${t.id}`} value={`STANDARD::${t.id}`}>{t.name}</SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-std" disabled>No standard templates</SelectItem>
                                                )}
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Custom Templates</SelectLabel>
                                                 {customTemplates.length > 0 ? (
                                                    customTemplates.map(t => (
                                                        <SelectItem key={`custom-${t.id}`} value={`CUSTOM::${t.id}`}>{t.name}</SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-custom" disabled>No custom templates</SelectItem>
                                                )}
                                            </SelectGroup>
                                        </>
                                    )}
                                </SelectContent>
                             </Select>
                        )}

                        {/* Generate Button (conditionally shown) */} 
                        {affidavit.status === AffidavitStatus.DRAFT && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleGenerateClick(affidavit.id)}
                            disabled={!selectedTemplates[affidavit.id]} // Disable if no template selected
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Generate
                          </Button>
                        )}

                        {/* Delete Button with Confirmation */}
                        <AlertDialog onOpenChange={(open) => !open && setAffidavitToDelete(null)}> {/* Reset target on close */}
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setAffidavitToDelete(affidavit.id)} // Set target on click
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          {/* Dialog Content - Renders only when triggered */}
                          {affidavitToDelete === affidavit.id && (
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the affidavit
                                  record for patient {affidavit.patient?.patientName || 'N/A'} from provider {affidavit.provider?.name || 'N/A'}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          )}
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No affidavits generated yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Optional: Add Pagination if implemented in API */}
      </div>
    </Layout>
  );
} 