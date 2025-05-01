'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import { SignatureSettings } from './types';

interface SignatureSettingsSectionProps {
  signatureSettings: SignatureSettings;
  onSignatureSettingsChange: (settings: SignatureSettings) => void;
}

export function SignatureSettingsSection({
  signatureSettings,
  onSignatureSettingsChange,
}: SignatureSettingsSectionProps) {

  const handleSignatureSettingChange = (
    field: keyof SignatureSettings | 'position.x' | 'position.y',
    value: string | number | boolean
  ) => {
    const newSettings = { ...signatureSettings };
    if (field === 'enabled') {
      newSettings.enabled = value as boolean;
    } else if (field === 'label') {
      newSettings.label = value as string;
    } else if (field === 'position.x') {
      newSettings.position = { ...newSettings.position, x: Number(value) || 0 };
    } else if (field === 'position.y') {
      newSettings.position = { ...newSettings.position, y: Number(value) || 0 };
    }
    onSignatureSettingsChange(newSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signature Line (Page 1)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="signatureEnabled"
            checked={signatureSettings.enabled}
            onCheckedChange={(checked) => handleSignatureSettingChange('enabled', checked)}
          />
          <Label htmlFor="signatureEnabled">Enable Signature Line on Page 1</Label>
        </div>

        {signatureSettings.enabled && (
          <div className="space-y-4 pl-8 border-l ml-3 pt-2">
            <div className="space-y-2">
              <Label htmlFor="signatureLabel">Signature Label</Label>
              <Input
                id="signatureLabel"
                value={signatureSettings.label}
                onChange={(e) => handleSignatureSettingChange('label', e.target.value)}
                placeholder="e.g., Patient Signature:"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signatureX">X Position (pt)</Label>
                <Input
                  id="signatureX"
                  type="number"
                  value={signatureSettings.position.x}
                  onChange={(e) => handleSignatureSettingChange('position.x', e.target.value)}
                  placeholder="e.g., 50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signatureY">Y Position (pt)</Label>
                <Input
                  id="signatureY"
                  type="number"
                  value={signatureSettings.position.y}
                  onChange={(e) => handleSignatureSettingChange('position.y', e.target.value)}
                  placeholder="e.g., 700"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 