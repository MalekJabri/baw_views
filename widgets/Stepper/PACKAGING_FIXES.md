# Stepper Widget Packaging Fixes

## Issue Summary
The initial packaging (v1.0.0) was missing critical BAW-specific configurations that were manually added on the server side to create v1.0.1.

## Key Differences Between v1.0.0 and v1.0.1

### 1. Missing Business Object Definition
**Problem**: No `StepItem` business object was defined
**Solution**: Created `StepItem.json` with properties:
- `label` (String)
- `text` (String) 
- `description` (String)
- `status` (String)

### 2. Missing Binding Type Configuration
**Problem**: Coach view had no binding type defined
**Solution**: Added binding type configuration:
```xml
<bindingType name="StepperData">
    <isList>true</isList>
    <classId>String</classId>
</bindingType>
```

### 3. Missing Event Configuration
**Problem**: `stepClicked` event was not properly registered as a config option
**Solution**: Added event config option:
```xml
<configOption name="stepClicked">
    <propertyType>EVENT</propertyType>
    <classId>String</classId>
</configOption>
```

### 4. Missing Change Function
**Problem**: No `changeJsFunction` was defined
**Solution**: Added change handler that accesses data via `this.getData()`

### 5. Event Handler Data Access
**Problem**: Event handler was trying to access `this.getData().items`
**Solution**: Changed to `this.getData()` directly since binding is already a list

## Files Created/Modified

### New Files:
1. `widgets/Stepper/widget/StepItem.json` - Business object definition
2. `widgets/Stepper/widget/config.json` - Widget configuration metadata

### Modified Files:
1. `widgets/Stepper/widget/eventHandler.md` - Fixed data access pattern
2. `widgets/Stepper/widget/datamodel.md` - Updated event documentation
3. `widgets/Stepper/widget/openapi.json` - Enhanced event schema

## Required Packager Updates

The toolkit packager needs to be enhanced to:

1. **Read and process `config.json`** files in widget directories
2. **Generate business object XML** from JSON definitions
3. **Create proper binding types** based on config
4. **Generate event config options** with `propertyType="EVENT"`
5. **Add change functions** when specified in config
6. **Link business objects** to the toolkit

## Next Steps

1. Update the toolkit packager to support these configurations
2. Repackage the Stepper widget with the new structure
3. Verify the generated TWX matches the corrected v1.0.1 structure
4. Deploy and test in BAW

## BAW Coach Widget Mode Updates Needed

The BAW Coach Widget mode should be updated to:
- Generate `config.json` files for new widgets
- Generate `StepItem.json` style business object definitions
- Include proper event registration patterns
- Document the binding type requirements