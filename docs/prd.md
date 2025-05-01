# Product Requirements Document: Affidavit Management System

## 1. Introduction

This document outlines the product requirements for the Affidavit Management System. The system is designed to streamline the process of creating, managing, and tracking affidavits related to patient medical records (MR) and billing records (BR) requests from various healthcare providers. It aims to manage patient information, provider details, and generate customized affidavit documents based on predefined templates.

## 2. Goals

*   **Centralize Management:** Provide a single platform to manage provider information, patient details, and affidavit requests.
*   **Automate Generation:** Automate the creation of affidavit documents using customizable templates and dynamic data insertion.
*   **Improve Efficiency:** Reduce manual effort and potential errors in handling affidavit requests and document preparation.
*   **Enhance Tracking:** Allow users to track the status of affidavit requests and generated documents.
*   **Ensure Security:** Implement user authentication and authorization to protect sensitive patient and provider data, adhering to necessary compliance standards (e.g., HIPAA).

## 3. User Roles

*   **Staff:** General users who can manage patients, providers, and generate affidavits. (Default role)
*   **Admin:** Users with full access, including user management (implied by schema/auth) and potentially system configuration/template management. (Specific admin functionalities need further definition).

## 4. Functional Requirements

### 4.1 Authentication & Authorization

*   **[Done] User Login:** Users must log in using email and password credentials.
*   **[Done] Session Management:** User sessions are managed using JWT (via NextAuth).
*   **[Done] Protected Routes:** All application routes (except authentication routes) require users to be logged in.
*   **[Partially Done] Role-Based Access Control (RBAC):**
    *   The system supports 'ADMIN' and 'STAFF' roles (defined in Prisma schema and NextAuth authorize function).
    *   Middleware currently checks only for logged-in status (`!!token`). Specific route/feature restrictions based on role (`ADMIN` vs. `STAFF`) need implementation or clarification.
*   **[Done] Default Admin:** A default admin account (`admin@example.com` / `admin123`) exists for initial setup/development.

### 4.2 Provider Management

*   **[Done] Create Provider:**
    *   Users can add new providers via a form.
    *   Required fields: Name, Address, Email, Phone.
    *   Optional fields: HIPAA Required (Checkbox), HIPAA Sample File Upload.
    *   *Note: The detailed submission method fields (BR/MR Fax, Email, Portal, Mail) from `Task.md` are **not** currently reflected in `ProviderForm.tsx` or `schema.prisma`. This is a discrepancy.*
*   **[Done] List Providers:**
    *   Display a list of all providers.
    *   Information displayed: Name, Email, Phone, Address (based on form/schema).
    *   Provide options to Edit and Delete each provider.
*   **[Done] Edit Provider:**
    *   Users can edit existing provider information using a pre-filled form.
    *   Handles updating basic fields and potentially the HIPAA sample file.
*   **[Done] Delete Provider:**
    *   Users can delete providers (likely with confirmation).
*   **[Partially Done] HIPAA File Handling:**
    *   UI allows uploading a HIPAA sample file during provider creation/edit.
    *   API endpoint receives the file (`formDataToSend.append('hipaaSampleFile', ...)` in `ProviderForm.tsx`).
    *   *Unclear:* How/where the file is stored (`hipaaSamplePath` in `ProviderFormProps` vs `hipaaSample` in `Provider` model - discrepancy) and how it's linked in the database (`Provider` model has `hipaaSample: String?`). Secure storage and access need verification.
*   **[Not Implemented] Zip Code Auto-fill:** City/State auto-fill based on Zip Code is not implemented in `ProviderForm.tsx`.
*   **[Not Implemented] Phone/Fax Formatting:** Input masking/formatting for phone/fax numbers is not explicitly implemented in `ProviderForm.tsx`.

### 4.3 Patient Management

*   **[Done] Create Patient:**
    *   Users can add new patients via a form.
    *   Required fields: Patient Name, Date of Birth (DOB), Date of Injury (DOI).
    *   Uses `react-datepicker` for date input.
    *   Dates are formatted as "Month DD, YYYY".
*   **[Done] List Patients:**
    *   Display a list of all patients.
    *   Information displayed: Name, DOB, DOI (based on `PatientList.tsx` assumptions).
    *   Provide an option to Edit each patient.
    *   *Note: Deletion functionality for patients is not explicitly mentioned in the task list or component analysis but might be intended.*
*   **[Done] Edit Patient (Basic Info):**
    *   Users can edit basic patient information (Name, DOB, DOI) using a pre-filled form.
*   **[Done] Edit Patient (Provider Assignment & Request Details):**
    *   Within the patient edit view, users can associate one or more providers with the patient.
    *   For each associated provider, users must specify:
        *   **Provider:** Select from the list of existing providers.
        *   **Request Type:** Select from predefined options (e.g., "For BR and MR with affidavit", "For BR without affidavit", etc.).
        *   **Date of Service (DOS):** Select one option:
            *   DOI to Present
            *   DOI to Next 7 days
            *   Custom Date Range (Start Date, End Date)
    *   Implemented using the `ProviderSelection.tsx` component.
    *   Data stored via the `PatientProvider` relation model in Prisma.

### 4.4 Affidavit Template Management

*   **[Done] Create/Edit Template:**
    *   Provides a form (`AffidavitTemplateForm.tsx`) for creating or editing affidavit templates.
    *   Users can define:
        *   Template Name
        *   Placeholders (with type, required status, basic styling/positioning)
        *   Text Blocks (static text with styling/positioning)
        *   Logo (upload, position, size)
        *   *Note: Header/Footer text fields mentioned in `Task.md` (4.1.1.2) seem simplified or handled differently in the `AffidavitTemplateForm.tsx` props.*
        *   *Note: Base document upload (`Task.md` 4.1.2.1) is handled via `baseTemplateFile` state but its processing/use is unclear from the form component alone.*
*   **[Partially Done] Placeholder Management:**
    *   Users can add/remove/edit placeholders within the template form.
    *   Placeholders have attributes: name, type (text, date, checkbox, signature), description, required status, default value, basic styles (font size, weight, align), and position (x, y, page).
    *   Predefined placeholder names (e.g., `{{patient_name}}`) are available.
*   **[Partially Done] Logo Handling:**
    *   UI allows uploading a logo file via `/api/upload/logo`.
    *   Logo path is stored (`AffidavitTemplate.logoPath`).
    *   Position and size can be configured (needs UI implementation verification).
*   **[Done] List Templates:** Users can view a list of existing affidavit templates (implied by `/affidavit-templates` route and fetch logic in generator).
*   **[Partially Done] Template Structure Storage:** Template structure (placeholders, styles, logo info, text blocks) is stored as JSON in the `AffidavitTemplate.structure` field in the database. *Schema has `structure: Json`, but form props suggest a more granular structure which might be assembled before saving.*
*   **[Not Implemented] Versioning:** Template versioning (`AffidavitTemplate.version`) exists in the schema but management UI/logic is not apparent.

### 4.5 Affidavit Generation & Management

*   **[Done] Generate Affidavit:**
    *   Users can generate an affidavit based on a selected template and patient/provider context.
    *   The `AffidavitGenerator.tsx` component fetches templates and displays input fields corresponding to the selected template's placeholders.
    *   Required fields are enforced.
    *   Generation is triggered via a call to `/api/affidavit-templates/generate`.
*   **[Done] Data Merging:** The backend replaces placeholders in the template with provided data.
*   **[Done] PDF Generation:** Uses the `pdfmake` library on the backend to create the PDF document.
*   **[Partially Done] PDF Output/Storage:**
    *   The generation API returns a URL to the generated PDF (`data.data.url`).
    *   An `Affidavit` record is created in the database, potentially storing the file path (`Affidavit.generatedFilePath`).
    *   *Unclear:* Where the PDF file itself is stored (e.g., local filesystem, cloud storage).
*   **[Done] Download PDF:** Users can download the generated PDF via the provided URL.
*   **[Partially Done] Affidavit Listing/Tracking:**
    *   An `/affidavits` route exists (linked from the main page).
    *   The `Affidavit` model exists with a `status` field (default "DRAFT").
    *   *Requires:* Implementation of the affidavit list view and status management/display.
*   **[Not Implemented/Unclear] Signature Handling:**
    *   Placeholders can have type 'signature'.
    *   `AffidavitTemplateForm` has `signatureSettings` props.
    *   *Requires:* Clarification on how digital/image signatures are captured, stored, and embedded in the PDF.

### 4.6 General UI/UX

*   **[Done] Framework:** Built with Next.js (App Router) and TypeScript.
*   **[Done] Styling:** Uses Tailwind CSS and shadcn/ui components for a consistent look and feel.
*   **[Done] Navigation:** Basic navigation bar (`Navbar.tsx`) is implemented.
*   **[Done] Notifications:** Uses `sonner`/`react-hot-toast` for displaying success/error messages.
*   **[Done] Forms:** Uses `react-hook-form` (detected via dependencies, assumed usage) and potentially `zod` for validation. Date inputs use `react-datepicker`.

## 5. Non-Functional Requirements

*   **Usability:** The interface should be intuitive and easy for staff to navigate and use.
*   **Performance:** Forms and data lists should load reasonably quickly. PDF generation time should be acceptable.
*   **Security:**
    *   Implement standard web security practices (HTTPS assumed for deployment).
    *   Password hashing (`bcryptjs`) is used.
    *   Authorization checks should prevent unauthorized data access/modification.
    *   If handling PHI, adhere to HIPAA technical safeguards (secure storage, transmission, access controls, audit trails - *current implementation status needs detailed review*).
*   **Maintainability:** Code should be well-structured and reasonably documented (TypeScript helps).
*   **Scalability:** The system (especially database and PDF generation) should handle a growing number of users, patients, providers, and templates. (Current setup uses SQLite, which may need reconsideration for production scale).

## 6. Future Considerations / Out of Scope (Initial)

*   Advanced Admin Dashboard (User Management, System Stats)
*   Detailed Audit Trails for HIPAA compliance
*   Background Job Processing (for potentially long PDF generation)
*   API Documentation (Swagger/OpenAPI)
*   Advanced Monitoring & Centralized Logging
*   Comprehensive Unit, Integration, and E2E Testing
*   Deployment Strategy & Infrastructure
*   Bulk data import/export
*   Direct integration with EMR/Billing systems
*   Advanced template editor with visual drag-and-drop for elements.
*   Email/Fax integration for sending requests/documents directly.

## 7. Open Questions / Areas for Clarification

*   **Provider Submission Methods:** Clarify the requirement and implementation status of detailed submission methods (Fax, Email, Portal, Mail) for providers.
*   **HIPAA File Storage:** Define the exact storage mechanism (path vs. blob, location) and access control for uploaded HIPAA sample files.
*   **Admin Role Capabilities:** Detail the specific functionalities restricted to the ADMIN role.
*   **PDF Storage:** Confirm the storage location and strategy for generated PDF files.
*   **Signature Implementation:** Specify how digital/image signatures will be handled (capture, storage, rendering in PDF).
*   **Template Base Document:** Clarify the role and processing of the `baseTemplateFile` uploaded in the template form. Is it used as a background, or for extracting initial structure?
*   **Error Handling Details:** While basic error display exists, are there specific error scenarios needing more granular handling (e.g., PDF generation failures)?
*   **Production Database:** SQLite is used currently; confirm the intended production database.
*   **Pagination:** Is pagination required for Provider/Patient/Template/Affidavit lists?
*   **Patient Deletion:** Is patient deletion a required feature? 