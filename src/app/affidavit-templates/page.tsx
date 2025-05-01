'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { PlusCircle, FileEdit, Trash2, Eye } from 'lucide-react';

interface AffidavitTemplate {
  id: string;
  name: string;
  filePath: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(res => {
  if (!res.ok) {
    throw new Error(`Failed to fetch templates (Status: ${res.status})`);
  }
  return res.json();
});

export default function AffidavitTemplatesPage() {
  const router = useRouter();

  const { 
    data: templates = [],
    error,
    isLoading,
    mutate
  } = useSWR<AffidavitTemplate[]>('/api/affidavit-templates', fetcher);

  useEffect(() => {
    if (error) {
      console.error('Error fetching templates via SWR:', error);
      toast.error('Failed to load templates');
    }
  }, [error]);

  useEffect(() => {
    console.log('[AffidavitTemplatesPage] SWR data updated:', templates);
  }, [templates]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/affidavit-templates?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete template');
      }

      toast.success('Template deleted successfully');
      mutate();
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast.error(`Failed to delete template: ${error.message}`);
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`formatDate received invalid date string: ${dateString}`);
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affidavit Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage your affidavit templates for document generation
          </p>
        </div>
        <Button 
          onClick={() => router.push('/affidavit-templates/new')}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Templates</CardTitle>
          <CardDescription>
            All available affidavit templates in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">Loading templates...</div>
          ) : error ? (
            <div className="text-center py-6 text-destructive">
               Failed to load templates. Please try again later.
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No templates found</p>
              <Button 
                onClick={() => router.push('/affidavit-templates/new')}
                variant="outline"
              >
                Create your first template
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>v{template.version}</TableCell>
                    <TableCell>{formatDate(template.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/affidavit-templates/${template.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/affidavit-templates/${template.id}/edit`)}
                        >
                          <FileEdit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
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