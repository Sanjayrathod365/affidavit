'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AffidavitTemplateForm } from '@/components/AffidavitTemplateForm';
import { TemplatePreview } from '@/components/TemplatePreview';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Position {
  x?: number;
  y?: number;
  page?: number;
}

interface Styles {
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
}

interface Placeholder {
  id: string;
  name: string;
  position?: Position;
  styles?: Styles;
  defaultValue?: string;
  required: boolean;
  type: 'text' | 'date' | 'checkbox' | 'signature';
  description?: string;
}

interface LogoSize {
  width: number;
  height: number;
}

interface LogoSettings {
  position?: Position;
  size?: LogoSize;
  path?: string;
}

interface TextBlock {
  id: string;
  content: string;
  position: Position;
  styles: Styles;
}

interface SignatureSettings {
  enabled: boolean;
  label: string;
  position: { x: number; y: number };
}

const initialSignatureSettings: SignatureSettings = {
  enabled: false,
  label: 'Signature:',
  position: { x: 50, y: 700 },
};

export default function NewAffidavitTemplatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [templateName, setTemplateName] = useState('New Template');
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState<Position>({ x: 40, y: 40 });
  const [logoSize, setLogoSize] = useState<LogoSize>({ width: 100, height: 0 });
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [signatureSettings, setSignatureSettings] = useState<SignatureSettings>(initialSignatureSettings);
  const [baseTemplateFile, setBaseTemplateFile] = useState<File | null>(null);
  const [bodyContent, setBodyContent] = useState('');
  const [defaultFontFamily, setDefaultFontFamily] = useState('Arial');
  const [defaultFontSize, setDefaultFontSize] = useState(12);

  const derivedLogoSettings: LogoSettings = {
    position: logoPosition,
    size: logoSize,
    path: logoPath ?? undefined,
  };

  const handleSaveTemplate = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!templateName.trim()) {
      toast.error('Template name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const structure = {
        placeholders,
        textBlocks,
        signatureSettings,
        documentSettings: { pageSize: 'Letter' as const, orientation: 'portrait' as const },
        header: headerText ? { text: headerText } : undefined,
        footer: footerText ? { text: footerText } : undefined,
        logoSettings: logoPath ? { path: logoPath, position: logoPosition, size: logoSize } : undefined
      };

      const formData = new FormData();
      formData.append('name', templateName);
      formData.append('structure', JSON.stringify(structure));
      if (logoPath) formData.append('logoPath', logoPath);
      if (baseTemplateFile) formData.append('baseTemplate', baseTemplateFile);
      if (bodyContent) {
        formData.append('bodyContent', bodyContent);
      }

      // --- Debugging log --- 
      console.log('Submitting FormData:');
      formData.forEach((value, key) => {
          console.log(`${key}:`, value);
      });
      console.log('Stringified structure being sent:', JSON.stringify(structure, null, 2));
      // --- End Debugging log ---

      const response = await fetch('/api/affidavit-templates', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to save template';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch (e) {
          console.error("Could not parse error response as JSON:", errorText);
        }
        throw new Error(errorMessage);
      }

      toast.success('Template created successfully');
      router.push('/affidavit-templates');
      router.refresh();

    } catch (error) {
      console.error('Error saving template:', error);
      toast.error(`Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [templateName, placeholders, textBlocks, signatureSettings, headerText, footerText, logoPath, logoPosition, logoSize, baseTemplateFile, bodyContent, router]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Affidavit Template</h1>
        <Button variant="outline" asChild>
          <Link href="/affidavit-templates">Cancel</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:overflow-y-auto lg:max-h-[calc(100vh-10rem)] pr-4">
          <h2 className="text-xl font-semibold mb-4">Template Editor</h2>
          <AffidavitTemplateForm
            mode="create"
            templateName={templateName}
            onTemplateNameChange={setTemplateName}
            headerText={headerText}
            onHeaderTextChange={setHeaderText}
            footerText={footerText}
            onFooterTextChange={setFooterText}
            placeholders={placeholders}
            onPlaceholdersChange={setPlaceholders}
            textBlocks={textBlocks}
            onTextBlocksChange={setTextBlocks}
            logoPath={logoPath}
            onLogoPathChange={setLogoPath}
            logoPosition={logoPosition}
            onLogoPositionChange={setLogoPosition}
            logoSize={logoSize}
            onLogoSizeChange={setLogoSize}
            signatureSettings={signatureSettings}
            onSignatureSettingsChange={setSignatureSettings}
            onBaseTemplateFileChange={setBaseTemplateFile}
            onSubmit={handleSaveTemplate}
            isSubmitting={isSubmitting}
            bodyContent={bodyContent}
            onBodyContentChange={setBodyContent}
            defaultFontFamily={defaultFontFamily}
            defaultFontSize={defaultFontSize}
            onDefaultFontFamilyChange={setDefaultFontFamily}
            onDefaultFontSizeChange={setDefaultFontSize}
          />
        </div>

        <div className="sticky top-4 self-start">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          <div className="border rounded-lg shadow-sm overflow-hidden">
            <TemplatePreview
              placeholders={placeholders}
              textBlocks={textBlocks}
              logoPath={logoPath}
              logoSettings={derivedLogoSettings}
              signatureSettings={signatureSettings}
              bodyContent={bodyContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 