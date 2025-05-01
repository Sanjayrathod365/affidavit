'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

// Re-define interfaces needed for props (or import if made shareable)
interface Position {
  x?: number;
  y?: number;
  page?: number;
}

interface Styles {
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
}

interface Placeholder {
  id: string;
  name: string;
  position?: Position;
  styles?: Styles;
  defaultValue?: string;
}

interface TextBlock {
  id: string;
  content: string;
  position: Position;
  styles: Styles;
}

interface LogoSettings {
  position?: Position;
  size?: { width?: number; height?: number };
  path?: string;
}

interface SignatureSettings {
  enabled: boolean;
  label: string;
  position: { x: number; y: number };
}

interface TemplatePreviewProps {
  placeholders: Placeholder[];
  textBlocks: TextBlock[];
  logoPath: string | null;
  logoSettings: LogoSettings;
  signatureSettings: SignatureSettings;
  bodyContent?: string;
  pageWidthPt?: number;  // Optional: width in points (e.g., 612 for Letter)
  pageHeightPt?: number; // Optional: height in points (e.g., 792 for Letter)
}

// Simple scaling factor for preview (adjust as needed)
const PREVIEW_SCALE = 0.8;

const DEFAULT_PAGE_WIDTH_PT = 612; // US Letter
const DEFAULT_PAGE_HEIGHT_PT = 792;
const PREVIEW_MAX_WIDTH_PX = 500; // Max width for the preview container in pixels
const PAGE_MARGIN_PX = 20; // Margin between stacked pages

export function TemplatePreview({ 
  placeholders, 
  textBlocks, 
  logoPath, 
  logoSettings, 
  signatureSettings,
  bodyContent,
  pageWidthPt = DEFAULT_PAGE_WIDTH_PT,
  pageHeightPt = DEFAULT_PAGE_HEIGHT_PT
}: TemplatePreviewProps) {
  
  const [logoError, setLogoError] = useState(false);

  // Calculate scaling factor and dimensions once
  const scaleFactor = useMemo(() => PREVIEW_MAX_WIDTH_PX / pageWidthPt, [pageWidthPt]);
  const previewWidthPx = useMemo(() => PREVIEW_MAX_WIDTH_PX, []);
  const previewHeightPx = useMemo(() => pageHeightPt * scaleFactor, [pageHeightPt, scaleFactor]);

  useEffect(() => {
    // Reset logo error state when logoPath changes
    setLogoError(false);
  }, [logoPath]);

  // Group elements by page number
  const elementsByPage = useMemo(() => {
    const groups: { [page: number]: { placeholders: Placeholder[], textBlocks: TextBlock[] } } = {};

    const getPageNum = (p?: Position): number => Math.max(1, Math.floor(p?.page || 1));

    placeholders.forEach(p => {
      const pageNum = getPageNum(p.position);
      if (!groups[pageNum]) groups[pageNum] = { placeholders: [], textBlocks: [] };
      groups[pageNum].placeholders.push(p);
    });

    textBlocks.forEach(tb => {
      const pageNum = getPageNum(tb.position);
      if (!groups[pageNum]) groups[pageNum] = { placeholders: [], textBlocks: [] };
      groups[pageNum].textBlocks.push(tb);
    });

    return groups;
  }, [placeholders, textBlocks]);

  // Determine the maximum page number required
  const maxPage = useMemo(() => {
    const pageNumbers = Object.keys(elementsByPage).map(Number);
    return pageNumbers.length > 0 ? Math.max(...pageNumbers) : 1;
  }, [elementsByPage]);

  const pageNumbersToRender = useMemo(() => Array.from({ length: maxPage }, (_, i) => i + 1), [maxPage]);

  const renderPositionedElement = (id: string, position: Position | undefined, styles: Styles | undefined, children: React.ReactNode, elementType: string = "div") => {
    // Use defaults if position/styles are partially undefined
    const effectivePos = { x: 0, y: 0, page: 1, ...position }; 
    const effectiveStyles = { fontSize: 12, fontWeight: 'normal', textAlign: 'left', ...styles }; 

    if (!effectivePos.x || !effectivePos.y) return null; // Still require x and y

    const elementStyles: React.CSSProperties = {
      position: 'absolute',
      left: `${effectivePos.x * scaleFactor}px`,
      top: `${effectivePos.y * scaleFactor}px`,
      fontSize: `${effectiveStyles.fontSize * scaleFactor}pt`,
      fontWeight: effectiveStyles.fontWeight,
      textAlign: effectiveStyles.textAlign as 'left' | 'right' | 'center' | 'justify' | 'match-parent' | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset' | undefined,
      whiteSpace: elementType === 'pre' ? 'pre-wrap' : 'normal',
      wordBreak: 'break-word',
      lineHeight: '1.2',
      transformOrigin: 'top left',
      color: effectiveStyles.color || 'inherit',
    };

    return React.createElement(elementType, { key: id, style: elementStyles }, children);
  };

  const renderSignatureLine = (settings: SignatureSettings) => {
    if (!settings.enabled) return null;

    const labelPosX = settings.position.x * scaleFactor;
    const labelPosY = settings.position.y * scaleFactor;
    const linePosY = labelPosY + (12 * scaleFactor); // Approx position below label
    const lineEndX = labelPosX + (150 * scaleFactor); // Example fixed line length

    return (
      <React.Fragment key="signature-line">
        {/* Signature Label */}
        <div
          style={{
            position: 'absolute',
            left: `${labelPosX}px`,
            top: `${labelPosY}px`,
            fontSize: `${10 * scaleFactor}pt`, // Smaller font size for label
            fontWeight: 'normal',
          }}
        >
          {settings.label}
        </div>
        {/* Signature Line */}
        <div
          style={{
            position: 'absolute',
            left: `${labelPosX}px`,
            top: `${linePosY}px`,
            width: `${lineEndX - labelPosX}px`,
            height: '1px',
            backgroundColor: '#000',
          }}
        />
      </React.Fragment>
    );
  };

  return (
    <div className="overflow-y-auto bg-gray-100 p-4" style={{ maxHeight: '80vh' }}>
      {pageNumbersToRender.map(pageNum => (
        <div
          key={`page-${pageNum}`}
          className="bg-white relative overflow-hidden shadow-lg border border-gray-400 mx-auto"
          style={{
            width: `${previewWidthPx}px`,
            height: `${previewHeightPx}px`,
            marginBottom: pageNum === maxPage ? '0' : `${PAGE_MARGIN_PX}px`,
          }}
          aria-label={`Template Preview Page ${pageNum}`}
        >
          {/* Render Logo on each page (for now) */}
          {logoSettings.path && !logoError && (() => {
            // Calculate dimensions, providing defaults if needed
            const logoWidthPt = logoSettings.size?.width || 50; // Default width 50pt
            const logoHeightPt = logoSettings.size?.height || 50; // Default height 50pt
            const logoWidthPx = logoWidthPt * scaleFactor;
            const logoHeightPx = logoHeightPt * scaleFactor;
            
            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${(logoSettings.position?.x || 0) * scaleFactor}px`,
                  top: `${(logoSettings.position?.y || 0) * scaleFactor}px`,
                  width: `${logoWidthPx}px`, // Use calculated px width
                  height: `${logoHeightPx}px`, // Use calculated px height
                  overflow: 'hidden', // Prevent image overflow if container is smaller
                }}
              >
                <Image
                  src={logoSettings.path}
                  alt="Logo Preview"
                  fill
                  className="object-contain"
                  onError={() => setLogoError(true)}
                  unoptimized
                />
              </div>
            );
          })()}
          {logoError && pageNum === 1 && ( // Show logo error only on first page
            <div style={{ position: 'absolute', left: `${(logoSettings.position?.x || 0) * scaleFactor}px`, top: `${(logoSettings.position?.y || 0) * scaleFactor}px`, color: 'red', fontSize: 'small' }}>
              Logo Error
            </div>
          )}

          {/* Render Text Blocks for this page */}
          {(elementsByPage[pageNum]?.textBlocks || []).map((block) => renderPositionedElement(
            block.id,
            block.position,
            block.styles,
            block.content,
            'pre'
          ))}

          {/* Render Placeholders for this page */}
          {(elementsByPage[pageNum]?.placeholders || []).map((placeholder) => renderPositionedElement(
            placeholder.id,
            placeholder.position,
            placeholder.styles,
            placeholder.name
          ))}

          {/* Render Signature Line ONLY on Page 1 */}
          {pageNum === 1 && renderSignatureLine(signatureSettings)}

          {/* Render bodyContent (rich text HTML) on the first page only */}
          {pageNum === 1 && bodyContent && (
            <div 
              className="rich-text-preview"
              style={{
                position: 'absolute',
                top: '300px', // Position it below other elements
                left: '50px',
                right: '50px',
                maxHeight: `${previewHeightPx - 350}px`, // Leave space at top and bottom
                overflow: 'auto',
                fontSize: `${10 * scaleFactor}pt`,
                lineHeight: '1.5',
              }}
              dangerouslySetInnerHTML={{ __html: bodyContent }} 
            />
          )}

          {/* Page Number Indicator (Optional) */}
          <div style={{ position: 'absolute', bottom: '5px', right: '10px', fontSize: '10px', color: '#aaa' }}>
            Page {pageNum}
          </div>
        </div>
      ))}
    </div>
  );
} 