# TWX Analysis Findings - testUI Sample

## Overview

The `testUI - 2.twx` file contains a **Service Flow** (not a standalone coach) with embedded coach UI definitions. This is the standard BAW approach for creating test UIs.

## File Structure

```
testUI - 2.twx (ZIP archive)
├── META-INF/
│   ├── MANIFEST.MF
│   ├── metadata.xml
│   ├── package.xml          # Package descriptor
│   └── properties.json
├── objects/
│   ├── 1.c01759ed-6bc0-4a8b-8923-022b9a6be086.xml  # Service Flow with Coach UI
│   ├── 1.7a20d4f7-74bb-4863-a6ac-fa970df26007.xml  # Another process
│   ├── 25.e2c4a932-296e-4d8c-abe8-44e00c5ee46d.xml # BPD
│   ├── 61.e4ad887b-e469-43a4-97d5-61f1df9ec8b9.xml # Managed Asset
│   ├── 62.cda9fcc0-ada0-4482-9a83-e26b041e8731.xml # Environment Variables
│   └── 63.7e5d26fd-2177-407f-9b63-d85c63397c6f.xml # Toolkit Settings
├── files/
│   └── 61.e4ad887b-e469-43a4-97d5-61f1df9ec8b9/
│       └── 1892606e-d1a3-4fd6-b0b7-c1f50ceaa35a  # Theme ZIP
└── toolkits/
    ├── 2064.1080ded6-d153-4654-947c-2d16fce170db.zip  # System Data
    ├── 2064.304ac881-16c3-47d2-97d5-6e4c4a893177.zip  # UI Toolkit
    └── 2064.b6502e5a-20f4-4d1e-a95f-55ceef6fc34a.zip  # Custom Widgets (v1.0.26)
```

## Key Findings

### 1. Object Type: Service Flow (Process Type 10)

The coach UI is embedded in a **Service Flow** with:
- **Object ID**: `1.c01759ed-6bc0-4a8b-8923-022b9a6be086`
- **Object Type**: `process`
- **Process Type**: `10` (Service Flow)
- **Name**: "My First Coach"

### 2. Coach Definition Format

The coach UI is defined in **JSON format** within the `<jsonData>` element, not as separate XML. The structure includes:

```xml
<process id="1.xxx" name="My First Coach">
    <processType>10</processType>  <!-- Service Flow -->
    <jsonData>
        {
            "rootElement": [{
                "extensionElements": {
                    "userTaskImplementation": [{
                        "flowElement": [
                            // BPMN flow elements (start, tasks, end, sequence flows)
                        ],
                        "htmlHeaderTag": [...],
                        "declaredType": "com.ibm.bpmsdk.model.bpmn20.ibmext.TUserTaskImplementation"
                    }]
                }
            }]
        }
    </jsonData>
    <processVariable>...</processVariable>  <!-- Data bindings -->
</process>
```

### 3. Coach UI Structure (Within JSON)

#### A. Flow Elements

The coach is composed of BPMN flow elements:

1. **Start Event**
   ```json
   {
       "declaredType": "startEvent",
       "id": "9189efad-a0fc-4fce-b33d-3ff10356ef1c",
       "name": "Start"
   }
   ```

2. **Form Tasks** (Coach Screens)
   ```json
   {
       "declaredType": "com.ibm.bpmsdk.model.bpmn20.ibmext.TFormTask",
       "id": "2025.1a775831-05fc-412f-80b0-e135b656590c",
       "name": "Screen 1",
       "formDefinition": {
           "coachDefinition": {
               "layout": {
                   "layoutItem": [
                       // Widget placements
                   ]
               }
           }
       }
   }
   ```

3. **Script Tasks** (Data manipulation)
   ```json
   {
       "declaredType": "scriptTask",
       "id": "2025.20a0582f-4c69-42b9-8e78-4b698ed2b808",
       "name": "Manip Script",
       "script": {
           "content": ["// JavaScript code"]
       }
   }
   ```

4. **End Event**
   ```json
   {
       "declaredType": "endEvent",
       "id": "84c71497-3d0e-41a0-9abe-c54c154cda37",
       "name": "End"
   }
   ```

5. **Sequence Flows** (Navigation)
   ```json
   {
       "declaredType": "sequenceFlow",
       "id": "2027.41e01b3d-a7ee-4a99-9df3-9b73d39aaf54",
       "sourceRef": "9189efad-a0fc-4fce-b33d-3ff10356ef1c",
       "targetRef": "2025.1a775831-05fc-412f-80b0-e135b656590c"
   }
   ```

#### B. Widget Placement in Coach

Widgets are placed within `layoutItem` arrays:

```json
{
    "layoutItemId": "ProgressBar1",
    "viewUUID": "64.db824ed3-93e7-4eb6-a583-56a0a2bf25c0",  // Widget ID
    "binding": "tw.local.progressbar",  // Data binding
    "version": "8550",
    "configData": [
        {
            "declaredType": "com.ibm.bpmsdk.model.coach.ConfigData",
            "id": "b3aea45e-a175-4501-8eb9-a6e1d04f001a",
            "optionName": "showPercentage",
            "value": "true"
        }
    ]
}
```

**Key Widget Properties:**
- `layoutItemId`: Unique identifier for the widget instance
- `viewUUID`: Reference to the coach view (64.xxx format)
- `binding`: Data binding path (e.g., "tw.local.progressbar")
- `version`: Toolkit version
- `configData`: Array of configuration options

#### C. Data Variables

Variables are defined in two places:

1. **In JSON (dataObject)**:
   ```json
   {
       "declaredType": "dataObject",
       "id": "2056.0ffa4f0b-ac4e-4d27-8710-da78f00cce78",
       "name": "progressbar",
       "itemSubjectRef": "itm.12.534faa11-5ec3-450b-9628-4e6b83e32688",
       "isCollection": false
   }
   ```

2. **In XML (processVariable)**:
   ```xml
   <processVariable name="progressbar">
       <processVariableId>2056.0ffa4f0b-ac4e-4d27-8710-da78f00cce78</processVariableId>
       <classId>7693e51e-e6f3-47d2-8ee6-e14f8fb7c5f1/12.534faa11-5ec3-450b-9628-4e6b83e32688</classId>
       <isArrayOf>false</isArrayOf>
   </processVariable>
   ```

**Variable Properties:**
- `name`: Variable name (e.g., "progressbar")
- `classId`: Business object type reference (format: `{toolkit-id}/{bo-id}`)
- `isArrayOf`: Boolean indicating if it's a list
- `hasDefault`: Whether it has a default value

### 4. Widget References

Widgets are referenced by their coach view ID:

```json
"viewUUID": "64.db824ed3-93e7-4eb6-a583-56a0a2bf25c0"
```

This corresponds to the widget's coach view XML file in the toolkit.

### 5. Sample Data Initialization

Default values can be set in the JSON:

```json
{
    "extensionElements": {
        "defaultValue": [{
            "declaredType": "com.ibm.bpmsdk.model.bpmn20.ibmext.TDefaultValue",
            "useDefault": true,
            "value": "var autoObject = {};\nautoObject.value = 100;\nautoObject.percentage = 30;\nautoObject.status = \"OLAAA\";\nautoObject"
        }]
    }
}
```

### 6. Dependencies

The package declares dependencies on:

1. **Custom Widgets Toolkit** (v1.0.26)
   - ID: `2066.cebc1c06-68a5-4d2e-986a-aaae3072ceeb`
   - Snapshot: `2064.b6502e5a-20f4-4d1e-a95f-55ceef6fc34a`

2. **UI Toolkit** (System)
   - ID: `2066.ec5973da-aebe-40f6-aa02-a77962288f52`
   - Snapshot: `2064.304ac881-16c3-47d2-97d5-6e4c4a893177`

3. **System Data** (System)
   - ID: `2066.1b351583-e5cb-43b7-baee-340a63130ea7`
   - Snapshot: `2064.1080ded6-d153-4654-947c-2d16fce170db`

## Implementation Strategy

Based on this analysis, to generate a test coach we need to:

### 1. Create a Service Flow (Process Type 10)

Generate an XML file with:
- Object type: `process`
- Process type: `10` (Service Flow)
- Unique process ID (format: `1.{guid}`)

### 2. Build JSON Coach Definition

Create a JSON structure with:
- BPMN flow elements (start → form task → end)
- Form task with coach definition
- Layout items for each widget
- Widget bindings and configurations

### 3. Define Process Variables

For each widget, create:
- JSON dataObject definition
- XML processVariable definition
- Proper classId references to business objects

### 4. Generate Widget Layout Items

For each widget:
```json
{
    "layoutItemId": "{WidgetName}1",
    "viewUUID": "64.{widget-coach-view-id}",
    "binding": "tw.local.{widgetDataVar}",
    "version": "8550",
    "configData": [
        // Configuration options from widget config.json
    ],
    "declaredType": "com.ibm.bpmsdk.model.coach.ViewRef",
    "id": "{unique-guid}"
}
```

### 5. Set Default Values

Generate JavaScript initialization code for sample data:
```javascript
var autoObject = {};
autoObject.property1 = value1;
autoObject.property2 = value2;
autoObject
```

## Recommended Approach

1. **Generate Service Flow XML** with embedded JSON coach definition
2. **Use existing toolkit_packager** infrastructure for GUIDs and IDs
3. **Create coach registry** similar to coach_view_registry
4. **Build JSON generator** for coach definition structure
5. **Integrate into TWX packaging** as an additional object type

## File Naming Convention

- Service Flow: `1.{guid}.xml`
- Place in `objects/` directory
- Reference in `META-INF/package.xml`

## Next Steps

1. Create `ServiceFlowGenerator` class
2. Create `CoachDefinitionBuilder` for JSON structure
3. Create `WidgetLayoutComposer` for arranging widgets
4. Integrate with existing packaging workflow
5. Test by importing generated TWX into BAW

---

**Analysis Date**: 2026-05-03  
**BAW Version**: 8.6.10.25010  
**Sample File**: testUI - 2.twx