# Phase 1: Single Widget End-to-End Implementation

## Goal
Create a complete, working TWX package for the DateOutput widget.

## Components to Implement

### 1. Coach View Generator (Priority: HIGH)
**File**: `generators/coach_view.py`
- Parse Layout.html and embed with XML escaping
- Parse InlineCSS.css and embed
- Parse inlineJavascript.js and embed
- Parse openapi.json for binding types and config options
- Generate complete 64.*.xml file

### 2. Business Object Generator (Priority: HIGH)
**File**: `generators/business_object.py`
- Parse OpenAPI schema from JSON
- Generate TWClass XML structure (12.*.xml)
- Create property definitions from schema

### 3. Managed Asset Generator (Priority: MEDIUM)
**File**: `generators/managed_asset.py`
- Generate definitions for preview HTML file (61.*.xml)
- Generate definitions for preview JS file (61.*.xml)
- Create file references

### 4. META-INF Generators (Priority: HIGH)
**File**: `generators/meta_inf.py`
- `generate_manifest()` - Simple MANIFEST.MF
- `generate_metadata()` - metadata.xml with object tags
- `generate_package_xml()` - Complete package.xml
- `generate_properties()` - properties.json

### 5. File Mapper (Priority: HIGH)
**File**: `packager/file_mapper.py`
- Map widget files to TWX files/ structure
- Generate file hashes for naming
- Create file ID mappings

### 6. TWX Builder (Priority: HIGH)
**File**: `packager/twx_builder.py`
- Create ZIP archive structure
- Add META-INF files
- Add objects/ directory with XML files
- Add files/ directory with content
- Copy dependency toolkits from templates/BaseTWX
- Save as .twx file

### 7. Main Orchestrator (Priority: HIGH)
**File**: `package_single_widget.py` (test script)
- Load configuration
- Scan for DateOutput widget
- Validate widget
- Generate all object IDs
- Generate all XML files
- Map files
- Build TWX
- Save to output/

## Implementation Order

1. ✅ Coach View Generator (simplified)
2. ✅ Business Object Generator (simplified)
3. ✅ Managed Asset Generator
4. ✅ META-INF Generators
5. ✅ File Mapper
6. ✅ TWX Builder
7. ✅ Test with DateOutput widget
8. ✅ Verify TWX can be imported into BAW

## Success Criteria

- [ ] Generate valid XML for all object types
- [ ] Create proper TWX ZIP structure
- [ ] Include dependency toolkits
- [ ] Output file: `output/DateOutput_Test_1.0.0.twx`
- [ ] File size: ~2-3 MB (with dependencies)
- [ ] Can be imported into BAW (manual verification)

## Testing Strategy

1. Generate TWX for DateOutput
2. Inspect ZIP structure
3. Validate XML files
4. Compare with reference TWX (templates/BaseTWX)
5. Attempt import into BAW (if available)

## Phase 2 Preview

Once Phase 1 works:
- Extend to multiple widgets (DateOutput + Breadcrumb)
- Optimize XML generation
- Add more sophisticated schema parsing
- Improve error handling
- Add progress indicators

---

**Status**: Starting implementation
**Target**: Working TWX for DateOutput widget