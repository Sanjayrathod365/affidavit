'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { FileText, Download } from 'lucide-react';

interface Placeholder {
  id: string;
  name: string;
  description?: string;
  type: 'text' | 'date' | 'checkbox' | 'signature';
  defaultValue?: string;
  required: boolean;
}

interface AffidavitTemplate {
  id: string;
  name: string;
  structure: {
    placeholders: Placeholder[];
  };
}

interface AffidavitGeneratorProps {
  templateId?: string;
  patientId?: string;
  providerId?: string;
  initialData?: {
    [key: string]: string | boolean | null;
  };
}

export function AffidavitGenerator({
  templateId,
  patientId,
  providerId,
  initialData = {}
}: AffidavitGeneratorProps) {
  const [templates, setTemplates] = useState<AffidavitTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AffidavitTemplate | null>(null);
  const [placeholderValues, setPlaceholderValues] = useState<{ [key: string]: string | boolean | null }>({});
  const [generating, setGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/affidavit-templates');
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        
        const data = await response.json();
        setTemplates(data.data || []);
        
        // If templateId is provided, set it as selected
        if (templateId && data.data) {
          const template = data.data.find((t: any) => t.id === templateId);
          if (template) {
            setSelectedTemplate(template);
            initializePlaceholderValues(template, initialData);
          }
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        setError('Failed to load affidavit templates');
        toast.error('Failed to load templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [templateId, initialData]);

  // Initialize placeholder values with default values or initial data
  const initializePlaceholderValues = (template: AffidavitTemplate, initialData: any = {}) => {
    const values: { [key: string]: string | boolean | null } = { ...initialData };
    
    template.structure.placeholders.forEach(placeholder => {
      if (!(placeholder.name in values)) {
        if (placeholder.type === 'checkbox') {
          values[placeholder.name] = placeholder.defaultValue === 'true' || false;
        } else {
          values[placeholder.name] = placeholder.defaultValue || '';
        }
      }
    });
    
    setPlaceholderValues(values);
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    if (!templateId) {
      setSelectedTemplate(null);
      setPlaceholderValues({});
      return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      initializePlaceholderValues(template, initialData);
    }
  };

  const handlePlaceholderChange = (name: string, value: string | boolean) => {
    setPlaceholderValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateAffidavit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AffidavitGenerator] handleGenerateAffidavit called');

    if (!selectedTemplate) {
      console.log('[AffidavitGenerator] No template selected');
      toast.error('Please select a template');
      return;
    }
    console.log('[AffidavitGenerator] Template selected:', selectedTemplate.id);

    // Validate required fields
    let missingFields: string[] = [];
    try {
        missingFields = selectedTemplate.structure.placeholders
        .filter(p => p.required && !placeholderValues[p.name])
        .map(p => p.name);
        console.log('[AffidavitGenerator] Validation check - Missing fields:', missingFields);
    } catch (validationError) {
        console.error('[AffidavitGenerator] Error during validation:', validationError);
        toast.error('Error during validation check.');
        return;
    }

    if (missingFields.length > 0) {
      console.log('[AffidavitGenerator] Validation failed:', missingFields);
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    console.log('[AffidavitGenerator] Validation passed');

    try {
      setGenerating(true);
      console.log('[AffidavitGenerator] Starting generation API call...');

      const response = await fetch('/api/affidavit-templates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          placeholderData: placeholderValues,
          patientId,
          providerId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate affidavit');
      }
      
      const data = await response.json();
      
      if (data.data?.url && data.data?.affidavitId) {
        setGeneratedPdfUrl(data.data.url);
        toast.success('Affidavit generated and saved successfully!');
      } else {
        console.error('[AffidavitGenerator] Invalid response from API:', data);
        throw new Error('Invalid response after generating affidavit');
      }
    } catch (error) {
      console.error('[AffidavitGenerator] Error during API call or processing:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate affidavit');
    } finally {
      setGenerating(false);
      console.log('[AffidavitGenerator] handleGenerateAffidavit finished');
    }
  };

  if (loading) {
    return <div className="text-center py-6">Loading templates...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  console.log('[AffidavitGenerator] Rendering component');

  return (
    <div className="space-y-6">
      <form onSubmit={handleGenerateAffidavit}>
        <Card>
          <CardHeader>
            <CardTitle>Generate Affidavit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!templateId && (
              <div className="space-y-2">
                <Label htmlFor="template">Select Template</Label>
                <select
                  id="template"
                  value={selectedTemplate?.id || ''}
                  onChange={handleTemplateChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select a template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedTemplate && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Fill in the details for {selectedTemplate.name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.structure.placeholders.map(placeholder => (
                    <div key={placeholder.id} className="space-y-2">
                      <Label htmlFor={placeholder.id}>
                        {placeholder.name} {placeholder.required && <span className="text-red-500">*</span>}
                      </Label>
                      
                      {placeholder.description && (
                        <p className="text-sm text-muted-foreground">{placeholder.description}</p>
                      )}
                      
                      {placeholder.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={placeholder.id}
                            checked={!!placeholderValues[placeholder.name]}
                            onCheckedChange={(checked: boolean | "indeterminate") => 
                              handlePlaceholderChange(placeholder.name, !!checked)
                            }
                          />
                          <Label htmlFor={placeholder.id}>
                            {placeholder.defaultValue || 'Yes'}
                          </Label>
                        </div>
                      ) : placeholder.type === 'date' ? (
                        <Input
                          id={placeholder.id}
                          type="date"
                          value={placeholderValues[placeholder.name] as string || ''}
                          onChange={(e) => handlePlaceholderChange(placeholder.name, e.target.value)}
                          required={placeholder.required}
                        />
                      ) : (
                        <Input
                          id={placeholder.id}
                          type="text"
                          value={placeholderValues[placeholder.name] as string || ''}
                          onChange={(e) => handlePlaceholderChange(placeholder.name, e.target.value)}
                          placeholder={`Enter ${placeholder.name}`}
                          required={placeholder.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                disabled={!selectedTemplate || generating}
                className="w-full"
                onClick={() => console.log('[AffidavitGenerator] Generate button clicked')}
              >
                {generating ? 'Generating...' : 'Generate Affidavit'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {generatedPdfUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Affidavit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-muted p-4 rounded-md">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                <span>Affidavit PDF</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={generatedPdfUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                >
                  <a href={generatedPdfUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 