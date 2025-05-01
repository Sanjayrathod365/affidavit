import { NextResponse } from 'next/server';

// In a real application, these keys might come from a database,
// configuration file, or by introspecting data models.
const AVAILABLE_KEYS = [
    'patientName',
    'patientDOB',
    'patientDOI',
    'patientAddress',
    'providerName',
    'providerCredentials',
    'providerAddress',
    'providerFaxBR',
    'providerFaxMR',
    'providerEmailBR',
    'providerEmailMR',
    'providerMailBR',
    'providerMailMR',
    'providerSmartPortalBR',
    'providerSmartPortalMR',
    'providerSmartFolder',
    'signaturePatient',      // Placeholder for where signature might go
    'signatureProvider',     // Placeholder for where signature might go
    'witnessName',           // Placeholder
    'signatureWitness',      // Placeholder
    'currentDate',
    'dosRange',
    'documentId',
    'caseNumber',
    'providerSubmissionMethods',
    // Add any other relevant keys that can be used in templates
];

export async function GET() {
    try {
        // Sort keys alphabetically for consistency
        const sortedKeys = AVAILABLE_KEYS.sort();
        return NextResponse.json(sortedKeys);
    } catch (error) {
        console.error("Error fetching template data keys:", error);
        return NextResponse.json({ error: 'Failed to fetch template data keys' }, { status: 500 });
    }
} 