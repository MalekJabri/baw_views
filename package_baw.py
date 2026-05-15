#!/usr/bin/env python3
"""
Package BAW artifacts (widgets, business objects, coaches) into a TWX toolkit.

This script packages all BAW artifacts into a single TWX file:
- Custom widgets from widgets/
- Standalone business objects from business-objects/generated/
- Coaches from coaches/

The TWXBuilder automatically discovers and includes all artifacts.
"""

import logging
import argparse
from pathlib import Path
from toolkit_packager import (
    load_config,
    scan_project,
    TWXBuilder,
    setup_logger,
    get_logger,
)
from toolkit_packager.utils import increment_toolkit_version

# Configuration
WIDGET_NAMES = [
    "Breadcrumb",
    "Carousel",
    "DateOutput",
    "FileNetBrowser",
    "FileNetImport",
    "FolderTree",
    "MarkdownViewer",
    "MultiDocumentUpload",
    "MultiSelect",
    "ProcessCircle",
    "ProgressBar",
    "Stepper",
    "TasksList",
    "Timeline"
]
WIDGETS_DIR = Path("widgets")
OUTPUT_DIR = Path("output")
CONFIG_FILE = Path("toolkit.config.json")

# Setup logging
setup_logger(level=logging.INFO)
logger = get_logger(__name__)


def main():
    """
    Main packaging function for BAW artifacts (widgets, business objects, coaches).
    Template version is read from toolkit.config.json.
    """
    try:
        logger.info(f"📦 Packaging BAW Toolkit with {len(WIDGET_NAMES)} widgets")
        logger.info(f"   Widgets: {', '.join(WIDGET_NAMES)}")
        logger.info(f"   + Standalone business objects from business-objects/generated/")
        logger.info(f"   + Coaches from coaches/")
        print("=" * 70)
        
        # Auto-increment version before packaging
        logger.info("🔢 Auto-incrementing toolkit version...")
        old_version, new_version = increment_toolkit_version(CONFIG_FILE, increment_type="patch")
        logger.info(f"✓ Version updated: {old_version} → {new_version}")
        
        # Load configuration (with updated version)
        logger.info("📄 Loading configuration...")
        config = load_config(CONFIG_FILE)
        logger.info(f"✓ Config loaded: {config.name} v{config.version}")
        logger.info(f"✓ BAW Template Version: {config.baw_version}")
        
        # Validate template directory exists
        template_dir = Path(f"templates/BaseTWX/{config.baw_version}")
        if not template_dir.exists():
            logger.error(f"❌ Template directory not found: {template_dir}")
            logger.error(f"   Available versions: {', '.join([d.name for d in Path('templates/BaseTWX').iterdir() if d.is_dir()])}")
            logger.error(f"   Update 'bawVersion' in {CONFIG_FILE} to use a valid template version")
            return None
        
        # Scan for widgets
        logger.info(f"🔍 Scanning widgets directory: {WIDGETS_DIR}")
        all_widgets = scan_project(WIDGETS_DIR)
        logger.info(f"✓ Found {len(all_widgets)} total widgets")
        
        # Filter to requested widgets
        target_widgets = []
        for widget_name in WIDGET_NAMES:
            widget = next((w for w in all_widgets if w.name == widget_name), None)
            if widget:
                target_widgets.append(widget)
                logger.info(f"✓ Found widget: {widget.name}")
                logger.info(f"  - Path: {widget.path}")
                logger.info(f"  - Files: {widget.get_file_count()}")
                logger.info(f"  - Has preview: {widget.has_preview_files()}")
                logger.info(f"  - Has config: {widget.has_config()}")
            else:
                logger.warning(f"⚠️  Widget '{widget_name}' not found")
        
        if not target_widgets:
            logger.error("❌ No widgets found to package")
            return None
        
        logger.info(f"\n📝 Packaging {len(target_widgets)} widget(s)...")
        
        # Create TWX builder (template_dir is now determined from config.baw_version)
        logger.info("🔨 Creating TWX builder...")
        builder = TWXBuilder(
            config=config,
            output_dir=OUTPUT_DIR
        )
        
        # Add all widgets
        for widget in target_widgets:
            logger.info(f"➕ Adding widget: {widget.name}")
            builder.add_widget(widget)
        
        # Build the package
        logger.info("🏗️  Building TWX package...")
        output_path = builder.build()
        
        # Success!
        print("\n" + "=" * 70)
        logger.info(f"✅ BAW Toolkit package created successfully!")
        logger.info(f"📦 Output: {output_path}")
        logger.info(f"📊 Size: {output_path.stat().st_size / 1024:.2f} KB")
        logger.info(f"🎯 Widgets: {', '.join(w.name for w in target_widgets)}")
        logger.info(f"📋 Business Objects: Included from business-objects/generated/")
        logger.info(f"🎭 Coaches: Included from coaches/")
        logger.info(f"\n🎉 Ready to import into BAW!")
        print("=" * 70)
        
        return output_path
        
    except FileNotFoundError as e:
        logger.error(f"❌ File not found: {e}")
        return None
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == "__main__":
    import sys
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(
        description="Package BAW artifacts (widgets, business objects, coaches) into a TWX toolkit. Template version is configured in toolkit.config.json.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Package with settings from toolkit.config.json
  python package_baw.py
  
Note:
  To change the BAW template version, edit the 'bawVersion' field in toolkit.config.json
        """
    )
    
    args = parser.parse_args()
    
    print("\n" + "=" * 70)
    print("BAW Toolkit Packager - Complete Artifact Package")
    print(f"Configuration: toolkit.config.json")
    print(f"Widgets: {len(WIDGET_NAMES)} custom widgets")
    print(f"Business Objects: From business-objects/generated/")
    print(f"Coaches: From coaches/")
    print("=" * 70)
    print()
    
    result = main()
    
    if result:
        sys.exit(0)
    else:
        sys.exit(1)

# Made with Bob