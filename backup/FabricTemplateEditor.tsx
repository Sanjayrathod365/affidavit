'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import SimpleCanvas, { A4_WIDTH, A4_HEIGHT } from './SimpleCanvas';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Download, Eye, Grid, Layers, Save, Trash, Upload, X, Plus, Copy, Palette } from "lucide-react";
import { ArrowUpIcon, ArrowDownIcon, CopyIcon, TrashIcon } from "lucide-react";

// Types
interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'placeholder' | 'line' | 'rectangle' | 'circle';
  data: any;
}

interface Placeholder {
  id: string;
  name: string;
  description?: string;
  defaultValue?: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'select';
  options?: string[];
}

export interface FabricTemplateEditorProps {
  templateId?: string;
  initialName?: string;
  initialElements?: any[];
  initialPlaceholders?: Placeholder[];
  onNameChange?: (name: string) => void;
  ref?: any;
}

// Common placeholders used in affidavits
const COMMON_PLACEHOLDERS: Placeholder[] = [
  { id: 'name', name: 'Full Name', type: 'text', description: 'Full name of the person making the affidavit' },
  { id: 'address', name: 'Address', type: 'text', description: 'Current address' },
  { id: 'city', name: 'City', type: 'text' },
  { id: 'state', name: 'State', type: 'text' },
  { id: 'zip', name: 'ZIP Code', type: 'text' },
  { id: 'date', name: 'Date', type: 'date', description: 'Date of affidavit' },
  { id: 'signature', name: 'Signature', type: 'text', description: 'Electronic signature' },
  { id: 'caseNumber', name: 'Case Number', type: 'text', description: 'Legal case number' },
  { id: 'courtName', name: 'Court Name', type: 'text' },
  { id: 'partyName', name: 'Party Name', type: 'text', description: 'Name of legal party' },
  { id: 'attorneyName', name: 'Attorney Name', type: 'text' },
  { id: 'phoneNumber', name: 'Phone Number', type: 'text' },
  { id: 'email', name: 'Email', type: 'text' },
  { id: 'declarationText', name: 'Declaration', type: 'text', description: 'Standard declaration text' },
];

// Simple range input slider to replace Radix UI Slider
const SimpleSlider = ({
  value,
  min,
  max,
  step,
  className,
  id,
  onChange
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  className?: string;
  id?: string;
  onChange: (value: number) => void;
}) => {
  // Use a ref to track the last reported value to prevent duplicate events
  const lastValueRef = useRef(value);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    // Only trigger onChange if the value actually changed
    if (newValue !== lastValueRef.current) {
      lastValueRef.current = newValue;
      onChange(newValue);
    }
  };
  
  // Update ref when prop changes
  useEffect(() => {
    lastValueRef.current = value;
  }, [value]);
  
  return (
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      className={`${className} w-full h-4 appearance-none bg-gray-200 rounded-md cursor-pointer`}
      style={{
        backgroundSize: `${((value - min) * 100) / (max - min)}% 100%`,
        backgroundImage: 'linear-gradient(#3b82f6, #3b82f6)'
      }}
    />
  );
};

// Simple toggle switch to replace Radix UI Switch
const SimpleToggle = ({
  checked,
  onCheckedChange,
  id,
  label
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
  label?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Toggle change: ${e.target.checked}`);
    onCheckedChange(e.target.checked);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="relative inline-block w-10 h-5 rounded-full cursor-pointer">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          className="sr-only"
        />
        <span 
          className={`block w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-primary' : 'bg-gray-200'}`}
        />
        <span 
          className={`absolute left-0.5 top-0.5 block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </div>
      {label && <Label htmlFor={id}>{label}</Label>}
    </div>
  );
};

// Custom notification function to replace toast
const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Could add a simple UI notification here in the future
};

// Simple select component to replace Radix UI Select
const SimpleSelect = ({
  value,
  onValueChange,
  options,
  id,
  placeholder = "Select option"
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  id?: string;
  placeholder?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange(e.target.value);
  };
  
  return (
    <select
      id={id}
      value={value}
      onChange={handleChange}
      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Main component
const FabricTemplateEditor = React.forwardRef(({
  templateId,
  initialName = '',
  initialElements = [],
  initialPlaceholders = [],
  onNameChange
}: FabricTemplateEditorProps, ref: any) => {
  const router = useRouter();
  const [templateName, setTemplateName] = useState(initialName);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("elements");
  const [showFallbackUI, setShowFallbackUI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [elementToDelete, setElementToDelete] = useState<any>(null);
  const [placeholders, setPlaceholders] = useState<Placeholder[]>(COMMON_PLACEHOLDERS);
  const [debugPanelExpanded, setDebugPanelExpanded] = useState(false);
  
  // References
  const fabricCanvas = useRef<any>(null);
  const fabricLib = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasInitializedRef = useRef<boolean>(false);
  
  // Functions to set fabric references
  const setFabricCanvas = (canvas: any) => {
    fabricCanvas.current = canvas;
  };
  
  const setFabricLib = (lib: any) => {
    fabricLib.current = lib;
  };

  // Add debug log with timestamp
  const addDebugLog = (message: string) => {
    setDebugInfo(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 99)]);
    console.log("[TemplateEditor]", message);
  };

  // Element manipulation functions
  const bringElementForward = () => {
    if (!fabricCanvas.current || !selectedElement) return;
    fabricCanvas.current.bringForward(selectedElement);
    safeRenderAll(fabricCanvas.current);
  };

  const sendElementBackward = () => {
    if (!fabricCanvas.current || !selectedElement) return;
    fabricCanvas.current.sendBackward(selectedElement);
    safeRenderAll(fabricCanvas.current);
  };

  const deleteSelectedElement = () => {
    if (!fabricCanvas.current || !selectedElement) return;
    fabricCanvas.current.remove(selectedElement);
    setSelectedElement(null);
    safeRenderAll(fabricCanvas.current);
  };

  const duplicateSelectedElement = () => {
    if (!fabricCanvas.current || !selectedElement || !fabricLib.current) return;
    
    selectedElement.clone((cloned: any) => {
      fabricCanvas.current.discardActiveObject();
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
        evented: true,
      });
      
      fabricCanvas.current.add(cloned);
      fabricCanvas.current.setActiveObject(cloned);
      safeRenderAll(fabricCanvas.current);
    });
  };

  // Handle zoom change
  const handleZoomChange = useCallback((value: number) => {
    if (!fabricCanvas.current) return;
    
    // Prevent unnecessary updates
    if (zoomLevel === value) return;
    
    try {
      // Update the canvas zoom directly
      const zoom = value / 100;
      fabricCanvas.current.setZoom(zoom);
      fabricCanvas.current.requestRenderAll();
      
      // Update the React state after canvas update
      setZoomLevel(value);
    } catch (err) {
      console.error("Error changing zoom:", err);
      addDebugLog(`Zoom error: ${err.message}`);
    }
  }, [zoomLevel, fabricCanvas, addDebugLog]);

  // Handle object selection
  const handleObjectSelected = (e: any) => {
    if (e.selected && e.selected.length > 0) {
      setSelectedElement(e.selected[0]);
      addDebugLog(`Selected element: ${e.selected[0].type}`);
    } else {
      setSelectedElement(null);
    }
  };

  // Handle canvas ready event
  const handleCanvasReady = (canvas: any, fabric: any) => {
    addDebugLog("handleCanvasReady called");
    console.log('[CanvasReady] fabricCanvas.current:', canvas, 'id:', canvas?.lowerCanvasEl?.id);
    // Prevent multiple initializations
    if (canvasInitializedRef.current) {
      addDebugLog("Canvas already initialized - ignoring duplicate ready event");
      return;
    }
    
    if (!canvas || !fabric) {
      addDebugLog("Invalid canvas or fabric instance received");
      setError("Canvas initialization failed: Invalid parameters");
      setShowFallbackUI(true);
      return;
    }
    
    addDebugLog("Setting canvas and fabric references");
    
    // Patch event handlers to be more robust
    const originalOn = canvas.on;
    canvas.on = function(eventName: string, handler: Function) {
      try {
        return originalOn.call(this, eventName, (...args: any[]) => {
          try {
            return handler(...args);
          } catch (err) {
            console.error(`Error in event handler for ${eventName}:`, err);
            addDebugLog(`Event handler error: ${err.message}`);
            return undefined;
          }
        });
      } catch (err) {
        console.error(`Error setting up event listener for ${eventName}:`, err);
        addDebugLog(`Event setup error: ${err.message}`);
        return this;
      }
    };
    
    setFabricCanvas(canvas);
    setFabricLib(fabric);
    setLoading(false);
    
    try {
      // Set initialized flag before any operations that might cause re-renders
      canvasInitializedRef.current = true;
      
      // Validate the fabric instance
      if (!fabric || typeof fabric.Text !== 'function') {
        throw new Error("Invalid fabric instance - Text constructor not available");
      }
      
      // Check if canvas is valid
      if (!isCanvasValid(canvas)) {
        throw new Error("Canvas context is not available");
      }
      
      // Setup event listeners with error handling
      try {
        canvas.on('selection:created', handleObjectSelected);
        canvas.on('selection:updated', handleObjectSelected);
        canvas.on('selection:cleared', () => setSelectedElement(null));
        
        // Add a custom handler for context lost
        canvas.on('contextlost', () => {
          addDebugLog("Canvas context lost");
          setError("Canvas rendering context was lost. Please try again.");
        });
        
        // Add a handler for object added - to ensure visibility
        canvas.on('object:added', (e: any) => {
          if (e.target) {
            e.target.set({
              visible: true,
              opacity: 1,
              dirty: true
            });
            addDebugLog(`Object added and visibility enforced: ${e.target.type}`);
          }
        });
      } catch (eventErr) {
        addDebugLog(`Error setting up event listeners: ${eventErr.message}`);
      }
      
      // Load existing elements if available
      if (initialElements && initialElements.length > 0 && Array.isArray(initialElements)) {
        try {
          addDebugLog("Loading initial elements");
          // If initialElements is a JSON string, parse it
          if (typeof initialElements === 'string') {
            try {
              canvas.loadFromJSON(initialElements, () => {
                addDebugLog("JSON elements loaded");
                safeRenderAll(canvas);
                // Use our new refresh method
                if (canvas.refreshObjects) {
                  canvas.refreshObjects();
                }
              });
            } catch (parseErr) {
              addDebugLog(`Error parsing JSON elements: ${parseErr.message}`);
            }
          } 
          // If it's already a JSON object
          else if (typeof initialElements === 'object') {
            try {
              canvas.loadFromJSON(initialElements, () => {
                addDebugLog("Object elements loaded");
                safeRenderAll(canvas);
                // Use our new refresh method
                if (canvas.refreshObjects) {
                  canvas.refreshObjects();
                }
              });
            } catch (loadErr) {
              addDebugLog(`Error loading object elements: ${loadErr.message}`);
            }
          }
          addDebugLog("Initial elements loading completed");
        } catch (loadErr: any) {
          addDebugLog(`Error loading elements: ${loadErr.message}`);
          console.error("Error loading initial elements:", loadErr);
        }
      } else {
        // Add welcome text if no elements
        addDebugLog("Creating welcome text");
        try {
          const welcomeText = new fabric.Text('Welcome to Template Editor', {
            left: 50,
            top: 50,
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#333333',
            visible: true,
            opacity: 1
          });
          
          // Add placeholder instructions
          const instructionText = new fabric.Text('Add elements from the panel on the right →', {
            left: 50,
            top: 100,
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#666666',
            visible: true,
            opacity: 1
          });
          
          canvas.add(welcomeText);
          canvas.add(instructionText);
          addDebugLog("Welcome text added");
        } catch (textErr) {
          addDebugLog(`Error adding welcome text: ${textErr.message}`);
        }
      }
      
      // Render the canvas
      try {
        safeRenderAll(canvas);
        // Additional refresh call to ensure visibility
        if (canvas.refreshObjects) {
          canvas.refreshObjects();
        }
        addDebugLog("Canvas rendering completed");
      } catch (renderErr) {
        addDebugLog(`Error rendering canvas: ${renderErr.message}`);
      }
      
      addDebugLog("Canvas initialization completed successfully");
      
      // Show toast after a slight delay to prevent render cycle issues
      setTimeout(() => {
        notify("Canvas initialized successfully!");
      }, 100);
    } catch (err: any) {
      addDebugLog(`Error: ${err.message}`);
      console.error("Error adding elements to canvas:", err);
      setError(`Canvas initialization succeeded but error adding elements: ${err.message}`);
      setShowFallbackUI(true);
    }
  };

  // Debug effect to check when component is unmounting
  useEffect(() => {
    addDebugLog("Template editor component mounted");
    return () => {
      addDebugLog("Template editor component unmounting");
    };
  }, []);

  const handleCanvasError = (err: Error) => {
    console.error("Canvas error:", err);
    addDebugLog(`Canvas error: ${err.message}`);
    setError(err.message);
    setShowFallbackUI(true);
  };

  const handleSaveTemplate = async () => {
    try {
      if (!templateName) {
        notify("Please enter a template name");
        return;
      }
      
      if (!fabricCanvas.current) {
        notify("Canvas is not ready");
        return;
      }
      
      // Check if canvas is valid
      if (!isCanvasValid(fabricCanvas.current)) {
        notify("Canvas context is not available");
        return;
      }
      
      // Show saving toast
      const saveToast = notify("Saving template...");
      
      // Convert canvas to JSON
      const canvasJSON = fabricCanvas.current.toJSON(['data']);
      
      // Extract placeholders from canvas elements
      const usedPlaceholders = extractPlaceholdersFromCanvas();
      
      // Determine if we need to create or update
      const method = templateId ? 'PUT' : 'POST';
      const endpoint = templateId 
        ? `/api/affidavit-templates/${templateId}` 
        : `/api/affidavit-templates`;
        
      // API call - Make sure your API route supports the proper methods
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: templateName,
          elements: canvasJSON,
          placeholders: usedPlaceholders,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save template: ${response.statusText}`);
      }
      
      // Success toast
      notify(`Template ${templateId ? 'updated' : 'created'} successfully!`, 'success');
      
      // Navigate after a brief delay to ensure toast is visible
      setTimeout(() => {
        router.push('/affidavit-templates');
      }, 1000);
    } catch (err: any) {
      console.error("Error saving template:", err);
      notify(err.message, 'error');
    }
  };
  
  // Extract placeholders from canvas objects
  const extractPlaceholdersFromCanvas = () => {
    if (!fabricCanvas.current) return [];
    
    const usedPlaceholders: Placeholder[] = [];
    const placeholderIds = new Set<string>();
    
    // Iterate through all canvas objects
    fabricCanvas.current.getObjects().forEach((obj: any) => {
      if (obj.data && obj.data.isPlaceholder && obj.data.placeholderId) {
        if (!placeholderIds.has(obj.data.placeholderId)) {
          placeholderIds.add(obj.data.placeholderId);
          
          // Find the placeholder definition
          const placeholderDef = placeholders.find(p => p.id === obj.data.placeholderId);
          if (placeholderDef) {
            usedPlaceholders.push(placeholderDef);
          }
        }
      }
    });
    
    return usedPlaceholders;
  };
  
  // Export template as PDF
  const handleExportAsPDF = () => {
    if (!fabricCanvas.current) {
      notify("Canvas is not ready");
      return;
    }
    
    notify("Exporting as PDF - this feature will be implemented soon");
    
    // Real implementation would use a library like jspdf or handle this server-side
  };
  
  // Export template as PNG
  const handleExportAsPNG = () => {
    if (!fabricCanvas.current) {
      notify("Canvas is not ready");
      return;
    }
    
    try {
      // Convert canvas to dataURL
      const dataURL = fabricCanvas.current.toDataURL({
        format: 'png',
        quality: 1.0
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${templateName || 'template'}.png`;
      link.href = dataURL;
      link.click();
      
      notify("Template exported as PNG");
    } catch (err: any) {
      console.error("Error exporting as PNG:", err);
      notify(err.message, 'error');
    }
  };

  // Add placeholder to template
  const addPlaceholderToCanvas = (placeholder: Placeholder) => {
    if (!fabricCanvas.current || !fabricLib.current) {
      notify("Canvas is not ready");
      return;
    }
    
    try {
      // Check if canvas is valid before using it
      if (!isCanvasValid(fabricCanvas.current)) {
        notify("Canvas context is not available");
        return;
      }
      
      // Clear any existing selection
      fabricCanvas.current.discardActiveObject();
      
      // Create placeholder with enhanced visibility
      const placeholderText = new fabricLib.current.Textbox(`{{${placeholder.name}}}`, {
        left: 50 + Math.random() * 150,
        top: 50 + Math.random() * 150,
        width: 200,
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: 'bold',
        fill: '#0066cc',
        backgroundColor: '#e6f7ff',
        padding: 8,
        borderColor: '#0066cc',
        strokeWidth: 1,
        stroke: '#0066cc',
        selectable: true,
        evented: true,
        visible: true,
        opacity: 1,
        data: {
          isPlaceholder: true,
          placeholderId: placeholder.id,
          placeholderType: placeholder.type
        }
      });
      
      // Add the placeholder
      fabricCanvas.current.add(placeholderText);
      
      // Make it the active object
      fabricCanvas.current.setActiveObject(placeholderText);
      
      // Force multiple renders to ensure visibility
      safeRenderAll(fabricCanvas.current);
      
      // Add a second render after a short delay
      setTimeout(() => {
        if (fabricCanvas.current) {
          safeRenderAll(fabricCanvas.current);
        }
      }, 100);
      
      // Show success message
      notify(`Added ${placeholder.name} placeholder`);
    } catch (err: any) {
      console.error("Error adding placeholder:", err);
      notify(`Failed to add placeholder: ${err.message}`, 'error');
    }
  };

  // Improved canvas validation
  const isCanvasValid = (canvas: any): boolean => {
    if (!canvas) return false;
    
    try {
      // Check if the canvas element and context exist
      return canvas.getContext() !== null && canvas.contextContainer !== null;
    } catch (e) {
      return false;
    }
  };
  
  // Debug function - add more detailed logs about objects
  const logCanvasObjects = (canvas: any) => {
    if (!canvas || !canvas.getObjects) return;
    
    try {
      const objects = canvas.getObjects();
      addDebugLog(`Canvas has ${objects.length} objects`);
      
      // Log details of each object
      objects.forEach((obj: any, index: number) => {
        addDebugLog(`Object ${index}: ${obj.type} - visible: ${obj.visible}, opacity: ${obj.opacity}, width: ${obj.width}, height: ${obj.height}, left: ${obj.left}, top: ${obj.top}`);
      });
      
      // Try to check if canvas is actually rendering
      if (canvas.lowerCanvasEl) {
        const ctx = canvas.lowerCanvasEl.getContext('2d');
        if (ctx) {
          // Get a few pixel samples to see if anything's drawn
          try {
            const midX = canvas.width / 2;
            const midY = canvas.height / 2;
            const sample = ctx.getImageData(midX, midY, 1, 1);
            const hasContent = !(sample.data[0] === 255 && sample.data[1] === 255 && sample.data[2] === 255);
            addDebugLog(`Canvas content check: ${hasContent ? 'HAS CONTENT' : 'APPEARS EMPTY'}`);
          } catch (err) {
            addDebugLog(`Error checking canvas pixels: ${err}`);
          }
        } else {
          addDebugLog('Canvas context is not available');
        }
      }
    } catch (err) {
      addDebugLog(`Error logging objects: ${err}`);
    }
  };

  // Safely render the canvas with more detailed error handling
  const safeRenderAll = (canvas: any) => {
    if (!canvas) return;
    
    try {
      addDebugLog('Attempting to render canvas');
      
      if (isCanvasValid(canvas)) {
        // First render attempt
        if (typeof canvas.requestRenderAll === 'function') {
          canvas.requestRenderAll();
          addDebugLog('Canvas requestRenderAll called');
        } else if (typeof canvas.renderAll === 'function') {
          canvas.renderAll();
          addDebugLog('Canvas renderAll called');
        } else {
          addDebugLog('No render method available');
        }
        
        // Force second render attempt immediately
        if (typeof canvas.renderAll === 'function') {
          canvas.renderAll();
          addDebugLog('Canvas renderAll (second attempt) called');
        }
        
        // Force visibility for all objects
        try {
          const objects = canvas.getObjects();
          objects.forEach((obj: any) => {
            obj.set({
              visible: true,
              opacity: 1,
              dirty: true
            });
          });
          addDebugLog(`Forced visibility for ${objects.length} objects`);
        } catch (err) {
          addDebugLog(`Error forcing visibility: ${err}`);
        }
        
        // Force a third render attempt after a brief delay
        setTimeout(() => {
          try {
            if (isCanvasValid(canvas)) {
              if (typeof canvas.requestRenderAll === 'function') {
                canvas.requestRenderAll();
              } 
              if (typeof canvas.renderAll === 'function') {
                canvas.renderAll();
              }
              addDebugLog('Delayed render completed');
              
              // Log object count after render
              try {
                const objCount = canvas.getObjects().length;
                addDebugLog(`Objects after render: ${objCount}`);
                
                // Check if objects are visible
                canvas.getObjects().forEach((obj: any, idx: number) => {
                  addDebugLog(`Object ${idx} (${obj.type}): visible=${obj.visible}, opacity=${obj.opacity}`);
                });
              } catch (err) {
                addDebugLog(`Error counting objects: ${err}`);
              }
            }
          } catch (err) {
            addDebugLog(`Error in delayed render: ${err}`);
          }
        }, 100);
      } else {
        addDebugLog('Canvas is not valid for rendering');
      }
    } catch (err) {
      addDebugLog(`Error in safeRenderAll: ${err}`);
    }
  };

  // Update handleAddText function to make background fully transparent
  const handleAddText = () => {
    console.log('[Add Text] Handler called');
    console.log('[Add Text] fabricCanvas.current:', fabricCanvas.current, 'id:', fabricCanvas.current?.lowerCanvasEl?.id);
    if (!fabricCanvas.current || !fabricLib.current) {
      console.log('[Add Text] Canvas or fabricLib not ready', { canvas: fabricCanvas.current, fabric: fabricLib.current });
      notify("Canvas is not ready");
      return;
    }
    try {
      addDebugLog('Creating text element');
      const text = new fabricLib.current.Textbox('New Text', {
        left: 50 + Math.random() * 200,
        top: 50 + Math.random() * 200,
        width: 200,
        fontSize: 24,
        fill: '#555555', // Grey text color
        fontFamily: 'Arial',
        fontWeight: 'normal',
        backgroundColor: 'rgba(255, 255, 255, 0)', // Completely transparent background
        opacity: 0.9, // Slightly transparent
        stroke: 'rgba(200, 200, 200, 0.5)',
        strokeWidth: 0.5,
        borderColor: '#cccccc',
        cornerColor: '#5555ff',
        cornerSize: 8,
        transparentCorners: false,
        padding: 10,
        visible: true,
        selectable: true,
        evented: true
      });
      addDebugLog(`[Add Text] Text created: ${text.text} at (${text.left},${text.top})`);
      fabricCanvas.current.discardActiveObject();
      fabricCanvas.current.add(text);
      fabricCanvas.current.setActiveObject(text);
      const objCount = fabricCanvas.current.getObjects().length;
      addDebugLog(`[Add Text] Canvas now has ${objCount} objects`);
      addDebugLog('[Add Text] Running safeRenderAll');
      safeRenderAll(fabricCanvas.current);
      
      // Use the refreshObjects method for maximum visibility
      if (fabricCanvas.current.refreshObjects) {
        fabricCanvas.current.refreshObjects();
      }
      
      // Force both renderAll and requestRenderAll
      if (fabricCanvas.current.requestRenderAll) fabricCanvas.current.requestRenderAll();
      if (fabricCanvas.current.renderAll) fabricCanvas.current.renderAll();
      
      setTimeout(() => {
        try {
          logCanvasObjects(fabricCanvas.current);
          const objs = fabricCanvas.current.getObjects();
          console.log('[Add Text] Objects on canvas:', objs.map((o: any, i: number) => ({ i, type: o.type, id: o.id })));
          
          // Refresh canvas again after delay to ensure visibility
          if (fabricCanvas.current.refreshObjects) {
            fabricCanvas.current.refreshObjects();
          }
        } catch (err) {
          addDebugLog(`[Add Text] Error in delayed check: ${String(err)}`);
        }
      }, 300);
      
      addDebugLog('[Add Text] Added text element');
      console.log('[Add Text] Element added to canvas');
    } catch (err) {
      addDebugLog(`[Add Text] Error adding text: ${String(err)}`);
      notify(`Failed to add text: ${String(err)}`, 'error');
    }
  };

  // Update handleAddRectangle function for transparent styling
  const handleAddRectangle = () => {
    if (!fabricCanvas.current || !fabricLib.current) {
      notify("Canvas is not ready");
      return;
    }
    
    try {
      addDebugLog('Creating rectangle element');
      
      // Create rectangle with semi-transparent properties
      const rect = new fabricLib.current.Rect({
        left: 50 + Math.random() * 200,
        top: 50 + Math.random() * 200,
        width: 100,
        height: 100,
        fill: 'rgba(66, 135, 245, 0.5)', // Semi-transparent blue
        stroke: 'rgba(0, 0, 0, 0.3)',
        strokeWidth: 1,
        rx: 0,
        ry: 0,
        visible: true,
        opacity: 0.8,
        paintFirst: 'fill',
        borderColor: '#9999ff',
        cornerColor: '#5555ff',
        cornerSize: 8,
        transparentCorners: false
      });
      
      addDebugLog(`Rectangle created at (${rect.left},${rect.top})`);
      
      // Ensure object is set to be visible
      rect.set({
        visible: true,
        selectable: true,
        evented: true
      });
      
      fabricCanvas.current.discardActiveObject();
      fabricCanvas.current.add(rect);
      fabricCanvas.current.setActiveObject(rect);
      
      // Log canvas status
      const objCount = fabricCanvas.current.getObjects().length;
      addDebugLog(`Canvas now has ${objCount} objects`);
      
      addDebugLog('Running safeRenderAll');
      safeRenderAll(fabricCanvas.current);
      
      // Add a delayed check
      setTimeout(() => {
        try {
          logCanvasObjects(fabricCanvas.current);
        } catch (err) {
          addDebugLog(`Error in delayed check: ${String(err)}`);
        }
      }, 300);
      
      addDebugLog('[TemplateEditor] Added rectangle element');
    } catch (err) {
      addDebugLog(`Error adding rectangle: ${String(err)}`);
      notify(`Failed to add rectangle: ${String(err)}`, 'error');
    }
  };

  // Create a new custom placeholder
  const createCustomPlaceholder = (name: string, type: string = 'text') => {
    if (!name) return;
    
    const newPlaceholder: Placeholder = {
      id: `custom_${uuidv4()}`,
      name,
      type: type as any,
      description: 'Custom placeholder'
    };
    
    setPlaceholders(prev => [...prev, newPlaceholder]);
    addPlaceholderToCanvas(newPlaceholder);
  };

  // Update properties of selected element
  const updateSelectedElementProperty = useCallback((property: string, value: any) => {
    if (!fabricCanvas.current || !selectedElement) return;
    
    // Check if the value is actually different to prevent update loops
    if (selectedElement[property] === value) return;
    
    // Update directly on the object without triggering a React state update
    try {
      selectedElement.set(property, value);
      
      // Only render the canvas, don't update React state here
      if (fabricCanvas.current) {
        fabricCanvas.current.requestRenderAll();
      }
    } catch (err) {
      console.error(`Error updating property ${property}:`, err);
      addDebugLog(`Property update error: ${err.message}`);
    }
  }, [selectedElement, fabricCanvas, addDebugLog]);

  // Setup global error handler for fabric.js errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Only capture fabric.js errors
      if (event.message && event.message.includes('fabric.js')) {
        console.error('Fabric.js error caught:', event.message);
        event.preventDefault(); // Prevent default error handling
        addDebugLog(`Fabric.js error: ${event.message}`);
      }
    };
    
    // Add global error handler
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Fallback UI if fabric.js fails to initialize properly
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Canvas Initialization Error</h2>
          <p className="text-yellow-700">{error}</p>
          <div className="mt-4 flex space-x-3">
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button variant="outline" onClick={() => router.push('/affidavit-templates')}>
              Back to Templates
            </Button>
          </div>
        </div>
        <div className="p-8 border rounded-md bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-500 mb-4">Unable to initialize template editor.</p>
            <p className="text-gray-400">Try refreshing the page or using a different browser.</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Add additional check to force refresh the canvas periodically
    if (fabricCanvas.current) {
      const refreshInterval = setInterval(() => {
        try {
          // Check if there are objects on the canvas
          const objects = fabricCanvas.current.getObjects();
          addDebugLog(`Refresh check: Canvas has ${objects.length} objects`);
          
          // Force render to ensure they're visible
          safeRenderAll(fabricCanvas.current);
        } catch (err) {
          console.error("Error in refresh interval:", err);
        }
      }, 3000); // Check every 3 seconds
      
      return () => {
        clearInterval(refreshInterval);
      };
    }
  }, [fabricCanvas]);

  // Add state for canvas size and background color
  const [canvasWidth, setCanvasWidth] = useState(A4_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(A4_HEIGHT);
  const [canvasBg, setCanvasBg] = useState("#ffffff");

  // Update the name change handler to call the parent's callback
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setTemplateName(newName);
    if (onNameChange) {
      onNameChange(newName);
    }
  };
  
  // Add a method to get current canvas elements for the parent component
  const getCanvasElements = () => {
    // Extract elements from canvas if it's available
    if (canvasRef.current) {
      try {
        const canvas = canvasRef.current;
        return canvas.getObjects().map((obj: any) => {
          // Format objects as needed
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
    }
    
    // Fall back to the internal elements state
    return initialElements;
  };
  
  // Helper function to determine element type
  const getObjectType = (obj: any): string => {
    if (obj.type === 'textbox' || obj.type === 'text') return 'text';
    if (obj.type === 'image') return 'image';
    if (obj.type === 'line') return 'line';
    if (obj.type === 'rect') return 'rectangle';
    if (obj.type === 'circle') return 'circle';
    if (obj.placeholder) return 'placeholder';
    return obj.type || 'text';
  };
  
  // Helper function to serialize a fabric object
  const serializeObject = (obj: any): any => {
    // Basic serialization - extend as needed
    const data = obj.toObject();
    
    // Add any custom properties
    if (obj.placeholder) {
      data.placeholder = obj.placeholder;
    }
    
    return data;
  };
  
  // Expose methods to parent component via ref
  React.useImperativeHandle(ref, () => ({
    getCanvasElements,
    getTemplateName: () => templateName,
    setTemplateName: (name: string) => {
      setTemplateName(name);
      if (onNameChange) {
        onNameChange(name);
      }
    }
  }));

  // Handle Grid Toggle - Direct approach
  const handleGridToggle = (checked: boolean) => {
    console.log(`GRID TOGGLE: Explicit change from ${showGrid} to ${checked}`);
    setShowGrid(checked);
    
    // Force canvas update in 100ms (after state updates)
    setTimeout(() => {
      console.log(`GRID TOGGLE: Directly applying grid=${checked} to canvas`);
      if (fabricCanvas.current) {
        // Find any existing grid and toggle it
        if (fabricCanvas.current.getObjects) {
          const objects = fabricCanvas.current.getObjects();
          
          // Force render
          fabricCanvas.current.requestRenderAll();
          fabricCanvas.current.renderAll();
        }
      }
    }, 100);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        {/* Header with actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Label className="text-sm font-medium text-gray-700">Template Name:</Label>
              <Input 
                value={templateName} 
                onChange={handleNameChange} 
                className="max-w-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter template name..."
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleSaveTemplate}
                className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportAsPDF}
                className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportAsPNG}
                className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PNG
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {/* Dimensions */}
            <div className="flex items-center space-x-4">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Width:</Label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={canvasWidth}
                    min={100}
                    max={2000}
                    onChange={e => setCanvasWidth(Number(e.target.value))}
                    className="w-20 h-9 text-sm"
                  />
                  <span className="ml-1 text-xs text-gray-500">px</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Height:</Label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={canvasHeight}
                    min={100}
                    max={3000}
                    onChange={e => setCanvasHeight(Number(e.target.value))}
                    className="w-20 h-9 text-sm"
                  />
                  <span className="ml-1 text-xs text-gray-500">px</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Background:</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={canvasBg}
                    onChange={e => setCanvasBg(e.target.value)}
                    className="w-9 h-9 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={canvasBg}
                    onChange={e => setCanvasBg(e.target.value)}
                    className="w-20 h-9 text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Zoom and grid controls */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Label className="text-sm font-medium text-gray-700">Zoom:</Label>
                <div className="flex items-center space-x-2">
                  <SimpleSlider
                    value={zoomLevel}
                    min={25}
                    max={200}
                    step={5}
                    className="w-28"
                    id="zoom-slider"
                    onChange={handleZoomChange}
                  />
                  <span className="text-sm font-medium text-gray-700 w-12 text-center">{zoomLevel}%</span>
                </div>
              </div>
              
              <div className="h-8 border-r border-gray-300"></div>
              
              <button 
                onClick={() => handleGridToggle(!showGrid)}
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  showGrid 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid className={`w-4 h-4 mr-1.5 ${showGrid ? 'text-blue-500' : 'text-gray-500'}`} />
                Grid {showGrid ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              <div className="font-medium">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          )}
        </div>

        {/* Main editor area */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Canvas</span>
                <div className="text-xs text-gray-500">
                  {canvasWidth}×{canvasHeight}px
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 flex justify-center items-center overflow-auto max-h-[calc(100vh-280px)]">
                <div 
                  style={{ 
                    transform: `scale(${zoomLevel / 100})`, 
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}
                >
                  <SimpleCanvas 
                    width={canvasWidth}
                    height={canvasHeight}
                    onReady={handleCanvasReady}
                    background={canvasBg}
                    showGrid={showGrid}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-3">
            <Tabs defaultValue="elements" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 bg-gray-100 rounded-t-lg border border-gray-200 border-b-0 overflow-hidden">
                <TabsTrigger value="elements">Elements</TabsTrigger>
                <TabsTrigger value="placeholders">Placeholders</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
              </TabsList>
              
              <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm p-4">
                <TabsContent value="elements" className="mt-0">
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white hover:bg-gray-50 border-gray-300" 
                      onClick={handleAddText}
                    >
                      <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-blue-100 text-blue-700 rounded-sm text-xs font-bold">T</span>
                      Add Text
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white hover:bg-gray-50 border-gray-300" 
                      onClick={handleAddRectangle}
                    >
                      <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-green-100 text-green-700 rounded-sm">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </span>
                      Add Rectangle
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white hover:bg-gray-50 border-gray-300" 
                      onClick={() => {
                        console.log('[Add Circle] Handler called');
                        console.log('[Add Circle] fabricCanvas.current:', fabricCanvas.current, 'id:', fabricCanvas.current?.lowerCanvasEl?.id);
                        if (fabricCanvas.current && fabricLib.current) {
                          try {
                            const circle = new fabricLib.current.Circle({
                              left: 50 + Math.random() * 200,
                              top: 50 + Math.random() * 200,
                              radius: 40,
                              fill: 'rgba(255, 0, 0, 0.4)', // Semi-transparent red
                              stroke: 'rgba(0, 0, 0, 0.3)',
                              strokeWidth: 2,
                              selectable: true,
                              evented: true,
                              visible: true,
                              opacity: 0.9,
                              cornerColor: '#5555ff',
                              cornerSize: 8,
                              transparentCorners: false,
                              borderColor: '#9999ff',
                              padding: 5
                            });
                            fabricCanvas.current.discardActiveObject();
                            fabricCanvas.current.add(circle);
                            fabricCanvas.current.setActiveObject(circle);
                            safeRenderAll(fabricCanvas.current);
                            // Force both renderAll and requestRenderAll
                            if (fabricCanvas.current.requestRenderAll) fabricCanvas.current.requestRenderAll();
                            if (fabricCanvas.current.renderAll) fabricCanvas.current.renderAll();
                            addDebugLog("[Add Circle] Added circle element");
                            notify("Circle added to canvas");
                            const objs = fabricCanvas.current.getObjects();
                            console.log('[Add Circle] Objects on canvas:', objs.map((o: any, i: number) => ({ i, type: o.type, id: o.id })));
                            console.log('[Add Circle] Element added to canvas');
                          } catch (err) {
                            console.error("[Add Circle] Error adding circle:", err);
                            addDebugLog(`[Add Circle] Error adding circle: ${String(err)}`);
                            notify(`Failed to add circle: ${String(err)}`, 'error');
                          }
                        } else {
                          console.log('[Add Circle] Canvas or fabricLib not ready', { canvas: fabricCanvas.current, fabric: fabricLib.current });
                          notify("Canvas is not ready");
                        }
                      }}
                    >
                      <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-purple-100 text-purple-700 rounded-sm">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </span>
                      Add Circle
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white hover:bg-gray-50 border-gray-300" 
                      onClick={() => {
                        if (fabricCanvas.current && fabricLib.current) {
                          try {
                            // Add line with enhanced visibility and transparency
                            const line = new fabricLib.current.Line([50, 50, 200, 50], {
                              left: 50 + Math.random() * 200,
                              top: 50 + Math.random() * 200,
                              stroke: 'rgba(255, 0, 0, 0.6)',
                              strokeWidth: 3,
                              strokeDashArray: [5, 5],
                              selectable: true,
                              evented: true,
                              visible: true,
                              opacity: 0.9,
                              borderColor: '#9999ff',
                              cornerColor: '#5555ff',
                              cornerSize: 8,
                              transparentCorners: false,
                              padding: 5
                            });
                            
                            // Clear selection
                            fabricCanvas.current.discardActiveObject();
                            
                            // Add and setup
                            fabricCanvas.current.add(line);
                            fabricCanvas.current.setActiveObject(line);
                            
                            // Force multiple renders to ensure visibility
                            safeRenderAll(fabricCanvas.current);
                            fabricCanvas.current.requestRenderAll();
                            fabricCanvas.current.renderAll();
                            
                            // Log
                            addDebugLog("Added line element");
                            
                            // Feedback
                            notify("Line added to canvas");
                          } catch (err) {
                            console.error("Error adding line:", err);
                            addDebugLog(`Error adding line: ${String(err)}`);
                            notify(`Failed to add line: ${String(err)}`, 'error');
                          }
                        } else {
                          notify("Canvas is not ready");
                        }
                      }}
                    >
                      <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-yellow-100 text-yellow-700 rounded-sm">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="2" y1="7.5" x2="13" y2="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </span>
                      Add Line
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white hover:bg-gray-50 border-gray-300" 
                      onClick={() => {
                        // Image would normally be uploaded or chosen from library
                        notify("Image upload functionality to be implemented");
                      }}
                    >
                      <span className="w-5 h-5 mr-2 inline-flex items-center justify-center bg-pink-100 text-pink-700 rounded-sm">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="5" cy="5" r="1.5" fill="currentColor"/>
                          <path d="M4 9L6 7L8 9L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      Add Image
                    </Button>
                  </div>
                  
                  {selectedElement && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-semibold mb-2 text-gray-700">Element Actions</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={bringElementForward} className="bg-white">
                          <ChevronUp className="h-3.5 w-3.5 mr-1" />
                          Forward
                        </Button>
                        <Button size="sm" variant="outline" onClick={sendElementBackward} className="bg-white">
                          <ChevronDown className="h-3.5 w-3.5 mr-1" />
                          Backward
                        </Button>
                        <Button size="sm" variant="outline" onClick={duplicateSelectedElement} className="bg-white">
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Duplicate
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => {
                            setElementToDelete(selectedElement);
                            setShowConfirmDelete(true);
                          }}
                          className="bg-red-50 border-red-200 hover:bg-red-100 text-red-600"
                        >
                          <Trash className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="placeholders" className="mt-0">
                  <p className="text-sm text-gray-600 mb-4">
                    Add placeholders to your template. These will be filled with real data when creating an affidavit.
                  </p>
                  
                  <div className="max-h-[300px] overflow-y-auto pr-2">
                    {placeholders.map((placeholder) => (
                      <div 
                        key={placeholder.id} 
                        className="p-2 mb-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => addPlaceholderToCanvas(placeholder)}
                      >
                        <div className="font-medium">{placeholder.name}</div>
                        {placeholder.description && (
                          <div className="text-xs text-gray-500">{placeholder.description}</div>
                        )}
                        <div className="text-xs text-gray-400">Type: {placeholder.type}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold mb-2">Add Custom Placeholder</h3>
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder="Placeholder name" 
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            createCustomPlaceholder((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Placeholder name"]') as HTMLInputElement;
                          if (input && input.value) {
                            createCustomPlaceholder(input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="properties" className="mt-0">
                  {selectedElement ? (
                    <div className="space-y-4">
                      {selectedElement.type === 'textbox' || selectedElement.type === 'text' ? (
                        <>
                          <div>
                            <Label htmlFor="text-content" className="text-sm font-medium text-gray-700 block mb-1">Text Content</Label>
                            <Input
                              id="text-content"
                              value={selectedElement.text || ''}
                              onChange={(e) => updateSelectedElementProperty('text', e.target.value)}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="font-family" className="text-sm font-medium text-gray-700 block mb-1">Font Family</Label>
                            <select
                              id="font-family"
                              value={selectedElement.fontFamily || 'Arial'}
                              onChange={(e) => updateSelectedElementProperty('fontFamily', e.target.value)}
                              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                            >
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Courier New">Courier New</option>
                              <option value="Georgia">Georgia</option>
                              <option value="Verdana">Verdana</option>
                            </select>
                          </div>
                          
                          <div>
                            <Label htmlFor="font-size" className="text-sm font-medium text-gray-700 block mb-1">Font Size</Label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="range"
                                id="font-size"
                                value={selectedElement ? (selectedElement.fontSize || 16) : 16}
                                min={8}
                                max={72}
                                step={1}
                                onChange={(e) => updateSelectedElementProperty('fontSize', Number(e.target.value))}
                                className="flex-1 h-4 appearance-none bg-gray-200 rounded-md cursor-pointer"
                              />
                              <span className="w-10 text-center">{selectedElement?.fontSize || 16}</span>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="text-color" className="text-sm font-medium text-gray-700 block mb-1">Text Color</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="text-color"
                                type="color"
                                value={selectedElement.fill || '#000000'}
                                onChange={(e) => updateSelectedElementProperty('fill', e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={selectedElement.fill || '#000000'}
                                onChange={(e) => updateSelectedElementProperty('fill', e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="text-bgcolor" className="text-sm font-medium text-gray-700 block mb-1">Background Color</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="text-bgcolor"
                                type="color"
                                value={selectedElement.backgroundColor || 'transparent'}
                                onChange={(e) => updateSelectedElementProperty('backgroundColor', e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={selectedElement.backgroundColor || 'transparent'}
                                onChange={(e) => updateSelectedElementProperty('backgroundColor', e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="opacity" className="text-sm font-medium text-gray-700 block mb-1">Opacity ({Math.round((selectedElement.opacity || 1) * 100)}%)</Label>
                            <input
                              type="range"
                              id="opacity"
                              value={(selectedElement.opacity || 1) * 100}
                              min={10}
                              max={100}
                              step={5}
                              onChange={(e) => updateSelectedElementProperty('opacity', Number(e.target.value) / 100)}
                              className="w-full h-4 appearance-none bg-gray-200 rounded-md cursor-pointer"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="shape-fill" className="text-sm font-medium text-gray-700 block mb-1">Fill Color</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="shape-fill"
                                type="color"
                                value={selectedElement.fill || '#f0f0f0'}
                                onChange={(e) => updateSelectedElementProperty('fill', e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={selectedElement.fill || '#f0f0f0'}
                                onChange={(e) => updateSelectedElementProperty('fill', e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="stroke-color" className="text-sm font-medium text-gray-700 block mb-1">Border Color</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="stroke-color"
                                type="color"
                                value={selectedElement.stroke || '#000000'}
                                onChange={(e) => updateSelectedElementProperty('stroke', e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={selectedElement.stroke || '#000000'}
                                onChange={(e) => updateSelectedElementProperty('stroke', e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="stroke-width" className="text-sm font-medium text-gray-700 block mb-1">Border Width</Label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="range"
                                id="stroke-width"
                                value={selectedElement.strokeWidth || 1}
                                min={0}
                                max={20}
                                step={1}
                                onChange={(e) => updateSelectedElementProperty('strokeWidth', Number(e.target.value))}
                                className="flex-1 h-4 appearance-none bg-gray-200 rounded-md cursor-pointer"
                              />
                              <span className="w-10 text-center">{selectedElement?.strokeWidth || 1}</span>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="opacity" className="text-sm font-medium text-gray-700 block mb-1">Opacity ({Math.round((selectedElement.opacity || 1) * 100)}%)</Label>
                            <input
                              type="range"
                              id="opacity"
                              value={(selectedElement.opacity || 1) * 100}
                              min={10}
                              max={100}
                              step={5}
                              onChange={(e) => updateSelectedElementProperty('opacity', Number(e.target.value) / 100)}
                              className="w-full h-4 appearance-none bg-gray-200 rounded-md cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 block mb-2">Position & Size</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="left-pos" className="text-xs text-gray-500 block mb-1">X Position</Label>
                            <Input
                              id="left-pos"
                              type="number"
                              value={Math.round(selectedElement.left) || 0}
                              onChange={(e) => updateSelectedElementProperty('left', Number(e.target.value))}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="top-pos" className="text-xs text-gray-500 block mb-1">Y Position</Label>
                            <Input
                              id="top-pos"
                              type="number"
                              value={Math.round(selectedElement.top) || 0}
                              onChange={(e) => updateSelectedElementProperty('top', Number(e.target.value))}
                              className="text-sm"
                            />
                          </div>
                          
                          {selectedElement.width !== undefined && (
                            <div>
                              <Label htmlFor="width" className="text-xs text-gray-500 block mb-1">Width</Label>
                              <Input
                                id="width"
                                type="number"
                                value={Math.round(selectedElement.width) || 0}
                                onChange={(e) => updateSelectedElementProperty('width', Number(e.target.value))}
                                className="text-sm"
                              />
                            </div>
                          )}
                          
                          {selectedElement.height !== undefined && (
                            <div>
                              <Label htmlFor="height" className="text-xs text-gray-500 block mb-1">Height</Label>
                              <Input
                                id="height"
                                type="number"
                                value={Math.round(selectedElement.height) || 0}
                                onChange={(e) => updateSelectedElementProperty('height', Number(e.target.value))}
                                className="text-sm"
                              />
                            </div>
                          )}
                          
                          {selectedElement.radius !== undefined && (
                            <div>
                              <Label htmlFor="radius" className="text-xs text-gray-500 block mb-1">Radius</Label>
                              <Input
                                id="radius"
                                type="number"
                                value={Math.round(selectedElement.radius) || 0}
                                onChange={(e) => updateSelectedElementProperty('radius', Number(e.target.value))}
                                className="text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="mb-2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm">Select an element to edit its properties</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
            
            {/* Collapsible Debug Panel */}
            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div 
                className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200 cursor-pointer"
                onClick={() => setDebugPanelExpanded(prevState => !prevState)}
              >
                <h2 className="text-sm font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Debug Panel
                </h2>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDebugInfo([]);
                    addDebugLog("Debug log cleared");
                  }}
                >
                  <span className="text-xs">Clear</span>
                </Button>
              </div>
              
              {debugPanelExpanded && (
                <div className="p-2">
                  <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs overflow-auto max-h-40">
                    {debugInfo.map((log, i) => (
                      <div key={i} className="text-xs">{log}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
    
    {/* Confirmation Dialog for Element Deletion */}
    <AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Element</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this element? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteSelectedElement}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
));

// Add a display name for the component
FabricTemplateEditor.displayName = 'FabricTemplateEditor';

export default FabricTemplateEditor; 