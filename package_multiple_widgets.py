#!/usr/bin/env python3
"""
Package multiple widgets into a single BAW toolkit TWX file.
This script demonstrates packaging DateOutput and ProcessCircle widgets together.
"""

import logging
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
    "DateOutput",
    "FileNetBrowser",
    "FileNetImport",
    "FolderTree",
    "MarkdownViewer",
    "MultiSelect",
    "ProcessCircle",
    "ProgressBar",
    "Stepper",
    "TasksList"
]
WIDGETS_DIR = Path("widgets")
TEMPLATE_DIR = Path("templates/BaseTWX/25.0.1")
OUTPUT_DIR = Path("output")
CONFIG_FILE = Path("toolkit.config.json")

# Setup logging
setup_logger(level=logging.INFO)
logger = get_logger(__name__)


def main():
    """Main packaging function for multiple widgets."""
    try:
        logger.info(f"📦 Packaging {len(WIDGET_NAMES)} widgets: {', '.join(WIDGET_NAMES)}")
        print("=" * 70)
        
        # Auto-increment version before packaging
        logger.info("🔢 Auto-incrementing toolkit version...")
        old_version, new_version = increment_toolkit_version(CONFIG_FILE, increment_type="patch")
        logger.info(f"✓ Version updated: {old_version} → {new_version}")
        
        # Load configuration (with updated version)
        logger.info("📄 Loading configuration...")
        config = load_config(CONFIG_FILE)
        logger.info(f"✓ Config loaded: {config.name} v{config.version}")
        
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
        
        # Create TWX builder
        logger.info("🔨 Creating TWX builder...")
        builder = TWXBuilder(
            config=config,
            template_dir=TEMPLATE_DIR,
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
        logger.info(f"✅ Multi-widget package created successfully!")
        logger.info(f"📦 Output: {output_path}")
        logger.info(f"📊 Size: {output_path.stat().st_size / 1024:.2f} KB")
        logger.info(f"🎯 Widgets included: {', '.join(w.name for w in target_widgets)}")
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
    
    print("\n" + "=" * 70)
    print("BAW Toolkit Packager - Multi-Widget Package")
    print(f"Widgets: {', '.join(WIDGET_NAMES)}")
    print("=" * 70)
    print()
    
    result = main()
    
    if result:
        sys.exit(0)
    else:
        sys.exit(1)

# Made with Bob