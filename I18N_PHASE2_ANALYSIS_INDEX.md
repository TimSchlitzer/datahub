# i18n Phase 2 Analysis — Document Index

**Analysis Date**: 2026-03-16
**Status**: Complete and ready for implementation
**Scope**: High-value namespace analysis for Phase 2 of i18n coverage

---

## QUICK START

Three documents provide complete guidance for Phase 2 execution:

### 1. **PHASE2_I18N_WIRING_PLAN.md** ← START HERE
**Purpose**: Detailed execution plan with file-by-file wiring instructions

**Contains**:
- Executive summary with key metrics
- Namespace coverage breakdown (govern, ingest, domain, assertion, etc.)
- 3 PR-by-PR plans with specific file locations and line numbers
- Execution checklist
- Success criteria and metrics

**When to use**: Reference during actual wiring work

---

### 2. **I18N_ANALYSIS_SUMMARY.md** ← READ BEFORE STARTING
**Purpose**: Strategic overview and decision framework

**Contains**:
- Namespace ranking by impact and difficulty
- Tier 1 (highest priority): govern (112 keys), ingest (509 keys)
- Tier 2 (medium): domain (52), assertion (34), filter (40), crud (101)
- Tier 3 (defer): analytics (29), form (27)
- Execution priority matrix (impact vs difficulty)
- Risk mitigation strategies
- Technical notes on each namespace
- Critical path files

**When to use**: Strategic planning and understanding rationale

---

### 3. **i18n-audit-report.md** (already exists)
**Purpose**: Complete audit of all 3,577 keys and usage status

**Contains**:
- Per-namespace lists of unused keys
- Current wiring status (which keys are used, which aren't)
- Files currently hardcoding strings
- All 2,021 unused keys listed by namespace

**When to use**: Looking up specific key existence or finding where a key is currently used

---

## KEY FINDINGS SUMMARY

### Total Unused Keys: 2,021 (56% of 3,577)

| Namespace | Total | Used | Unused | Phase 2 Target |
|-----------|-------|------|--------|----------------|
| **govern.structuredProperties** | 112 | 45 | 67 | **40-50** ✓ |
| **ingest** | 509 | 80 | 429 | **60-80** ✓ (selective) |
| **domain** | 52 | 25 | 27 | **15-25** ✓ |
| **assertion** | 34 | 0 | 34 | **20-25** ✓ |
| **filter** | 40 | 15 | 25 | 0-10 (verify) |
| **crud** | 101 | 20 | 81 | Defer Phase 3 |
| **analytics** | 29 | 0 | 29 | Defer Phase 3 |
| **form** | 27 | 5 | 22 | Defer Phase 3 |
| **Other** | 2,073 | 766 | 1,307 | Future phases |
| **TOTAL** | **3,577** | **1,556** | **2,021** | **150-190** |

---

## PHASE 2 EXECUTION PLAN

### Three PRs (8-11 hours total)

#### PR 1: govern.structuredProperties (40-50 keys, 2-3 hours)
**Status**: ✓ Ready — All keys exist in en.json
**Files**: 8 components in `govern/structuredProperties/`

Key deliverables:
- Wire cardinality field labels (4 keys)
- Wire qualified name advanced options (4 keys)
- Wire allowed values field labels (7 keys)
- Wire entity types section (12 keys)
- Wire display preferences (3 keys)
- Wire form-wide field labels (17 keys)

---

#### PR 2: ingest (60-80 keys, 3-4 hours, selective)
**Status**: ✓ Ready — Selective wiring strategy
**Files**: 6-7 components in `ingestV2/`
**Strategy**: Wire high-traffic paths, defer 300+ connector-specific keys

Key deliverables:
- Execution status & summary displays (24 keys)
- Source builder form steps (25 keys)
- Secret management UI (15 keys)
- Schedule/timezone config (8 keys)

**Deferred to Phase 3**: bigquery.*, dbtCloud.*, common.*, etc. (300+ keys)

---

#### PR 3: domain + assertion (50-60 keys, 3-4 hours)
**Status**: ✓ Ready
**Files**: 10-12 components

Key deliverables:
- Assertion status displays (10 keys)
- Assertion types (15 keys)
- Domain operations (13 keys)

---

## NAMESPACE STRATEGIES

### GOVERN (112 keys) — Complete Wiring ✓
- **Current state**: 45 keys wired (45%)
- **Difficulty**: EASY — Self-contained form component set
- **Recommendation**: Wire 40-50 additional keys in Phase 2
- **Rationale**: High impact, localized, all keys exist in all locales
- **Effort**: ~2-3 hours

### INGEST (509 keys) — Selective Wiring ✓
- **Current state**: ~80 keys wired (16%)
- **Difficulty**: MEDIUM — Requires strategic selection
- **Recommendation**: Wire 60-80 keys (user-visible paths)
- **Defer**: 300+ connector-specific keys to Phase 3
- **Rationale**: Too large to wire completely; connector keys are auto-generated
- **Effort**: ~3-4 hours (for user-visible subset)

### DOMAIN (52 keys) — Partial Wiring ✓
- **Current state**: ~25 keys wired (48%)
- **Difficulty**: EASY
- **Recommendation**: Wire 15-25 additional keys
- **Rationale**: Governance feature, manageable scope
- **Effort**: ~1 hour (included in PR#3)

### ASSERTION (34 keys) — Complete Wiring ✓
- **Current state**: 0 keys wired (0%)
- **Difficulty**: MEDIUM
- **Recommendation**: Wire 20-25 keys
- **Rationale**: Critical governance feature, translations already complete
- **Effort**: ~2-3 hours (included in PR#3)

### FILTER (40 keys) — Verify Status ❓
- **Current state**: ~15 keys wired (37.5%)
- **Difficulty**: MEDIUM
- **Recommendation**: Verify current wiring in AdvancedFilters.tsx before committing
- **Decision**: Phase 2 only if not already complete

### CRUD (101 keys) — Defer to Phase 3 ⏭
- **Current state**: ~20 keys wired (20%)
- **Difficulty**: HARD — Distributed across many components
- **Recommendation**: Defer to Phase 3 (batch wiring strategy)
- **Rationale**: Requires coordination across multiple pages

### ANALYTICS (29 keys) — Defer to Phase 3 ⏭
- **Current state**: 0 keys wired
- **Difficulty**: MEDIUM
- **Recommendation**: Defer (admin-only feature)
- **Rationale**: Low user impact, can batch in Phase 3

### FORM (27 keys) — Defer to Phase 3 ⏭
- **Current state**: ~5 keys wired
- **Difficulty**: HARD — Requires validation refactoring
- **Recommendation**: Defer (requires form component changes)
- **Rationale**: Best handled as part of validation system redesign

---

## FILE-BY-FILE WIRING TARGETS

### PR 1: govern.structuredProperties (8 files)

1. **AllowedValuesDrawer.tsx** — Lines 117, 137
   - 2 tooltips: "Remove from allowed values", "Add new value"

2. **AllowedValuesField.tsx** — Lines 34, 54, 67
   - 3 labels/tooltips

3. **AdvancedOptions.tsx** — Lines 41, 62
   - 2 tooltips: qualified name help text and placeholder

4. **ViewAdvancedOptions.tsx** — TBD
   - View mode display of advanced options

5. **StructuredPropsForm.tsx** — Multiple locations
   - 15+ form field labels (cardinality, types, etc.)

6. **StructuredPropsFormSection.tsx** — Lines 80-167
   - 12 keys for entity type selection section

7. **DisplayPreferences.tsx** — Multiple locations
   - 6 keys for display preference checkboxes

8. **ViewDisplayPreferences.tsx** — TBD
   - 4 keys for view mode display

### PR 2: ingest (6-7 files)

1. **NameSourceStep.tsx** — Lines 186-267
   - Source naming, executor ID, CLI version, debug mode, env vars

2. **CreateScheduleStep.tsx** — Lines 142-202
   - Schedule configuration, timezone selection

3. **SelectTemplateStep.tsx** — Line 121
   - Search placeholder

4. **SecretBuilderModal.tsx** — Lines 129-162
   - Secret form fields (name, value, description)

5. **SecretsList.tsx** — Lines 63-325
   - List labels, edit/delete buttons, search

6. **ExecutionRequestDetailsModal.tsx** — TBD
   - Execution status displays (24 keys)

7. **TestConnectionModal.tsx** (optional)
   - Connection test UI

### PR 3: domain + assertion (10-12 files)

**Domain files** (TBD exact paths):
- Domain detail page
- Domain management page
- Domain creation modal
- Domain deletion confirmation
- Add assets to domain UI
- Domain list components

**Assertion files** (TBD exact paths):
- AssertionList.tsx
- AssertionBuilder.tsx
- AssertionView.tsx
- Assertion status displays
- Assertion type descriptions
- Evaluation metrics display

---

## EXECUTION CHECKLIST

### Before Phase 2 Starts
- [ ] Read I18N_ANALYSIS_SUMMARY.md for strategic context
- [ ] Read PHASE2_I18N_WIRING_PLAN.md for detailed instructions
- [ ] Verify all 3 PRs can be created from feat/i18n-v2 branch
- [ ] Create 3 feature branches (feat/i18n-govern, feat/i18n-ingest, feat/i18n-domain)
- [ ] Run latest audit: `./datahub-web-react/scripts/i18n-audit.sh`
- [ ] Confirm en.json has all keys mentioned in plan

### During Phase 2 (Each PR)
- [ ] Wire all identified hardcoded strings
- [ ] Run linting: `./gradlew :datahub-web-react:yarnLint`
- [ ] Run formatting: `./gradlew :datahub-web-react:yarnFormat`
- [ ] Test UI in English (verify labels appear)
- [ ] Test UI in German (verify translations load)
- [ ] Create PR with clear title and description
- [ ] Link to this analysis in PR description
- [ ] Merge after review

### After Phase 2 Complete
- [ ] Run final audit
- [ ] Verify all 3 PRs merged
- [ ] Update project MEMORY.md with Phase 2 notes
- [ ] Plan Phase 3 (remaining 1,830 keys)

---

## REFERENCE: AUDIT RESULTS

From `i18n-audit-report.md`:

**Total Keys Breakdown**:
- Source (EN): 3,577 keys
- German (DE): 3,577 keys (100% present)
- Spanish (ES): 3,577 keys (100% present)
- French (FR): 3,577 keys (100% present)
- Portuguese-BR (PT-BR): 3,577 keys (100% present)

**Unused Keys: 2,021** (56% of total)

**Coverage by Phase**:
- Phase 1 (completed): 285 broken keys fixed
- Phase 2 (this plan): 150-190 keys wired
- Phase 3+: ~1,600 remaining keys

---

## SUCCESS METRICS

**Phase 2 complete when**:
- [ ] 3 PRs merged
- [ ] 150-190 keys wired
- [ ] govern: 75+ / 112 (67%)
- [ ] ingest: 80+ / 509 (16%)
- [ ] domain + assertion: 35-45 / 86 (41%)
- [ ] Total app: 1,700+ / 3,577 (48%)
- [ ] 0 ESLint errors
- [ ] 0 Prettier violations
- [ ] UI tested in EN + DE locales

---

## CONTACT & QUESTIONS

For detailed questions about specific files or keys:
1. Check PHASE2_I18N_WIRING_PLAN.md (exhaustive file-by-file guide)
2. Check i18n-audit-report.md (complete key listings)
3. Search en.json for specific key names

---

**Generated**: 2026-03-16
**Analysis Tools**: grep, jq, git, audit script
**Status**: Ready for Phase 2 implementation
