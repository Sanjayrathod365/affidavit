'use client';

import React from 'react';
import { AffidavitTemplateForm as RefactoredAffidavitTemplateForm } from './template-editor/AffidavitTemplateForm';

// Re-export the refactored component to maintain compatibility with existing code
export function AffidavitTemplateForm(props: any) {
  return <RefactoredAffidavitTemplateForm {...props} />;
}