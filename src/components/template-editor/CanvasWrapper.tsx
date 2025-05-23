'use client';

import React, { useEffect, useRef, useState } from 'react';
import SimpleCanvas, { A4_WIDTH, A4_HEIGHT } from './SimpleCanvas';
import { v4 as uuidv4 } from 'uuid';

interface CanvasWrapperProps {
  elements?: any[];
  onElementsChange?: (elements: any[]) => void;
  onError?: (error: Error) => void;
  onReady?: (canvas: any, fabricLib: any) => void;
  onSelect?: (selectedObject: any) => void;
  background?: string;
  width?: number;
  height?: number;
}

export default function CanvasWrapper({
  elements = [],
  onElementsChange,
  onError,
  onReady,
  onSelect,
  background = '#fffdf0',
  width = A4_WIDTH,
  height = A4_HEIGHT
}: CanvasWrapperProps) {
  const canvasRef = useRef<any>(null);
  const fabricLibRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Handle canvas ready event
  const handleCanvasReady = (canvas: any, fabricLib: any) => {
    canvasRef.current = canvas;
    fabricLibRef.current = fabricLib;
    setIsReady(true);
    
    // Set up monitoring to force refresh if objects aren't showing
    const refreshInterval = setInterval(() => {
      if (canvas && typeof canvas.refreshObjects === 'function') {
        console.log("CanvasWrapper: Applying periodic refresh");
        canvas.refreshObjects();
      }
    }, 2000); // Refresh every 2 seconds
    
    // Setup cleanup for interval
    window.addEventListener('beforeunload', () => clearInterval(refreshInterval));
    
    // Call onReady callback if provided
    if (onReady) {
      onReady(canvas, fabricLib);
    }
  };
  
  // Handle canvas errors
  const handleError = (error: Error) => {
    console.error('Canvas error:', error);
    if (onError) {
      onError(error);
    }
  };
  
  // Handle element selection
  const handleSelect = (e: any) => {
    if (onSelect) {
      onSelect(e?.selected?.[0] || null);
    }
  };
  
  // Get all current canvas elements
  const getCanvasElements = () => {
    if (!canvasRef.current) return [];
    
    try {
      const canvas = canvasRef.current;
      return canvas.getObjects().map((obj: any) => {
        return {
          id: obj.id || uuidv4(),
          type: getObjectType(obj),
          data: serializeObject(obj)
        };
      });
    } catch (err) {
      console.error('Error getting canvas elements:', err);
      return [];
    }
  };
  
  // Normalize object type
  const getObjectType = (obj: any): string => {
    if (obj.type === 'textbox' || obj.type === 'text') return 'text';
    if (obj.type === 'image') return 'image';
    if (obj.type === 'line') return 'line';
    if (obj.type === 'rect') return 'rectangle';
    if (obj.type === 'circle') return 'circle';
    if (obj.placeholder) return 'placeholder';
    return obj.type || 'text';
  };
  
  // Serialize a fabric object
  const serializeObject = (obj: any): any => {
    // Basic serialization
    const data = obj.toObject();
    
    // Add custom properties
    if (obj.placeholder) {
      data.placeholder = obj.placeholder;
    }
    
    return data;
  };
  
  // Update elements when canvas changes
  const handleCanvasModified = () => {
    if (onElementsChange) {
      onElementsChange(getCanvasElements());
    }
    
    // Force refresh when canvas is modified
    if (canvasRef.current && typeof canvasRef.current.refreshObjects === 'function') {
      canvasRef.current.refreshObjects();
    }
  };
  
  // Manually refresh the canvas
  const refreshCanvas = () => {
    if (canvasRef.current && typeof canvasRef.current.refreshObjects === 'function') {
      canvasRef.current.refreshObjects();
    }
  };
  
  // Effect to add event listeners when canvas is ready
  useEffect(() => {
    if (isReady && canvasRef.current) {
      const canvas = canvasRef.current;
      
      // Add event listeners
      canvas.on('object:modified', handleCanvasModified);
      canvas.on('selection:created', handleSelect);
      canvas.on('selection:updated', handleSelect);
      canvas.on('selection:cleared', () => handleSelect({ selected: [] }));
      
      // Add event listener for object:added to ensure visibility
      canvas.on('object:added', () => {
        setTimeout(refreshCanvas, 50);
      });
      
      // Initial refresh
      refreshCanvas();
      
      return () => {
        // Remove event listeners on cleanup
        canvas.off('object:modified', handleCanvasModified);
        canvas.off('selection:created', handleSelect);
        canvas.off('selection:updated', handleSelect);
        canvas.off('selection:cleared');
        canvas.off('object:added');
      };
    }
  }, [isReady]);
  
  return (
    <div className="canvas-wrapper">
      <SimpleCanvas
        width={width}
        height={height}
        onReady={handleCanvasReady}
        onError={handleError}
        initialElements={elements}
        background={background}
      />
    </div>
  );
} 