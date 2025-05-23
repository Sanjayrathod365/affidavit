/**
 * Utility functions for the template editors
 * Helps with data conversion between different editor formats
 */

import { v4 as uuidv4 } from 'uuid';

// Template Element from the classic TemplateEditor
export interface TemplateElement { 
  id: string;
  type: 'text' | 'image' | 'data' | 'line';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  padding?: number;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderColor?: string;
  zIndex?: number;
  imageUrl?: string;
  dataFieldKey?: string;
  dataFormat?: string;
}

// Canvas Element from FabricTemplateEditor
export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'placeholder' | 'line' | 'rectangle' | 'circle';
  data: any; // Fabric.js object data
}

/**
 * Convert TemplateEditor elements to FabricEditor format
 */
export function convertToFabricFormat(elements: TemplateElement[]): any[] {
  return elements.map(element => {
    // Basic conversion - would need enhancement based on full Fabric.js implementation
    const fabricElement: any = {
      id: element.id,
      type: mapElementType(element.type),
      data: {
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        text: element.content,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        textAlign: element.textAlign,
        fill: element.color,
        backgroundColor: element.backgroundColor,
        borderWidth: element.borderWidth,
        borderStyle: element.borderStyle,
        borderColor: element.borderColor,
        zIndex: element.zIndex,
      }
    };
    
    // Handle specific element types
    if (element.type === 'image' && element.imageUrl) {
      fabricElement.data.src = element.imageUrl;
    }
    
    if (element.type === 'data' && element.dataFieldKey) {
      fabricElement.type = 'placeholder';
      fabricElement.data.placeholder = element.dataFieldKey;
    }
    
    return fabricElement;
  });
}

/**
 * Convert FabricEditor elements to TemplateEditor format
 */
export function convertFromFabricFormat(fabricElements: any[]): TemplateElement[] {
  return fabricElements.map(fabricElement => {
    const data = fabricElement.data || {};
    
    // Basic conversion - would need enhancement based on full implementation
    const element: TemplateElement = {
      id: fabricElement.id || uuidv4(),
      type: mapFabricType(fabricElement.type),
      content: data.text || '',
      x: data.left || 0,
      y: data.top || 0,
      width: data.width || 100,
      height: data.height || 50,
      fontSize: data.fontSize,
      fontWeight: data.fontWeight,
      fontStyle: data.fontStyle,
      textAlign: data.textAlign,
      color: data.fill,
      backgroundColor: data.backgroundColor,
      borderWidth: data.borderWidth,
      borderStyle: data.borderStyle as any,
      borderColor: data.borderColor,
      zIndex: data.zIndex
    };
    
    // Handle specific types
    if (fabricElement.type === 'image' && data.src) {
      element.imageUrl = data.src;
    }
    
    if (fabricElement.type === 'placeholder' && data.placeholder) {
      element.type = 'data';
      element.dataFieldKey = data.placeholder;
    }
    
    return element;
  });
}

/**
 * Map TemplateEditor element type to FabricEditor type
 */
function mapElementType(type: string): string {
  const typeMap: Record<string, string> = {
    'text': 'text',
    'image': 'image',
    'data': 'placeholder',
    'line': 'line'
  };
  
  return typeMap[type] || type;
}

/**
 * Map FabricEditor element type to TemplateEditor type
 */
function mapFabricType(type: string): any {
  const typeMap: Record<string, any> = {
    'text': 'text',
    'image': 'image',
    'placeholder': 'data',
    'line': 'line',
    'rectangle': 'text', // Convert to text with border styling
    'circle': 'text'     // Convert to text with border styling
  };
  
  return typeMap[type] || 'text';
} 