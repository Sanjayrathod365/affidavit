import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Must use service key for bypassing RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create Prisma client
const prisma = new PrismaClient();

// Upload a file to Supabase Storage
async function uploadFile(bucket: string, filePath: string, fileName: string): Promise<string | null> {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File doesn't exist: ${filePath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading file: ${error.message}`);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`File upload error: ${error}`);
    return null;
  }
}

// Migrate users
async function migrateUsers() {
  const users = await prisma.user.findMany();
  console.log(`Migrating ${users.length} users...`);

  for (const user of users) {
    // First, create the auth user in Supabase
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: user.email || `${uuidv4()}@placeholder.com`,
      password: user.password || uuidv4(),
      email_confirm: true,
      user_metadata: {
        name: user.name,
        role: user.role
      }
    });

    if (authError) {
      console.error(`Error creating auth user: ${authError.message}`);
      continue;
    }

    // Then, insert the additional user data
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        name: user.name,
        email: user.email,
        email_verified: user.emailVerified,
        image: user.image,
        password: user.password, // Note: In a real migration, you'd re-hash these
        role: user.role,
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString()
      });

    if (profileError) {
      console.error(`Error inserting user profile: ${profileError.message}`);
    } else {
      console.log(`Migrated user: ${user.email}`);
    }
  }
}

// Migrate patients
async function migratePatients() {
  const patients = await prisma.patient.findMany();
  console.log(`Migrating ${patients.length} patients...`);

  for (const patient of patients) {
    const { error } = await supabase
      .from('patients')
      .insert({
        id: patient.id,
        patient_name: patient.patientName,
        date_of_birth: patient.dateOfBirth?.toISOString() || null,
        date_of_injury: patient.dateOfInjury?.toISOString() || null,
        created_at: patient.createdAt.toISOString(),
        updated_at: patient.updatedAt.toISOString()
      });

    if (error) {
      console.error(`Error migrating patient ${patient.id}: ${error.message}`);
    } else {
      console.log(`Migrated patient: ${patient.patientName}`);
    }
  }
}

// Migrate providers
async function migrateProviders() {
  const providers = await prisma.provider.findMany();
  console.log(`Migrating ${providers.length} providers...`);

  for (const provider of providers) {
    const { error } = await supabase
      .from('providers')
      .insert({
        id: provider.id,
        name: provider.name,
        email: provider.email,
        br_email_id: provider.brEmailId,
        mr_email_id: provider.mrEmailId,
        phone: provider.phone,
        fax: provider.fax,
        address: provider.address,
        zip_code: provider.zipCode,
        city: provider.city,
        state: provider.state,
        attention_info: provider.attentionInfo,
        hipaa_required: provider.hipaaRequired,
        hipaa_sample: provider.hipaaSample,
        br_fax_number: provider.brFaxNumber,
        mr_fax_number: provider.mrFaxNumber,
        br_mailing_address: provider.brMailingAddress,
        mr_mailing_address: provider.mrMailingAddress,
        created_at: provider.createdAt.toISOString(),
        updated_at: provider.updatedAt.toISOString()
      });

    if (error) {
      console.error(`Error migrating provider ${provider.id}: ${error.message}`);
    } else {
      console.log(`Migrated provider: ${provider.name}`);
    }
  }
}

// Migrate patient-provider relationships
async function migratePatientProviders() {
  const patientProviders = await prisma.patientProvider.findMany();
  console.log(`Migrating ${patientProviders.length} patient-provider relationships...`);

  for (const relation of patientProviders) {
    const { error } = await supabase
      .from('patient_providers')
      .insert({
        id: relation.id,
        patient_id: relation.patientId,
        provider_id: relation.providerId,
        request_type: relation.requestType,
        dos_start: relation.dosStart.toISOString(),
        dos_end: relation.dosEnd?.toISOString() || null,
        dos_type: relation.dosType,
        created_at: relation.createdAt.toISOString(),
        updated_at: relation.updatedAt.toISOString()
      });

    if (error) {
      console.error(`Error migrating patient-provider relation ${relation.id}: ${error.message}`);
    } else {
      console.log(`Migrated patient-provider relationship for patient ${relation.patientId}`);
    }
  }
}

// Migrate affidavit templates
async function migrateAffidavitTemplates() {
  const templates = await prisma.affidavitTemplate.findMany();
  console.log(`Migrating ${templates.length} affidavit templates...`);

  for (const template of templates) {
    // Handle logo file if exists
    let logoUrl = template.logoPath;
    if (template.logoPath && fs.existsSync(template.logoPath)) {
      const fileName = `logo_${template.id}_${path.basename(template.logoPath)}`;
      logoUrl = await uploadFile('templates', template.logoPath, fileName) || template.logoPath;
    }

    const { error } = await supabase
      .from('affidavit_templates')
      .insert({
        id: template.id,
        name: template.name,
        description: template.description,
        file_path: template.filePath,
        structure: template.structure,
        version: template.version,
        is_active: template.isActive,
        logo_path: logoUrl,
        font_family: template.fontFamily,
        font_size: template.fontSize,
        user_id: template.userId,
        created_at: template.createdAt.toISOString(),
        updated_at: template.updatedAt.toISOString()
      });

    if (error) {
      console.error(`Error migrating template ${template.id}: ${error.message}`);
    } else {
      console.log(`Migrated template: ${template.name}`);
    }
  }
}

// Migrate audit logs
async function migrateAuditLogs() {
  const logs = await prisma.auditLog.findMany();
  console.log(`Migrating ${logs.length} audit logs...`);

  for (const log of logs) {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        id: log.id,
        timestamp: log.timestamp.toISOString(),
        user_id: log.userId,
        user_email: log.userEmail,
        action: log.action,
        target_entity_type: log.targetEntityType,
        target_entity_id: log.targetEntityId,
        details: log.details
      });

    if (error) {
      console.error(`Error migrating audit log ${log.id}: ${error.message}`);
    } else {
      console.log(`Migrated audit log from ${log.timestamp.toISOString()}`);
    }
  }
}

// Migrate affidavits
async function migrateAffidavits() {
  const affidavits = await prisma.affidavit.findMany();
  console.log(`Migrating ${affidavits.length} affidavits...`);

  for (const affidavit of affidavits) {
    // Handle PDF file if exists
    let pdfUrl = affidavit.generatedFilePath;
    if (affidavit.generatedFilePath && fs.existsSync(affidavit.generatedFilePath)) {
      const fileName = `affidavit_${affidavit.id}_${path.basename(affidavit.generatedFilePath)}`;
      pdfUrl = await uploadFile('affidavits', affidavit.generatedFilePath, fileName) || affidavit.generatedFilePath;
    }

    const { error } = await supabase
      .from('affidavits')
      .insert({
        id: affidavit.id,
        patient_id: affidavit.patientId,
        provider_id: affidavit.providerId,
        content: affidavit.content,
        status: affidavit.status,
        verification_code: affidavit.verificationCode,
        generated_file_path: pdfUrl,
        template_id: affidavit.templateId,
        created_at: affidavit.createdAt.toISOString(),
        updated_at: affidavit.updatedAt.toISOString()
      });

    if (error) {
      console.error(`Error migrating affidavit ${affidavit.id}: ${error.message}`);
    } else {
      console.log(`Migrated affidavit: ${affidavit.id}`);
    }
  }
}

// Run the migration
async function runMigration() {
  try {
    console.log('Starting migration to Supabase...');
    
    // Migrate in the correct order based on dependencies
    await migrateUsers();
    await migratePatients();
    await migrateProviders();
    await migratePatientProviders();
    await migrateAffidavitTemplates();
    await migrateAuditLogs();
    await migrateAffidavits();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the migration
runMigration(); 