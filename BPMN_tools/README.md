# BPMN Tools - Config-Driven BPMN Generation

A Python toolkit for generating BPMN 2.0 workflows from JSON configuration files. Designed for AI systems, developers, and business analysts to easily create, configure, and validate business process models.

## 📋 Overview

BPMN_tools provides a **config-driven approach** to creating BPMN 2.0 compliant XML files. Perfect for:
- **AI/LLM-driven workflow generation** - Generate JSON configs from natural language
- **Automated process modeling** - Convert business requirements to BPMN
- **Version control** - Track process changes in readable JSON format
- **Integration with BAW/BPM systems** - Export to IBM Business Automation Workflow
- **Dual generation** - Creates both IBM BAW and standard BPMN 2.0 versions automatically

## ✨ New: Dual BPMN Generation

**By default, the tool now generates TWO versions of each BPMN file:**

1. **IBM BAW Version** (`process.bpmn`) - Full-featured with IBM extensions
   - Includes milestones (IBM BPM extension)
   - IBM-specific namespaces
   - Ready for direct import into IBM BAW

2. **Standard BPMN 2.0 Preview** (`process-preview.bpmn`) - Generic viewer compatible
   - Pure BPMN 2.0 standard
   - Works with bpmn.io, Red Hat BPMN viewer, and other generic tools
   - Perfect for documentation and sharing

Both versions are generated from the same config file, ensuring consistency!

## 🚀 Quick Start

### Step 1: Create Config File

Create `my_process.json`:

```json
{
  "process": {
    "id": "proc-001",
    "name": "My Process",
    "version": "1.0"
  },
  "roles": [
    {"id": "role-analyst", "name": "Analyst"}
  ],
  "elements": [
    {"id": "start-001", "type": "startEvent", "name": "Start"},
    {"id": "task-001", "type": "userTask", "name": "Task 1", "assignee": "role-analyst"},
    {"id": "end-001", "type": "endEvent", "name": "End"}
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-001"},
    {"id": "flow-002", "sourceRef": "task-001", "targetRef": "end-001"}
  ],
  "lanes": [
    {
      "id": "lane-001",
      "name": "Analyst",
      "role_id": "role-analyst",
      "flowNodeRefs": ["task-001"]
    }
  ]
}
```

### Step 2: Generate BPMN

```bash
python3 generate_bpmn.py my_process.json my_process.bpmn
```

**Done!** You now have TWO valid BPMN XML files:
- `my_process.bpmn` - IBM BAW version (ready for import)
- `my_process-preview.bpmn` - Standard BPMN 2.0 (for generic viewers)

## 📦 Components

### 1. **generate_bpmn.py** - Main BPMN Generator
Loads JSON configurations and generates BPMN XML. This is the primary tool you'll use.

**Command Line Usage:**
```bash
python generate_bpmn.py <config.json> <output.bpmn>
```

**Python API:**
```python
from generate_bpmn import ConfigLoader

loader = ConfigLoader()
loader.load_config("config.json")
loader.save_bpmn("output.bpmn")
```

### 2. **bpmn_xml_builder.py** - BPMN XML Builder
Internal module that creates BPMN 2.0 XML structure. Used by generate_bpmn.py to build valid XML.

### 3. **validator.py** - Config & BPMN Validation
Validates configuration structure and BPMN correctness.

**Features:**
- ✅ Config schema validation
- ✅ Reference integrity checks
- ✅ Flow connectivity validation
- ✅ Gateway validation
- ✅ Lane/Milestone validation

### 4. **flow_builder.py** - Helper Utilities
Internal utilities used by the config loader.

## 📚 Config Examples

### Example 1: Simple Linear Process
```json
{
  "process": {"id": "proc-001", "name": "Simple Process", "version": "1.0"},
  "roles": [{"id": "role-user", "name": "User"}],
  "elements": [
    {"id": "start-001", "type": "startEvent", "name": "Start"},
    {"id": "task-001", "type": "userTask", "name": "Task", "assignee": "role-user"},
    {"id": "end-001", "type": "endEvent", "name": "End"}
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-001"},
    {"id": "flow-002", "sourceRef": "task-001", "targetRef": "end-001"}
  ],
  "lanes": [
    {"id": "lane-001", "name": "User", "role_id": "role-user", "flowNodeRefs": ["task-001"]}
  ]
}
```

### Example 2: Approval with Decision Gateway
```json
{
  "process": {"id": "proc-002", "name": "Approval Process", "version": "1.0"},
  "roles": [{"id": "role-manager", "name": "Manager"}],
  "elements": [
    {"id": "start-001", "type": "startEvent", "name": "Start"},
    {"id": "task-001", "type": "userTask", "name": "Review", "assignee": "role-manager"},
    {"id": "gateway-001", "type": "exclusiveGateway", "name": "Decision"},
    {"id": "task-approve", "type": "serviceTask", "name": "Process Approval"},
    {"id": "task-reject", "type": "serviceTask", "name": "Send Rejection"},
    {"id": "end-001", "type": "endEvent", "name": "End"}
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-001"},
    {"id": "flow-002", "sourceRef": "task-001", "targetRef": "gateway-001"},
    {"id": "flow-003", "sourceRef": "gateway-001", "targetRef": "task-approve", "name": "Approved", "conditionExpression": "approved == true"},
    {"id": "flow-004", "sourceRef": "gateway-001", "targetRef": "task-reject", "name": "Rejected", "conditionExpression": "approved == false"},
    {"id": "flow-005", "sourceRef": "task-approve", "targetRef": "end-001"},
    {"id": "flow-006", "sourceRef": "task-reject", "targetRef": "end-001"}
  ],
  "lanes": [
    {"id": "lane-001", "name": "Manager", "role_id": "role-manager", "flowNodeRefs": ["task-001"]}
  ]
}
```

### Example 3: Real-World Process
See: [`business-processes/configs/Insurance/SimpleClaimSubmission.bpmn-config.json`](../business-processes/configs/Insurance/SimpleClaimSubmission.bpmn-config.json:1)

## 🎯 Use Cases for AI/LLMs

### 1. Generate Config from Natural Language
```
User: "Create a 3-step approval process"

AI generates JSON config:
{
  "process": {"id": "proc-approval", "name": "Approval Process", "version": "1.0"},
  "roles": [{"id": "role-manager", "name": "Manager"}],
  "elements": [...],
  "flows": [...]
}

Then run:
python config_loader.py approval.json approval.bpmn
```

### 2. Convert Business Requirements to Config
```
User provides: "Customer onboarding with Sales, Compliance, and IT steps"

AI analyzes and creates config with:
- 3 roles (Sales, Compliance, IT)
- 3 lanes (one per department)
- Sequential tasks across departments
- Proper flows connecting all elements

Generate BPMN:
python config_loader.py onboarding.json onboarding.bpmn
```

### 3. Validate and Fix Configs
```python
from generate_bpmn import ConfigLoader

loader = ConfigLoader()
loader.load_config("process.json")

errors = loader.validate_config()
if errors:
    print("Config errors:", errors)
    # AI can analyze and fix errors
```

## 🔧 Advanced Usage

### Custom Element IDs
```python
# Use custom IDs for integration
task_id = generator.add_user_task(
    name="Review",
    performer="Analyst",
    task_id="custom-task-001"
)
```

### Conditional Flows
```python
gateway = generator.add_exclusive_gateway("Check Amount")
generator.add_sequence_flow(gateway, high_value_task, "Amount > 10000", "amount > 10000")
generator.add_sequence_flow(gateway, low_value_task, "Amount <= 10000", "amount <= 10000")
```

### Process Summary
```python
summary = generator.get_summary()
print(summary)
# Output:
# {
#     'process_name': 'My Process',
#     'process_id': 'process-abc123',
#     'total_flow_nodes': 5,
#     'node_types': {'startEvent': 1, 'userTask': 2, 'endEvent': 1},
#     'sequence_flows': 4,
#     'lanes': 2,
#     'milestones': 0
# }
```

## 📝 BPMN Element Types

| Element Type | Method | Description |
|--------------|--------|-------------|
| **Start Event** | `add_start_event()` | Process initiation point |
| **End Event** | `add_end_event()` | Process completion point |
| **User Task** | `add_user_task()` | Manual task requiring human interaction |
| **Service Task** | `add_service_task()` | Automated task (system execution) |
| **Exclusive Gateway** | `add_exclusive_gateway()` | XOR decision point (one path chosen) |
| **Parallel Gateway** | `add_parallel_gateway()` | AND split/join (all paths executed) |
| **Sequence Flow** | `add_sequence_flow()` | Connection between elements |
| **Lane** | `add_lane()` | Swimlane for role/department organization |
| **Milestone** | `add_milestone()` | Phase grouping (IBM BPM extension) |

## 🎨 Best Practices

### 1. Always Validate
```python
is_valid, report = validate_bpmn(generator)
if not is_valid:
    print(report)
```

### 2. Use Meaningful Names
```python
# Good
task = generator.add_user_task("Review Customer Application", "Loan Officer")

# Avoid
task = generator.add_user_task("Task1", "User")
```

### 3. Organize with Lanes
```python
# Group related tasks by role
generator.add_lane("Customer Service", [task1, task2])
generator.add_lane("Management", [task3, task4])
```

### 4. Use FlowBuilder for Common Patterns
```python
# Instead of manually creating elements
builder = FlowBuilder(generator)
builder.create_linear_flow(tasks)  # Much simpler!
```

## 🔍 Validation Rules

The validator checks for:
- ✅ At least one start event
- ✅ At least one end event
- ✅ All sequence flows reference valid elements
- ✅ Gateways have appropriate number of paths
- ✅ Lane references point to existing nodes
- ✅ All nodes are connected to the main flow
- ✅ No duplicate names (warning)
- ✅ All elements have names (warning)

## 📤 Output Format

Generated BPMN files are:
- **BPMN 2.0 compliant** - Standard OMG specification
- **IBM BPM compatible** - Includes IBM extensions (milestones)
- **Well-formatted XML** - Pretty-printed for readability
- **UTF-8 encoded** - Universal character support

## 🤖 LLM Integration Tips

### Prompt Engineering
```
Generate a BPMN workflow for [process description]:
1. Use BPMNGenerator to create the process
2. Use FlowBuilder for common patterns
3. Validate with BPMNValidator
4. Save to file
5. Return summary and validation report
```

### Error Handling
```python
from generate_bpmn import ConfigLoader

try:
    loader = ConfigLoader()
    loader.load_config("process.json")
    
    # Validate
    errors = loader.validate_config()
    if errors:
        return f"Config errors: {errors}"
    
    # Generate
    loader.save_bpmn("output.bpmn")
    return "✅ Success: BPMN generated"
    
except Exception as e:
    return f"❌ Error: {str(e)}"
```

## 🔗 Integration with BAW

Generated BPMN files can be:
1. Imported into IBM Business Automation Workflow
2. Opened in Process Designer
3. Enhanced with additional BAW features
4. Deployed to BAW servers

## 📚 Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user guide with examples
- **[CONFIG_SCHEMA_DESIGN.md](CONFIG_SCHEMA_DESIGN.md)** - Full JSON schema specification
- **[LLM_USAGE_GUIDE.md](LLM_USAGE_GUIDE.md)** - Guide for AI/LLM systems

## � License

This toolkit is part of the BAW Coach Mode project.

## 📞 Support

For issues or questions:
- Review the config examples in `business-processes/configs/`
- Check validation error messages
- Consult the [USER_GUIDE.md](USER_GUIDE.md) for detailed documentation
- Verify JSON syntax with a validator

---

**Happy Config-Driven BPMN Generation! 🎉**

*Simple • Maintainable • AI-Friendly*