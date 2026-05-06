"""
BPMN elements templates for BAW Coach Generator.

Provides functions to create BPMN 2.0 XML elements for service flows.
Based on analysis of BAW 8.6.10.25010 BPMN structure.
"""

from xml.etree import ElementTree as ET
from typing import Optional


def create_definitions_wrapper(process_id: str) -> ET.Element:
    """
    Create BPMN definitions wrapper element.
    
    Args:
        process_id: Process ID reference
        
    Returns:
        XML Element for BPMN definitions
    """
    definitions = ET.Element('definitions')
    definitions.set('xmlns', 'http://www.omg.org/spec/BPMN/20100524/MODEL')
    definitions.set('xmlns:bpmndi', 'http://www.omg.org/spec/BPMN/20100524/DI')
    definitions.set('xmlns:dc', 'http://www.omg.org/spec/DD/20100524/DC')
    definitions.set('xmlns:di', 'http://www.omg.org/spec/DD/20100524/DI')
    definitions.set('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    definitions.set('targetNamespace', 'http://www.ibm.com/bpm')
    definitions.set('typeLanguage', 'http://www.w3.org/2001/XMLSchema')
    definitions.set('expressionLanguage', 'http://www.w3.org/1999/XPath')
    
    # Create process element
    process = ET.SubElement(definitions, 'process')
    process.set('id', process_id)
    process.set('isExecutable', 'true')
    
    return definitions


def create_start_event(event_id: str, name: str = "Start") -> ET.Element:
    """
    Create BPMN start event element.
    
    Args:
        event_id: Event ID
        name: Event name
        
    Returns:
        XML Element for start event
    """
    event = ET.Element('startEvent')
    event.set('id', event_id)
    event.set('name', name)
    
    # Outgoing flow reference (will be set by sequence flow)
    ET.SubElement(event, 'outgoing')
    
    return event


def create_end_event(event_id: str, name: str = "End") -> ET.Element:
    """
    Create BPMN end event element.
    
    Args:
        event_id: Event ID
        name: Event name
        
    Returns:
        XML Element for end event
    """
    event = ET.Element('endEvent')
    event.set('id', event_id)
    event.set('name', name)
    
    # Incoming flow reference (will be set by sequence flow)
    ET.SubElement(event, 'incoming')
    
    return event


def create_form_task(task_id: str, name: str, coach_id: str) -> ET.Element:
    """
    Create BPMN user task (form task) element for coach.
    
    Args:
        task_id: Task ID
        name: Task name
        coach_id: Coach definition ID reference
        
    Returns:
        XML Element for form task
    """
    task = ET.Element('userTask')
    task.set('id', task_id)
    task.set('name', name)
    task.set('implementation', 'coach')
    
    # Incoming and outgoing flow references
    ET.SubElement(task, 'incoming')
    ET.SubElement(task, 'outgoing')
    
    # Coach reference
    coach_ref = ET.SubElement(task, 'coachRef')
    coach_ref.text = coach_id
    
    return task


def create_script_task(task_id: str, name: str, script: str = "") -> ET.Element:
    """
    Create BPMN script task element.
    
    Args:
        task_id: Task ID
        name: Task name
        script: JavaScript code to execute
        
    Returns:
        XML Element for script task
    """
    task = ET.Element('scriptTask')
    task.set('id', task_id)
    task.set('name', name)
    task.set('scriptFormat', 'text/javascript')
    
    # Incoming and outgoing flow references
    ET.SubElement(task, 'incoming')
    ET.SubElement(task, 'outgoing')
    
    # Script content
    if script:
        script_elem = ET.SubElement(task, 'script')
        script_elem.text = script
    
    return task


def create_sequence_flow(flow_id: str, source_ref: str, target_ref: str,
                        name: str = "") -> ET.Element:
    """
    Create BPMN sequence flow element (connection between elements).
    
    Args:
        flow_id: Flow ID
        source_ref: Source element ID
        target_ref: Target element ID
        name: Optional flow name
        
    Returns:
        XML Element for sequence flow
    """
    flow = ET.Element('sequenceFlow')
    flow.set('id', flow_id)
    flow.set('sourceRef', source_ref)
    flow.set('targetRef', target_ref)
    
    if name:
        flow.set('name', name)
    
    return flow


def create_data_object(data_id: str, name: str, type_name: str) -> ET.Element:
    """
    Create BPMN data object element (represents a variable).
    
    Args:
        data_id: Data object ID
        name: Variable name
        type_name: Type name
        
    Returns:
        XML Element for data object
    """
    data_obj = ET.Element('dataObject')
    data_obj.set('id', data_id)
    data_obj.set('name', name)
    
    # Type reference
    type_ref = ET.SubElement(data_obj, 'dataType')
    type_ref.text = type_name
    
    return data_obj


def create_gateway(gateway_id: str, gateway_type: str = "exclusive",
                  name: str = "") -> ET.Element:
    """
    Create BPMN gateway element (decision point).
    
    Args:
        gateway_id: Gateway ID
        gateway_type: Gateway type (exclusive, parallel, inclusive)
        name: Optional gateway name
        
    Returns:
        XML Element for gateway
    """
    gateway_types = {
        'exclusive': 'exclusiveGateway',
        'parallel': 'parallelGateway',
        'inclusive': 'inclusiveGateway'
    }
    
    gateway = ET.Element(gateway_types.get(gateway_type, 'exclusiveGateway'))
    gateway.set('id', gateway_id)
    
    if name:
        gateway.set('name', name)
    
    # Incoming and outgoing flow references
    ET.SubElement(gateway, 'incoming')
    ET.SubElement(gateway, 'outgoing')
    
    return gateway


def create_subprocess(subprocess_id: str, name: str) -> ET.Element:
    """
    Create BPMN subprocess element.
    
    Args:
        subprocess_id: Subprocess ID
        name: Subprocess name
        
    Returns:
        XML Element for subprocess
    """
    subprocess = ET.Element('subProcess')
    subprocess.set('id', subprocess_id)
    subprocess.set('name', name)
    
    # Incoming and outgoing flow references
    ET.SubElement(subprocess, 'incoming')
    ET.SubElement(subprocess, 'outgoing')
    
    return subprocess


def create_boundary_event(event_id: str, attached_to: str,
                         event_type: str = "error") -> ET.Element:
    """
    Create BPMN boundary event (attached to activity).
    
    Args:
        event_id: Event ID
        attached_to: ID of activity this event is attached to
        event_type: Event type (error, timer, message, etc.)
        
    Returns:
        XML Element for boundary event
    """
    event = ET.Element('boundaryEvent')
    event.set('id', event_id)
    event.set('attachedToRef', attached_to)
    event.set('cancelActivity', 'true')
    
    # Add event definition based on type
    if event_type == "error":
        ET.SubElement(event, 'errorEventDefinition')
    elif event_type == "timer":
        ET.SubElement(event, 'timerEventDefinition')
    elif event_type == "message":
        ET.SubElement(event, 'messageEventDefinition')
    
    # Outgoing flow reference
    ET.SubElement(event, 'outgoing')
    
    return event

# Made with Bob
