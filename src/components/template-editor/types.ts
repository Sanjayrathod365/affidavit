// Types and interfaces for Affidavit Template Components

// Define a type for the Delta object from Quill
export interface DeltaOperation {
  insert?: any;
  delete?: number;
  retain?: number;
  attributes?: Record<string, any>;
}

export interface DeltaType {
  ops: DeltaOperation[];
  retain: (length: number, attributes?: Record<string, any>) => DeltaType;
  insert: (text: string, attributes?: Record<string, any>) => DeltaType;
  delete: (length: number) => DeltaType;
  filter: (predicate: (op: DeltaOperation) => boolean) => DeltaOperation[];
  forEach: (predicate: (op: DeltaOperation) => void) => void;
  map: <T>(predicate: (op: DeltaOperation) => T) => T[];
  partition: (predicate: (op: DeltaOperation) => boolean) => [DeltaOperation[], DeltaOperation[]];
  reduce: <T>(predicate: (acc: T, op: DeltaOperation, index: number) => T, initial: T) => T;
  chop: () => DeltaType;
  length: () => number;
  slice: (start?: number, end?: number) => DeltaType;
  compose: (other: DeltaType) => DeltaType;
  concat: (other: DeltaType) => DeltaType;
  diff: (other: DeltaType, index?: number) => DeltaType;
  eachLine: (predicate: (line: DeltaType, attributes: Record<string, any>, index: number) => any, newline?: string) => void;
  transform: (other: DeltaType, priority?: boolean) => DeltaType;
  transformPosition: (index: number, priority?: boolean) => number;
}

export interface Position { 
  x?: number; 
  y?: number; 
  page?: number; 
}

export interface Styles {
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
}

export interface Placeholder {
  id: string;
  name: string;
  description?: string;
  type: 'text' | 'date' | 'checkbox' | 'signature';
  defaultValue?: string;
  required: boolean;
  styles?: Styles;
  position?: Position;
}

export interface LogoSettings { 
  position?: Position; 
  size?: { 
    width?: number; 
    height?: number 
  }; 
}

export interface LogoSize {
  width: number;
  height: number;
}

export interface SignatureSettings {
  enabled: boolean;
  label: string;
  position: { x: number; y: number };
}

export interface TextBlock {
  id: string;
  content: string;
  position: Position;
  styles: Styles;
}

export interface AffidavitTemplateFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id?: string;
    name?: string;
    filePath?: string;
    logoPath?: string | null;
    fontFamily?: string;
    fontSize?: number;
    structure?: {
      placeholders?: Placeholder[];
      header?: { text?: string };
      footer?: { text?: string };
      logoSettings?: LogoSettings;
      textBlocks?: TextBlock[];
      signatureSettings?: SignatureSettings;
    };
  };
  templateName: string;
  placeholders: Placeholder[];
  headerText: string;
  footerText: string;
  logoPath: string | null;
  logoPosition: Position;
  logoSize: LogoSize;
  textBlocks: TextBlock[];
  signatureSettings: SignatureSettings;
  defaultFontFamily: string;
  defaultFontSize: number;
  onTemplateNameChange: (name: string) => void;
  onPlaceholdersChange: (placeholders: Placeholder[]) => void;
  onHeaderTextChange: (text: string) => void;
  onFooterTextChange: (text: string) => void;
  onLogoPathChange: (path: string | null) => void;
  onLogoPositionChange: (position: Position) => void;
  onLogoSizeChange: (size: LogoSize) => void;
  onTextBlocksChange: (textBlocks: TextBlock[]) => void;
  onSignatureSettingsChange: (settings: SignatureSettings) => void;
  onDefaultFontFamilyChange: (font: string) => void;
  onDefaultFontSizeChange?: (size: number) => void;
  onSubmit: (event: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  onBaseTemplateFileChange?: (file: File | null) => void;
  bodyContent?: string;
  onBodyContentChange: (content: string) => void;
}

// Group the placeholders by category for better organization
export const PLACEHOLDER_CATEGORIES = {
  Patient: [
    "{{patient_name}}",
    "{{patient_dob}}",
    "{{patient_doi}}",
    "{{patient_address}}",
  ],
  Provider: [
    "{{provider_name}}",
    "{{provider_credentials}}",
    "{{provider_fax_br}}",
    "{{provider_fax_mr}}",
    "{{provider_email_br}}",
    "{{provider_email_mr}}",
    "{{provider_mail_br}}",
    "{{provider_mail_mr}}",
    "{{provider_smart_portal_br}}",
    "{{provider_smart_portal_mr}}",
    "{{provider_smart_folder}}",
  ],
  Signatures: [
    "{{signature_patient}}",
    "{{signature_provider}}",
    "{{witness_name}}",
    "{{signature_witness}}",
  ],
  Dates: [
    "{{current_date}}",
    "{{dos_range}}",
  ],
  Documentation: [
    "{{document_id}}",
    "{{case_number}}",
    "{{provider_submission_methods}}",
  ],
};

// Flatten the categories for backward compatibility
export const PREDEFINED_PLACEHOLDERS = Object.values(PLACEHOLDER_CATEGORIES).flat();

// Define standard font families
export const standardFonts = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Georgia",
  "Roboto", // Common web font
  "Lato",   // Common web font
  "Open Sans", // Common web font
];

// Add custom styles for the placeholders
export const customStyles = `
  .affidavit-placeholder {
    background-color: #e8f0fe;
    color: #1a73e8;
    font-weight: bold;
    padding: 2px 4px;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
  }

  .affidavit-placeholder:hover {
    background-color: #d0e1fc;
  }

  .ql-placeholder {
    position: relative;
    width: 28px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #444;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .ql-placeholder:hover {
    color: #06c;
  }
  
  .ql-placeholder::after {
    content: '{ }';
  }
  
  .placeholder-dropdown-content {
    z-index: 1000;
    min-width: 200px;
  }
`; 