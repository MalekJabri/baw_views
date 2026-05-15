"""
BPMN XML Builder - Core module for generating BPMN 2.0 XML files
This module provides the low-level XML building functionality for BPMN workflows.
Used internally by generate_bpmn.py to create valid BPMN 2.0 XML structure.
"""

import uuid
from typing import List, Dict, Optional, Tuple
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom


class BPMNGenerator:
    """Main class for generating BPMN 2.0 compliant XML files"""
    
    def __init__(self, process_name: str, process_id: Optional[str] = None):
        """
        Initialize BPMN Generator
        
        Args:
            process_name: Name of the business process
            process_id: Optional custom process ID (auto-generated if not provided)
        """
        self.process_name = process_name
        self.process_id = process_id or f"process-{self._generate_id()}"
        self.definition_id = f"definitions-{self._generate_id()}"
        self.diagram_id = f"diagram-{self._generate_id()}"
        
        # Storage for process elements
        self.flow_nodes = []
        self.sequence_flows = []
        self.lanes = []
        self.milestones = []
        
        # Namespaces
        self.namespaces = {
            'xmlns': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
            'xmlns:ns2': 'http://www.ibm.com/bpm/Extensions',
            'xmlns:ns3': 'http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/process',
            'xmlns:ns4': 'http://www.omg.org/spec/DD/20100524/DI',
            'xmlns:ns5': 'http://www.omg.org/spec/DD/20100524/DC',
            'xmlns:ns6': 'http://www.omg.org/spec/BPMN/20100524/DI',
            'targetNamespace': f'http://www.ibm.com/bpm/process/{self.process_id}',
            'exporter': 'BPMN_tools Python Generator',
            'exporterVersion': '1.0'
        }
    
    def _generate_id(self) -> str:
        """Generate a unique ID for BPMN elements"""
        return str(uuid.uuid4())
    
    def add_start_event(self, name: str = "Start", event_id: Optional[str] = None) -> str:
        """
        Add a start event to the process
        
        Args:
            name: Name of the start event
            event_id: Optional custom ID
            
        Returns:
            The ID of the created start event
        """
        event_id = event_id or f"start-{self._generate_id()}"
        self.flow_nodes.append({
            'type': 'startEvent',
            'id': event_id,
            'name': name,
            'lane': None
        })
        return event_id
    
    def add_end_event(self, name: str = "End", event_id: Optional[str] = None) -> str:
        """
        Add an end event to the process
        
        Args:
            name: Name of the end event
            event_id: Optional custom ID
            
        Returns:
            The ID of the created end event
        """
        event_id = event_id or f"end-{self._generate_id()}"
        self.flow_nodes.append({
            'type': 'endEvent',
            'id': event_id,
            'name': name,
            'lane': None
        })
        return event_id
    
    def add_user_task(self, name: str, performer: Optional[str] = None, 
                      task_id: Optional[str] = None, lane: Optional[str] = None) -> str:
        """
        Add a user task to the process
        
        Args:
            name: Name of the task
            performer: Name of the role/person performing the task
            task_id: Optional custom ID
            lane: Lane ID this task belongs to
            
        Returns:
            The ID of the created user task
        """
        task_id = task_id or f"userTask-{self._generate_id()}"
        self.flow_nodes.append({
            'type': 'userTask',
            'id': task_id,
            'name': name,
            'performer': performer,
            'lane': lane
        })
        return task_id
    
    def add_service_task(self, name: str, task_id: Optional[str] = None, 
                        lane: Optional[str] = None) -> str:
        """
        Add a service task (automated) to the process
        
        Args:
            name: Name of the task
            task_id: Optional custom ID
            lane: Lane ID this task belongs to
            
        Returns:
            The ID of the created service task
        """
        task_id = task_id or f"serviceTask-{self._generate_id()}"
        self.flow_nodes.append({
            'type': 'serviceTask',
            'id': task_id,
            'name': name,
            'lane': lane
        })
        return task_id
    
    def add_exclusive_gateway(self, name: str = "", gateway_id: Optional[str] = None) -> str:
        """
        Add an exclusive gateway (XOR - one path chosen)
        
        Args:
            name: Name of the gateway
            gateway_id: Optional custom ID
            
        Returns:
            The ID of the created gateway
        """
        gateway_id = gateway_id or f"exclusiveGateway-{self._generate_id()}"
        self.flow_nodes.append({
            'type': 'exclusiveGateway',
            'id': gateway_id,
            'name': name,
            'lane': None
        })
        return gateway_id
    
    def add_parallel_gateway(self, name: str = "", gateway_id: Optional[str] = None) -> str:
        """
        Add a parallel gateway (AND - all paths executed)
        
        Args:
            name: Name of the gateway
            gateway_id: Optional custom ID
            
        Returns:
            The ID of the created gateway
        """
        gateway_id = gateway_id or f"parallelGateway-{self._generate_id()}"
        self.flow_nodes.append({
            'type': 'parallelGateway',
            'id': gateway_id,
            'name': name,
            'lane': None
        })
        return gateway_id
    
    def add_sequence_flow(self, source_id: str, target_id: str, 
                         name: str = "", condition: Optional[str] = None,
                         flow_id: Optional[str] = None) -> str:
        """
        Add a sequence flow connecting two elements
        
        Args:
            source_id: ID of the source element
            target_id: ID of the target element
            name: Optional name for the flow (useful for gateway conditions)
            condition: Optional condition expression
            flow_id: Optional custom ID
            
        Returns:
            The ID of the created sequence flow
        """
        flow_id = flow_id or f"flow-{self._generate_id()}"
        self.sequence_flows.append({
            'id': flow_id,
            'sourceRef': source_id,
            'targetRef': target_id,
            'name': name,
            'condition': condition
        })
        return flow_id
    
    def add_lane(self, name: str, flow_node_refs: List[str], 
                 lane_id: Optional[str] = None) -> str:
        """
        Add a swimlane to organize tasks by role/department
        
        Args:
            name: Name of the lane (e.g., "Claims Analyst")
            flow_node_refs: List of flow node IDs in this lane
            lane_id: Optional custom ID
            
        Returns:
            The ID of the created lane
        """
        lane_id = lane_id or f"lane-{self._generate_id()}"
        self.lanes.append({
            'id': lane_id,
            'name': name,
            'flowNodeRefs': flow_node_refs
        })
        return lane_id
    
    def add_milestone(self, name: str, flow_node_refs: List[str],
                     milestone_id: Optional[str] = None) -> str:
        """
        Add a milestone (IBM BPM extension) to group activities
        
        Args:
            name: Name of the milestone
            flow_node_refs: List of flow node IDs in this milestone
            milestone_id: Optional custom ID
            
        Returns:
            The ID of the created milestone
        """
        milestone_id = milestone_id or f"milestone-{self._generate_id()}"
        self.milestones.append({
            'id': milestone_id,
            'name': name,
            'flowNodeRefs': flow_node_refs
        })
        return milestone_id
    
    def generate_xml(self) -> str:
        """
        Generate the complete BPMN 2.0 XML
        
        Returns:
            Formatted XML string
        """
        # Create root definitions element
        definitions = Element('definitions', self.namespaces)
        definitions.set('id', self.definition_id)
        
        # Create process element
        process = SubElement(definitions, 'process')
        process.set('id', self.process_id)
        process.set('name', self.process_name)
        process.set('processType', 'Private')
        process.set('isExecutable', 'true')
        
        # Add extension elements (milestones)
        if self.milestones:
            ext_elements = SubElement(process, 'extensionElements')
            bpm_attrs = SubElement(ext_elements, '{http://www.ibm.com/bpm/Extensions}bpmAttributes')
            milestones_elem = SubElement(bpm_attrs, '{http://www.ibm.com/bpm/Extensions}milestones')
            
            for milestone in self.milestones:
                ms_elem = SubElement(milestones_elem, '{http://www.ibm.com/bpm/Extensions}milestone')
                ms_elem.set('id', milestone['id'])
                ms_elem.set('name', milestone['name'])
                for ref in milestone['flowNodeRefs']:
                    ref_elem = SubElement(ms_elem, 'flowNodeRef')
                    ref_elem.text = ref
        
        # Add lanes
        if self.lanes:
            lane_set = SubElement(process, 'laneSet')
            lane_set.set('id', f"laneSet-{self._generate_id()}")
            
            for lane in self.lanes:
                lane_elem = SubElement(lane_set, 'lane')
                lane_elem.set('id', lane['id'])
                lane_elem.set('name', lane['name'])
                for ref in lane['flowNodeRefs']:
                    ref_elem = SubElement(lane_elem, 'flowNodeRef')
                    ref_elem.text = ref
        
        # Add sequence flows
        for flow in self.sequence_flows:
            flow_elem = SubElement(process, 'sequenceFlow')
            flow_elem.set('id', flow['id'])
            flow_elem.set('sourceRef', flow['sourceRef'])
            flow_elem.set('targetRef', flow['targetRef'])
            if flow['name']:
                flow_elem.set('name', flow['name'])
            if flow['condition']:
                condition_elem = SubElement(flow_elem, 'conditionExpression')
                condition_elem.text = flow['condition']
        
        # Add flow nodes
        for node in self.flow_nodes:
            node_elem = SubElement(process, node['type'])
            node_elem.set('id', node['id'])
            node_elem.set('name', node['name'])
            
            # Add performer for user tasks
            if node['type'] == 'userTask' and node.get('performer'):
                performer_elem = SubElement(node_elem, 'performer')
                performer_elem.set('name', node['performer'])
        
        # Pretty print XML
        xml_str = minidom.parseString(tostring(definitions)).toprettyxml(indent="    ")
        return xml_str
    
    def save_to_file(self, filename: str):
        """
        Save the generated BPMN to a file
        
        Args:
            filename: Path to save the BPMN file
        """
        xml_content = self.generate_xml()
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(xml_content)
        print(f"BPMN file saved to: {filename}")
    
    def get_summary(self) -> Dict:
        """
        Get a summary of the process structure
        
        Returns:
            Dictionary with process statistics
        """
        node_types = {}
        for node in self.flow_nodes:
            node_type = node['type']
            node_types[node_type] = node_types.get(node_type, 0) + 1
        
        return {
            'process_name': self.process_name,
            'process_id': self.process_id,
            'total_flow_nodes': len(self.flow_nodes),
            'node_types': node_types,
            'sequence_flows': len(self.sequence_flows),
            'lanes': len(self.lanes),
            'milestones': len(self.milestones)
        }

# Made with Bob
