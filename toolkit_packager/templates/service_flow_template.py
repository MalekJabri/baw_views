"""
Service Flow XML templates for BAW Coach Generator.

Provides functions to create XML elements for BAW service flows.
Based on analysis of BAW 8.6.10.25010 service flow structure.
"""

from xml.etree import ElementTree as ET
from typing import Optional
import uuid
import random


def create_root(process_id: str, name: str, description: str = "") -> ET.Element:
    """
    Create root <teamworks> element with nested <process> for service flow.
    
    Args:
        process_id: Process ID (format: 1.{guid})
        name: Service flow name
        description: Optional description
        
    Returns:
        XML Element for root teamworks element
    """
    # Create teamworks root wrapper (required by BAW)
    teamworks = ET.Element('teamworks')
    
    # Create process element inside teamworks
    process = ET.SubElement(teamworks, 'process')
    process.set('id', process_id)
    process.set('name', name)
    
    # Add basic metadata
    ET.SubElement(process, 'processId').text = process_id
    ET.SubElement(process, 'processType').text = '10'  # Service flow type (10 = service flow that can be packaged in toolkits)
    ET.SubElement(process, 'isRootProcess').text = 'false'
    ET.SubElement(process, 'isErrorHandlerEnabled').text = 'false'
    ET.SubElement(process, 'isLoggingVariables').text = 'false'
    ET.SubElement(process, 'isTransactional').text = 'false'
    ET.SubElement(process, 'exposedType').text = '0'
    ET.SubElement(process, 'isTrackingEnabled').text = 'true'
    ET.SubElement(process, 'cachingType').text = 'false'
    ET.SubElement(process, 'mobileReady').text = 'false'
    ET.SubElement(process, 'sboSyncEnabled').text = 'true'
    ET.SubElement(process, 'isSecured').text = 'false'
    ET.SubElement(process, 'isAjaxExposed').text = 'false'
    ET.SubElement(process, 'isInvokedAsynchronously').text = 'false'
    ET.SubElement(process, 'isTransactionalFlow').text = 'false'
    
    if description:
        ET.SubElement(process, 'description').text = description
    else:
        desc = ET.SubElement(process, 'description')
        desc.set('isNull', 'true')
    
    # Add required guid element (BAW format: guid:hex-hex-hex:hex:hex:-hex)
    guid_value = f"guid:{uuid.uuid4().hex[:16]}:{random.randint(0x1000000, 0x7fffffff):x}:{uuid.uuid4().hex[:11]}:-{random.randint(0x1000, 0x7fff):x}"
    ET.SubElement(process, 'guid').text = guid_value
    
    # Add versionId (UUID format)
    ET.SubElement(process, 'versionId').text = str(uuid.uuid4())
    
    # Add dependencySummary (null)
    dep_summary = ET.SubElement(process, 'dependencySummary')
    dep_summary.set('isNull', 'true')
    
    return teamworks


def create_process_variable(var_id: str, name: str, type_name: str,
                           is_list: bool = False, process_id: Optional[str] = None,
                           seq: int = 1) -> ET.Element:
    """
    Create processVariable element (for private/local variables).
    
    Args:
        var_id: Variable ID (format: 2056.{guid})
        name: Variable name
        type_name: Type name (e.g., "String", "Integer", or business object name)
        is_list: Whether variable is a list
        process_id: Process ID (optional, for processId field)
        seq: Sequence number
        
    Returns:
        XML Element for process variable
    """
    var = ET.Element('processVariable')
    var.set('name', name)
    
    # Add null fields first (matching BAW structure)
    last_modified = ET.SubElement(var, 'lastModified')
    last_modified.set('isNull', 'true')
    last_modified_by = ET.SubElement(var, 'lastModifiedBy')
    last_modified_by.set('isNull', 'true')
    tenant_id = ET.SubElement(var, 'tenantId')
    tenant_id.set('isNull', 'true')
    
    # Core fields
    ET.SubElement(var, 'processVariableId').text = var_id
    
    description = ET.SubElement(var, 'description')
    description.set('isNull', 'true')
    
    if process_id:
        ET.SubElement(var, 'processId').text = process_id
    
    ET.SubElement(var, 'namespace').text = '2'  # Local variable
    ET.SubElement(var, 'seq').text = str(seq)
    ET.SubElement(var, 'isArrayOf').text = str(is_list).lower()
    ET.SubElement(var, 'isTransient').text = 'false'
    ET.SubElement(var, 'classId').text = type_name
    ET.SubElement(var, 'hasDefault').text = 'false'
    
    default_val = ET.SubElement(var, 'defaultValue')
    default_val.set('isNull', 'true')
    
    # Add guid and versionId
    guid_value = f"guid:{uuid.uuid4().hex[:8]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:12]}"
    ET.SubElement(var, 'guid').text = guid_value
    ET.SubElement(var, 'versionId').text = str(uuid.uuid4())
    
    return var


def create_process_parameter(param_id: str, name: str, type_name: str,
                            is_list: bool = False, param_type: int = 1) -> ET.Element:
    """
    Create processParameter element (input/output parameter).
    
    Args:
        param_id: Parameter ID (format: 61.{guid})
        name: Parameter name
        type_name: Type name
        is_list: Whether parameter is a list
        param_type: Parameter type (1 = input, 2 = output)
        
    Returns:
        XML Element for process parameter
    """
    param = ET.Element('processParameter')
    param.set('name', name)
    
    ET.SubElement(param, 'processParameterId').text = param_id
    ET.SubElement(param, 'parameterType').text = str(param_type)
    ET.SubElement(param, 'isArrayOf').text = str(is_list).lower()
    ET.SubElement(param, 'classId').text = type_name
    ET.SubElement(param, 'hasDefault').text = 'true'
    ET.SubElement(param, 'isLocked').text = 'false'
    
    default_val = ET.SubElement(param, 'defaultValue')
    default_val.set('isNull', 'true')
    
    return param


def create_item(item_id: str, name: str, component_id: str,
               item_type: str = "CoachFlowWrapper") -> ET.Element:
    """
    Create process item element.
    
    Args:
        item_id: Item ID (always uses 2025.{guid} prefix for all process items)
        name: Item name
        component_id: Component ID (FormTask_xxx for CoachFlowWrapper, 3008.xxx for ExitPoint)
        item_type: Item type (CoachFlowWrapper, ExitPoint, etc.)
        
    Returns:
        XML Element for process item
    """
    item = ET.Element('item')
    
    ET.SubElement(item, 'processItemId').text = item_id
    ET.SubElement(item, 'name').text = name
    ET.SubElement(item, 'tWComponentName').text = item_type
    ET.SubElement(item, 'tWComponentId').text = component_id
    
    ET.SubElement(item, 'isLogEnabled').text = 'false'
    ET.SubElement(item, 'isTraceEnabled').text = 'false'
    ET.SubElement(item, 'isErrorHandlerEnabled').text = 'false'
    ET.SubElement(item, 'saveExecutionContext').text = 'true'
    
    # Layout data with errorLink
    layout = ET.SubElement(item, 'layoutData')
    layout.set('x', '0')
    layout.set('y', '0')
    
    # Add errorLink element (required)
    error_link = ET.SubElement(layout, 'errorLink')
    ET.SubElement(error_link, 'controlPoints')
    ET.SubElement(error_link, 'showEndState').text = 'false'
    ET.SubElement(error_link, 'showName').text = 'false'
    
    # Add TWComponent element (required for all items)
    if item_type == "ExitPoint":
        # ExitPoint needs populated TWComponent
        tw_component = ET.SubElement(item, 'TWComponent')
        ET.SubElement(tw_component, 'exitPointId').text = component_id
        ET.SubElement(tw_component, 'haltProcess').text = 'false'
        # Generate guid and versionId for the component
        guid_value = f"guid:{uuid.uuid4().hex[:8]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:12]}"
        ET.SubElement(tw_component, 'guid').text = guid_value
        ET.SubElement(tw_component, 'versionId').text = str(uuid.uuid4())
    else:
        # CoachFlowWrapper and other items need empty TWComponent
        ET.SubElement(item, 'TWComponent')
    
    return item


def create_link(source_id: str, target_id: str, name: str = "Flow") -> ET.Element:
    """
    Create link element (connection between items).
    
    Args:
        source_id: Source item ID
        target_id: Target item ID
        name: Link name
        
    Returns:
        XML Element for link
    """
    link = ET.Element('link')
    link.set('name', name)
    
    ET.SubElement(link, 'fromProcessItemId').text = source_id
    ET.SubElement(link, 'toProcessItemId').text = target_id
    ET.SubElement(link, 'endStateId').text = 'Out'
    
    # Layout data
    layout = ET.SubElement(link, 'layoutData')
    ET.SubElement(layout, 'controlPoints')
    ET.SubElement(layout, 'showEndState').text = 'false'
    ET.SubElement(layout, 'showName').text = 'false'
    
    return link

# Made with Bob
