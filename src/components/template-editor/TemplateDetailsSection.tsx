'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { standardFonts } from './types';

interface TemplateDetailsSectionProps {
  templateName: string;
  headerText: string;
  footerText: string;
  defaultFontFamily: string;
  defaultFontSize: number;
  onTemplateNameChange: (name: string) => void;
  onHeaderTextChange: (text: string) => void;
  onFooterTextChange: (text: string) => void;
  onDefaultFontFamilyChange: (font: string) => void;
  onDefaultFontSizeChange?: (size: number) => void;
  onBaseTemplateFileChange?: (file: File | null) => void;
}

export function TemplateDetailsSection({
  templateName,
  headerText,
  footerText,
  defaultFontFamily,
  defaultFontSize,
  onTemplateNameChange,
  onHeaderTextChange,
  onFooterTextChange,
  onDefaultFontFamilyChange,
  onDefaultFontSizeChange,
  onBaseTemplateFileChange,
}: TemplateDetailsSectionProps) {
  const [baseTemplateFile, setBaseTemplateFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBaseTemplateFile(file);
    onBaseTemplateFileChange?.(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => onTemplateNameChange(e.target.value)}
            placeholder="e.g., Standard Patient Affidavit"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="baseTemplateFile">Base Template Document (Optional PDF)</Label>
          <Input
            id="baseTemplateFile"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
          {baseTemplateFile && (
            <p className="text-sm text-muted-foreground">Selected: {baseTemplateFile.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="headerText">Header Text (Optional)</Label>
          <Textarea
            id="headerText"
            value={headerText}
            onChange={(e) => onHeaderTextChange(e.target.value)}
            placeholder="Text to appear at the top of each page"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="footerText">Footer Text (Optional)</Label>
          <Textarea
            id="footerText"
            value={footerText}
            onChange={(e) => onFooterTextChange(e.target.value)}
            placeholder="Text to appear at the bottom of each page (e.g., page numbers)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="defaultFontFamily">Default Font Family</Label>
            <Select
              value={defaultFontFamily}
              onValueChange={onDefaultFontFamilyChange}
            >
              <SelectTrigger id="defaultFontFamily">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {standardFonts.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultFontSize">Default Font Size (pt)</Label>
            <Input
              id="defaultFontSize"
              type="number"
              value={defaultFontSize}
              onChange={(e) => {
                const newSize = Number(e.target.value) || 12;
                if (onDefaultFontSizeChange) {
                  onDefaultFontSizeChange(newSize);
                }
              }}
              placeholder="e.g., 12"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 