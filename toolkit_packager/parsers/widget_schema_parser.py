"""
Widget schema parser for BAW Coach Generator.

Parses widget config.json files and extracts metadata needed for
coach generation including bindings, configuration options, and
business objects.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, field

from ..utils.coach_view_registry import get_coach_view_registry
from ..utils.logger import get_logger

logger = get_logger(__name__)


@dataclass
class WidgetSchema:
    """Widget schema information extracted from config.json"""
    name: str
    description: str
    coach_view_id: str
    binding_type: str
    binding_type_name: str
    is_list: bool
    config_options: List[Dict] = field(default_factory=list)
    business_objects: List[str] = field(default_factory=list)
    has_change_function: bool = False
    widget_path: Optional[Path] = None


class WidgetSchemaParser:
    """Parse widget config.json files and extract metadata"""
    
    def __init__(self):
        self.registry = get_coach_view_registry()
    
    def parse(self, widget_path: Path) -> WidgetSchema:
        """
        Parse widget configuration from config.json.
        
        Args:
            widget_path: Path to widget directory
            
        Returns:
            WidgetSchema object with extracted metadata
            
        Raises:
            FileNotFoundError: If config.json not found
            ValueError: If config.json is invalid
        """
        config_file = widget_path / "widget" / "config.json"
        
        if not config_file.exists():
            raise FileNotFoundError(f"config.json not found: {config_file}")
        
        try:
            config = json.loads(config_file.read_text(encoding='utf-8'))
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in {config_file}: {e}")
        
        # Extract widget name
        widget_name = config.get("name")
        if not widget_name:
            widget_name = widget_path.name
            logger.warning(f"No name in config.json, using directory name: {widget_name}")
        
        # Get coach view ID from registry
        coach_view_id = self._get_coach_view_id(widget_name)
        
        # Extract binding type information
        binding_info = config.get("bindingType", {})
        binding_type = binding_info.get("type", "String")
        binding_type_name = binding_info.get("name", f"{widget_name}Data")
        is_list = binding_info.get("isList", False)
        
        # Extract configuration options
        config_options = self._extract_config_options(config)
        
        # Extract business objects
        business_objects = self._extract_business_objects(config)
        
        # Check for change function
        has_change_function = config.get("changeFunction", False)
        
        schema = WidgetSchema(
            name=widget_name,
            description=config.get("description", f"{widget_name} widget"),
            coach_view_id=coach_view_id,
            binding_type=binding_type,
            binding_type_name=binding_type_name,
            is_list=is_list,
            config_options=config_options,
            business_objects=business_objects,
            has_change_function=has_change_function,
            widget_path=widget_path
        )
        
        logger.info(f"Parsed widget schema: {widget_name} (view: {coach_view_id})")
        return schema
    
    def _get_coach_view_id(self, widget_name: str) -> str:
        """
        Get coach view ID from registry.
        
        Args:
            widget_name: Widget name
            
        Returns:
            Coach view ID (format: 64.{guid})
        """
        coach_view_id = self.registry.get_coach_view_id(widget_name)
        if not coach_view_id:
            logger.warning(f"No coach view ID found for {widget_name} in registry")
            # Generate a placeholder - will need to be registered
            from ..core import generate_object_id
            coach_view_id = generate_object_id(widget_name, "64")
            logger.info(f"Generated placeholder coach view ID: {coach_view_id}")
        return coach_view_id
    
    def _extract_config_options(self, config: dict) -> List[Dict]:
        """
        Extract configuration options from config.json.
        
        Args:
            config: Parsed config.json dictionary
            
        Returns:
            List of configuration option dictionaries
        """
        options = []
        for opt in config.get("configOptions", []):
            option = {
                'name': opt.get('name'),
                'type': opt.get('type'),
                'label': opt.get('label'),
                'description': opt.get('description', ''),
                'default': opt.get('default')
            }
            options.append(option)
        
        logger.debug(f"Extracted {len(options)} configuration options")
        return options
    
    def _extract_business_objects(self, config: dict) -> List[str]:
        """
        Extract business object names from config.json.
        
        Args:
            config: Parsed config.json dictionary
            
        Returns:
            List of business object names
        """
        business_objects = []
        for bo in config.get("businessObjects", []):
            bo_name = bo.get("name")
            if bo_name:
                business_objects.append(bo_name)
        
        logger.debug(f"Extracted {len(business_objects)} business objects")
        return business_objects
    
    def get_business_object_file(self, widget_path: Path, bo_name: str) -> Optional[Path]:
        """
        Get path to business object JSON file.
        
        Args:
            widget_path: Path to widget directory
            bo_name: Business object name
            
        Returns:
            Path to business object file or None if not found
        """
        # Try widget/BoName.json
        bo_file = widget_path / "widget" / f"{bo_name}.json"
        if bo_file.exists():
            return bo_file
        
        # Try widget/bo_name.json (lowercase)
        bo_file = widget_path / "widget" / f"{bo_name.lower()}.json"
        if bo_file.exists():
            return bo_file
        
        logger.warning(f"Business object file not found: {bo_name}")
        return None
    
    def parse_multiple(self, widget_paths: List[Path]) -> List[WidgetSchema]:
        """
        Parse multiple widgets.
        
        Args:
            widget_paths: List of widget directory paths
            
        Returns:
            List of WidgetSchema objects
        """
        schemas = []
        for widget_path in widget_paths:
            try:
                schema = self.parse(widget_path)
                schemas.append(schema)
            except Exception as e:
                logger.error(f"Failed to parse widget at {widget_path}: {e}")
        
        logger.info(f"Successfully parsed {len(schemas)} of {len(widget_paths)} widgets")
        return schemas

# Made with Bob
