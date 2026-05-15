"""
BPMN Validator - Validation utilities for BPMN structures
This module provides validation functions to ensure BPMN correctness.
"""

from typing import List, Dict, Set, Tuple
from bpmn_generator import BPMNGenerator


class BPMNValidator:
    """Validator for BPMN process structures"""
    
    def __init__(self, generator: BPMNGenerator):
        """
        Initialize validator with a BPMN generator
        
        Args:
            generator: BPMNGenerator instance to validate
        """
        self.generator = generator
        self.errors = []
        self.warnings = []
    
    def validate(self) -> Tuple[bool, List[str], List[str]]:
        """
        Perform complete validation of the BPMN structure
        
        Returns:
            Tuple of (is_valid, errors, warnings)
        """
        self.errors = []
        self.warnings = []
        
        # Run all validation checks
        self._validate_start_end_events()
        self._validate_sequence_flows()
        self._validate_gateway_connections()
        self._validate_lane_references()
        self._validate_milestone_references()
        self._validate_connectivity()
        self._validate_naming()
        
        is_valid = len(self.errors) == 0
        return is_valid, self.errors, self.warnings
    
    def _validate_start_end_events(self):
        """Validate that process has proper start and end events"""
        start_events = [n for n in self.generator.flow_nodes if n['type'] == 'startEvent']
        end_events = [n for n in self.generator.flow_nodes if n['type'] == 'endEvent']
        
        if len(start_events) == 0:
            self.errors.append("Process must have at least one start event")
        elif len(start_events) > 1:
            self.warnings.append(f"Process has {len(start_events)} start events (multiple start events allowed but uncommon)")
        
        if len(end_events) == 0:
            self.errors.append("Process must have at least one end event")
    
    def _validate_sequence_flows(self):
        """Validate that all sequence flows reference valid elements"""
        node_ids = {node['id'] for node in self.generator.flow_nodes}
        
        for flow in self.generator.sequence_flows:
            if flow['sourceRef'] not in node_ids:
                self.errors.append(f"Sequence flow {flow['id']} references non-existent source: {flow['sourceRef']}")
            
            if flow['targetRef'] not in node_ids:
                self.errors.append(f"Sequence flow {flow['id']} references non-existent target: {flow['targetRef']}")
    
    def _validate_gateway_connections(self):
        """Validate gateway connections"""
        gateways = [n for n in self.generator.flow_nodes 
                   if 'gateway' in n['type'].lower()]
        
        for gateway in gateways:
            gateway_id = gateway['id']
            
            # Count incoming and outgoing flows
            incoming = [f for f in self.generator.sequence_flows if f['targetRef'] == gateway_id]
            outgoing = [f for f in self.generator.sequence_flows if f['sourceRef'] == gateway_id]
            
            if gateway['type'] == 'exclusiveGateway':
                if len(outgoing) < 2:
                    self.warnings.append(f"Exclusive gateway {gateway_id} should have at least 2 outgoing paths")
            
            elif gateway['type'] == 'parallelGateway':
                if len(incoming) == 1 and len(outgoing) < 2:
                    self.warnings.append(f"Parallel gateway {gateway_id} (fork) should have at least 2 outgoing paths")
                elif len(outgoing) == 1 and len(incoming) < 2:
                    self.warnings.append(f"Parallel gateway {gateway_id} (join) should have at least 2 incoming paths")
    
    def _validate_lane_references(self):
        """Validate that lane references point to existing flow nodes"""
        node_ids = {node['id'] for node in self.generator.flow_nodes}
        
        for lane in self.generator.lanes:
            for ref in lane['flowNodeRefs']:
                if ref not in node_ids:
                    self.errors.append(f"Lane '{lane['name']}' references non-existent flow node: {ref}")
    
    def _validate_milestone_references(self):
        """Validate that milestone references point to existing flow nodes"""
        node_ids = {node['id'] for node in self.generator.flow_nodes}
        
        for milestone in self.generator.milestones:
            for ref in milestone['flowNodeRefs']:
                if ref not in node_ids:
                    self.errors.append(f"Milestone '{milestone['name']}' references non-existent flow node: {ref}")
    
    def _validate_connectivity(self):
        """Validate that all nodes are connected in the flow"""
        if not self.generator.flow_nodes:
            return
        
        node_ids = {node['id'] for node in self.generator.flow_nodes}
        
        # Build adjacency list
        connected = set()
        adjacency = {node_id: [] for node_id in node_ids}
        
        for flow in self.generator.sequence_flows:
            adjacency[flow['sourceRef']].append(flow['targetRef'])
            adjacency[flow['targetRef']].append(flow['sourceRef'])
        
        # Find start events
        start_events = [n['id'] for n in self.generator.flow_nodes if n['type'] == 'startEvent']
        
        if not start_events:
            return  # Already reported in _validate_start_end_events
        
        # DFS from start event
        def dfs(node_id):
            if node_id in connected:
                return
            connected.add(node_id)
            for neighbor in adjacency.get(node_id, []):
                dfs(neighbor)
        
        dfs(start_events[0])
        
        # Check for disconnected nodes
        disconnected = node_ids - connected
        if disconnected:
            for node_id in disconnected:
                node = next((n for n in self.generator.flow_nodes if n['id'] == node_id), None)
                node_name = node['name'] if node else node_id
                self.warnings.append(f"Flow node '{node_name}' ({node_id}) is not connected to the main flow")
    
    def _validate_naming(self):
        """Validate naming conventions"""
        for node in self.generator.flow_nodes:
            if not node['name'] or node['name'].strip() == '':
                self.warnings.append(f"Flow node {node['id']} has no name")
        
        # Check for duplicate names
        names = [node['name'] for node in self.generator.flow_nodes if node['name']]
        duplicate_names = [name for name in set(names) if names.count(name) > 1]
        
        if duplicate_names:
            self.warnings.append(f"Duplicate flow node names found: {', '.join(duplicate_names)}")
    
    def get_report(self) -> str:
        """
        Generate a validation report
        
        Returns:
            Formatted validation report string
        """
        is_valid, errors, warnings = self.validate()
        
        report = []
        report.append("=" * 60)
        report.append("BPMN VALIDATION REPORT")
        report.append("=" * 60)
        report.append(f"Process: {self.generator.process_name}")
        report.append(f"Status: {'✓ VALID' if is_valid else '✗ INVALID'}")
        report.append("")
        
        if errors:
            report.append("ERRORS:")
            for i, error in enumerate(errors, 1):
                report.append(f"  {i}. {error}")
            report.append("")
        
        if warnings:
            report.append("WARNINGS:")
            for i, warning in enumerate(warnings, 1):
                report.append(f"  {i}. {warning}")
            report.append("")
        
        if not errors and not warnings:
            report.append("No issues found. Process structure is valid.")
        
        report.append("=" * 60)
        
        return "\n".join(report)


def validate_bpmn(generator: BPMNGenerator) -> Tuple[bool, str]:
    """
    Convenience function to validate a BPMN generator
    
    Args:
        generator: BPMNGenerator instance to validate
        
    Returns:
        Tuple of (is_valid, report_string)
    """
    validator = BPMNValidator(generator)
    is_valid, _, _ = validator.validate()
    report = validator.get_report()
    return is_valid, report

# Made with Bob
