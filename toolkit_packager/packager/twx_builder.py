"""
TWX Builder for BAW Toolkit Packager.
Handles creation of complete TWX packages with all artifacts.
"""

import zipfile
from pathlib import Path
from datetime import datetime
from typing import List, Optional, Dict

from ..models import Widget, TWXObject, ToolkitConfig
from ..core import generate_object_id, generate_version_id, generate_guid, escape_xml
from ..generators import CoachViewGenerator, ManagedAssetGenerator, BusinessObjectGenerator
from ..utils import get_logger
from ..utils.custom_type_registry import get_custom_type_registry
from ..utils.coach_view_registry import get_coach_view_registry

logger = get_logger(__name__)


class TWXBuilder:
    """
    Builder for creating TWX packages from widgets.
    Orchestrates the generation and packaging of all TWX artifacts.
    """
    
    def __init__(
        self,
        config: ToolkitConfig,
        template_dir: Optional[Path] = None,
        output_dir: Optional[Path] = None
    ):
        """
        Initialize TWX builder.
        
        Args:
            config: Toolkit configuration
            template_dir: Path to template directory (default: templates/BaseTWX/25.0.1)
            output_dir: Path to output directory (default: output)
        """
        self.config = config
        self.template_dir = template_dir or Path("templates/BaseTWX/25.0.1")
        self.output_dir = output_dir or Path("output")
        self.widgets: List[Widget] = []
        self.twx_objects: List[TWXObject] = []
        
    def add_widget(self, widget: Widget) -> 'TWXBuilder':
        """
        Add a widget to the package.
        
        Args:
            widget: Widget to add
            
        Returns:
            Self for chaining
        """
        self.widgets.append(widget)
        logger.info(f"Added widget: {widget.name}")
        return self
    
    def build(self, output_filename: Optional[str] = None) -> Path:
        """
        Build the complete TWX package.
        
        Args:
            output_filename: Optional custom output filename
            
        Returns:
            Path to created TWX file
        """
        if not self.widgets:
            raise ValueError("No widgets added to package")
        
        logger.info(f"Building TWX package with {len(self.widgets)} widget(s)")
        
        # Generate all TWX objects
        self._generate_twx_objects()
        
        # Create output directory
        self.output_dir.mkdir(exist_ok=True, parents=True)
        
        # Determine output filename
        if output_filename is None:
            # Use the filename template from config (with {version} substituted)
            output_filename = self.config.get_output_filename()
        
        output_path = self.output_dir / output_filename
        
        # Build the TWX file
        self._create_twx_file(output_path)
        
        # Save registries after successful build
        custom_type_registry = get_custom_type_registry()
        custom_type_registry.save_registry()
        
        coach_view_registry = get_coach_view_registry()
        coach_view_registry.save_registry()
        
        logger.info(f"TWX package created: {output_path}")
        logger.info(f"Package size: {output_path.stat().st_size / 1024:.2f} KB")
        
        return output_path
    
    def _generate_twx_objects(self):
        """Generate all TWX objects for widgets."""
        self.twx_objects = []
        
        for widget in self.widgets:
            logger.info(f"Generating objects for widget: {widget.name}")
            
            # Generate object IDs
            object_ids = self._generate_object_ids(widget)
            
            # Load config.json schema
            config_schema = widget.get_config()
            
            # Generate business objects if widget has them and store their IDs
            business_objects = widget.get_business_objects()
            bo_id_map = {}  # Map business object names to their IDs
            for bo_definition in business_objects:
                bo_gen = BusinessObjectGenerator(widget, object_ids, bo_definition)
                bo_obj = bo_gen.generate()
                self.twx_objects.append(bo_obj)
                
                # Store the business object ID for linking
                bo_name = bo_definition.get('name', 'Unknown')
                bo_id_map[bo_name] = bo_obj.id
                logger.debug(f"Generated business object: {bo_name} with ID: {bo_obj.id}")
            
            # Store business object IDs separately for coach view generator
            if bo_id_map:
                object_ids = {**object_ids, 'business_objects': bo_id_map}
            
            # Generate coach view
            coach_view_gen = CoachViewGenerator(widget, object_ids, config_schema)
            coach_view_obj = coach_view_gen.generate()
            self.twx_objects.append(coach_view_obj)
            
            # Generate managed assets
            managed_asset_gen = ManagedAssetGenerator(widget, object_ids)
            managed_assets = managed_asset_gen.generate()
            if isinstance(managed_assets, list):
                self.twx_objects.extend(managed_assets)
            else:
                self.twx_objects.append(managed_assets)
    
    def _generate_object_ids(self, widget: Widget) -> Dict[str, str]:
        """
        Generate all object IDs for a widget.
        
        Args:
            widget: Widget to generate IDs for
            
        Returns:
            Dictionary of object IDs
        """
        return {
            'coach_view_id': generate_object_id(widget.name, '64'),
            'preview_html_id': generate_object_id(f'{widget.name}_preview_html', '61'),
            'preview_js_id': generate_object_id(f'{widget.name}_preview_js', '61'),
        }
    
    def _create_twx_file(self, output_path: Path):
        """
        Create the TWX ZIP file with all artifacts.
        
        Args:
            output_path: Path to output TWX file
        """
        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as twx:
            # Add dependency toolkits
            self._add_dependency_toolkits(twx)
            
            # Add META-INF files
            self._add_meta_inf(twx)
            
            # Add template defaults
            self._add_template_defaults(twx)
            
            # Add widget objects
            self._add_widget_objects(twx)
            
            # Add managed asset files
            self._add_managed_asset_files(twx)
    
    def _add_dependency_toolkits(self, twx: zipfile.ZipFile):
        """Add dependency toolkit files to TWX."""
        toolkit_dir = self.template_dir / "toolkits"
        if not toolkit_dir.exists():
            logger.warning(f"Toolkit directory not found: {toolkit_dir}")
            return
        
        logger.info("Adding dependency toolkits...")
        for toolkit_file in toolkit_dir.glob("*.zip"):
            twx.write(toolkit_file, f"toolkits/{toolkit_file.name}")
            logger.debug(f"Added toolkit: {toolkit_file.name}")
    
    def _add_meta_inf(self, twx: zipfile.ZipFile):
        """Add META-INF files to TWX."""
        logger.info("Adding META-INF files...")
        
        # Add MANIFEST.MF
        manifest_path = self.template_dir / "META-INF/MANIFEST.MF"
        if manifest_path.exists():
            twx.write(manifest_path, "META-INF/MANIFEST.MF")
        
        # Add metadata.xml
        metadata_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<metadata>
</metadata>
'''
        twx.writestr("META-INF/metadata.xml", metadata_xml)
        
        # Add package.xml
        package_xml = self._generate_package_xml()
        twx.writestr("META-INF/package.xml", package_xml)
        
        # Add properties.json
        properties_path = self.template_dir / "META-INF/properties.json"
        if properties_path.exists():
            twx.write(properties_path, "META-INF/properties.json")
    
    def _add_template_defaults(self, twx: zipfile.ZipFile):
        """Add template default objects to TWX."""
        logger.info("Adding template defaults...")
        
        # Environment Variables (62.xxx)
        env_vars_path = self.template_dir / "objects/62.0d0540dd-78d1-4c79-9645-ef44fdc68496.xml"
        if env_vars_path.exists():
            twx.write(env_vars_path, "objects/62.0d0540dd-78d1-4c79-9645-ef44fdc68496.xml")
        
        # Toolkit Settings (63.xxx)
        toolkit_settings_path = self.template_dir / "objects/63.ac589b49-7ba3-49fa-8d2e-0be44112b7ca.xml"
        if toolkit_settings_path.exists():
            twx.write(toolkit_settings_path, "objects/63.ac589b49-7ba3-49fa-8d2e-0be44112b7ca.xml")
    
    def _add_widget_objects(self, twx: zipfile.ZipFile):
        """Add widget object XML files to TWX."""
        logger.info("Adding widget objects...")
        
        for twx_obj in self.twx_objects:
            object_path = f"objects/{twx_obj.id}.xml"
            twx.writestr(object_path, twx_obj.xml_content)
            logger.debug(f"Added object: {object_path}")
    
    def _add_managed_asset_files(self, twx: zipfile.ZipFile):
        """Add managed asset files to TWX."""
        logger.info("Adding managed asset files...")
        
        for twx_obj in self.twx_objects:
            if twx_obj.object_type == "managedAsset" and twx_obj.file_references:
                for file_ref in twx_obj.file_references:
                    file_id = file_ref.get('file_id')
                    content = file_ref.get('content')
                    if file_id and content:
                        file_path = f"files/{twx_obj.id}/{file_id}"
                        twx.writestr(file_path, content)
                        logger.debug(f"Added file: {file_path}")
    
    def _generate_package_xml(self) -> str:
        """
        Generate package.xml with all objects and files.
        
        Returns:
            Package XML string
        """
        # Load template package.xml
        template_package_path = self.template_dir / "META-INF/package.xml"
        if template_package_path.exists():
            template_xml = template_package_path.read_text(encoding='utf-8')
        else:
            template_xml = self._get_default_package_xml_template()
        
        # Use persistent toolkit ID if configured, otherwise generate new one
        if self.config.toolkit_id:
            package_project_id = self.config.toolkit_id
            logger.info(f"Using persistent toolkit ID: {package_project_id}")
        else:
            package_project_id = generate_object_id(f"{self.config.short_name}_project", "2066")
            logger.warning(f"No toolkit ID configured, generated new ID: {package_project_id}")
            logger.warning("Add 'id' field to toolkit.config.json to maintain consistent toolkit identity")
        
        # Use persistent branch ID if configured, otherwise generate deterministic one
        # Branch ID MUST remain constant across versions for upgrade compatibility
        if hasattr(self.config, 'branch_id') and self.config.branch_id:
            package_branch_id = self.config.branch_id
            logger.info(f"Using persistent branch ID: {package_branch_id}")
        else:
            # Generate deterministic branch ID using generate_guid (no timestamp)
            # This ensures the same branch ID across all versions
            branch_guid = generate_guid(f"{self.config.short_name}_branch_Main")
            package_branch_id = f"2063.{branch_guid}"
            logger.info(f"Generated deterministic branch ID: {package_branch_id}")
            logger.info("Consider adding 'branchId' field to toolkit.config.json for explicit control")
        
        # Snapshot ID should change with each version (includes timestamp for uniqueness)
        package_snapshot_id = generate_object_id(f"{self.config.short_name}_snapshot_{self.config.version}", "2064")
        
        # Replace project info
        package_xml = template_xml
        package_xml = self._replace_project_info(package_xml, package_project_id, package_branch_id, package_snapshot_id)
        
        # Replace objects section
        objects_xml = self._generate_objects_section()
        package_xml = self._replace_section(package_xml, "objects", objects_xml)
        
        # Replace files section
        files_xml = self._generate_files_section()
        package_xml = self._replace_section(package_xml, "files", files_xml)
        
        return package_xml
    
    def _replace_project_info(
        self,
        package_xml: str,
        project_id: str,
        branch_id: str,
        snapshot_id: str
    ) -> str:
        """Replace project information in package.xml."""
        # Replace project ID and metadata
        package_xml = package_xml.replace(
            'id="2066.91beba32-f01f-45a0-9952-da866f54afe6" name="Custom Widget" description="" shortName="CW"',
            f'id="{project_id}" name="{self.config.name}" description="{escape_xml(self.config.description)}" shortName="{self.config.short_name}"'
        )
        
        # Replace branch ID
        package_xml = package_xml.replace(
            'id="2063.71237652-c729-4857-afe9-498c68376c60"',
            f'id="{branch_id}"'
        )
        
        # Replace snapshot ID and version
        package_xml = package_xml.replace(
            'id="2064.960ed891-137d-4537-a66f-ad81b5f230db" name="2" acronym="2"',
            f'id="{snapshot_id}" name="{self.config.version}" acronym="{self.config.version}"'
        )
        
        # Replace creation date
        package_xml = package_xml.replace(
            'originalCreationDate="2026-04-30T06:56:13.051Z"',
            f'originalCreationDate="{datetime.utcnow().isoformat(timespec="milliseconds")}Z"'
        )
        
        return package_xml
    
    def _generate_objects_section(self) -> str:
        """Generate objects section for package.xml."""
        object_lines = []
        
        # Add template defaults
        object_lines.append('        <object id="62.0d0540dd-78d1-4c79-9645-ef44fdc68496" versionId="52fe67fd-fdcf-4694-967f-299affe554e0" name="Environment Variables" type="environmentVariableSet"/>')
        object_lines.append('        <object id="63.ac589b49-7ba3-49fa-8d2e-0be44112b7ca" versionId="b80c6393-0c4d-4f33-abf5-e1e4c06f54e4" name="Toolkit Settings" type="projectDefaults"/>')
        
        # Add widget objects
        for twx_obj in self.twx_objects:
            object_line = f'        <object id="{twx_obj.id}" versionId="{twx_obj.version_id}" name="{escape_xml(twx_obj.name)}" type="{twx_obj.object_type}"/>'
            object_lines.append(object_line)
        
        return "\n".join(object_lines)
    
    def _generate_files_section(self) -> str:
        """Generate files section for package.xml."""
        file_lines = []
        
        for twx_obj in self.twx_objects:
            if twx_obj.object_type == "managedAsset" and twx_obj.file_references:
                for file_ref in twx_obj.file_references:
                    file_id = file_ref.get('file_id')
                    if file_id:
                        file_line = f'        <file path="{file_id}" id="{twx_obj.id}"/>'
                        file_lines.append(file_line)
        
        return "\n".join(file_lines)
    
    def _replace_section(self, xml: str, section_name: str, new_content: str) -> str:
        """Replace a section in the XML."""
        start_tag = f"<{section_name}>"
        end_tag = f"</{section_name}>"
        
        start_idx = xml.find(start_tag)
        end_idx = xml.find(end_tag)
        
        if start_idx == -1 or end_idx == -1:
            logger.warning(f"Section '{section_name}' not found in template")
            return xml
        
        before = xml[:start_idx + len(start_tag)]
        after = xml[end_idx:]
        
        return f"{before}\n{new_content}\n    {after}"
    
    def _get_default_package_xml_template(self) -> str:
        """Get default package.xml template if template file doesn't exist."""
        return '''<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.ibm.com/xmlns/prod/bpm/package/v1.0" id="2066.91beba32-f01f-45a0-9952-da866f54afe6" name="Custom Widget" description="" shortName="CW" originalCreationDate="2026-04-30T06:56:13.051Z">
    <branch id="2063.71237652-c729-4857-afe9-498c68376c60">
        <snapshot id="2064.960ed891-137d-4537-a66f-ad81b5f230db" name="2" acronym="2">
            <objects>
            </objects>
            <files>
            </files>
        </snapshot>
    </branch>
</package>
'''


# Made with Bob