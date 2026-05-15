# BPMN Config-Driven Generation - Schema Design & Examples

## Overview

This document defines the JSON configuration schema for BPMN process generation. The approach separates concerns:

- **GenAI Role**: Analyze business documents → Generate JSON config
- **Python Role**: Read JSON config → Generate valid BPMN XML with proper references

## Design Principles

1. **Declarative**: Config describes WHAT, not HOW
2. **ID Management**: All IDs pre-defined in config for proper referencing
3. **Validation-Ready**: Structure enables validation before generation
4. **GenAI-Friendly**: Simple, predictable structure for LLM generation
5. **Complete**: All BPMN elements and relationships defined

---

## JSON Schema Definition

### Root Structure

```json
{
  "process": {
    "id": "string (required)",
    "name": "string (required)",
    "description": "string (optional)",
    "version": "string (optional, default: 1.0)"
  },
  "metadata": {
    "created_by": "string (optional)",
    "created_date": "ISO date (optional)",
    "source_document": "string (optional)",
    "business_context": "string (optional)"
  },
  "roles": [
    {
      "id": "string (required, unique)",
      "name": "string (required)",
      "description": "string (optional)"
    }
  ],
  "milestones": [
    {
      "id": "string (required, unique)",
      "name": "string (required)",
      "description": "string (optional)"
    }
  ],
  "elements": [
    {
      "id": "string (required, unique)",
      "type": "startEvent|endEvent|userTask|serviceTask|exclusiveGateway|parallelGateway",
      "name": "string (required)",
      "role_id": "string (optional, references roles.id)",
      "milestone_id": "string (optional, references milestones.id)",
      "properties": {
        "description": "string (optional)",
        "implementation": "string (optional, for service tasks)",
        "form": "string (optional, for user tasks)"
      }
    }
  ],
  "flows": [
    {
      "id": "string (required, unique)",
      "source_id": "string (required, references elements.id)",
      "target_id": "string (required, references elements.id)",
      "name": "string (optional, for gateway conditions)",
      "condition": "string (optional, expression for gateways)"
    }
  ],
  "lanes": [
    {
      "id": "string (required, unique)",
      "name": "string (required)",
      "role_id": "string (required, references roles.id)",
      "element_ids": ["string (references elements.id)"]
    }
  ]
}
```

---

## Example 1: Simple Linear Flow

**Use Case**: Basic sequential process (Claims Processing)

```json
{
  "process": {
    "id": "proc-claims-001",
    "name": "Simple Claims Process",
    "description": "Basic claims processing workflow",
    "version": "1.0"
  },
  "metadata": {
    "created_by": "BAW Blueprint Parser",
    "created_date": "2026-05-15T06:00:00Z",
    "source_document": "claims_process_blueprint.pdf",
    "business_context": "Insurance Claims"
  },
  "roles": [
    {
      "id": "role-analyst",
      "name": "Claims Analyst",
      "description": "Reviews and analyzes claims"
    },
    {
      "id": "role-manager",
      "name": "Claim Manager",
      "description": "Makes final decisions on claims"
    }
  ],
  "milestones": [
    {
      "id": "ms-onboard",
      "name": "Onboarding",
      "description": "Initial claim setup and document retrieval"
    },
    {
      "id": "ms-review",
      "name": "Review",
      "description": "Claim analysis phase"
    },
    {
      "id": "ms-decision",
      "name": "Decision",
      "description": "Final determination"
    }
  ],
  "elements": [
    {
      "id": "elem-start-001",
      "type": "startEvent",
      "name": "Start",
      "milestone_id": "ms-onboard"
    },
    {
      "id": "elem-task-001",
      "type": "serviceTask",
      "name": "Retrieve Documentation",
      "milestone_id": "ms-onboard",
      "properties": {
        "description": "Automatically retrieve all claim documentation",
        "implementation": "DocumentRetrievalService"
      }
    },
    {
      "id": "elem-task-002",
      "type": "userTask",
      "name": "Review Claim",
      "role_id": "role-analyst",
      "milestone_id": "ms-review",
      "properties": {
        "description": "Analyst reviews claim details and documentation",
        "form": "ClaimReviewForm"
      }
    },
    {
      "id": "elem-task-003",
      "type": "userTask",
      "name": "Make Decision",
      "role_id": "role-manager",
      "milestone_id": "ms-decision",
      "properties": {
        "description": "Manager makes final approval decision",
        "form": "ClaimDecisionForm"
      }
    },
    {
      "id": "elem-end-001",
      "type": "endEvent",
      "name": "End",
      "milestone_id": "ms-decision"
    }
  ],
  "flows": [
    {
      "id": "flow-001",
      "source_id": "elem-start-001",
      "target_id": "elem-task-001"
    },
    {
      "id": "flow-002",
      "source_id": "elem-task-001",
      "target_id": "elem-task-002"
    },
    {
      "id": "flow-003",
      "source_id": "elem-task-002",
      "target_id": "elem-task-003"
    },
    {
      "id": "flow-004",
      "source_id": "elem-task-003",
      "target_id": "elem-end-001"
    }
  ],
  "lanes": [
    {
      "id": "lane-analyst",
      "name": "Claims Analyst",
      "role_id": "role-analyst",
      "element_ids": ["elem-task-002"]
    },
    {
      "id": "lane-manager",
      "name": "Claim Manager",
      "role_id": "role-manager",
      "element_ids": ["elem-task-003", "elem-end-001"]
    }
  ]
}
```

---

## Example 2: Approval Flow with Decision Gateway

**Use Case**: Loan approval with approve/reject paths

```json
{
  "process": {
    "id": "proc-loan-001",
    "name": "Loan Approval Process",
    "description": "Loan application review and approval workflow",
    "version": "1.0"
  },
  "metadata": {
    "created_by": "BAW Blueprint Parser",
    "created_date": "2026-05-15T06:00:00Z",
    "source_document": "loan_approval_blueprint.pdf",
    "business_context": "Banking - Loan Processing"
  },
  "roles": [
    {
      "id": "role-officer",
      "name": "Loan Officer",
      "description": "Reviews loan applications"
    },
    {
      "id": "role-system",
      "name": "System",
      "description": "Automated system tasks"
    }
  ],
  "milestones": [
    {
      "id": "ms-review",
      "name": "Review",
      "description": "Application review phase"
    },
    {
      "id": "ms-decision",
      "name": "Decision",
      "description": "Approval decision phase"
    },
    {
      "id": "ms-processing",
      "name": "Processing",
      "description": "Post-decision processing"
    }
  ],
  "elements": [
    {
      "id": "elem-start-001",
      "type": "startEvent",
      "name": "Start",
      "milestone_id": "ms-review"
    },
    {
      "id": "elem-task-001",
      "type": "userTask",
      "name": "Review Loan Application",
      "role_id": "role-officer",
      "milestone_id": "ms-review",
      "properties": {
        "description": "Loan officer reviews application details",
        "form": "LoanReviewForm"
      }
    },
    {
      "id": "elem-gateway-001",
      "type": "exclusiveGateway",
      "name": "Approval Decision",
      "milestone_id": "ms-decision",
      "properties": {
        "description": "Decision point for loan approval"
      }
    },
    {
      "id": "elem-task-002",
      "type": "serviceTask",
      "name": "Process Loan",
      "role_id": "role-system",
      "milestone_id": "ms-processing",
      "properties": {
        "description": "System processes approved loan",
        "implementation": "LoanProcessingService"
      }
    },
    {
      "id": "elem-task-003",
      "type": "serviceTask",
      "name": "Notify Customer - Approved",
      "role_id": "role-system",
      "milestone_id": "ms-processing",
      "properties": {
        "description": "Send approval notification",
        "implementation": "NotificationService"
      }
    },
    {
      "id": "elem-task-004",
      "type": "serviceTask",
      "name": "Notify Customer - Rejected",
      "role_id": "role-system",
      "milestone_id": "ms-processing",
      "properties": {
        "description": "Send rejection notification",
        "implementation": "NotificationService"
      }
    },
    {
      "id": "elem-end-001",
      "type": "endEvent",
      "name": "Approved",
      "milestone_id": "ms-processing"
    },
    {
      "id": "elem-end-002",
      "type": "endEvent",
      "name": "Rejected",
      "milestone_id": "ms-processing"
    }
  ],
  "flows": [
    {
      "id": "flow-001",
      "source_id": "elem-start-001",
      "target_id": "elem-task-001"
    },
    {
      "id": "flow-002",
      "source_id": "elem-task-001",
      "target_id": "elem-gateway-001"
    },
    {
      "id": "flow-003",
      "source_id": "elem-gateway-001",
      "target_id": "elem-task-002",
      "name": "Approved",
      "condition": "approved == true"
    },
    {
      "id": "flow-004",
      "source_id": "elem-gateway-001",
      "target_id": "elem-task-004",
      "name": "Rejected",
      "condition": "approved == false"
    },
    {
      "id": "flow-005",
      "source_id": "elem-task-002",
      "target_id": "elem-task-003"
    },
    {
      "id": "flow-006",
      "source_id": "elem-task-003",
      "target_id": "elem-end-001"
    },
    {
      "id": "flow-007",
      "source_id": "elem-task-004",
      "target_id": "elem-end-002"
    }
  ],
  "lanes": [
    {
      "id": "lane-officer",
      "name": "Loan Officer",
      "role_id": "role-officer",
      "element_ids": ["elem-task-001"]
    },
    {
      "id": "lane-system",
      "name": "System",
      "role_id": "role-system",
      "element_ids": [
        "elem-task-002",
        "elem-task-003",
        "elem-task-004"
      ]
    }
  ]
}
```

---

## Example 3: Parallel Flow (Concurrent Execution)

**Use Case**: Order processing with parallel tasks

```json
{
  "process": {
    "id": "proc-order-001",
    "name": "Order Processing with Parallel Tasks",
    "description": "Order fulfillment with concurrent inventory and payment processing",
    "version": "1.0"
  },
  "metadata": {
    "created_by": "BAW Blueprint Parser",
    "created_date": "2026-05-15T06:00:00Z",
    "source_document": "order_processing_blueprint.pdf",
    "business_context": "E-Commerce - Order Fulfillment"
  },
  "roles": [
    {
      "id": "role-sales",
      "name": "Sales Representative",
      "description": "Handles order intake"
    },
    {
      "id": "role-warehouse",
      "name": "Warehouse Staff",
      "description": "Manages inventory and shipping"
    },
    {
      "id": "role-finance",
      "name": "Finance Team",
      "description": "Processes payments"
    }
  ],
  "milestones": [
    {
      "id": "ms-intake",
      "name": "Order Intake",
      "description": "Initial order reception"
    },
    {
      "id": "ms-processing",
      "name": "Processing",
      "description": "Parallel processing phase"
    },
    {
      "id": "ms-completion",
      "name": "Completion",
      "description": "Order completion"
    }
  ],
  "elements": [
    {
      "id": "elem-start-001",
      "type": "startEvent",
      "name": "Start",
      "milestone_id": "ms-intake"
    },
    {
      "id": "elem-task-001",
      "type": "userTask",
      "name": "Receive Order",
      "role_id": "role-sales",
      "milestone_id": "ms-intake",
      "properties": {
        "description": "Sales rep receives and validates order",
        "form": "OrderIntakeForm"
      }
    },
    {
      "id": "elem-gateway-001",
      "type": "parallelGateway",
      "name": "Fork - Start Parallel Processing",
      "milestone_id": "ms-processing",
      "properties": {
        "description": "Split into parallel paths"
      }
    },
    {
      "id": "elem-task-002",
      "type": "serviceTask",
      "name": "Check Inventory",
      "role_id": "role-warehouse",
      "milestone_id": "ms-processing",
      "properties": {
        "description": "Verify product availability",
        "implementation": "InventoryService"
      }
    },
    {
      "id": "elem-task-003",
      "type": "userTask",
      "name": "Prepare Shipment",
      "role_id": "role-warehouse",
      "milestone_id": "ms-processing",
      "properties": {
        "description": "Warehouse prepares items for shipping",
        "form": "ShipmentPreparationForm"
      }
    },
    {
      "id": "elem-task-004",
      "type": "userTask",
      "name": "Process Payment",
      "role_id": "role-finance",
      "milestone_id": "ms-processing",
      "properties": {
        "description": "Finance processes customer payment",
        "form": "PaymentProcessingForm"
      }
    },
    {
      "id": "elem-gateway-002",
      "type": "parallelGateway",
      "name": "Join - Merge Parallel Paths",
      "milestone_id": "ms-completion",
      "properties": {
        "description": "Wait for all parallel tasks to complete"
      }
    },
    {
      "id": "elem-task-005",
      "type": "serviceTask",
      "name": "Generate Invoice",
      "role_id": "role-finance",
      "milestone_id": "ms-completion",
      "properties": {
        "description": "System generates final invoice",
        "implementation": "InvoiceGenerationService"
      }
    },
    {
      "id": "elem-end-001",
      "type": "endEvent",
      "name": "End",
      "milestone_id": "ms-completion"
    }
  ],
  "flows": [
    {
      "id": "flow-001",
      "source_id": "elem-start-001",
      "target_id": "elem-task-001"
    },
    {
      "id": "flow-002",
      "source_id": "elem-task-001",
      "target_id": "elem-gateway-001"
    },
    {
      "id": "flow-003",
      "source_id": "elem-gateway-001",
      "target_id": "elem-task-002",
      "name": "Path A: Inventory"
    },
    {
      "id": "flow-004",
      "source_id": "elem-gateway-001",
      "target_id": "elem-task-004",
      "name": "Path B: Payment"
    },
    {
      "id": "flow-005",
      "source_id": "elem-task-002",
      "target_id": "elem-task-003"
    },
    {
      "id": "flow-006",
      "source_id": "elem-task-003",
      "target_id": "elem-gateway-002"
    },
    {
      "id": "flow-007",
      "source_id": "elem-task-004",
      "target_id": "elem-gateway-002"
    },
    {
      "id": "flow-008",
      "source_id": "elem-gateway-002",
      "target_id": "elem-task-005"
    },
    {
      "id": "flow-009",
      "source_id": "elem-task-005",
      "target_id": "elem-end-001"
    }
  ],
  "lanes": [
    {
      "id": "lane-sales",
      "name": "Sales",
      "role_id": "role-sales",
      "element_ids": ["elem-task-001"]
    },
    {
      "id": "lane-warehouse",
      "name": "Warehouse",
      "role_id": "role-warehouse",
      "element_ids": ["elem-task-002", "elem-task-003"]
    },
    {
      "id": "lane-finance",
      "name": "Finance",
      "role_id": "role-finance",
      "element_ids": ["elem-task-004", "elem-task-005"]
    }
  ]
}
```

---

## Example 4: Complex Swimlane Flow

**Use Case**: Multi-department workflow with handoffs

```json
{
  "process": {
    "id": "proc-employee-001",
    "name": "Employee Onboarding Process",
    "description": "Complete employee onboarding across multiple departments",
    "version": "1.0"
  },
  "metadata": {
    "created_by": "BAW Blueprint Parser",
    "created_date": "2026-05-15T06:00:00Z",
    "source_document": "hr_onboarding_blueprint.pdf",
    "business_context": "Human Resources - Employee Onboarding"
  },
  "roles": [
    {
      "id": "role-hr",
      "name": "HR Specialist",
      "description": "Human Resources team member"
    },
    {
      "id": "role-it",
      "name": "IT Administrator",
      "description": "IT department staff"
    },
    {
      "id": "role-facilities",
      "name": "Facilities Manager",
      "description": "Facilities management"
    },
    {
      "id": "role-manager",
      "name": "Department Manager",
      "description": "Hiring manager"
    }
  ],
  "milestones": [
    {
      "id": "ms-preparation",
      "name": "Preparation",
      "description": "Pre-arrival setup"
    },
    {
      "id": "ms-day-one",
      "name": "Day One",
      "description": "First day activities"
    },
    {
      "id": "ms-training",
      "name": "Training",
      "description": "Initial training period"
    },
    {
      "id": "ms-completion",
      "name": "Completion",
      "description": "Onboarding completion"
    }
  ],
  "elements": [
    {
      "id": "elem-start-001",
      "type": "startEvent",
      "name": "Start Onboarding",
      "milestone_id": "ms-preparation"
    },
    {
      "id": "elem-task-001",
      "type": "userTask",
      "name": "Create Employee Record",
      "role_id": "role-hr",
      "milestone_id": "ms-preparation",
      "properties": {
        "description": "HR creates employee profile in system",
        "form": "EmployeeRecordForm"
      }
    },
    {
      "id": "elem-task-002",
      "type": "userTask",
      "name": "Setup IT Accounts",
      "role_id": "role-it",
      "milestone_id": "ms-preparation",
      "properties": {
        "description": "IT creates email, network access, and system accounts",
        "form": "ITAccountSetupForm"
      }
    },
    {
      "id": "elem-task-003",
      "type": "userTask",
      "name": "Prepare Workspace",
      "role_id": "role-facilities",
      "milestone_id": "ms-preparation",
      "properties": {
        "description": "Facilities prepares desk, equipment, and access cards",
        "form": "WorkspacePreparationForm"
      }
    },
    {
      "id": "elem-task-004",
      "type": "userTask",
      "name": "Conduct Orientation",
      "role_id": "role-hr",
      "milestone_id": "ms-day-one",
      "properties": {
        "description": "HR conducts company orientation session",
        "form": "OrientationForm"
      }
    },
    {
      "id": "elem-task-005",
      "type": "userTask",
      "name": "Department Introduction",
      "role_id": "role-manager",
      "milestone_id": "ms-day-one",
      "properties": {
        "description": "Manager introduces employee to team and responsibilities",
        "form": "DepartmentIntroForm"
      }
    },
    {
      "id": "elem-task-006",
      "type": "userTask",
      "name": "Complete Training Modules",
      "role_id": "role-manager",
      "milestone_id": "ms-training",
      "properties": {
        "description": "Employee completes required training",
        "form": "TrainingCompletionForm"
      }
    },
    {
      "id": "elem-task-007",
      "type": "userTask",
      "name": "Review Onboarding Progress",
      "role_id": "role-hr",
      "milestone_id": "ms-completion",
      "properties": {
        "description": "HR reviews and confirms onboarding completion",
        "form": "OnboardingReviewForm"
      }
    },
    {
      "id": "elem-end-001",
      "type": "endEvent",
      "name": "Onboarding Complete",
      "milestone_id": "ms-completion"
    }
  ],
  "flows": [
    {
      "id": "flow-001",
      "source_id": "elem-start-001",
      "target_id": "elem-task-001"
    },
    {
      "id": "flow-002",
      "source_id": "elem-task-001",
      "target_id": "elem-task-002"
    },
    {
      "id": "flow-003",
      "source_id": "elem-task-002",
      "target_id": "elem-task-003"
    },
    {
      "id": "flow-004",
      "source_id": "elem-task-003",
      "target_id": "elem-task-004"
    },
    {
      "id": "flow-005",
      "source_id": "elem-task-004",
      "target_id": "elem-task-005"
    },
    {
      "id": "flow-006",
      "source_id": "elem-task-005",
      "target_id": "elem-task-006"
    },
    {
      "id": "flow-007",
      "source_id": "elem-task-006",
      "target_id": "elem-task-007"
    },
    {
      "id": "flow-008",
      "source_id": "elem-task-007",
      "target_id": "elem-end-001"
    }
  ],
  "lanes": [
    {
      "id": "lane-hr",
      "name": "Human Resources",
      "role_id": "role-hr",
      "element_ids": ["elem-task-001", "elem-task-004", "elem-task-007"]
    },
    {
      "id": "lane-it",
      "name": "IT Department",
      "role_id": "role-it",
      "element_ids": ["elem-task-002"]
    },
    {
      "id": "lane-facilities",
      "name": "Facilities",
      "role_id": "role-facilities",
      "element_ids": ["elem-task-003"]
    },
    {
      "id": "lane-manager",
      "name": "Department Manager",
      "role_id": "role-manager",
      "element_ids": ["elem-task-005", "elem-task-006"]
    }
  ]
}
```

---

## Schema Validation Rules

### Required Validations

1. **ID Uniqueness**: All IDs must be unique within their category
2. **Reference Integrity**: All referenced IDs must exist
   - `role_id` must reference a valid role
   - `milestone_id` must reference a valid milestone
   - `source_id` and `target_id` in flows must reference valid elements
   - `element_ids` in lanes must reference valid elements
3. **Flow Connectivity**: 
   - Must have at least one start event
   - Must have at least one end event
   - All elements should be reachable from start
4. **Gateway Rules**:
   - Exclusive gateways must have at least 2 outgoing flows
   - Parallel gateways (fork) must have at least 2 outgoing flows
   - Parallel gateways (join) must have at least 2 incoming flows
5. **Lane Coverage**: Elements in lanes must not overlap

### Optional Validations (Warnings)

1. Disconnected elements
2. Elements without milestone assignment
3. User tasks without role assignment
4. Missing descriptions

---

## GenAI Generation Guidelines

When GenAI analyzes a business document to create this config:

### Step 1: Extract Process Information
- Process name and description
- Business context
- Source document reference

### Step 2: Identify Roles
- Extract all actors/roles mentioned
- Create unique IDs (role-xxx format)
- Include descriptions

### Step 3: Identify Milestones/Phases
- Extract process phases or stages
- Create unique IDs (ms-xxx format)
- Map to process timeline

### Step 4: Extract Activities
- Identify all tasks/activities
- Determine type (user vs service)
- Assign to roles and milestones
- Create unique IDs (elem-xxx format)

### Step 5: Determine Flow
- Identify sequence of activities
- Detect decision points (gateways)
- Detect parallel execution
- Create flow connections with unique IDs

### Step 6: Organize Lanes
- Group activities by role
- Create lane definitions
- Ensure no overlaps

---

## Python Builder Requirements

The config-driven builder should:

1. **Load & Validate Config**
   - Parse JSON
   - Validate schema
   - Check reference integrity
   - Report errors clearly

2. **Generate BPMN Elements**
   - Use provided IDs (no generation)
   - Create proper XML structure
   - Handle all element types
   - Apply properties correctly

3. **Manage References**
   - Link flows to elements
   - Link elements to roles
   - Link elements to milestones
   - Link elements to lanes

4. **Generate Complete BPMN**
   - Valid BPMN 2.0 XML
   - IBM BPM extensions (milestones)
   - Proper namespaces
   - Well-formatted output

5. **Provide Feedback**
   - Validation report
   - Generation summary
   - Error messages
   - Success confirmation

---

## Next Steps

1. **Review & Validate Schema**: Confirm this schema meets all requirements
2. **Create Config Builder**: Python module to consume these configs
3. **Integrate with Blueprint Parser**: Enhance mode to output these configs
4. **Create Test Suite**: Validate all example configs
5. **Document for GenAI**: Create prompts for config generation

---

## Benefits of This Approach

✅ **Separation of Concerns**: GenAI focuses on understanding, Python on generation
✅ **Predictable Output**: Deterministic BPMN generation from config
✅ **Easy Validation**: Config can be validated before BPMN generation
✅ **Debuggable**: Config is human-readable and editable
✅ **Reusable**: Same config can generate different formats (BPMN, Mermaid, etc.)
✅ **Testable**: Config examples serve as test cases
✅ **Maintainable**: Schema changes don't require retraining GenAI