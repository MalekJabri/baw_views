# 📘 BAW Blueprint Parser Mode

## Overview

The **BAW Blueprint Parser** mode is a specialized AI assistant mode designed to transform business documentation into IBM Business Automation Workflow (BAW) artifacts. This mode has evolved from a simple document parser into a comprehensive business modeling system that handles:

- **Business Object Generation** - Data structures and entities
- **Business Process Discovery** - Workflows and process flows
- **Dependency Management** - Relationships and processing order
- **Catalog Management** - Organization by business context
- **Class ID Registration** - Version control and reusability
- **Discovery Documentation** - Traceability and assumptions

## Purpose

This mode serves as the bridge between business documentation and technical implementation by:

### Business Object Capabilities
- **Parsing** business blueprint documents (PDFs, Word docs, etc.) from the `business-blueprints/` directory
- **Extracting** business entities, fields, relationships, and enumerations with industry best practices
- **Normalizing** business concepts into repository-aligned data models
- **Generating** JSON business object files with proper structure and metadata
- **Creating** comprehensive discovery reports documenting assumptions and traceability
- **Managing** catalog artifacts for business object organization by context
- **Registering** business objects with deterministic BAW class IDs for version control
- **Analyzing** dependencies and providing optimal processing order
- **Reusing** existing business object definitions across widgets and processes

### Business Process Capabilities
- **Discovering** business processes and workflows from blueprint documents
- **Modeling** process flows with actors, activities, and decision points
- **Generating** Mermaid diagrams for process visualization
- **Documenting** process steps, business rules, and integration points
- **Linking** processes to relevant business objects (data flow)
- **Creating** process catalogs organized by business context
- **Preparing** structured metadata for future BPMN generation

## When to Use This Mode

Use the BAW Blueprint Parser mode when you need to:

### Business Object Tasks
- ✅ Analyze business documents and extract comprehensive data models
- ✅ Transform business requirements into structured business objects
- ✅ Generate JSON business object definitions from documentation
- ✅ Create discovery reports documenting business entities and relationships
- ✅ Create catalog files for business object organization by context
- ✅ Register business objects with deterministic class IDs
- ✅ Analyze dependencies between business objects
- ✅ Prepare business objects for packaging into BAW toolkits
- ✅ Document assumptions, enumerations, and traceability
- ✅ Reuse existing business object definitions across projects

### Business Process Tasks
- ✅ Discover and model business processes from blueprint documents
- ✅ Generate Mermaid diagrams for process visualization
- ✅ Document process workflows with actors and decision points
- ✅ Link processes to business objects (data flow)
- ✅ Create process catalogs organized by context
- ✅ Prepare structured metadata for future BPMN generation
- ✅ Identify subprocesses and process relationships
- ✅ Document integration points and system interactions

**Do NOT use this mode for:**

- ❌ Packaging business objects/processes into TWX files (use BAW Package Manager)
- ❌ Deploying toolkits to BAW servers (use BAW Package Manager)
- ❌ Creating or modifying coach widgets (use BAW Coach Widget)
- ❌ Designing coach layouts (use BAW Coach Composer)
- ❌ Generating actual BPMN XML (future capability, currently generates Mermaid)

## Workflow

```mermaid
graph TD
    A[Start: Business Blueprint Document] --> B[Understand Request & Context]
    B --> C[Inspect Source Documents & Existing Patterns]
    C --> D[Extract Business Concepts & Relationships]
    D --> E[Extract Business Processes & Workflows]
    E --> F[Normalize Business Object Models]
    F --> G[Generate Business Object JSON Artifacts]
    G --> H[Generate Business Process Definitions]
    H --> I[Create Discovery Report]
    I --> J[Create/Update Business Object Catalogs]
    J --> K[Create/Update Process Catalogs]
    K --> L[Register Business Objects with Class IDs]
    L --> M[Analyze Dependencies]
    M --> N[Validate Generation Readiness]
    N --> O{Ready for Packaging?}
    O -->|Yes| P[Switch to BAW Package Manager]
    O -->|No| Q[Document Issues & Iterate]
    Q --> D
    
    style A fill:#e1f5ff
    style D fill:#fff4e1
    style E fill:#fff4e1
    style G fill:#ffe1f5
    style H fill:#ffe1f5
    style I fill:#ffffe1
    style L fill:#e1ffe1
    style P fill:#90EE90
```

## Detailed Workflow Steps

### 1. Understand the Blueprint Request

**Purpose:** Identify the business domain, source documents, and intended outcome.

**Actions:**
- Determine which files/folders in `business-blueprints/` are in scope
- Identify the business domain or context name for output organization
- Clarify if the user wants analysis only, planning, or actual generation
- Identify naming constraints, namespaces, or catalog preferences

### 2. Inspect Source Documents and Existing Patterns

**Purpose:** Read source documents and understand repository conventions.

**Actions:**
- Inspect selected business blueprint sources
- Read comparable existing business object JSON examples
- Review existing generation utilities and helpers
- Use repository's artifact structure as reference

**Important:** Always ground generation decisions in existing repository conventions rather than inventing new schemas.

### 3. Extract Business Concepts and Relationships

**Purpose:** Identify candidate business objects, fields, relationships, and enumerations.

**Actions:**
- Identify core business entities (e.g., Policy, Claim, Application)
- Extract supporting objects (e.g., Address, Document, Payment)
- Identify enumerations and their valid values
- Extract attributes, types, optionality, and constraints
- Map relationships between entities (1:1, 1:N, N:M)
- Identify nested objects and complex types
- Document business rules and validation constraints
- Capture ambiguous or incomplete sections for review

**Output:** Comprehensive structured understanding of the business domain.

### 4. Extract Business Processes and Workflows

**Purpose:** Identify and model business processes described in the blueprint.

**Actions:**
- Scan for process descriptions, workflows, and sequential activities
- Identify process names, actors, and swimlanes
- Extract process steps, decision points, and flow logic
- Map processes to relevant business objects (data flow)
- Identify subprocesses and process relationships
- Note integration points and system interactions

**Output:** Structured understanding of business processes alongside business objects.

### 5. Normalize Business Object Models

**Purpose:** Transform extracted concepts into stable business object models.

**Actions:**
- Resolve duplicate or overlapping entities
- Normalize naming conventions (PascalCase for objects, camelCase for fields)
- Separate enumerations, nested objects, and references
- Align field typing with BAW type mappings
- Ensure consistency across related objects
- Optimize for reusability across widgets and processes

### 6. Generate Business Object JSON Artifacts

**Purpose:** Create JSON business object files.

**Actions:**
- Generate one JSON file per business object under `business-objects/generated/[context]/`
- Use stable PascalCase file names (e.g., `Claim.json`, `Policy.json`)
- Include complete property definitions with types and descriptions
- Handle complex types and array properties
- Reference other business objects correctly
- Ensure JSON structure matches BAW packaging requirements

### 7. Generate Business Process Definitions

**Purpose:** Create Markdown files with Mermaid diagrams for each identified business process.

**Actions:**
- Generate one Markdown file per process under `business-processes/[context]/`
- Include Mermaid flowchart or sequence diagrams visualizing the process
- Document process steps, decision points, and actors
- Link process activities to relevant business objects
- Include structured process metadata in JSON format for future BPMN generation
- Use appropriate diagram types (flowchart with swimlanes, sequence diagrams)

**Important:** Process definitions are currently generated as Mermaid diagrams in Markdown. The structured metadata prepares for future BPMN artifact generation.

### 8. Create Discovery Report

**Purpose:** Document the complete business model with traceability.

**Actions:**
- Create comprehensive discovery report at `business-objects/reports/[context].discovery-report.md`
- Document all core entities with full attribute lists
- Document all supporting objects
- List all enumerations with valid values
- Map relationships and dependencies
- Document business rules and constraints
- List assumptions and considerations
- Provide integration points and process workflows

**Output:** Complete documentation for stakeholder review and future reference.

### 9. Create and Update Business Object Catalogs

**Purpose:** Organize business objects by context.

**Actions:**
- Create context catalog at `business-objects/catalog/[context].catalog.json`
- Update global catalog at `business-objects/catalog/master.catalog.json`
- List all business objects in the context
- Document context purpose and scope
- Track creation and modification dates

### 10. Create and Update Process Catalogs

**Purpose:** Organize business processes by context.

**Actions:**
- Create process catalog at `business-processes/catalog/[context].process-catalog.json`
- Update master process catalog at `business-processes/catalog/master.process-catalog.json`
- List all processes with metadata
- Include relationships between processes
- Link processes to business objects they use

### 11. Register Business Objects with Class IDs

**Purpose:** Assign unique BAW class IDs to all business objects for version control.

**Actions:**
- Run the registration process: `python3 register_business_objects.py`
- Verify all objects are registered in `toolkit_packager/baw_custom_types.json`
- Confirm class IDs are deterministic (same name + context = same GUID)
- Track which widgets use each business object
- Note any circular dependencies (normal and expected)

**Important:** Class ID registration is idempotent - running multiple times reuses existing IDs. This ensures stable identifiers for packaging and version control.

**Registry Benefits:**
- Enables business object reuse across widgets
- Maintains version control through deterministic GUIDs
- Tracks usage and dependencies
- Supports incremental development

### 12. Analyze Dependencies

**Purpose:** Understand relationships and processing order.

**Actions:**
- Build dependency graph between business objects
- Identify circular dependencies
- Determine optimal processing order (dependencies first)
- Validate all referenced types exist
- Document dependency relationships
- Verify process-to-business-object links are valid

### 13. Validate Generation Readiness

**Purpose:** Verify artifacts are consistent and follow conventions.

**Actions:**
- Verify object names are unique within context
- Verify all referenced objects are resolvable
- Verify field types match supported BAW type mappings
- Verify all business objects have registered class IDs
- Verify process names are unique and properly structured
- Verify process-to-business-object links are valid
- Check catalog consistency
- Review discovery report completeness
- Review assumptions or unresolved ambiguities

### 14. Preserve Boundaries and Handoff Cleanly

**Purpose:** Complete artifact generation and hand off to packaging mode.

**Actions:**
- Summarize what was generated (business objects and processes) and from which sources
- List all generated business objects by context
- List all generated business processes by context
- State any assumptions that influenced the output model
- Reference the discovery report for detailed documentation
- When packaging/deployment is needed, hand off to `baw-package-manager`

**Handoff Example:**
```xml
<switch_mode>
  <mode_slug>baw-package-manager</mode_slug>
  <reason>Business object JSON artifacts and business process definitions are ready for toolkit packaging. Generated 18 business objects and 4 processes for LifeInsuranceAndAnnuities context.</reason>
</switch_mode>
```

## Output Structure

### Business Objects

```
business-objects/
├── generated/
│   └── [context]/              # e.g., LifeInsuranceAndAnnuities
│       ├── Address.json
│       ├── Policy.json
│       ├── Claim.json
│       └── ...
├── catalog/
│   ├── [context].catalog.json  # Context-specific catalog
│   └── master.catalog.json     # Global catalog
└── reports/
    └── [context].discovery-report.md  # Comprehensive discovery documentation
```

### Business Processes

```
business-processes/
├── [context]/                  # e.g., LifeInsuranceAndAnnuities
│   ├── NewBusinessApplication.process.md
│   ├── ClaimsProcessing.process.md
│   ├── PolicyAdministration.process.md
│   └── ...
└── catalog/
    ├── [context].process-catalog.json  # Context-specific process catalog
    └── master.process-catalog.json     # Global process catalog
```

### File Naming Conventions

- **Business Objects:** PascalCase (e.g., `Claim.json`, `PolicyHolder.json`)
- **Business Processes:** PascalCase with `.process.md` extension (e.g., `NewBusinessApplication.process.md`)
- **Context:** Derived from business domain (e.g., `LifeInsuranceAndAnnuities`)
- **Catalogs:** `[context].catalog.json` and `master.catalog.json` for objects; `[context].process-catalog.json` and `master.process-catalog.json` for processes
- **Reports:** `[context].discovery-report.md` (comprehensive documentation)

## Core Principles

1. **Authoritative Source:** Treat business blueprints as the authoritative source for both data and process models
2. **Business Meaning First:** Extract business meaning before generating JSON and Mermaid artifacts
3. **Dual Discovery:** Discover both data structures (business objects) and workflows (business processes)
4. **Reuse Conventions:** Use existing repository patterns and utilities
5. **Deterministic Output:** Keep generated artifacts consistent and organized by context
6. **Structured Metadata:** Generate Mermaid diagrams with metadata structured for future BPMN conversion
7. **Packaging-Ready:** Produce outputs ready for packaging without performing packaging
8. **Document Assumptions:** Record assumptions and ambiguities when inferring business meaning
9. **Link Data and Process:** Connect processes to business objects they consume or produce

## Example Usage

### Scenario 1: Parse Life Insurance Blueprint for Business Objects

**User Request:**
> "Parse the LifeInsuranceAndAnnuities-2.pdf blueprint and generate business objects"

**Mode Actions:**
1. Read `business-blueprints/LifeInsuranceAndAnnuities-2.pdf`
2. Extract core entities: Policy, Claim, Beneficiary, Agent, etc.
3. Extract supporting objects: Address, Document, Payment, etc.
4. Identify enumerations: PolicyStatus, ClaimType, PaymentMethod, etc.
5. Normalize field names and types
6. Generate 18 JSON files in `business-objects/generated/LifeInsuranceAndAnnuities/`
7. Create comprehensive discovery report at `business-objects/reports/LifeInsuranceAndAnnuities.discovery-report.md`
8. Create catalog at `business-objects/catalog/LifeInsuranceAndAnnuities.catalog.json`
9. Update master catalog at `business-objects/catalog/master.catalog.json`
10. Register all business objects with deterministic class IDs using `python3 register_business_objects.py`
11. Analyze dependencies and provide processing order
12. Hand off to BAW Package Manager for packaging

### Scenario 2: Parse Life Insurance Blueprint for Business Processes

**User Request:**
> "Extract business processes from the LifeInsuranceAndAnnuities blueprint"

**Mode Actions:**
1. Read `business-blueprints/LifeInsuranceAndAnnuities-2.pdf`
2. Identify key workflows: New Business Application, Claims Processing, Policy Administration, Annuity Payout
3. Extract process steps, actors, and decision points
4. Model process flows with swimlanes
5. Generate Mermaid diagrams for each process
6. Link processes to relevant business objects (Application, Policy, Claim, etc.)
7. Document business rules and integration points
8. Create process files in `business-processes/LifeInsuranceAndAnnuities/`
9. Generate structured metadata for future BPMN conversion
10. Create process catalog at `business-processes/catalog/LifeInsuranceAndAnnuities.process-catalog.json`
11. Update master process catalog

### Scenario 3: Complete Blueprint Analysis (Objects + Processes)

**User Request:**
> "Perform complete analysis of the LifeInsuranceAndAnnuities blueprint"

**Mode Actions:**
1. Execute both business object and business process workflows
2. Generate comprehensive discovery report covering:
   - 18 business objects with full specifications
   - 26 enumerations with valid values
   - 4+ business processes with Mermaid diagrams
   - Business rules and constraints
   - Integration points and system interactions
3. Create cross-references between processes and business objects
4. Register all artifacts with appropriate catalogs
5. Provide complete traceability documentation
6. Hand off to BAW Package Manager when packaging is needed

## Integration with Other Modes

```mermaid
graph TD
    A[Business Blueprints] --> B[BAW Blueprint Parser]
    B -->|Business Objects JSON| C[BAW Package Manager]
    B -->|Process Definitions MD| C
    B -->|Discovery Reports| D[Documentation]
    C -->|TWX Packages| E[BAW Server]
    B -.->|Process Insights| F[BAW Coach Composer]
    B -.->|Data Models| G[BAW Coach Widget]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style E fill:#e1ffe1
```

**Workflow Integration:**
- **Input:** Business documentation in `business-blueprints/`
- **This Mode:**
  - Generates structured business objects (JSON)
  - Generates business process definitions (Markdown + Mermaid)
  - Creates discovery reports and catalogs
  - Registers artifacts with class IDs
- **Output Consumers:**
  - **BAW Package Manager:** Packages business objects into TWX files
  - **BAW Coach Composer:** Uses process insights for coach design
  - **BAW Coach Widget:** References business objects for data binding
  - **Documentation:** Discovery reports for stakeholder review

## Best Practices

### ✅ Do

**Business Objects:**
- Read existing business object examples before generating new ones
- Use consistent naming conventions (PascalCase for objects, camelCase for fields)
- Document assumptions in discovery reports when business meaning is unclear
- Validate all references and relationships before completion
- Register business objects with class IDs before packaging
- Analyze dependencies and provide processing order
- Create comprehensive discovery reports with enumerations and constraints

**Business Processes:**
- Extract process workflows alongside business objects
- Generate clear Mermaid diagrams with proper swimlanes
- Link processes to business objects they consume or produce
- Document decision points and business rules
- Include structured metadata for future BPMN generation
- Create process catalogs organized by context
- Identify subprocesses and process relationships

**General:**
- Organize artifacts by business context
- Maintain deterministic file naming
- Hand off to BAW Package Manager when packaging is needed
- Preserve traceability from blueprint to generated artifacts

### ❌ Don't

- Don't package or deploy artifacts in this mode
- Don't invent new JSON schemas without checking existing patterns
- Don't modify widget implementations
- Don't create coach layouts
- Don't skip the class ID registration step
- Don't generate BPMN XML directly (use Mermaid with metadata for now)
- Don't create processes without linking to relevant business objects

## Troubleshooting

### Issue: Ambiguous Business Concepts

**Solution:** Document assumptions in the parse report and clarify with the user before generating JSON.

### Issue: Circular Dependencies

**Solution:** This is normal for complex business models. The registration process handles circular dependencies automatically.

### Issue: Missing Field Types

**Solution:** Review existing business objects for similar fields and use consistent typing conventions.

### Issue: Duplicate Entity Names

**Solution:** Normalize entity names during the model normalization step to ensure uniqueness within the context.

## Related Documentation

- [BAW Package Manager Mode](./BAW_PACKAGE_MANAGER_MODE.md) - For packaging and deployment
- [BAW Coach Widget Mode](./BAW_COACHUI_VIEW_MODE.md) - For widget implementation
- [BAW Coach Composer Mode](./BAW_COACH_COMPOSER_MODE.md) - For coach design

## Summary

The BAW Blueprint Parser mode is your specialized assistant for transforming business documentation into structured, packaging-ready artifacts including:

- **Business Objects** - JSON definitions with deterministic class IDs
- **Business Processes** - Mermaid diagrams with structured metadata
- **Discovery Reports** - Comprehensive documentation with traceability
- **Catalogs** - Organized by business context for easy navigation
- **Dependency Analysis** - Processing order and relationship mapping

It handles the complex task of extracting business meaning from documents and generating consistent, well-organized artifacts that integrate seamlessly with the BAW toolkit packaging workflow.

**Key Takeaway:** This mode focuses on document-to-model transformation (both data and process) and stops at the packaging boundary, ensuring clean separation of concerns and smooth handoffs to other specialized modes.

## Evolution Highlights

### Phase 1: Basic Business Object Generation
- Simple JSON generation from blueprints
- Manual catalog management
- Basic field extraction

### Phase 2: Enhanced Business Object Management (Current)
- Comprehensive discovery reports with enumerations
- Deterministic class ID registration
- Dependency analysis and processing order
- Reusable business objects across widgets
- Context-based organization
- Master and context-specific catalogs

### Phase 3: Business Process Discovery (Current)
- Process workflow extraction from blueprints
- Mermaid diagram generation
- Actor and swimlane modeling
- Process-to-business-object linking
- Process catalogs and metadata
- Structured preparation for future BPMN generation

### Phase 4: Future BPMN Generation (Planned)
- Direct BPMN XML generation
- BAW process artifact packaging
- Deployment-ready process definitions