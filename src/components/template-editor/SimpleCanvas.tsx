'use client';

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';

// TypeScript: declare the 'fabric' module to suppress missing types error
// Remove this if you add @types/fabric
// @ts-ignore
declare module 'fabric';

// A4 size constants at 96 DPI
export const A4_WIDTH = 794;  // 210mm at 96 DPI
export const A4_HEIGHT = 1123; // 297mm at 96 DPI

interface SimpleCanvasProps {
  width?: number;
  height?: number;
  onReady?: (canvas: any, fabricLib: any) => void;
  background?: string;
  showGrid?: boolean;
}

// Add a script loader function at the top of the file after imports
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log(`Script ${src} already loaded`);
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log(`Script loaded: ${src}`);
      resolve();
    };
    script.onerror = (err) => {
      console.error(`Script load error: ${src}`, err);
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.head.appendChild(script);
  });
};

export default function SimpleCanvas({ 
  width = A4_WIDTH, 
  height = A4_HEIGHT, 
  onReady,
  background = '#ffffff',
  showGrid = false 
}: SimpleCanvasProps) {
  console.log('SimpleCanvas render with showGrid:', showGrid);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const fabricLibRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);
  const callbackCalledRef = useRef(false);
  const canvasIdRef = useRef(`simple-canvas-${Math.random().toString(36).substring(2, 9)}`);
  const forceRerenderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Draw a simple rectangle on the canvas as fallback
  const drawFallbackCanvas = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    
    // Draw border
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
    
    // Draw text
    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Template Canvas (Loading...)', width / 2, height / 2);
    
    // Draw A4 dimensions indicator
    ctx.fillStyle = '#999999';
    ctx.font = '12px Arial';
    ctx.fillText(`A4 (${width}×${height}px)`, width / 2, height - 20);
  };

  // Function to patch Fabric.js Canvas prototype to handle null contexts
  const patchFabricCanvas = (fabric: any) => {
    if (!fabric || !fabric.Canvas || !fabric.Canvas.prototype) {
      console.error("Cannot patch Fabric.js: Canvas prototype not available");
      return;
    }

    // Only patch once
    if (fabric.Canvas.prototype._isPatched) {
      return;
    }

    // Fix issue with objectCaching that can cause objects not to appear
    fabric.Object.prototype.objectCaching = false;

    // Save original methods
    const originalClearContext = fabric.Canvas.prototype.clearContext;
    const originalRenderCanvas = fabric.Canvas.prototype.renderCanvas;
    const originalRenderAll = fabric.Canvas.prototype.renderAll;
    const originalRequestRenderAll = fabric.Canvas.prototype.requestRenderAll;

    // Patch clearContext to handle null contexts
    fabric.Canvas.prototype.clearContext = function(ctx: CanvasRenderingContext2D) {
      if (!ctx) {
        console.warn("Fabric.js: Attempted to clear null context");
        return this;
      }
      return originalClearContext.call(this, ctx);
    };

    // Patch renderCanvas to check context before rendering
    fabric.Canvas.prototype.renderCanvas = function(ctx: CanvasRenderingContext2D, objects: any[]) {
      if (!ctx) {
        console.warn("Fabric.js: Attempted to render with null context");
        return this;
      }
      if (!this.contextContainer) {
        console.warn("Fabric.js: Missing contextContainer in renderCanvas");
        return this;
      }
      return originalRenderCanvas.call(this, ctx, objects);
    };

    // Patch renderAll to ensure context exists
    fabric.Canvas.prototype.renderAll = function() {
      if (!this.contextContainer) {
        console.warn("Fabric.js: Attempted to renderAll with null contextContainer");
        return this;
      }
      try {
        return originalRenderAll.call(this);
      } catch (err) {
        console.warn("Fabric.js: Error in renderAll", err);
        return this;
      }
    };
    
    // Patch requestRenderAll to check canvas exists
    fabric.Canvas.prototype.requestRenderAll = function() {
      if (!this.contextContainer) {
        console.warn("Fabric.js: Attempted to request render with null contextContainer");
        return this;
      }
      try {
        return originalRequestRenderAll.call(this);
      } catch (err) {
        console.warn("Fabric.js: Error in requestRenderAll", err);
        return this;
      }
    };

    // Enhance object visibility checks
    const originalIsVisible = fabric.Object.prototype.isVisible;
    fabric.Object.prototype.isVisible = function() {
      // Always make sure objects are visible
      return true;
    };

    // Mark as patched
    fabric.Canvas.prototype._isPatched = true;
    
    console.log("Fabric.js Canvas prototype patches applied");
  };

  // Draw grid lines on the canvas - completely revised implementation
  const drawGrid = (canvas: any, fabric: any) => {
    console.log(`GRID DRAW: Started with showGrid=${showGrid}`);
    
    try {
      // Always clean up existing grid first
      if (canvas && canvas.getObjects) {
        const existingGrid = canvas.getObjects().filter((obj: any) => 
          obj.excludeFromExport === true || obj.gridLine === true
        );
        
        if (existingGrid && existingGrid.length > 0) {
          console.log(`GRID: Removing ${existingGrid.length} existing grid lines`);
          existingGrid.forEach((obj: any) => {
            canvas.remove(obj);
          });
        }
      }
      
      // If grid is off, just clear and return
      if (!showGrid) {
        console.log("GRID: Grid disabled, not drawing grid lines");
        canvas.requestRenderAll();
        return;
      }
      
      // Create a background for better contrast (optional)
      /*
      const rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: width,
        height: height,
        fill: 'rgba(248, 249, 250, 1)',
        selectable: false,
        evented: false,
        excludeFromExport: true,
        gridLine: true
      });
      canvas.add(rect);
      canvas.sendToBack(rect);
      */
      
      // Draw vertical lines
      const gridSize = 20; // Smaller grid for more visibility
      const lineOptions = {
        stroke: '#2563eb', // Bright blue color
        strokeWidth: 1, // Thicker lines
        selectable: false,
        evented: false,
        excludeFromExport: true,
        gridLine: true,
        opacity: 0.5 // Semi-transparent
      };
      
      let vLineCount = 0;
      let hLineCount = 0;
      
      // Vertical lines
      for (let i = 0; i <= Math.ceil(width / gridSize); i++) {
        const xPos = i * gridSize;
        const line = new fabric.Line([xPos, 0, xPos, height], lineOptions);
        canvas.add(line);
        vLineCount++;
      }
      
      // Horizontal lines
      for (let i = 0; i <= Math.ceil(height / gridSize); i++) {
        const yPos = i * gridSize;
        const line = new fabric.Line([0, yPos, width, yPos], lineOptions);
        canvas.add(line);
        hLineCount++;
      }
      
      // Emphasized major grid lines (every 5 cells)
      for (let i = 0; i <= Math.ceil(width / (gridSize * 5)); i++) {
        const xPos = i * gridSize * 5;
        const line = new fabric.Line([xPos, 0, xPos, height], {
          ...lineOptions,
          stroke: '#1e40af', // Darker blue
          strokeWidth: 2,
          opacity: 0.8
        });
        canvas.add(line);
      }
      
      for (let i = 0; i <= Math.ceil(height / (gridSize * 5)); i++) {
        const yPos = i * gridSize * 5;
        const line = new fabric.Line([0, yPos, width, yPos], {
          ...lineOptions,
          stroke: '#1e40af', // Darker blue
          strokeWidth: 2,
          opacity: 0.8
        });
        canvas.add(line);
      }
      
      console.log(`GRID: Successfully added ${vLineCount} vertical and ${hLineCount} horizontal grid lines`);
      
      // Force grid to be behind content but still visible
      canvas.getObjects().forEach((obj: any) => {
        if (obj.gridLine) {
          canvas.sendToBack(obj);
        }
      });
      
      // Make sure changes are rendered
      if (typeof canvas.requestRenderAll === 'function') {
        canvas.requestRenderAll();
      } else if (typeof canvas.renderAll === 'function') {
        canvas.renderAll();
      }
      
      // Force additional render after a short delay
      setTimeout(() => {
        if (canvas && typeof canvas.renderAll === 'function') {
          canvas.renderAll();
          console.log("GRID: Forced delayed render completed");
        }
      }, 100);
      
    } catch (err) {
      console.error("GRID ERROR:", err);
    }
  };
  
  // Create new canvas element
  const createCanvasElement = () => {
    if (!containerRef.current) return null;
    
    // Check if there's an existing fabric canvas container and remove it
    const existingContainer = containerRef.current.querySelector('.canvas-container');
    if (existingContainer) {
      containerRef.current.removeChild(existingContainer);
    }
    
    // Create new canvas element
    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;
    newCanvas.id = canvasIdRef.current;
    newCanvas.className = 'border border-gray-300 shadow-sm bg-white';
    
    // Force hardware acceleration to ensure proper rendering
    newCanvas.style.transform = 'translateZ(0)';
    
    // Find the container element
    const innerContainer = containerRef.current.querySelector('.relative');
    if (innerContainer) {
      // Remove old canvas if it exists
      const oldCanvas = innerContainer.querySelector('canvas');
      if (oldCanvas) {
        innerContainer.removeChild(oldCanvas);
      }
      innerContainer.appendChild(newCanvas);
      return newCanvas;
    }
    
    return null;
  };

  // Force a canvas render with error handling
  const forceRender = (canvas: any) => {
    if (!canvas) return;
    
    try {
      console.log("CANVAS_RENDER: Forcing render", {
        objectCount: canvas.getObjects().length,
        hasContext: canvas.contextContainer ? "yes" : "no"
      });
      
      // Clear canvas first to force a complete redraw
      if (canvas.clear && typeof canvas.clear === 'function') {
        canvas.clear();
      }
      
      // Re-add the test rectangle to ensure something is visible
      try {
        if (fabricLibRef.current) {
          const testRect = new fabricLibRef.current.Rect({
            width: 100,
            height: 50,
            fill: 'red',
            left: width / 2 - 50,
            top: height / 2 - 25,
            stroke: 'black',
            strokeWidth: 2,
            visible: true,
            opacity: 1
          });
          canvas.add(testRect);
        }
      } catch (err) {
        console.error("Error re-adding test rectangle:", err);
      }
      
      // Force all objects to be visible and dirty (needing redraw)
      if (canvas.getObjects) {
        canvas.getObjects().forEach((obj: any) => {
          obj.set({
            visible: true,
            opacity: 1,
            dirty: true
          });
        });
      }
      
      // Try requestRenderAll first
      if (typeof canvas.requestRenderAll === 'function') {
        canvas.requestRenderAll();
      } 
      // Fall back to renderAll
      else if (typeof canvas.renderAll === 'function') {
        canvas.renderAll();
      }
      
      // Check if objects are visible in DOM
      setTimeout(() => {
        if (canvas && canvas.lowerCanvasEl) {
          const ctx = canvas.lowerCanvasEl.getContext('2d', { willReadFrequently: true });
          console.log("CANVAS_RENDER: Post-render check", {
            contextExists: ctx ? "yes" : "no",
            canvasEmpty: ctx ? isCanvasEmpty(ctx, canvas.width, canvas.height) : "unknown",
            objectCount: canvas.getObjects().length
          });
        }
      }, 50);
    } catch (err) {
      console.warn("Error during force render:", err);
    }
  };
  
  // Helper to check if canvas is actually empty (all pixels transparent/same color)
  const isCanvasEmpty = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      // Sample a few pixels to see if anything is drawn
      const samples = [
        ctx.getImageData(0, 0, 1, 1),
        ctx.getImageData(width/2, height/2, 1, 1),
        ctx.getImageData(width-1, height-1, 1, 1)
      ];
      
      // If all pixels are identical, canvas might be empty or just filled with background
      const areAllSameColor = samples.every(sample => 
        sample.data[0] === samples[0].data[0] &&
        sample.data[1] === samples[0].data[1] &&
        sample.data[2] === samples[0].data[2] &&
        sample.data[3] === samples[0].data[3]
      );
      
      return areAllSameColor ? "likely empty" : "has content";
    } catch (err) {
      return "error checking";
    }
  };
  
  // Move cleanupCanvas and resetCanvas above their usage
  const cleanupCanvas = () => {
    if (fabricCanvasRef.current) {
      try {
        // Remove all event listeners
        fabricCanvasRef.current.off();
        // Dispose the canvas
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      } catch (e) {
        console.error("Error during canvas cleanup:", e);
      }
    }
    if (forceRerenderTimeoutRef.current) {
      clearTimeout(forceRerenderTimeoutRef.current);
      forceRerenderTimeoutRef.current = null;
    }
  };

  const resetCanvas = () => {
    setError(null);
    setLoading(true);
    initializedRef.current = false;
    callbackCalledRef.current = false;
    // Clean up existing canvas
    cleanupCanvas();
    // Generate new ID to avoid conflicts
    canvasIdRef.current = `simple-canvas-${Math.random().toString(36).substring(2, 9)}`;
    // Draw fallback immediately
    setTimeout(() => {
      drawFallbackCanvas();
      // Reinitialize after a short delay
      setTimeout(() => {
        // Re-run the initialization effect by forcing a re-render
        window.location.reload(); // fallback: reload the page
      }, 100);
    }, 100);
  };
  
  // Main effect - initialize the canvas (run only on mount)
  useLayoutEffect(() => {
    if (initializedRef.current) {
      console.log("CANVAS_MAIN: Already initialized, skipping effect");
      return;
    }
    // Set the guard immediately to prevent re-entry
    initializedRef.current = true;
    console.log("CANVAS_MAIN: Layout effect running (guarded)");
    // Initialize canvas
    const initCanvas = async () => {
      try {
        console.log("CANVAS_MAIN: Starting canvas initialization");
        
        // Load Fabric.js from CDN if not already loaded
        if (!fabricLibRef.current) {
          console.log("CANVAS_MAIN: Loading Fabric.js library from CDN");
          try {
            await loadScript('https://cdn.jsdelivr.net/npm/fabric@4.6.0/dist/fabric.min.js');
            
            // Get the fabric reference from window
            if ((window as any).fabric) {
              fabricLibRef.current = (window as any).fabric;
              console.log("CANVAS_MAIN: Fabric.js loaded successfully from CDN", {
                version: fabricLibRef.current.version || 'unknown'
              });
              patchFabricCanvas(fabricLibRef.current);
            } else {
              throw new Error("Could not find fabric in window after loading script");
            }
          } catch (err: any) {
            const errorMsg = `Failed to load Fabric.js: ${err.message}`;
            console.error("CANVAS_MAIN:", errorMsg, err);
            setError(errorMsg);
            setLoading(false);
            return null;
          }
        } else {
          console.log("CANVAS_MAIN: Using existing Fabric.js reference");
        }
        
        // Initialize the canvas with the loaded fabric library
        console.log("CANVAS_MAIN: Initializing Fabric canvas");
        if (!containerRef.current) {
          setError("No container reference available");
          setLoading(false);
          return null;
        }
        // Clear container contents completely
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
        // Create a wrapper div
        const wrapperDiv = document.createElement('div');
        wrapperDiv.id = `wrapper-${canvasIdRef.current}`;
        wrapperDiv.className = 'canvas-wrapper border border-gray-300 shadow-sm';
        wrapperDiv.style.position = 'relative';
        wrapperDiv.style.width = `${width}px`;
        wrapperDiv.style.height = `${height}px`;
        wrapperDiv.style.backgroundColor = background;
        // Create a canvas element
        const canvasElement = document.createElement('canvas');
        canvasElement.id = canvasIdRef.current;
        canvasElement.width = width;
        canvasElement.height = height;
        canvasElement.style.position = 'absolute';
        canvasElement.style.top = '0';
        canvasElement.style.left = '0';
        canvasElement.style.width = '100%';
        canvasElement.style.height = '100%';
        canvasElement.style.transform = 'translateZ(0)';
        canvasElement.style.webkitTransform = 'translateZ(0)';
        wrapperDiv.appendChild(canvasElement);
        containerRef.current.appendChild(wrapperDiv);
        // Do NOT assign to canvasRef.current directly (read-only)
        // Create the Fabric.js canvas instance
        const fabric = fabricLibRef.current;
        const fabricCanvas = new fabric.Canvas(canvasElement.id, {
          width: width,
          height: height,
          preserveObjectStacking: true,
          renderOnAddRemove: true,
          selection: true,
          includeDefaultValues: false,
          controlsAboveOverlay: true,
          enableRetinaScaling: true,
          backgroundColor: '#fffdf0', // Light cream background that's more subtle than yellow
          fireRightClick: true,
          stopContextMenu: true,
          interactive: true,
          stateful: true
        });
        fabricCanvasRef.current = fabricCanvas;
        // Get canvas context with willReadFrequently set to true to improve performance with getImageData
        if (fabricCanvas.lowerCanvasEl) {
          try {
            const ctx = fabricCanvas.lowerCanvasEl.getContext('2d', { willReadFrequently: true });
            fabricCanvas.contextContainer = ctx;
            console.log("CANVAS_INIT: Applied willReadFrequently to canvas context");
          } catch (err) {
            console.error("Error setting willReadFrequently:", err);
          }
        }
        // --- Step 2: Add a simple test object (red rectangle) ---
        try {
          const testRect = new fabric.Rect({
            width: 100,
            height: 50,
            fill: 'red',
            left: width / 2 - 50,
            top: height / 2 - 25,
            stroke: 'black',
            strokeWidth: 2
          });
          fabricCanvas.add(testRect);
          fabricCanvas.requestRenderAll();
          console.log("CANVAS_INIT: Added test rectangle");
          
          // Draw grid if enabled - DIRECT CALL DURING INITIALIZATION
          if (showGrid) {
            console.log("CANVAS_INIT: Drawing initial grid directly");
            
            // Draw a bright grid first for testing
            const gridSize = 50;
            let gridLineCount = 0;
            
            // Create bright red vertical lines
            for (let i = 0; i <= Math.ceil(width / gridSize); i++) {
              const xPos = i * gridSize;
              const line = new fabric.Line([xPos, 0, xPos, height], {
                stroke: 'red',
                strokeWidth: 2,
                selectable: false,
                evented: false,
                excludeFromExport: true,
                gridLine: true
              });
              fabricCanvas.add(line);
              gridLineCount++;
            }
            
            // Create bright red horizontal lines
            for (let i = 0; i <= Math.ceil(height / gridSize); i++) {
              const yPos = i * gridSize;
              const line = new fabric.Line([0, yPos, width, yPos], {
                stroke: 'red',
                strokeWidth: 2,
                selectable: false,
                evented: false,
                excludeFromExport: true,
                gridLine: true
              });
              fabricCanvas.add(line);
              gridLineCount++;
            }
            
            console.log(`CANVAS_INIT: Added ${gridLineCount} RED grid lines for debugging`);
            
            // Force render to make sure grid is visible
            fabricCanvas.renderAll();
            
            // Call normal grid function after delay to replace debug grid
            setTimeout(() => {
              if (fabricCanvas && fabricLibRef.current) {
                drawGrid(fabricCanvas, fabricLibRef.current);
              }
            }, 500);
          } else {
            console.log("CANVAS_INIT: Grid disabled, not drawing initial grid");
          }
        } catch (err) {
          console.error("Error adding test rectangle:", err);
        }
        
        setLoading(false); // Only set loading false after first mount
        setError(null);    // Only clear error after first mount
        // Notify parent if not already called
        if (onReady && !callbackCalledRef.current) {
          callbackCalledRef.current = true;
          console.log("CANVAS_INIT: Calling onReady callback");
          onReady(fabricCanvas, fabric);
        }
        // Fix for objects not showing in main view but showing in export
        fabricCanvas.refreshObjects = function() {
          const objects = this.getObjects();
          console.log(`CANVAS_REFRESH: Refreshing ${objects.length} objects`);
          
          objects.forEach((obj: any) => {
            // Mark all objects as dirty to force redraw
            obj.set({
              dirty: true,
              visible: true,
              opacity: 1
            });
            
            // Move objects slightly to force redraw
            const originalLeft = obj.left;
            const originalTop = obj.top;
            
            obj.set({ left: originalLeft + 0.1 });
            obj.set({ top: originalTop + 0.1 });
            obj.setCoords();
            
            // Move back to original position
            obj.set({ left: originalLeft });
            obj.set({ top: originalTop });
            obj.setCoords();
          });
          
          // Force render
          this.renderAll();
          
          // Use setTimeout to ensure rendering happens
          setTimeout(() => {
            this.requestRenderAll();
          }, 50);
          
          return this;
        };
        return fabricCanvas;
      } catch (err: any) {
        const errorMsg = `Initialization error: ${err.message}`;
        console.error("CANVAS_MAIN:", errorMsg, err);
        setError(errorMsg);
        setLoading(false);
        return null;
      }
    };
    // Start canvas initialization
    initCanvas();
    // Cleanup function
    return () => {
      console.log("CANVAS_MAIN: Cleanup running");
      if (forceRerenderTimeoutRef.current) {
        clearTimeout(forceRerenderTimeoutRef.current);
        forceRerenderTimeoutRef.current = null;
      }
      if (fabricCanvasRef.current) {
        console.log("CANVAS_MAIN: Disposing fabric canvas");
        try {
          fabricCanvasRef.current.dispose();
        } catch (e) {
          console.error("CANVAS_MAIN: Error disposing canvas:", e);
        }
        fabricCanvasRef.current = null;
      }
      initializedRef.current = false;
      callbackCalledRef.current = false;
    };
  }, []); // Only run on mount

  // Set loading and error only on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
  }, []);

  // Effect to update canvas size and background when props change (do NOT re-initialize canvas)
  useEffect(() => {
    if (fabricCanvasRef.current && initializedRef.current) {
      const canvas = fabricCanvasRef.current;
      // Update dimensions
      if (canvas.width !== width) canvas.setWidth(width);
      if (canvas.height !== height) canvas.setHeight(height);
      // Update background
      if (canvas.backgroundColor !== background) {
        canvas.setBackgroundColor(background, () => {
          if (typeof canvas.requestRenderAll === 'function') {
            canvas.requestRenderAll();
          }
        });
      } else {
        if (typeof canvas.requestRenderAll === 'function') {
          canvas.requestRenderAll();
        }
      }
    }
  }, [width, height, background]);

  // Modify the useEffect to be simpler and more direct
  useEffect(() => {
    console.log(`GRID useEffect with showGrid=${showGrid}`);
    
    // Only proceed if canvas is ready
    if (!fabricCanvasRef.current || !fabricLibRef.current) {
      console.log("GRID useEffect: Canvas not ready yet");
      return;
    }
    
    try {
      // Direct approach - just call drawGrid with current state
      drawGrid(fabricCanvasRef.current, fabricLibRef.current);
      
    } catch (err) {
      console.error("GRID useEffect error:", err);
    }
  }, [showGrid]); // Depend only on showGrid flag for simplicity

  // Add another effect to draw grid when canvas is first initialized
  useEffect(() => {
    if (initializedRef.current && fabricCanvasRef.current && fabricLibRef.current && showGrid) {
      console.log("GRID: Canvas is initialized and grid is enabled, drawing initial grid");
      drawGrid(fabricCanvasRef.current, fabricLibRef.current);
    }
  }, [initializedRef.current, fabricCanvasRef.current, fabricLibRef.current, showGrid]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCanvas();
      initializedRef.current = false;
      callbackCalledRef.current = false;
      
      if (forceRerenderTimeoutRef.current) {
        clearTimeout(forceRerenderTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative mx-auto overflow-auto"
      style={{ 
        maxWidth: '100%', 
        maxHeight: '80vh',
        border: '4px solid #e63946', // Bright red border for debug
        zIndex: 9999, // High z-index for debug
        position: 'relative',
        background: '#fff'
      }}
    >
      {/* Debug overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'rgba(230,57,70,0.85)',
        color: '#fff',
        padding: '2px 8px',
        fontSize: '12px',
        zIndex: 10000,
        borderBottomRightRadius: '8px',
        pointerEvents: 'none'
      }}>
        Canvas: {width}×{height} | Objects: {fabricCanvasRef.current ? fabricCanvasRef.current.getObjects().length : 0}
      </div>
      <div 
        className="relative"
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          transform: 'translateZ(0)' // Force hardware acceleration
        }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p>Initializing...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-70 z-10">
            <div className="text-center bg-white p-4 rounded shadow-md max-w-md">
              <p className="text-red-500 font-medium">Canvas Error</p>
              <p className="text-sm mt-1 mb-2">{error}</p>
              <div className="flex gap-2 justify-center">
                <button 
                  onClick={resetCanvas}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height}
          className="border border-gray-300 shadow-sm bg-white"
          style={{ transform: 'translateZ(0)' }} // Force hardware acceleration
        />
      </div>
    </div>
  );
} 