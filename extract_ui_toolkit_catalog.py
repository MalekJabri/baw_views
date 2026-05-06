#!/usr/bin/env python3
"""
Extract BAW UI Toolkit catalog - creates a comprehensive reference of all standard widgets.

This script analyzes the UI Toolkit package to extract:
- Widget names and IDs
- Business object types and class IDs
- Data type mappings
"""

import xml.etree.ElementTree as ET
import json
from pathlib import Path
from collections import defaultdict

def extract_ui_toolkit_catalog():
    """Extract catalog from UI Toolkit package.xml"""
    
    package_xml = Path("templates/BaseTWX/extracted_ui_toolkit/META-INF/package.xml")
    
    if not package_xml.exists():
        print(f"Error: {package_xml} not found")
        return
    
    tree = ET.parse(package_xml)
    root = tree.getroot()
    
    catalog = {
        "toolkit_info": {
            "name": "UI Toolkit",
            "shortName": "SYSBPMUI",
            "snapshot_id": "2064.304ac881-16c3-47d2-97d5-6e4c4a893177",
            "version": "8.6.0.0"
        },
        "coach_views": {},
        "business_objects": {},
        "data_types": {}
    }
    
    # Extract all objects (no namespace needed, iterate directly)
    for obj in root.iter():
        if obj.tag.endswith('object'):
            obj_id = obj.get('id')
            obj_name = obj.get('name')
            obj_type = obj.get('type')
            
            if obj_type == 'coachView':
                catalog['coach_views'][obj_name] = {
                    "id": obj_id,
                    "version_id": obj.get('versionId')
                }
            elif obj_type == 'twClass':
                catalog['business_objects'][obj_name] = {
                    "id": obj_id,
                    "version_id": obj.get('versionId')
                }
    
    # Sort by name
    catalog['coach_views'] = dict(sorted(catalog['coach_views'].items()))
    catalog['business_objects'] = dict(sorted(catalog['business_objects'].items()))
    
    # Save catalog
    output_file = Path("toolkit_packager/baw_ui_toolkit_catalog.json")
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    
    print(f"✅ UI Toolkit catalog created: {output_file}")
    print(f"   - {len(catalog['coach_views'])} coach views (widgets)")
    print(f"   - {len(catalog['business_objects'])} business objects")
    
    # Print some key widgets
    print("\n📋 Sample Standard Widgets:")
    key_widgets = ['Text', 'Text Area', 'Button', 'Checkbox', 'Radio Buttons', 
                   'Select', 'Date Picker', 'Integer', 'Decimal', 'Table']
    for widget in key_widgets:
        if widget in catalog['coach_views']:
            print(f"   - {widget}: {catalog['coach_views'][widget]['id']}")
    
    return catalog

if __name__ == '__main__':
    extract_ui_toolkit_catalog()

# Made with Bob
