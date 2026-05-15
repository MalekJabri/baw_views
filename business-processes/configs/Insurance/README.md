# Insurance BPMN Configuration Examples

This directory contains BPMN configuration files for insurance-related business processes. These JSON configs follow the schema defined in `BPMN_tools/CONFIG_SCHEMA_DESIGN.md` and are consumed by Python generators to produce valid BPMN XML.

## Config-Driven Architecture

```
Blueprint Document → GenAI Analysis → JSON Config → Python Generator → BPMN XML
                     (Blueprint Parser)              (BPMN_tools)
```

## Example: SimpleClaimSubmission.bpmn-config.json

This is a test sample demonstrating the complete config structure for a basic insurance claim submission and approval workflow.

### Process Overview

**Process ID:** `proc-insurance-001`  
**Name:** Simple Claim Submission Process  
**Complexity:** Simple  
**Estimated Duration:** 3-5 days

### Roles (3)

1. **Policyholder** (`role-policyholder`) - Customer submitting the claim
2. **Claims System** (`role-system`) - Automated processing system
3. **Claims Adjuster** (`role-adjuster`) - Reviews and decides on claims

### Process Flow

1. **Start** → Claim Initiated
2. **User Task** → Policyholder submits claim (`elem-task-1`)
3. **Service Task** → System validates claim data (`elem-task-2`)
4. **Gateway** → Is claim valid? (`elem-gateway-1`)
   - **If Invalid/Incomplete** → Policyholder provides additional info (`elem-task-3`) → Back to review
   - **If Valid** → Continue to review
5. **User Task** → Claims adjuster reviews claim (`elem-task-4`)
6. **Gateway** → Claim decision (`elem-gateway-2`)
   - **If Approved** → System processes payment (`elem-task-5`) → End (Approved)
   - **If Denied** → System sends denial notice (`elem-task-6`) → End (Denied)

### Key Features Demonstrated

✅ **Complete Config Structure**
- Process metadata with ID, name, description, version
- Metadata section with context, complexity, duration
- Source document traceability

✅ **ID Naming Conventions**
- Process: `proc-insurance-001`
- Roles: `role-policyholder`, `role-system`, `role-adjuster`
- Milestones: `ms-claim-submitted`, `ms-review-complete`
- Elements: `elem-start-1`, `elem-task-1`, `elem-gateway-1`, `elem-end-1`
- Flows: `flow-1`, `flow-2`, etc.
- Lanes: `lane-role-policyholder`, `lane-role-system`, `lane-role-adjuster`

✅ **BPMN Elements**
- Start event (1)
- User tasks (3) - Human activities
- Service tasks (3) - Automated activities
- Exclusive gateways (2) - Decision points with conditions
- End events (2) - Multiple outcomes (approved/denied)

✅ **Sequence Flows**
- 11 flows connecting all elements
- Conditional flows with expressions for gateways
- Named flows for clarity (e.g., "Valid", "Approved", "Denied")

✅ **Swimlanes**
- 3 lanes organizing tasks by role
- Proper assignment of elements to lanes

✅ **Business Integration**
- Links to business objects (Claim, Policy, Document)
- Business rules documentation
- Task documentation with descriptions

### Validation Checklist

This config passes all validation requirements:

- ✅ All required sections present (process, roles, elements, flows)
- ✅ All IDs follow naming conventions
- ✅ No duplicate IDs
- ✅ All flow references point to existing elements
- ✅ Start event has only outgoing flows
- ✅ End events have only incoming flows
- ✅ All tasks have incoming and outgoing flows
- ✅ Gateway outgoing flows have conditions
- ✅ No orphaned elements
- ✅ All paths lead to end events
- ✅ Lane assignments are correct

### Usage with Python Generator

This config can be consumed by the Python BPMN generator:

```python
from BPMN_tools.bpmn_generator import BPMNGenerator

# Load config
with open('business-processes/configs/Insurance/SimpleClaimSubmission.bpmn-config.json') as f:
    config = json.load(f)

# Generate BPMN XML
generator = BPMNGenerator()
bpmn_xml = generator.generate_from_config(config)

# Save BPMN file
with open('SimpleClaimSubmission.bpmn', 'w') as f:
    f.write(bpmn_xml)
```

### Visual Representation

The process can be visualized as:

```
[Policyholder Lane]
  Submit Claim → Provide Additional Info (if needed)

[System Lane]
  Start → Validate → Decision Gateway → Process Payment / Send Denial → End

[Adjuster Lane]
  Review Claim → Decision Gateway
```

## Creating New Configs

When creating new BPMN configs, follow these guidelines:

1. **Start with process metadata** - Define ID, name, description
2. **Identify all roles** - List all actors (human, system, external)
3. **Extract milestones** - Key process phases
4. **Map elements** - Start events, tasks, gateways, end events
5. **Define flows** - Connect elements with proper conditions
6. **Create lanes** - Organize by role (optional but recommended)
7. **Link business objects** - Reference data used in process
8. **Validate** - Check all references and flow logic

## Reference

- **Schema Definition:** `BPMN_tools/CONFIG_SCHEMA_DESIGN.md`
- **Generation Instructions:** `.bob/rules-baw-blueprint-parser/7_bpmn_config_generation.xml`
- **Mode Documentation:** `docs/BAW_BLUEPRINT_PARSER_MODE.md`