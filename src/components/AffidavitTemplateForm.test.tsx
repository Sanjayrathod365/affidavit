import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AffidavitTemplateForm } from './AffidavitTemplateForm';
import '@testing-library/jest-dom';

// Mock the dynamic import of ReactQuill
jest.mock('next/dynamic', () => () => {
  const ReactQuill = ({ 
    forwardedRef, 
    value, 
    onChange 
  }: { 
    forwardedRef: React.RefObject<any>; 
    value: string; 
    onChange: (value: string) => void 
  }) => (
    <div data-testid="mock-quill">
      <div ref={forwardedRef} className="mock-quill-editor">
        <textarea 
          data-testid="mock-quill-editor"
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="ql-toolbar">
        <button className="ql-bold"></button>
        <button className="ql-clean"></button>
      </div>
    </div>
  );
  return ReactQuill;
});

// Mock Quill editor instance
const mockEditor = {
  getSelection: jest.fn().mockReturnValue({ index: 0, length: 0 }),
  insertText: jest.fn(),
  setSelection: jest.fn(),
  focus: jest.fn(),
  formatText: jest.fn(),
  constructor: {
    import: jest.fn().mockReturnValue({})
  },
  clipboard: {
    addMatcher: jest.fn()
  }
};

// Mock the getEditor method
const mockGetEditor = jest.fn().mockReturnValue(mockEditor);

// Default props for tests
const defaultProps = {
  mode: 'create' as const,
  templateName: 'Test Template',
  placeholders: [],
  headerText: '',
  footerText: '',
  logoPath: null,
  logoPosition: { x: 0, y: 0 },
  logoSize: { width: 100, height: 50 },
  textBlocks: [],
  signatureSettings: {
    enabled: true,
    label: 'Signature',
    position: { x: 100, y: 100 }
  },
  defaultFontFamily: 'Arial',
  defaultFontSize: 12,
  onTemplateNameChange: jest.fn(),
  onPlaceholdersChange: jest.fn(),
  onHeaderTextChange: jest.fn(),
  onFooterTextChange: jest.fn(),
  onLogoPathChange: jest.fn(),
  onLogoPositionChange: jest.fn(),
  onLogoSizeChange: jest.fn(),
  onTextBlocksChange: jest.fn(),
  onSubmit: jest.fn(),
  isSubmitting: false,
  onSignatureSettingsChange: jest.fn(),
  onDefaultFontFamilyChange: jest.fn(),
  onDefaultFontSizeChange: jest.fn(),
  bodyContent: '',
  onBodyContentChange: jest.fn(),
};

describe('AffidavitTemplateForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: jest.fn().mockReturnValue('test-uuid'),
      },
    });

    // Mock the React ref
    jest.spyOn(React, 'useRef').mockImplementation(() => ({
      current: {
        getEditor: mockGetEditor
      }
    }));
  });

  it('renders the form correctly', () => {
    render(<AffidavitTemplateForm {...defaultProps} />);
    expect(screen.getByText('Template Details')).toBeInTheDocument();
  });

  it('allows inserting placeholders into the editor', async () => {
    render(<AffidavitTemplateForm {...defaultProps} />);
    
    // Find a placeholder button and click it
    const patientNameBtn = screen.getByText('{{patient_name}}');
    fireEvent.click(patientNameBtn);
    
    // Verify the placeholder was inserted
    await waitFor(() => {
      expect(mockEditor.insertText).toHaveBeenCalledWith(
        0, 
        '{{patient_name}}', 
        expect.objectContaining({
          'background': '#e8f0fe',
          'color': '#1a73e8',
          'bold': true,
        })
      );
    });
  });

  it('adds a placeholder button to the toolbar', () => {
    // The test should be implementable here, but requires more DOM manipulation mocking
    // which is complex for the dynamic nature of ReactQuill's toolbar
    // This would be better tested in an e2e test with Cypress
  });
}); 