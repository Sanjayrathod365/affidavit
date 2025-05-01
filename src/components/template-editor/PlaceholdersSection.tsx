'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PLACEHOLDER_CATEGORIES, PREDEFINED_PLACEHOLDERS } from './types';

interface PlaceholdersSectionProps {
  insertPlaceholder: (placeholder: string) => void;
}

export function PlaceholdersSection({
  insertPlaceholder,
}: PlaceholdersSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Placeholders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Click on a placeholder below to insert it into the content area.
        </div>
        
        {Object.entries(PLACEHOLDER_CATEGORIES).map(([category, placeholders]) => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-semibold mb-2">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {placeholders.map((placeholder) => (
                <Button
                  key={placeholder}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    insertPlaceholder(placeholder);
                  }}
                  className="text-xs h-7 px-2 py-1 bg-white hover:bg-blue-50 text-left justify-start"
                >
                  {placeholder}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 