#!/usr/bin/env python3
"""
Example usage of the new toolkit_packager API with backported components.
Demonstrates how to use the generic generators and TWXBuilder.
"""

from pathlib import Path
from toolkit_packager import (
    load_config,
    scan_project,
    TWXBuilder,
    CoachViewGenerator,
    ManagedAssetGenerator,
    get_logger,
    setup_logger,
)

# Setup logging
import logging
setup_logger(level=logging.INFO)
logger = get_logger(__name__)


def package_single_widget(widget_name: str):
    """
    Package a single widget using the new API.
    
    Args:
        widget_name: Name of the widget to package
    """
    logger.info(f"Packaging widget: {widget_name}")
    
    # Load configuration
    config = load_config(Path("toolkit.config.json"))
    logger.info(f"Loaded config: {config.name} v{config.version}")
    
    # Scan for the specific widget
    widgets_dir = Path("widgets")
    widget_path = widgets_dir / widget_name
    
    if not widget_path.exists():
        logger.error(f"Widget not found: {widget_path}")
        return None
    
    # Scan the widget
    widgets = scan_project(widgets_dir)
    target_widget = None
    
    for widget in widgets:
        if widget.name == widget_name:
            target_widget = widget
            break
    
    if not target_widget:
        logger.error(f"Widget '{widget_name}' not found in scan results")
        return None
    
    logger.info(f"Found widget: {target_widget}")
    
    # Create TWX builder
    builder = TWXBuilder(
        config=config,
        template_dir=Path("templates/BaseTWX/25.0.1"),
        output_dir=Path("output")
    )
    
    # Add widget and build
    builder.add_widget(target_widget)
    
    try:
        output_path = builder.build()
        logger.info(f"✅ Package created successfully: {output_path}")
        logger.info(f"📦 Size: {output_path.stat().st_size / 1024:.2f} KB")
        return output_path
    except Exception as e:
        logger.error(f"❌ Failed to create package: {e}")
        import traceback
        traceback.print_exc()
        return None


def package_multiple_widgets(widget_names: list):
    """
    Package multiple widgets into a single TWX file.
    
    Args:
        widget_names: List of widget names to package
    """
    logger.info(f"Packaging {len(widget_names)} widgets: {', '.join(widget_names)}")
    
    # Load configuration
    config = load_config(Path("toolkit.config.json"))
    
    # Scan for widgets
    widgets_dir = Path("widgets")
    all_widgets = scan_project(widgets_dir)
    
    # Filter to requested widgets
    target_widgets = [w for w in all_widgets if w.name in widget_names]
    
    if len(target_widgets) != len(widget_names):
        found_names = [w.name for w in target_widgets]
        missing = set(widget_names) - set(found_names)
        logger.warning(f"Some widgets not found: {missing}")
    
    if not target_widgets:
        logger.error("No widgets found to package")
        return None
    
    # Create TWX builder
    builder = TWXBuilder(
        config=config,
        template_dir=Path("templates/BaseTWX/25.0.1"),
        output_dir=Path("output")
    )
    
    # Add all widgets
    for widget in target_widgets:
        builder.add_widget(widget)
        logger.info(f"Added widget: {widget.name}")
    
    try:
        output_path = builder.build()
        logger.info(f"✅ Multi-widget package created: {output_path}")
        logger.info(f"📦 Size: {output_path.stat().st_size / 1024:.2f} KB")
        return output_path
    except Exception as e:
        logger.error(f"❌ Failed to create package: {e}")
        import traceback
        traceback.print_exc()
        return None


def demonstrate_generators():
    """
    Demonstrate using individual generators directly.
    """
    logger.info("Demonstrating individual generators...")
    
    # Scan for a widget
    widgets = scan_project(Path("widgets"))
    if not widgets:
        logger.error("No widgets found")
        return
    
    widget = widgets[0]
    logger.info(f"Using widget: {widget.name}")
    
    # Generate object IDs
    from toolkit_packager.core import generate_object_id
    object_ids = {
        'coach_view_id': generate_object_id(widget.name, '64'),
        'preview_html_id': generate_object_id(f'{widget.name}_preview_html', '61'),
        'preview_js_id': generate_object_id(f'{widget.name}_preview_js', '61'),
    }
    
    logger.info(f"Generated IDs: {object_ids}")
    
    # Use CoachViewGenerator
    openapi_schema = widget.get_openapi_schema() if widget.has_openapi_schema() else None
    coach_view_gen = CoachViewGenerator(widget, object_ids, openapi_schema)
    coach_view_obj = coach_view_gen.generate()
    
    logger.info(f"Generated Coach View: {coach_view_obj.id}")
    logger.info(f"XML length: {len(coach_view_obj.xml_content)} bytes")
    
    # Use ManagedAssetGenerator
    if widget.has_preview_files():
        asset_gen = ManagedAssetGenerator(widget, object_ids)
        assets = asset_gen.generate()
        
        logger.info(f"Generated {len(assets)} managed assets:")
        for asset in assets:
            logger.info(f"  - {asset.name} ({asset.id})")
    else:
        logger.info("Widget has no preview files")


if __name__ == "__main__":
    import sys
    
    print("=" * 60)
    print("BAW Toolkit Packager - New API Example")
    print("=" * 60)
    print()
    
    if len(sys.argv) > 1:
        # Package specific widget(s) from command line
        widget_names = sys.argv[1:]
        
        if len(widget_names) == 1:
            package_single_widget(widget_names[0])
        else:
            package_multiple_widgets(widget_names)
    else:
        # Demo mode - show all capabilities
        print("Demo Mode - No widgets specified")
        print()
        
        # Example 1: Single widget
        print("\n📦 Example 1: Package single widget")
        print("-" * 60)
        package_single_widget("DateOutput")
        
        # Example 2: Multiple widgets
        print("\n📦 Example 2: Package multiple widgets")
        print("-" * 60)
        package_multiple_widgets(["DateOutput", "Breadcrumb"])
        
        # Example 3: Direct generator usage
        print("\n🔧 Example 3: Using generators directly")
        print("-" * 60)
        demonstrate_generators()
        
        print("\n" + "=" * 60)
        print("✅ Demo completed!")
        print("=" * 60)
        print()
        print("Usage:")
        print("  python example_usage_new_api.py                    # Run demo")
        print("  python example_usage_new_api.py DateOutput         # Package one widget")
        print("  python example_usage_new_api.py DateOutput Breadcrumb  # Package multiple")

# Made with Bob