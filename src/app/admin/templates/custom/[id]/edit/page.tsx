'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TemplateEditor, { TemplateElement } from '@/components/template-editor/TemplateEditor';
import Layout from '@/components/shared/Layout'; // Assuming a shared layout exists
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

export default function EditCustomTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [isCloning, setIsCloning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialTemplateData, setInitialTemplateData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      console.log("Editing custom template with ID:", id);
      const fetchTemplate = async () => {
         setIsLoading(true);
         setError(null);
         try {
             const response = await fetch(`/api/custom-templates/${id}`);
             if (!response.ok) {
                 const errData = await response.json();
                 throw new Error(errData.error || `Failed to fetch template (${response.status})`);
             }
             const data = await response.json();
             setInitialTemplateData(data);
         } catch (err) {
             console.error("Error fetching template:", err);
             const errorMessage = err instanceof Error ? err.message : 'Unknown error';
             setError(errorMessage);
             toast.error(`Error loading template: ${errorMessage}`);
         } finally {
             setIsLoading(false);
         }
      };
      fetchTemplate();
    } else {
        setError("No template ID provided in URL.");
        toast.error("No template ID found.");
        setIsLoading(false);
    }
  }, [id]);

  const handleClone = async () => {
    if (!id) {
        toast.error("Cannot clone without a template ID.");
        return;
    }
    
    setIsCloning(true);
    try {
        const response = await fetch(`/api/custom-templates/${id}/clone`, {
            method: 'POST',
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Failed to clone template (${response.status})`);
        }
        
        toast.success("Template cloned successfully!");
        router.push(`/admin/templates/custom/${result.newTemplateId}/edit`);

    } catch (error) {
        console.error("Error cloning template:", error);
        toast.error(`Clone failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        setIsCloning(false);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Edit Custom Affidavit Template {id ? `(${id})` : ''}</h1>
          <Button 
              variant="outline" 
              onClick={handleClone} 
              disabled={isLoading || isCloning || !!error}
          >
            <Copy className="mr-2 h-4 w-4" />
            {isCloning ? 'Cloning...' : 'Clone Template'}
          </Button>
        </div>
        
        {isLoading && <div>Loading template data...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        
        {!isLoading && !error && initialTemplateData && (
            <TemplateEditor 
                templateId={id}
                initialName={initialTemplateData.name}
                initialElements={initialTemplateData.elements as TemplateElement[]}
            />
        )}
         {!isLoading && !error && !initialTemplateData && id && 
            <div className="text-orange-500">Template data could not be loaded or is empty. Cannot edit.</div>
         }
         {!id && <div className="text-red-500">Error: No Template ID specified in the URL.</div>}
      </div>
    </Layout>
  );
} 