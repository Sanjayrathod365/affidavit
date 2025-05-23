'use client';

import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
// We might need to add CSS for react-resizable handles
import 'react-resizable/css/styles.css'; // Import the default styles
import { useDrag } from 'react-dnd';

import { TemplateElement, ItemTypes } from './TemplateEditor'; // Import ItemTypes too

interface DraggableElementProps {
  element: TemplateElement;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ element, onMove, onResize, onSelect, isSelected }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.CANVAS_ELEMENT, // Use CANVAS_ELEMENT if distinguishing elements on canvas
    item: { id: element.id, x: element.x, y: element.y, type: 'canvasElement' }, // Include position
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // Optional: end drag to snap or finalize position
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        let x = Math.round(item.x + delta.x);
        let y = Math.round(item.y + delta.y);
        // TODO: Add boundary checks if needed
        onMove(item.id, x, y);
      }
    }
  }), [element.id, element.x, element.y, onMove]);

  drag(ref); // Attach drag source to the main div

  // Inline styles based on element properties - ADDED NEW STYLES
  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.7 : 1,
    border: `${element.borderWidth ?? 0}px ${element.borderStyle ?? 'none'} ${element.borderColor ?? 'transparent'}`,
    padding: `${element.padding ?? 0}px`,
    backgroundColor: element.backgroundColor ?? 'transparent', // Use transparent default for non-text?
    // Text styles (apply primarily to inner content if needed)
    fontSize: `${element.fontSize ?? 12}px`,
    fontWeight: element.fontWeight ?? 'normal',
    fontStyle: element.fontStyle ?? 'normal',
    textAlign: element.textAlign ?? 'left',
    color: element.color ?? '#000000',
    zIndex: element.zIndex ?? 0, // Apply z-index
    // Add styles for selection indicator
    outline: isSelected ? '2px solid blue' : 'none',
    outlineOffset: '2px',
    // Ensure content respects padding and box model
    boxSizing: 'border-box',
    overflow: 'hidden', // Hide content overflow
    display: 'flex', // Use flex for potential centering/alignment within the box
    alignItems: 'center', // Center vertically by default
    justifyContent: 'center' // Center horizontally by default (adjust if needed)
  };

  // Specific style for image to ensure it fits bounds
  const imageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain', // Or 'cover' depending on desired behavior
    display: 'block' // Prevent extra space below image
  };

  // Handle element click for selection
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas click handler from firing
    onSelect(element.id);
  };

  // Handle resize callback from ResizableBox
  const handleResize = (
    _event: React.SyntheticEvent,
    { size }: { size: { width: number; height: number } }
  ) => {
    onResize(element.id, size.width, size.height);
  };

  // Define resizable props
  const resizableProps: ResizableBoxProps = {
    width: element.width,
    height: element.height,
    onResize: handleResize,
    minConstraints: [20, 20], // Minimum size
    maxConstraints: [1000, 1000], // Maximum size
    resizeHandles: isSelected ? ['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's'] : [], // Show handles only when selected
    handle: (
      <div
        className="custom-resize-handle"
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#1a73e8',
          border: '1px solid white',
          borderRadius: '50%'
        }}
      />
    ),
    draggableOpts: { grid: [5, 5] } // Optional: For finer control
  };

  // For special element types (like lines), adjust the resize behavior
  if (element.type === 'line') {
    // For lines, we may want to restrict resizing to only the line's primary dimension
    resizableProps.resizeHandles = isSelected 
      ? element.height > element.width ? ['n', 's'] : ['e', 'w'] 
      : [];
  }

  return (
    <ResizableBox {...resizableProps}>
    <div
      ref={ref} // Attach drag ref
      style={elementStyle}
      onClick={handleClick} // Select on click
    >
      {/* Render content based on type */}
      {element.type === 'text' && element.content}
        {element.type === 'data' && (
          <div style={{ position: 'relative' }}>
            <span>{`{${element.dataFieldKey || element.content}}`}</span>
            {isSelected && (
              <div style={{
                position: 'absolute',
                top: '-22px',
                left: '0',
                backgroundColor: '#1a73e8',
                color: 'white',
                fontSize: '10px',
                padding: '2px 5px',
                borderRadius: '3px',
                whiteSpace: 'nowrap'
              }}>
                {element.dataFieldKey || element.content}
              </div>
            )}
          </div>
        )}
      {element.type === 'image' && element.imageUrl && 
        <img src={element.imageUrl} alt={element.content} style={imageStyle} onError={(e) => e.currentTarget.src = '' /* Basic error handling: clear src */} />}
      {element.type === 'image' && !element.imageUrl && 
        <span style={{ fontStyle: 'italic', fontSize: 'smaller' }}>Image Placeholder</span>}
      
      {/* Render Line - simple div with background color */}
      {element.type === 'line' && (
        <div style={{ width: '100%', height: '100%', backgroundColor: element.color ?? '#000000' }}></div>
      )}

        {/* Add directional arrows for quick movement */}
        {isSelected && (
          <div style={{ position: 'absolute', top: '-30px', right: '0', display: 'flex', gap: '5px' }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMove(element.id, element.x - 1, element.y);
              }}
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ←
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMove(element.id, element.x + 1, element.y);
              }}
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              →
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMove(element.id, element.x, element.y - 1);
              }}
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ↑
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMove(element.id, element.x, element.y + 1);
              }}
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ↓
            </button>
          </div>
        )}
    </div>
    </ResizableBox>
  );
};

export default DraggableElement; 