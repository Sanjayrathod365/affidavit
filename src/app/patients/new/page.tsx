'use client';

import { PatientForm } from '@/components/PatientForm';

export default function NewPatientPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Patient</h1>
      <PatientForm />
    </div>
  );
} 