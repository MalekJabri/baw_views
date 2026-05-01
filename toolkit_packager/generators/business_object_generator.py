"""
Business Object XML Generator for BAW Toolkit Packager.
Generates XML for Business Objects (12.xxx.xml).
"""

from typing import Dict, Optional
from datetime import datetime

from .base_generator import BaseGenerator
from ..models import Widget, TWXObject
from ..core import generate_object_id, generate_version_id, escape_xml
from ..utils import get_logger
from ..utils.custom_type_registry import get_custom_type_registry

logger = get_logger(__name__)


class BusinessObjectGenerator(BaseGenerator):
    """
    Generator for Business Object XML files (12.xxx.xml).
    Creates business object definitions from JSON specifications.
    """
    
    def __init__(self, widget: Widget, object_ids: Dict[str, str], bo_definition: dict):
        """
        Initialize business object generator.
        
        Args:
            widget: Widget containing the business object
            object_ids: Dictionary of object IDs
            bo_definition: Business object definition from JSON
        """
        super().__init__(widget, object_ids)
        self.bo_definition = bo_definition
        self.bo_name = bo_definition.get('name', 'BusinessObject')
    
    def generate(self) -> TWXObject:
        """
        Generate business object TWX object.
        Checks custom type registry to reuse existing class IDs if the type was already generated.
        
        Returns:
            TWXObject for business object
        """
        # Check if this business object type already exists in the registry
        registry = get_custom_type_registry()
        existing_class_id = registry.get_type(self.bo_name)
        
        if existing_class_id:
            # Reuse existing class ID
            bo_id = existing_class_id.lstrip('/')  # Remove leading / if present
            logger.info(f"Reusing existing business object '{self.bo_name}' with ID: {bo_id}")
            # Register this widget as using the type
            registry.register_type(
                self.bo_name,
                existing_class_id,
                self.widget.name,
                self.bo_definition.get('description', '')
            )
        else:
            # Generate new ID and register it
            bo_id = generate_object_id(self.bo_name, '12')
            class_id_with_slash = f"/{bo_id}"
            registry.register_type(
                self.bo_name,
                class_id_with_slash,
                self.widget.name,
                self.bo_definition.get('description', '')
            )
            logger.info(f"Created new business object '{self.bo_name}' with ID: {bo_id}")
        
        xml_content = self.generate_business_object_xml(bo_id)
        
        twx_obj = self.create_twx_object(
            object_id=bo_id,
            name=self.bo_name,
            object_type="twClass",
            xml_content=xml_content
        )
        
        self.log_generation("Business Object", bo_id)
        return twx_obj
    
    def generate_business_object_xml(self, bo_id: str) -> str:
        """
        Generate complete business object XML.
        
        Args:
            bo_id: Business object ID
            
        Returns:
            Complete XML string
        """
        timestamp = self.get_timestamp()
        version_id = generate_version_id()
        
        properties = self.bo_definition.get('properties', [])
        properties_xml = self.generate_properties_xml(properties)
        json_data = self.generate_json_data(properties)
        
        xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<teamworks>
    <twClass id="{bo_id}" name="{self.bo_name}">
        <lastModified>{timestamp}</lastModified>
        <lastModifiedBy>bob</lastModifiedBy>
        <tenantId isNull="true" />
        <classId>{bo_id}</classId>
        <type>1</type>
        <isSystem>false</isSystem>
        <shared>false</shared>
        <isShadow>false</isShadow>
        <globalLifetime>false</globalLifetime>
        <internalName isNull="true" />
        <extensionType isNull="true" />
        <saveServiceRef isNull="true" />
        <bpmn2Data isNull="true" />
        <externalId>itm.{bo_id}</externalId>
        <dependencySummary isNull="true" />
        <jsonData>{escape_xml(json_data)}</jsonData>
        <dataName isNull="true" />
        <allowAdditionalProperties>false</allowAdditionalProperties>
        <description isNull="true" />
        <guid>guid:{generate_version_id()}</guid>
        <versionId>{version_id}</versionId>
        <definition>
{properties_xml}
            <validator>
                <className isNull="true" />
                <errorMessage isNull="true" />
                <webWidgetJavaClass isNull="true" />
                <externalType isNull="true" />
                <configData>
                    <schema>
                        <simpleType name="{self.bo_name}">
                            <restriction base="String" />
                        </simpleType>
                    </schema>
                </configData>
            </validator>
            <annotation type="com.lombardisoftware.core.xml.XMLTypeAnnotation" version="2.0">
                <exclude isNull="true" />
                <anonymous isNull="true" />
                <local isNull="true" />
                <name isNull="true" />
                <namespace isNull="true" />
                <elementName isNull="true" />
                <elementNamespace isNull="true" />
                <protoTypeName isNull="true" />
                <baseTypeName isNull="true" />
                <specialType isNull="true" />
                <contentTypeVariety isNull="true" />
                <xscRef isNull="true" />
            </annotation>
        </definition>
    </twClass>
</teamworks>
'''
        return xml
    
    def generate_properties_xml(self, properties: list) -> str:
        """
        Generate XML for business object properties.
        
        Args:
            properties: List of property definitions
            
        Returns:
            XML string for properties
        """
        properties_xml = []
        
        for prop in properties:
            prop_name = prop.get('name', 'property')
            prop_type = prop.get('type', 'String')
            prop_required = str(prop.get('required', False)).lower()
            prop_desc = prop.get('description', '')
            
            # Map type to BAW class reference
            class_ref = self.get_class_ref_for_type(prop_type)
            
            prop_xml = f'''            <property>
                <name>{prop_name}</name>
                <description isNull="true" />
                <classRef>{class_ref}</classRef>
                <arrayProperty>false</arrayProperty>
                <propertyDefault isNull="true" />
                <propertyRequired>{prop_required}</propertyRequired>
                <propertyHidden>false</propertyHidden>
                <annotation type="com.lombardisoftware.core.xml.XMLFieldAnnotation" version="2.0">
                    <exclude isNull="true" />
                    <nodeType isNull="true" />
                    <name isNull="true" />
                    <namespace isNull="true" />
                    <typeName isNull="true" />
                    <typeNamespace isNull="true" />
                    <minOccurs isNull="true" />
                    <maxOccurs isNull="true" />
                    <nillable isNull="true" />
                    <order isNull="true" />
                    <wrapArray isNull="true" />
                    <arrayTypeName isNull="true" />
                    <arrayTypeAnonymous isNull="true" />
                    <arrayItemName isNull="true" />
                    <arrayItemWildcard isNull="true" />
                    <wildcard isNull="true" />
                    <wildcardVariety isNull="true" />
                    <wildcardMode isNull="true" />
                    <wildcardNamespace isNull="true" />
                    <parentModelGroupCompositor isNull="true" />
                    <timeZone isNull="true" />
                </annotation>
            </property>'''
            
            properties_xml.append(prop_xml)
        
        return '\n'.join(properties_xml)
    
    def generate_json_data(self, properties: list) -> str:
        """
        Generate JSON data for business object.
        
        Args:
            properties: List of property definitions
            
        Returns:
            JSON string
        """
        import json
        
        elements = []
        for prop in properties:
            prop_name = prop.get('name', 'property')
            prop_type = prop.get('type', 'String')
            prop_required = prop.get('required', False)
            prop_desc = prop.get('description', '')
            
            element = {
                "annotation": {
                    "documentation": [{}],
                    "appinfo": [{
                        "propertyName": [prop_name],
                        "propertyRequired": [prop_required],
                        "propertyHidden": [False],
                        "advancedParameterProperties": [{}]
                    }]
                },
                "name": prop_name,
                "type": "{http://lombardi.ibm.com/schema/}String",
                "otherAttributes": {
                    "{http://www.ibm.com/bpmsdk}refid": "12.db884a3c-c533-44b7-bb2d-47bec8ad4022"
                }
            }
            elements.append(element)
        
        json_data = {
            "attributeFormDefault": "unqualified",
            "elementFormDefault": "unqualified",
            "targetNamespace": "http://CW",
            "complexType": [{
                "annotation": {
                    "documentation": [{}],
                    "appinfo": [{
                        "shared": [False],
                        "advancedProperties": [{}],
                        "shadow": [False],
                        "allowAdditionalProperties": [False]
                    }]
                },
                "sequence": {
                    "element": elements
                },
                "name": self.bo_name
            }],
            "id": f"_12.{generate_version_id()}"
        }
        
        return json.dumps(json_data, separators=(',', ':'))
    
    def get_class_ref_for_type(self, prop_type: str) -> str:
        """
        Get BAW class reference for a property type.
        
        Args:
            prop_type: Property type (String, Integer, Boolean, etc.)
            
        Returns:
            Class reference string
        """
        type_mapping = {
            'String': '0594de47-b0cd-452b-a221-95dc16247e72/12.db884a3c-c533-44b7-bb2d-47bec8ad4022',
            'Integer': '0594de47-b0cd-452b-a221-95dc16247e72/12.3fa0d7a0-828a-4d60-99cc-db5ed143fc2d',
            'Boolean': '0594de47-b0cd-452b-a221-95dc16247e72/12.83ff975e-8dbc-42e5-b738-fa8bc08274a2',
            'Decimal': '0594de47-b0cd-452b-a221-95dc16247e72/12.c0e8e1c5-c2f5-4c3e-b4e5-5e5e5e5e5e5e',
            'Date': '0594de47-b0cd-452b-a221-95dc16247e72/12.d0e8e1c5-c2f5-4c3e-b4e5-5e5e5e5e5e5e',
        }
        
        return type_mapping.get(prop_type, type_mapping['String'])


# Made with Bob