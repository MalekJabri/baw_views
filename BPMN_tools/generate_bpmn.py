"""
Generate BPMN - Main tool for generating BPMN XML from JSON configurations
This module loads JSON configs (created by GenAI/users) and generates valid BPMN 2.0 XML.
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from bpmn_xml_builder import BPMNGenerator


class ConfigLoader:
    """Load BPMN configurations from JSON files and generate BPMN XML"""
    
    def __init__(self, standard_mode: bool = False):
        """
        Initialize the config loader
        
        Args:
            standard_mode: If True, generate standard BPMN 2.0 without IBM extensions
        """
        self.generator = None
        self.config = None
        self.element_map = {}  # Maps config IDs to generator IDs
        self.standard_mode = standard_mode
        
    def load_config(self, config_path: str) -> Dict[str, Any]:
        """
        Load BPMN configuration from JSON file
        
        Args:
            config_path: Path to the JSON config file
            
        Returns:
            Loaded configuration dictionary
            
        Raises:
            FileNotFoundError: If config file doesn't exist
            json.JSONDecodeError: If config file is invalid JSON
        """
        config_file = Path(config_path)
        if not config_file.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        
        with open(config_file, 'r') as f:
            self.config = json.load(f)
        
        return self.config
    
    def validate_config(self, config: Optional[Dict[str, Any]] = None) -> List[str]:
        """
        Validate configuration structure and references
        
        Args:
            config: Configuration to validate (uses loaded config if not provided)
            
        Returns:
            List of validation errors (empty if valid)
        """
        errors = []
        cfg = config or self.config
        
        if not cfg:
            return ["No configuration loaded"]
        
        # Check required sections
        required_sections = ['process', 'roles', 'elements', 'flows']
        for section in required_sections:
            if section not in cfg:
                errors.append(f"Missing required section: {section}")
        
        if errors:
            return errors
        
        # Collect all element IDs
        element_ids = {elem['id'] for elem in cfg.get('elements', [])}
        
        # Validate flows reference existing elements
        for flow in cfg.get('flows', []):
            source = flow.get('sourceRef')
            target = flow.get('targetRef')
            
            if source not in element_ids:
                errors.append(f"Flow {flow['id']} references non-existent source: {source}")
            if target not in element_ids:
                errors.append(f"Flow {flow['id']} references non-existent target: {target}")
        
        # Validate lanes reference existing elements
        for lane in cfg.get('lanes', []):
            for node_ref in lane.get('flowNodeRefs', []):
                if node_ref not in element_ids:
                    errors.append(f"Lane {lane['id']} references non-existent element: {node_ref}")
        
        # Validate task assignees reference existing roles
        role_ids = {role['id'] for role in cfg.get('roles', [])}
        for elem in cfg.get('elements', []):
            if elem['type'] in ['userTask', 'serviceTask']:
                assignee = elem.get('assignee')
                if assignee and assignee not in role_ids:
                    errors.append(f"Task {elem['id']} references non-existent role: {assignee}")
        
        return errors
    
    def generate_from_config(self, config_path: Optional[str] = None) -> str:
        """
        Generate BPMN XML from configuration file
        
        Args:
            config_path: Path to config file (uses loaded config if not provided)
            
        Returns:
            Generated BPMN XML as string
            
        Raises:
            ValueError: If configuration is invalid
        """
        # Load config if path provided
        if config_path:
            self.load_config(config_path)
        
        if not self.config:
            raise ValueError("No configuration loaded. Call load_config() first.")
        
        # Validate configuration
        errors = self.validate_config()
        if errors:
            raise ValueError(f"Configuration validation failed:\n" + "\n".join(errors))
        
        # Initialize generator
        process_info = self.config['process']
        self.generator = BPMNGenerator(
            process_name=process_info['name'],
            process_id=process_info['id'],
            standard_mode=self.standard_mode
        )
        
        # Add roles as lanes if lanes section exists
        if 'lanes' in self.config:
            self._create_lanes()
        
        # Add milestones if present
        if 'milestones' in self.config:
            self._add_milestones()
        
        # Create all elements
        self._create_elements()
        
        # Create all flows
        self._create_flows()
        
        # Generate and return XML
        return self.generator.generate_xml()
    
    def _create_lanes(self):
        """Create swimlanes from config"""
        for lane in self.config.get('lanes', []):
            lane_id = lane['id']
            lane_name = lane['name']
            flow_node_refs = lane.get('flowNodeRefs', [])
            
            # Add lane to generator
            self.generator.add_lane(lane_name, flow_node_refs, lane_id)
            self.element_map[lane_id] = lane_id
    
    def _add_milestones(self):
        """Add milestones from config"""
        # Milestones need flow_node_refs, which we'll collect after creating elements
        # For now, just store milestone info
        pass
    
    def _create_elements(self):
        """Create all BPMN elements from config"""
        for elem in self.config['elements']:
            elem_type = elem['type']
            elem_id = elem['id']
            elem_name = elem['name']
            
            # Determine lane assignment
            lane_id = self._find_lane_for_element(elem_id)
            
            # Create element based on type
            if elem_type == 'startEvent':
                gen_id = self.generator.add_start_event(elem_name, elem_id)
            
            elif elem_type == 'endEvent':
                gen_id = self.generator.add_end_event(elem_name, elem_id)
            
            elif elem_type == 'userTask':
                performer = self._get_role_name(elem.get('assignee'))
                gen_id = self.generator.add_user_task(
                    name=elem_name,
                    performer=performer,
                    task_id=elem_id,
                    lane=lane_id
                )
            
            elif elem_type == 'serviceTask':
                gen_id = self.generator.add_service_task(
                    name=elem_name,
                    task_id=elem_id,
                    lane=lane_id
                )
            
            elif elem_type == 'scriptTask':
                # Treat as service task (generator doesn't have script task)
                gen_id = self.generator.add_service_task(
                    name=elem_name,
                    task_id=elem_id,
                    lane=lane_id
                )
            
            elif elem_type == 'manualTask':
                # Treat as user task (generator doesn't have manual task)
                performer = self._get_role_name(elem.get('assignee'))
                gen_id = self.generator.add_user_task(
                    name=elem_name,
                    performer=performer,
                    task_id=elem_id,
                    lane=lane_id
                )
            
            elif elem_type == 'exclusiveGateway':
                gen_id = self.generator.add_exclusive_gateway(
                    name=elem_name,
                    gateway_id=elem_id
                )
            
            elif elem_type == 'parallelGateway':
                gen_id = self.generator.add_parallel_gateway(
                    name=elem_name,
                    gateway_id=elem_id
                )
            
            elif elem_type == 'inclusiveGateway':
                # Treat as exclusive gateway (generator doesn't have inclusive)
                gen_id = self.generator.add_exclusive_gateway(
                    name=elem_name,
                    gateway_id=elem_id
                )
            
            else:
                raise ValueError(f"Unsupported element type: {elem_type}")
            
            # Map config ID to generator ID
            self.element_map[elem_id] = gen_id
    
    def _create_flows(self):
        """Create all sequence flows from config"""
        for flow in self.config['flows']:
            flow_id = flow['id']
            source_ref = flow['sourceRef']
            target_ref = flow['targetRef']
            flow_name = flow.get('name', '')
            condition = flow.get('conditionExpression', '')
            
            # Get mapped IDs
            source_id = self.element_map.get(source_ref, source_ref)
            target_id = self.element_map.get(target_ref, target_ref)
            
            # Add flow
            self.generator.add_sequence_flow(
                source_id=source_id,
                target_id=target_id,
                flow_id=flow_id,
                name=flow_name,
                condition=condition if condition else None
            )
    
    def _find_lane_for_element(self, element_id: str) -> Optional[str]:
        """Find which lane an element belongs to"""
        for lane in self.config.get('lanes', []):
            if element_id in lane.get('flowNodeRefs', []):
                return lane['id']
        return None
    
    def _get_role_name(self, role_id: Optional[str]) -> Optional[str]:
        """Get role name from role ID"""
        if not role_id:
            return None
        
        for role in self.config.get('roles', []):
            if role['id'] == role_id:
                return role['name']
        
        return None
    
    def save_bpmn(self, output_path: str, config_path: Optional[str] = None):
        """
        Generate BPMN XML and save to file
        
        Args:
            output_path: Path where BPMN XML file will be saved
            config_path: Optional path to config file (uses loaded config if not provided)
        """
        xml_content = self.generate_from_config(config_path)
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(xml_content)
        
        print(f"BPMN XML saved to: {output_path}")


def generate_bpmn_from_config(config_path: str, output_path: str, generate_preview: bool = True) -> tuple[str, Optional[str]]:
    """
    Generate BPMN XML from config file - creates both IBM BAW and standard preview versions by default
    
    Args:
        config_path: Path to JSON config file
        output_path: Path where IBM BAW BPMN XML will be saved
        generate_preview: If True (default), also generate standard BPMN 2.0 preview version
        
    Returns:
        Tuple of (IBM BAW XML, Standard preview XML or None)
    """
    # Generate IBM BAW version
    loader_ibm = ConfigLoader(standard_mode=False)
    loader_ibm.load_config(config_path)
    loader_ibm.save_bpmn(output_path)
    ibm_xml = loader_ibm.generator.generate_xml()
    
    preview_xml = None
    if generate_preview:
        # Generate standard BPMN 2.0 preview version
        output_file = Path(output_path)
        preview_path = output_file.parent / f"{output_file.stem}-preview{output_file.suffix}"
        
        loader_standard = ConfigLoader(standard_mode=True)
        loader_standard.load_config(config_path)
        loader_standard.save_bpmn(str(preview_path))
        preview_xml = loader_standard.generator.generate_xml()
        
        print(f"📋 Standard BPMN 2.0 preview saved to: {preview_path}")
    
    return ibm_xml, preview_xml


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python generate_bpmn.py <config_file.json> <output_file.bpmn>")
        print("\nGenerates two versions by default:")
        print("  1. <output_file.bpmn> - IBM BAW version with extensions")
        print("  2. <output_file-preview.bpmn> - Standard BPMN 2.0 for generic viewers")
        print("\nExample:")
        print("  python generate_bpmn.py business-processes/configs/Insurance/SimpleClaimSubmission.bpmn-config.json output.bpmn")
        print("\nOutput:")
        print("  - output.bpmn (IBM BAW)")
        print("  - output-preview.bpmn (Standard BPMN 2.0)")
        sys.exit(1)
    
    config_file = sys.argv[1]
    output_file = sys.argv[2]
    
    try:
        ibm_xml, preview_xml = generate_bpmn_from_config(config_file, output_file, generate_preview=True)
        print(f"\n✅ Successfully generated BPMN files from {config_file}")
        print(f"   📦 IBM BAW version: {output_file}")
        if preview_xml:
            output_path = Path(output_file)
            preview_path = output_path.parent / f"{output_path.stem}-preview{output_path.suffix}"
            print(f"   📋 Standard BPMN 2.0 preview: {preview_path}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

# Made with Bob
