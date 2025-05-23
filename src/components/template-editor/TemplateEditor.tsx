'use client';

import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { DndProvider, useDrag, ConnectDragSource, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import DraggableElement from './DraggableElement';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import TemplatePreview from './TemplatePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Export TemplateElement interface - ADDED STYLING AND TYPE-SPECIFIC FIELDS
export interface TemplateElement { 
  id: string;
  type: 'text' | 'image' | 'data' | 'line'; // Added 'line' type
  content: string; // For text content, data field key, image URL, or line direction/style
  x: number;
  y: number;
  width: number; // For line, width might represent length
  height: number; // For line, height might represent thickness
  // Optional Styling Properties
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic'; // Added fontStyle
  textAlign?: 'left' | 'center' | 'right';
  color?: string; // For line, this is the line color
  backgroundColor?: string; // Added background color
  padding?: number; // Added padding (uniform)
  borderWidth?: number; // Added border width
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none'; // Added border style
  borderColor?: string; // Added border color
  zIndex?: number; // Added z-index for layering
  // Optional Type-Specific Properties
  imageUrl?: string; // For image elements
  dataFieldKey?: string; // For data elements (maps to keys in dataForPdf)
  dataFormat?: string; // Added data format (e.g., 'date:MM/DD/YYYY', 'currency')
  // Line specific properties (optional for now, could use width/height/color)
  // lineOrientation?: 'horizontal' | 'vertical';
  // lineThickness?: number;
}

// Define item types for react-dnd
export const ItemTypes = {
  TEMPLATE_ELEMENT: 'templateElement', // For elements being dragged from the sidebar
  CANVAS_ELEMENT: 'canvasElement' // Potentially for elements already on the canvas (if needed for reordering etc.)
};

// --- DraggableSidebarItem Component ---
interface DraggableSidebarItemProps {
  elementType: 'text' | 'image' | 'data' | 'line'; // The type of element this represents
  children: React.ReactNode; // Display content (e.g., "Text Box")
}

const DraggableSidebarItem: React.FC<DraggableSidebarItemProps> = ({ elementType, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TEMPLATE_ELEMENT,
    item: { type: elementType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Cast via unknown as suggested by TS error
  const dragRef = drag as unknown as React.Ref<HTMLDivElement>;

  return (
    <div
      ref={dragRef} // Use the casted ref
      style={{
        padding: '8px 12px',
        marginBottom: '10px',
        border: '1px dashed gray',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: 'white',
      }}
    >
      {children}
    </div>
  );
};
// --- END DraggableSidebarItem Component ---

// Define predefined template sections
const PREDEFINED_SECTIONS = [
  {
    id: 'header',
    name: 'Document Header',
    elements: [
      {
        id: 'header-logo',
        type: 'image',
        content: 'Company Logo',
        x: 40,
        y: 25,
        width: 150,
        height: 100,
      },
      {
        id: 'header-address',
        type: 'text',
        content: '123 Company Street\nCity, State 12345\nPhone: (555) 123-4567\nFax: (555) 123-4568',
        x: 370,
        y: 40,
        width: 200,
        height: 80,
        fontSize: 10,
        textAlign: 'right',
      },
      {
        id: 'header-title',
        type: 'text',
        content: 'AFFIDAVIT OF RECORDS',
        x: 150,
        y: 140,
        width: 300,
        height: 40,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      },
    ]
  },
  {
    id: 'patient-info',
    name: 'Patient Information',
    elements: [
      {
        id: 'patient-info-title',
        type: 'text',
        content: 'PATIENT INFORMATION:',
        x: 50,
        y: 200,
        width: 300,
        height: 30,
        fontSize: 14,
        fontWeight: 'bold',
      },
      {
        id: 'patient-name',
        type: 'data',
        content: 'Patient Name',
        dataFieldKey: 'patientName',
        x: 50,
        y: 240,
        width: 300,
        height: 25,
      },
      {
        id: 'patient-dob',
        type: 'data',
        content: 'Date of Birth',
        dataFieldKey: 'patientDOB',
        x: 50,
        y: 270,
        width: 300,
        height: 25,
      },
      {
        id: 'patient-doi',
        type: 'data',
        content: 'Date of Injury',
        dataFieldKey: 'patientDOI',
        x: 50,
        y: 300,
        width: 300,
        height: 25,
      },
    ]
  },
  {
    id: 'provider-info',
    name: 'Provider Information',
    elements: [
      {
        id: 'provider-info-title',
        type: 'text',
        content: 'PROVIDER INFORMATION:',
        x: 50,
        y: 350,
        width: 300,
        height: 30,
        fontSize: 14,
        fontWeight: 'bold',
      },
      {
        id: 'provider-name',
        type: 'data',
        content: 'Provider Name',
        dataFieldKey: 'providerName',
        x: 50,
        y: 390,
        width: 300,
        height: 25,
      },
      {
        id: 'provider-address',
        type: 'data',
        content: 'Provider Address',
        dataFieldKey: 'providerAddress',
        x: 50,
        y: 420,
        width: 300,
        height: 25,
      },
    ]
  },
  {
    id: 'signature',
    name: 'Signature Section',
    elements: [
      {
        id: 'signature-line',
        type: 'line',
        content: 'Signature Line',
        x: 50,
        y: 700,
        width: 200,
        height: 2,
        color: '#000000',
      },
      {
        id: 'signature-name',
        type: 'text',
        content: 'Signature',
        x: 50,
        y: 710,
        width: 200,
        height: 20,
        fontSize: 10,
      },
      {
        id: 'date-line',
        type: 'line',
        content: 'Date Line',
        x: 350,
        y: 700,
        width: 200,
        height: 2,
        color: '#000000',
      },
      {
        id: 'date-label',
        type: 'text',
        content: 'Date',
        x: 350,
        y: 710,
        width: 200,
        height: 20,
        fontSize: 10,
      },
    ]
  },
];

// --- Update ElementSidebar Component ---
const ElementSidebar = ({ onAddSection }: { onAddSection: (sectionElements: TemplateElement[]) => void }) => {
    return (
        <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px', backgroundColor: '#f8f8f8', overflow: 'auto', height: '100%' }}>
            <h4 className="mb-4 font-medium">Elements</h4>
            <DraggableSidebarItem elementType="text">Text Box</DraggableSidebarItem>
            <DraggableSidebarItem elementType="image">Image</DraggableSidebarItem>
            <DraggableSidebarItem elementType="data">Data Field</DraggableSidebarItem>
            <DraggableSidebarItem elementType="line">Line</DraggableSidebarItem>
            
            <h4 className="mt-8 mb-4 font-medium">Predefined Sections</h4>
            {PREDEFINED_SECTIONS.map((section) => (
                <div 
                    key={section.id}
                    className="p-2 mb-2 border border-gray-300 rounded bg-white cursor-pointer hover:bg-gray-50"
                    onClick={() => onAddSection(section.elements.map(el => ({
                        ...el,
                        id: uuidv4() // Generate new IDs to avoid conflicts
                    })))}
                >
                    {section.name}
                </div>
            ))}
        </div>
    );
}
// --- END Update ElementSidebar Component ---

// --- UPDATED EditingCanvas Component ---
const EditingCanvas = ({ 
  elements,
  onDrop,
  moveElement,
  resizeElement,
  selectElement, // Add selectElement prop
  selectedElementId // Add selectedElementId prop
}: {
  elements: TemplateElement[],
  onDrop: (item: { type: string }, x: number, y: number) => void,
  moveElement: (id: string, x: number, y: number) => void, // Add specific type
  resizeElement: (id: string, width: number, height: number) => void, // Add specific type
  selectElement: (id: string | null) => void, // Allow null for deselection
  selectedElementId: string | null // Add selectedElementId type
}) => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(true);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TEMPLATE_ELEMENT,
    drop: (item: { type: string }, monitor) => {
      console.log("Item dropped:", item);
      console.log("Monitor client offset:", monitor.getClientOffset());
      console.log("Canvas ref:", canvasRef.current);
      
      // Calculate drop position relative to the canvas
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();

      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        console.log("Drop coordinates:", { x, y });
        onDrop(item, x, y); // Pass type and coordinates
      } else {
        console.error("Could not calculate drop coordinates.");
        // Optionally call onDrop with default coordinates or handle error
        onDrop(item, 50, 50); // Fallback coordinates
      }
      // drop function itself doesn't return anything specific here
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [onDrop]);

  // Attach drop ref to the main div AND the canvasRef
  drop(canvasRef);

  const isActive = canDrop && isOver;
  let backgroundColor = '#f0f0f0'; // Default background
  if (isActive) {
    backgroundColor = '#e0ffe0'; // Light green when item is over and can drop
  } else if (canDrop) {
    backgroundColor = '#f0f8ff'; // Light blue when item can drop but isn't over
  }

  // Handle clicking on the canvas itself to deselect
  const handleCanvasClick = () => {
    selectElement(null); // Pass null to indicate deselection
  };

  // Modify the moveElement to snap to grid if snapToGrid is enabled
  const handleElementMove = (id: string, x: number, y: number) => {
    if (snapToGrid) {
      const snappedX = Math.round(x / gridSize) * gridSize;
      const snappedY = Math.round(y / gridSize) * gridSize;
      moveElement(id, snappedX, snappedY);
    } else {
      moveElement(id, x, y);
    }
  };

  // Create a grid pattern in the background
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const gridLines = [];
    const gridWidth = 595; // A4 width in points
    const gridHeight = 842; // A4 height in points
    
    // Vertical lines
    for (let x = 0; x <= gridWidth; x += gridSize) {
      gridLines.push(
        <div 
          key={`v-${x}`} 
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: 0,
            height: '100%',
            width: '1px',
            backgroundColor: 'rgba(200, 200, 200, 0.3)',
            pointerEvents: 'none'
          }}
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= gridHeight; y += gridSize) {
      gridLines.push(
        <div 
          key={`h-${y}`} 
          style={{
            position: 'absolute',
            left: 0,
            top: `${y}px`,
            width: '100%',
            height: '1px', 
            backgroundColor: 'rgba(200, 200, 200, 0.3)',
            pointerEvents: 'none'
          }}
        />
      );
    }
    
    return gridLines;
  };

  // Add rulers for more precise positioning
  const renderRulers = () => {
  return (
      <>
        {/* Horizontal ruler */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '20px',
          backgroundColor: '#f0f0f0',
          borderBottom: '1px solid #ccc',
          display: 'flex',
          overflow: 'hidden'
        }}>
          {Array.from({ length: Math.ceil(595 / 50) }).map((_, i) => (
            <div key={`hr-${i}`} style={{
              width: '50px',
              height: '20px',
              borderRight: '1px solid #888',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '2px',
                left: '2px',
                fontSize: '8px',
                color: '#666'
              }}>{i * 50}</span>
            </div>
          ))}
        </div>

        {/* Vertical ruler */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '20px',
          backgroundColor: '#f0f0f0',
          borderRight: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {Array.from({ length: Math.ceil(842 / 50) }).map((_, i) => (
            <div key={`vr-${i}`} style={{
              height: '50px',
              width: '20px',
              borderBottom: '1px solid #888',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '2px',
                left: '2px',
                fontSize: '8px',
                color: '#666'
              }}>{i * 50}</span>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Grid Controls */}
      <div style={{ 
        position: 'absolute', 
        top: '25px', 
        right: '10px', 
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '5px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <input 
            type="checkbox" 
            checked={showGrid} 
            onChange={() => setShowGrid(!showGrid)} 
            style={{ marginRight: '5px' }}
          />
          Show Grid
        </label>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <input 
            type="checkbox" 
            checked={snapToGrid} 
            onChange={() => setSnapToGrid(!snapToGrid)} 
            style={{ marginRight: '5px' }}
          />
          Snap to Grid
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '5px', fontSize: '12px' }}>Grid Size:</span>
          <select 
            value={gridSize} 
            onChange={(e) => setGridSize(Number(e.target.value))}
            style={{ padding: '2px', fontSize: '12px' }}
          >
            <option value="5">5px</option>
            <option value="10">10px</option>
            <option value="20">20px</option>
            <option value="50">50px</option>
          </select>
        </div>
      </div>

      {/* Canvas with padding for rulers */}
    <div
      ref={canvasRef}
      style={{
        flexGrow: 1,
        borderRight: '1px solid #ccc',
        padding: '10px',
          paddingTop: '30px', // Space for horizontal ruler
          paddingLeft: '30px', // Space for vertical ruler
        position: 'relative',
        minHeight: '600px',
          backgroundColor: isActive ? '#e0ffe0' : (canDrop ? '#f0f8ff' : '#f0f0f0'),
        transition: 'background-color 0.2s ease',
      }}
        onClick={handleCanvasClick}
      >
        {renderGrid()}
        {renderRulers()}
        
        {/* Position indicators for selected element */}
        {selectedElementId && elements.find(el => el.id === selectedElementId) && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 1000
          }}>
            {`X: ${elements.find(el => el.id === selectedElementId)?.x || 0}, Y: ${elements.find(el => el.id === selectedElementId)?.y || 0}`}
          </div>
        )}

      {/* Render Draggable Elements */} 
      {elements.map((element) => (
        <DraggableElement
          key={element.id}
          element={element}
            onMove={handleElementMove} // Use the new grid-aware handler
          onResize={resizeElement}
          onSelect={selectElement}
          isSelected={element.id === selectedElementId}
        />
      ))}
      </div>
    </div>
  );
}
// --- END UPDATED EditingCanvas Component ---

// --- PropertiesPanel Component (IMPLEMENTED CONTROLS) ---
const PropertiesPanel = ({ 
    selectedElement, 
    updateElement, 
    availableDataKeys, // Receive keys as prop
    isLoadingKeys // Receive loading state
}: { 
    selectedElement: TemplateElement | null;
    updateElement: (id: string, updates: Partial<TemplateElement>) => void;
    availableDataKeys: string[]; // Define prop type
    isLoadingKeys: boolean; // Define prop type
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Helper to handle input changes and call updateElement
    const handleChange = (field: keyof TemplateElement, value: any) => {
        if (!selectedElement) return;
        // Basic type conversion
        let processedValue = value;
        // Convert numeric fields properly, providing defaults if parsing fails
        const numericFields: (keyof TemplateElement)[] = ['fontSize', 'padding', 'borderWidth', 'zIndex'];
        if (numericFields.includes(field)) {
            processedValue = parseInt(value, 10);
            if (isNaN(processedValue)) {
                // Assign default values for specific fields if NaN
                if (field === 'fontSize') processedValue = 12;
                else if (field === 'padding') processedValue = 0;
                else if (field === 'borderWidth') processedValue = 0;
                else if (field === 'zIndex') processedValue = 0;
                else processedValue = 0; // General default
            }
            // Apply minimum values
            if (field === 'fontSize' && processedValue < 1) processedValue = 1;
            if ((field === 'padding' || field === 'borderWidth') && processedValue < 0) processedValue = 0;
        }
        // Handle 'none' value for borderStyle
        if (field === 'borderStyle' && value === 'none') {
             // Reset border properties when style is 'none'
             updateElement(selectedElement.id, {
                 borderStyle: 'none',
                 borderWidth: 0,
                 // Keep borderColor or reset it? Let's keep it for now.
             });
             return; // Exit early as we handled the update
         }

        updateElement(selectedElement.id, { [field]: processedValue });
    };

    // Define available border styles
    const borderStyles = ['none', 'solid', 'dashed', 'dotted'];

    // --- Image Upload Handler --- 
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedElement || selectedElement.type !== 'image') return;
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload/template-image', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            // Update the specific element directly via updateElement prop
            updateElement(selectedElement.id, { imageUrl: result.imageUrl });
            toast.success('Image uploaded successfully!');

        } catch (error: any) {
            console.error("Image upload error:", error);
            setUploadError(error.message || 'An error occurred during upload.');
            toast.error(`Image upload failed: ${error.message || 'Unknown error'}`);
        } finally {
            setIsUploading(false);
        }
    };
    // --- End Image Upload Handler ---

    return (
        <div style={{ width: '250px', padding: '10px', overflowY: 'auto', borderLeft: '1px solid #ccc' }}> 
            <h4 className="text-lg font-semibold mb-4 border-b pb-2">Properties</h4>
            {!selectedElement && (
                <div className="text-sm text-muted-foreground">Select an element to edit its properties.</div>
            )}

            {selectedElement && (
                <div className="space-y-4">
                    {/* Common Properties */}
                    <div>
                        <Label className="text-xs text-muted-foreground">ID</Label>
                        <div className="text-sm font-mono">{selectedElement.id.substring(0, 8)}...</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><Label className="text-xs">X:</Label> <Input readOnly value={Math.round(selectedElement.x)} /></div>
                        <div><Label className="text-xs">Y:</Label> <Input readOnly value={Math.round(selectedElement.y)} /></div>
                        <div><Label className="text-xs">W:</Label> <Input readOnly value={Math.round(selectedElement.width)} /></div>
                        <div><Label className="text-xs">H:</Label> <Input readOnly value={Math.round(selectedElement.height)} /></div>
                    </div>
                    <hr />

                    {/* Layering (z-index) - Common to all? */}
                    <div className="space-y-1">
                        <Label htmlFor="zIndex">Layer (z-index)</Label>
                        <Input 
                            id="zIndex"
                            type="number"
                            value={selectedElement.zIndex ?? 0} // Default to 0
                            onChange={(e) => handleChange('zIndex', e.target.value)}
                            placeholder="0"
                        />
                        {/* Add buttons for bring forward/send backward later */}
                    </div>
                    <hr />

                    {/* Type-Specific Properties */} 
                    {selectedElement.type === 'text' && (
                        <>
                            <div className="space-y-1">
                                <Label htmlFor="content">Text Content</Label>
                                <Textarea 
                                    id="content"
                                    value={selectedElement.content}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label htmlFor="fontSize">Font Size</Label>
                                    <Input id="fontSize" type="number" min="1" value={selectedElement.fontSize ?? 12} onChange={(e) => handleChange('fontSize', e.target.value)}/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="color">Text Color</Label>
                                    <Input id="color" type="color" value={selectedElement.color ?? '#000000'} onChange={(e) => handleChange('color', e.target.value)} className="h-10"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                    <Label htmlFor="fontWeight">Weight</Label>
                                    <Select value={selectedElement.fontWeight ?? 'normal'} onValueChange={(value) => handleChange('fontWeight', value)}>
                                        <SelectTrigger id="fontWeight"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="bold">Bold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="space-y-1">
                                    <Label htmlFor="fontStyle">Style</Label>
                                    <Select value={selectedElement.fontStyle ?? 'normal'} onValueChange={(value) => handleChange('fontStyle', value)}>
                                        <SelectTrigger id="fontStyle"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="italic">Italic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="textAlign">Align</Label>
                                    <Select value={selectedElement.textAlign ?? 'left'} onValueChange={(value) => handleChange('textAlign', value)}>
                                        <SelectTrigger id="textAlign"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="left">Left</SelectItem>
                                            <SelectItem value="center">Center</SelectItem>
                                            <SelectItem value="right">Right</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <hr />
                            {/* Background and Padding */} 
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label htmlFor="backgroundColor">Background</Label>
                                    <Input 
                                        id="backgroundColor"
                                        type="color"
                                        value={selectedElement.backgroundColor ?? '#ffffff'} // Default to white
                                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="padding">Padding (px)</Label>
                                    <Input 
                                        id="padding"
                                        type="number"
                                        min="0"
                                        value={selectedElement.padding ?? 0} // Default to 0
                                        onChange={(e) => handleChange('padding', e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Border Properties */} 
                            <Label>Border</Label>
                            <div className="grid grid-cols-3 gap-2 items-end">
                                <div className="space-y-1">
                                    <Label htmlFor="borderStyle" className="text-xs">Style</Label>
                                    <Select value={selectedElement.borderStyle ?? 'none'} onValueChange={(value) => handleChange('borderStyle', value)}>
                                        <SelectTrigger id="borderStyle"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {borderStyles.map(style => (
                                                <SelectItem key={style} value={style}>{style}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="space-y-1">
                                     <Label htmlFor="borderWidth" className="text-xs">Width</Label>
                                     <Input 
                                         id="borderWidth"
                                         type="number"
                                         min="0"
                                         value={selectedElement.borderWidth ?? 0}
                                         onChange={(e) => handleChange('borderWidth', e.target.value)}
                                         disabled={selectedElement.borderStyle === 'none'} // Disable if style is none
                                     />
                                 </div>
                                 <div className="space-y-1">
                                     <Label htmlFor="borderColor" className="text-xs">Color</Label>
                                     <Input 
                                         id="borderColor"
                                         type="color"
                                         value={selectedElement.borderColor ?? '#000000'}
                                         onChange={(e) => handleChange('borderColor', e.target.value)}
                                         className="h-10"
                                         disabled={selectedElement.borderStyle === 'none'} // Disable if style is none
                                     />
                                 </div>
                            </div>
                        </>
                    )}

                    {selectedElement.type === 'image' && (
                         <>
                            <div className="space-y-1">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input 
                                    id="imageUrl"
                                    type="url" 
                                    placeholder="https://... or /path/to/image.png"
                                    value={selectedElement.imageUrl ?? ''} // Use imageUrl field
                                    onChange={(e) => {
                                        handleChange('imageUrl', e.target.value);
                                        // Optionally update content too if needed for display?
                                        // handleChange('content', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="imageFile">Upload Image</Label>
                                <Input 
                                    id="imageFile"
                                    type="file" 
                                    accept="image/*" // Accept any image type
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                                {isUploading && <div className="text-xs text-muted-foreground mt-1">Uploading...</div>}
                                {uploadError && <div className="text-xs text-red-500 mt-1">Error: {uploadError}</div>}
                            </div>
                            {/* Display current image preview */} 
                            {selectedElement.imageUrl && !isUploading && (
                                <div className="mt-2">
                                    <Label className="text-xs">Current Image:</Label>
                                    <img 
                                        src={selectedElement.imageUrl}
                                        alt="Current template image"
                                        className="mt-1 border max-w-full h-auto rounded"
                                        style={{ maxHeight: '100px' }} // Limit preview height
                                    />
                                    <Input 
                                        readOnly 
                                        value={selectedElement.imageUrl} 
                                        className="mt-1 text-xs text-muted-foreground bg-slate-100"
                                    />
                                </div>
                            )}
                         </>
                    )}

                    {selectedElement.type === 'data' && (
                        <>
                            <div className="space-y-1">
                                <Label htmlFor="dataFieldKey">Data Field</Label>
                                <Select 
                                    value={selectedElement.dataFieldKey ?? selectedElement.content} 
                                    onValueChange={(value) => {
                                        handleChange('dataFieldKey', value);
                                        handleChange('content', value); 
                                    }}
                                    disabled={isLoadingKeys} // Disable while loading
                                >
                                    <SelectTrigger id="dataFieldKey"><SelectValue placeholder={isLoadingKeys ? "Loading keys..." : "Select data field..."} /></SelectTrigger>
                                    <SelectContent>
                                        {isLoadingKeys ? (
                                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                                        ) : availableDataKeys.length > 0 ? (
                                            availableDataKeys.map(key => (
                                                <SelectItem key={key} value={key}>{key}</SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-keys" disabled>No keys found</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Data Format Input */} 
                            <div className="space-y-1">
                                <Label htmlFor="dataFormat">Data Format (Optional)</Label>
                                <Input 
                                    id="dataFormat"
                                    type="text"
                                    placeholder="e.g., date:MM/DD/YYYY, currency" 
                                    value={selectedElement.dataFormat ?? ''} // Use dataFormat field
                                    onChange={(e) => handleChange('dataFormat', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Examples: 'date:YYYY-MM-DD', 'currency:USD', 'number:2' (decimal places). Leave blank for default.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label htmlFor="fontSize">Font Size</Label>
                                    <Input id="fontSize" type="number" min="1" value={selectedElement.fontSize ?? 12} onChange={(e) => handleChange('fontSize', e.target.value)}/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="color">Text Color</Label>
                                    <Input id="color" type="color" value={selectedElement.color ?? '#000000'} onChange={(e) => handleChange('color', e.target.value)} className="h-10"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                    <Label htmlFor="fontWeight">Weight</Label>
                                    <Select value={selectedElement.fontWeight ?? 'normal'} onValueChange={(value) => handleChange('fontWeight', value)}>
                                        <SelectTrigger id="fontWeight"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="bold">Bold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="space-y-1">
                                    <Label htmlFor="fontStyle">Style</Label>
                                    <Select value={selectedElement.fontStyle ?? 'normal'} onValueChange={(value) => handleChange('fontStyle', value)}>
                                        <SelectTrigger id="fontStyle"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="italic">Italic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="textAlign">Align</Label>
                                    <Select value={selectedElement.textAlign ?? 'left'} onValueChange={(value) => handleChange('textAlign', value)}>
                                        <SelectTrigger id="textAlign"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="left">Left</SelectItem>
                                            <SelectItem value="center">Center</SelectItem>
                                            <SelectItem value="right">Right</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <hr />
                            {/* Background and Padding for Data */} 
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label htmlFor="backgroundColor">Background</Label>
                                    <Input id="backgroundColor" type="color" value={selectedElement.backgroundColor ?? '#ffffff'} onChange={(e) => handleChange('backgroundColor', e.target.value)} className="h-10"/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="padding">Padding (px)</Label>
                                    <Input id="padding" type="number" min="0" value={selectedElement.padding ?? 0} onChange={(e) => handleChange('padding', e.target.value)}/>
                                </div>
                            </div>
                            {/* Border Properties for Data */} 
                            <Label>Border</Label>
                            <div className="grid grid-cols-3 gap-2 items-end">
                                <div className="space-y-1">
                                    <Label htmlFor="borderStyle" className="text-xs">Style</Label>
                                    <Select value={selectedElement.borderStyle ?? 'none'} onValueChange={(value) => handleChange('borderStyle', value)}>
                                        <SelectTrigger id="borderStyle"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {borderStyles.map(style => (<SelectItem key={style} value={style}>{style}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="space-y-1">
                                     <Label htmlFor="borderWidth" className="text-xs">Width</Label>
                                     <Input id="borderWidth" type="number" min="0" value={selectedElement.borderWidth ?? 0} onChange={(e) => handleChange('borderWidth', e.target.value)} disabled={selectedElement.borderStyle === 'none'}/>
                                 </div>
                                 <div className="space-y-1">
                                     <Label htmlFor="borderColor" className="text-xs">Color</Label>
                                     <Input id="borderColor" type="color" value={selectedElement.borderColor ?? '#000000'} onChange={(e) => handleChange('borderColor', e.target.value)} className="h-10" disabled={selectedElement.borderStyle === 'none'}/>
                                 </div>
                            </div>
                        </>
                    )}
                    
                    {/* Line Properties */} 
                    {selectedElement.type === 'line' && (
                        <>
                            <div className="space-y-1">
                                <Label htmlFor="color">Line Color</Label>
                                <Input 
                                    id="color"
                                    type="color"
                                    value={selectedElement.color ?? '#000000'} // Default to black
                                    onChange={(e) => handleChange('color', e.target.value)}
                                    className="h-10"
                                />
                            </div>
                             <div className="space-y-1">
                                 <Label htmlFor="height">Thickness (px)</Label>
                                 <Input 
                                     id="height"
                                     type="number"
                                     min="1" 
                                     value={selectedElement.height} // Use height for thickness
                                     onChange={(e) => handleChange('height', e.target.value)}
                                 />
                             </div>
                             {/* Add control for Width (length) if needed */}
                            {/* Add control for Orientation later? */}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

// --- NEW: PlaceholdersSection Component ---
interface PlaceholdersSectionProps {
    onInsertPlaceholder: (placeholder: string) => void;
}

const PlaceholdersSection: React.FC<PlaceholdersSectionProps> = ({ onInsertPlaceholder }) => {
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
                                    className="w-full justify-start text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onInsertPlaceholder(`{{${item.key}}}`);
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                    }}
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
};
// --- END PlaceholdersSection Component ---

// --- Props for TemplateEditor ---
interface TemplateEditorProps {
    templateId?: string; // ID if editing existing
    initialName?: string;
    initialElements?: TemplateElement[];
    onNameChange?: (name: string) => void;
}

// Change to use forwardRef
const TemplateEditor = React.forwardRef(({ 
    templateId,
    initialName = '',
    initialElements = [],
    onNameChange
}: TemplateEditorProps, ref: any) => {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [elements, setElements] = useState<TemplateElement[]>(initialElements);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [availableDataKeys, setAvailableDataKeys] = useState<string[]>([]); // State for keys
    const [isLoadingKeys, setIsLoadingKeys] = useState<boolean>(true); // Loading state for keys
    const [showSplitPreview, setShowSplitPreview] = useState(true);
    const [previewScale, setPreviewScale] = useState(0.6);

    // Fetch available data keys on mount
    useEffect(() => {
        const fetchKeys = async () => {
            setIsLoadingKeys(true);
            try {
                const response = await fetch('/api/template-data-keys');
                if (!response.ok) {
                    throw new Error('Failed to fetch data keys');
                }
                const keys = await response.json();
                if (Array.isArray(keys)) {
                    setAvailableDataKeys(keys);
                } else {
                    throw new Error('Invalid data format for keys')
                }
            } catch (error) {
                console.error("Error fetching data keys:", error);
                toast.error("Could not load available data fields.");
                // Set empty or default keys on error?
                setAvailableDataKeys([]); 
            } finally {
                setIsLoadingKeys(false);
            }
        };
        fetchKeys();
    }, []);

    // Effect to update state when initial props change
    useEffect(() => {
        setName(initialName);
        if (Array.isArray(initialElements)) {
            setElements(initialElements);
        } else {
            console.warn("Initial elements data is not a valid array:", initialElements);
            setElements([]); 
        }
    }, [initialName, initialElements]);

    // --- Keyboard Shortcuts --- 
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only handle keys if in edit mode and an element is selected
            if (mode !== 'edit' || !selectedElementId) return;

            // Prevent browser default actions for keys we handle (like Backspace navigation)
            let handled = false;
            const nudgeAmount = event.shiftKey ? 10 : 1; // Nudge more with Shift

            // Find the element to modify
            const elementToModify = elements.find(el => el.id === selectedElementId);
            if (!elementToModify) return;

            let updatedElement = { ...elementToModify };

            switch (event.key) {
                case 'ArrowUp':
                    updatedElement.y -= nudgeAmount;
                    handled = true;
                    break;
                case 'ArrowDown':
                    updatedElement.y += nudgeAmount;
                    handled = true;
                    break;
                case 'ArrowLeft':
                    updatedElement.x -= nudgeAmount;
                    handled = true;
                    break;
                case 'ArrowRight':
                    updatedElement.x += nudgeAmount;
                    handled = true;
                    break;
                case 'Delete':
                case 'Backspace':
                    setElements(prev => prev.filter(el => el.id !== selectedElementId));
                    setSelectedElementId(null); // Deselect after deletion
                    handled = true;
                    break;
                default:
                    break;
            }

            if (handled) {
                event.preventDefault(); // Prevent default browser behavior
                // If position changed, update the element state
                if (event.key.startsWith('Arrow')) {
                    setElements(prev => prev.map(el => el.id === selectedElementId ? updatedElement : el));
                }
            }
        };

        // Add listener only when in edit mode
        if (mode === 'edit') {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown); // Ensure cleanup if mode changes
        }

        // Cleanup listener on component unmount or when mode changes
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mode, selectedElementId, elements]); // Dependencies: mode, selection, and elements list

    // Update handleDrop to potentially initialize new fields
    const handleDrop = useCallback((item: { type: string }, x: number, y: number) => {
        const elementType = item.type as 'text' | 'image' | 'data' | 'line'; // Added 'line'
        const newElement: TemplateElement = {
            id: uuidv4(), 
            type: elementType,
            content: elementType === 'data' ? 'patientName' : elementType === 'line' ? 'horizontal' : `New ${elementType}`, // Default content
            x: Math.round(x),
            y: Math.round(y),
            // Default dimensions based on type
            width: elementType === 'image' ? 100 : elementType === 'line' ? 150 : 150, // Line width is length
            height: elementType === 'image' ? 100 : elementType === 'line' ? 2 : 50,   // Line height is thickness
            // Default styles
            fontSize: 12,
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left',
            color: elementType === 'line' ? '#000000' : '#000000', // Line color is black
            backgroundColor: 'transparent', // Lines don't need background
            padding: 0,
            borderStyle: 'none', // Lines don't need border
            borderWidth: 0,
            borderColor: 'transparent',
            zIndex: 0,
            // Default type-specific
            dataFieldKey: elementType === 'data' ? 'patientName' : undefined,
            imageUrl: elementType === 'image' ? '' : undefined,
        };
        setElements((prevElements) => [...prevElements, newElement]);
    }, []);

    const handleMoveElement = useCallback((id: string, x: number, y: number) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, x, y } : el));
    }, []);

    const handleResizeElement = useCallback((id: string, width: number, height: number) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, width, height } : el));
    }, []);

    const handleSelectElement = useCallback((id: string | null) => {
        setSelectedElementId(id);
    }, []);

    // NEW: Handler to update a specific element's properties
    const handleUpdateElement = useCallback((id: string, updates: Partial<TemplateElement>) => {
        setElements(prev => prev.map(el => 
            el.id === id ? { ...el, ...updates } : el
        ));
    }, []);

    const selectedElement = elements.find(el => el.id === selectedElementId) || null;

    // --- Save Handler ---
    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Template name cannot be empty.");
            return;
        }
        if (elements.length === 0) {
            toast.error("Template must contain at least one element.");
            return;
        }

        setIsSaving(true);
        const payload = {
            name: name,
            elements: elements, // Send the current state
        };

        const url = templateId ? `/api/custom-templates/${templateId}` : '/api/custom-templates';
        const method = templateId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Failed to save template (${response.status})`);
            }

            toast.success(`Template ${templateId ? 'updated' : 'created'} successfully!`);
            
            // Optional: Redirect after save? Maybe to template list or the edit page of the new one
            if (!templateId && result.id) { // If created new, redirect to edit page
                router.push(`/admin/templates/custom/${result.id}/edit`);
            } else {
                // Could potentially refetch data if staying on edit page
            }

        } catch (error) {
            console.error("Error saving template:", error);
            toast.error(`Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Function to add a predefined section 
    const handleAddSection = useCallback((sectionElements: TemplateElement[]) => {
        setElements(prev => [...prev, ...sectionElements]);
        toast.success('Section added successfully');
    }, []);

    // Handler for inserting placeholders directly as draggable elements
    const handleInsertPlaceholder = useCallback((placeholder: string) => {
        console.log("TemplateEditor received placeholder:", placeholder);
        
        // Direct test approach - skip all the complexity and just add the element
        try {
            // Clean the placeholder format (remove {{ }})
            const cleanKey = placeholder.replace(/{{|}}/g, '').trim();
            
            // Create a unique ID for the new element
            const newId = uuidv4();
            console.log("TemplateEditor: Generated new element ID:", newId);
            
            // Create a very simple placeholder element with high visibility
            const newElement: TemplateElement = {
                id: newId,
                type: 'data',
                content: placeholder,
                dataFieldKey: cleanKey,
                x: 150,
                y: 150,
                width: 200,
                height: 60,
                fontSize: 20,
                fontWeight: 'bold',
                fontStyle: 'normal',
                textAlign: 'center',
                color: '#ffffff',
                backgroundColor: '#ff0000', // Bright red for visibility
                padding: 10,
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: '#000000',
                zIndex: 1000, // Very high z-index to ensure visibility
            };

            // Update the state with the new element directly
            setElements(prev => [...prev, newElement]);
            
            // Log the updated state
            console.log("TemplateEditor: Added placeholder element, new count:", elements.length + 1);
            
            // Show success message
            toast.success(`Added placeholder: ${cleanKey}`);
            
            // Return true to indicate success
            return true;
        } catch (error) {
            console.error("Error adding placeholder:", error);
            toast.error("Failed to add placeholder: " + (error instanceof Error ? error.message : String(error)));
            return false;
        }
    }, []);

    // Force re-render on mount to ensure client-side state is used
    useEffect(() => {
        console.log("TemplateEditor mounted, elements count:", elements.length);
        // Force a re-render after mount to make sure any hydration issues are resolved
        const timer = setTimeout(() => {
            console.log("TemplateEditor: Forcing re-render after mount");
            setElements([...elements]);
        }, 500);
        
        return () => clearTimeout(timer);
    }, []); // Empty dependency array means this runs once on mount

    // Add test method to directly add an element
    const addTestElement = () => {
        // Create a test element at fixed position
        const newId = uuidv4();
        console.log("Creating test element with ID:", newId);
        
        const newElement: TemplateElement = {
            id: newId,
            type: 'text',
            content: 'Test Element ' + new Date().toLocaleTimeString(),
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ff0000',
            backgroundColor: '#ffff00',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#ff0000',
            zIndex: 100,
        };
        
        console.log("Adding test element to elements array:", newElement);
        setElements(prev => {
            const updatedElements = [...prev, newElement];
            console.log("Elements array now has", updatedElements.length, "elements");
            return updatedElements;
        });
        
        // Force re-render of preview
        setTimeout(() => {
            console.log("Forcing re-render after adding test element");
            setElements(prev => [...prev]);
        }, 200);
    };
    
    // Add test method to directly add a placeholder
    const addTestPlaceholder = () => {
        const placeholderKey = "test_placeholder";
        const newId = uuidv4();
        console.log("Creating test placeholder with ID:", newId);
        
        const newElement: TemplateElement = {
            id: newId,
            type: 'data',
            content: `{{${placeholderKey}}}`,
            dataFieldKey: placeholderKey,
            x: 150,
            y: 200,
            width: 200,
            height: 50,
            fontSize: 16,
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'center',
            color: '#ffffff',
            backgroundColor: '#ff0000',
            padding: 10,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#000000',
            zIndex: 100,
        };
        
        console.log("Adding test placeholder to elements array:", newElement);
        setElements(prev => {
            const updatedElements = [...prev, newElement];
            console.log("Elements array now has", updatedElements.length, "elements");
            return updatedElements;
        });
        
        // Force re-render of preview
        setTimeout(() => {
            console.log("Forcing re-render after adding test placeholder");
            setElements(prev => [...prev]);
        }, 200);
    };

    // Special debug function - add directly to the top of the rendered content
    const addDebugInfo = () => {
        return (
            <div className="bg-black text-white p-4 mb-4 rounded-md">
                <h2 className="text-xl font-bold mb-2">Debug Information</h2>
                <p>Total Elements: {elements.length}</p>
                <p>Selected Element ID: {selectedElementId || 'None'}</p>
                <div className="mt-2">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => {
                            console.log("Debug: Forcing re-render");
                            setElements([...elements]);
                        }}
                    >
                        Force Re-render
                    </button>
                    <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => {
                            // Clear all elements
                            console.log("Debug: Clearing all elements");
                            setElements([]);
                        }}
                    >
                        Clear Elements
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            console.log("Debug: Displaying all elements");
                            console.table(elements);
                        }}
                    >
                        Log Elements
                    </button>
                </div>
                <div className="mt-2 text-xs overflow-auto max-h-32">
                    {elements.map((el, idx) => (
                        <div key={el.id} className="mb-1">
                            {idx+1}. {el.type} at ({el.x},{el.y}) - {el.content.substring(0, 20)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Add a handler for name changes
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        if (onNameChange) {
            onNameChange(newName);
        }
    };
    
    // Expose methods to parent component via ref
    React.useImperativeHandle(ref, () => ({
        getElements: () => elements,
        getTemplateName: () => name,
        setTemplateName: (newName: string) => {
            setName(newName);
            if (onNameChange) {
                onNameChange(newName);
            }
        }
    }));

    return (
        <div 
            className="container mx-auto p-4"
            onSubmit={(e) => {
                e.preventDefault();
                return false;
            }}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <Input
                        type="text"
                        placeholder="Template Name"
                        value={name}
                        onChange={handleNameChange}
                        className="w-64 mr-4"
                    />
                    <Button 
                        onClick={(e) => {
                            e.preventDefault();
                            handleSave();
                        }} 
                        disabled={isSaving || !name.trim()} 
                        className="mr-2"
                        type="button"
                    >
                        {isSaving ? 'Saving...' : 'Save Template'}
                    </Button>
                    {templateId && (
                        <Button 
                            variant="outline" 
                            onClick={() => router.push(`/templates/${templateId}`)} 
                            className="mr-2"
                        >
                            View Template
                        </Button>
                    )}
                    {/* Test button for debugging */}
                    <Button 
                        variant="secondary" 
                        onClick={addTestElement} 
                        type="button" 
                        className="mr-2"
                    >
                        Add Test Element
                    </Button>
                    
                    {/* Test button for direct placeholder addition */}
                    <Button 
                        variant="secondary" 
                        onClick={addTestPlaceholder} 
                        type="button" 
                        className="mr-2"
                    >
                        Add Test Placeholder
                    </Button>
                </div>
                <div className="flex items-center">
                    <div className="mr-4 flex items-center">
                        <label className="mr-2 text-sm">Preview:</label>
                        <div className="relative inline-block w-12 h-6 mr-2">
                            <input 
                                type="checkbox" 
                                checked={showSplitPreview} 
                                onChange={() => setShowSplitPreview(!showSplitPreview)} 
                                className="opacity-0 w-0 h-0"
                                id="preview-toggle"
                            />
                            <label 
                                htmlFor="preview-toggle"
                                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${showSplitPreview ? 'bg-blue-500' : 'bg-gray-300'}`}
                            >
                                <span 
                                    className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 ${showSplitPreview ? 'transform translate-x-6' : ''}`}
                                    style={{top: '4px', left: '4px'}}
                                ></span>
                            </label>
                        </div>
                    </div>
                    {showSplitPreview && (
                        <div className="flex items-center">
                            <label className="mr-2 text-sm">Scale:</label>
                            <select 
                                value={previewScale} 
                                onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="0.4">40%</option>
                                <option value="0.5">50%</option>
                                <option value="0.6">60%</option>
                                <option value="0.75">75%</option>
                                <option value="1">100%</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <Tabs defaultValue="editor" className="w-full" onSubmit={(e) => e.preventDefault()}>
                <TabsList className="w-full mb-4">
                    <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
                    <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor" className="flex flex-col space-y-4">
                    <div className={`flex ${showSplitPreview ? 'space-x-4' : ''}`}>
                        <div className={showSplitPreview ? 'w-2/3' : 'w-full'}>
                            <DndProvider backend={HTML5Backend}>
                                <div className="flex border rounded-md overflow-hidden">
                                    <ElementSidebar onAddSection={handleAddSection} />
                                    <EditingCanvas
                                        elements={elements}
                                        onDrop={handleDrop}
                                        moveElement={handleMoveElement}
                                        resizeElement={handleResizeElement}
                                        selectElement={handleSelectElement}
                                        selectedElementId={selectedElementId}
                                    />
                                    <PropertiesPanel
                                        selectedElement={elements.find(e => e.id === selectedElementId) || null}
                                        updateElement={handleUpdateElement}
                                        availableDataKeys={availableDataKeys}
                                        isLoadingKeys={isLoadingKeys}
                                    />
                                </div>
                            </DndProvider>
                        </div>
                        
                        {showSplitPreview && (
                            <div className="w-1/3 border rounded-md p-2 bg-gray-50 flex items-center justify-center overflow-hidden">
                                <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center' }}>
                                    <TemplatePreview 
                                        elements={elements}
                                        key={`preview-${Date.now()}`} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <div className="border rounded-lg p-4 bg-white">
                            <h3 className="text-lg font-semibold mb-3">Insert Placeholders</h3>
                            <p className="text-sm text-gray-500 mb-4">Click on a placeholder below to add it to your template.</p>
                            <PlaceholdersSection
                                onInsertPlaceholder={handleInsertPlaceholder}
                            />
                        </div>
                    </div>
                </TabsContent>
                
                <TabsContent value="preview" className="flex justify-center items-start pt-4 bg-gray-100 min-h-screen">
                    <div className="bg-white p-8 shadow-lg">
                        <TemplatePreview 
                            elements={elements} 
                            key={`full-preview-${Date.now()}`}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {addDebugInfo()}
        </div>
    );
});

// Add display name
TemplateEditor.displayName = 'TemplateEditor';

export default TemplateEditor; 