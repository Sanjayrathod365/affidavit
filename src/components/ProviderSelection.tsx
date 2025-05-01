'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, startOfToday, parseISO, isValid } from 'date-fns';

interface Provider {
  id: string;
  name: string;
}

interface ProviderSelectionProps {
  providers: Provider[];
  initialSelections?: ProviderRequest[];
  onChange: (selections: ProviderRequest[]) => void;
  dateOfInjury: string;
  patientId?: string;
}

export interface ProviderRequest {
  id?: string;
  providerId: string;
  requestType: string;
  dosType: 'present' | 'next7days' | 'custom';
  startDate?: Date | null;
  endDate?: Date | null;
}

export function ProviderSelection({ 
  providers = [], 
  initialSelections = [], 
  onChange, 
  dateOfInjury,
  patientId
}: ProviderSelectionProps) {
  const [selections, setSelections] = useState<ProviderRequest[]>(initialSelections);
  const [isClient, setIsClient] = useState(false);
  
  const parsedDoi = dateOfInjury ? parseISO(dateOfInjury) : null;
  const validDoi = parsedDoi && isValid(parsedDoi) ? parsedDoi : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addProviderSelection = () => {
    const newSelection: ProviderRequest = {
      providerId: '',
      requestType: '',
      dosType: 'present', 
      startDate: validDoi,
      endDate: validDoi ? startOfToday() : null,
    };
    const updatedSelections = [...selections, newSelection];
    setSelections(updatedSelections);
    onChange(updatedSelections);
  };

  const removeProviderSelection = (index: number) => {
    const newSelections = [...selections];
    newSelections.splice(index, 1);
    setSelections(newSelections);
    onChange(newSelections);
  };

  const updateProviderSelection = (
    index: number, 
    field: keyof ProviderRequest, 
    value: string | Date | null | 'present' | 'next7days' | 'custom'
  ) => {
    const newSelections = [...selections];
    const currentSelection = { ...newSelections[index] };
    
    (currentSelection as any)[field] = value;

    if (field === 'dosType' && validDoi) {
        currentSelection.startDate = validDoi;
        if (value === 'present') {
            currentSelection.endDate = startOfToday();
        } else if (value === 'next7days') {
            currentSelection.endDate = addDays(validDoi, 7);
        } else if (value === 'custom') {
            currentSelection.endDate = null; 
        }
    }

    if ((field === 'startDate' || field === 'endDate') && currentSelection.dosType !== 'custom') {
        // Optional: automatically switch to custom if user picks dates? 
        // Or handle this via UI validation/logic later.
        // For now, we primarily handle calculation based on dosType change.
    }

    newSelections[index] = currentSelection;
    setSelections(newSelections);
    onChange(newSelections);
  };

  const requestTypeOptions = [
    { value: 'br_mr_with_affidavit', label: 'For BR and MR with affidavit' },
    { value: 'br_mr_without_affidavit', label: 'For BR and MR without affidavit' },
    { value: 'br_with_affidavit', label: 'For BR with affidavit' },
    { value: 'br_without_affidavit', label: 'For BR without affidavit' },
    { value: 'mr_with_affidavit', label: 'For MR with affidavit' },
    { value: 'mr_without_affidavit', label: 'For MR without affidavit' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Provider Selections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {selections.map((selection, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Provider Selection {index + 1}</h3>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeProviderSelection(index)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`provider-${index}`}>Provider</Label>
                  <Select
                    value={selection.providerId}
                    onValueChange={(value: string) => updateProviderSelection(index, 'providerId', value)}
                  >
                    <SelectTrigger id={`provider-${index}`}>
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(providers) ? providers : []).map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`request-type-${index}`}>Request Type</Label>
                  <Select
                    value={selection.requestType}
                    onValueChange={(value: string) => updateProviderSelection(index, 'requestType', value)}
                  >
                    <SelectTrigger id={`request-type-${index}`}>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Add Generate Affidavit button for request types with affidavit */}
                {selection.providerId && selection.requestType && selection.requestType.includes('with_affidavit') && (
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        // Use patientId prop if available, otherwise extract from URL
                        const id = patientId || window.location.pathname.split('/')[2];
                        window.location.href = `/affidavits/new?patientId=${id}&providerId=${selection.providerId}&requestType=${selection.requestType}`;
                      }}
                    >
                      Generate Affidavit
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Date of Service (DOS)</Label>
                <RadioGroup
                  value={selection.dosType}
                  onValueChange={(value) => updateProviderSelection(index, 'dosType', value as ProviderRequest['dosType'])}
                  className="flex flex-col space-y-1"
                  disabled={!validDoi}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="present" id={`dos-present-${index}`} disabled={!validDoi} />
                    <Label htmlFor={`dos-present-${index}`} className={!validDoi ? 'text-muted-foreground' : ''}>
                      DOI to Present { !validDoi && "(Requires valid DOI)" }
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="next7days" id={`dos-next7days-${index}`} disabled={!validDoi} />
                    <Label htmlFor={`dos-next7days-${index}`} className={!validDoi ? 'text-muted-foreground' : ''}>
                      DOI to Next 7 days { !validDoi && "(Requires valid DOI)" }
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id={`dos-custom-${index}`} />
                    <Label htmlFor={`dos-custom-${index}`}>Custom date range</Label>
                  </div>
                </RadioGroup>

                {selection.dosType === 'custom' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                      {isClient ? (
                        <DatePicker
                          id={`start-date-${index}`}
                          selected={selection.startDate}
                          onChange={(date: Date | null) => updateProviderSelection(index, 'startDate', date)}
                          dateFormat="MMMM dd, yyyy"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholderText="Select start date"
                        />
                      ) : (
                        <div className="w-full h-10 bg-gray-100 animate-pulse rounded-md" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`end-date-${index}`}>End Date</Label>
                      {isClient ? (
                        <DatePicker
                          id={`end-date-${index}`}
                          selected={selection.endDate}
                          onChange={(date: Date | null) => updateProviderSelection(index, 'endDate', date)}
                          dateFormat="MMMM dd, yyyy"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholderText="Select end date"
                          minDate={selection.startDate ?? undefined}
                        />
                      ) : (
                        <div className="w-full h-10 bg-gray-100 animate-pulse rounded-md" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addProviderSelection}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Provider Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}