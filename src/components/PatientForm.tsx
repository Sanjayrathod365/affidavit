'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import { parse, format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

interface PatientFormProps {
  mode?: 'create' | 'edit';
  initialData?: {
    id?: string;
    patientName: string;
    dateOfBirth: string;
    dateOfInjury: string;
    endDate?: string | null;
  };
  onSubmit?: (data: { 
    patientName: string; 
    dateOfBirth: string; 
    dateOfInjury: string;
    endDate?: string | null;
  }) => Promise<void>;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

export function PatientForm({ 
  mode = 'create', 
  initialData,
  onSubmit,
  submitButtonText = mode === 'create' ? 'Create Patient' : 'Update Patient',
  isSubmitting = false
}: PatientFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: '',
    dateOfBirth: null as Date | null,
    dateOfInjury: null as Date | null,
    endDate: null as Date | null
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const parseDateString = (dateStr: string | undefined | null) => {
        if (!dateStr) return null;
        try {
          // Try parsing ISO date string first
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            return date;
          }
          // Fallback to parsing "Month DD, YYYY" format
          return parse(dateStr, 'MMMM dd, yyyy', new Date());
        } catch (error) {
          console.error('Error parsing date:', error);
          return null;
        }
      };

      setFormData({
        patientName: initialData.patientName,
        dateOfBirth: parseDateString(initialData.dateOfBirth),
        dateOfInjury: parseDateString(initialData.dateOfInjury),
        endDate: parseDateString(initialData.endDate)
      });
    }
  }, [mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null, field: 'dateOfBirth' | 'dateOfInjury' | 'endDate') => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return format(date, 'MMMM dd, yyyy');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dateOfBirth || !formData.dateOfInjury) {
      toast.error('Please select both Date of Birth and Date of Injury');
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit({
          patientName: formData.patientName,
          dateOfBirth: formatDate(formData.dateOfBirth) || '',
          dateOfInjury: formatDate(formData.dateOfInjury) || '',
          endDate: formatDate(formData.endDate)
        });
      } else {
        const url = mode === 'edit' ? `/api/patients/${initialData?.id}` : '/api/patients';
        const method = mode === 'edit' ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientName: formData.patientName,
            dateOfBirth: formatDate(formData.dateOfBirth),
            dateOfInjury: formatDate(formData.dateOfInjury),
            endDate: formatDate(formData.endDate)
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to ${mode} patient`);
        }

        toast.success(`Patient ${mode === 'create' ? 'created' : 'updated'} successfully`);
        router.push('/patients');
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${mode} patient`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Add New Patient' : 'Edit Patient'}</CardTitle>
        <CardDescription>
          {mode === 'create' ? 'Enter patient information below' : 'Update patient information'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <input
            id="patientName"
            name="patientName"
            type="text"
            value={formData.patientName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <DatePicker
            id="dateOfBirth"
            selected={formData.dateOfBirth}
            onChange={(date) => handleDateChange(date, 'dateOfBirth')}
            className="w-full px-3 py-2 border rounded-md"
            dateFormat="MMMM d, yyyy"
            required
            placeholderText="Select date of birth"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfInjury">Date of Injury</Label>
          <DatePicker
            id="dateOfInjury"
            selected={formData.dateOfInjury}
            onChange={(date) => handleDateChange(date, 'dateOfInjury')}
            className="w-full px-3 py-2 border rounded-md"
            dateFormat="MMMM d, yyyy"
            required
            placeholderText="Select date of injury"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <DatePicker
            id="endDate"
            selected={formData.endDate}
            onChange={(date) => handleDateChange(date, 'endDate')}
            className="w-full px-3 py-2 border rounded-md"
            dateFormat="MMMM d, yyyy"
            placeholderText="Select end date (if applicable)"
          />
        </div>

        <CardFooter className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/patients')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitButtonText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 