'use client';

import React, { useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AffidavitTemplateFormProps } from './types';
import { insertPlaceholderInQuill } from './utils';
import { TemplateDetailsSection } from './TemplateDetailsSection';
import { LogoSettingsSection } from './LogoSettingsSection';
import { SignatureSettingsSection } from './SignatureSettingsSection';
import { TextBlocksSection } from './TextBlocksSection';
import PlaceholdersSection from './PlaceholdersSection';
import { RichTextEditor } from './RichTextEditor';
import { Button } from '@/components/ui/button';

export function AffidavitTemplateForm({
  mode,
  initialData,
  templateName,
  placeholders,
  headerText,
  footerText,
  logoPath,
  logoPosition,
  logoSize,
  textBlocks,
  signatureSettings,
  defaultFontFamily,
  defaultFontSize,
  onTemplateNameChange,
  onPlaceholdersChange,
  onHeaderTextChange,
  onFooterTextChange,
  onLogoPathChange,
  onLogoPositionChange,
  onLogoSizeChange,
  onTextBlocksChange,
  onSubmit,
  isSubmitting,
  onSignatureSettingsChange,
  onDefaultFontFamilyChange,
  onDefaultFontSizeChange,
  onBaseTemplateFileChange,
  bodyContent = '',
  onBodyContentChange,
}: AffidavitTemplateFormProps) {
  const router = useRouter();
  const quillRef = useRef<any>(null);

  const insertPlaceholder = (placeholder: string) => {
    // Prevent form submission when inserting a placeholder
    setTimeout(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      insertPlaceholderInQuill(quill, placeholder);
      }
    }, 0);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-8"
      onClick={(e) => {
        // Stop click propagation at the form level to prevent unwanted form submissions
        if (e.target === e.currentTarget) {
          e.stopPropagation();
        }
      }}
    >
      {/* Template Details */}
      <TemplateDetailsSection
        templateName={templateName}
        headerText={headerText}
        footerText={footerText}
        defaultFontFamily={defaultFontFamily}
        defaultFontSize={defaultFontSize}
        onTemplateNameChange={onTemplateNameChange}
        onHeaderTextChange={onHeaderTextChange}
        onFooterTextChange={onFooterTextChange}
        onDefaultFontFamilyChange={onDefaultFontFamilyChange}
        onDefaultFontSizeChange={onDefaultFontSizeChange}
        onBaseTemplateFileChange={onBaseTemplateFileChange}
      />

      {/* Rich Text Editor */}
      <RichTextEditor
        bodyContent={bodyContent}
        onBodyContentChange={onBodyContentChange}
        insertPlaceholder={insertPlaceholder}
      />
      
      {/* Logo Settings */}
      <LogoSettingsSection
        logoPath={logoPath}
        logoPosition={logoPosition}
        logoSize={logoSize}
        onLogoPathChange={onLogoPathChange}
        onLogoPositionChange={onLogoPositionChange}
        onLogoSizeChange={onLogoSizeChange}
      />

      {/* Signature Settings */}
      <SignatureSettingsSection
        signatureSettings={signatureSettings}
        onSignatureSettingsChange={onSignatureSettingsChange}
      />

      {/* Text Blocks */}
      <TextBlocksSection
        textBlocks={textBlocks}
        onTextBlocksChange={onTextBlocksChange}
      />

      {/* Placeholders */}
      <PlaceholdersSection
        onInsertPlaceholder={insertPlaceholder}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Saving...</>
          ) : mode === 'create' ? (
            <>Create Template</>
          ) : (
            <>Update Template</>
          )}
        </Button>
      </div>
    </form>
  );
} 