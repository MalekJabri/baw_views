#!/usr/bin/env python3
"""
Create a new BAW Coach Widget with the correct structure for toolkit_packager.

This script generates all required files with proper templates to ensure
compatibility with the BAW Package Manager toolkit_packager system.

Usage:
    python3 create_widget_template.py WidgetName "Widget description" [--events load,change,view]
    
Options:
    --events: Comma-separated list of event handlers to create (load, change, view, validate, unload)
              If not specified, only creates the events folder without any event files.
              Use 'all' to create all event handlers.

Examples:
    # Create widget with no event handlers
    python3 create_widget_template.py MyWidget "A simple widget"
    
    # Create widget with load and change events
    python3 create_widget_template.py MyWidget "A widget" --events load,change
    
    # Create widget with all event handlers
    python3 create_widget_template.py MyWidget "A widget" --events all
"""

import sys
import json
from pathlib import Path
from datetime import datetime


def create_widget_structure(widget_name: str, description: str = "", events = None):
    """Create a complete widget directory structure with all required files.
    
    Args:
        widget_name: Name of the widget (PascalCase)
        description: Widget description
        events: List of event handlers to create (load, change, view, validate, unload)
                If None or empty, only creates the events folder
    """
    
    if events is None:
        events = []
    
    if not widget_name:
        print("❌ Error: Widget name is required")
        return False
    
    # Validate widget name (PascalCase)
    if not widget_name[0].isupper():
        print("⚠️  Warning: Widget name should be PascalCase (e.g., MyWidget)")
    
    base_path = Path("widgets") / widget_name
    widget_path = base_path / "widget"
    preview_path = base_path / "AdvancePreview"
    
    # Check if widget already exists
    if base_path.exists():
        print(f"❌ Error: Widget '{widget_name}' already exists at {base_path}")
        return False
    
    print(f"📦 Creating widget: {widget_name}")
    print(f"📁 Location: {base_path}")
    print()
    
    # Create directories
    widget_path.mkdir(parents=True, exist_ok=True)
    events_path = widget_path / "events"
    events_path.mkdir(parents=True, exist_ok=True)
    preview_path.mkdir(parents=True, exist_ok=True)
    
    # 1. Create Layout.html
    layout_html = f"""<div class="{widget_name.lower()}-container">
  <div class="{widget_name.lower()}-content">
    <!-- Widget content goes here -->
    <p>{{{{data.message}}}}</p>
  </div>
</div>"""
    
    (widget_path / "Layout.html").write_text(layout_html)
    print("✓ Created Layout.html")
    
    # 2. Create InlineCSS.css
    inline_css = f""".{widget_name.lower()}-container {{
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
}}

.{widget_name.lower()}-content {{
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  font-family: Arial, sans-serif;
}}

.{widget_name.lower()}-content p {{
  margin: 0;
  color: #333;
  font-size: 14px;
}}"""
    
    (widget_path / "InlineCSS.css").write_text(inline_css)
    print("✓ Created InlineCSS.css")
    
    # 3. Create inlineJavascript.js
    inline_js = f"""// {widget_name} Widget JavaScript
var cv = this;

// Initialize widget
function init() {{
  var data = cv.getData();
  var options = cv.getOption();
  
  // Get container element
  var container = cv.context.element.querySelector('.{widget_name.lower()}-container');
  
  if (container) {{
    // Initialize widget logic here
    console.log('{widget_name} initialized', data);
  }}
}}

// Register event handlers
cv.registerEventHandlingFunction(cv, "onChange", "data");

// Event handler for data changes
function onChange(event) {{
  var data = cv.getData();
  console.log('{widget_name} data changed:', data);
  
  // Update UI based on data changes
  render();
}}

// Render function
function render() {{
  var data = cv.getData();
  var container = cv.context.element.querySelector('.{widget_name.lower()}-content');
  
  if (container && data) {{
    // Update widget display
    var message = data.message || 'No message';
    container.querySelector('p').textContent = message;
  }}
}}

// Initialize on load
init();"""
    
    (widget_path / "inlineJavascript.js").write_text(inline_js)
    print("✓ Created inlineJavascript.js")
    
    # 4. Create openapi.json
    openapi_schema = {
        "openapi": "3.0.0",
        "info": {
            "title": f"{widget_name} Widget",
            "version": "1.0.0",
            "description": description or f"Custom {widget_name} widget for BAW"
        },
        "components": {
            "schemas": {
                f"{widget_name}Data": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string",
                            "description": "Message to display in the widget",
                            "default": "Hello from " + widget_name
                        }
                    },
                    "required": ["message"]
                }
            }
        }
    }
    
    (widget_path / "openapi.json").write_text(json.dumps(openapi_schema, indent=2))
    print("✓ Created openapi.json")
    
    # 5. Create datamodel.md (optional)
    datamodel_md = f"""# {widget_name} Data Model

## Business Data

The widget expects data in the following structure:

```javascript
{{
  "message": "String"
}}
```

### Properties

- **message** (string, required): The message to display in the widget
  - Default: "Hello from {widget_name}"
  - Example: "Welcome to the application"

## Configuration Options

Add configuration options here as needed.

## Events

- **onChange**: Triggered when the data changes
"""
    
    (widget_path / "datamodel.md").write_text(datamodel_md)
    print("✓ Created datamodel.md")
    
    # 6. Create eventHandler.md (optional)
    event_handler_md = f"""# {widget_name} Event Handlers

## Available Events

### load
Executed when the widget is first loaded.

```javascript
// Initialize widget state
var data = this.getData();
console.log('Widget loaded with data:', data);
```

### change
Executed when the widget data changes.

```javascript
// Handle data changes
var newData = this.getData();
console.log('Data changed:', newData);
// Update UI accordingly
```

### view
Executed when the widget becomes visible.

```javascript
// Refresh widget display
render();
```

### validate
Executed during form validation.

```javascript
// Validate widget data
var data = this.getData();
if (!data.message) {{
  return {{
    valid: false,
    message: "Message is required"
  }};
}}
return {{ valid: true }};
```

### unload
Executed when the widget is being removed.

```javascript
// Cleanup resources
console.log('Widget unloading');
```
"""
    
    (widget_path / "eventHandler.md").write_text(event_handler_md)
    print("✓ Created eventHandler.md")
    
    # 7. Create event handler JavaScript files (optional, based on requirements)
    events_created = []
    
    if 'load' in events:
        # load.js - Executed when widget is first loaded
        load_event_js = f"""// {widget_name} - Load Event Handler
// Executed when the widget is first loaded
var _this = this;

// Initialize widget
var data = _this.getData();
var options = _this.getOption();

console.log('{widget_name} widget loaded', data);

// Register any custom event handlers
// Example: bpmext.ui.registerEventHandlingFunction(this, "CustomEvent", "eventName");

// Perform initial rendering or setup
// render();
"""
        (events_path / "load.js").write_text(load_event_js)
        events_created.append("load.js")
        print("✓ Created events/load.js")
    
    if 'change' in events:
        # change.js - Executed when widget data changes
        change_event_js = f"""// {widget_name} - Change Event Handler
// Executed when the widget data changes
var _this = this;

// Get the updated data
var data = _this.getData();

console.log('{widget_name} data changed:', data);

// Update the widget display based on new data
// render();
"""
        (events_path / "change.js").write_text(change_event_js)
        events_created.append("change.js")
        print("✓ Created events/change.js")
    
    if 'view' in events:
        # view.js - Executed when widget becomes visible
        view_event_js = f"""// {widget_name} - View Event Handler
// Executed when the widget becomes visible
var _this = this;

// Refresh widget display
var data = _this.getData();

console.log('{widget_name} widget now visible');

// Re-render or refresh the widget
// render();
"""
        (events_path / "view.js").write_text(view_event_js)
        events_created.append("view.js")
        print("✓ Created events/view.js")
    
    if 'validate' in events:
        # validate.js - Executed during form validation
        validate_event_js = f"""// {widget_name} - Validate Event Handler
// Executed during form validation
var _this = this;

// Get current data
var data = _this.getData();

// Perform validation logic
var isValid = true;
var errorMessage = "";

// Example validation
if (!data || !data.message) {{
    isValid = false;
    errorMessage = "Message is required";
}}

// Return validation result
if (!isValid) {{
    console.error('{widget_name} validation failed:', errorMessage);
    // You can set error state on the widget
    // _this.context.element.classList.add('validation-error');
}}

// Return true if valid, false if invalid
return isValid;
"""
        (events_path / "validate.js").write_text(validate_event_js)
        events_created.append("validate.js")
        print("✓ Created events/validate.js")
    
    if 'unload' in events:
        # unload.js - Executed when widget is being removed
        unload_event_js = f"""// {widget_name} - Unload Event Handler
// Executed when the widget is being removed or destroyed
var _this = this;

console.log('{widget_name} widget unloading');

// Cleanup resources
// - Remove event listeners
// - Clear timers/intervals
// - Release memory references
// - Unregister custom handlers

// Example cleanup:
// if (window.myWidgetTimer) {{
//     clearInterval(window.myWidgetTimer);
// }}
"""
        (events_path / "unload.js").write_text(unload_event_js)
        events_created.append("unload.js")
        print("✓ Created events/unload.js")
    
    # Print summary of created events
    if events_created:
        print(f"✓ Created {len(events_created)} event handler(s): {', '.join(events_created)}")
    else:
        print("ℹ️  No event handlers created (events folder is ready for custom events)")
    
    # 8. Create config.json for widget configuration
    config_json = {
        "name": widget_name,
        "description": description or f"Custom {widget_name} widget for IBM Business Automation Workflow",
        "bindingType": {
            "name": f"{widget_name}Data",
            "isList": False,
            "type": "String"
        },
        "configOptions": [],
        "businessObjects": [],
        "changeFunction": True
    }
    
    (widget_path / "config.json").write_text(json.dumps(config_json, indent=2))
    print("✓ Created config.json")
    
    # 9. Create Preview HTML (optional)
    preview_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{widget_name} Preview</title>
  <style>
    body {{
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f0f0f0;
    }}
    .preview-container {{
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }}
    h1 {{
      color: #333;
      margin-top: 0;
    }}
  </style>
</head>
<body>
  <div class="preview-container">
    <h1>{widget_name} Widget Preview</h1>
    <div id="widget-preview"></div>
  </div>
  
  <script src="{widget_name}.js"></script>
</body>
</html>"""
    
    (preview_path / f"{widget_name}.html").write_text(preview_html)
    print("✓ Created AdvancePreview HTML")
    
    # 8. Create Preview JavaScript (optional)
    preview_js = f"""// {widget_name} Preview JavaScript
(function() {{
  'use strict';
  
  // Sample data for preview
  var sampleData = {{
    message: "This is a preview of the {widget_name} widget"
  }};
  
  // Render preview
  function renderPreview() {{
    var container = document.getElementById('widget-preview');
    
    // Create widget HTML
    var widgetHTML = `
      <div class="{widget_name.lower()}-container">
        <div class="{widget_name.lower()}-content">
          <p>${{sampleData.message}}</p>
        </div>
      </div>
    `;
    
    container.innerHTML = widgetHTML;
  }}
  
  // Initialize preview on load
  window.addEventListener('DOMContentLoaded', renderPreview);
}})();"""
    
    (preview_path / f"{widget_name}.js").write_text(preview_js)
    print("✓ Created AdvancePreview JavaScript")
    
    # 9. Create README.md
    readme_md = f"""# {widget_name} Widget

{description or f"Custom {widget_name} widget for IBM Business Automation Workflow (BAW)"}

## Overview

This widget provides [describe functionality here].

## Features

- Feature 1
- Feature 2
- Feature 3

## Data Model

See [datamodel.md](widget/datamodel.md) for complete data model documentation.

### Basic Structure

```javascript
{{
  "message": "Hello from {widget_name}"
}}
```

## Configuration

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| message | string | Yes | "Hello from {widget_name}" | Message to display |

## Events

See [eventHandler.md](widget/eventHandler.md) for event handler documentation.

- **onChange**: Triggered when data changes

## Usage Example

```javascript
// Set widget data
widget.setData({{
  message: "Welcome to the application"
}});
```

## Preview

Open `AdvancePreview/{widget_name}.html` in a browser to see the widget preview.

## Packaging

To include this widget in a BAW toolkit package:

1. Add `"{widget_name}"` to the `WIDGET_NAMES` list in `package_multiple_widgets.py`
2. Run: `python3 package_multiple_widgets.py`
3. Import the generated TWX file from `output/` directory into BAW

## Architecture

```mermaid
graph TD
    A[BAW Coach View] --> B[{widget_name} Widget]
    B --> C[Layout.html]
    B --> D[InlineCSS.css]
    B --> E[inlineJavascript.js]
    B --> F[Data Model]
    F --> G[openapi.json]
```

## Development

### File Structure

```
widgets/{widget_name}/
├── widget/
│   ├── Layout.html           # Widget HTML structure
│   ├── InlineCSS.css         # Widget styles
│   ├── inlineJavascript.js   # Widget logic
│   ├── config.json           # Widget configuration
│   ├── openapi.json          # Data model schema
│   ├── datamodel.md          # Data model documentation
│   ├── eventHandler.md       # Event handler documentation
│   └── events/               # BAW event handlers
│       ├── load.js           # Load event
│       ├── change.js         # Change event
│       ├── view.js           # View event
│       ├── validate.js       # Validate event
│       └── unload.js         # Unload event
├── AdvancePreview/
│   ├── {widget_name}.html    # Preview HTML
│   └── {widget_name}.js      # Preview JavaScript
└── README.md                 # This file
```

## Version History

- **1.0.0** ({datetime.now().strftime('%Y-%m-%d')}): Initial release

## License

[Add license information]

## Author

[Add author information]
"""
    
    (base_path / "README.md").write_text(readme_md)
    print("✓ Created README.md")
    
    print()
    print("=" * 70)
    print(f"✅ Widget '{widget_name}' created successfully!")
    print()
    print("📂 Structure:")
    print(f"   {base_path}/")
    print(f"   ├── widget/")
    print(f"   │   ├── Layout.html")
    print(f"   │   ├── InlineCSS.css")
    print(f"   │   ├── inlineJavascript.js")
    print(f"   │   ├── config.json")
    print(f"   │   ├── openapi.json")
    print(f"   │   ├── datamodel.md")
    print(f"   │   ├── eventHandler.md")
    print(f"   │   └── events/")
    if events_created:
        for event_file in events_created:
            is_last = event_file == events_created[-1]
            prefix = "└──" if is_last else "├──"
            print(f"   │       {prefix} {event_file}")
    else:
        print(f"   │       (empty - add event handlers as needed)")
    print(f"   ├── AdvancePreview/")
    print(f"   │   ├── {widget_name}.html")
    print(f"   │   └── {widget_name}.js")
    print(f"   └── README.md")
    print()
    print("📝 Next Steps:")
    print(f"   1. Edit the widget files in {widget_path}/")
    print(f"   2. Customize the data model in openapi.json")
    print(f"   3. Test the preview in AdvancePreview/{widget_name}.html")
    print(f"   4. Add '{widget_name}' to package_multiple_widgets.py")
    print(f"   5. Run: python3 package_multiple_widgets.py")
    print("=" * 70)
    
    return True


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: python3 create_widget_template.py WidgetName [description] [--events event1,event2,...]")
        print()
        print("Options:")
        print("  --events: Comma-separated list of event handlers to create")
        print("            Available: load, change, view, validate, unload")
        print("            Use 'all' to create all event handlers")
        print()
        print("Examples:")
        print('  python3 create_widget_template.py MyWidget "A custom widget"')
        print('  python3 create_widget_template.py MyWidget "A widget" --events load,change')
        print('  python3 create_widget_template.py MyWidget "A widget" --events all')
        sys.exit(1)
    
    widget_name = sys.argv[1]
    description = ""
    events = []
    
    # Parse arguments
    i = 2
    while i < len(sys.argv):
        arg = sys.argv[i]
        if arg == "--events":
            if i + 1 < len(sys.argv):
                events_arg = sys.argv[i + 1]
                if events_arg.lower() == "all":
                    events = ["load", "change", "view", "validate", "unload"]
                else:
                    events = [e.strip().lower() for e in events_arg.split(",")]
                    # Validate event names
                    valid_events = ["load", "change", "view", "validate", "unload"]
                    invalid = [e for e in events if e not in valid_events]
                    if invalid:
                        print(f"❌ Error: Invalid event name(s): {', '.join(invalid)}")
                        print(f"   Valid events: {', '.join(valid_events)}")
                        sys.exit(1)
                i += 2
            else:
                print("❌ Error: --events requires a value")
                sys.exit(1)
        elif not description and not arg.startswith("--"):
            description = arg
            i += 1
        else:
            i += 1
    
    success = create_widget_structure(widget_name, description, events)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

# Made with Bob
