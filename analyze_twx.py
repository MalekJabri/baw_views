#!/usr/bin/env python3
"""
Analyze TWX file structure to understand BAW Coach XML format.
"""

import zipfile
import sys
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.dom import minidom

def extract_twx(twx_path: Path, output_dir: Path):
    """Extract TWX file to output directory."""
    print(f"Extracting {twx_path} to {output_dir}...")
    with zipfile.ZipFile(twx_path, 'r') as zip_ref:
        zip_ref.extractall(output_dir)
    print(f"✓ Extracted successfully")

def find_coach_files(extract_dir: Path):
    """Find all coach XML files (65.*.xml)."""
    coach_files = list(extract_dir.glob("65.*.xml"))
    print(f"\nFound {len(coach_files)} coach file(s):")
    for f in coach_files:
        print(f"  - {f.name}")
    return coach_files

def analyze_coach_xml(coach_file: Path):
    """Analyze coach XML structure."""
    print(f"\n{'='*70}")
    print(f"Analyzing: {coach_file.name}")
    print(f"{'='*70}\n")
    
    # Parse XML
    tree = ET.parse(coach_file)
    root = tree.getroot()
    
    # Pretty print
    xml_str = ET.tostring(root, encoding='unicode')
    dom = minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent="  ")
    
    print("XML Structure:")
    print(pretty_xml)
    
    # Analyze sections
    print("\n" + "="*70)
    print("Section Analysis:")
    print("="*70)
    
    # Coach metadata
    print("\n1. COACH METADATA:")
    print(f"   Type: {root.get('type')}")
    print(f"   ID: {root.get('id')}")
    name = root.find('name')
    if name is not None:
        print(f"   Name: {name.text}")
    desc = root.find('description')
    if desc is not None:
        print(f"   Description: {desc.text}")
    
    # Data bindings
    print("\n2. DATA BINDINGS:")
    data_section = root.find('data')
    if data_section is not None:
        variables = data_section.findall('.//variable')
        print(f"   Found {len(variables)} variable(s):")
        for var in variables:
            print(f"   - {var.get('name')}: {var.get('type')}")
    
    # Layout
    print("\n3. LAYOUT:")
    layout_section = root.find('layout')
    if layout_section is not None:
        widgets = layout_section.findall('.//widget')
        print(f"   Found {len(widgets)} widget(s) in layout:")
        for widget in widgets:
            print(f"   - Widget ref: {widget.get('ref')}")
            bindings = widget.findall('.//binding')
            for binding in bindings:
                print(f"     Binding: {binding.get('property')} -> {binding.get('variable')}")
    
    # Scripts
    print("\n4. SCRIPTS:")
    scripts_section = root.find('scripts')
    if scripts_section is not None:
        scripts = scripts_section.findall('.//script')
        print(f"   Found {len(scripts)} script(s):")
        for script in scripts:
            print(f"   - Type: {script.get('type')}")
    
    return root

def list_all_files(extract_dir: Path):
    """List all files in extracted directory."""
    print(f"\n{'='*70}")
    print("All Extracted Files:")
    print("="*70)
    
    all_files = sorted(extract_dir.rglob("*"))
    for f in all_files:
        if f.is_file():
            rel_path = f.relative_to(extract_dir)
            size = f.stat().st_size
            print(f"  {rel_path} ({size} bytes)")

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 analyze_twx.py <path-to-twx-file>")
        print("Example: python3 analyze_twx.py 'sample/testUI - 2.twx'")
        sys.exit(1)
    
    twx_path = Path(sys.argv[1])
    if not twx_path.exists():
        print(f"Error: File not found: {twx_path}")
        sys.exit(1)
    
    # Create extraction directory
    extract_dir = twx_path.parent / f"extracted_{twx_path.stem.replace(' ', '_')}"
    extract_dir.mkdir(exist_ok=True)
    
    # Extract TWX
    extract_twx(twx_path, extract_dir)
    
    # List all files
    list_all_files(extract_dir)
    
    # Find coach files
    coach_files = find_coach_files(extract_dir)
    
    # Analyze each coach file
    for coach_file in coach_files:
        analyze_coach_xml(coach_file)
    
    print(f"\n{'='*70}")
    print(f"Analysis complete!")
    print(f"Extracted files location: {extract_dir}")
    print(f"{'='*70}\n")

if __name__ == "__main__":
    main()

# Made with Bob
