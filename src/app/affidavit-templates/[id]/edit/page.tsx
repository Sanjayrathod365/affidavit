import React from 'react';
import TemplateEditorClient from './TemplateEditorClient';
import { headers } from 'next/headers';

interface AffidavitTemplateEditPageProps {
  params: {
    id: string
  }
}

async function getTemplate(id: string) {
  // Get the host from headers to build absolute URL
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3001';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const apiUrl = `${protocol}://${host}/api/affidavit-templates/${id}`;
  console.log(`Fetching template from: ${apiUrl}`);
  
  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store',
    });
          
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch template: Status ${res.status}`, errorText);
      throw new Error(`Failed to fetch template: Status ${res.status}`);
    }

    const data = await res.json();
    console.log(`Template fetched successfully: ${data.name}`);
    return data;
    } catch (error) {
    console.error("Error fetching template:", error);
    // Provide a fallback template for development
    if (process.env.NODE_ENV === 'development') {
      console.log("Using fallback template for development");
      return {
        id,
        name: "Fallback Template",
        elements: [],
        description: "Fallback template used due to API error",
        version: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    throw error;
  }
}

export default async function AffidavitTemplateEditPage({ params }: AffidavitTemplateEditPageProps) {
  // Skip authentication for now
  const template = await getTemplate(params.id);
  
  // Convert template data for the editor
  const templateData = {
    id: template.id,
    name: template.name,
    elements: template.elements || [],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Template: {template.name}</h1>
      <TemplateEditorClient
        templateId={params.id}
        initialName={templateData.name}
        initialElements={templateData.elements}
      />
        </div>
  );
} 