'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import FabricCanvas from './FabricCanvas';

export default function DiagnosticTest() {
  const [logs, setLogs] = useState<string[]>([]);
  const [fabricModule, setFabricModule] = useState<any>(null);
  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);
  
  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, message]);
  };
  
  const testFabricImport = async () => {
    try {
      addLog("Starting fabric.js import test...");
      
      // Test 1: Basic dynamic import with better error handling
      addLog("Test 1: Dynamic import");
      let fabricImport;
      try {
        fabricImport = await import('fabric');
        setFabricModule(fabricImport);
        addLog(`Import successful. Module type: ${typeof fabricImport}`);
        
        if (fabricImport.__esModule) {
          addLog("Module is an ES Module (__esModule is true)");
        }
        
        // Log the module keys
        const keys = Object.keys(fabricImport);
        addLog(`Module keys: ${keys.join(', ')}`);
      } catch (err: any) {
        addLog(`Import failed: ${err.message}`);
        return;
      }
      
      // Test 2: Find the actual fabric object and Canvas constructor
      addLog("Test 2: Locate fabric object and Canvas constructor");
      
      // Try different paths to locate the Canvas constructor
      const paths = [
        { path: 'fabricImport.fabric', value: fabricImport.fabric },
        { path: 'fabricImport.default', value: fabricImport.default },
        { path: 'fabricImport.Canvas', value: fabricImport.Canvas },
        { path: 'fabricImport.fabric?.Canvas', value: fabricImport.fabric?.Canvas },
        { path: 'fabricImport.default?.Canvas', value: fabricImport.default?.Canvas },
        { path: 'fabricImport.default?.fabric?.Canvas', value: fabricImport.default?.fabric?.Canvas },
        { path: 'window.fabric?.Canvas', value: typeof window !== 'undefined' ? (window as any).fabric?.Canvas : undefined }
      ];
      
      // Check each possible path
      let fabricObjectFound = false;
      let canvasConstructorFound = false;
      
      for (const item of paths) {
        if (!item.value) {
          addLog(`${item.path}: Not found`);
          continue;
        }
        
        addLog(`${item.path}: Found (type: ${typeof item.value})`);
        
        if (typeof item.value === 'object') {
          // Might be the fabric object
          const subKeys = Object.keys(item.value).slice(0, 10);
          addLog(`  Keys: ${subKeys.join(', ')}${subKeys.length < Object.keys(item.value).length ? '...' : ''}`);
          
          if (item.value.Canvas && typeof item.value.Canvas === 'function') {
            addLog(`  Contains Canvas constructor!`);
            fabricObjectFound = true;
            canvasConstructorFound = true;
          }
          
          // Check for version
          if (item.value.version) {
            addLog(`  Version: ${item.value.version}`);
          }
        } else if (typeof item.value === 'function' && item.path.endsWith('Canvas')) {
          addLog(`  Direct Canvas constructor found!`);
          canvasConstructorFound = true;
        }
      }
      
      // Summary
      if (fabricObjectFound) {
        addLog("✅ Fabric object found successfully");
      } else {
        addLog("❌ Could not locate main fabric object");
      }
      
      if (canvasConstructorFound) {
        addLog("✅ Canvas constructor found");
      } else {
        addLog("❌ Could not locate Canvas constructor");
      }
      
      // Test 3: Attempt full init directly to verify module structure
      addLog("Test 3: Direct initialization attempt");
      try {
        // Find the most likely fabric instance
        let fabric = null;
        if (fabricImport.fabric && typeof fabricImport.fabric.Canvas === 'function') {
          fabric = fabricImport.fabric;
        } else if (fabricImport.default && typeof fabricImport.default.Canvas === 'function') {
          fabric = fabricImport.default;
        } else if (fabricImport.default?.fabric && typeof fabricImport.default.fabric.Canvas === 'function') {
          fabric = fabricImport.default.fabric;
        }
        
        if (fabric) {
          // Create a dummy canvas element
          const tempCanvas = document.createElement('canvas');
          tempCanvas.id = 'temp-fabric-test';
          tempCanvas.width = 100;
          tempCanvas.height = 100;
          document.body.appendChild(tempCanvas);
          
          // Try to initialize fabric
          const fabricCanvas = new fabric.Canvas('temp-fabric-test');
          if (fabricCanvas) {
            addLog("✅ Successfully created a fabric.Canvas instance directly");
            
            // Clean up
            fabricCanvas.dispose();
            document.body.removeChild(tempCanvas);
          }
        } else {
          addLog("❌ Could not find a usable fabric instance for direct testing");
        }
      } catch (err: any) {
        addLog(`❌ Direct initialization failed: ${err.message}`);
      }
      
      addLog("Fabric.js import tests complete");
    } catch (error: any) {
      addLog(`Error during testing: ${error.message}`);
    }
  };
  
  const testCanvasCreation = () => {
    setShowCanvas(true);
    addLog("Attempting to initialize Fabric.js canvas using the FabricCanvas component...");
  };
  
  const handleCanvasReady = (fabricCanvas: any) => {
    setCanvasInitialized(true);
    addLog("Canvas has been initialized successfully!");
    
    try {
      // Try to add a simple shape to verify canvas functionality
      const rect = new fabricCanvas.Rect({
        left: 50,
        top: 50,
        fill: 'blue',
        width: 100,
        height: 100
      });
      
      fabricCanvas.add(rect);
      fabricCanvas.renderAll();
      
      addLog("Rectangle added to canvas - fabric.js is working correctly!");
      
      // Try to add text
      const text = new fabricCanvas.Text('Hello Fabric.js!', {
        left: 200,
        top: 100,
        fontFamily: 'Arial',
        fill: 'black'
      });
      
      fabricCanvas.add(text);
      fabricCanvas.renderAll();
      
      addLog("Text added to canvas - all features are working correctly!");
    } catch (error: any) {
      addLog(`Error adding elements to canvas: ${error.message}`);
    }
  };
  
  return (
    <div className="p-4 border rounded-md bg-white">
      <h2 className="text-xl font-bold mb-4">Fabric.js Diagnostic Tests</h2>
      
      <div className="space-y-2 mb-4">
        <Button onClick={testFabricImport} variant="outline">
          Test Fabric Import
        </Button>
        
        <Button onClick={testCanvasCreation} variant="outline" className="ml-2">
          Test Canvas Creation
        </Button>
      </div>
      
      {showCanvas && (
        <div className="mb-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Canvas Test</h3>
          <FabricCanvas
            id="diagnostic-canvas"
            width={400}
            height={300}
            onReady={handleCanvasReady}
          />
          
          {canvasInitialized && (
            <div className="mt-2 text-green-600 bg-green-50 p-2 rounded">
              Canvas initialized successfully! Elements should appear above.
            </div>
          )}
        </div>
      )}
      
      <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-80 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-gray-500">Click a button to run tests...</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="mb-1">
              <span className="text-yellow-400">{i + 1}:</span> {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 