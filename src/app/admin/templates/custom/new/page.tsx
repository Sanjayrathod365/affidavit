'use client';

import React from 'react';
import TemplateEditor from '@/components/template-editor/TemplateEditor';
import Layout from '@/components/shared/Layout'; // Assuming a shared layout exists

export default function NewCustomTemplatePage() {
  return (
    <Layout>
      {/* We might want a wrapper or header here */}
      <div className="p-4">
         <h1 className="text-2xl font-bold mb-4">Create New Custom Affidavit Template</h1>
         {/* Render the editor directly */}
         {/* In the future, TemplateEditor might take props for initial state */}
         <TemplateEditor />
      </div>
    </Layout>
  );
} 