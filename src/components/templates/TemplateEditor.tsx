'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, MoveVertical, Settings, FileText, AlignLeft } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

// Define template schema
const templateSchema = z.object({
  name: z.string().min(1, { message: 'Template name is required' }),
  description: z.string().optional(),
  placeholders: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, { message: 'Placeholder name is required' }),
    description: z.string().optional(),
    type: z.enum(['text', 'date', 'checkbox', 'signature']),
    defaultValue: z.string().optional(),
    required: z.boolean().default(false),
    styles: z.object({
      fontFamily: z.string().optional(),
      fontSize: z.number().optional(),
      fontWeight: z.enum(['normal', 'bold']).optional(),
      fontStyle: z.enum(['normal', 'italic']).optional(),
      color: z.string().optional(),
    }).optional(),
    position: z.object({
      x: z.number().optional(),
      y: z.number().optional(),
      page: z.number().optional(),
    }).optional(),
  })),
  documentSettings: z.object({
    pageSize: z.enum(['A4', 'Letter', 'Legal']).default('Letter'),
    margins: z.object({
      top: z.number(),
      right: z.number(),
      bottom: z.number(),
      left: z.number(),
    }).optional(),
    orientation: z.enum(['portrait', 'landscape']).default('portrait'),
  }).optional(),
  header: z.object({
    text: z.string().optional(),
    styles: z.object({
      fontFamily: z.string().optional(),
      fontSize: z.number().optional(),
      fontWeight: z.enum(['normal', 'bold']).optional(),
      alignment: z.enum(['left', 'center', 'right']).optional(),
    }).optional(),
  }).optional(),
  footer: z.object({
    text: z.string().optional(),
    styles: z.object({
      fontFamily: z.string().optional(),
      fontSize: z.number().optional(),
      alignment: z.enum(['left', 'center', 'right']).optional(),
    }).optional(),
  }).optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

// Font options
const fontOptions = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
];

// Placeholder type options
const placeholderTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'signature', label: 'Signature' },
];

interface TemplateEditorProps {
  initialData?: any;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export default function TemplateEditor({ initialData, onSave, isLoading = false }: TemplateEditorProps) {
  const defaultPlaceholder = {
    id: uuidv4(),
    name: '',
    description: '',
    type: 'text',
    defaultValue: '',
    required: false,
    styles: {
      fontFamily: 'Arial',
      fontSize: 12,
      fontWeight: 'normal',
      fontStyle: 'normal',
      color: '#000000',
    },
    position: {
      x: 0,
      y: 0,
      page: 1,
    },
  };

  const defaultValues: TemplateFormValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    placeholders: initialData?.placeholders || [defaultPlaceholder],
    documentSettings: initialData?.documentSettings || {
      pageSize: 'Letter',
      margins: { top: 72, right: 72, bottom: 72, left: 72 }, // 1 inch in points
      orientation: 'portrait',
    },
    header: initialData?.header || {
      text: '',
      styles: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'normal',
        alignment: 'center',
      },
    },
    footer: initialData?.footer || {
      text: '',
      styles: {
        fontFamily: 'Arial',
        fontSize: 10,
        alignment: 'center',
      },
    },
  };

  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues,
  });

  const [placeholders, setPlaceholders] = useState(defaultValues.placeholders);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [baseTemplateFile, setBaseTemplateFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Watch form values
  const watchedPlaceholders = watch('placeholders');

  useEffect(() => {
    setPlaceholders(watchedPlaceholders);
  }, [watchedPlaceholders]);

  // Add a new placeholder
  const addPlaceholder = () => {
    const newPlaceholder = {
      id: uuidv4(),
      name: '',
      description: '',
      type: 'text',
      defaultValue: '',
      required: false,
      styles: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
      },
      position: {
        x: 0,
        y: 0,
        page: 1,
      },
    };
    
    setValue('placeholders', [...placeholders, newPlaceholder]);
  };

  // Remove a placeholder
  const removePlaceholder = (id: string) => {
    setValue('placeholders', placeholders.filter(p => p.id !== id));
  };

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(placeholders);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setValue('placeholders', items);
  };

  // Handle file inputs
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      
      // Create a preview URL
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(url);
    }
  };

  const handleBaseTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBaseTemplateFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const onSubmit = async (data: TemplateFormValues) => {
    // Create form data to include files
    const formData = new FormData();
    
    // Add non-file data as JSON
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('structure', JSON.stringify({
      placeholders: data.placeholders,
      documentSettings: data.documentSettings,
      header: data.header,
      footer: data.footer,
    }));
    
    // Add files if present
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    
    if (baseTemplateFile) {
      formData.append('baseTemplate', baseTemplateFile);
    }
    
    // Call the parent's onSave function
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Template Information</CardTitle>
          <CardDescription>Enter the basic information for your template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter template name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter template description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="baseTemplate">Base Template Document (Optional)</Label>
            <Input
              id="baseTemplate"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleBaseTemplateChange}
            />
            <p className="text-sm text-gray-500">Upload a PDF or Word document to use as the base template</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo">Logo (Optional)</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
            {previewUrl && (
              <div className="mt-2">
                <img src={previewUrl} alt="Logo preview" className="max-h-20 border rounded" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="placeholders">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="placeholders" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Placeholders
          </TabsTrigger>
          <TabsTrigger value="document" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Document Settings
          </TabsTrigger>
          <TabsTrigger value="header-footer" className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4" />
            Header & Footer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="placeholders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Placeholders</CardTitle>
              <CardDescription>Define the placeholders for your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                type="button" 
                onClick={addPlaceholder}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Placeholder
              </Button>
              
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="placeholders">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {placeholders.map((placeholder, index) => (
                        <Draggable 
                          key={placeholder.id} 
                          draggableId={placeholder.id} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border rounded-md p-4 relative bg-white"
                            >
                              <div className="flex justify-between mb-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move p-1 hover:bg-gray-100 rounded-md"
                                >
                                  <MoveVertical className="h-5 w-5 text-gray-500" />
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePlaceholder(placeholder.id)}
                                  className="h-6 w-6 p-0 rounded-full hover:bg-red-100"
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`placeholders.${index}.name`}>
                                    Name
                                  </Label>
                                  <Input
                                    id={`placeholders.${index}.name`}
                                    {...register(`placeholders.${index}.name`)}
                                    placeholder="e.g. patientName"
                                  />
                                  {errors.placeholders?.[index]?.name && (
                                    <p className="text-sm text-red-500">
                                      {errors.placeholders[index]?.name?.message}
                                    </p>
                                  )}
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`placeholders.${index}.type`}>
                                    Type
                                  </Label>
                                  <Select
                                    onValueChange={(value) => setValue(`placeholders.${index}.type`, value as any)}
                                    defaultValue={placeholder.type}
                                  >
                                    <SelectTrigger id={`placeholders.${index}.type`}>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {placeholderTypeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`placeholders.${index}.description`}>
                                    Description
                                  </Label>
                                  <Input
                                    id={`placeholders.${index}.description`}
                                    {...register(`placeholders.${index}.description`)}
                                    placeholder="Optional description"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`placeholders.${index}.defaultValue`}>
                                    Default Value
                                  </Label>
                                  <Input
                                    id={`placeholders.${index}.defaultValue`}
                                    {...register(`placeholders.${index}.defaultValue`)}
                                    placeholder="Optional default value"
                                  />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`placeholders.${index}.required`}
                                    checked={placeholder.required}
                                    onCheckedChange={(checked) => 
                                      setValue(`placeholders.${index}.required`, checked as boolean)
                                    }
                                  />
                                  <Label htmlFor={`placeholders.${index}.required`}>
                                    Required field
                                  </Label>
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Styling</h4>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`placeholders.${index}.styles.fontFamily`}>
                                      Font
                                    </Label>
                                    <Select
                                      onValueChange={(value) => setValue(`placeholders.${index}.styles.fontFamily`, value)}
                                      defaultValue={placeholder.styles?.fontFamily || 'Arial'}
                                    >
                                      <SelectTrigger id={`placeholders.${index}.styles.fontFamily`}>
                                        <SelectValue placeholder="Select font" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {fontOptions.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor={`placeholders.${index}.styles.fontSize`}>
                                      Size
                                    </Label>
                                    <Input
                                      id={`placeholders.${index}.styles.fontSize`}
                                      type="number"
                                      defaultValue={placeholder.styles?.fontSize || 12}
                                      onChange={(e) => setValue(`placeholders.${index}.styles.fontSize`, parseInt(e.target.value))}
                                      min={6}
                                      max={72}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor={`placeholders.${index}.styles.color`}>
                                      Color
                                    </Label>
                                    <Input
                                      id={`placeholders.${index}.styles.color`}
                                      type="color"
                                      defaultValue={placeholder.styles?.color || '#000000'}
                                      onChange={(e) => setValue(`placeholders.${index}.styles.color`, e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="document" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Settings</CardTitle>
              <CardDescription>Configure page size, orientation and margins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentSettings.pageSize">Page Size</Label>
                  <Select
                    onValueChange={(value) => setValue('documentSettings.pageSize', value as any)}
                    defaultValue={defaultValues.documentSettings?.pageSize}
                  >
                    <SelectTrigger id="documentSettings.pageSize">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documentSettings.orientation">Orientation</Label>
                  <Select
                    onValueChange={(value) => setValue('documentSettings.orientation', value as any)}
                    defaultValue={defaultValues.documentSettings?.orientation}
                  >
                    <SelectTrigger id="documentSettings.orientation">
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Margins (in points)</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentSettings.margins.top">Top</Label>
                    <Input
                      id="documentSettings.margins.top"
                      type="number"
                      defaultValue={defaultValues.documentSettings?.margins?.top}
                      onChange={(e) => setValue('documentSettings.margins.top', parseInt(e.target.value))}
                      min={0}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="documentSettings.margins.right">Right</Label>
                    <Input
                      id="documentSettings.margins.right"
                      type="number"
                      defaultValue={defaultValues.documentSettings?.margins?.right}
                      onChange={(e) => setValue('documentSettings.margins.right', parseInt(e.target.value))}
                      min={0}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="documentSettings.margins.bottom">Bottom</Label>
                    <Input
                      id="documentSettings.margins.bottom"
                      type="number"
                      defaultValue={defaultValues.documentSettings?.margins?.bottom}
                      onChange={(e) => setValue('documentSettings.margins.bottom', parseInt(e.target.value))}
                      min={0}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="documentSettings.margins.left">Left</Label>
                    <Input
                      id="documentSettings.margins.left"
                      type="number"
                      defaultValue={defaultValues.documentSettings?.margins?.left}
                      onChange={(e) => setValue('documentSettings.margins.left', parseInt(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="header-footer" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Header & Footer</CardTitle>
              <CardDescription>Configure header and footer content and styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Header</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="header.text">Header Text</Label>
                    <Textarea
                      id="header.text"
                      {...register('header.text')}
                      placeholder="Enter header text"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="header.styles.fontFamily">Font</Label>
                      <Select
                        onValueChange={(value) => setValue('header.styles.fontFamily', value)}
                        defaultValue={defaultValues.header?.styles?.fontFamily}
                      >
                        <SelectTrigger id="header.styles.fontFamily">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="header.styles.fontSize">Size</Label>
                      <Input
                        id="header.styles.fontSize"
                        type="number"
                        defaultValue={defaultValues.header?.styles?.fontSize}
                        onChange={(e) => setValue('header.styles.fontSize', parseInt(e.target.value))}
                        min={6}
                        max={72}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="header.styles.alignment">Alignment</Label>
                      <Select
                        onValueChange={(value) => setValue('header.styles.alignment', value as any)}
                        defaultValue={defaultValues.header?.styles?.alignment}
                      >
                        <SelectTrigger id="header.styles.alignment">
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
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Footer</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="footer.text">Footer Text</Label>
                    <Textarea
                      id="footer.text"
                      {...register('footer.text')}
                      placeholder="Enter footer text"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="footer.styles.fontFamily">Font</Label>
                      <Select
                        onValueChange={(value) => setValue('footer.styles.fontFamily', value)}
                        defaultValue={defaultValues.footer?.styles?.fontFamily}
                      >
                        <SelectTrigger id="footer.styles.fontFamily">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="footer.styles.fontSize">Size</Label>
                      <Input
                        id="footer.styles.fontSize"
                        type="number"
                        defaultValue={defaultValues.footer?.styles?.fontSize}
                        onChange={(e) => setValue('footer.styles.fontSize', parseInt(e.target.value))}
                        min={6}
                        max={72}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="footer.styles.alignment">Alignment</Label>
                      <Select
                        onValueChange={(value) => setValue('footer.styles.alignment', value as any)}
                        defaultValue={defaultValues.footer?.styles?.alignment}
                      >
                        <SelectTrigger id="footer.styles.alignment">
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
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Template'}
        </Button>
      </div>
    </form>
  );
} 