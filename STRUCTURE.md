# BAW Coach Mode - Project Structure

## Directory Organization

```
BAWCoachMode/
├── widgets/              # All widget source code
│   ├── Breadcrumb/
│   ├── DateOutput/
│   ├── Stepper/
│   └── ...
├── output/              # Generated TWX files (gitignored)
├── toolkit_packager/    # Python packaging tools
│   ├── core/           # Core utilities (GUID, XML, hashing)
│   ├── models/         # Data models
│   ├── scanner/        # Widget discovery & validation
│   ├── generators/     # XML generators
│   ├── packager/       # File mapping & TWX building
│   └── utils/          # Exceptions & logging
├── templates/          # Reference templates
│   ├── BaseTWX/       # Base TWX templates
│   └── Loclisation/   # Localization examples
├── docs/              # Documentation
├── toolkit.config.json # Main configuration
├── example_usage.py   # Usage examples
└── test_two_widgets_packaging.py # Test scripts
```

## Widget Structure

Each widget in `widgets/` follows this structure:

```
WidgetName/
├── widget/
│   ├── Layout.html
│   ├── InlineCSS.css
│   ├── inlineJavascript.js
│   ├── WidgetName.json (or openapi.json)
│   ├── datamodel.md (optional)
│   └── eventHandler.md (optional)
└── AdvancePreview/
    ├── WidgetName.html
    └── WidgetName.js
```

## Configuration

Update `toolkit.config.json` to specify which widgets to package:

```json
{
  "widgets": {
    "include": ["*"],
    "exclude": []
  }
}
```

## Usage

```bash
# Scan widgets
python3 example_usage.py

# Package specific widgets
python3 test_two_widgets_packaging.py
```

## Output

Generated TWX files are saved to `output/` directory.
