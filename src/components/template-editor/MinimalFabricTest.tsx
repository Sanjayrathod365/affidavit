import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export default function MinimalFabricTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 500,
        height: 400,
        backgroundColor: 'yellow',
      });
      fabricCanvasRef.current = canvas;

      // Add a rectangle immediately for testing
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 60,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
        selectable: true,
        evented: true,
      });
      canvas.add(rect);
      canvas.selection = true;
      canvas.skipTargetFind = false;
      canvas.defaultCursor = 'move';
      canvas.hoverCursor = 'pointer';
      canvas.forEachObject((obj: any) => {
        obj.selectable = true;
        obj.evented = true;
      });
      canvas.requestRenderAll();

      // Add event listeners to force full render
      canvas.on('object:selected', () => {
        canvas.requestRenderAll();
      });
      canvas.on('object:moving', () => {
        canvas.requestRenderAll();
      });
      canvas.on('object:modified', () => {
        canvas.requestRenderAll();
      });
      canvas.on('selection:cleared', () => {
        canvas.requestRenderAll();
      });

      // Force all objects to be visible before every render
      canvas.on('before:render', () => {
        canvas.getObjects().forEach((obj: any) => {
          obj.visible = true;
        });
      });

      // Log all objects and their visibility after every render
      canvas.on('after:render', () => {
        const objs = canvas.getObjects();
        console.log('Objects on canvas:', objs);
        objs.forEach((obj: any, i: number) => {
          console.log(`Object ${i}: visible=${obj.visible}`);
        });
      });
    }
    return () => {
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  const handleAddRect = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const rect = new fabric.Rect({
        left: 50 + Math.random() * 300,
        top: 50 + Math.random() * 250,
        width: 100,
        height: 60,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
        selectable: true,
        evented: true,
      });
      canvas.add(rect);
      canvas.selection = true;
      canvas.skipTargetFind = false;
      canvas.requestRenderAll();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Minimal Fabric.js Test</h2>
      <button onClick={handleAddRect} style={{ marginBottom: 10 }}>Add Rectangle</button>
      <div style={{ border: '2px solid #333', display: 'inline-block' }}>
        <canvas ref={canvasRef} width={500} height={400} />
      </div>
    </div>
  );
} 