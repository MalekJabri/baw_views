# LLM Usage Guide for BPMN Tools

This guide is specifically designed for Large Language Models (LLMs) to understand how to use the BPMN Tools library to generate workflows from natural language descriptions.

## 🎯 Core Concept

When a user asks you to create a BPMN workflow, follow this pattern:

1. **Parse** the user's requirements
2. **Choose** the appropriate pattern (linear, approval, parallel, swimlane)
3. **Generate** the BPMN using the tools
4. **Validate** the result
5. **Save** and report back

## 📋 Decision Tree for Pattern Selection

```
User Request Analysis:
├─ Simple sequential steps? → Use create_linear_flow()
├─ Approval/rejection needed? → Use create_approval_flow()
├─ Multiple roles/departments? → Use create_swimlane_flow()
├─ Concurrent tasks? → Use create_parallel_flow()
└─ Phases/milestones? → Use create_milestone_flow()
```

## 🔧 Common Scenarios

### Scenario 1: "Create a simple 3-step process"

```python
from bpmn_generator import BPMNGenerator
from flow_builder import FlowBuilder
from validator import validate_bpmn

# Initialize
generator = BPMNGenerator("Simple Process")
builder = FlowBuilder(generator)

# Define tasks
tasks = [
    {'name': 'Step 1', 'type': 'userTask', 'performer': 'User'},
    {'name': 'Step 2', 'type': 'serviceTask'},
    {'name': 'Step 3', 'type': 'userTask', 'performer': 'Manager'}
]

# Create flow
builder.create_linear_flow(tasks)

# Validate and save
is_valid, report = validate_bpmn(generator)
if is_valid:
    generator.save_to_file("simple_process.bpmn")
    print("✓ Process created successfully")
else:
    print("✗ Validation failed:", report)
```

### Scenario 2: "Create an approval workflow"

```python
generator = BPMNGenerator("Approval Process")
builder = FlowBuilder(generator)

# Create approval flow
builder.create_approval_flow(
    task_name="Review Request",
    approver="Manager",
    on_approve_tasks=[
        {'name': 'Process Request', 'type': 'serviceTask'},
        {'name': 'Notify Approval', 'type': 'serviceTask'}
    ],
    on_reject_tasks=[
        {'name': 'Notify Rejection', 'type': 'serviceTask'}
    ]
)

is_valid, report = validate_bpmn(generator)
generator.save_to_file("approval_process.bpmn")
```

### Scenario 3: "Create a workflow with multiple departments"

```python
generator = BPMNGenerator("Multi-Department Process")
builder = FlowBuilder(generator)

lanes_config = [
    {
        'name': 'Department A',
        'tasks': [
            {'name': 'Task A1', 'type': 'userTask'},
            {'name': 'Task A2', 'type': 'userTask'}
        ]
    },
    {
        'name': 'Department B',
        'tasks': [
            {'name': 'Task B1', 'type': 'userTask'},
            {'name': 'Task B2', 'type': 'serviceTask'}
        ]
    }
]

builder.create_swimlane_flow(lanes_config)
is_valid, report = validate_bpmn(generator)
generator.save_to_file("multi_dept_process.bpmn")
```

### Scenario 4: "Create parallel tasks that run simultaneously"

```python
generator = BPMNGenerator("Parallel Process")
builder = FlowBuilder(generator)

parallel_tasks = [
    [{'name': 'Path A Task', 'type': 'userTask', 'performer': 'Team A'}],
    [{'name': 'Path B Task', 'type': 'userTask', 'performer': 'Team B'}],
    [{'name': 'Path C Task', 'type': 'userTask', 'performer': 'Team C'}]
]

builder.create_parallel_flow(
    parallel_tasks=parallel_tasks,
    join_task={'name': 'Merge Results', 'type': 'userTask', 'performer': 'Manager'}
)

is_valid, report = validate_bpmn(generator)
generator.save_to_file("parallel_process.bpmn")
```

## 🧠 Natural Language Processing Tips

### Extract Key Information

When parsing user requests, identify:

1. **Process Name**: Extract from context or use a descriptive name
2. **Task Names**: Look for action verbs (review, approve, process, etc.)
3. **Roles/Performers**: Identify who performs each task
4. **Task Types**: 
   - Manual tasks → `userTask`
   - Automated tasks → `serviceTask`
5. **Flow Type**: Sequential, approval, parallel, or swimlane

### Example Parsing

**User Input**: "Create a loan approval process where a loan officer reviews the application, then a manager approves or rejects it. If approved, process the loan and notify the customer. If rejected, just notify the customer."

**Parsed Structure**:
```python
{
    'process_name': 'Loan Approval Process',
    'pattern': 'approval',
    'approval_task': 'Review Application',
    'approver': 'Loan Officer',
    'decision_maker': 'Manager',
    'on_approve': [
        {'name': 'Process Loan', 'type': 'serviceTask'},
        {'name': 'Notify Customer - Approved', 'type': 'serviceTask'}
    ],
    'on_reject': [
        {'name': 'Notify Customer - Rejected', 'type': 'serviceTask'}
    ]
}
```

**Generated Code**:
```python
generator = BPMNGenerator("Loan Approval Process")
builder = FlowBuilder(generator)

builder.create_approval_flow(
    task_name="Review Application",
    approver="Loan Officer",
    on_approve_tasks=[
        {'name': 'Process Loan', 'type': 'serviceTask'},
        {'name': 'Notify Customer - Approved', 'type': 'serviceTask'}
    ],
    on_reject_tasks=[
        {'name': 'Notify Customer - Rejected', 'type': 'serviceTask'}
    ]
)

is_valid, report = validate_bpmn(generator)
generator.save_to_file("loan_approval.bpmn")
print(report)
```

## 🎨 Task Type Selection Rules

Use these rules to determine task types:

| Keywords | Task Type | Example |
|----------|-----------|---------|
| review, check, verify, approve, decide | `userTask` | "Review application" |
| send, notify, calculate, generate, process | `serviceTask` | "Send notification" |
| system, automatic, auto | `serviceTask` | "System validates" |
| manual, human, person | `userTask` | "Manual review" |

## ✅ Validation Checklist

Always validate before saving:

```python
is_valid, report = validate_bpmn(generator)

if is_valid:
    generator.save_to_file(filename)
    summary = generator.get_summary()
    return f"✓ Success! Created {summary['total_flow_nodes']} elements"
else:
    return f"✗ Validation failed:\n{report}"
```

## 🔄 Error Handling Pattern

```python
try:
    # Generate process
    generator = BPMNGenerator(process_name)
    builder = FlowBuilder(generator)
    
    # Create flow based on pattern
    if pattern == 'linear':
        builder.create_linear_flow(tasks)
    elif pattern == 'approval':
        builder.create_approval_flow(...)
    # ... etc
    
    # Validate
    is_valid, report = validate_bpmn(generator)
    
    if is_valid:
        generator.save_to_file(filename)
        return f"✓ Process created: {filename}\n{report}"
    else:
        return f"⚠ Process created with warnings:\n{report}"
        
except Exception as e:
    return f"✗ Error creating process: {str(e)}"
```

## 📊 Response Format

When reporting back to users, include:

1. **Success/Failure status**
2. **Validation report**
3. **Process summary** (number of tasks, flows, etc.)
4. **File location**

Example response:
```
✓ BPMN Process Created Successfully

Process: Loan Approval Process
File: loan_approval.bpmn

Summary:
- Total elements: 8
- User tasks: 2
- Service tasks: 2
- Gateways: 1
- Sequence flows: 7

Validation: ✓ VALID (no errors, 0 warnings)
```

## 🚀 Advanced Patterns

### Custom Gateway Logic

```python
# For complex decision logic
generator = BPMNGenerator("Complex Process")

start = generator.add_start_event()
task1 = generator.add_user_task("Review", "Analyst")
gateway = generator.add_exclusive_gateway("Decision")

# Add conditional flows
high_value = generator.add_user_task("Senior Review", "Manager")
low_value = generator.add_user_task("Standard Process", "Analyst")

generator.add_sequence_flow(start, task1)
generator.add_sequence_flow(task1, gateway)
generator.add_sequence_flow(gateway, high_value, "High Value", "amount > 10000")
generator.add_sequence_flow(gateway, low_value, "Low Value", "amount <= 10000")
```

### Combining Patterns

```python
# Start with swimlanes, add milestones
generator = BPMNGenerator("Complex Process")
builder = FlowBuilder(generator)

# Create swimlane structure
result = builder.create_swimlane_flow(lanes_config)

# Add milestones to group phases
generator.add_milestone("Phase 1", result['Department A'])
generator.add_milestone("Phase 2", result['Department B'])
```

## 💡 Best Practices for LLMs

1. **Always validate** before saving
2. **Use meaningful names** extracted from user input
3. **Choose the simplest pattern** that meets requirements
4. **Provide clear feedback** with validation results
5. **Handle errors gracefully** with try-catch blocks
6. **Include process summary** in responses
7. **Save to appropriate location** (use output/ directory)

## 🎓 Learning from Examples

Study these example files:
- [`example_simple_flow.py`](example_simple_flow.py) - Basic linear workflow
- [`example_approval_flow.py`](example_approval_flow.py) - Decision-based workflow
- [`example_swimlane_flow.py`](example_swimlane_flow.py) - Multi-role workflow

## 🔍 Debugging Tips

If validation fails:
1. Check that all tasks are connected
2. Verify start and end events exist
3. Ensure gateway has multiple outgoing paths
4. Check that lane/milestone references are valid

Common issues:
- Missing start/end events → Add them explicitly
- Disconnected nodes → Check sequence flows
- Invalid references → Verify IDs match

## 📝 Template Response

Use this template when creating BPMN:

```python
def create_bpmn_from_description(description: str) -> str:
    """
    Generate BPMN from natural language description
    
    Args:
        description: User's process description
        
    Returns:
        Status message with validation results
    """
    try:
        # 1. Parse description (implement your parsing logic)
        parsed = parse_description(description)
        
        # 2. Create generator
        generator = BPMNGenerator(parsed['process_name'])
        builder = FlowBuilder(generator)
        
        # 3. Choose and apply pattern
        if parsed['pattern'] == 'linear':
            builder.create_linear_flow(parsed['tasks'])
        elif parsed['pattern'] == 'approval':
            builder.create_approval_flow(
                task_name=parsed['approval_task'],
                approver=parsed['approver'],
                on_approve_tasks=parsed['on_approve'],
                on_reject_tasks=parsed['on_reject']
            )
        # ... handle other patterns
        
        # 4. Validate
        is_valid, report = validate_bpmn(generator)
        
        # 5. Save
        filename = f"{parsed['process_name'].lower().replace(' ', '_')}.bpmn"
        generator.save_to_file(f"BPMN_tools/output/{filename}")
        
        # 6. Return results
        summary = generator.get_summary()
        return f"""
✓ BPMN Process Created

Process: {parsed['process_name']}
File: {filename}
Elements: {summary['total_flow_nodes']}

{report}
"""
    
    except Exception as e:
        return f"✗ Error: {str(e)}"
```

---

**Remember**: The goal is to translate natural language into structured BPMN workflows efficiently and accurately. Always validate and provide clear feedback!