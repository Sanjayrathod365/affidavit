'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FabricTemplateEditor from './FabricTemplateEditor';
import TemplateEditor from './TemplateEditor';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { convertToFabricFormat, convertFromFabricFormat } from './editorUtils';

interface IntegratedEditorProps {
  templateId?: string;
  initialName?: string;
  initialElements?: any[];
}

export default function IntegratedEditor({
  templateId,
  initialName = '',
  initialElements = []
}: IntegratedEditorProps) {
  const [editorType, setEditorType] = useState<string>('fabric');
  const [templateName, setTemplateName] = useState<string>(initialName);
  const [fabricElements, setFabricElements] = useState<any[]>(initialElements || []);
  const [templateElements, setTemplateElements] = useState<any[]>(
    // Convert initial elements to template format if they exist
    initialElements && initialElements.length > 0
      ? convertFromFabricFormat(initialElements)
      : []
  );
  
  // Refs to access editor methods
  const fabricEditorRef = useRef<any>(null);
  const templateEditorRef = useRef<any>(null);
  
  const router = useRouter();

  // This function will be called when switching between editors
  const handleEditorSwitch = (value: string) => {
    if (value === editorType) return;
    
    // Add confirmation if there are unsaved changes
    const confirmSwitch = window.confirm(
      'Switching editors may cause some formatting changes. Continue?'
    );
    
    if (confirmSwitch) {
      // Convert data between formats when switching
      if (value === 'fabric' && templateElements.length > 0) {
        // Convert from template format to fabric format
        const converted = convertToFabricFormat(templateElements);
        setFabricElements(converted);
      } else if (value === 'template' && fabricElements.length > 0) {
        // Convert from fabric format to template format
        const converted = convertFromFabricFormat(fabricElements);
        setTemplateElements(converted);
      }
      
      setEditorType(value);
    }
  };

  // Method to get current elements from the active editor
  const getCurrentElements = () => {
    if (editorType === 'fabric') {
      // Get elements from fabric editor
      if (fabricEditorRef.current && fabricEditorRef.current.getCanvasElements) {
        return fabricEditorRef.current.getCanvasElements();
      }
      return fabricElements;
    } else {
      // Get elements from template editor
      if (templateEditorRef.current && templateEditorRef.current.getElements) {
        return templateEditorRef.current.getElements();
      }
      return templateElements;
    }
  };

  // Shared handler for template saving
  const handleSaveTemplate = async () => {
    try {
      const elements = getCurrentElements();
      const data = {
        name: templateName,
        elements: editorType === 'fabric' ? elements : convertToFabricFormat(elements),
        id: templateId
      };
      
      // Save template API call would go here
      console.log('Saving template:', data);
      
      toast.success('Template saved successfully');
      router.push('/templates');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  // Update template name from either editor
  const handleNameChange = (name: string) => {
    setTemplateName(name);
  };

  // Register fabric editor instance
  const registerFabricEditor = (editorInstance: any) => {
    fabricEditorRef.current = editorInstance;
  };

  // Register template editor instance
  const registerTemplateEditor = (editorInstance: any) => {
    templateEditorRef.current = editorInstance;
  };

  return (
    <div className="w-full">
      <Tabs value={editorType} onValueChange={handleEditorSwitch} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="fabric">Fabric Editor</TabsTrigger>
            <TabsTrigger value="template">Template Editor</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/templates')}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </div>
        </div>
        
        <TabsContent value="fabric" className="mt-0">
          <FabricTemplateEditor 
            templateId={templateId}
            initialName={templateName}
            initialElements={fabricElements}
            onNameChange={handleNameChange}
            ref={registerFabricEditor}
          />
        </TabsContent>
        
        <TabsContent value="template" className="mt-0">
          <TemplateEditor
            templateId={templateId}
            initialName={templateName}
            initialElements={templateElements}
            onNameChange={handleNameChange}
            ref={registerTemplateEditor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 