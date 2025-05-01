'use client';

import React, { useState, useCallback, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Position, LogoSize } from './types';

interface LogoSettingsSectionProps {
  logoPath: string | null;
  logoPosition: Position;
  logoSize: LogoSize;
  onLogoPathChange: (path: string | null) => void;
  onLogoPositionChange: (position: Position) => void;
  onLogoSizeChange: (size: LogoSize) => void;
}

export function LogoSettingsSection({
  logoPath,
  logoPosition,
  logoSize,
  onLogoPathChange,
  onLogoPositionChange,
  onLogoSizeChange,
}: LogoSettingsSectionProps) {
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleLogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedLogoFile(file);
      setUploadError(null);
      handleLogoUpload(file);
    } else {
      setSelectedLogoFile(null);
    }
  };

  const handleLogoUpload = useCallback(async (file: File | null) => {
    if (!file) return;

    setIsUploadingLogo(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Logo upload failed');
      }

      const result = await response.json();
      onLogoPathChange(result.filePath);
      setSelectedLogoFile(null);

    } catch (error: any) {
      console.error("Logo upload error:", error);
      setUploadError(error.message || 'An error occurred during upload.');
    } finally {
      setIsUploadingLogo(false);
    }
  }, [onLogoPathChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logoFile">Upload Logo</Label>
          <Input
            id="logoFile"
            type="file"
            accept="image/png, image/jpeg, image/gif, image/svg+xml"
            onChange={handleLogoFileChange}
            disabled={isUploadingLogo}
          />
          {isUploadingLogo && <p className="text-sm text-muted-foreground">Uploading...</p>}
          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          {logoPath && !isUploadingLogo && !selectedLogoFile && (
            <p className="text-sm text-muted-foreground mt-2">
              Current logo: <a href={logoPath} target="_blank" rel="noopener noreferrer" className="underline">{logoPath.split('/').pop()}</a>
            </p>
          )}
        </div>
        {logoPath && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logoX">Logo X Position (pt)</Label>
                <Input
                  id="logoX"
                  type="number"
                  value={logoPosition.x}
                  onChange={(e) => onLogoPositionChange({ ...logoPosition, x: Number(e.target.value) || 0 })}
                  placeholder="e.g., 40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoY">Logo Y Position (pt)</Label>
                <Input
                  id="logoY"
                  type="number"
                  value={logoPosition.y}
                  onChange={(e) => onLogoPositionChange({ ...logoPosition, y: Number(e.target.value) || 0 })}
                  placeholder="e.g., 40"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logoWidth">Logo Width (pt)</Label>
                <Input
                  id="logoWidth"
                  type="number"
                  value={logoSize.width}
                  onChange={(e) => onLogoSizeChange({ ...logoSize, width: Number(e.target.value) || 50 })}
                  placeholder="e.g., 100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoHeight">Logo Height (pt)</Label>
                <Input
                  id="logoHeight"
                  type="number"
                  value={logoSize.height}
                  onChange={(e) => onLogoSizeChange({ ...logoSize, height: Number(e.target.value) || 0 })}
                  placeholder="e.g., 50 (auto if 0)"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 