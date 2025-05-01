/**
 * Utility functions for Affidavit Template components
 */

// Enhanced insertPlaceholder function to use the custom blot and prevent duplicates
export const insertPlaceholderInQuill = (quill: any, placeholder: string) => {
  if (!quill) return;
  
  // Add a small flag to prevent double insertion
  if ((window as any).__isInsertingPlaceholder) return;
  (window as any).__isInsertingPlaceholder = true;
  
  setTimeout(() => {
    (window as any).__isInsertingPlaceholder = false;
  }, 100);
  
  const range = quill.getSelection(true);
  
  // Use the custom placeholder blot if available
  try {
    quill.insertText(range.index, placeholder, {
      'placeholder': placeholder,
      'background': '#e8f0fe',
      'color': '#1a73e8',
      'bold': true,
    });
  } catch (error) {
    // Fallback if custom blot fails
    quill.insertText(range.index, placeholder, {
      'background': '#e8f0fe',
      'color': '#1a73e8',
      'bold': true,
    });
  }
  
  quill.setSelection(range.index + placeholder.length, 0, 'user');
  quill.focus();
}; 