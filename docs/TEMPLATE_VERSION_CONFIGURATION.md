# Template Version Configuration

## Overview

The BAW toolkit packager now supports configurable template versions, allowing you to package toolkits for different BAW versions.

## Default Version

The default template version is **25.0.1**. This will be used if no version is specified.

## Available Template Versions

Currently available template versions in `templates/BaseTWX/`:
- **24.0.1**
- **25.0.1** (default)
- **IC_12052026_1704** (extracted custom interfaces)

## Usage

### Interactive Mode (Recommended)

When you run the script without arguments, it will prompt you to select the template version:

```bash
python package_baw.py
```

You'll see:
```
======================================================================
BAW Toolkit Packager - Template Version Selection
======================================================================

Available BAW template versions:
  1. BAW 24.0.1
  2. BAW 25.0.1 (default)

Select template version (1/2) [2]:
```

Simply enter `1` for 24.0.1 or `2` (or press Enter) for 25.0.1.

### Non-Interactive Mode

#### Use Default Version (25.0.1)

```bash
python package_baw.py --no-prompt
```

#### Use Specific Version

```bash
# Use version 24.0.1
python package_baw.py --template-version 24.0.1

# Short form
python package_baw.py -t 24.0.1
```

### Help

```bash
python package_baw.py --help
```

## How It Works

### 1. Command Line Interface (`package_baw.py`)

The script accepts a `--template-version` (or `-t`) argument:

```python
python package_baw.py --template-version 25.0.1
```

If not specified, it defaults to `24.0.1`.

### 2. Template Directory Resolution

The script constructs the template path dynamically:

```python
template_dir = Path(f"templates/BaseTWX/{template_version}")
```

### 3. Validation

Before packaging, the script validates that the template directory exists:

```python
if not template_dir.exists():
    logger.error(f"❌ Template directory not found: {template_dir}")
    logger.error(f"   Available versions: {', '.join([d.name for d in Path('templates/BaseTWX').iterdir() if d.is_dir()])}")
    return None
```

### 4. TWXBuilder Integration

The template directory is passed to `TWXBuilder`:

```python
builder = TWXBuilder(
    config=config,
    template_dir=template_dir,  # Dynamic template path
    output_dir=OUTPUT_DIR
)
```

## Adding New Template Versions

To add support for a new BAW version:

1. Extract or create the template structure in `templates/BaseTWX/`:
   ```
   templates/BaseTWX/
   ├── 24.0.1/
   ├── 25.0.1/
   └── 26.0.1/  # New version
       ├── META-INF/
       ├── objects/
       ├── files/
       └── toolkits/
   ```

2. Use the new version:
   ```bash
   python package_baw.py --template-version 26.0.1
   ```

## Template Structure Requirements

Each template version directory must contain:

```
{version}/
├── META-INF/
│   ├── MANIFEST.MF
│   ├── metadata.xml
│   ├── package.xml
│   └── properties.json
├── objects/
│   ├── 62.*.xml  (Environment Variables)
│   └── 63.*.xml  (Toolkit Settings)
├── files/
│   └── (managed asset files)
└── toolkits/
    └── *.zip  (dependency toolkits)
```

## Benefits

1. **Version Flexibility**: Package toolkits for different BAW versions
2. **Backward Compatibility**: Support older BAW installations
3. **Testing**: Test against multiple BAW versions
4. **Migration**: Easier migration between BAW versions

## Examples

### Package for BAW 25.0.1 (default)
```bash
python package_baw.py
```

### Package for BAW 24.0.1
```bash
python package_baw.py -t 24.0.1
```

### Package with custom template
```bash
python package_baw.py --template-version IC_12052026_1704
```

## Programmatic Usage

You can also use the template version parameter programmatically:

```python
from package_baw import main

# Use default version (25.0.1)
result = main()

# Use specific version
result = main(template_version="24.0.1")
```

## Notes

- The template version only affects the base template structure
- Widget definitions remain version-independent
- Business objects and coaches are version-independent
- The toolkit configuration (`toolkit.config.json`) is shared across versions