# TWX File Analysis Guide

## Objective

Extract and analyze the `sample/testUI - 2.twx` file to understand the exact BAW Coach XML format (65.*.xml) so we can generate proper coach files.

## Step 1: Extract TWX File

TWX files are ZIP archives. Extract the contents:

```bash
# Create extraction directory
mkdir -p sample/extracted_testUI

# Extract TWX file
cd sample
unzip "testUI - 2.twx" -d extracted_testUI
cd ..
```

## Step 2: Explore Directory Structure

After extraction, examine the structure:

```bash
# List all files
find sample/extracted_testUI -type f

# Look for coach files (65.*.xml)
find sample/extracted_testUI -name "65.*.xml"

# Look for META-INF
ls -la sample/extracted_testUI/META-INF/
```

## Expected Structure

```
extracted_testUI/
├── META-INF/
│   ├── MANIFEST.MF
│   └── package.xml          # Main package descriptor
├── 65.xxx-xxx-xxx.xml       # Coach definition (what we need!)
├── 64.xxx-xxx-xxx.xml       # Coach View widgets
├── 12.xxx-xxx-xxx.xml       # Business Objects
├── 61.xxx-xxx-xxx.xml       # Managed Assets (HTML/CSS/JS)
└── files/                   # Asset files
```

## Step 3: Analyze Coach XML (65.*.xml)

Key elements to identify in the coach XML:

### 1. Coach Header
```xml
<object type="Coach" id="65.xxx-xxx-xxx">
  <name>Test Coach Name</name>
  <description>Coach description</description>
  <richText>...</richText>
  ...
</object>
```

### 2. Data Bindings Section
Look for variable declarations:
```xml
<data>
  <variable name="widgetData1" type="..." />
  <variable name="widgetData2" type="..." />
  ...
</data>
```

### 3. Layout Section
Widget placements and UI structure:
```xml
<layout>
  <section>
    <widget ref="64.xxx-xxx-xxx">
      <binding property="data" variable="widgetData1" />
      <config option="showNumbers" value="true" />
    </widget>
  </section>
</layout>
```

### 4. Scripts Section
Initialization and event handlers:
```xml
<scripts>
  <script type="load">
    // Initialization code
  </script>
</scripts>
```

## Step 4: Document Findings

Create a document with:

1. **Complete Coach XML Structure**: Full example with all sections
2. **Widget Binding Pattern**: How widgets are referenced and bound
3. **Data Variable Pattern**: How variables are declared
4. **Configuration Pattern**: How widget options are set
5. **Layout Pattern**: How widgets are arranged
6. **ID References**: How coach references widget IDs (64.*), business object IDs (12.*), etc.

## Step 5: Create XML Template

Based on findings, create a template structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<object type="Coach" id="{COACH_ID}">
  <name>{COACH_NAME}</name>
  <description>{COACH_DESCRIPTION}</description>
  <richText>{RICH_TEXT_DESCRIPTION}</richText>
  
  <!-- Data bindings -->
  <data>
    {VARIABLE_DECLARATIONS}
  </data>
  
  <!-- Layout -->
  <layout>
    {WIDGET_PLACEMENTS}
  </layout>
  
  <!-- Scripts -->
  <scripts>
    {INITIALIZATION_SCRIPTS}
  </scripts>
  
  <!-- Metadata -->
  <metadata>
    {METADATA_FIELDS}
  </metadata>
</object>
```

## Key Questions to Answer

1. **Coach ID Format**: What's the exact format of coach IDs (65.xxx-xxx-xxx)?
2. **Widget References**: How are coach views (64.*) referenced in the coach?
3. **Data Types**: How are business object types referenced?
4. **Binding Syntax**: Exact XML syntax for data bindings
5. **Configuration Options**: How are widget config options specified?
6. **Layout Structure**: Is it grid-based, section-based, or free-form?
7. **Event Handlers**: How are event handlers defined in coaches?
8. **Dependencies**: How does the coach declare dependencies on widgets?

## Analysis Checklist

- [ ] Extract TWX file successfully
- [ ] Locate coach XML file (65.*.xml)
- [ ] Identify all major XML sections
- [ ] Document coach header structure
- [ ] Document data binding pattern
- [ ] Document layout structure
- [ ] Document widget reference pattern
- [ ] Document configuration option pattern
- [ ] Document script section structure
- [ ] Create XML template based on findings
- [ ] Identify any special attributes or namespaces
- [ ] Note version-specific elements (BAW 25.0.1)

## Next Steps After Analysis

Once you have the coach XML structure documented:

1. **Update COACH_COMPOSER_PLAN.md** with accurate XML format details
2. **Create XML templates** for coach generation
3. **Switch to Code mode** to implement the coach generator
4. **Test generation** with a simple coach containing 1-2 widgets
5. **Validate** by importing into BAW

## Python Script for Analysis

Since Plan mode can't create Python files, here's the script to create manually:

**File: `analyze_twx.py`**

```python
#!/usr/bin/env python3
"""
Analyze TWX file structure to understand BAW Coach XML format.
"""

import zipfile
import sys
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.dom import minidom

def extract_twx(twx_path: Path, output_dir: Path):
    """Extract TWX file to output directory."""
    print(f"Extracting {twx_path} to {output_dir}...")
    with zipfile.ZipFile(twx_path, 'r') as zip_ref:
        zip_ref.extractall(output_dir)
    print(f"✓ Extracted successfully")

def find_coach_files(extract_dir: Path):
    """Find all coach XML files (65.*.xml)."""
    coach_files = list(extract_dir.glob("65.*.xml"))
    print(f"\nFound {len(coach_files)} coach file(s):")
    for f in coach_files:
        print(f"  - {f.name}")
    return coach_files

def analyze_coach_xml(coach_file: Path):
    """Analyze coach XML structure."""
    print(f"\n{'='*70}")
    print(f"Analyzing: {coach_file.name}")
    print(f"{'='*70}\n")
    
    # Parse XML
    tree = ET.parse(coach_file)
    root = tree.getroot()
    
    # Pretty print
    xml_str = ET.tostring(root, encoding='unicode')
    dom = minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent="  ")
    
    print("XML Structure:")
    print(pretty_xml)
    
    # Analyze sections
    print("\n" + "="*70)
    print("Section Analysis:")
    print("="*70)
    
    # Coach metadata
    print("\n1. COACH METADATA:")
    print(f"   Type: {root.get('type')}")
    print(f"   ID: {root.get('id')}")
    name = root.find('name')
    if name is not None:
        print(f"   Name: {name.text}")
    desc = root.find('description')
    if desc is not None:
        print(f"   Description: {desc.text}")
    
    # Data bindings
    print("\n2. DATA BINDINGS:")
    data_section = root.find('data')
    if data_section is not None:
        variables = data_section.findall('.//variable')
        print(f"   Found {len(variables)} variable(s):")
        for var in variables:
            print(f"   - {var.get('name')}: {var.get('type')}")
    
    # Layout
    print("\n3. LAYOUT:")
    layout_section = root.find('layout')
    if layout_section is not None:
        widgets = layout_section.findall('.//widget')
        print(f"   Found {len(widgets)} widget(s) in layout:")
        for widget in widgets:
            print(f"   - Widget ref: {widget.get('ref')}")
            bindings = widget.findall('.//binding')
            for binding in bindings:
                print(f"     Binding: {binding.get('property')} -> {binding.get('variable')}")
    
    # Scripts
    print("\n4. SCRIPTS:")
    scripts_section = root.find('scripts')
    if scripts_section is not None:
        scripts = scripts_section.findall('.//script')
        print(f"   Found {len(scripts)} script(s):")
        for script in scripts:
            print(f"   - Type: {script.get('type')}")
    
    return root

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 analyze_twx.py <path-to-twx-file>")
        print("Example: python3 analyze_twx.py 'sample/testUI - 2.twx'")
        sys.exit(1)
    
    twx_path = Path(sys.argv[1])
    if not twx_path.exists():
        print(f"Error: File not found: {twx_path}")
        sys.exit(1)
    
    # Create extraction directory
    extract_dir = twx_path.parent / f"extracted_{twx_path.stem}"
    extract_dir.mkdir(exist_ok=True)
    
    # Extract TWX
    extract_twx(twx_path, extract_dir)
    
    # Find coach files
    coach_files = find_coach_files(extract_dir)
    
    # Analyze each coach file
    for coach_file in coach_files:
        analyze_coach_xml(coach_file)
    
    print(f"\n{'='*70}")
    print(f"Analysis complete!")
    print(f"Extracted files location: {extract_dir}")
    print(f"{'='*70}\n")

if __name__ == "__main__":
    main()
```

## Usage

```bash
# Make script executable
chmod +x analyze_twx.py

# Run analysis
python3 analyze_twx.py "sample/testUI - 2.twx"

# Output will show:
# - Extracted file structure
# - Coach XML structure
# - Data bindings
# - Widget placements
# - Scripts
```

## Documentation Template

After analysis, document findings in this format:

### Coach XML Format (BAW 25.0.1)

**File Pattern**: `65.{guid}.xml`

**Root Element**:
```xml
<object type="Coach" id="65.{guid}">
```

**Required Sections**:
1. Metadata (name, description)
2. Data (variable declarations)
3. Layout (widget placements)
4. Scripts (event handlers)

**Widget Reference Pattern**:
```xml
<widget ref="64.{widget-guid}">
  <binding property="{property}" variable="{variable-name}" />
  <config option="{option-name}" value="{value}" />
</widget>
```

**Variable Declaration Pattern**:
```xml
<variable name="{name}" type="{type-id}" isList="{true|false}" />
```

---

**Next Action**: Run the analysis script and document the findings, then we can proceed with implementation in Code mode.