'use client';

import React, { useEffect, useState } from 'react';
import { TemplateElement } from './TemplateEditor'; // Assuming types are exported from here

// Sample data with all possible keys
const sampleData = {
    // Patient Information
    patientName: 'John Doe',
    patient_name: 'John Doe',
    patientDOB: '1985-03-15',
    patient_dob: '1985-03-15',
    patientDOI: '2024-07-20',
    patient_doi: '2024-07-20',
    patient_address: '123 Patient St, Patientville, CA 90210',
    patient_phone: '(555) 123-4567',
    patient_email: 'john.doe@example.com',
    patient_ssn: 'XXX-XX-1234',
    patient_id: 'PT-12345',
    patient_mrn: 'MRN-98765',
    
    // Provider Information
    providerName: 'Dr. Jane Smith',
    provider_name: 'Dr. Jane Smith',
    providerAddress: '456 Medical Center Blvd, Suite 789',
    provider_address: '456 Medical Center Blvd, Suite 789',
    provider_credentials: 'MD, PhD, FACP',
    provider_npi: '1234567890',
    provider_tax_id: '12-3456789',
    
    // Billing Records
    provider_fax_br: '(555) 987-6543',
    provider_email_br: 'billing@practice.com',
    provider_mail_br: 'PO Box 12345, Billing City, ST 12345',
    provider_smart_portal_br: 'https://billing.practice.com',
    
    // Medical Records
    provider_fax_mr: '(555) 789-0123',
    provider_email_mr: 'records@practice.com',
    provider_mail_mr: '456 Medical Drive, Records Dept, Medical City, ST 54321',
    provider_smart_portal_mr: 'https://records.practice.com',
    
    // Document Information
    current_date: new Date().toLocaleDateString(),
    document_id: 'DOC-20240712-001',
    case_number: 'CASE-2024-12345',
    dosRange: '01/01/2024 - 06/30/2024',
    dos_range: '01/01/2024 - 06/30/2024',
    
    // Other Common Fields
    signature_patient: '[Patient Signature]',
    signature_provider: '[Provider Signature]',
    signature_witness: '[Witness Signature]',
    
    // Test placeholder
    test_placeholder: 'TEST PLACEHOLDER VALUE',
};

interface TemplatePreviewProps {
    elements: TemplateElement[];
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ elements }) => {
    const [isClient, setIsClient] = useState(false);
    const [renderedElements, setRenderedElements] = useState<TemplateElement[]>([]);
    const [timestamp, setTimestamp] = useState(Date.now());
    
    // First useEffect to mark as client-side rendered - runs once
    useEffect(() => {
        setIsClient(true);
        console.log("TemplatePreview: Client-side rendering initialized");
    }, []);
    
    // Second useEffect to update the rendered elements when props change
    useEffect(() => {
        if (isClient) {
            console.log("TemplatePreview: Updating rendered elements, count:", elements.length);
            console.log("TemplatePreview: Elements data:", elements);
            setRenderedElements([...elements]);
            setTimestamp(Date.now());
        }
    }, [elements, isClient]);
    
    // Helper function to get a placeholder value from sampleData
    const getPlaceholderValue = (key: string) => {
        try {
            // Extract the key without {{ }}
            const cleanKey = key.replace(/{{|}}/g, '').trim();
            return sampleData[cleanKey as keyof typeof sampleData] || `[${cleanKey}]`;
        } catch (error) {
            console.error("Error getting placeholder value:", error);
            return "[Error]";
        }
    };

    // Render a debug overlay
    const renderDebugOverlay = () => {
        return (
            <div className="absolute top-2 left-2 p-2 bg-blue-100 text-xs rounded shadow-sm z-[9999]">
                <div>Preview Timestamp: {new Date(timestamp).toLocaleTimeString()}</div>
                <div>Element Count: {renderedElements.length}</div>
                <div>Rendering Client-side: {isClient ? 'Yes' : 'No'}</div>
            </div>
        );
    };

    // Only render if we're on the client
    if (!isClient) {
        return (
            <div className="bg-white p-8 shadow-md min-h-[11in] w-[8.5in] relative">
                <div className="text-center text-gray-400 mt-40">
                    <p>Loading preview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 shadow-md min-h-[11in] w-[8.5in] relative" key={`preview-container-${timestamp}`}>
            {renderDebugOverlay()}
            
            {/* Grid background to help visualize positions */}
            <div className="absolute inset-0 w-full h-full" style={{ 
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                pointerEvents: 'none'
            }}></div>
            
            {/* Preview Page */}
            {renderedElements.length === 0 ? (
                <div className="text-center text-gray-400 mt-40">
                    <p>No elements added yet. Add elements from the sidebar or insert placeholders.</p>
                </div>
            ) : (
                <>
                    {/* Render elements */}
                    {renderedElements.map((element, index) => {
                        try {
                            // Common style properties
                            const elementStyle: React.CSSProperties = {
                    position: 'absolute',
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                                height: element.type !== 'text' && element.type !== 'data' ? `${element.height}px` : 'auto',
                                fontSize: element.fontSize ? `${element.fontSize}px` : '12px',
                                fontWeight: element.fontWeight || 'normal',
                                fontStyle: element.fontStyle || 'normal',
                                textAlign: (element.textAlign as any) || 'left',
                                color: element.color || '#000',
                                backgroundColor: element.backgroundColor || 'transparent',
                                padding: element.padding ? `${element.padding}px` : '0',
                                border: element.borderStyle !== 'none' && element.borderWidth
                                    ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || '#000'}`
                                    : 'none',
                                zIndex: element.zIndex || 0,
                                wordBreak: 'break-word',
                    overflow: 'hidden', 
                                boxShadow: '0 0 2px rgba(0,0,0,0.2)', // Add shadow to make elements more visible
                            };

                            const elementId = `preview-element-${element.id}`;
                            console.log(`TemplatePreview: Rendering element ${index+1}/${renderedElements.length} with ID ${element.id}, type ${element.type}`);

                            // Add a small index label to show rendering order
                            const indexLabel = (
                                <div className="absolute right-1 top-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-[9999]">
                                    {index + 1}
                                </div>
                            );

                            switch (element.type) {
                                case 'text':
                    return (
                                        <div
                                            key={elementId}
                                            id={elementId}
                                            style={elementStyle}
                                            className="whitespace-pre-wrap preview-element preview-text"
                                        >
                                            {indexLabel}
                            {element.content}
                        </div>
                    );

                                case 'image':
                    return (
                                        <div 
                                            key={elementId}
                                            id={elementId}
                                            style={elementStyle}
                                            className="preview-element preview-image"
                                        >
                                            {indexLabel}
                                            {element.imageUrl ? (
                            <img
                                src={element.imageUrl}
                                                    alt="Template image" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                            />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                                                    Image Placeholder
                                                </div>
                                            )}
                        </div>
                    );

                                case 'data':
                                    // Get placeholder value from sample data
                                    let displayContent = element.content;
                                    
                                    // If content looks like a placeholder, replace it with sample data
                                    if (element.content.includes('{{') && element.content.includes('}}')) {
                                        displayContent = getPlaceholderValue(element.content);
                                    }
                                    // If content is just the key, format it as a placeholder
                                    else if (element.dataFieldKey) {
                                        displayContent = getPlaceholderValue(`{{${element.dataFieldKey}}}`);
                                    }

                                    return (
                                        <div
                                            key={elementId}
                                            id={elementId}
                                            style={{
                                                ...elementStyle,
                                                backgroundColor: elementStyle.backgroundColor || '#e8f0fe',
                                                color: elementStyle.color || '#1a73e8',
                                                borderRadius: '4px',
                                            }}
                                            className="preview-element preview-data"
                                        >
                                            {indexLabel}
                                            {displayContent}
                                        </div>
                                    );

                                case 'line':
                                    return (
                                        <div
                                            key={elementId}
                                            id={elementId}
                                            style={{
                                                ...elementStyle,
                                                height: `${element.height}px`,
                                                backgroundColor: element.color || '#000',
                                            }}
                                            className="preview-element preview-line"
                                        >
                                            {indexLabel}
                                        </div>
                                    );

                                default:
                                    console.warn("Unknown element type:", element.type);
                    return (
                                        <div 
                                            key={elementId}
                                            id={elementId}
                                            style={elementStyle}
                                            className="preview-element preview-unknown"
                                        >
                                            {indexLabel}
                                            Unknown Element Type: {element.type}
                        </div>
                    );
                }
                        } catch (error) {
                            console.error("Error rendering element:", element, error);
                    return (
                                <div 
                                    key={`error-${element.id}`}
                                    style={{
                                        position: 'absolute',
                                        left: `${element.x || 0}px`,
                                        top: `${element.y || 0}px`,
                                        padding: '5px',
                                        backgroundColor: '#ffdddd',
                                        color: 'red',
                                        border: '1px solid red'
                                    }}
                                    className="preview-element preview-error"
                                >
                                    Error rendering element
                                </div>
                    );
                }
                    })}
                </>
            )}
        </div>
    );
};

export default TemplatePreview; 