'use client';

import React from 'react';
import { TemplateElement } from './TemplateEditor'; // Assuming types are exported from here

// Sample Data Structure (adjust keys as needed based on your actual data)
const sampleData = {
    patientName: 'John Doe',
    providerName: 'Dr. Jane Smith',
    patientDOB: '1985-03-15',
    patientDOI: '2024-07-20',
    providerAddress: '123 Health St, Medville, CA 90210',
    currentDate: new Date().toLocaleDateString(),
    dosRange: '2024-01-01 - 2024-06-30',
    // Add more sample data matching your dataFieldKeys
};

// Helper function to get value from sample data, handling potential missing keys
const getSampleValue = (key: string | undefined, format?: string): string => {
    if (!key) return '[No Key]';
    let value = (sampleData as any)[key];

    if (value === undefined || value === null) return `[${key}?]`;

    // Attempt basic formatting based on format string
    if (format) {
        const [formatType, formatSpecifier] = format.split(':');
        try {
            if (formatType === 'date') {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    // VERY basic date formatting - replace with library later!
                    if (formatSpecifier === 'MM/DD/YYYY') {
                        value = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                    } else if (formatSpecifier === 'YYYY-MM-DD') {
                        value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                    } else {
                        value = date.toLocaleDateString(); // Default locale format
                    }
                } else {
                    value = `[Invalid Date: ${key}]`;
                }
            } else if (formatType === 'currency') {
                const amount = parseFloat(value);
                if (!isNaN(amount)) {
                    value = `$${amount.toFixed(2)}`; // Basic USD currency
                } else {
                     value = `[Invalid Number: ${key}]`;
                }
            } else if (formatType === 'number') {
                const num = parseFloat(value);
                const decimalPlaces = parseInt(formatSpecifier, 10) || 0;
                 if (!isNaN(num)) {
                    value = num.toFixed(decimalPlaces);
                 } else {
                     value = `[Invalid Number: ${key}]`;
                 }
            }
            // Add more format types as needed
        } catch (error) {
             console.warn(`Error applying format '${format}' to key '${key}':`, error);
             // Return original value on formatting error
        }
    }

    // Return original value if no format or error, convert objects/arrays to string
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
};

interface TemplatePreviewProps {
    elements: TemplateElement[];
    width?: number; // Optional fixed width (e.g., A4 size)
    height?: number; // Optional fixed height
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
    elements,
    width = 595, // Approx A4 width in points (adjust as needed)
    height = 842 // Approx A4 height in points
}) => {

    // Sort elements by zIndex for correct layering in preview
    const sortedElements = [...elements].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

    return (
        <div 
            style={{
                width: `${width}px`,
                height: `${height}px`,
                border: '1px solid #ddd',
                position: 'relative',
                overflow: 'hidden', // Hide overflow if elements go outside bounds
                margin: '20px auto', // Center the preview area
                backgroundColor: 'white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)' // Add a subtle shadow
            }}
        >
            {sortedElements.map((element) => { // Use sortedElements
                const style: React.CSSProperties = {
                    position: 'absolute',
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    fontSize: `${element.fontSize ?? 12}px`,
                    fontWeight: element.fontWeight ?? 'normal',
                    fontStyle: element.fontStyle ?? 'normal',
                    textAlign: element.textAlign ?? 'left',
                    color: element.color ?? '#000000',
                    backgroundColor: element.backgroundColor ?? 'transparent',
                    border: `${element.borderWidth ?? 0}px ${element.borderStyle ?? 'none'} ${element.borderColor ?? 'transparent'}`,
                    padding: `${element.padding ?? 0}px`,
                    zIndex: element.zIndex ?? 0, // Apply z-index here too
                    // Prevent user interaction in preview
                    pointerEvents: 'none',
                    // Basic word wrapping for text
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    // Ensure images fit within bounds
                    objectFit: 'contain', 
                    // Ensure content respects padding and box model
                    boxSizing: 'border-box',
                    // Overflow hidden for individual elements too
                    overflow: 'hidden', 
                    // Use display flex for inner alignment (optional, adjust content rendering if needed)
                    display: 'flex',
                    alignItems: 'center', // Example alignment
                    justifyContent: element.textAlign ?? 'left', // Use text align for justify
                };

                // Render content differently based on type, respecting styles
                if (element.type === 'text') {
                    // For text, apply alignment etc., directly
                    return (
                        <div key={element.id} style={style}>
                            {element.content}
                        </div>
                    );
                }

                if (element.type === 'image' && element.imageUrl) {
                    // For image, container style handles position/border/bg, img style handles object-fit
                    const imgStyle: React.CSSProperties = {
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain', // Or cover
                        display: 'block'
                    };
                    return (
                        <div key={element.id} style={style}> 
                            <img
                                src={element.imageUrl}
                                alt={element.content || 'Image Element'}
                                style={imgStyle}
                                onError={(e) => (e.currentTarget.style.border = '1px dashed red')}
                            />
                        </div>
                    );
                }

                if (element.type === 'data') {
                    return (
                        <div key={element.id} style={style}>
                            {getSampleValue(element.dataFieldKey, element.dataFormat)}
                        </div>
                    );
                }

                // Render Line for Preview
                if (element.type === 'line') {
                    // Apply line color as background to the div
                    const lineStyle = { 
                        ...style, 
                        backgroundColor: element.color ?? '#000000',
                        // Override potentially conflicting styles from the main `style` object for lines:
                        color: 'transparent', // Text color isn't relevant
                        display: 'block', // Use block instead of flex
                        // We assume height is thickness and width is length
                    };
                    return (
                        <div key={element.id} style={lineStyle}></div>
                    );
                }

                return null; // Should not happen with valid types
            })}
        </div>
    );
};

export default TemplatePreview; 