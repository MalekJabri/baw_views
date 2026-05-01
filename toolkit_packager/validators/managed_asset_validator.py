"""
Validator for BAW Managed Asset XML files.
Ensures all required fields have valid values to prevent import errors.
"""

from pathlib import Path
from typing import List, Tuple
import xml.etree.ElementTree as ET


class ManagedAssetValidationError(Exception):
    """Raised when a managed asset XML file fails validation."""
    pass


def validate_managed_asset_xml(xml_path: Path) -> List[str]:
    """
    Validate a managed asset XML file for BAW compatibility.
    
    Args:
        xml_path: Path to the managed asset XML file
        
    Returns:
        List of validation error messages (empty if valid)
    """
    errors = []
    
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        
        # Find the managedAsset element
        managed_asset = root.find('.//managedAsset')
        if managed_asset is None:
            errors.append(f"No <managedAsset> element found in {xml_path.name}")
            return errors
        
        # Validate localLastModification
        local_last_mod = managed_asset.find('localLastModification')
        if local_last_mod is not None:
            value = local_last_mod.text
            is_null = local_last_mod.get('isNull') == 'true'
            
            if not is_null:
                if value is None or value.strip() == '':
                    errors.append(
                        f"{xml_path.name}: <localLastModification> is empty"
                    )
                elif value == '0':
                    errors.append(
                        f"{xml_path.name}: <localLastModification> is 0 (must be > 0). "
                        "This causes NullPointerException during BAW import."
                    )
                else:
                    try:
                        timestamp = int(value)
                        if timestamp <= 0:
                            errors.append(
                                f"{xml_path.name}: <localLastModification> must be positive, got {timestamp}"
                            )
                        elif len(value) != 13:
                            errors.append(
                                f"{xml_path.name}: <localLastModification> should be 13 digits (milliseconds), got {len(value)}"
                            )
                    except ValueError:
                        errors.append(
                            f"{xml_path.name}: <localLastModification> is not a valid number: {value}"
                        )
        
        # Validate lastModified
        last_modified = managed_asset.find('lastModified')
        if last_modified is not None:
            value = last_modified.text
            is_null = last_modified.get('isNull') == 'true'
            
            if not is_null and (value is None or value.strip() == ''):
                errors.append(
                    f"{xml_path.name}: <lastModified> is empty"
                )
        
        # Validate length
        length_elem = managed_asset.find('length')
        if length_elem is not None:
            value = length_elem.text
            if value is not None:
                try:
                    length = int(value)
                    if length < 0:
                        errors.append(
                            f"{xml_path.name}: <length> must be non-negative, got {length}"
                        )
                except ValueError:
                    errors.append(
                        f"{xml_path.name}: <length> is not a valid number: {value}"
                    )
        
    except ET.ParseError as e:
        errors.append(f"{xml_path.name}: XML parsing error: {e}")
    except Exception as e:
        errors.append(f"{xml_path.name}: Unexpected error: {e}")
    
    return errors


def validate_directory(directory: Path, recursive: bool = True) -> Tuple[int, List[str]]:
    """
    Validate all managed asset XML files in a directory.
    
    Args:
        directory: Directory to scan for managed asset XML files
        recursive: Whether to scan subdirectories
        
    Returns:
        Tuple of (files_checked, all_errors)
    """
    all_errors = []
    files_checked = 0
    
    pattern = "**/*.xml" if recursive else "*.xml"
    
    for xml_file in directory.glob(pattern):
        # Only check files that look like managed assets (61.*.xml)
        if xml_file.stem.startswith('61.'):
            files_checked += 1
            errors = validate_managed_asset_xml(xml_file)
            all_errors.extend(errors)
    
    return files_checked, all_errors


def fix_zero_timestamps(xml_path: Path, dry_run: bool = True) -> bool:
    """
    Fix localLastModification=0 by replacing with lastModified value.
    
    Args:
        xml_path: Path to the managed asset XML file
        dry_run: If True, only report what would be changed
        
    Returns:
        True if changes were made (or would be made in dry_run)
    """
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        
        managed_asset = root.find('.//managedAsset')
        if managed_asset is None:
            return False
        
        local_last_mod = managed_asset.find('localLastModification')
        last_modified = managed_asset.find('lastModified')
        
        if local_last_mod is not None and last_modified is not None:
            local_value = local_last_mod.text
            last_mod_value = last_modified.text
            
            if local_value == '0' and last_mod_value and last_mod_value != '0':
                if dry_run:
                    print(f"Would fix {xml_path.name}: localLastModification 0 -> {last_mod_value}")
                else:
                    local_last_mod.text = last_mod_value
                    tree.write(xml_path, encoding='UTF-8', xml_declaration=True)
                    print(f"Fixed {xml_path.name}: localLastModification 0 -> {last_mod_value}")
                return True
        
        return False
        
    except Exception as e:
        print(f"Error processing {xml_path.name}: {e}")
        return False


if __name__ == "__main__":
    import sys
    
    # Simple CLI for validation
    if len(sys.argv) < 2:
        print("Usage: python managed_asset_validator.py <directory> [--fix]")
        sys.exit(1)
    
    directory = Path(sys.argv[1])
    fix_mode = '--fix' in sys.argv
    
    if not directory.exists():
        print(f"Error: Directory not found: {directory}")
        sys.exit(1)
    
    print(f"Validating managed asset XML files in: {directory}")
    print("=" * 60)
    
    files_checked, errors = validate_directory(directory)
    
    print(f"\nFiles checked: {files_checked}")
    
    if errors:
        print(f"\n❌ Found {len(errors)} validation error(s):\n")
        for error in errors:
            print(f"  • {error}")
        
        if fix_mode:
            print("\n🔧 Attempting to fix zero timestamps...")
            fixed_count = 0
            for xml_file in directory.glob("**/61.*.xml"):
                if fix_zero_timestamps(xml_file, dry_run=False):
                    fixed_count += 1
            print(f"\n✓ Fixed {fixed_count} file(s)")
        else:
            print("\nRun with --fix to automatically correct zero timestamps")
        
        sys.exit(1)
    else:
        print("\n✅ All managed asset XML files are valid!")
        sys.exit(0)

# Made with Bob
