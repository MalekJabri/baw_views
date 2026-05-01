#!/usr/bin/env python3
"""
Package DateOutput widget into a BAW toolkit TWX file.
This script now uses the refactored toolkit_packager modules.
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

# Configuration
WIDGET_NAME = "DateOutput"
WIDGETS_DIR = Path("widgets")
TEMPLATE_DIR = Path("templates/BaseTWX/25.0.1")
OUTPUT_DIR = Path("output")
CONFIG_FILE = Path("toolkit.config.json")

# Setup logging
setup_logger(level=logging.INFO)
logger = get_logger(__name__)


def main():
    """Main packaging function using the new toolkit_packager API."""
    try:
        logger.info(f"📦 Packaging {WIDGET_NAME} widget using toolkit_packager...")
        
        # Load configuration
        logger.info("📄 Loading configuration...")
        config = load_config(CONFIG_FILE)
        logger.info(f"✓ Config loaded: {config.name} v{config.version}")
        
        # Scan for widgets
        logger.info(f"🔍 Scanning widgets directory: {WIDGETS_DIR}")
        widgets = scan_project(WIDGETS_DIR)
        
        # Find the DateOutput widget
        target_widget = None
        for widget in widgets:
            if widget.name == WIDGET_NAME:
                target_widget = widget
                break
        
        if not target_widget:
            logger.error(f"❌ Widget '{WIDGET_NAME}' not found in {WIDGETS_DIR}")
            logger.info(f"Available widgets: {[w.name for w in widgets]}")
            return None
        
        logger.info(f"✓ Found widget: {target_widget.name}")
        logger.info(f"  - Path: {target_widget.path}")
        logger.info(f"  - Files: {target_widget.get_file_count()}")
        logger.info(f"  - Has preview: {target_widget.has_preview_files()}")
        logger.info(f"  - Has OpenAPI: {target_widget.has_openapi_schema()}")
        
        # Create TWX builder
        logger.info("🔨 Creating TWX builder...")
        builder = TWXBuilder(
            config=config,
            template_dir=TEMPLATE_DIR,
            output_dir=OUTPUT_DIR
        )
        
        # Add widget and build
        logger.info(f"📝 Adding widget to package...")
        builder.add_widget(target_widget)
        
        logger.info("🏗️  Building TWX package...")
        output_path = builder.build()
        
        # Success!
        logger.info(f"\n✅ Package created successfully!")
        logger.info(f"📦 Output: {output_path}")
        logger.info(f"📊 Size: {output_path.stat().st_size / 1024:.2f} KB")
        logger.info(f"\n🎉 Ready to import into BAW!")
        
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
    
    print("=" * 70)
    print("BAW Toolkit Packager - DateOutput Widget")
    print("Using refactored toolkit_packager components")
    print("=" * 70)
    print()
    
    result = main()
    
    if result:
        sys.exit(0)
    else:
        sys.exit(1)

# Made with Bob
