# BPMN Tools - Config-Driven User Guide

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Config File Structure](#config-file-structure)
4. [Creating Config Files](#creating-config-files)
5. [Generating BPMN](#generating-bpmn)
6. [Complete Examples](#complete-examples)
7. [Validation](#validation)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Introduction

### What is BPMN Tools?

BPMN Tools is a **config-driven** system for generating BPMN 2.0 (Business Process Model and Notation) workflows. You define your process in a JSON configuration file, and the tool automatically generates valid BPMN XML.

### Why Config-Driven?

✅ **Separation of Concerns** - Business logic in JSON, generation in Python  
✅ **AI/LLM Friendly** - Easy for AI systems to generate configs  
✅ **Version Control** - Track process changes in readable JSON  
✅ **Validation** - Validate configs before generating BPMN  
✅ **Reusable** - Same config can generate different formats  
✅ **Maintainable** - Update processes without code changes  

### Key Features

- BPMN 2.0 compliant XML generation
- IBM Business Automation Workflow (BAW) compatible
- Support for all major BPMN elements (tasks, gateways, events)
- Swimlane and milestone organization
- Built-in validation and error checking
- Command-line and Python API

---

## Getting Started

### Prerequisites

- Python 3.7 or higher
- No external dependencies required

### Installation

The BPMN Tools library is self-contained:

```
BPMN_tools/
├── generate_bpmn.py     # Main config loader
├── bpmn_generator.py    # BPMN XML generator
├── validator.py         # Validation utilities
└── flow_builder.py      # Helper utilities
```

### Quick Start

**Step 1:** Create a config file (`my_process.json`)

```json
{
  "process": {
    "id": "proc-001",
    "name": "My First Process",
    "version": "1.0"
  },
  "roles": [
    {
      "id": "role-user",
      "name": "User"
    }
  ],
  "elements": [
    {
      "id": "start-001",
      "type": "startEvent",
      "name": "Start"
    },
    {
      "id": "task-001",
      "type": "userTask",
      "name": "Complete Task",
      "assignee": "role-user"
    },
    {
      "id": "end-001",
      "type": "endEvent",
      "name": "End"
    }
  ],
  "flows": [
    {
      "id": "flow-001",
      "sourceRef": "start-001",
      "targetRef": "task-001"
    },
    {
      "id": "flow-002",
      "sourceRef": "task-001",
      "targetRef": "end-001"
    }
  ],
  "lanes": [
    {
      "id": "lane-001",
      "name": "User Lane",
      "role_id": "role-user",
      "flowNodeRefs": ["task-001"]
    }
  ]
}
```

**Step 2:** Generate BPMN

```bash
python generate_bpmn.py my_process.json my_process.bpmn
```

**Done!** You now have a valid BPMN XML file.

---

## Config File Structure

### Root Structure

```json
{
  "process": { ... },      // Required: Process metadata
  "metadata": { ... },     // Optional: Additional info
  "roles": [ ... ],        // Required: Actor roles
  "milestones": [ ... ],   // Optional: Process phases
  "elements": [ ... ],     // Required: BPMN elements
  "flows": [ ... ],        // Required: Connections
  "lanes": [ ... ]         // Optional: Swimlanes
}
```

### Process Section

```json
{
  "process": {
    "id": "proc-001",                    // Required: Unique process ID
    "name": "My Process",                // Required: Process name
    "description": "Process description", // Optional
    "version": "1.0"                     // Optional: Version number
  }
}
```

### Metadata Section (Optional)

```json
{
  "metadata": {
    "created_by": "System Name",
    "created_date": "2026-05-15T08:00:00Z",
    "source_document": "requirements.pdf",
    "business_context": "Insurance Claims"
  }
}
```

### Roles Section

```json
{
  "roles": [
    {
      "id": "role-analyst",              // Required: Unique role ID
      "name": "Claims Analyst",          // Required: Role name
      "description": "Reviews claims"    // Optional
    }
  ]
}
```

### Milestones Section (Optional)

```json
{
  "milestones": [
    {
      "id": "ms-review",                 // Required: Unique milestone ID
      "name": "Review Phase",            // Required: Milestone name
      "description": "Analysis phase"    // Optional
    }
  ]
}
```

### Elements Section

```json
{
  "elements": [
    {
      "id": "elem-001",                  // Required: Unique element ID
      "type": "userTask",                // Required: Element type
      "name": "Review Application",      // Required: Element name
      "assignee": "role-analyst",        // Optional: Role reference
      "milestone_id": "ms-review",       // Optional: Milestone reference
      "properties": {                    // Optional: Additional properties
        "description": "Review details",
        "form": "ReviewForm"
      }
    }
  ]
}
```

**Supported Element Types:**
- `startEvent` - Process start
- `endEvent` - Process end
- `userTask` - Manual task
- `serviceTask` - Automated task
- `scriptTask` - Script execution (treated as serviceTask)
- `manualTask` - Manual activity (treated as userTask)
- `exclusiveGateway` - XOR decision (one path)
- `parallelGateway` - AND split/join (all paths)
- `inclusiveGateway` - OR gateway (treated as exclusive)

### Flows Section

```json
{
  "flows": [
    {
      "id": "flow-001",                  // Required: Unique flow ID
      "sourceRef": "elem-001",           // Required: Source element ID
      "targetRef": "elem-002",           // Required: Target element ID
      "name": "Approved",                // Optional: Flow label
      "conditionExpression": "approved == true"  // Optional: Condition
    }
  ]
}
```

### Lanes Section (Optional)

```json
{
  "lanes": [
    {
      "id": "lane-001",                  // Required: Unique lane ID
      "name": "Analyst Lane",            // Required: Lane name
      "role_id": "role-analyst",         // Required: Role reference
      "flowNodeRefs": ["elem-001", "elem-002"]  // Required: Element IDs
    }
  ]
}
```

---

## Creating Config Files

### Pattern 1: Simple Linear Flow

**Use Case:** Sequential steps without branching

```json
{
  "process": {
    "id": "proc-linear-001",
    "name": "Simple Claims Process",
    "version": "1.0"
  },
  "roles": [
    {
      "id": "role-analyst",
      "name": "Claims Analyst"
    }
  ],
  "elements": [
    {
      "id": "start-001",
      "type": "startEvent",
      "name": "Start"
    },
    {
      "id": "task-001",
      "type": "serviceTask",
      "name": "Retrieve Documentation"
    },
    {
      "id": "task-002",
      "type": "userTask",
      "name": "Review Claim",
      "assignee": "role-analyst"
    },
    {
      "id": "end-001",
      "type": "endEvent",
      "name": "End"
    }
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-001"},
    {"id": "flow-002", "sourceRef": "task-001", "targetRef": "task-002"},
    {"id": "flow-003", "sourceRef": "task-002", "targetRef": "end-001"}
  ],
  "lanes": [
    {
      "id": "lane-001",
      "name": "Claims Analyst",
      "role_id": "role-analyst",
      "flowNodeRefs": ["task-002"]
    }
  ]
}
```

### Pattern 2: Approval Flow with Decision

**Use Case:** Approve/reject branching logic

```json
{
  "process": {
    "id": "proc-approval-001",
    "name": "Loan Approval Process",
    "version": "1.0"
  },
  "roles": [
    {
      "id": "role-officer",
      "name": "Loan Officer"
    }
  ],
  "elements": [
    {
      "id": "start-001",
      "type": "startEvent",
      "name": "Start"
    },
    {
      "id": "task-001",
      "type": "userTask",
      "name": "Review Application",
      "assignee": "role-officer"
    },
    {
      "id": "gateway-001",
      "type": "exclusiveGateway",
      "name": "Decision"
    },
    {
      "id": "task-002",
      "type": "serviceTask",
      "name": "Process Loan"
    },
    {
      "id": "task-003",
      "type": "serviceTask",
      "name": "Notify Rejection"
    },
    {
      "id": "end-001",
      "type": "endEvent",
      "name": "Approved"
    },
    {
      "id": "end-002",
      "type": "endEvent",
      "name": "Rejected"
    }
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-001"},
    {"id": "flow-002", "sourceRef": "task-001", "targetRef": "gateway-001"},
    {
      "id": "flow-003",
      "sourceRef": "gateway-001",
      "targetRef": "task-002",
      "name": "Approved",
      "conditionExpression": "approved == true"
    },
    {
      "id": "flow-004",
      "sourceRef": "gateway-001",
      "targetRef": "task-003",
      "name": "Rejected",
      "conditionExpression": "approved == false"
    },
    {"id": "flow-005", "sourceRef": "task-002", "targetRef": "end-001"},
    {"id": "flow-006", "sourceRef": "task-003", "targetRef": "end-002"}
  ],
  "lanes": [
    {
      "id": "lane-001",
      "name": "Loan Officer",
      "role_id": "role-officer",
      "flowNodeRefs": ["task-001"]
    }
  ]
}
```

### Pattern 3: Parallel Execution

**Use Case:** Concurrent tasks that run simultaneously

```json
{
  "process": {
    "id": "proc-parallel-001",
    "name": "Order Processing",
    "version": "1.0"
  },
  "roles": [
    {
      "id": "role-warehouse",
      "name": "Warehouse Staff"
    },
    {
      "id": "role-finance",
      "name": "Finance Team"
    }
  ],
  "elements": [
    {
      "id": "start-001",
      "type": "startEvent",
      "name": "Start"
    },
    {
      "id": "gateway-fork",
      "type": "parallelGateway",
      "name": "Fork"
    },
    {
      "id": "task-001",
      "type": "userTask",
      "name": "Check Inventory",
      "assignee": "role-warehouse"
    },
    {
      "id": "task-002",
      "type": "userTask",
      "name": "Process Payment",
      "assignee": "role-finance"
    },
    {
      "id": "gateway-join",
      "type": "parallelGateway",
      "name": "Join"
    },
    {
      "id": "task-003",
      "type": "serviceTask",
      "name": "Generate Invoice"
    },
    {
      "id": "end-001",
      "type": "endEvent",
      "name": "End"
    }
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "gateway-fork"},
    {"id": "flow-002", "sourceRef": "gateway-fork", "targetRef": "task-001"},
    {"id": "flow-003", "sourceRef": "gateway-fork", "targetRef": "task-002"},
    {"id": "flow-004", "sourceRef": "task-001", "targetRef": "gateway-join"},
    {"id": "flow-005", "sourceRef": "task-002", "targetRef": "gateway-join"},
    {"id": "flow-006", "sourceRef": "gateway-join", "targetRef": "task-003"},
    {"id": "flow-007", "sourceRef": "task-003", "targetRef": "end-001"}
  ],
  "lanes": [
    {
      "id": "lane-001",
      "name": "Warehouse",
      "role_id": "role-warehouse",
      "flowNodeRefs": ["task-001"]
    },
    {
      "id": "lane-002",
      "name": "Finance",
      "role_id": "role-finance",
      "flowNodeRefs": ["task-002"]
    }
  ]
}
```

### Pattern 4: Multi-Department Swimlanes

**Use Case:** Process spanning multiple departments

```json
{
  "process": {
    "id": "proc-onboarding-001",
    "name": "Employee Onboarding",
    "version": "1.0"
  },
  "roles": [
    {
      "id": "role-hr",
      "name": "HR Specialist"
    },
    {
      "id": "role-it",
      "name": "IT Administrator"
    },
    {
      "id": "role-facilities",
      "name": "Facilities Manager"
    }
  ],
  "elements": [
    {
      "id": "start-001",
      "type": "startEvent",
      "name": "Start"
    },
    {
      "id": "task-001",
      "type": "userTask",
      "name": "Create Employee Record",
      "assignee": "role-hr"
    },
    {
      "id": "task-002",
      "type": "userTask",
      "name": "Setup IT Accounts",
      "assignee": "role-it"
    },
    {
      "id": "task-003",
      "type": "userTask",
      "name": "Prepare Workspace",
      "assignee": "role-facilities"
    },
    {
      "id": "end-001",
      "type": "endEvent",
      "name": "End"
    }
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-001"},
    {"id": "flow-002", "sourceRef": "task-001", "targetRef": "task-002"},
    {"id": "flow-003", "sourceRef": "task-002", "targetRef": "task-003"},
    {"id": "flow-004", "sourceRef": "task-003", "targetRef": "end-001"}
  ],
  "lanes": [
    {
      "id": "lane-hr",
      "name": "HR Department",
      "role_id": "role-hr",
      "flowNodeRefs": ["task-001"]
    },
    {
      "id": "lane-it",
      "name": "IT Department",
      "role_id": "role-it",
      "flowNodeRefs": ["task-002"]
    },
    {
      "id": "lane-facilities",
      "name": "Facilities",
      "role_id": "role-facilities",
      "flowNodeRefs": ["task-003"]
    }
  ]
}
```

---

## Generating BPMN

### Method 1: Command Line (Recommended)

```bash
python generate_bpmn.py <config_file.json> <output_file.bpmn>
```

**Example:**
```bash
python generate_bpmn.py my_process.json my_process.bpmn
```

**Output:**
```
BPMN XML saved to: my_process.bpmn
✅ Successfully generated BPMN XML from my_process.json
```

### Method 2: Python Script

```python
from generate_bpmn import generate_bpmn_from_config

# Generate BPMN from config
generate_bpmn_from_config(
    config_path="my_process.json",
    output_path="my_process.bpmn"
)
```

### Method 3: Python API (Advanced)

```python
from generate_bpmn import ConfigLoader

# Create loader
loader = ConfigLoader()

# Load config
loader.load_config("my_process.json")

# Validate (optional but recommended)
errors = loader.validate_config()
if errors:
    print("Validation errors:", errors)
    exit(1)

# Generate and save
loader.save_bpmn("my_process.bpmn")
print("✅ BPMN generated successfully!")
```

---

## Complete Examples

### Example 1: Insurance Claims Process

See: [`business-processes/configs/Insurance/SimpleClaimSubmission.bpmn-config.json`](../business-processes/configs/Insurance/SimpleClaimSubmission.bpmn-config.json:1)

**Generate:**
```bash
python generate_bpmn.py \
  business-processes/configs/Insurance/SimpleClaimSubmission.bpmn-config.json \
  output/claims_process.bpmn
```

### Example 2: Creating Your Own Config

**Step 1:** Create `my_approval.json`

```json
{
  "process": {
    "id": "proc-approval-001",
    "name": "Document Approval",
    "version": "1.0"
  },
  "roles": [
    {
      "id": "role-submitter",
      "name": "Document Submitter"
    },
    {
      "id": "role-reviewer",
      "name": "Document Reviewer"
    }
  ],
  "elements": [
    {
      "id": "start-001",
      "type": "startEvent",
      "name": "Start"
    },
    {
      "id": "task-submit",
      "type": "userTask",
      "name": "Submit Document",
      "assignee": "role-submitter"
    },
    {
      "id": "task-review",
      "type": "userTask",
      "name": "Review Document",
      "assignee": "role-reviewer"
    },
    {
      "id": "gateway-decision",
      "type": "exclusiveGateway",
      "name": "Approved?"
    },
    {
      "id": "task-publish",
      "type": "serviceTask",
      "name": "Publish Document"
    },
    {
      "id": "task-notify-reject",
      "type": "serviceTask",
      "name": "Notify Rejection"
    },
    {
      "id": "end-approved",
      "type": "endEvent",
      "name": "Approved"
    },
    {
      "id": "end-rejected",
      "type": "endEvent",
      "name": "Rejected"
    }
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-submit"},
    {"id": "flow-002", "sourceRef": "task-submit", "targetRef": "task-review"},
    {"id": "flow-003", "sourceRef": "task-review", "targetRef": "gateway-decision"},
    {
      "id": "flow-004",
      "sourceRef": "gateway-decision",
      "targetRef": "task-publish",
      "name": "Yes",
      "conditionExpression": "approved == true"
    },
    {
      "id": "flow-005",
      "sourceRef": "gateway-decision",
      "targetRef": "task-notify-reject",
      "name": "No",
      "conditionExpression": "approved == false"
    },
    {"id": "flow-006", "sourceRef": "task-publish", "targetRef": "end-approved"},
    {"id": "flow-007", "sourceRef": "task-notify-reject", "targetRef": "end-rejected"}
  ],
  "lanes": [
    {
      "id": "lane-submitter",
      "name": "Submitter",
      "role_id": "role-submitter",
      "flowNodeRefs": ["task-submit"]
    },
    {
      "id": "lane-reviewer",
      "name": "Reviewer",
      "role_id": "role-reviewer",
      "flowNodeRefs": ["task-review"]
    }
  ]
}
```

**Step 2:** Generate BPMN

```bash
python generate_bpmn.py my_approval.json my_approval.bpmn
```

**Step 3:** Import into BAW

The generated `my_approval.bpmn` file can now be imported into IBM Business Automation Workflow.

---

## Validation

### Automatic Validation

The config loader automatically validates your configuration before generating BPMN.

**Validation Checks:**
- ✅ Required sections present (process, roles, elements, flows)
- ✅ All flow references point to existing elements
- ✅ All lane references point to existing elements
- ✅ All role assignments reference existing roles
- ✅ Unique IDs within each section
- ✅ At least one start and end event

### Manual Validation

```python
from generate_bpmn import ConfigLoader

loader = ConfigLoader()
loader.load_config("my_process.json")

# Validate
errors = loader.validate_config()

if errors:
    print("❌ Validation failed:")
    for error in errors:
        print(f"  - {error}")
else:
    print("✅ Configuration is valid!")
```

### Common Validation Errors

**Error:** "Missing required section: elements"
```json
// ❌ Missing elements section
{
  "process": {...},
  "roles": [...]
  // Missing "elements" and "flows"
}
```

**Error:** "Flow flow-001 references non-existent source: task-999"
```json
// ❌ Flow references non-existent element
{
  "flows": [
    {
      "id": "flow-001",
      "sourceRef": "task-999",  // This element doesn't exist
      "targetRef": "task-002"
    }
  ]
}
```

**Error:** "Task task-001 references non-existent role: role-999"
```json
// ❌ Task references non-existent role
{
  "elements": [
    {
      "id": "task-001",
      "type": "userTask",
      "name": "Task",
      "assignee": "role-999"  // This role doesn't exist
    }
  ]
}
```

---

## Troubleshooting

### Issue 1: Config File Not Found

**Error:** `FileNotFoundError: Config file not found: my_process.json`

**Solution:**
```bash
# Check file exists
ls -la my_process.json

# Use absolute path
python generate_bpmn.py /full/path/to/my_process.json output.bpmn
```

### Issue 2: Invalid JSON

**Error:** `json.JSONDecodeError: Expecting property name enclosed in double quotes`

**Solution:**
```json
// ❌ Invalid JSON (missing comma, trailing comma)
{
  "process": {
    "id": "proc-001"
    "name": "Process"
  },
}

// ✅ Valid JSON
{
  "process": {
    "id": "proc-001",
    "name": "Process"
  }
}
```

**Tip:** Use a JSON validator like [jsonlint.com](https://jsonlint.com)

### Issue 3: Missing Required Fields

**Error:** `KeyError: 'name'`

**Solution:**
```json
// ❌ Missing required 'name' field
{
  "elements": [
    {
      "id": "task-001",
      "type": "userTask"
      // Missing "name"
    }
  ]
}

// ✅ All required fields present
{
  "elements": [
    {
      "id": "task-001",
      "type": "userTask",
      "name": "My Task"
    }
  ]
}
```

### Issue 4: Disconnected Process

**Warning:** Process may have disconnected elements

**Solution:** Ensure all elements are connected via flows:
```json
{
  "elements": [
    {"id": "start-001", "type": "startEvent", "name": "Start"},
    {"id": "task-001", "type": "userTask", "name": "Task"},
    {"id": "end-001", "type": "endEvent", "name": "End"}
  ],
  "flows": [
    // ✅ Connect all elements
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-001"},
    {"id": "flow-002", "sourceRef": "task-001", "targetRef": "end-001"}
  ]
}
```

---

## Best Practices

### 1. Use Descriptive IDs

```json
// ✅ Good - Clear and descriptive
{
  "id": "task-review-application",
  "name": "Review Loan Application"
}

// ❌ Avoid - Generic and unclear
{
  "id": "task-001",
  "name": "Task 1"
}
```

### 2. Include Metadata

```json
{
  "metadata": {
    "created_by": "BAW Blueprint Parser",
    "created_date": "2026-05-15T08:00:00Z",
    "source_document": "requirements_v2.pdf",
    "business_context": "Insurance Claims Processing"
  }
}
```

### 3. Organize with Lanes

```json
// ✅ Group tasks by role/department
{
  "lanes": [
    {
      "id": "lane-sales",
      "name": "Sales Department",
      "role_id": "role-sales",
      "flowNodeRefs": ["task-001", "task-002"]
    },
    {
      "id": "lane-finance",
      "name": "Finance Department",
      "role_id": "role-finance",
      "flowNodeRefs": ["task-003", "task-004"]
    }
  ]
}
```

### 4. Use Milestones for Phases

```json
{
  "milestones": [
    {
      "id": "ms-initiation",
      "name": "Initiation Phase",
      "description": "Initial setup and data collection"
    },
    {
      "id": "ms-execution",
      "name": "Execution Phase",
      "description": "Main processing activities"
    },
    {
      "id": "ms-completion",
      "name": "Completion Phase",
      "description": "Finalization and closure"
    }
  ]
}
```

### 5. Add Descriptions

```json
{
  "elements": [
    {
      "id": "task-001",
      "type": "userTask",
      "name": "Review Application",
      "assignee": "role-analyst",
      "properties": {
        "description": "Analyst reviews loan application for completeness and accuracy",
        "form": "LoanReviewForm"
      }
    }
  ]
}
```

### 6. Version Your Configs

```json
{
  "process": {
    "id": "proc-claims-001",
    "name": "Claims Processing",
    "version": "2.1"  // Track versions
  }
}
```

### 7. Validate Before Generating

```bash
# Always validate first
python -c "
from generate_bpmn import ConfigLoader
loader = ConfigLoader()
loader.load_config('my_process.json')
errors = loader.validate_config()
if errors:
    print('Errors:', errors)
else:
    print('Valid!')
"

# Then generate
python generate_bpmn.py my_process.json output.bpmn
```

### 8. Use Consistent Naming Conventions

```json
// ✅ Consistent naming pattern
{
  "elements": [
    {"id": "start-001", "type": "startEvent", "name": "Start"},
    {"id": "task-001", "type": "userTask", "name": "Task 1"},
    {"id": "task-002", "type": "userTask", "name": "Task 2"},
    {"id": "gateway-001", "type": "exclusiveGateway", "name": "Decision"},
    {"id": "end-001", "type": "endEvent", "name": "End"}
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-001"},
    {"id": "flow-002", "sourceRef": "task-001", "targetRef": "task-002"}
  ]
}
```

---

## Additional Resources

### Documentation

- [`README.md`](README.md) - Quick reference overview
- [`CONFIG_SCHEMA_DESIGN.md`](CONFIG_SCHEMA_DESIGN.md) - Complete schema specification with examples
- [`LLM_USAGE_GUIDE.md`](LLM_USAGE_GUIDE.md) - Guide for AI/LLM systems

### Example Configs

- [`business-processes/configs/Insurance/`](../business-processes/configs/Insurance/) - Insurance process examples

### Tools

- **generate_bpmn.py** - Main generation tool
- **test_generate_bpmn.py** - Test suite for validation

### Integration

Generated BPMN files can be:
1. Imported into IBM Business Automation Workflow (BAW)
2. Opened in BPMN modeling tools (Camunda Modeler, etc.)
3. Used with other BPM systems supporting BPMN 2.0

---

## Quick Reference

### Command Line Usage

```bash
# Generate BPMN from config
python generate_bpmn.py <config.json> <output.bpmn>

# Example
python generate_bpmn.py my_process.json my_process.bpmn
```

### Python API Usage

```python
from generate_bpmn import ConfigLoader

# Load and generate
loader = ConfigLoader()
loader.load_config("config.json")
loader.save_bpmn("output.bpmn")
```

### Minimal Config Template

```json
{
  "process": {
    "id": "proc-001",
    "name": "Process Name",
    "version": "1.0"
  },
  "roles": [
    {"id": "role-001", "name": "Role Name"}
  ],
  "elements": [
    {"id": "start-001", "type": "startEvent", "name": "Start"},
    {"id": "task-001", "type": "userTask", "name": "Task", "assignee": "role-001"},
    {"id": "end-001", "type": "endEvent", "name": "End"}
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-001"},
    {"id": "flow-002", "sourceRef": "task-001", "targetRef": "end-001"}
  ],
  "lanes": [
    {
      "id": "lane-001",
      "name": "Lane Name",
      "role_id": "role-001",
      "flowNodeRefs": ["task-001"]
    }
  ]
}
```

---

**Happy BPMN Generation! 🎉**

*Config-Driven Approach - Simple, Maintainable, AI-Friendly*

*Last Updated: 2026-05-15*