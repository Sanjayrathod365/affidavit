import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from "@/components/ui/button";

// Simple test component with a clean implementation
export default function VisibilityTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [objects, setObjects] = useState(0);
  
  const addLog = (message: string) => {
    console.log(`[VisibilityTest] ${message}`);
    setDebugLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 19)]);
  };
  
  const forceRender = () => {
    if (!fabricRef.current) {
      addLog("No canvas to render");
      return;
    }
    
    try {
      addLog("Forcing canvas render");
      fabricRef.current.renderAll();
      setObjects(fabricRef.current.getObjects().length);
    } catch (err) {
      addLog(`Render error: ${err}`);
    }
  };
  
  const addTestObject = () => {
    if (!fabricRef.current) {
      addLog("No canvas to add object to");
      return;
    }
    
    try {
      // Add a bright red rectangle with black border
      const rect = new fabric.Rect({
        left: 50 + Math.random() * 400,
        top: 50 + Math.random() * 300,
        width: 100,
        height: 100,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
        opacity: 1,
        visible: true
      });
      
      fabricRef.current.add(rect);
      fabricRef.current.setActiveObject(rect);
      fabricRef.current.renderAll();
      
      const objectCount = fabricRef.current.getObjects().length;
      setObjects(objectCount);
      addLog(`Added rectangle. Total objects: ${objectCount}`);
      
      // Force additional renders after short delays
      setTimeout(() => fabricRef.current?.renderAll(), 100);
      setTimeout(() => fabricRef.current?.renderAll(), 500);
    } catch (err) {
      addLog(`Error adding object: ${err}`);
    }
  };
  
  const runDiagnostics = () => {
    if (!fabricRef.current || !canvasRef.current) {
      addLog("No canvas to diagnose");
      return;
    }
    
    try {
      const canvas = fabricRef.current;
      
      // Basic info
      addLog(`Canvas dim: ${canvas.width}x${canvas.height}`);
      addLog(`Objects: ${canvas.getObjects().length}`);
      
      // Check canvas elements
      if (canvas.lowerCanvasEl) {
        addLog(`Lower canvas is ${canvas.lowerCanvasEl.width}x${canvas.lowerCanvasEl.height}`);
        
        // Check if canvas is in document
        const isInDocument = document.body.contains(canvas.lowerCanvasEl);
        addLog(`Canvas in document: ${isInDocument}`);
        
        // Check visibility
        const style = window.getComputedStyle(canvas.lowerCanvasEl);
        addLog(`Style: vis=${style.visibility}, disp=${style.display}, opac=${style.opacity}`);
        
        // Check context
        const ctx = canvas.lowerCanvasEl.getContext('2d');
        addLog(`Context available: ${ctx !== null}`);
        
        // Check positioning
        const rect = canvas.lowerCanvasEl.getBoundingClientRect();
        addLog(`Position: x=${rect.left.toFixed(0)}, y=${rect.top.toFixed(0)}, w=${rect.width.toFixed(0)}, h=${rect.height.toFixed(0)}`);
      } else {
        addLog("Lower canvas element is missing");
      }
      
      // Try to render
      canvas.renderAll();
      addLog("Diagnostics complete");
    } catch (err) {
      addLog(`Diagnostics error: ${err}`);
    }
  };
  
  useEffect(() => {
    addLog("Component mounted");
    
    // Clean setup function
    const setupCanvas = async () => {
      if (!canvasRef.current) {
        addLog("Canvas reference is null");
        return;
      }
      
      addLog("Setting up canvas");
      
      // Clear any existing instances
      if (fabricRef.current) {
        fabricRef.current.dispose();
      }
      
      try {
        // Set dimensions directly on canvas element
        canvasRef.current.width = 500;
        canvasRef.current.height = 400;
        
        // Create fabric canvas
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 500,
          height: 400,
          backgroundColor: '#f0f0f0',
          renderOnAddRemove: true,
          selection: true,
          preserveObjectStacking: true,
          objectCaching: false
        });
        
        fabricRef.current = canvas;
        addLog("Canvas created successfully");
        
        // Add a test object
        const text = new fabric.Text("Test Text", {
          left: 50,
          top: 50,
          fontSize: 30,
          fontWeight: 'bold',
          fill: 'blue'
        });
        
        canvas.add(text);
        canvas.renderAll();
        
        addLog("Added test text object");
        setObjects(canvas.getObjects().length);
        
        // Force additional renders after short delays
        setTimeout(() => canvas.renderAll(), 100);
        setTimeout(() => canvas.renderAll(), 500);
        
      } catch (err) {
        addLog(`Error in setup: ${err}`);
      }
    };
    
    setupCanvas();
    
    // Cleanup
    return () => {
      addLog("Component unmounting");
      if (fabricRef.current) {
        try {
          fabricRef.current.dispose();
        } catch (err) {
          console.error("Error disposing canvas:", err);
        }
        fabricRef.current = null;
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-4">
        <div 
          className="p-4 border-2 border-gray-400 rounded-lg bg-white"
          style={{ width: '550px' }}
        >
          <canvas 
            ref={canvasRef}
            id="visibility-test-canvas"
            className="border border-black"
            width={500}
            height={400}
          />
        </div>
        <div className="flex space-x-2 mt-4">
          <Button onClick={addTestObject}>Add Object</Button>
          <Button variant="outline" onClick={forceRender}>Force Render</Button>
          <Button variant="outline" onClick={runDiagnostics}>Diagnostics</Button>
        </div>
        <div className="mt-4 text-sm">
          <p>Canvas has {objects} objects. {objects > 0 ? "They should be visible above." : ""}</p>
        </div>
      </div>
      
      <div className="w-full max-w-xl">
        <h3 className="font-bold mb-2">Debug Logs:</h3>
        <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-auto max-h-60">
          {debugLogs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
} 