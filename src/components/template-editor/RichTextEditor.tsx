'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { customStyles, DeltaType } from './types';

// Dynamically import ReactQuill and forward the ref
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }: { forwardedRef: React.Ref<any>, [key: string]: any }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);

interface RichTextEditorProps {
  bodyContent: string;
  onBodyContentChange: (content: string) => void;
  insertPlaceholder: (placeholder: string) => void;
}

export function RichTextEditor({
  bodyContent,
  onBodyContentChange,
  insertPlaceholder,
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const placeholderToolbarRef = useRef<HTMLDivElement | null>(null);

  // Function to register the placeholder blot
  const registerPlaceholderBlot = useCallback(() => {
    if (!quillRef.current?.getEditor()) return;
    
    const Quill = quillRef.current.getEditor().constructor;
    
    try {
      const Inline = Quill.import('blots/inline');
      
      class PlaceholderBlot extends Inline {
        static create(value: string) {
          const node = super.create();
          node.setAttribute('data-placeholder', value);
          node.innerText = value;
          return node;
        }
        
        static formats(node: HTMLElement) {
          return node.getAttribute('data-placeholder');
        }
      }
      
      PlaceholderBlot.blotName = 'placeholder';
      PlaceholderBlot.tagName = 'span';
      PlaceholderBlot.className = 'affidavit-placeholder';
      
      Quill.register(PlaceholderBlot);
    } catch (error) {
      console.warn('Could not register custom placeholder blot', error);
    }
  }, []);

  // Function to initialize Quill with custom formats for placeholders
  const initQuill = useCallback(() => {
    if (!quillRef.current?.getEditor()) return;
    
    const quill = quillRef.current.getEditor();
    
    // Register placeholder format matcher
    const placeholderRegex = /\{\{[a-z_]+\}\}/g;
    
    quill.clipboard.addMatcher(Node.TEXT_NODE, (node: Text, delta: DeltaType) => {
      if (typeof node.data !== 'string') return delta;
      
      let newDelta = delta;
      const matches = node.data.match(placeholderRegex);
      
      if (matches) {
        let lastIndex = 0;
        matches.forEach((match: string) => {
          const index = node.data.indexOf(match, lastIndex);
          if (index !== -1) {
            // Add text before the placeholder
            const Delta = quill.constructor.import('delta');
            
            // Add text before the placeholder
            newDelta = newDelta.compose(
              new Delta().retain(index - lastIndex).insert(node.data.slice(lastIndex, index))
            );
            
            // Add the placeholder with formatting
            newDelta = newDelta.compose(
              new Delta().insert(match, {
                'placeholder': match,
                'background': '#e8f0fe',
                'color': '#1a73e8',
                'bold': true,
              })
            );
            
            lastIndex = index + match.length;
          }
        });
        
        // Add any remaining text
        if (lastIndex < node.data.length) {
          const Delta = quill.constructor.import('delta');
          newDelta = newDelta.compose(
            new Delta().insert(node.data.slice(lastIndex))
          );
        }
        
        return newDelta;
      }
      
      return delta;
    });
  }, []);

  // Initialize Quill on component mount
  useEffect(() => {
    if (quillRef.current?.getEditor()) {
      registerPlaceholderBlot();
      initQuill();
      
      // Create a single shared placeholder dropdown for both buttons
      const placeholderDropdown = document.createElement('div');
      placeholderDropdown.className = 'placeholder-dropdown-content hidden bg-white shadow-lg rounded-md border p-2 w-64 max-h-96 overflow-y-auto';
      placeholderDropdown.style.position = 'absolute';
      placeholderDropdown.style.zIndex = '1000';
      document.body.appendChild(placeholderDropdown);
      
      // Add placeholder button to toolbar
      const toolbar = document.querySelector('.ql-toolbar');
      if (toolbar) {
        const placeholderButton = document.createElement('button');
        placeholderButton.className = 'ql-placeholder';
        placeholderButton.innerHTML = '{ }';
        placeholderButton.title = 'Insert Placeholder';
        
        // Insert before the clean button
        const cleanButton = toolbar.querySelector('.ql-clean');
        if (cleanButton && cleanButton.parentNode) {
          cleanButton.parentNode.insertBefore(placeholderButton, cleanButton);
        } else {
          toolbar.appendChild(placeholderButton);
        }
        
        // Attach click handler to the placeholder button
        placeholderButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Toggle dropdown visibility
          if (placeholderDropdown.classList.contains('hidden')) {
            // Position dropdown under the button
            const rect = placeholderButton.getBoundingClientRect();
            placeholderDropdown.style.top = `${rect.bottom}px`;
            placeholderDropdown.style.left = `${rect.left}px`;
            placeholderDropdown.classList.remove('hidden');
          } else {
            placeholderDropdown.classList.add('hidden');
          }
        });
      }
    }
    
    // Add an event listener to close the dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector('.placeholder-dropdown-content');
      const button = document.querySelector('.ql-placeholder');
      
      if (dropdown && 
          !dropdown.contains(event.target as Node) && 
          button && 
          !button.contains(event.target as Node)) {
        dropdown.classList.add('hidden');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clean up the dropdown element on unmount
      const dropdown = document.querySelector('.placeholder-dropdown-content');
      if (dropdown && dropdown.parentNode) {
        dropdown.parentNode.removeChild(dropdown);
      }
    };
  }, [registerPlaceholderBlot, initQuill]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Content</CardTitle>
      </CardHeader>
      <CardContent>
        <style>{customStyles}</style>
        <div className="min-h-[300px]">
          <ReactQuill
            forwardedRef={quillRef}
            value={bodyContent}
            onChange={onBodyContentChange}
            modules={modules}
            theme="snow"
            placeholder="Begin typing your template content here..."
            className="h-80"
          />
        </div>
      </CardContent>
    </Card>
  );
} 