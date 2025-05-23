'use client';

import React, { useEffect, useState } from 'react';
import FabricTemplateEditor from '@/components/template-editor/FabricTemplateEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

interface TemplateEditorClientProps {
  templateId: string;
  initialName: string;
  initialElements: any[];
}

export default function TemplateEditorClient({ 
  templateId, 
  initialName, 
  initialElements 
}: TemplateEditorClientProps) {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(true);
  
  return (
    <div>
      {showNotification && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 flex justify-between items-center text-blue-800">
          <span>The template editor is currently being updated. Some features may be limited.</span>
          <button 
            onClick={() => setShowNotification(false)}
            className="bg-transparent border-none text-blue-600 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()}
          className="mr-3"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Template: {initialName}</h1>
      </div>
      
      <FabricTemplateEditor
        templateId={templateId}
        initialName={initialName || ''}
        initialElements={initialElements || []}
      />
    </div>
  );
} 