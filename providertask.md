# Provider Template Association Tasks

This document outlines the tasks required to enhance the Provider Edit page to allow associating specific affidavit templates with BR and MR submission methods.

## Task Breakdown

1.  **Modify Database Schema (`prisma/schema.prisma`)**
    *   Add `brAffidavitTemplateId` (String, optional) to `Provider` model.
    *   Add `mrAffidavitTemplateId` (String, optional) to `Provider` model.
    *   Define `@relation("ProviderBRTemplate", fields: [brAffidavitTemplateId], references: [id], onDelete: SetNull)` for `brAffidavitTemplateId`.
    *   Define `@relation("ProviderMRTemplate", fields: [mrAffidavitTemplateId], references: [id], onDelete: SetNull)` for `mrAffidavitTemplateId`.
    *   Add corresponding relation fields (`providersBR Provider[] @relation("ProviderBRTemplate")` and `providersMR Provider[] @relation("ProviderMRTemplate")`) back to the `AffidavitTemplate` model.

2.  **Generate & Apply Database Migration**
    *   Run `npx prisma migrate dev --name add_provider_template_ids` in the terminal.

3.  **Update Provider API Routes (`src/app/api/providers/...`)**
    *   **GET `/api/providers/[id]` (`route.ts`):** Modify `prisma.provider.findUnique` to `select` or `include` `brAffidavitTemplateId` and `mrAffidavitTemplateId`.
    *   **PUT `/api/providers/[id]` (`route.ts`):** Update validation schema (if needed) and modify `prisma.provider.update` data payload to include `brAffidavitTemplateId` and `mrAffidavitTemplateId`.
    *   **POST `/api/providers` (`route.ts`):** Update validation schema and modify `prisma.provider.create` data payload to include `brAffidavitTemplateId` and `mrAffidavitTemplateId`.

4.  **Update Frontend Hooks (`src/hooks/useProviders.ts`)**
    *   Add `brAffidavitTemplateId?: string | null;` and `mrAffidavitTemplateId?: string | null;` to the `Provider` interface.
    *   Update the `DatabaseProvider` interface in `src/components/providers/ProviderForm.tsx` similarly.

5.  **Update Provider Form (`src/components/providers/ProviderForm.tsx`) - Fetch & State**
    *   Implement `useEffect` and `useState` to fetch `AffidavitTemplate` data from `/api/affidavit-templates`.
    *   Add `useState<boolean>` for `useSameTemplate` (default `false`).

6.  **Update Provider Form (`src/components/providers/ProviderForm.tsx`) - Schema & Defaults**
    *   Add `brAffidavitTemplateId: z.string().optional().nullable()` and `mrAffidavitTemplateId: z.string().optional().nullable()` to `formSchema`.
    *   Add the new fields to `useForm` `defaultValues`, sourcing from `initialData`.
    *   Add `form.setValue` calls for the new template IDs within the `useEffect` that populates the form from `initialData`.

7.  **Update Provider Form (`src/components/providers/ProviderForm.tsx`) - Add Controls**
    *   Add a `Select` dropdown for "BR Affidavit Template" inside the BR section (render conditionally based on `brSubmissionMethod`). Populate with fetched templates. Bind value and onChange to `brAffidavitTemplateId` form state.
    *   Add a `Select` dropdown for "MR Affidavit Template" inside the MR section (render conditionally based on `mrSubmissionMethod`). Populate with fetched templates. Bind value and onChange to `mrAffidavitTemplateId` form state. Set `disabled={useSameTemplate}`.
    *   Add a `Checkbox` for "Use same template for BR and MR". Bind `checked` to `useSameTemplate` state and update state via `onChange`.

8.  **Update Provider Form (`src/components/providers/ProviderForm.tsx`) - Sync Logic**
    *   Implement the `onChange` for the "Use same template" checkbox: if checked, call `form.setValue('mrAffidavitTemplateId', form.getValues('brAffidavitTemplateId'))`.
    *   Add a `useEffect` hook that watches `form.watch('brAffidavitTemplateId')` and `useSameTemplate`. If `useSameTemplate` is true, call `form.setValue('mrAffidavitTemplateId', watchedBrTemplateId)`.

9.  **Update Provider Form (`src/components/providers/ProviderForm.tsx`) - Submit Logic**
    *   Modify `handleFormSubmit` function to append `brAffidavitTemplateId` and `mrAffidavitTemplateId` to the `FormData` object before calling `onSubmit`.

10. **Create Task Documentation File**
    *   Create `providertask.md` (this file) and populate it with the detailed breakdown of these tasks.

## Future Tasks (Postponed)

*   **Update Affidavit Generation Logic:** Modify the "Generate Affidavit" button functionality in `ProviderSelection.tsx` and the logic in `/affidavits/new/page.tsx` and `AffidavitForm.tsx` to correctly utilize the `brAffidavitTemplateId` or `mrAffidavitTemplateId` associated with the Provider when initiating affidavit creation.
*   **Refine Template Selection:** Determine the precise logic for choosing the template when the `requestType` includes both BR and MR (e.g., `br_mr_with_affidavit`). 