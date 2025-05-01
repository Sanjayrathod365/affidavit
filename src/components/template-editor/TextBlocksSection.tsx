'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from 'lucide-react';
import { TextBlock } from './types';

interface TextBlocksSectionProps {
  textBlocks: TextBlock[];
  onTextBlocksChange: (textBlocks: TextBlock[]) => void;
}

export function TextBlocksSection({
  textBlocks,
  onTextBlocksChange,
}: TextBlocksSectionProps) {

  const addTextBlock = () => {
    const newTextBlock: TextBlock = {
      id: crypto.randomUUID(),
      content: 'New Text Block',
      position: { x: 50, y: 150 + textBlocks.length * 50, page: 1 },
      styles: { fontSize: 12, fontWeight: 'normal', textAlign: 'left' },
    };
    onTextBlocksChange([...textBlocks, newTextBlock]);
  };

  const removeTextBlock = (id: string) => {
    onTextBlocksChange(textBlocks.filter(tb => tb.id !== id));
  };

  const updateTextBlock = (
    id: string,
    field: keyof TextBlock | 'position.x' | 'position.y' | 'styles.fontSize' | 'styles.fontWeight' | 'styles.textAlign' | 'styles.color',
    value: any
  ) => {
    const newTextBlocks = textBlocks.map(tb => {
      if (tb.id !== id) return tb;
      const updatedTb = { ...tb };
      if (field.startsWith('position.')) {
        const key = field.split('.')[1] as keyof TextBlock['position'];
        updatedTb.position = { ...(updatedTb.position || {}), [key]: value ? parseFloat(value) : undefined };
      } else if (field.startsWith('styles.')) {
        const key = field.split('.')[1] as keyof TextBlock['styles'];
        let styleValue = value;
        if (key === 'fontSize') {
          styleValue = value ? parseInt(value) : undefined;
        }
        updatedTb.styles = { ...(updatedTb.styles || {}), [key]: styleValue };
      } else {
        (updatedTb as any)[field] = value;
      }
      return updatedTb;
    });
    onTextBlocksChange(newTextBlocks);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Text Blocks</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTextBlock}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Text Block
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {textBlocks.map((textBlock, index) => (
          <div key={textBlock.id} className="p-4 border rounded space-y-4 relative bg-secondary/30">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeTextBlock(textBlock.id)}
              className="absolute top-2 right-2"
            >
              Remove
            </Button>
            <div className="space-y-2">
              <Label htmlFor={`textBlockContent-${index}`}>Text Content</Label>
              <Textarea
                id={`textBlockContent-${index}`}
                value={textBlock.content}
                onChange={(e) => updateTextBlock(textBlock.id, 'content', e.target.value)}
                placeholder="Enter the static text here..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`textBlockX-${index}`}>X Position (pt)</Label>
                <Input
                  id={`textBlockX-${index}`}
                  type="number"
                  value={textBlock.position.x}
                  onChange={(e) => updateTextBlock(textBlock.id, 'position.x', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`textBlockY-${index}`}>Y Position (pt)</Label>
                <Input
                  id={`textBlockY-${index}`}
                  type="number"
                  value={textBlock.position.y}
                  onChange={(e) => updateTextBlock(textBlock.id, 'position.y', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`textBlockFontSize-${index}`}>Font Size (pt)</Label>
                <Input
                  id={`textBlockFontSize-${index}`}
                  type="number"
                  value={textBlock.styles.fontSize}
                  onChange={(e) => updateTextBlock(textBlock.id, 'styles.fontSize', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`textBlockFontWeight-${index}`}>Font Weight</Label>
                <Select
                  value={textBlock.styles.fontWeight}
                  onValueChange={(value) => updateTextBlock(textBlock.id, 'styles.fontWeight', value)}
                >
                  <SelectTrigger id={`textBlockFontWeight-${index}`}>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`textBlockTextAlign-${index}`}>Text Align</Label>
                <Select
                  value={textBlock.styles.textAlign || 'left'}
                  onValueChange={(value) => updateTextBlock(textBlock.id, 'styles.textAlign', value)}
                >
                  <SelectTrigger id={`textBlockTextAlign-${index}`}>
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`textBlockColor-${index}`}>Text Color</Label>
              <Input
                id={`textBlockColor-${index}`}
                type="color"
                value={textBlock.styles.color || '#000000'}
                onChange={(e) => updateTextBlock(textBlock.id, 'styles.color', e.target.value)}
              />
            </div>
          </div>
        ))}
        {textBlocks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No text blocks added yet. Click the "Add Text Block" button to create one.
          </div>
        )}
      </CardContent>
    </Card>
  );
} 