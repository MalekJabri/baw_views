# Bob's BAW Development Modes - Complete Guide

## Overview

Bob provides two specialized modes for IBM Business Automation Workflow (BAW) development that streamline the entire widget lifecycle from creation to deployment. This guide explains how these modes work, when to use them, and how they integrate together.

---

## 🎨 BAW Coach Widget Mode

### Purpose

Create and modify IBM Business Automation Workflow coach widgets with AI assistance, following established conventions and best practices automatically.

### Mode Identifier

**Slug**: `baw-coachui-view`  
**Name**: 🎨 BAW Coach Widget

### When to Use

Use this mode when you need to:
- Create new custom widgets
- Modify existing widget implementations
- Add or update widget preview files
- Define widget configuration metadata
- Create or update business object definitions
- Document widget behavior and data models
- Generate widget icons for the BAW palette

### What This Mode Does

**Widget Creation**:
- Generates complete widget file structure
- Creates HTML layout with semantic markup
- Implements CSS styling with Carbon Design System
- Writes JavaScript for data binding and lifecycle
- Defines configuration options and metadata
- Creates business object definitions
- Generates event handlers (only when needed)
- Creates preview files for testing
- Generates documentation

**Best Practices Enforcement**:
- Follows repository naming conventions
- Ensures accessibility compliance (ARIA attributes)
- Integrates Carbon Design System values
- Maintains documentation synchronization
- Creates consistent file structures
- Implements proper data binding patterns

### What This Mode Does NOT Do

- Package widgets into TWX files
- Deploy toolkits to BAW servers
- Manage toolkit versions
- Register business object class IDs
- Handle TWX artifact generation

### Workflow

```
1. User Request
   ↓
2. Analyze Requirements
   - Understand widget specifications
   - Identify required features
   ↓
3. Review Patterns
   - Examine similar widgets
   - Follow repository conventions
   ↓
4. Generate Files
   - Layout.html (structure)
   - InlineCSS.css (styling)
   - inlineJavascript.js (logic)
   - config.json (metadata)
   - Business objects (if needed)
   - Event handlers (if needed)
   - Preview files
   - Documentation
   ↓
5. Validate Implementation
   - Check naming consistency
   - Verify documentation alignment
   - Ensure best practices followed
   ↓
6. Complete
   - Widget ready for packaging
```

### File Structure Created

```
widgets/WidgetName/
├── WidgetName.svg              # Palette icon (120x120px)
├── README.md                   # Widget documentation
├── widget/
│   ├── Layout.html            # HTML structure
│   ├── InlineCSS.css          # Styling (Carbon themed)
│   ├── inlineJavascript.js    # Data binding logic
│   ├── config.json            # Widget metadata
│   ├── BusinessObject.json    # BO definition (if needed)
│   ├── datamodel.md           # Data model docs
│   ├── eventHandler.md        # Event docs
│   └── events/                # Event handlers (if needed)
│       ├── change.js
│       ├── load.js
│       └── validate.js
└── AdvancePreview/            # Preview files
    ├── WidgetName.html
    └── WidgetNameSnippet.js
```

### Key Implementation Patterns

#### 1. Carbon Design System Integration

**InlineCSS.css** uses hardcoded values with theme comments:

```css
/* Widget Styles - Carbon Design System */
.widget-container {
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif; /* @bpm-font-family-sans-serif */
    font-size: 14px; /* @bpm-font-size-base */
    color: #161616; /* @bpm-text-color */
    background-color: #ffffff; /* @bpm-body-bg */
}

.widget-primary {
    background-color: #0f62fe; /* @bpm-color-primary */
    border: 1px solid #e0e0e0; /* Gray 20 */
}

.widget-text-secondary {
    color: #525252; /* Gray 70 */
    font-size: 12px; /* @bpm-font-size-small */
}
```

**Why**: BAW's InlineCSS.css files are pure CSS, not LESS. They don't support variable substitution, so we use hardcoded values with inline comments documenting the corresponding theme variables.

#### 2. List Data Binding

**config.json**:
```json
{
  "bindingType": {
    "name": "WidgetData",
    "isList": true,
    "type": "DataItem"
  }
}
```

**inlineJavascript.js**:
```javascript
// CORRECT: Access list data through .items property
var items = this.getData().items;

// WRONG: These will NOT work
var items = this.getData();           // Returns object, not array
var items = this.getData().data;      // Property doesn't exist
```

**Why**: When `isList: true`, BAW automatically wraps the array in an object with an `items` property. This is a BAW framework convention.

#### 3. Configuration Options

**Access options**:
```javascript
var cardWidth = this.getOption("cardWidth") || 200;
var showIcons = this.getOption("showIcons") !== false;
var theme = this.getOption("theme") || "light";
```

#### 4. Event Handlers

**Only create when needed**:
- `load.js` - Widget initialization
- `change.js` - Data updates
- `validate.js` - Input validation
- `view.js` - View state changes
- `unload.js` - Cleanup

Not all widgets need event handlers. Create only what's necessary for functionality.

### Example Usage

**Creating a new widget**:
```
User: "Create a Timeline widget that displays events vertically with dates and descriptions"

Bob (BAW Coach Widget Mode):
1. Analyzes requirements
2. Reviews similar widgets (Stepper, ProgressBar)
3. Creates complete file structure
4. Implements HTML with semantic markup
5. Styles with Carbon Design System
6. Implements data binding for event list
7. Creates TimelineEvent business object
8. Generates preview files
9. Creates documentation
10. Completes with all files ready
```

### Configuration Reference

**Mode Rules Location**: `.bob/rules-baw-coachui-view/`
- `1_workflow.xml` - Detailed workflow steps
- `2_best_practices.xml` - Implementation patterns and conventions

**Theme Reference**: 
- `themes/CARBON_THEME_VARIABLES.md` - Complete variable reference
- `docs/CARBON_THEME_INTEGRATION.md` - Integration guide

---

## 📦 BAW Package Manager Mode

### Purpose

Package BAW artifacts (widgets, business objects, coaches) into TWX toolkits and deploy them to BAW servers.

### Mode Identifier

**Slug**: `baw-package-manager`  
**Name**: 🗂️ BAW Package Manager

### When to Use

Use this mode when you need to:
- Package widgets into TWX toolkit files
- Register business objects with unique class IDs
- Deploy toolkits to BAW servers
- Manage toolkit versions
- Monitor deployment status
- Update existing toolkits

### What This Mode Does

**Packaging**:
- Scans widgets directory automatically
- Discovers all widgets and business objects
- Registers business objects with persistent class IDs
- Generates TWX toolkit packages
- Manages toolkit versions
- Includes all dependencies

**Deployment**:
- Establishes BAW server connections
- Uploads TWX packages
- Monitors deployment progress
- Reports deployment status
- Handles authentication

**Version Management**:
- Increments toolkit versions automatically
- Maintains version history
- Ensures consistent versioning

### What This Mode Does NOT Do

- Create or modify widget implementations
- Edit widget HTML, CSS, or JavaScript
- Generate widget documentation
- Create preview files
- Modify widget metadata

### Workflow

```
1. User Request (Package/Deploy)
   ↓
2. Scan Project
   - Discover widgets in widgets/
   - Find business objects in business-objects/
   - Identify coaches in coaches/
   ↓
3. Register Business Objects
   - Assign unique class IDs
   - Update registry
   - Handle dependencies
   ↓
4. Generate TWX Package
   - Increment version
   - Build package structure
   - Include all artifacts
   - Add metadata
   ↓
5. Deploy (if requested)
   - Connect to BAW server
   - Upload TWX file
   - Monitor progress
   ↓
6. Report Results
   - Package location
   - Deployment status
   - Version information
```

### Key Features

#### 1. Automatic Discovery

The packager automatically finds:
- All widgets in `widgets/` directory
- Business objects in `business-objects/generated/`
- Coaches in `coaches/` directory
- Widget icons (SVG files)
- Preview files

No manual configuration needed - just create widgets and package.

#### 2. Persistent Class IDs

Business objects get unique, persistent class IDs:

```
INFO: Reusing existing business object 'CarouselItem' with ID: 12.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

IDs are stored in `toolkit_packager/baw_custom_types.json` and reused across builds for consistency.

#### 3. Version Management

Toolkit version automatically increments:

```
INFO: Updated version: 1.0.79 → 1.0.80
```

Version is stored in `toolkit.config.json`.

#### 4. Deployment Automation

One command deploys to BAW:

```
INFO: Successfully obtained CSRF token
INFO: Toolkit deployment submitted
INFO: Deployment status: success
```

### Example Usage

**Packaging and deploying**:
```
User: "Package and deploy the toolkit"

Bob (BAW Package Manager Mode):
1. Scans widgets directory
   - Finds 13 widgets including new Carousel
2. Registers business objects
   - CarouselItem: 12.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   - 18 other business objects
3. Generates TWX package
   - Version: 1.0.80
   - Size: 14.5 MB
   - Location: output/Custom_Widgets_1.0.80.twx
4. Establishes BAW connection
   - Obtains CSRF token
5. Deploys toolkit
   - Uploads TWX file
   - Monitors progress
6. Reports success
   - Deployment complete
   - Toolkit available in BAW
```

### Configuration

**Toolkit Configuration**: `toolkit.config.json`
```json
{
  "name": "Custom Widgets",
  "version": "1.0.80",
  "description": "Custom BAW Coach Widgets",
  "toolkitId": "2066.cebc1c06-68a5-4d2e-986a-aaae3072ceeb"
}
```

**Business Object Registry**: `toolkit_packager/baw_custom_types.json`
```json
{
  "CarouselItem": {
    "classId": "12.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "properties": ["icon", "title", "description"]
  }
}
```

**Coach View Registry**: `toolkit_packager/baw_coach_views.json`
```json
{
  "Carousel": {
    "coachViewId": "64.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "previewHtmlId": "61.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "previewJsId": "61.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "iconId": "61.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

---

## Mode Integration

### Complete Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    Widget Development Lifecycle              │
└─────────────────────────────────────────────────────────────┘

1. CREATE WIDGET
   User: "Create a Carousel widget with flip cards"
   Mode: 🎨 BAW Coach Widget Mode
   Output: Complete widget files in widgets/Carousel/
   
   ↓

2. PACKAGE TOOLKIT
   User: "Package all widgets"
   Mode: 📦 BAW Package Manager Mode
   Output: Custom_Widgets_1.0.80.twx in output/
   
   ↓

3. DEPLOY TO BAW
   User: "Deploy to BAW server"
   Mode: 📦 BAW Package Manager Mode
   Output: Toolkit installed in BAW
   
   ↓

4. TEST IN BAW
   User: Opens BAW Process Designer
   Action: Drag widget onto coach, bind data, test
   
   ↓

5. ITERATE (if needed)
   User: "Update the Carousel widget to add auto-rotation"
   Mode: 🎨 BAW Coach Widget Mode
   Output: Updated widget files
   
   ↓

6. REPACKAGE & REDEPLOY
   User: "Package and deploy"
   Mode: 📦 BAW Package Manager Mode
   Output: Updated toolkit in BAW
```

### Mode Handoff

**From Widget Mode to Package Manager Mode**:

```
User: "Create a Stepper widget"
Bob (Widget Mode): Creates widget files
User: "Now package it"
Bob: Switches to Package Manager Mode automatically
Bob (Package Manager): Packages and deploys
```

**Explicit Mode Switching**:

```
User: "Switch to BAW Coach Widget mode"
Bob: Activates widget creation mode

User: "Switch to BAW Package Manager mode"
Bob: Activates packaging/deployment mode
```

### Best Practices

#### 1. Use the Right Mode for the Task

**Widget Mode**:
- Creating new widgets
- Modifying widget code
- Updating documentation
- Adding preview files

**Package Manager Mode**:
- Packaging toolkits
- Deploying to BAW
- Managing versions
- Registering business objects

#### 2. Complete Widget Before Packaging

Ensure widget is complete before packaging:
- All required files created
- Documentation updated
- Preview files tested
- Business objects defined

#### 3. Test After Deployment

After deploying:
1. Verify widget appears in BAW palette
2. Test widget functionality in a coach
3. Verify data binding works
4. Check styling and animations

#### 4. Iterate Efficiently

For updates:
1. Use Widget Mode to modify files
2. Use Package Manager Mode to redeploy
3. Test changes in BAW
4. Repeat as needed

---

## Common Scenarios

### Scenario 1: Creating a New Widget

```
Step 1: Switch to Widget Mode
User: "Switch to BAW Coach Widget mode"

Step 2: Create Widget
User: "Create a Carousel widget with flip cards showing icon, title, and description"

Step 3: Review Generated Files
Bob creates complete widget structure

Step 4: Switch to Package Manager
User: "Switch to BAW Package Manager mode"

Step 5: Package and Deploy
User: "Package and deploy the toolkit"

Step 6: Test in BAW
User opens BAW Process Designer and tests widget
```

### Scenario 2: Updating an Existing Widget

```
Step 1: Use Widget Mode
User: "Update the Carousel widget to add auto-rotation feature"

Step 2: Bob Updates Files
Bob modifies inlineJavascript.js and config.json

Step 3: Package and Deploy
User: "Package and deploy"
Bob switches to Package Manager Mode and deploys
```

### Scenario 3: Batch Widget Creation

```
Step 1: Create Multiple Widgets
User: "Create a Timeline widget"
Bob (Widget Mode): Creates Timeline

User: "Create a Gauge widget"
Bob (Widget Mode): Creates Gauge

User: "Create a Calendar widget"
Bob (Widget Mode): Creates Calendar

Step 2: Package All at Once
User: "Package all widgets"
Bob (Package Manager): Discovers all 3 new widgets automatically
Bob: Packages into single toolkit
```

### Scenario 4: Troubleshooting Deployment

```
Step 1: Check Package
User: "Verify the TWX package contents"
Bob (Package Manager): Lists included widgets and business objects

Step 2: Redeploy
User: "Redeploy the toolkit"
Bob: Uploads and monitors deployment

Step 3: Check Status
User: "Check deployment status"
Bob: Reports current status and any errors
```

---

## Reference Documentation

### Widget Mode Documentation
- **Workflow**: `.bob/rules-baw-coachui-view/1_workflow.xml`
- **Best Practices**: `.bob/rules-baw-coachui-view/2_best_practices.xml`
- **Carbon Theme**: `themes/CARBON_THEME_VARIABLES.md`
- **Integration Guide**: `docs/CARBON_THEME_INTEGRATION.md`

### Package Manager Documentation
- **Configuration**: `toolkit.config.json`
- **Business Objects**: `toolkit_packager/baw_custom_types.json`
- **Coach Views**: `toolkit_packager/baw_coach_views.json`
- **Packaging Script**: `package_baw.py`

### Example Widgets
- **Timeline**: `widgets/Timeline/`
- **Stepper**: `widgets/Stepper/`
- **ProgressBar**: `widgets/ProgressBar/`
- **Breadcrumb**: `widgets/Breadcrumb/`
- **ProcessCircle**: `widgets/ProcessCircle/`

---

## Quick Reference

### Widget Mode Commands

```
"Create a [WidgetName] widget with [specifications]"
"Update the [WidgetName] widget to [changes]"
"Add preview files for [WidgetName]"
"Document the [WidgetName] widget"
"Create a business object for [WidgetName]"
```

### Package Manager Commands

```
"Package all widgets"
"Package and deploy"
"Deploy the toolkit to BAW"
"Check deployment status"
"Register business objects"
"Increment toolkit version"
```

### Mode Switching

```
"Switch to BAW Coach Widget mode"
"Switch to BAW Package Manager mode"
```

---

## Troubleshooting

### Widget Mode Issues

**Problem**: Widget not following conventions  
**Solution**: Bob automatically follows repository patterns. Check similar widgets for reference.

**Problem**: CSS not applying  
**Solution**: Ensure using hardcoded values with theme comments, not LESS variables.

**Problem**: Data binding not working  
**Solution**: For lists, use `this.getData().items`, not `this.getData()`.

### Package Manager Issues

**Problem**: Widget not included in package  
**Solution**: Ensure widget folder exists in `widgets/` directory with proper structure.

**Problem**: Business object ID conflicts  
**Solution**: Package Manager handles IDs automatically. Check `baw_custom_types.json`.

**Problem**: Deployment fails  
**Solution**: Verify BAW server connection and credentials. Check deployment status.

---

## Summary

### 🎨 BAW Coach Widget Mode
- **Purpose**: Create and modify widgets
- **Focus**: Implementation, styling, documentation
- **Output**: Complete widget file structure
- **Boundary**: Stops at widget creation, doesn't package

### 📦 BAW Package Manager Mode
- **Purpose**: Package and deploy toolkits
- **Focus**: TWX generation, deployment, version management
- **Output**: TWX packages deployed to BAW
- **Boundary**: Doesn't modify widget implementations

### Together
- **Complete Lifecycle**: From creation to deployment
- **AI-Assisted**: Automated best practices and conventions
- **Efficient**: Minutes instead of hours
- **Quality**: Consistent, accessible, well-documented widgets

---

**Version**: 1.0  
**Last Updated**: May 2026  
**IBM BAW Compatibility**: v18.0+  
**Bob Version**: Latest with BAW modes