"""
Business object parser for BAW Coach Generator.

Parses business object JSON files and extracts structure needed for
generating sample data and variable declarations.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

from ..utils.logger import get_logger

logger = get_logger(__name__)


@dataclass
class BusinessObjectField:
    """Business object field definition"""
    name: str
    type: str
    is_list: bool = False
    is_required: bool = False
    default_value: Optional[Any] = None
    nested_type: Optional[str] = None  # For complex types


@dataclass
class BusinessObjectSchema:
    """Business object schema information"""
    name: str
    fields: List[BusinessObjectField] = field(default_factory=list)
    description: str = ""
    source_file: Optional[Path] = None


class BusinessObjectParser:
    """Parse business object JSON files and extract structure"""
    
    # BAW type mappings
    TYPE_MAPPINGS = {
        'String': 'String',
        'Integer': 'Integer',
        'Decimal': 'Decimal',
        'Boolean': 'Boolean',
        'Date': 'Date',
        'Time': 'Time',
        'DateTime': 'DateTime',
        'ANY': 'ANY',
        'NameValuePair': 'NameValuePair',
        'TWFile': 'TWFile',
        'TWDocument': 'TWDocument'
    }
    
    def __init__(self):
        pass
    
    def parse(self, bo_file: Path) -> BusinessObjectSchema:
        """
        Parse business object from JSON file.
        
        Args:
            bo_file: Path to business object JSON file
            
        Returns:
            BusinessObjectSchema with extracted structure
            
        Raises:
            FileNotFoundError: If file not found
            ValueError: If JSON is invalid
        """
        if not bo_file.exists():
            raise FileNotFoundError(f"Business object file not found: {bo_file}")
        
        try:
            data = json.loads(bo_file.read_text(encoding='utf-8'))
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in {bo_file}: {e}")
        
        # Extract name
        bo_name = data.get("name")
        if not bo_name:
            # Use filename without extension
            bo_name = bo_file.stem
            logger.warning(f"No name in business object, using filename: {bo_name}")
        
        # Extract description
        description = data.get("description", f"{bo_name} business object")
        
        # Parse fields
        fields = self._parse_fields(data.get("fields", []))
        
        schema = BusinessObjectSchema(
            name=bo_name,
            fields=fields,
            description=description,
            source_file=bo_file
        )
        
        logger.info(f"Parsed business object: {bo_name} with {len(fields)} fields")
        return schema
    
    def _parse_fields(self, fields_data: List[Dict]) -> List[BusinessObjectField]:
        """
        Parse field definitions from business object.
        
        Args:
            fields_data: List of field dictionaries
            
        Returns:
            List of BusinessObjectField objects
        """
        fields = []
        for field_data in fields_data:
            field_name = field_data.get("name")
            if not field_name:
                logger.warning("Skipping field without name")
                continue
            
            field_type = field_data.get("type", "String")
            is_list = field_data.get("isList", False)
            is_required = field_data.get("required", False)
            default_value = field_data.get("default")
            
            # Handle nested types (complex objects)
            nested_type = None
            if field_type not in self.TYPE_MAPPINGS:
                nested_type = field_type
                field_type = "ANY"  # Complex type
            
            field = BusinessObjectField(
                name=field_name,
                type=field_type,
                is_list=is_list,
                is_required=is_required,
                default_value=default_value,
                nested_type=nested_type
            )
            fields.append(field)
        
        return fields
    
    def generate_sample_data(self, schema: BusinessObjectSchema) -> Dict[str, Any]:
        """
        Generate sample data for a business object.
        
        Args:
            schema: BusinessObjectSchema to generate data for
            
        Returns:
            Dictionary with sample data
        """
        sample = {}
        
        for field in schema.fields:
            if field.default_value is not None:
                value = field.default_value
            else:
                value = self._get_sample_value(field)
            
            if field.is_list:
                # Create a list with 2-3 sample items
                sample[field.name] = [value, value]
            else:
                sample[field.name] = value
        
        logger.debug(f"Generated sample data for {schema.name}")
        return sample
    
    def _get_sample_value(self, field: BusinessObjectField) -> Any:
        """
        Get sample value for a field based on its type.
        
        Args:
            field: BusinessObjectField to generate value for
            
        Returns:
            Sample value appropriate for the field type
        """
        type_samples = {
            'String': f'Sample {field.name}',
            'Integer': 42,
            'Decimal': 3.14,
            'Boolean': True,
            'Date': '2026-05-03',
            'Time': '14:30:00',
            'DateTime': '2026-05-03T14:30:00Z',
            'ANY': {},
            'NameValuePair': {'name': 'key', 'value': 'value'},
            'TWFile': {'name': 'sample.txt', 'size': 1024},
            'TWDocument': {'id': 'doc-123', 'name': 'sample.pdf'}
        }
        
        return type_samples.get(field.type, f'Sample {field.name}')
    
    def parse_multiple(self, bo_files: List[Path]) -> List[BusinessObjectSchema]:
        """
        Parse multiple business objects.
        
        Args:
            bo_files: List of business object file paths
            
        Returns:
            List of BusinessObjectSchema objects
        """
        schemas = []
        for bo_file in bo_files:
            try:
                schema = self.parse(bo_file)
                schemas.append(schema)
            except Exception as e:
                logger.error(f"Failed to parse business object at {bo_file}: {e}")
        
        logger.info(f"Successfully parsed {len(schemas)} of {len(bo_files)} business objects")
        return schemas
    
    def get_baw_type_declaration(self, schema: BusinessObjectSchema) -> str:
        """
        Get BAW type declaration string for a business object.
        
        Args:
            schema: BusinessObjectSchema
            
        Returns:
            Type declaration string (e.g., "MyBusinessObject")
        """
        return schema.name
    
    def get_variable_declaration(self, schema: BusinessObjectSchema, var_name: str, is_list: bool = False) -> Dict[str, Any]:
        """
        Get variable declaration for use in service flow.
        
        Args:
            schema: BusinessObjectSchema
            var_name: Variable name
            is_list: Whether variable is a list
            
        Returns:
            Dictionary with variable declaration info
        """
        return {
            'name': var_name,
            'type': schema.name,
            'isList': is_list,
            'description': schema.description
        }

# Made with Bob
