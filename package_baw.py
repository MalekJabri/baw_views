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
DEFAULT_TEMPLATE_VERSION = "25.0.1"
OUTPUT_DIR = Path("output")
CONFIG_FILE = Path("toolkit.config.json")

# Setup logging
setup_logger(level=logging.INFO)
logger = get_logger(__name__)


def main(template_version: str = DEFAULT_TEMPLATE_VERSION):
    """
    Main packaging function for BAW artifacts (widgets, business objects, coaches).
    
    Args:
        template_version: BAW template version to use (default: 25.0.1)
    """
    try:
        template_dir = Path(f"templates/BaseTWX/{template_version}")
        
        # Validate template directory exists
        if not template_dir.exists():
            logger.error(f"❌ Template directory not found: {template_dir}")
            logger.error(f"   Available versions: {', '.join([d.name for d in Path('templates/BaseTWX').iterdir() if d.is_dir()])}")
            return None
        
        logger.info(f"📦 Packaging BAW Toolkit with {len(WIDGET_NAMES)} widgets")
        logger.info(f"   Template Version: {template_version}")
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
            template_dir=template_dir,
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
        description="Package BAW artifacts (widgets, business objects, coaches) into a TWX toolkit",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Interactive mode (will prompt for version)
  python package_baw.py
  
  # Use specific template version
  python package_baw.py --template-version 24.0.1
  
  # Short form
  python package_baw.py -t 24.0.1
  
  # Non-interactive mode with default
  python package_baw.py --no-prompt
        """
    )
    parser.add_argument(
        "-t", "--template-version",
        default=None,
        help=f"BAW template version to use (default: {DEFAULT_TEMPLATE_VERSION})"
    )
    parser.add_argument(
        "--no-prompt",
        action="store_true",
        help="Skip interactive prompt and use default version"
    )
    
    args = parser.parse_args()
    
    # Determine template version
    template_version = args.template_version
    
    # If no version specified and not in no-prompt mode, ask interactively
    if template_version is None and not args.no_prompt:
        print("\n" + "=" * 70)
        print("BAW Toolkit Packager - Template Version Selection")
        print("=" * 70)
        print("\nAvailable BAW template versions:")
        print("  1. BAW 24.0.1")
        print("  2. BAW 25.0.1 (default)")
        print()
        
        while True:
            choice = input("Select template version (1/2) [2]: ").strip()
            
            if choice == "" or choice == "2":
                template_version = "25.0.1"
                break
            elif choice == "1":
                template_version = "24.0.1"
                break
            else:
                print("Invalid choice. Please enter 1 or 2.")
    
    # Use default if still not set
    if template_version is None:
        template_version = DEFAULT_TEMPLATE_VERSION
    
    print("\n" + "=" * 70)
    print("BAW Toolkit Packager - Complete Artifact Package")
    print(f"Template Version: {template_version}")
    print(f"Widgets: {len(WIDGET_NAMES)} custom widgets")
    print(f"Business Objects: From business-objects/generated/")
    print(f"Coaches: From coaches/")
    print("=" * 70)
    print()
    
    result = main(template_version=template_version)
    
    if result:
        sys.exit(0)
    else:
        sys.exit(1)

# Made with Bob