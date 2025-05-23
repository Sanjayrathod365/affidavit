'use client';

import React, { useEffect, useRef, useState } from 'react';
import useFabric from './useFabric';

interface FabricCanvasProps {
  id: string;
  width?: number;
  height?: number;
  onReady?: (fabricCanvas: any, fabricLib?: any) => void;
  className?: string;
}

export default function FabricCanvas({ 
  id, 
  width = 800, 
  height = 600, 
  onReady,
  className = ''
}: FabricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<any>(null);
  const { fabric, loading: fabricLoading, error: fabricError } = useFabric();
  const [canvasLoading, setCanvasLoading] = useState(true);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const hasCalledOnReadyRef = useRef<boolean>(false);
  const initAttempts = useRef<number>(0);

  // Main canvas initialization logic
  const initializeCanvas = () => {
    if (!fabric || !canvasRef.current || hasCalledOnReadyRef.current || canvasInstanceRef.current) {
      return;
    }

    try {
      console.log("Attempting canvas initialization, attempt:", initAttempts.current + 1);
      initAttempts.current += 1;
      
      // Create the canvas instance - ensure we're using the Canvas constructor correctly
      if (typeof fabric.Canvas !== 'function') {
        throw new Error('fabric.Canvas is not a constructor. Available properties: ' + 
          Object.keys(fabric).join(', '));
      }
      
      // Try initializing with the DOM ID first
      let canvas;
      try {
        canvas = new fabric.Canvas(id);
        console.log("Canvas initialized with ID successfully");
      } catch (idError) {
        console.warn("Failed to initialize with ID, trying DOM element:", idError);
        // Fallback to using the DOM element directly
        canvas = new fabric.Canvas(canvasRef.current);
        console.log("Canvas initialized with DOM element successfully");
      }
      
      // Store the canvas reference
      canvasInstanceRef.current = canvas;
      
      // Set canvas dimensions
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
      
      // Render the canvas
      canvas.renderAll();
      console.log("Canvas rendered successfully");
      
      // Notify parent component - pass both canvas instance and fabric library
      // Use a guard to ensure onReady is only called once
      if (onReady && typeof onReady === 'function' && !hasCalledOnReadyRef.current) {
        hasCalledOnReadyRef.current = true;
        console.log("Calling onReady callback with canvas and fabric");
        onReady(canvas, fabric);
      }
      
      setCanvasLoading(false);
    } catch (err: any) {
      console.error("Error initializing fabric canvas:", err);
      setCanvasError(err.message || "Failed to initialize canvas");
      setCanvasLoading(false);
    }
  };

  useEffect(() => {
    // Only proceed if fabric is loaded and we're in the browser
    if (!fabric || typeof window === 'undefined' || fabricLoading || fabricError) return;

    console.log("Canvas initialization triggered by dependencies change");
    
    // Try immediate initialization
    initializeCanvas();
    
    // If still not initialized after 500ms, try again (handles some race conditions)
    const timeoutId = setTimeout(() => {
      if (!canvasInstanceRef.current && !hasCalledOnReadyRef.current) {
        console.log("Retrying canvas initialization after timeout");
        initializeCanvas();
      }
    }, 500);

    // Clean up function
    return () => {
      clearTimeout(timeoutId);
      
      if (canvasInstanceRef.current) {
        try {
          console.log("Disposing canvas on cleanup");
          canvasInstanceRef.current.dispose();
          canvasInstanceRef.current = null;
          // Reset the onReady guard when component unmounts
          hasCalledOnReadyRef.current = false;
        } catch (err) {
          console.error("Error disposing canvas:", err);
        }
      }
    };
  }, [fabric, fabricLoading, fabricError, id, width, height, onReady]);

  // Determine loading and error states
  const isLoading = fabricLoading || canvasLoading;
  const errorMessage = fabricError || canvasError;

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
          <div className="text-center">
            <svg 
              className="animate-spin h-8 w-8 text-primary mx-auto mb-2" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Initializing canvas... {initAttempts.current > 0 ? `(Attempt ${initAttempts.current})` : ''}</span>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-20">
          <div className="text-center p-4 bg-white rounded-md shadow-md">
            <div className="text-red-500 mb-2">Error initializing canvas</div>
            <div className="text-sm text-gray-700">{errorMessage}</div>
            
            <button 
              onClick={initializeCanvas}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        id={id}
        width={width}
        height={height}
        className={`border border-gray-300 ${errorMessage ? 'opacity-30' : ''}`}
      />
    </div>
  );
} 