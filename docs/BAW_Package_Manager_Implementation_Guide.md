# BAW Package Manager - Implementation Guide

## Quick Reference

This guide provides step-by-step instructions for implementing the `baw-package-manager` mode based on the [Implementation Plan](./BAW_Package_Manager_Plan.md).

## Configuration File Template

Create `toolkit.config.json` in the project root:

```json
{
  "toolkit": {
    "name": "Custom Widgets",
    "shortName": "CW",
    "description": "Custom widget toolkit for BAW",
    "version": "1.0.0",
    "isToolkit": true,
    "isHidden": false,
    "isSystem": false
  },
  "dependencies": {
    "systemData": {
      "snapshotId": "2064.1080ded6-d153-4654-947c-2d16fce170db",
      "name": "8.6.0.0_TC"
    },
    "uiToolkit": {
      "snapshotId": "2064.304ac881-16c3-47d2-97d5-6e4c4a893177",
      "name": "8.6.0.0"
    }
  },
  "output": {
    "directory": "output",
    "filename": "Custom_Widgets_{version}.twx"
  },
  "widgets": {
    "include": ["*"],
    "exclude": ["BaseTWX", "docs", "Loclisation", ".bob", ".vscode"]
  }
}
```

## Mode Custom Instructions

Update `.bob/custom_modes.yaml` for the `baw-package-manager` mode:

```yaml
customInstructions: >
  You are an expert in creating IBM BAW Toolkit (TWX) packages from widget source code.
  
  CORE WORKFLOW:
  1. Scan project directories to identify all widgets (directories with widget/ subdirectory)
  2. Validate each widget has required files: Layout.html, InlineCSS.css, inlineJavascript.js, {WidgetName}.json
  3. Read toolkit.config.json for configuration (or use defaults)
  4. Generate unique IDs for all TWX objects using deterministic hashing
  5. Create XML definitions for each widget component
  6. Map widget files to TWX file structure
  7. Package everything into a ZIP file with .twx extension
  8. Save to output/ directory
  
  TWX STRUCTURE:
  - META-INF/: Package metadata (MANIFEST.MF, metadata.xml, package.xml, properties.json)
  - objects/: XML definitions for all objects (coach views, business objects, managed assets)
  - files/: Actual file content with hash-based naming
  - toolkits/: Dependency toolkits (System Data, UI Toolkit)
  
  OBJECT TYPES:
  - 64.{guid}.xml: Coach view definitions (widget UI)
  - 12.{guid}.xml: Business object/class definitions (data models)
  - 61.{guid}.xml: Managed assets (preview HTML/JS files)
  - 62.{guid}.xml: Environment variables
  - 63.{guid}.xml: Project defaults
  
  ID GENERATION:
  - Use deterministic GUIDs based on: hash(widgetName + objectType + timestamp)
  - Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  - Ensure uniqueness across all objects in the package
  
  XML GENERATION RULES:
  1. Coach View (64.*.xml):
     - Embed Layout.html as XML-escaped content in <layout> element
     - Embed InlineCSS.css in <inlineScript type="CSS">
     - Embed inlineJavascript.js in <inlineScript type="JS">
     - Parse {WidgetName}.json to generate <bindingType> and <configOption> elements
  
  2. Business Object (12.*.xml):
     - Parse OpenAPI schema from {WidgetName}.json
     - Generate TWClass XML structure with properties
     - Create XSD validator schema
  
  3. Managed Assets (61.*.xml):
     - Create definitions for preview HTML and JS files
     - Store file content in files/61.{guid}/ with hash-based filenames
  
  4. META-INF Files:
     - MANIFEST.MF: Simple version header
     - metadata.xml: Object tags (mark discovered objects)
     - package.xml: Main package definition with all objects and dependencies
     - properties.json: {"twxWithoutToolkits":"false"}
  
  XML ESCAPING:
  When embedding HTML/CSS/JS in XML, escape these characters:
  - < → <
  - > → >
  - & → &
  - " → "
  - ' → '
  
  ERROR HANDLING:
  - Missing required files: Skip widget with warning
  - Invalid JSON schema: Skip widget with error
  - Malformed HTML/CSS/JS: Skip widget with error
  - Always provide clear error messages with file paths
  
  OUTPUT:
  - Create output/ directory if it doesn't exist
  - Generate filename: {toolkit.name}_{version}.twx
  - Report success with full file path
  - List all packaged widgets
  
  VALIDATION:
  Before packaging, verify:
  - All required widget files exist
  - JSON schemas are valid OpenAPI 3.0
  - HTML/CSS/JS files are not empty
  - No duplicate widget names
  
  EXAMPLE USAGE:
  User: "Package all widgets into a TWX file"
  Response:
  1. Scan project → Found: Breadcrumb, DateOutput, Stepper, ProcessCircle
  2. Validate widgets → All valid
  3. Generate IDs → Created 16 unique object IDs
  4. Create XML definitions → Generated 16 XML files
  5. Map files → Created file structure with 8 managed assets
  6. Package TWX → Created ZIP archive
  7. Save output → output/Custom_Widgets_1.0.0.twx
  8. Success! Packaged 4 widgets into TWX file
```

## Implementation Steps

### Step 1: Widget Scanner

Create a function to scan the project and identify widgets:

```javascript
function scanProjectWidgets(projectPath, config) {
  const widgets = [];
  const directories = listDirectories(projectPath);
  
  for (const dir of directories) {
    // Skip excluded directories
    if (config.widgets.exclude.includes(dir)) continue;
    
    // Check if directory has widget/ subdirectory
    const widgetPath = path.join(projectPath, dir, 'widget');
    if (directoryExists(widgetPath)) {
      widgets.push({
        name: dir,
        path: path.join(projectPath, dir),
        widgetPath: widgetPath,
        previewPath: path.join(projectPath, dir, 'AdvancePreview')
      });
    }
  }
  
  return widgets;
}
```

### Step 2: Widget Validator

Validate each widget has required files:

```javascript
function validateWidget(widget) {
  const required = [
    'Layout.html',
    'InlineCSS.css',
    'inlineJavascript.js',
    `${widget.name}.json`
  ];
  
  const missing = [];
  for (const file of required) {
    const filePath = path.join(widget.widgetPath, file);
    if (!fileExists(filePath)) {
      missing.push(file);
    }
  }
  
  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Missing required files: ${missing.join(', ')}`]
    };
  }
  
  return { valid: true, errors: [] };
}
```

### Step 3: ID Generator

Generate unique IDs for TWX objects:

```javascript
function generateGUID(seed) {
  // Use crypto or hash function to generate RFC4122 compliant GUID
  // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  return `${hash.substr(0,8)}-${hash.substr(8,4)}-4${hash.substr(12,3)}-${hash.substr(15,4)}-${hash.substr(19,12)}`;
}

function generateObjectID(widgetName, objectType, timestamp) {
  const seed = `${widgetName}-${objectType}-${timestamp}`;
  const guid = generateGUID(seed);
  return `${objectType}.${guid}`;
}

function generateVersionID() {
  // Generate random UUID v4 for version IDs
  return crypto.randomUUID();
}

function generateFileHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex').substr(0, 40);
}
```

### Step 4: XML Generators

#### Coach View Generator (64.*.xml)

```javascript
function generateCoachViewXML(widget, ids) {
  const layout = readFile(path.join(widget.widgetPath, 'Layout.html'));
  const css = readFile(path.join(widget.widgetPath, 'InlineCSS.css'));
  const js = readFile(path.join(widget.widgetPath, 'inlineJavascript.js'));
  const schema = JSON.parse(readFile(path.join(widget.widgetPath, `${widget.name}.json`)));
  
  // Escape HTML for XML embedding
  const escapedLayout = escapeXML(layout);
  
  // Generate binding types from schema
  const bindingTypes = generateBindingTypes(schema, ids);
  
  // Generate config options from schema
  const configOptions = generateConfigOptions(schema, ids);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<teamworks>
    <coachView id="${ids.coachView}" name="${widget.name}">
        <lastModified>${Date.now()}</lastModified>
        <lastModifiedBy>baw-package-manager</lastModifiedBy>
        <layout>${escapedLayout}</layout>
        ${bindingTypes}
        ${configOptions}
        <inlineScript name="Inline Javascript">
            <scriptType>JS</scriptType>
            <scriptBlock>${escapeXML(js)}</scriptBlock>
        </inlineScript>
        <inlineScript name="Inline CSS">
            <scriptType>CSS</scriptType>
            <scriptBlock>${escapeXML(css)}</scriptBlock>
        </inlineScript>
    </coachView>
</teamworks>`;
}

function escapeXML(text) {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, ''');
}
```

#### Business Object Generator (12.*.xml)

```javascript
function generateBusinessObjectXML(widget, ids) {
  const schema = JSON.parse(readFile(path.join(widget.widgetPath, `${widget.name}.json`)));
  
  // Parse OpenAPI schema
  const businessObject = schema.components.schemas[Object.keys(schema.components.schemas)[0]];
  
  // Generate properties
  const properties = generateProperties(businessObject.properties, ids);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<teamworks>
    <twClass id="${ids.businessObject}" name="${widget.name}Item">
        <lastModified>${Date.now()}</lastModified>
        <type>1</type>
        <description>${businessObject.description || ''}</description>
        <definition>
            ${properties}
        </definition>
    </twClass>
</teamworks>`;
}
```

#### Managed Asset Generator (61.*.xml)

```javascript
function generateManagedAssetXML(widget, ids, fileHash) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<teamworks>
    <managedAsset id="${ids.managedAsset}" name="${widget.name}.html">
        <lastModified>${Date.now()}</lastModified>
        <fileHash>${fileHash}</fileHash>
    </managedAsset>
</teamworks>`;
}
```

### Step 5: META-INF Generators

```javascript
function generateManifest() {
  return `Manifest-Version: 1.0\n`;
}

function generateMetadata(objectIds) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<metadata>\n`;
  for (const id of objectIds) {
    xml += `    <object id="${id}">\n`;
    xml += `        <tags>\n`;
    xml += `            <tag>Discovered</tag>\n`;
    xml += `        </tags>\n`;
    xml += `    </object>\n`;
  }
  xml += `</metadata>\n`;
  return xml;
}

function generatePackageXML(config, widgets, objectIds) {
  // Generate complete package.xml with all objects and dependencies
  // See BaseTWX/25.0.1/META-INF/package.xml for reference structure
}

function generateProperties() {
  return JSON.stringify({"twxWithoutToolkits":"false"});
}
```

### Step 6: TWX Packager

```javascript
function packageTWX(widgets, config, xmlFiles, fileMapping) {
  const outputDir = config.output.directory;
  const filename = config.output.filename.replace('{version}', config.toolkit.version);
  const outputPath = path.join(outputDir, filename);
  
  // Create ZIP archive
  const zip = new JSZip();
  
  // Add META-INF files
  zip.file('META-INF/MANIFEST.MF', generateManifest());
  zip.file('META-INF/metadata.xml', xmlFiles.metadata);
  zip.file('META-INF/package.xml', xmlFiles.package);
  zip.file('META-INF/properties.json', generateProperties());
  
  // Add object XML files
  for (const [filename, content] of Object.entries(xmlFiles.objects)) {
    zip.file(`objects/${filename}`, content);
  }
  
  // Add file content
  for (const [path, content] of Object.entries(fileMapping)) {
    zip.file(`files/${path}`, content);
  }
  
  // Add dependency toolkits (copy from BaseTWX)
  // zip.file('toolkits/...', ...);
  
  // Generate and save ZIP
  const buffer = await zip.generateAsync({type: 'nodebuffer'});
  fs.writeFileSync(outputPath, buffer);
  
  return outputPath;
}
```

## Testing Checklist

- [ ] Scan project and identify all widgets correctly
- [ ] Validate widget structure (required files present)
- [ ] Generate unique IDs without collisions
- [ ] Create valid coach view XML (64.*.xml)
- [ ] Create valid business object XML (12.*.xml)
- [ ] Create valid managed asset XML (61.*.xml)
- [ ] Generate correct META-INF files
- [ ] Map files to correct TWX structure
- [ ] Create valid ZIP archive
- [ ] Import TWX into BAW successfully
- [ ] Widget functions correctly after import

## Common Issues & Solutions

### Issue: XML Parsing Errors
**Solution**: Ensure all HTML/CSS/JS content is properly XML-escaped

### Issue: Missing Dependencies
**Solution**: Copy System Data and UI Toolkit from BaseTWX/25.0.1/toolkits/

### Issue: ID Collisions
**Solution**: Include timestamp in ID generation seed

### Issue: Invalid JSON Schema
**Solution**: Validate OpenAPI schema before processing

### Issue: File Not Found
**Solution**: Use absolute paths and verify file existence before reading

## Next Steps

1. Review this implementation guide
2. Switch to Code mode to implement the functionality
3. Test with Breadcrumb widget first
4. Expand to support all widgets
5. Add error handling and validation
6. Document usage for end users

---

**Related Documents**:
- [Implementation Plan](./BAW_Package_Manager_Plan.md)
- [TWX Structure Reference](../BaseTWX/25.0.1/)
- [Widget Examples](../Breadcrumb/)