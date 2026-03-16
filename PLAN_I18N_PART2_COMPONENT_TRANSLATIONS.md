# i18n Translation — Part 2 & 4 Execution Plan

**Status as of 2026-03-15:**
- ✅ Part 1: Locale parity fix COMPLETE (committed)
- ✅ Part 3: Verification COMPLETE (parity test passes 4/4)
- ⏳ Part 2: Component translations (260+ files, ~30-50 agent batches needed)
- ⏳ Part 4: PR readiness (after Part 2 complete)

---

## Part 2 — Remaining Component Translations (260+ files)

### Overview
~260 component files across 8 directories need `useTranslation` hook + `t()` calls + translation keys in all 5 locale files (en, de, es, fr, pt-br).

### Execution Strategy
Run **parallel batches of 3 agents**. Each agent:
1. Reads `src/i18n/locales/en.json` (to avoid duplicate key definitions)
2. Edits 3-5 target component files:
   - Add `import { useTranslation } from 'react-i18next';` at top
   - Add `const { t } = useTranslation();` in component body
   - Replace hardcoded strings with `t('namespace.key')` calls
   - Add new keys to ALL 5 locale JSON files (use English as fallback)
3. After all edits, commit with:
   ```bash
   git add -A
   git commit -m "feat(i18n): translate [directory/feature] components (X files)"
   ```

### Remaining Work by Directory

#### 1. entityV2/ (~184 files)

**Batch 1 — Incident & Validation Components (HIGH PRIORITY)**
```
Files:
- datahub-web-react/src/app/entity/entityV2/IncidentEditor.tsx
- datahub-web-react/src/app/entity/entityV2/IncidentView.tsx
- datahub-web-react/src/app/entity/entityV2/containers/incidents/AddIncidentModal.tsx
- datahub-web-react/src/app/entity/entityV2/DatasetAssertionDescription.tsx
- datahub-web-react/src/app/entity/entityV2/ValidatedFields.tsx

Keys needed (estimate):
- incident.* (title, description, status, severity, etc.)
- assertion.* (test name, description, etc.)
```

**Batch 2 — Schema & Stats Components (HIGH PRIORITY)**
```
Files:
- datahub-web-react/src/app/entity/entityV2/HistoricalStatsView.tsx
- datahub-web-react/src/app/entity/entityV2/schema/SchemaDetails.tsx
- datahub-web-react/src/app/entity/entityV2/schema/SchemaVersioning.tsx
- datahub-web-react/src/app/entity/entityV2/schema/EditSchemaModal.tsx

Keys needed (estimate):
- schema.* (columns, type, description, etc.)
- stats.* (historical, quality, etc.)
```

**Batch 3 — ML Models & Views (HIGH PRIORITY)**
```
Files:
- datahub-web-react/src/app/entity/entityV2/MLModelSummary.tsx
- datahub-web-react/src/app/entity/entityV2/MLFeatureSummary.tsx
- datahub-web-react/src/app/entity/entityV2/ViewsList.tsx
- datahub-web-react/src/app/entity/entityV2/containers/view/EditViewModal.tsx

Keys needed (estimate):
- mlModel.*, mlFeature.* (training, features, etc.)
- view.* (logic, transformation, etc.)
```

**Batch 4 — Ownership & Access (MEDIUM PRIORITY)**
```
Files:
- datahub-web-react/src/app/entity/entityV2/containers/ownership/EditOwnersModal.tsx
- datahub-web-react/src/app/entity/entityV2/containers/ownership/ManageOwnership.tsx
- datahub-web-react/src/app/entity/entityV2/containers/access/AccessManagement.tsx
- datahub-web-react/src/app/entity/entityV2/containers/governance/GroupEditModal.tsx

Keys needed (estimate):
- ownership.* (owner type, role, etc.)
- access.* (permissions, visibility, etc.)
```

**Batch 5 — Remaining entityV2 (LOWER PRIORITY)**
```
Files (batch in groups of 3-5):
- datahub-web-react/src/app/entity/entityV2/EntityActions.tsx
- datahub-web-react/src/app/entity/entityV2/containers/EntityRelationships.tsx
- datahub-web-react/src/app/entity/entityV2/containers/links/LinkModal.tsx
- datahub-web-react/src/app/entity/entityV2/containers/lineage/LineageViewer.tsx
- [Continue with remaining ~170+ files in entityV2]

Process remaining files in batches of 3-5, grouping by feature area.
```

#### 2. ingestV2/ (~27 files)
```
Files (HIGH PRIORITY):
- datahub-web-react/src/app/ingest/sourceV2/IngestionSourceList.tsx
- datahub-web-react/src/app/ingest/sourceV2/RecipeForm.tsx
- datahub-web-react/src/app/ingest/sourceV2/SelectSourceStep.tsx
- datahub-web-react/src/app/ingest/sourceV2/AIChat.tsx
- datahub-web-react/src/app/ingest/sourceV2/multiStepBuilder/*.tsx (multiple files)

Keys needed:
- ingest.* (recipe, execution, schedule, etc.)
- source.* (connector, config, etc.)
```

#### 3. searchV2/ (~18 files)
```
Files:
- datahub-web-react/src/app/search/SearchPageV2/*.tsx
- datahub-web-react/src/app/search/sidebar/BrowseSidebar.tsx
- datahub-web-react/src/app/search/filters/SearchFilters.tsx

Keys needed:
- search.* (filters, results, facets, etc.)
```

#### 4. onboarding/ (~13 files)
```
Files:
- datahub-web-react/src/app/onboarding/configV2/*.tsx
- datahub-web-react/src/app/onboarding/tour/steps/*.tsx

Keys needed:
- onboarding.* (steps, guidance, etc.)
```

#### 5. identity/ (~8 files)
```
Files:
- datahub-web-react/src/app/identity/ManageIdentities.tsx
- datahub-web-react/src/app/identity/ServiceAccountList.tsx
- datahub-web-react/src/app/identity/CreateGroupModal.tsx

Keys needed:
- identity.* (user, group, etc.)
```

#### 6. sharedV2/ (~11 files)
```
Files:
- datahub-web-react/src/app/shared/queryBuilder/GroupHeader.tsx
- datahub-web-react/src/app/shared/propagation/LabelPropagationDetails.tsx

Keys needed:
- shared.* (generic UI labels)
```

#### 7. homeV3/ (~6 files)
```
Files:
- Remaining homeV3 module files

Keys needed:
- home.* (already mostly done, fill gaps)
```

#### 8. Other Directories
```
- govern/: AllowedValuesField.tsx, AdvancedOptions.tsx, StructuredPropsFormSection.tsx
- auth/resetCredentialsV2/: ResetCredentialsForm.tsx
- previewV2/: ColoredBackgroundPlatformIconGroup.tsx (trivial)

Keys needed:
- govern.structuredProperties.*
- auth.resetCredentials.*
```

---

## Execution Checklist for Part 2

### Before Each Agent Run:
- [ ] Agent reads en.json first (to see what keys exist)
- [ ] Agent identifies which hardcoded strings → which translation keys
- [ ] Agent uses consistent key naming: `namespace.subnamespace.key`

### Key Naming Conventions:
```
incident.*          # Incident-related UI
assertion.*         # Data quality assertions
schema.*            # Schema/column information
stats.*             # Historical stats/quality
mlModel.*           # ML model metadata
view.*              # Data view information
ownership.*         # Dataset ownership
access.*            # Access control / permissions
ingest.*            # Data ingestion
source.*            # Data source connectors
search.*            # Search functionality
identity.*          # User/group identity
shared.*            # Shared UI components
onboarding.*        # Onboarding flows
home.*              # Home page
govern.*            # Governance features
auth.*              # Authentication
```

### After Each Agent Run:
- [ ] Agent commits with `git add -A && git commit -m "feat(i18n): translate ..."`
- [ ] All 5 locale files have identical key structures
- [ ] No orphaned keys in any locale file
- [ ] New keys use English text as placeholder (for non-EN locales)

### Files That Must NOT Be Modified:
- ❌ en.json (only add keys here, never remove)
- ❌ datahub-web-react/src/i18n/config.ts
- ❌ datahub-web-react/src/i18n/__tests__/translations.test.ts

---

## Part 4 — PR Review Checklist (After Part 2 Complete)

Once all Part 2 agent runs finish and all components are translated:

### 1. Run Full Verification Suite
```bash
# Locale parity test (should still pass)
cd /home/tim/datahub/datahub-web-react
yarn test src/i18n/__tests__/translations.test.ts --run

# ESLint + Prettier + TypeScript
../gradlew :datahub-web-react:yarnLint

# Format check
../gradlew :datahub-web-react:yarn_format
```

### 2. PR Template Completion
File: `.github/pull_request_template.md`

**PR Title:**
```
feat(i18n): add internationalization support for DataHub frontend
```

**PR Body (summary):**
```markdown
## Summary
- Added i18next + react-i18next infrastructure for frontend translations
- Translated 273+ component files across 8 directories
- Supported locales: English (EN), German (DE), Spanish (ES), French (FR), Portuguese-Brazil (PT-BR)
- 3170+ translation keys across all namespaces
- Locale parity test passing (4/4 non-EN locales have all keys from EN)

## Architecture
- i18next config at `src/i18n/config.ts`
- Locale files at `src/i18n/locales/{en,de,es,fr,pt-br}.json`
- Locale sync component: `src/app/LocaleSync.tsx` (syncs backend user preference to frontend)
- Backend mutation: `updateUserLocale` (GraphQL, persists choice)

## Test Results
- ✅ Locale parity test: 4/4 passing
- ✅ ESLint: no hardcoded-colors violations
- ✅ Prettier: all files formatted
- ✅ TypeScript: strict mode passing

## Files Changed
- 273+ component files (added useTranslation hook + t() calls)
- 5 locale files (en.json, de.json, es.json, fr.json, pt-br.json)
- Tests: translations.test.ts (parity verification)

## Checklist
- [ ] All 4 locale parity tests passing
- [ ] ESLint passes (yarnLint)
- [ ] No hardcoded strings in translated components
- [ ] All locale files have identical key structure (3170 keys each)
- [ ] PR title conforms to Conventional Commits
- [ ] Links to related issues (if any)
```

### 3. Verification Checklist
- [ ] Run test suite — all passing
- [ ] Run linting — no errors
- [ ] Verify no hardcoded color warnings (ESLint rule: `no-hardcoded-colors`)
- [ ] Check that i18n is opt-in (users can toggle locale in Settings)
- [ ] Verify de.json, es.json, fr.json, pt-br.json have exactly 3170 keys each (same as en.json)

### 4. Final Checks Before Submit
```bash
# One last verification that test still passes
yarn test src/i18n/__tests__/translations.test.ts --run

# Check branch is up to date with master
git status  # Should show branch ahead of master by N commits

# Review commit history
git log --oneline origin/master..HEAD  # All i18n-related commits
```

### 5. Submit PR
```bash
gh pr create --title "feat(i18n): add internationalization support for DataHub frontend" \
  --body "$(cat <<'EOF'
## Summary
...
EOF
)"
```

---

## Critical Files Reference

| File | Purpose |
|------|---------|
| `src/i18n/locales/en.json` | Master locale file (3170 keys) |
| `src/i18n/locales/de.json` | German translation (must match EN structure) |
| `src/i18n/locales/es.json` | Spanish translation (must match EN structure) |
| `src/i18n/locales/fr.json` | French translation (must match EN structure) |
| `src/i18n/locales/pt-br.json` | Portuguese-Brazil translation (must match EN structure) |
| `src/i18n/config.ts` | i18next configuration (DO NOT MODIFY) |
| `src/i18n/__tests__/translations.test.ts` | Parity verification test (DO NOT MODIFY) |
| `src/app/LocaleSync.tsx` | Backend↔Frontend locale sync (DO NOT MODIFY) |

---

## Agent Execution Template

When running agents for Part 2, use this prompt template:

```
You must translate [DIRECTORY] component files for DataHub i18n.

## Target Files (read all carefully):
- [FILE1]
- [FILE2]
- [FILE3]
- [FILE4]
- [FILE5]

## Your Task:

1. **Read locales/en.json first** to understand existing keys and structure
2. **For each target file:**
   - Identify all hardcoded English strings (labels, placeholders, tooltips, etc.)
   - Determine which translation namespace they belong to (incident.*, schema.*, etc.)
   - Replace hardcoded strings with t('namespace.key') calls
3. **Add new keys to ALL 5 locale files** (en, de, es, fr, pt-br):
   - Use the Read tool to load each locale file
   - Find the correct namespace (create if doesn't exist)
   - Add missing keys with English text as value
   - Use Edit tool to update files
4. **Commit when done:**
   ```bash
   git add -A
   git commit -m "feat(i18n): translate [feature] components ([N] files)"
   ```

## Critical Rules:
- DO NOT remove or modify existing keys in any locale file
- All 5 locale files must have identical key structure
- Use English text as fallback for non-EN locales
- Keys should follow pattern: namespace.subnamespace.key
- Preserve JSON structure and nesting

## Files to Modify:
- Target component files (add useTranslation hook + t() calls)
- All 5 locale JSON files (add missing keys)

## Output:
- List of keys added per namespace
- Files modified count
- Commit hash when done
```

---

## Status Tracking

**Completed:**
- ✅ Part 1: Locale parity fix (commit: 8687b15e1b)
- ✅ Part 3: Verification test passing

**To Do (Part 2):**
- entityV2 batches 1-5 (~184 files)
- ingestV2 batch (~27 files)
- searchV2 batch (~18 files)
- onboarding batch (~13 files)
- identity batch (~8 files)
- sharedV2 batch (~11 files)
- homeV3 batch (~6 files)
- other directories (~3 files)

**To Do (Part 4):**
- Run full verification suite
- Prepare PR with correct title/body format
- Submit PR to master

---

## Resume Instructions

To continue after a restart:

1. Verify git status is clean:
   ```bash
   cd /home/tim/datahub
   git status  # Should show clean working tree
   ```

2. Verify parity test still passes (Part 1 was successful):
   ```bash
   cd datahub-web-react
   yarn test src/i18n/__tests__/translations.test.ts --run
   ```

3. Launch agents for Part 2 in parallel batches:
   - Start with entityV2 batch 1 (3 agents)
   - Use the **Agent Execution Template** above
   - Wait for commits to complete
   - Move to next batch

4. After all Part 2 agents complete:
   - Run Part 4 verification suite
   - Create PR using PR template

---

**Next Step:** Run entityV2 batch 1 agents (IncidentEditor, HistoricalStatsView, AssertionDescription files)
