"""
Service flow generator for BAW Coach Generator.

Main orchestrator that generates complete service flow XML files
containing test coaches with composed widgets.
"""

from pathlib import Path
from typing import List, Dict, Optional, Any
from xml.etree import ElementTree as ET

from ..parsers import WidgetSchemaParser, BusinessObjectParser, WidgetSchema
from ..templates import service_flow_template as sf_template
from ..templates import bpmn_elements as bpmn
from ..templates import widget_layout as layout
from .service_flow_registry import create_service_flow_registry, ServiceFlowRegistry
from ..utils.logger import get_logger

logger = get_logger(__name__)


class ServiceFlowGenerator:
    """Generate BAW service flows with test coaches"""
    
    def __init__(self, service_flow_name: str):
        """
        Initialize service flow generator.
        
        Args:
            service_flow_name: Name of the service flow to generate
        """
        self.service_flow_name = service_flow_name
        self.registry = create_service_flow_registry(service_flow_name)
        self.widget_parser = WidgetSchemaParser()
        self.bo_parser = BusinessObjectParser()
        
        # Collected data
        self.widgets: List[WidgetSchema] = []
        self.variables: Dict[str, Any] = {}
        self.business_objects: Dict[str, Any] = {}
        
        logger.info(f"Initialized ServiceFlowGenerator: {service_flow_name}")
    
    def add_widgets(self, widget_paths: List[Path]) -> 'ServiceFlowGenerator':
        """
        Add widgets to the service flow.
        
        Args:
            widget_paths: List of paths to widget directories
            
        Returns:
            Self for method chaining
        """
        self.widgets = self.widget_parser.parse_multiple(widget_paths)
        logger.info(f"Added {len(self.widgets)} widgets to service flow")
        
        # Parse business objects for each widget
        for widget in self.widgets:
            if widget.business_objects and widget.widget_path:
                for bo_name in widget.business_objects:
                    bo_file = self.widget_parser.get_business_object_file(
                        widget.widget_path, bo_name
                    )
                    if bo_file:
                        try:
                            bo_schema = self.bo_parser.parse(bo_file)
                            self.business_objects[bo_name] = bo_schema
                            logger.debug(f"Parsed business object: {bo_name}")
                        except Exception as e:
                            logger.error(f"Failed to parse business object {bo_name}: {e}")
        
        return self
    
    def generate(self) -> ET.Element:
        """
        Generate the complete service flow XML.
        
        Returns:
            XML Element representing the service flow (teamworks root)
        """
        logger.info(f"Generating service flow: {self.service_flow_name}")
        
        # Create root teamworks element with nested process
        root = sf_template.create_root(
            process_id=self.registry.get_service_flow_id(),
            name=self.service_flow_name,
            description=f"Test coach for {len(self.widgets)} widgets"
        )
        
        # Get the process element (first child of teamworks)
        process = root.find('process')
        if process is None:
            raise ValueError("Process element not found in teamworks root")
        
        # Add variables for each widget
        self._add_variables(process)
        
        # Add process items (CoachFlowWrapper and ExitPoint)
        self._add_process_items(process)
        
        # Add BPMN definitions
        self._add_bpmn_definitions(process)
        
        logger.info(f"Service flow generation complete: {self.registry.get_summary()}")
        return root
    
    def _add_variables(self, root: ET.Element):
        """Add process variables for widget data"""
        logger.debug("Adding process variables")
        
        process_id = self.registry.get_service_flow_id()
        seq = 1
        
        for widget in self.widgets:
            var_name = f"{widget.name.lower()}Data"
            var_id = self.registry.register_variable(var_name, var_type="local")
            
            # Create variable element (processVariable for local variables)
            var_elem = sf_template.create_process_variable(
                var_id=var_id,
                name=var_name,
                type_name=widget.binding_type_name,
                is_list=widget.is_list,
                process_id=process_id,
                seq=seq
            )
            root.append(var_elem)
            
            self.variables[var_name] = {
                'id': var_id,
                'type': widget.binding_type_name,
                'widget': widget.name
            }
            
            seq += 1
            logger.debug(f"Added variable: {var_name} ({widget.binding_type_name})")
    
    def _add_process_items(self, root: ET.Element):
        """Add process items (CoachFlowWrapper and ExitPoint)"""
        logger.debug("Adding process items")
        
        # Add CoachFlowWrapper for the test coach
        coach_item_id = self.registry.register_process_item("TestCoach", "CoachFlowWrapper")
        coach_bpmn_id = self.registry.register_bpmn_element("TestCoach", "FormTask")
        coach_component_id = self.registry.get_component_id("TestCoach", "CoachFlowWrapper")
        
        coach_item = sf_template.create_item(
            item_id=coach_item_id,
            name="Test Coach",
            component_id=coach_component_id,
            item_type="CoachFlowWrapper"
        )
        root.append(coach_item)
        
        # Add ExitPoint
        exit_item_id = self.registry.register_process_item("Exit", "ExitPoint")
        exit_bpmn_id = self.registry.register_bpmn_element("Exit", "EndEvent")
        exit_component_id = self.registry.get_component_id("Exit", "ExitPoint")
        
        exit_item = sf_template.create_item(
            item_id=exit_item_id,
            name="Exit",
            component_id=exit_component_id,
            item_type="ExitPoint"
        )
        root.append(exit_item)
        
        # Add link from coach to exit
        link = sf_template.create_link(
            source_id=coach_item_id,
            target_id=exit_item_id,
            name="to Exit"
        )
        root.append(link)
        
        logger.debug("Added process items and links")
    
    def _add_bpmn_definitions(self, root: ET.Element):
        """Add BPMN definitions with flow elements"""
        logger.debug("Adding BPMN definitions")
        
        # Create BPMN wrapper
        definitions = bpmn.create_definitions_wrapper(
            process_id=self.registry.get_service_flow_id()
        )
        
        # Add start event
        start_id = self.registry.register_bpmn_element("Start", "StartEvent")
        start_event = bpmn.create_start_event(start_id, "Start")
        definitions.append(start_event)
        
        # Add form task (coach)
        coach_id = self.registry.get_bpmn_element_id("TestCoach")
        if not coach_id:
            raise ValueError("TestCoach BPMN element not registered")
        coach_def_id = self.registry.register_coach("TestCoach")
        
        form_task = bpmn.create_form_task(
            task_id=coach_id,
            name="Test Coach",
            coach_id=coach_def_id
        )
        
        # Add coach definition to form task
        coach_def = self._create_coach_definition(coach_def_id)
        form_task.append(coach_def)
        definitions.append(form_task)
        
        # Add end event
        end_id = self.registry.get_bpmn_element_id("Exit")
        if not end_id:
            raise ValueError("Exit BPMN element not registered")
        end_event = bpmn.create_end_event(end_id, "Exit")
        definitions.append(end_event)
        
        # Add sequence flows
        flow1 = bpmn.create_sequence_flow(
            flow_id=f"flow_{start_id}_to_{coach_id}",
            source_ref=start_id,
            target_ref=coach_id
        )
        definitions.append(flow1)
        
        flow2 = bpmn.create_sequence_flow(
            flow_id=f"flow_{coach_id}_to_{end_id}",
            source_ref=coach_id,
            target_ref=end_id
        )
        definitions.append(flow2)
        
        # Note: Variables are defined as processParameter elements in the process section,
        # not as dataObject elements in BPMN. The BPMN ioSpecification references
        # the processParameter IDs directly.
        
        root.append(definitions)
        logger.debug("Added BPMN definitions")
    
    def _create_coach_definition(self, coach_id: str) -> ET.Element:
        """
        Create coach definition with widget layout.
        
        Args:
            coach_id: Coach definition ID
            
        Returns:
            Coach definition XML element
        """
        logger.debug("Creating coach definition")
        
        # Create coach wrapper
        coach_def = layout.create_coach_definition(
            coach_id=coach_id,
            name="Test Coach"
        )
        
        # Add widgets to layout
        layout_items = []
        for idx, widget in enumerate(self.widgets):
            var_name = f"{widget.name.lower()}Data"
            
            # Create layout item for widget
            layout_item = layout.create_layout_item(
                widget_id=f"widget_{idx}",
                coach_view_id=widget.coach_view_id,
                binding=f"tw.local.{var_name}",
                label=widget.name
            )
            
            # Add configuration options
            config_options = layout.create_standard_config_options(
                label=widget.name,
                visible=True,
                enabled=True
            )
            layout_item.append(config_options)
            
            layout_items.append(layout_item)
        
        # Create horizontal layout container
        if layout_items:
            container = layout.create_horizontal_layout("mainLayout")
            for item in layout_items:
                contribution = layout.create_contribution_item(item)
                container.append(contribution)
            coach_def.append(container)
        
        # Add OK button
        ok_button = layout.create_ok_button("okButton")
        coach_def.append(ok_button)
        
        logger.debug(f"Created coach definition with {len(layout_items)} widgets")
        return coach_def
    
    def save(self, output_path: Path) -> Path:
        """
        Generate and save service flow to XML file.
        
        Args:
            output_path: Path to save the XML file
            
        Returns:
            Path to saved file
        """
        root = self.generate()
        
        # Create XML tree
        tree = ET.ElementTree(root)
        
        # Ensure output directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write to file with pretty formatting
        ET.indent(tree, space="  ")
        tree.write(
            output_path,
            encoding='utf-8',
            xml_declaration=True
        )
        
        logger.info(f"Service flow saved to: {output_path}")
        return output_path


def generate_service_flow(
    name: str,
    widget_paths: List[Path],
    output_path: Path
) -> Path:
    """
    Convenience function to generate a service flow.
    
    Args:
        name: Service flow name
        widget_paths: List of widget directory paths
        output_path: Output file path
        
    Returns:
        Path to generated file
    """
    generator = ServiceFlowGenerator(name)
    generator.add_widgets(widget_paths)
    return generator.save(output_path)

# Made with Bob
