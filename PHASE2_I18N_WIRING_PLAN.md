# Phase 2 i18n Wiring: Detailed Action Plan
Generated: 2026-03-16

---

## EXECUTIVE SUMMARY

**Phase 2 Goal**: Wire 150-190 high-value unused translation keys across 3 PRs

**Key Metrics**:
- Total keys in en.json: 3,577
- Currently used: 1,556 keys
- Phase 1 status: Completed (285 broken keys fixed)
- Phase 2 scope: ~170 keys across 3 high-impact PRs
- Estimated effort: 8-11 hours
- Post-Phase 2 remaining: ~1,830 unused keys

---

## NAMESPACE COVERAGE SUMMARY

| Namespace | Total Keys | Currently Used | Unused | Phase 2 Target |
|-----------|------------|-----------------|--------|----------------|
| govern.* | 112 | 45 | 67 | 30-40 |
| ingest.* | 509 | ~80 | ~429 | 60-80 (selective) |
| crud.* | 101 | ~20 | ~81 | 0-10 (distributed) |
| filter.* | 40 | ~15 | ~25 | 0-10 (verify status) |
| domain.* | 52 | ~25 | ~27 | 15-25 |
| assertion.* | 34 | 0 | 34 | 20-25 |
| analytics.* | 29 | 0 | 29 | 0-5 (low priority) |
| form.* | 27 | ~5 | ~22 | 0-5 (low priority) |
| **TOTAL** | **3,577** | **~1,556** | **~2,021** | **~150-190** |

**Key Insight**: `govern.*` and `ingest.*` dominate unused keys but have different wiring difficulty:
- **govern**: Localized, self-contained forms → easier to wire completely
- **ingest**: Massive (509 keys), many auto-generated connector configs → selective wiring strategy

---

## PR 1: GOVERN.STRUCTUREDPROPERTIES (40-50 KEYS)

### Status
- **Currently wired**: 45 keys (mostly form names, descriptions, basic UI)
- **Unused in namespace**: 67 keys (advanced options, tooltips, form field-specific labels)
- **Phase 2 target**: 30-40 additional keys

### High-Impact Unused Keys (Priority 1)

#### A. QUALIFIED NAME / ADVANCED OPTIONS (5-7 keys)
Located in: `AdvancedOptions.tsx`, `ViewAdvancedOptions.tsx`

**Currently using hardcoded strings**:
```tsx
// Line 41, AdvancedOptions.tsx
prop: title = "Optionally provide a dot-separated fully qualified name..."

// Line 62
prop: placeholder = "Optional - Qualified Name"
```

**Available keys in en.json**:
- `govern.structuredProperties.advancedOptions.qualifiedNameCannotChange`
- `govern.structuredProperties.advancedOptions.qualifiedNamePlaceholder`
- `govern.structuredProperties.advancedOptions.qualifiedNameSpaceError`
- `govern.structuredProperties.advancedOptions.qualifiedNameTooltip`

**Action**: Wire these 4 keys immediately

#### B. CARDINALITY OPTIONS (5-8 keys)
Located in: `StructuredPropsForm.tsx`

**Available keys**:
- `govern.structuredProperties.form.cardinality`
- `govern.structuredProperties.form.cardinalitySingle`
- `govern.structuredProperties.form.cardinalityMultiple`
- `govern.structuredProperties.form.cardinalityTooltip`

**Action**: Wire all 4 keys in cardinality select field

#### C. ALLOWED VALUES FIELD (5-7 keys)
Located in: `AllowedValuesField.tsx`, `AllowedValuesDrawer.tsx`

**Currently hardcoded at lines**:
- Line 34: title for allowed values definition
- Line 54, 67: "Update allowed values" buttons
- Line 117, 137: Tooltip messages

**Available keys**:
- `govern.structuredProperties.allowedValuesField.label`
- `govern.structuredProperties.allowedValuesField.tooltip`
- `govern.structuredProperties.allowedValuesField.updateTooltip`
- `govern.structuredProperties.allowedValuesField.anyValueText`
- `govern.structuredProperties.allowedValuesField.numberType`
- `govern.structuredProperties.allowedValuesField.textType`
- `govern.structuredProperties.allowedValuesField.valueWillBeAllowed`

**Action**: Wire all 7 keys across both files

#### D. ENTITY TYPES SECTION (8-10 keys)
Located in: `StructuredPropsFormSection.tsx` (lines ~80-167)

**Available keys**:
- `govern.structuredProperties.formSection.allowedEntityTypes`
- `govern.structuredProperties.formSection.allowedEntityTypesTooltip`
- `govern.structuredProperties.formSection.allowedEntityTypesAnyWarning`
- `govern.structuredProperties.formSection.allowedEntityTypesAddOnly`
- `govern.structuredProperties.formSection.allowedEntityTypesAddOnlyTooltip`
- `govern.structuredProperties.formSection.appliesToLabel`
- `govern.structuredProperties.formSection.appliesToPlaceholder`
- `govern.structuredProperties.formSection.appliesToRequired`
- `govern.structuredProperties.formSection.appliesToTooltip`
- `govern.structuredProperties.formSection.appliesToAddOnly`
- `govern.structuredProperties.formSection.appliesToAddOnlyTooltip`
- `govern.structuredProperties.formSection.appliesToSelectAllLabel`

**Action**: Wire all 12 keys in StructuredPropsFormSection

#### E. DISPLAY PREFERENCES (5-8 keys)
Located in: `DisplayPreferences.tsx`, `ViewDisplayPreferences.tsx`

**Available unused keys**:
- `govern.structuredProperties.form.showInAssetSummary`
- `govern.structuredProperties.form.showInAssetSummaryTooltip`
- `govern.structuredProperties.form.showInColumnsTableTooltip`

**Action**: Complete the 3 remaining keys

#### F. FORM-WIDE LABELS (5-8 keys)
**Available**:
- `govern.structuredProperties.form.displayPreferences`
- `govern.structuredProperties.form.advancedOptions`
- `govern.structuredProperties.form.allowedAssetTypes`
- `govern.structuredProperties.form.allowedAssetTypesTooltip`
- `govern.structuredProperties.form.hideProperty`
- `govern.structuredProperties.form.hidePropertyTooltip`
- `govern.structuredProperties.form.hideWhenEmpty`
- `govern.structuredProperties.form.hideWhenEmptyTooltip`
- `govern.structuredProperties.form.immutable`
- `govern.structuredProperties.form.immutableTooltip`
- `govern.structuredProperties.form.showAsAssetBadge`
- `govern.structuredProperties.form.showAsAssetBadgeTooltip`
- `govern.structuredProperties.form.showInSearchFilters`
- `govern.structuredProperties.form.showInSearchFiltersTooltip`
- `govern.structuredProperties.form.addAllowedValue`
- `govern.structuredProperties.form.entityTypesRequired`
- `govern.structuredProperties.form.entityTypesTooltip`

**Action**: Wire all 17 field labels in StructuredPropsForm and DisplayPreferences

### Files to Modify (Governor PR)
1. ✓ `AllowedValuesDrawer.tsx` — lines 117, 137 (2 tooltips)
2. ✓ `AllowedValuesField.tsx` — lines 34, 54, 67 (3 tooltip/label replacements)
3. ✓ `AdvancedOptions.tsx` — lines 41, 62 (2 tooltip/placeholder replacements)
4. ✓ `ViewAdvancedOptions.tsx` — TBD exact lines
5. ✓ `StructuredPropsForm.tsx` — multiple form field labels
6. ✓ `StructuredPropsFormSection.tsx` — entity type section labels
7. ✓ `DisplayPreferences.tsx` — display field labels
8. ✓ `ViewDisplayPreferences.tsx` — view mode display labels

---

## PR 2: INGEST.* (60-80 KEYS - SELECTIVE)

### Status
- **Total keys**: 509 (largest namespace)
- **Strategy**: Wire ~20% of keys (user-visible, high-traffic paths)
- **Defer**: 300+ connector-specific keys to Phase 3

### Wiring Strategy

**DO Wire** (60-80 keys):
1. Execution status & summary (24 keys) ← Core feature users see
2. Source builder form steps (25 keys) ← Every ingestion task uses this
3. Secret management (15 keys) ← Common operation
4. Schedule configuration (8 keys) ← Every source needs scheduling

**DON'T Wire Yet** (300+ keys):
1. Connector-specific tooltips (bigquery.*, dbtCloud.*, etc.)
   - Reason: Auto-generated, rarely visible, can batch in Phase 3
2. Form field variations for each connector
   - Reason: Too many variations, maintenance burden in Phase 2

### Key Groups to Wire

#### A. EXECUTION STATUS DISPLAY (24 keys)
```
ingest.ExecutionStatusDisplayText.cancelled
ingest.ExecutionStatusDisplayText.failed
ingest.ExecutionStatusDisplayText.rollbackFailed
ingest.ExecutionStatusDisplayText.rolledBack
ingest.ExecutionStatusDisplayText.rollingBack
ingest.ExecutionStatusDisplayText.running
ingest.ExecutionStatusDisplayText.succeeded
ingest.ExecutionStatusDisplayText.upForRetry

ingest.ExecutionSummaryText.ingestionCompletedWithErrors
ingest.ExecutionSummaryText.ingestionIsInProcessOfRollingBack
ingest.ExecutionSummaryText.ingestionIsRunning
ingest.ExecutionSummaryText.ingestionRollbackFailed
ingest.ExecutionSummaryText.ingestionStatusNotRecognized
ingest.ExecutionSummaryText.ingestionSuccessfullyCompleted
ingest.ExecutionSummaryText.ingestionWasCancelled
ingest.ExecutionSummaryText.ingestionWasRolledBack
```

#### B. SOURCE BUILDER FORM STEPS (25 keys)

**NameSourceStep.tsx** (lines 186-267):
- "Give this data source a name"
- "Advanced" section
- "Executor ID", "CLI Version", "Debug Mode"
- Environment variables, plugins, pip libraries labels

**CreateScheduleStep.tsx** (lines 142-202):
- "Configure an Ingestion Schedule"
- "Schedule" label
- "Timezone" selection

**SelectTemplateStep.tsx** (line 121):
- Search data sources placeholder

#### C. SECRET MANAGEMENT (15 keys)

**SecretBuilderModal.tsx & SecretsList.tsx**:
- Secret name, value, description placeholders
- "No Secrets found" message
- Edit/delete buttons
- Search placeholder

### Files to Modify (Ingest PR)
1. ✓ `ingestV2/source/builder/NameSourceStep.tsx`
2. ✓ `ingestV2/source/builder/CreateScheduleStep.tsx`
3. ✓ `ingestV2/source/builder/SelectTemplateStep.tsx`
4. ✓ `ingestV2/secret/SecretBuilderModal.tsx`
5. ✓ `ingestV2/secret/SecretsList.tsx`
6. ✓ `ingestV2/source/executions/ExecutionRequestDetailsModal.tsx` (or status display component)

---

## PR 3: DOMAIN + ASSERTION (50-60 KEYS COMBINED)

### PR 3A: ASSERTION (20-25 KEYS)

**Location**: `entityV2/shared/tabs/Dataset/Validations/` directory

**Key Groups**:
- Assertion status: passed, failed, allPassing, allFailing, someFailing
- No assertions: noAssertionsFound, noAssertionsHaveRun, noEvaluations
- Assertion types: datasetIs, datasetRowCountIs, datasetColumnsAre, columnValuesAre_component, etc.
- Evaluation metrics: evaluations, lastEvaluatedWithDate, assertionStatusTooltip

### PR 3B: DOMAIN (15-20 KEYS)

**Location**: Domain management and detail pages

**Unused keys to wire**:
```
domain.addAssetsToDomain
domain.addAssetsToDataProduct
domain.confirmRemovedDomain
domain.confirmRemovedDomainTitle
domain.domainDescriptionDescription
domain.domainIdDescription
domain.domainManagementDescription
domain.footerDetail
domain.nbrOfEntityInDomain
domain.noDomain
domain.setDomain
domain.unsetDomain
domain.viewAll
```

---

## PHASE 2 EXECUTION CHECKLIST

### Before Starting
- [ ] Create 3 feature branches
- [ ] Run audit to confirm baseline
- [ ] Verify en.json has all keys

### PR 1: GOVERN (Days 1-2)
- [ ] Wire AdvancedOptions.tsx
- [ ] Wire AllowedValuesField.tsx
- [ ] Wire StructuredPropsForm.tsx
- [ ] Wire StructuredPropsFormSection.tsx
- [ ] Wire DisplayPreferences.tsx
- [ ] Run linting/formatting
- [ ] Test UI
- [ ] Create and merge PR

### PR 2: INGEST (Days 2-4)
- [ ] Wire NameSourceStep.tsx
- [ ] Wire CreateScheduleStep.tsx
- [ ] Wire SecretBuilderModal.tsx & SecretsList.tsx
- [ ] Wire execution status components
- [ ] Run linting/formatting
- [ ] Test UI
- [ ] Create and merge PR

### PR 3: DOMAIN + ASSERTION (Days 4-5)
- [ ] Wire assertion components
- [ ] Wire domain components
- [ ] Run linting/formatting
- [ ] Test UI
- [ ] Create and merge PR

### Post-Phase 2
- [ ] Run full audit
- [ ] Update MEMORY.md
- [ ] Plan Phase 3

---

## SUCCESS METRICS

After all 3 PRs merged:

| Metric | Target |
|--------|--------|
| Keys wired in Phase 2 | 150-190 |
| Govern coverage | 75+ / 112 (67%) |
| Ingest coverage | 80+ / 509 (16%) |
| Total app coverage | 1,700+ / 3,577 (48%) |
| High-impact features translated | 100% |
| ESLint errors | 0 |
| Prettier violations | 0 |
