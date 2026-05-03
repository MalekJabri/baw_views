# BAW Coach Mode - Project Structure

## Directory Organization

```
BAWCoachMode/
├── widgets/                     # All widget source code
│   ├── Breadcrumb/
│   ├── DateOutput/
│   ├── FileNetBrowser/
│   ├── FileNetImport/
│   ├── FolderTree/
│   ├── MarkdownViewer/
│   ├── MultiSelect/
│   ├── ProcessCircle/
│   ├── ProgressBar/
│   ├── Stepper/
│   └── TasksList/
├── output/                      # Generated TWX files (gitignored)
├── toolkit_packager/            # Python packaging tools
│   ├── core/                    # Core utilities (GUID, XML, hashing)
│   ├── models/                  # Data models (Widget, TWXObject)
│   ├── scanner/                 # Widget discovery & validation
│   ├── generators/              # XML generators (CoachView, ManagedAsset, etc.)
│   ├── packager/                # TWX building (TWXBuilder)
│   └── utils/                   # Registries, exceptions & logging
├── templates/                   # Reference templates
│   ├── BaseTWX/                 # Base TWX templates (25.0.1)
│   └── Loclisation/             # Localization examples
├── .bob/                        # Bob AI mode configurations
│   ├── rules-baw-coachui-view/  # Coach UI View mode rules
│   └── rules-baw-package-manager/ # Package Manager mode rules
├── toolkit.config.json          # Main toolkit configuration
├── package_multiple_widgets.py  # Main packaging script
└── create_widget_template.py    # Widget generator tool
```

## Widget Structure

Each widget in `widgets/` follows this structure:

```
WidgetName/
├── WidgetName.svg               # OPTIONAL - Widget icon (120x120px)
├── widget/
│   ├── Layout.html              # REQUIRED - HTML structure
│   ├── InlineCSS.css            # REQUIRED - Widget styles
│   ├── inlineJavascript.js      # REQUIRED - Widget logic
│   ├── config.json              # REQUIRED - Widget configuration
│   ├── datamodel.md             # OPTIONAL - Data model documentation
│   ├── eventHandler.md          # OPTIONAL - Event handler documentation
|   └── events/
│       └── change.js          # Optional - Code trigger on the data or option change to the widget

|                 
├── AdvancePreview/              # OPTIONAL - Preview for BAW designer
│   ├── WidgetName.html
│   └── WidgetName.js (or WidgetNameSnippet.js)
└── README.md                    # RECOMMENDED - Widget documentation
```

### Widget Icons
- Place `{WidgetName}.svg` in widget root directory
- Automatically detected and packaged
- Appears in BAW Process Designer palette
- Recommended size: 120x120 pixels

## Configuration

The `toolkit.config.json` file contains toolkit metadata:

```json
{
  "name": "Custom Widgets",
  "version": "1.0.28",
  "shortName": "CW",
  "description": "Custom widget toolkit for BAW",
  "toolkitId": "2066.cebc1c06-68a5-4d2e-986a-aaae3072ceeb"
}
```

Widgets are **automatically detected** from the `widgets/` directory - no manual configuration needed!

## Usage

### Package All Widgets
```bash
# Automatically detects and packages all widgets
python3 package_multiple_widgets.py
```

### Create New Widget
```bash
# Generate widget template with proper structure
python3 create_widget_template.py MyWidget "Widget description"
```

## Output

Generated TWX files are saved to `output/` directory with automatic version incrementing.

## Registries

The toolkit maintains registries for stable ID generation:

- **`toolkit_packager/baw_coach_views.json`**: Tracks coach view IDs, icon IDs, preview IDs
- **`toolkit_packager/baw_custom_types.json`**: Tracks business object IDs
- **`toolkit_packager/baw_type_mappings.json`**: Maps BAW types to class IDs

These ensure consistent IDs across packaging operations for proper version control.
