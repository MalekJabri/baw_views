#!/usr/bin/env python3
"""
Register business objects from business-objects/generated folder.
This script scans business objects and registers them in baw_custom_types.json with classIds.
"""

import logging
from pathlib import Path
from toolkit_packager import (
    scan_business_objects,
    get_processing_order,
    get_or_create_class_id,
    load_custom_types_registry,
    save_custom_types_registry,
    setup_logger,
    get_logger,
)

# Configuration
PROJECT_ROOT = Path(".")
BUSINESS_OBJECTS_DIR = PROJECT_ROOT / "business-objects" / "generated"
REGISTRY_PATH = PROJECT_ROOT / "toolkit_packager" / "baw_custom_types.json"

# Setup logging
setup_logger(level=logging.INFO)
logger = get_logger(__name__)


def main():
    """Main registration function for business objects."""
    try:
        logger.info("=" * 70)
        logger.info("📦 Business Object Registration")
        logger.info("=" * 70)
        
        # Scan for business objects
        logger.info(f"🔍 Scanning business objects in: {BUSINESS_OBJECTS_DIR}")
        business_objects = scan_business_objects(PROJECT_ROOT)
        
        if not business_objects:
            logger.warning("⚠️  No business objects found")
            return
        
        logger.info(f"✓ Found {len(business_objects)} business objects")
        
        # Get processing order (dependencies first)
        logger.info("\n📊 Analyzing dependencies...")
        ordered_bos = get_processing_order(business_objects)
        logger.info(f"✓ Determined processing order for {len(ordered_bos)} objects")
        
        # Load existing registry
        logger.info(f"\n📄 Loading registry: {REGISTRY_PATH}")
        registry = load_custom_types_registry(REGISTRY_PATH)
        existing_count = len(registry.get("custom_types", {}))
        logger.info(f"✓ Registry loaded with {existing_count} existing types")
        
        # Register each business object
        logger.info("\n🔨 Registering business objects...")
        new_count = 0
        updated_count = 0
        
        for bo in ordered_bos:
            # Determine context from path
            context = bo.path.parent.name
            
            # Get or create class ID
            class_id = get_or_create_class_id(
                REGISTRY_PATH,
                bo.name,
                bo.description,
                context
            )
            
            # Check if it was newly created
            if bo.name not in registry.get("custom_types", {}):
                new_count += 1
                logger.info(f"  ✓ Registered: {bo.name}")
                logger.info(f"    - Context: {context}")
                logger.info(f"    - ClassId: {class_id}")
                logger.info(f"    - Properties: {bo.get_property_count()}")
            else:
                updated_count += 1
                logger.info(f"  ↻ Already registered: {bo.name} ({class_id})")
        
        # Reload registry to show final state
        final_registry = load_custom_types_registry(REGISTRY_PATH)
        final_count = len(final_registry.get("custom_types", {}))
        
        # Summary
        logger.info("\n" + "=" * 70)
        logger.info("📊 Registration Summary")
        logger.info("=" * 70)
        logger.info(f"Business Objects Scanned: {len(business_objects)}")
        logger.info(f"New Registrations: {new_count}")
        logger.info(f"Already Registered: {updated_count}")
        logger.info(f"Total Types in Registry: {final_count}")
        logger.info(f"Registry File: {REGISTRY_PATH}")
        logger.info("=" * 70)
        logger.info("✅ Registration complete!")
        
        # Show contexts
        contexts = {}
        for type_name, type_info in final_registry.get("custom_types", {}).items():
            context = type_info.get("context", "unknown")
            if context not in contexts:
                contexts[context] = []
            contexts[context].append(type_name)
        
        logger.info("\n📁 Business Objects by Context:")
        for context, types in sorted(contexts.items()):
            logger.info(f"  {context}: {len(types)} types")
            for type_name in sorted(types):
                logger.info(f"    - {type_name}")
        
    except Exception as e:
        logger.error(f"❌ Error during registration: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    main()

# Made with Bob
