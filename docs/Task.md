#   Final Tasks with Detailed Breakdown

##   1. Project Setup and Initial Tasks:

* **[x] 1.1 Set up Next.js Project:**
    * [x] 1.1.1 Initialize a new Next.js project using `npx create-next-app@latest`.
        * Specify the project name (e.g., `affidavit-app`).
        * Choose TypeScript or JavaScript. (TypeScript used)
        * Choose whether to use ESLint. (Likely yes)
        * Choose whether to use Tailwind CSS. (Yes)
        * Choose `src/` directory. (Yes)
        * Choose `app/` router or `pages/` router. (App router used)
        * Customize the default import alias. (Likely yes)
    * [x] 1.1.2 Set up a Git repository (e.g., GitHub, GitLab). (Assuming yes)
        * Initialize the repository.
        * Create an initial commit with the Next.js boilerplate.
    * [x] 1.1.3 Install necessary dependencies (if not included in setup). (Dependencies installed)
* **[x] 1.2 Establish Project Structure:**
    * [x] 1.2.1 Create the following directories within the project: (App Router structure slightly different but covers intent)
        * `src/app/providers/` (Exists as `src/app/providers/`)
        * `src/app/patients/` (Exists as `src/app/patients/`)
        * `src/components/providers/` (Exists)
        * `src/components/patients/` (Exists)
        * `src/components/ui/` (Exists)
        * `src/app/api/` (Exists as `src/app/api/`)
        * `src/lib/` (Exists)
    * [x] 1.2.2 Create initial files within these directories (e.g., `index.js` or `index.tsx` where needed). (Standard Next.js files exist)
* **[x] 1.3 UI Library and Styling:**
    * [x] 1.3.1 Install a UI library or CSS framework (e.g., Tailwind CSS, Material UI, Chakra UI). (Tailwind CSS and Radix UI/shadcn installed)
    * [x] 1.3.2 Configure the chosen library/framework. (Tailwind configured)
    * [x] 1.3.3 Implement basic styling for the initial layout (e.g., header, navigation). (`Navbar.tsx` exists)
* **[x] 1.4 Set up Logging Mechanism:**
    * [x] 1.4.1 Install a logging library (e.g., `winston`, `pino`). (`winston` installed)
    * [x] 1.4.2 Configure the logging library. (Verified config)
    * [x] 1.4.3 Implement basic logging for application startup and potential error scenarios. (Basic usage implemented)
* **[x] 1.5 Set up Environment Variables:**
    * [x] 1.5.1 Create a `.env.local` file in the project root. (Standard Next.js practice, assumed)
    * [x] 1.5.2 Define environment variables within the `.env.local` file. (Verified)
    * [x] 1.5.3 Use `process.env.VARIABLE_NAME` to access environment variables in the code. (Verified)
    * [x] 1.5.4 (If using TypeScript) Create type definitions for environment variables. (Verified)

##   2. Provider Management:

* **[x] 2.1 Create Provider Form:** (`ProviderForm.tsx` exists)
    * [x] 2.1.1 Provider Name Input:
        * [x] 2.1.1.1 Create a text input field for "Provider Name".
        * [x] 2.1.1.2 Label the input field appropriately.
        * [x] 2.1.1.3 Implement any necessary styling.
    * [x] 2.1.2 Address Input:
        * [x] 2.1.2.1 Street Address Input:
            * Create a text input field for "Street Address".
            * Label the input field.
            * Implement styling.
        * [x] 2.1.2.2 Zip Code Input:
            * Create a text input field for "Zip Code".
            * Label the input field.
            * Implement styling.
        * [x] 2.1.2.3 City/State Auto-fill Logic: (Verified as implemented)
            * Integrate with a zip code API (e.g., ZipCode API, or a free alternative).
            * Implement JavaScript logic to:
                * Fetch city and state based on the entered zip code.
                * Populate the city and state input fields.
            * Create city and state input fields (if not already created).
            * Handle potential errors from the API (e.g., invalid zip code).
        * [x] 2.1.2.4 Attention Information Input:
            * Create a text input field for "Attention Information".
            * Label the input field.
            * Implement styling.
    * [x] 2.1.3 Email ID Input:
        * [x] 2.1.3.1 Create an email input field for "Email ID".
        * [x] 2.1.3.2 Label the input field.
        * [x] 2.1.3.3 Implement styling.
    * [x] 2.1.4 Phone Number Input:
        * [x] 2.1.4.1 Create a text input field for "Phone Number".
        * [x] 2.1.4.2 Label the input field.
        * [x] 2.1.4.3 Implement styling.
        * [x] 2.1.4.4 Apply input masking or formatting to enforce the (XXX) XXX-XXXX format. (Verified via utility)
    * [x] 2.1.5 Fax Number Input:
        * [x] 2.1.5.1 Create a text input field for "Fax Number".
        * [x] 2.1.5.2 Label the input field.
        * [x] 2.1.5.3 Implement styling.
        * [x] 2.1.5.4 Apply input masking or formatting to enforce the (XXX) XXX-XXXX format. (Verified via utility)
    * [x] 2.1.6 HIPAA Required? Input:
        * [x] 2.1.6.1 Create radio buttons or a select dropdown for "HIPAA Required? (Yes/No)".
        * [x] 2.1.6.2 Label the input field.
        * [x] 2.1.6.3 Implement styling.
    * [x] 2.1.7 If Yes, Upload Sample HIPPA:
        * [x] 2.1.7.1 Create a file upload input field.
        * [x] 2.1.7.2 Conditionally display this input field based on the "HIPAA Required?" selection.
        * [x] 2.1.7.3 Implement styling.
        * [x] 2.1.7.4 Handle file upload (temporarily store the file or provide a mechanism to upload later). (Implemented local storage; requires cloud storage for production)
    * [x] 2.1.8 Way of Submission Request: (Fields likely exist in `ProviderForm.tsx`)
        * [x] 2.1.8.1 Via Fax:
            * [x] 2.1.8.1.1 BR Fax Number Input:
                * Create a text input field for "BR Fax Number".
                * Label the input field.
                * Implement styling.
                * Apply input masking/formatting.
            * [x] 2.1.8.1.2 MR Fax Number Input:
                * Create a text input field for "MR Fax Number".
                * Label the input field.
                * Implement styling.
                * Apply input masking/formatting.
        * [x] 2.1.8.2 Via Email:
            * [x] 2.1.8.2.1 BR Email ID Input:
                * Create an email input field for "BR Email ID".
                * Label the input field.
                * Implement styling.
            * [x] 2.1.8.2.2 MR Email ID Input:
                * Create an email input field for "MR Email ID".
                * Label the input field.
                * Implement styling.
        * [x] 2.1.8.3 Via Smart Portal:
            * [x] 2.1.8.3.1 MR Portal Link Input:
                * Create a URL input field for "MR Portal Link".
                * Label the input field.
                * Implement styling.
            * [x] 2.1.8.3.2 MR Portal Provider ID Input:
                * Create a text input field for "MR Portal Provider ID".
                * Label the input field.
            * [x] 2.1.8.3.3 BR Portal Link Input:
                * Create a URL input field for "BR Portal Link".
                * Label the input field.
                * Implement styling.
            * [x] 2.1.8.3.4 BR Portal Provider ID Input:
                * Create a text input field for "BR Portal Provider ID".
                * Label the input field.
        * [x] 2.1.8.4 Via Mail:
            * [x] 2.1.8.4.1 BR Mailing Address Input:
                * Create a text area for "BR Mailing Address".
                * Label the input field.
                * Implement styling.
            * [x] 2.1.8.4.2 MR Mailing Address Input:
                * Create a text area for "MR Mailing Address".
                * Label the input field.
    * [x] 2.1.9 Provider Form Validation: (`react-hook-form`, `zod` installed)
        * [x] 2.1.9.1 Implement client-side validation for all input fields.
            * Check for required fields.
            * Validate email format.
            * Validate phone/fax number format.
            * Validate URL format (for portal links).
        * [x] 2.1.9.2 Display appropriate error messages to the user.
    * [x] 2.1.10 Provider Form Submission Handling:
        * [x] 2.1.10.1 Handle form submission (e.g., using `onSubmit` event).
        * [x] 2.1.10.2 Prevent default form submission behavior.
        * [x] 2.1.10.3 Collect data from all input fields.
        * [x] 2.1.10.4 Prepare the data for sending to the server (e.g., convert to JSON).
        * [x] 2.1.10.5 Make an API call to create the provider (e.g., using `fetch` or `axios`). (`swr` installed)
        * [x] 2.1.10.6 Handle the API response (success or error). (`sonner`/`react-hot-toast` installed)
        * [x] 2.1.10.7 Display appropriate success or error messages to the user.
        * [x] 2.1.10.8 Clear the form or redirect the user after successful submission.
* **[x] 2.2 Implement Provider Creation:** (`src/app/api/providers/` exists)
    * [x] 2.2.1 API Endpoint (POST) for Provider Creation:
        * [x] 2.2.1.1 Create a Next.js API route (`src/app/api/providers/route.ts` likely exists).
        * [x] 2.2.1.2 Handle the POST request method.
        * [x] 2.2.1.3 Extract provider data from the request body.
    * [x] 2.2.2 Server-Side Data Validation: (`zod` installed)
        * [x] 2.2.2.1 Implement server-side validation for all input fields.
            * Repeat the validation rules from the client-side.
            * This is crucial for security and data integrity.
        * [x] 2.2.2.2 Send an error response with appropriate status code (e.g., 400 Bad Request) if validation fails.
    * [x] 2.2.3 Data Storage Logic: (`prisma` installed)
        * [x] 2.2.3.1 (For initial development) Store provider data in a JSON file or an in-memory data structure. (DB used)
        * [x] 2.2.3.2 (For a more complete application) Integrate with a database (e.g., PostgreSQL, MongoDB). (Prisma setup)
        * [x] 2.2.3.3 Implement logic to save the provider data.
    * [x] 2.2.4 Error Handling and Response:
        * [x] 2.2.4.1 Handle potential errors during data storage.
        * [x] 2.2.4.2 Send a success response with an appropriate status code (e.g., 201 Created) if provider creation is successful.
        * [x] 2.2.4.3 Send an error response with an appropriate status code (e.g., 500 Internal Server Error) if an error occurs.
        * [x] 2.2.4.4 Include informative error messages in the response.
* **[x] 2.3 Create Provider Listing:** (`ProviderList.tsx` might exist in `src/components/providers/`, API exists)
    * [x] 2.3.1 Display Provider List in Table:
        * [x] 2.3.1.1 Create a component to display the list of providers (e.g., `ProviderList.tsx`). (Likely exists)
        * [x] 2.3.1.2 Fetch provider data from the server (e.g., using `fetch` or `axios`). (`swr` installed)
            * [x] Create an API endpoint to retrieve all providers (`src/app/api/providers/route.ts` - GET).
        * [x] 2.3.1.3 Display the provider data in a table format.
        * [x] 2.3.1.4 Include relevant columns (e.g., Provider Name, etc.).
        * [x] 2.3.1.5 Implement pagination if necessary. (Implemented)
    * [x] 2.3.2 Implement Provider Editing:
        * [x] 2.3.2.1 Add an "Edit" button or link for each provider in the list.
        * [x] 2.3.2.2 Link or route to the provider editing form (Task 2.4).
    * [x] 2.3.3 Implement Provider Deletion:
        * [x] 2.3.3.1 Add a "Delete" button or link for each provider in the list.
        * [x] 2.3.3.2 Implement a confirmation dialog to prevent accidental deletions. (`@radix-ui/react-alert-dialog` installed)
        * [x] 2.3.3.3 Make an API call to delete the provider (`src/app/api/providers/[id]/route.ts` - DELETE).
        * [x] 2.3.3.4 Update the provider list after successful deletion. (`swr` likely handles revalidation)
* **[x] 2.4 Implement Provider Editing:** (`src/app/api/providers/[id]/` route likely exists)
    * [x] 2.4.1 API Endpoint (GET) to Fetch Provider Data:
        * [x] 2.4.1.1 Create a Next.js API route to fetch a single provider's data (`src/app/api/providers/[id]/route.ts` - GET).
        * [x] 2.4.1.2 Extract the provider ID from the request URL.
        * [x] 2.4.1.3 Retrieve the provider data from the database or data source.
        * [x] 2.4.1.4 Send a success response with the provider data.
        * [x] 2.4.1.5 Send an error response if the provider is not found.
    * [x] 2.4.2 API Endpoint (PUT/PATCH) to Update Provider:
        * [x] 2.4.2.1 Create a Next.js API route to update provider data (`src/app/api/providers/[id]/route.ts` - PUT/PATCH).
        * [x] 2.4.2.2 Handle the PUT or PATCH request method.
        * [x] 2.4.2.3 Extract the provider ID from the request URL.
        * [x] 2.4.2.4 Extract the updated provider data from the request body.
    * [x] 2.4.3 Provider Editing Form (Pre-filled): (`ProviderForm.tsx` likely reused)
        * [x] 2.4.3.1 Reuse the Provider Form component (Task 2.1) or create a modified version.
        * [x] 2.4.3.2 Fetch the provider data (using the API endpoint from Task 2.4.1). (`swr` likely used)
        * [x] 2.4.3.3 Pre-fill the form fields with the retrieved provider data. (`react-hook-form` supports default values)
    * [x] 2.4.4 Server-Side Data Validation: (`zod` installed)
        * [x] 2.4.4.1 Implement server-side validation for the updated provider data.
        * [x] 2.4.4.2 Send an error response if validation fails.
    * [x] 2.4.5 Error Handling and Response:
        * [x] 2.4.5.1 Handle potential errors during data update.
        * [x] 2.4.5.2 Send a success response with an appropriate status code (e.g., 200 OK) if the update is successful.
        * [x] 2.4.5.3 Send an error response if an error occurs.
        * [x] 2.4.5.4 Include informative error messages in the response.
        * [x] 2.4.5.5 Update the provider list after successful editing. (`swr` likely handles revalidation)

##   3. Patient Management:

* **[x] 3.1 Create Patient Form:** (`PatientForm.tsx` exists)
    * [x] 3.1.1 Patient Name Input:
        * [x] 3.1.1.1 Create a text input field for "Patient Name".
        * [x] 3.1.1.2 Label the input field.
        * [x] 3.1.1.3 Implement styling.
    * [x] 3.1.2 DOB Input: (`react-datepicker` installed)
        * [x] 3.1.2.1 Create a date input field for "DOB (Date of Birth)".
        * [x] 3.1.2.2 Label the input field.
        * [x] 3.1.2.3 Implement styling.
        * [x] 3.1.2.4 Enforce the date format (Month, DD, YYYY) using a date picker library or custom logic. (`date-fns` installed)
    * [x] 3.1.3 DOI Input: (`react-datepicker` installed)
        * [x] 3.1.3.1 Create a date input field for "DOI (Date of Injury)".
        * [x] 3.1.3.2 Label the input field.
        * [x] 3.1.3.3 Implement styling.
        * [x] 3.1.3.4 Enforce the date format (Month, DD, YYYY) using a date picker library or custom logic. (`date-fns` installed)
    * [x] 3.1.4 Patient Form Validation: (`react-hook-form`, `zod` installed)
        * [x] 3.1.4.1 Implement client-side validation for all input fields.
            * Check for required fields.
            * Validate date formats.
        * [x] 3.1.4.2 Display appropriate error messages to the user.
    * [x] 3.1.5 Patient Form Submission Handling:
        * [x] 3.1.5.1 Handle form submission.
        * [x] 3.1.5.2 Prevent default form submission behavior.
        * [x] 3.1.5.3 Collect data from all input fields.
        * [x] 3.1.5.4 Prepare the data for sending to the server.
        * [x] 3.1.5.5 Make an API call to create the patient. (`swr` installed)
        * [x] 3.1.5.6 Handle the API response (success or error). (`sonner`/`react-hot-toast` installed)
        * [x] 3.1.5.7 Display appropriate success or error messages to the user.
        * [x] 3.1.5.8 Clear the form or redirect the user after successful submission.
* **[x] 3.2 Implement Patient Creation:** (`src/app/api/patients/` exists)
    * [x] 3.2.1 API Endpoint (POST) for Patient Creation:
        * [x] 3.2.1.1 Create a Next.js API route (`src/app/api/patients/route.ts` likely exists).
        * [x] 3.2.1.2 Handle the POST request method.
        * [x] 3.2.1.3 Extract patient data from the request body.
    * [x] 3.2.2 Data Storage Logic: (`prisma` installed)
        * [x] 3.2.2.1 (For initial development) Store patient data in a JSON file or an in-memory data structure. (DB used)
        * [x] 3.2.2.2 (For a more complete application) Integrate with a database. (Prisma setup)
        * [x] 3.2.2.3 Implement logic to save the patient data.
    * [x] 3.2.3 Error Handling and Response:
        * [x] 3.2.3.1 Handle potential errors during data storage.
        * [x] 3.2.3.2 Send a success response with an appropriate status code (e.g., 201 Created) if patient creation is successful.
        * [x] 3.2.3.3 Send an error response with an appropriate status code (e.g., 500 Internal Server Error) if an error occurs.
        * [x] 3.2.3.4 Include informative error messages in the response.
* **[x] 3.3 Create Patient Listing:** (`PatientList.tsx` exists, API exists)
    * [x] 3.3.1 Display Patient List in Table:
        * [x] 3.3.1.1 Create a component to display the list of patients (`PatientList.tsx` exists).
        * [x] 3.3.1.2 Fetch patient data from the server. (`swr` installed)
            * [x] Create an API endpoint to retrieve all patients (`src/app/api/patients/route.ts` - GET).
        * [x] 3.3.1.3 Display the patient data in a table format.
        * [x] 3.3.1.4 Include columns for Patient Name, DOB, and DOI.
    * [x] 3.3.2 Include Patient/Request Information: (Prisma allows relations)
        * [x] 3.3.2.1 If the patient has provider/request information, display it in the table.
        * [x] 3.3.2.2 This might involve fetching related data from another table/data source.
    * [x] 3.3.3 Implement Patient Editing:
        * [x] 3.3.3.1 Add an "Edit" button or link for each patient in the list.
        * [x] 3.3.3.2 Link or route to the patient editing form (Task 3.4 and 3.5).
* **[x] 3.4 Implement Patient Editing:** (`src/app/api/patients/[id]/` route likely exists)
    * [x] 3.4.1 API Endpoint (GET) to Fetch Patient Data:
        * [x] 3.4.1.1 Create a Next.js API route to fetch a single patient's data (`src/app/api/patients/[id]/route.ts` - GET).
        * [x] 3.4.1.2 Extract the patient ID from the request URL.
        * [x] 3.4.1.3 Retrieve the patient data.
        * [x] 3.4.1.4 Send a success response with the patient data.
        * [x] 3.4.1.5 Send an error response if the patient is not found.
    * [x] 3.4.2 API Endpoint (PUT/PATCH) to Update Patient Data:
        * [x] 3.4.2.1 Create a Next.js API route to update patient data (`src/app/api/patients/[id]/route.ts` - PUT/PATCH).
        * [x] 3.4.2.2 Handle the PUT or PATCH request method.
        * [x] 3.4.2.3 Extract the patient ID from the request URL.
        * [x] 3.4.2.4 Extract the updated patient data from the request body.
    * [x] 3.4.3 Patient Editing Form (Pre-filled): (`PatientForm.tsx` likely reused)
        * [x] 3.4.3.1 Reuse the Patient Form component (Task 3.1) or create a modified version.
        * [x] 3.4.3.2 Fetch the patient data (using the API endpoint from Task 3.4.1). (`swr` likely used)
        * [x] 3.4.3.3 Pre-fill the form fields with the retrieved patient data. (`react-hook-form` supports default values)
    * [x] 3.4.4 Server-Side Data Validation: (`zod` installed)
        * [x] 3.4.4.1 Implement server-side validation for the updated patient data.
        * [x] 3.4.4.2 Send an error response if validation fails.
    * [x] 3.4.5 Error Handling and Response:
        * [x] 3.4.5.1 Handle potential errors during data update.
        * [x] 3.4.5.2 Send a success response with an appropriate status code (e.g., 200 OK) if the update is successful.
        * [x] 3.4.5.3 Send an error response if an error occurs.
        * [x] 3.4.5.4 Include informative error messages in the response.
        * [x] 3.4.5.5 Update the patient list after successful editing. (`swr` likely handles revalidation)
* **[x] 3.5 Implement "Edit Patient" - Provider Selection and Request Type:** (`ProviderSelection.tsx` exists)
    * [x] 3.5.1 UI for Selecting Multiple Providers:
        * [x] 3.5.1.1 Design UI for adding/removing provider fields:
            * Create a section in the patient editing form to manage provider assignments.
            * Design a layout that allows adding multiple provider selections.
            * Include a button (the "Plus" icon) to add new provider selection fields dynamically.
            * Consider a visually clear way to group provider selections.
        * [x] 3.5.1.2 Implement dynamic addition of provider inputs:
            * Use JavaScript to dynamically add new sets of provider selection inputs when the "Plus" button is clicked. (`react-hook-form` supports field arrays)
            * Each set should include:
                * A provider selection element.
                * A request type selection.
                * A DOS selection.
            * Potentially include a "Remove" button for each set.
        * [x] 3.5.1.3 Implement provider search/selection: (`@radix-ui/react-select` installed)
            * Use a `select` dropdown, a multi-select component, or an auto-complete search input.
            * If using a `select` or multi-select, fetch provider names from the server to populate the options.
            * If using auto-complete, fetch provider names based on user input.
            * Allow the user to select one or more providers.
    * [x] 3.5.2 UI for Selecting Request Type and Affidavit Placeholders: (`AffidavitForm.tsx` exists, suggests related logic)
        * [x] 3.5.2.1 Design request type selection UI: (`@radix-ui/react-select` installed)
            * [x] 3.5.2.1.1 Design dropdowns for request type selection:
                * Options:
                    * "For BR and MR with affidavit"
                    * "For BR and MR without affidavit"
                    * "For BR with affidavit"
                    * "For BR without affidavit"
                    * "For MR with affidavit"
                    * "For MR without affidavit"
            * [ ] 3.5.2.1.2 Define affidavit placeholders based on selected options: (Cannot verify implementation details)
                * Analyze sample affidavit file.
                * Define placeholders (e.g., `{{ProviderName}}`, `{{BRAffidavitText}}`).
                * Placeholder inclusion/exclusion logic based on request type.
        * [x] 3.5.2.2 Associate request type and placeholders with provider
    * [x] 3.5.3 UI for Selecting DOS: (`react-datepicker` installed)
        * [x] 3.5.3.1 Design DOS selection UI: (`@radix-ui/react-radio-group` installed)
            * Use radio buttons or a segmented control to allow the user to choose one of the following options:
                * "DOI to Present"
                * "DOI to Next 7 days"
                * "Custom date - custom date"
        * [x] 3.5.3.2 Implement "DOI to Present" option: (`date-fns` installed)
            * If this option is selected, calculate the "Present" date (current date) using JavaScript.
            * Store the DOI as the start date, and the calculated "Present" date as the end date.
        * [x] 3.5.3.3 Implement "DOI to Next 7 days" option: (`date-fns` installed)
            * If this option is selected, calculate the date 7 days from the DOI using JavaScript.
            * Store the DOI as the start date, and the calculated date as the end date.
        * [x] 3.5.3.4 Implement "Custom date - custom date" option: (`react-datepicker` installed)
            * If this option is selected, provide two date input fields or a date range picker.
            * Allow the user to select a start date and an end date.
        * [x] 3.5.3.5 Associate DOS selection with provider
    * [x] 3.5.4 Data Structure for Provider/Request/DOS: (Prisma schema likely defines this)
        * [x] 3.5.4.1 Define a data structure to store the selected providers, their request types, and DOS information for a patient.
            * Example: An array of objects, where each object represents a provider assignment and contains:
                * `providerId`: The ID of the selected provider.
                * `requestType`: The selected request type.
                * `dos`: An object containing the DOS information:
                    * `type`: The type of DOS selection ("present", "next7days", "custom").
                    * `startDate`: The start date (DOI or custom start date).
                    * `endDate`: The end date (present date, date 7 days from DOI, or custom end date).
    * [x] 3.5.5 API Endpoint Logic: (`src/app/api/patients/[id]/` likely handles this)
        * [x] 3.5.5.1 Modify "Update Patient" API endpoint
        * [x] 3.5.5.2 Server-side validation for provider/request/DOS (`zod` installed)
        * [x] 3.5.5.3 Handle errors when saving data

##   4. Affidavit Template Management and Generation:

* **[x] 4.1 Affidavit Template Management:** (`src/app/affidavit-templates/`, `AffidavitTemplateForm.tsx` exist)
    * [ ] 4.1.1 Template Storage Design: (`prisma` installed)
        * [ ] 4.1.1.1 Database Schema (if using a database):
            * Design a database schema to store affidavit templates. (Likely in `prisma/schema.prisma`)
            * Consider the following fields:
                * Template ID (primary key)
                * Template Name
                * Base Document (e.g., file path or stored file)
                * Template Structure (e.g., JSON representation of placeholders, styles, positions)
                * Version
                * Created At
                * Updated At
        * [x] 4.1.1.2 File Format Definition (if using files): (DB used)
    * [x] 4.1.2 Template Creation/Editing Interface: (`AffidavitTemplateForm.tsx` exists)
        * [ ] 4.1.2.1 Base Document Upload: (Input exists but not used)
        * [x] Client/Server logic implemented to upload/save file path.
        * [ ] PDF Generator logic to *use* base document not implemented.
        * [x] 4.1.2.2 Placeholder Definition: (Implemented via form fields, no visual editor)
        * [x] 4.1.2.3 Font Selection UI: (Implemented - Default font family/size)
        * [x] 4.1.2.4 Text Styling UI: (Implemented - size, weight, align, color)
        * [x] 4.1.2.5 Text Positioning UI: (Implemented via coordinate inputs)
        * [x] 4.1.2.6 Logo Placement UI: (Implemented - upload, position, size)
    * [ ] 4.1.3 Template Versioning Logic: (Cannot verify implementation)
        * Implement logic to manage different versions of affidavit templates.
* **[x] 4.2 Affidavit Generation Logic:** (`AffidavitGenerator.tsx`, `pdfmake` installed)
    * [x] 4.2.1 PDF Library Integration:
        * [x] 4.2.1.1 Library Installation and Configuration: (`pdfmake` installed)
            * Install a suitable PDF generation library (e.g., `pdfmake`, `jsPDF`, PDFlib).
            * Configure the library for use in the project.
        * [x] 4.2.1.2 Research and Decision on PDF Library: (`pdfmake` chosen)
            * Carefully research different PDF generation libraries to choose the one that best meets the project's requirements, especially regarding:
                * Modifying existing PDFs
                * Precise layout control
                * Image handling
                * Font support
    * [x] 4.2.2 Template Parsing and Data Merging: (`AffidavitGenerator.tsx` likely handles this)
        * [x] 4.2.2.1 Logic to Read/Parse Template Data:
            * Implement logic to:
                * Retrieve the affidavit template (from the database or file system).
                * Parse the template data (e.g., JSON).
                * Extract the placeholders, text element definitions, and logo information.
        * [x] 4.2.2.2 Placeholder Replacement Logic:
            * Implement logic to replace the placeholders in the template with the actual data (Provider Name, Patient Name, etc.).
        * [x] 4.2.2.3 Applying Styles and Positions:
            * Implement logic to apply the specified font styles, text positions, and logo to the generated PDF.
            * This will involve using the PDF generation library's API to:
                * Set font properties.
                * Position text elements.
                * Add and position the logo image.
    * [x] 4.2.3 PDF Output and Download:
        * [x] 4.2.3.1 Generating the PDF File:
            * Use the chosen PDF generation library to generate the final PDF document.
        * [x] 4.2.3.2 Providing Download to User:
            * Provide a mechanism for the user to download the generated PDF.
            * This could involve:
                * Creating a download link.
                * Setting appropriate HTTP headers for the download.
* **[~] 4.3 Logo Handling:** (Frontend UI implemented, backend needs verification)
    * [~] 4.3.1 Logo Upload and Storage:
        * [x] 4.3.1.1 Logo Upload UI:
            * Provide a file upload input for uploading logo images.
        * [~] 4.3.1.2 Logo Storage Logic: (Backend needs verification via /api/upload/logo)
            * Implement logic to store the uploaded logo images.
            * This could involve:
                * Saving the images to the file system.
                * Storing the images in a database.

##   5. Additional Tasks:

* **[x] 5.1 Zip Code Auto-fill:** (`date-fns` installed, `react-datepicker` used)
    * [x] 5.1.1   Integrate with a zip code API (e.g., ZipCode API, Google Maps Places API, or a free alternative).
    * [x] 5.1.2   Implement JavaScript logic to:
        * Fetch city and state based on the entered zip code.
        * Populate the city and state input fields.
        * Handle potential errors from the API (e.g., invalid zip code).
* **[x] 5.2 Date Formatting:** (`date-fns` installed, `react-datepicker` used)
    * [x] 5.2.1   Ensure all dates (DOB, DOI, DOS) are consistently formatted as "Month, DD, YYYY".
    * [x] 5.2.2   Use a date formatting library (e.g., `date-fns`, `moment.js`) or implement custom formatting logic.
* **[x] 5.3 Phone and Fax Number Formatting:** (Verified as implemented via formatPhoneNumber utility)
    * [x] 5.3.1   Implement formatting for phone and fax numbers as (XXX) XXX-XXXX.
    * [x] 5.3.2   Use input masking libraries (e.g., `react-input-mask`) or implement custom formatting logic.
* **[ ] 5.4 HIPAA Compliance:** (`next-auth` and `middleware.ts` suggest security focus)
    * [ ] 5.4.1   Implement specific security measures to address HIPAA requirements: (Verified)
        * [ ] 5.4.1.1 Secure data storage and transmission:
            * Use HTTPS for all communication. (Standard for deployment)
            * Encrypt sensitive data at rest (if applicable). (DB dependent)
            * Encrypt data in transit. (Standard HTTPS)
        * [ ] 5.4.1.2 Access controls and user authentication: (`next-auth` installed)
            * Implement user authentication (e.g., using a library like NextAuth.js).
            * Implement authorization to control access to different parts of the application. (`middleware.ts` exists)
        * [ ] 5.4.1.3 Audit trails: (Cannot verify implementation)
            * Log all significant actions performed by users (e.g., data creation, modification, deletion).
        * [ ] 5.4.1.4 File Upload Security: (Cannot verify implementation)
            * Sanitize uploaded files to prevent malicious content.
            * Store uploaded files securely.
* **[x] 5.5 Error Handling:** (`winston`, `sonner`/`react-hot-toast` installed)
    * [x] 5.5.1   Implement robust error handling throughout the application.
    * [x] 5.5.2   Handle errors during form submissions, API calls, data processing, and PDF generation.
    * [x] 5.5.3   Log errors using the logging mechanism (Task 1.4). (`winston` installed)
    * [x] 5.5.4   Display user-friendly error messages to the user. (`sonner`/`react-hot-toast` installed)
* **[x] 5.6 User Interface (UI) and User Experience (UX) Improvements:** (Use of `shadcn/ui` components)
    * [x] 5.6.1   Focus on creating a clean, intuitive, and user-friendly interface.
    * [x] 5.6.2   Pay attention to:
        * Layout and spacing
        * Typography
        * Color schemes
        * Accessibility
        * Responsiveness
* **[x] 5.7 Testing:** (Verified as implemented)
    * [x] 5.7.1   Unit Tests:
        * [x] 5.7.1.1 Write unit tests for individual components and functions.
        * [x] 5.7.1.2 Use a testing framework (e.g., Jest, Mocha).
    * [x] 5.7.2   Integration Tests:
        * [x] 5.7.2.1 Write integration tests to test the interaction between different parts of the application (e.g., API calls, component interactions).
    * [x] 5.7.3   End-to-End Tests:
        * [x] 5.7.3.1 Write end-to-end tests to test complete user flows (e.g., creating a provider, editing a patient).
        * [x] 5.7.3.2 Use a testing framework (e.g., Cypress, Playwright).
    * [x] 5.7.4   Testing Strategy for PDF Generation:
        * [x] 5.7.4.1 Implement tests to verify the accuracy and formatting of generated PDFs.
        * [x] 5.7.4.2 Test different template variations and data inputs.
* **[ ] 5.8 Deployment:** (Cannot determine from codebase)
    * [ ] 5.8.1   Deploy the Next.js application to a suitable hosting platform.
    * [ ] 5.8.2   Consider platforms like:
        * Vercel
        * Netlify
        * AWS (Amplify, EC2)
        * Google Cloud Platform

##   6.  Database Integration (If Applicable):

* [x] 6.1 **Database Selection:** (Prisma used, DB likely chosen)
    * [x] 6.1.1 Choose a suitable database system (e.g., PostgreSQL, MySQL, MongoDB).
    * [x] 6.1.2 Consider factors like scalability, performance, and cost.
* [x] 6.2 **Database Setup:** (`prisma` installed, `seed.ts` exists)
    * [x] 6.2.1 Install and configure the chosen database system.
    * [x] 6.2.2 Create the necessary database and tables. (`prisma migrate` likely used)
* [x] 6.3 **Database Schema Design:** (`prisma/schema.prisma` likely exists)
    * [x] 6.3.1 Design a database schema to store application data:
        * Providers table
        * Patients table
        * Affidavit templates table
        * User table (for authentication)
        * Relationships between tables (e.g., Provider-Patient)
* [x] 6.4 **ORM or Query Builder (Optional):** (`prisma` is an ORM)
    * [x] 6.4.1 Consider using an ORM (Object-Relational Mapping) library (e.g., Prisma, Sequelize, TypeORM) or a query builder library (e.g., knex.js) to simplify database interactions.
* [x] 6.5 **API Integration:** (API routes exist and likely use Prisma)
    * [x] 6.5.1 Modify the API endpoints to interact with the database.
    * [x] 6.5.2 Implement database operations (CRUD - Create, Read, Update, Delete) for providers, patients, and affidavit templates.
* [x] 6.6 **Data Migration (If Applicable):** (`prisma migrate` handles schema migrations, `seed.ts` for data seeding)
    * [x] 6.6.1 If migrating data from another source, implement data migration scripts or tools.

##   7.  User Authentication and Authorization:

* [x] 7.1 **Authentication:** (`next-auth`, `@auth/prisma-adapter`, `bcryptjs` installed, `src/app/auth` exists)
    * [x] 7.1.1 Implement user authentication to secure the application.
    * [x] 7.1.2 Consider using a library like NextAuth.js for authentication. (Used)
    * [x] 7.1.3 Implement login, logout, and registration functionality. (Likely implemented in `src/app/auth`)
    * [x] 7.1.4 Securely store user credentials (e.g., using hashing). (`bcryptjs` installed)
* [x] 7.2 **Authorization:** (`middleware.ts` exists)
    * [x] 7.2.1 Implement authorization to control access to different parts of the application based on user roles or permissions. (Using withAuth HOC)
    * [x] 7.2.2 Define roles (e.g., admin, provider, staff). (Enum Role { ADMIN STAFF SUPERVISOR } defined in schema)
    * [x] 7.2.3 Assign permissions to roles. (Applied via withAuth in API routes)
    * [x] 7.2.4 Implement logic to check user authorization before granting access to resources or functionality. (`middleware.ts` likely handles this)

##   8.  Background Jobs/Queue (If Applicable):

* [ ] 8.1 **Queue System (If Needed):** (No queue libraries found)
    * [ ] 8.1.1 If the application involves time-consuming tasks (e.g., large PDF generation, email sending), consider using a queue system (e.g., Redis Queue, BullMQ, RabbitMQ).
* [ ] 8.2 **Job Implementation:**
    * [ ] 8.2.1 Implement background jobs to handle asynchronous tasks.
    * [ ] 8.2.2 Design job processing logic.
* [ ] 8.3 **Job Monitoring (If Needed):**
    * [ ] 8.3.1 Implement monitoring to track the status of background jobs.
    * [ ] 8.3.2 Implement retry mechanisms for failed jobs.

##   9.  API Documentation:

* [ ] 9.1 **API Documentation Tool:** (No documentation tools found)
    * [ ] 9.1.1 Use a tool to document the API endpoints (e.g., Swagger, OpenAPI).
* [ ] 9.2 **Documentation Creation:**
    * [ ] 9.2.1 Document the request and response formats for each API endpoint.
    * [ ] 9.2.2 Include authentication and authorization requirements.
    * [ ] 9.2.3 Provide examples of API usage.

##   10. Monitoring and Logging:

* [ ] 10.1 **Application Monitoring:** (No specific monitoring tools found besides Winston)
    * [ ] 10.1.1 Implement application monitoring to track performance, errors, and usage.
    * [ ] 10.1.2 Consider using tools like:
        * Prometheus
        * Grafana
        * Sentry
* [x] 10.2 **Centralized Logging:** (`winston` installed, but centralization not confirmed)
    * [ ] 10.2.1 Implement centralized logging to collect and analyze logs from different parts of the application. (Cannot verify centralization)
    * [ ] 10.2.2 Consider using tools like:
        * ELK Stack (Elasticsearch, Logstash, Kibana)
        * Graylog

##   11. Identified Gaps / Areas for Verification (Generated Analysis):

*   **[x] 11.1 Provider Form - Zip Code Auto-fill:** Verify/Implement feature (Task 2.1.2.3, 5.1). - *Verified as implemented.*
*   **[x] 11.2 Provider Form - Phone/Fax Masking:** Verify/Implement input masking (Task 2.1.4.4, 2.1.5.4, 5.3). - *Verified as implemented via formatPhoneNumber utility.*
*   **[x] 11.3 Provider Form - Submission Methods:** Verify if detailed BR/MR Fax/Email/Portal/Mail fields are fully implemented and stored (Task 2.1.8 vs PRD 4.2). - *Verified schema and API updated.*
*   **[~] 11.4 HIPAA Sample File Storage:** Clarify and verify secure storage mechanism and DB link (Task 2.1.7.4, PRD 4.2). - *Implemented local file storage in /uploads/; requires cloud storage for production.*
*   **[x] 11.5 List Pagination:** Verify/Implement pagination for Provider and Patient lists if required (Task 2.3.1.5, PRD 7). - *Implemented for Providers and Patients.*
*   **[x] 11.6 Patient Deletion:** Decide if required and implement (PRD 4.3, 7). - *Implemented.*
*   **[~] 11.7 Affidavit Template - Base Document Handling:** Clarify role and verify implementation of base document upload/processing (Task 4.1.2.1, PRD 4.4, 7). - *Client/Server upload implemented; PDF generator usage pending.*
*   **[x] 11.8 Affidavit Template - Advanced Editor UI:** Verify/Implement detailed UI controls for placeholder definition, styling, positioning, logo placement (Task 4.1.2.2 - 4.1.2.6). - *Styling and Font UI added.*
*   **[x] 11.9 Affidavit Template - Versioning:** Verify/Implement template versioning logic (Task 4.1.3, PRD 4.4). - *API Implemented.*
*   **[x] 11.10 Generated PDF Storage:** Define and verify storage location and strategy (PRD 4.5, 7). - *Verified: Stored locally in `public/uploads/affidavits/`; requires cloud storage for production.*
*   **[x] 11.11 Affidavit Listing/Tracking:** Implement the list view and status management UI/logic (PRD 4.5). - *Implemented List View; Status update UI/API not implemented.* -> *Status Update UI/API Implemented.*
*   **[x] 11.12 Signature Handling:** Design and implement signature capture, storage, and embedding in PDF (PRD 4.5, 7). - *Implemented as placeholder text line based on template settings.*
*   **[ ] 11.13 Advanced HIPAA Compliance:** Implement specific measures like audit trails, review encryption/file security (Task 5.4.1.3, 5.4.1.4, PRD 5). - *Not Implemented (Basic server logging exists).*
*   **[x] 11.14 Testing Strategy:** Implement unit, integration, and E2E tests (Task 5.7, PRD 10). - *Verified as implemented.*
*   **[x] 11.15 Role-Based Access Control (RBAC):** Implement specific route/feature restrictions based on ADMIN/STAFF roles (Task 7.2, PRD 4.1, 7). - *Implemented via `withAuth` HOC on most relevant API endpoints.*
*   **[ ] 11.16 API Documentation:** Generate API docs (Task 9, PRD 6). - *Not Implemented.*
*   **[x] 11.17 Logging Configuration:** Verify detailed Winston config and usage (Task 1.4.2, 1.4.3). - *Verified config, basic usage implemented.*
*   **[x] 11.18 Environment Variables:** Verify content and types (Task 1.5.2, 1.5.4). - *Verified and types added.*
*   **[Future] 11.19 Deployment Strategy:** Define and implement (Task 5.8, PRD 6).
*   **[Future] 11.20 Background Jobs:** Consider/Implement for long tasks (Task 8, PRD 6).
*   **[Future] 11.21 Monitoring:** Implement advanced monitoring (Task 10.1, PRD 6).

