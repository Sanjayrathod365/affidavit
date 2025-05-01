'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AffidavitTemplateForm } from '@/components/AffidavitTemplateForm';
import { TemplatePreview } from '@/components/TemplatePreview';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Position { x?: number; y?: number; page?: number; }
interface Styles { fontSize?: number; fontWeight?: 'normal' | 'bold'; textAlign?: 'left' | 'center' | 'right'; }
interface Placeholder {
    id: string;
    name: string;
    description?: string;
    type: 'text' | 'date' | 'checkbox' | 'signature';
    defaultValue?: string;
    required: boolean;
    styles?: Styles;
    position?: Position;
}
interface TextBlock {
    id: string;
    content: string;
    position: Position;
    styles: Styles;
}
interface LogoSize { width: number; height: number; }
interface LogoSettings { position?: Position; size?: LogoSize; path?: string; }
interface SignatureSettings {
    enabled: boolean;
    label: string;
    position: { x: number; y: number };
}

const initialSignatureSettings: SignatureSettings = {
    enabled: false,
    label: 'Signature:',
    position: { x: 50, y: 700 }
};

interface EditAffidavitTemplatePageProps {
  params: {
    id: string;
  };
}

export default function EditAffidavitTemplatePage({ params }: EditAffidavitTemplatePageProps) {
  const router = useRouter();
  const [initialTemplateData, setInitialTemplateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [templateName, setTemplateName] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState<Position>({ x: 40, y: 40 });
  const [logoSize, setLogoSize] = useState<LogoSize>({ width: 100, height: 0 });
  const [signatureSettings, setSignatureSettings] = useState<SignatureSettings>(initialSignatureSettings);
  const [baseTemplateFile, setBaseTemplateFile] = useState<File | null>(null);
  const [defaultFontFamily, setDefaultFontFamily] = useState<string>('Arial');
  const [defaultFontSize, setDefaultFontSize] = useState<number>(12);
  const [bodyContent, setBodyContent] = useState('');

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/affidavit-templates/${params.id}`);
        if (!response.ok) {
            if (response.status === 404) {
                 throw new Error('Template not found');
            }
            const errorText = await response.text();
            throw new Error(`Failed to fetch template: ${response.status} ${errorText}`);
        }
        
        const fetchedTemplate = await response.json(); 
        
        if (!fetchedTemplate || typeof fetchedTemplate !== 'object' || !fetchedTemplate.id) {
           console.error('Received invalid data format from API:', fetchedTemplate);
           throw new Error('Invalid template data received');
        }

        setInitialTemplateData(fetchedTemplate);

        setTemplateName(fetchedTemplate.name || '');
        setLogoPath(fetchedTemplate.logoPath || null);

        let structure: any = {};
        if (fetchedTemplate.structure && typeof fetchedTemplate.structure === 'string') {
            try {
                structure = JSON.parse(fetchedTemplate.structure);
            } catch (parseError) {
                console.error("Failed to parse template structure:", parseError);
                toast.error('Failed to parse template structure. Some fields might be missing.');
                structure = {};
            }
        }
        else if (fetchedTemplate.structure && typeof fetchedTemplate.structure === 'object') {
            structure = fetchedTemplate.structure;
        }

        setHeaderText(structure.header?.text || '');
        setFooterText(structure.footer?.text || '');
        setPlaceholders((structure.placeholders || []).map((p: any) => ({ ...p, id: p.id || crypto.randomUUID(), styles: { fontSize: 12, fontWeight: 'normal', textAlign: 'left', ...p.styles }, position: { x: 0, y: 0, page: 1, ...p.position} })) );
        setTextBlocks((structure.textBlocks || []).map((tb: any) => ({ ...tb, id: tb.id || crypto.randomUUID(), styles: { fontSize: 12, fontWeight: 'normal', textAlign: 'left', ...tb.styles }, position: { x: 0, y: 0, page: 1, ...tb.position } })) );

        setSignatureSettings({ ...initialSignatureSettings, ...(structure.signatureSettings || {}) });

        const fetchedLogoSettings = structure.logoSettings || {};
        setLogoPosition(fetchedLogoSettings.position || { x: 40, y: 40 });
        setLogoSize(fetchedLogoSettings.size || { width: 100, height: 0 });
        if (fetchedLogoSettings.path) {
            setLogoPath(fetchedLogoSettings.path);
        }
        
        setDefaultFontFamily(fetchedTemplate.fontFamily || 'Arial');
        setDefaultFontSize(fetchedTemplate.fontSize || 12);

        setBodyContent(fetchedTemplate.bodyContent || '');

      } catch (err) {
        console.error('Error fetching template:', err);
        const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMsg);
        toast.error(`Failed to load template: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [params.id]);

  const handleUpdateTemplateSubmit = useCallback(async (event: React.FormEvent) => {
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

        const response = await fetch(`/api/affidavit-templates?id=${params.id}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Failed to update template';
            try {
             const errorJson = JSON.parse(errorText);
             errorMessage = errorJson.error || errorJson.message || errorMessage;
            } catch(e) {
             console.error("Could not parse error response as JSON:", errorText);
            }
           throw new Error(errorMessage);
         }

        toast.success('Template updated successfully');
        router.push('/affidavit-templates');
        router.refresh();

    } catch (error) {
        console.error('Error updating template:', error);
        toast.error(`Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        setIsSubmitting(false);
    }
  }, [
    params.id, templateName, placeholders, textBlocks, signatureSettings, headerText, footerText, 
    logoPath, logoPosition, logoSize, baseTemplateFile, defaultFontFamily, defaultFontSize, router, bodyContent
  ]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <p>Loading template data...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="text-center py-12 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Template</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Button variant="outline" asChild>
             <Link href="/affidavit-templates">Back to Templates</Link>
          </Button>
        </div>
      </div>
    );
  }
  if (!initialTemplateData) {
     return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <p>Template data could not be loaded.</p>
         </div>
      </div>
     );
  }

  const derivedLogoSettings: LogoSettings = {
      position: logoPosition,
      size: logoSize,
      path: logoPath ?? undefined
  };

  return (
     <div className="container mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Affidavit Template: {initialTemplateData.name}</h1>
                 <Button variant="outline" asChild>
                     <Link href="/affidavit-templates">Cancel</Link>
                 </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:overflow-y-auto lg:max-h-[calc(100vh-10rem)] pr-4">
                    <h2 className="text-xl font-semibold mb-4">Template Editor</h2>
                    <AffidavitTemplateForm
                        mode="edit"
                        initialData={initialTemplateData}
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
                        defaultFontFamily={defaultFontFamily}
                        defaultFontSize={defaultFontSize}
                        onDefaultFontFamilyChange={setDefaultFontFamily}
                        onDefaultFontSizeChange={setDefaultFontSize}
                        onBaseTemplateFileChange={setBaseTemplateFile}
                        onSubmit={handleUpdateTemplateSubmit}
                        isSubmitting={isSubmitting}
                        bodyContent={bodyContent}
                        onBodyContentChange={setBodyContent}
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