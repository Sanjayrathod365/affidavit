'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, FileEdit, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AffidavitTemplate {
  id: string;
  name: string;
  filePath: string;
  bodyContent?: string;
  structure: {
    placeholders: Array<{
      id: string;
      name: string;
      description?: string;
      type: string;
      defaultValue?: string;
      required: boolean;
    }>;
    documentSettings?: {
      pageSize?: string;
      orientation?: string;
    };
    header?: {
      text?: string;
    };
    footer?: {
      text?: string;
    };
  };
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface TemplateViewPageProps {
  params: {
    id: string;
  };
}

export default function TemplateViewPage({ params }: TemplateViewPageProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<AffidavitTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/affidavit-templates/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Template not found');
          }
          throw new Error('Failed to fetch template');
        }
        
        const data = await response.json();
        
        if (!data || typeof data !== 'object' || !data.id) {
           console.error('Received invalid data format from API:', data);
           throw new Error('Invalid template data received');
        }
        
        setTemplate(data);
      } catch (err) {
        console.error('Error fetching template:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [params.id]);

  const handleDelete = async () => {
    if (!template) return;
    
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/affidavit-templates?id=${template.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      toast.success('Template deleted successfully');
      router.push('/affidavit-templates');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="text-center py-12">
          <p>Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="container py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p>{error || 'Template not found'}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/affidavit-templates')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/affidavit-templates')}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{template.name}</h1>
          <p className="text-muted-foreground mt-1">
            Version {template.version} • Last updated {formatDate(template.updatedAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Basic information about this template</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                  <dd className="text-base">{template.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Version</dt>
                  <dd className="text-base">{template.version}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd className="text-base">{formatDate(template.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                  <dd className="text-base">{formatDate(template.updatedAt)}</dd>
                </div>
                {template.filePath && (
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">Base Template</dt>
                    <dd className="text-base flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      {template.filePath.split('/').pop()}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Placeholders</CardTitle>
              <CardDescription>Fields that will be replaced in the document</CardDescription>
            </CardHeader>
            <CardContent>
              {template.structure.placeholders.length === 0 ? (
                <p className="text-muted-foreground">No placeholders defined</p>
              ) : (
                <div className="space-y-4">
                  {template.structure.placeholders.map((placeholder) => (
                    <div key={placeholder.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{placeholder.name}</h3>
                          {placeholder.description && (
                            <p className="text-sm text-muted-foreground">{placeholder.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {placeholder.type}
                          </span>
                          {placeholder.required && (
                            <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                      {placeholder.defaultValue && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Default: </span>
                          {placeholder.defaultValue}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {(template.structure.header?.text || template.structure.footer?.text) && (
            <Card>
              <CardHeader>
                <CardTitle>Document Layout</CardTitle>
                <CardDescription>Header and footer content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {template.structure.header?.text && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Header</h3>
                      <p className="p-3 border rounded-md mt-1">{template.structure.header.text}</p>
                    </div>
                  )}
                  {template.structure.footer?.text && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Footer</h3>
                      <p className="p-3 border rounded-md mt-1">{template.structure.footer.text}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Manage this template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push(`/affidavit-templates/${template.id}/edit`)}
              >
                <FileEdit className="mr-2 h-4 w-4" />
                Edit Template
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Template
              </Button>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button 
                className="w-full"
                onClick={() => router.push(`/affidavits/new?templateId=${template.id}`)}
              >
                Generate Affidavit
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 