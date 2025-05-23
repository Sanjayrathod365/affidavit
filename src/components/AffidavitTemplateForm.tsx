'use client';

import React from 'react';
import { AffidavitTemplateForm as RefactoredAffidavitTemplateForm } from './template-editor/AffidavitTemplateForm';

// Re-export the refactored component to maintain compatibility with existing code
export function AffidavitTemplateForm(props: any) {
  // Adjust prop names if needed
  const adjustedProps = {...props};
  
  // If old prop name is used, map it to the new name
  if (adjustedProps.insertPlaceholder && !adjustedProps.onInsertPlaceholder) {
    adjustedProps.onInsertPlaceholder = adjustedProps.insertPlaceholder;
    delete adjustedProps.insertPlaceholder;
  }
  
  return <RefactoredAffidavitTemplateForm {...adjustedProps} />;
}