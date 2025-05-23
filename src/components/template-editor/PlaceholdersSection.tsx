'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PlaceholdersSectionProps {
  onInsertPlaceholder: (placeholder: string) => void;
}

export default function PlaceholdersSection({ onInsertPlaceholder }: PlaceholdersSectionProps) {
  // Add state to track insertion
  const [isInserting, setIsInserting] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState<number>(0);

  // Track our click history to help debug
  useEffect(() => {
    if (clickCount > 0) {
      console.log(`PlaceholdersSection: Total buttons clicked: ${clickCount}`);
    }
  }, [clickCount]);

  // Improved handler with better isolation and more feedback
  const handleInsertPlaceholder = (key: string) => (e: React.MouseEvent) => {
    // Prevent default browser action and stop event propagation
    e.preventDefault();
    e.stopPropagation();
    
    console.log("PlaceholdersSection: Button clicked:", key);
    setClickCount(prev => prev + 1);
    
    // Prevent duplicate rapid clicks
    if (isInserting === key) {
      console.log("PlaceholdersSection: Ignoring duplicate click on:", key);
      return;
    }
    
    // Create the placeholder string
    const placeholder = `{{${key}}}`;
    console.log("PlaceholdersSection: Sending placeholder to parent:", placeholder);
    
    // Track that we're inserting this placeholder
    setIsInserting(key);
    
    // Show a toast to confirm the click was registered
    toast.info(`Inserting placeholder: ${key}`);
    
    try {
      // Use setTimeout to break out of React's event system
      setTimeout(() => {
        console.log("PlaceholdersSection: Executing placeholder insertion for:", key);
        onInsertPlaceholder(placeholder);
        
        // Clear the inserting state after a delay
        setTimeout(() => {
          setIsInserting(null);
        }, 500);
      }, 50);
    } catch (error) {
      console.error("PlaceholdersSection: Error inserting placeholder:", error);
      toast.error(`Error inserting placeholder: ${error}`);
      setIsInserting(null);
    }
  };

  // Common placeholder categories and their values
  const placeholders = {
    "Patient Information": [
      { key: "patientName", display: "Patient Name" },
      { key: "patientDOB", display: "Date of Birth" },
      { key: "patientDOI", display: "Date of Injury" },
      { key: "patient_address", display: "Patient Address" }
    ],
    "Provider Information": [
      { key: "providerName", display: "Provider Name" },
      { key: "providerAddress", display: "Provider Address" },
      { key: "provider_credentials", display: "Provider Credentials" }
    ],
    "Billing Records": [
      { key: "provider_fax_br", display: "Billing Fax" },
      { key: "provider_email_br", display: "Billing Email" },
      { key: "provider_mail_br", display: "Billing Mailing Address" },
      { key: "provider_smart_portal_br", display: "Billing Portal" }
    ],
    "Medical Records": [
      { key: "provider_fax_mr", display: "Medical Records Fax" },
      { key: "provider_email_mr", display: "Medical Records Email" },
      { key: "provider_mail_mr", display: "Medical Records Mailing Address" },
      { key: "provider_smart_portal_mr", display: "Medical Records Portal" }
    ],
    "Document Information": [
      { key: "document_id", display: "Document ID" },
      { key: "case_number", display: "Case Number" },
      { key: "currentDate", display: "Current Date" },
      { key: "dosRange", display: "Date of Service Range" }
    ],
    "Signatures": [
      { key: "signature_patient", display: "Patient Signature" },
      { key: "signature_provider", display: "Provider Signature" },
      { key: "signature_witness", display: "Witness Signature" }
    ]
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      <h3 className="text-lg font-semibold mb-3">Available Placeholders</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Click on a placeholder to insert it into your template.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(placeholders).map(([category, items]) => (
          <div key={category} className="border rounded p-3 bg-gray-50">
            <h4 className="font-medium mb-2 text-sm">{category}</h4>
            <div className="space-y-1">
              {items.map(item => (
                <Button
                  key={item.key} 
                  variant="ghost" 
                  size="sm"
                  type="button"
                  className={`w-full justify-start text-sm ${
                    isInserting === item.key 
                      ? "bg-blue-500 text-white font-bold animate-pulse" 
                      : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  }`}
                  onClick={handleInsertPlaceholder(item.key)}
                  onMouseDown={(e) => e.preventDefault()}
                  disabled={isInserting !== null}
                >
                  <span className="font-mono">{`{{${item.key}}}`}</span>
                  <span className="ml-2 text-gray-500">- {item.display}</span>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 