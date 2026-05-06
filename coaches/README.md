# Test Coaches Directory

This directory contains BAW Service Flow (coach) XML files that will be automatically included in the toolkit package.

## Purpose

Test coaches serve multiple purposes:
- **Widget Testing**: Demonstrate individual widget functionality
- **Integration Testing**: Show how multiple widgets work together
- **Documentation**: Provide working examples for developers
- **Quality Assurance**: Validate widget behavior in realistic scenarios

## Current Coaches

### workflow_navigator.xml
**Description:** Multi-widget integration test demonstrating navigation workflow

**Widgets Used:**
- Breadcrumb - Shows navigation path
- Stepper - Displays progress through steps
- ProgressBar - Shows completion percentage

**Use Case:** Demonstrates how to build a multi-step workflow interface with coordinated progress indicators.

**Sample Data:**
- 5 navigation steps
- Currently at step 3 (60% complete)
- Breadcrumb shows: Home > Projects > Current Task

## How to Add New Coaches

### Method 1: Using BAW Coach Composer Mode (Recommended)

1. Switch to BAW Coach Composer mode in Bob
2. Request a test coach:
   ```
   Create a test coach for [widget names]
   ```
3. The coach will be automatically saved to this directory

### Method 2: Using Python CLI

```bash
python generate_test_coach.py
```

Follow the prompts to create a new coach.

### Method 3: Manual Creation

1. Create a new `.xml` file in this directory
2. Follow the BAW Service Flow XML format
3. Ensure the file includes:
   - Valid `<process>` root element with `id` and `name`
   - Process type `13` (Service Flow/Microflow)
   - Process ID must start with "1." (e.g., "1.{guid}")
   - Form tasks with coach UI definitions
   - Process variables for widget data binding

## File Naming Conventions

Use descriptive names that indicate the coach's purpose:

- **Single Widget Tests**: `{widget_name}_test.xml`
  - Example: `progressbar_test.xml`

- **Multi-Widget Tests**: `{feature}_test.xml`
  - Example: `workflow_navigator.xml`

- **Feature Demos**: `{feature}_demo.xml`
  - Example: `form_validation_demo.xml`

## Coach Structure

All coaches must follow this basic structure:

```xml
<?xml version='1.0' encoding='utf-8'?>
<process id="1.{guid}" name="Coach Name">
  <processId>1.{guid}</processId>
  <processType>13</processType>
  <description>Coach description</description>
  
  <!-- Process variables for widget data -->
  <processVariable name="widgetData">
    <!-- Variable definition -->
  </processVariable>
  
  <!-- Form task containing coach UI -->
  <item>
    <processItemId>6023.{guid}</processItemId>
    <name>Test Coach</name>
    <tWComponentName>CoachFlowWrapper</tWComponentName>
    <!-- Coach UI definition -->
  </item>
</process>
```

## Packaging

When you run `package_multiple_widgets.py`, all `.xml` files in this directory will be:

1. Scanned and validated
2. Included in the TWX package
3. Added to the package manifest
4. Available in BAW after import

## Best Practices

### 1. Use Realistic Data

Include sample data that demonstrates:
- Typical use cases
- Edge cases (empty, maximum values)
- Different data types
- Complex nested structures

### 2. Document Widget Configuration

Add comments in the XML explaining:
- Widget properties used
- Data binding patterns
- Event handlers
- Special configurations

### 3. Test Thoroughly

Before committing a coach:
- Verify XML is well-formed
- Test in BAW if possible
- Ensure all widgets render correctly
- Validate data binding works

### 4. Keep It Simple

- Focus on demonstrating specific functionality
- Avoid unnecessary complexity
- Use clear, descriptive names
- Include helpful descriptions

## Troubleshooting

### Coach Not Included in Package

**Check:**
- File has `.xml` extension
- XML is well-formed (no syntax errors)
- File is in the root `coaches/` directory
- Process element has required `id` and `name` attributes

### Coach Doesn't Work in BAW

**Verify:**
- Process type is `13` (Service Flow/Microflow)
- Process ID starts with "1." not "10."
- All widget IDs match those in the toolkit
- Business object types are defined
- Process variables are correctly typed

### Parsing Errors

**Common Issues:**
- Missing XML declaration
- Unclosed tags
- Invalid characters in attributes
- Incorrect namespace declarations

## Examples

See existing coaches in this directory for reference:

- **workflow_navigator.xml** - Multi-widget integration
- **progressbar_test.xml** - Single widget test (if exists)

## Related Documentation

- [Coach Integration Guide](../COACH_INTEGRATION_GUIDE.md) - Complete integration documentation
- [BAW Coach Composer Mode](../.bob/rules-baw-coach-composer/1_workflow.xml) - Mode instructions
- [Service Flow Generator](../toolkit_packager/generators/service_flow_generator.py) - Python API

## Support

For questions or issues:
1. Check the console output when packaging
2. Review the Coach Integration Guide
3. Examine example coaches
4. Consult BAW documentation for Service Flow requirements

---

**Note:** This directory is automatically scanned during packaging. Any `.xml` file placed here will be included in the toolkit package.
