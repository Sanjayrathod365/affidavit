'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

// --- ElementSidebar Component ---
const ElementSidebar = () => {
    return (
        <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px', backgroundColor: '#f8f8f8' }}>
            <h4>Elements</h4>
            <DraggableSidebarItem elementType="text">Text Box</DraggableSidebarItem>
            <DraggableSidebarItem elementType="image">Image</DraggableSidebarItem>
            <DraggableSidebarItem elementType="data">Data Field</DraggableSidebarItem>
            <DraggableSidebarItem elementType="line">Line</DraggableSidebarItem>
        </div>
    );
}
// --- END ElementSidebar Component ---

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

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TEMPLATE_ELEMENT,
    drop: (item: { type: string }, monitor) => {
      // Calculate drop position relative to the canvas
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();

      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
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

  return (
    <div
      ref={canvasRef}
      style={{
        flexGrow: 1,
        borderRight: '1px solid #ccc',
        padding: '10px',
        position: 'relative',
        minHeight: '600px',
        backgroundColor: backgroundColor,
        transition: 'background-color 0.2s ease',
      }}
      onClick={handleCanvasClick} // Deselect when clicking canvas background
    >
      {/* Render Draggable Elements */} 
      {elements.map((element) => (
        <DraggableElement
          key={element.id}
          element={element}
          onMove={moveElement}
          onResize={resizeElement}
          onSelect={selectElement}
          isSelected={element.id === selectedElementId}
        />
      ))}
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

// --- Props for TemplateEditor ---
interface TemplateEditorProps {
    templateId?: string; // ID if editing existing
    initialName?: string;
    initialElements?: TemplateElement[];
}

// --- UPDATED TemplateEditor Component ---
export default function TemplateEditor({ 
    templateId,
    initialName = '',
    initialElements = []
}: TemplateEditorProps) {
  const router = useRouter();
  const [templateName, setTemplateName] = useState<string>(initialName);
  const [elements, setElements] = useState<TemplateElement[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [availableDataKeys, setAvailableDataKeys] = useState<string[]>([]); // State for keys
  const [isLoadingKeys, setIsLoadingKeys] = useState<boolean>(true); // Loading state for keys

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
      setTemplateName(initialName);
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
    if (!templateName.trim()) {
        toast.error("Template name cannot be empty.");
        return;
    }
     if (elements.length === 0) {
        toast.error("Template must contain at least one element.");
        return;
    }

    setIsSaving(true);
    const payload = {
        name: templateName,
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

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Add Header for Name Input, Save Button, and Preview Toggle */}
      <div className="p-4 border-b bg-slate-50 flex justify-between items-center sticky top-0 z-10 gap-4">
        <div className="flex-1">
          <Input
            placeholder="Enter Template Name..."
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="max-w-md"
            disabled={isSaving || mode === 'preview'}
          />
        </div>
        <div className="flex items-center space-x-2">
            <Switch
                id="preview-mode-toggle"
                checked={mode === 'preview'}
                onCheckedChange={(checked) => setMode(checked ? 'preview' : 'edit')}
                disabled={isSaving}
            />
            <Label htmlFor="preview-mode-toggle">Preview Mode</Label>
        </div>
        <Button onClick={handleSave} disabled={isSaving || mode === 'preview'}>
          {isSaving ? 'Saving...' : templateId ? 'Update Template' : 'Save Template'}
        </Button>
      </div>

      {/* Main Editor Layout */}
      <div style={{ display: 'flex', height: 'calc(100vh - 80px)', backgroundColor: '#f8f9fa' }}>
        {mode === 'edit' && (
          <>
            <ElementSidebar />
            <EditingCanvas
                elements={elements}
                onDrop={handleDrop}
                moveElement={handleMoveElement}
                resizeElement={handleResizeElement}
                selectElement={handleSelectElement}
                selectedElementId={selectedElementId}
            />
            <PropertiesPanel
                selectedElement={selectedElement}
                updateElement={handleUpdateElement}
                availableDataKeys={availableDataKeys}
                isLoadingKeys={isLoadingKeys}
            />
          </>
        )}
         {mode === 'preview' && (
           <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px' }}>
             <TemplatePreview elements={elements} />
           </div>
         )}
      </div>
    </DndProvider>
  );
}
// --- END UPDATED TemplateEditor Component --- 