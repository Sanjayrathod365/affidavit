import React from 'react';
import DiagnosticTest from '@/components/template-editor/DiagnosticTest';
import IntegratedEditor from '@/components/template-editor/IntegratedEditor';

export default function TemplateEditorPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Affidavit Template Editor</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Fabric.js Integration Diagnostic</h2>
        <p className="mb-4 text-gray-600">
          Run the tests below to verify fabric.js functionality.
        </p>
        
        <DiagnosticTest />
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Template Editor</h2>
        <p className="mb-4 text-gray-600">
          Create and edit affidavit templates with the visual editor.
        </p>
        
        <IntegratedEditor />
      </div>
    </div>
  );
} 