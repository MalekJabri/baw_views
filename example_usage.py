#!/usr/bin/env python3
"""
Example usage of the BAW Toolkit Packager.

This script demonstrates how to use the toolkit packager to:
1. Scan for widgets in a project
2. Validate widget structure
3. Generate GUIDs for TWX objects
4. Work with configuration
"""

from pathlib import Path
from toolkit_packager import (
    scan_project,
    validate_widgets,
    generate_guid,
    generate_object_id,
    setup_logger,
    ToolkitConfig,
)
from toolkit_packager.config import load_config, create_default_config_file

# Setup logging
setup_logger(name="example", level=20)  # INFO level


def example_1_scan_widgets():
    """Example 1: Scan project for widgets."""
    print("\n" + "="*60)
    print("Example 1: Scanning for Widgets")
    print("="*60)
    
    project_path = Path("widgets")
    widgets = scan_project(project_path)
    
    print(f"\nFound {len(widgets)} widgets:")
    for widget in widgets:
        print(f"  - {widget.name}")
        print(f"    Path: {widget.path}")
        print(f"    Files: {len(widget.files)}")
        print(f"    Has preview: {widget.has_preview_files()}")


def example_2_validate_widgets():
    """Example 2: Validate widgets."""
    print("\n" + "="*60)
    print("Example 2: Validating Widgets")
    print("="*60)
    
    project_path = Path("widgets")
    widgets = scan_project(project_path)
    
    if not widgets:
        print("\nNo widgets found to validate.")
        return
    
    results = validate_widgets(widgets)
    
    print(f"\nValidation Results:")
    print("-" * 60)
    
    for result in results:
        status = "✓" if result.is_valid else "✗"
        print(f"\n{status} {result.widget_name}")
        
        if result.errors:
            print("  Errors:")
            for error in result.errors:
                print(f"    - {error}")
        
        if result.warnings:
            print("  Warnings:")
            for warning in result.warnings:
                print(f"    - {warning}")
    
    # Summary
    valid_count = sum(1 for r in results if r.is_valid)
    print(f"\nSummary: {valid_count}/{len(results)} widgets valid")


def example_3_generate_guids():
    """Example 3: Generate GUIDs for TWX objects."""
    print("\n" + "="*60)
    print("Example 3: Generating GUIDs")
    print("="*60)
    
    widget_name = "Breadcrumb"
    
    # Generate various object IDs
    coach_view_id = generate_object_id(widget_name, "64")
    business_object_id = generate_object_id(widget_name, "12")
    managed_asset_id = generate_object_id(widget_name, "61")
    
    print(f"\nGenerated IDs for widget '{widget_name}':")
    print(f"  Coach View (64):      {coach_view_id}")
    print(f"  Business Object (12): {business_object_id}")
    print(f"  Managed Asset (61):   {managed_asset_id}")
    
    # Demonstrate deterministic generation
    print(f"\nDeterministic generation (same seed = same GUID):")
    guid1 = generate_guid("test-seed")
    guid2 = generate_guid("test-seed")
    print(f"  GUID 1: {guid1}")
    print(f"  GUID 2: {guid2}")
    print(f"  Match:  {guid1 == guid2}")


def example_4_configuration():
    """Example 4: Work with configuration."""
    print("\n" + "="*60)
    print("Example 4: Configuration")
    print("="*60)
    
    # Try to load existing config
    try:
        config = load_config()
        print(f"\nLoaded configuration:")
        print(f"  Name: {config.name}")
        print(f"  Version: {config.version}")
        print(f"  Short Name: {config.short_name}")
        print(f"  Description: {config.description}")
        
        # Show widget filters
        print(f"\nWidget Filters:")
        print(f"  Include: {config.widgets.include}")
        print(f"  Exclude: {config.widgets.exclude}")
        
    except Exception as e:
        print(f"\nNo configuration file found: {e}")
        print("Using default configuration")
        
        # Create default config
        config = ToolkitConfig()
        print(f"\nDefault configuration:")
        print(f"  Name: {config.name}")
        print(f"  Version: {config.version}")


def example_5_widget_details():
    """Example 5: Get detailed widget information."""
    print("\n" + "="*60)
    print("Example 5: Widget Details")
    print("="*60)
    
    project_path = Path("widgets")
    widgets = scan_project(project_path)
    
    if not widgets:
        print("\nNo widgets found.")
        return
    
    # Show details for first widget
    widget = widgets[0]
    print(f"\nDetailed information for: {widget.name}")
    print("-" * 60)
    
    print(f"\nPaths:")
    print(f"  Widget directory: {widget.widget_path}")
    print(f"  Preview directory: {widget.preview_path}")
    
    print(f"\nFiles:")
    for filename, filepath in widget.files.items():
        size = filepath.stat().st_size if filepath.exists() else 0
        print(f"  - {filename} ({size} bytes)")
    
    # Try to read widget schema
    try:
        schema = widget.get_json_schema()
        print(f"\nJSON Schema:")
        if 'openapi' in schema:
            print(f"  OpenAPI version: {schema.get('openapi')}")
        if 'info' in schema:
            print(f"  Title: {schema['info'].get('title', 'N/A')}")
            print(f"  Version: {schema['info'].get('version', 'N/A')}")
    except Exception as e:
        print(f"\nCould not read JSON schema: {e}")


def main():
    """Run all examples."""
    print("\n" + "="*60)
    print("BAW Toolkit Packager - Example Usage")
    print("="*60)
    
    try:
        example_1_scan_widgets()
        example_2_validate_widgets()
        example_3_generate_guids()
        example_4_configuration()
        example_5_widget_details()
        
        print("\n" + "="*60)
        print("All examples completed successfully!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error running examples: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()

# Made with Bob
