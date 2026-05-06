"""
Service flow registry for BAW Coach Generator.

Manages IDs and references for service flow objects including:
- Process IDs
- BPMN element IDs
- Variable IDs
- Coach view references
"""

from typing import Dict, Optional, Set
from dataclasses import dataclass, field

from ..core.guid_generator import generate_guid
from ..utils.logger import get_logger

logger = get_logger(__name__)


@dataclass
class ServiceFlowRegistry:
    """Registry for service flow object IDs and references"""
    
    # Service flow metadata
    service_flow_name: str
    service_flow_id: str = field(default="")
    
    # ID tracking
    process_ids: Dict[str, str] = field(default_factory=dict)
    bpmn_ids: Dict[str, str] = field(default_factory=dict)
    variable_ids: Dict[str, str] = field(default_factory=dict)
    coach_ids: Dict[str, str] = field(default_factory=dict)
    
    # Used IDs to prevent duplicates
    used_ids: Set[str] = field(default_factory=set)
    
    def __post_init__(self):
        """Initialize service flow ID"""
        if not self.service_flow_id:
            # Use prefix "1" for service flows that can be packaged in toolkits
            self.service_flow_id = self._generate_id("1", self.service_flow_name)
    
    def _generate_id(self, type_prefix: str, name: str) -> str:
        """
        Generate a unique ID with type prefix.
        
        Args:
            type_prefix: BAW object type prefix (e.g., "1" for service flow, "25" for service flow)
            name: Object name for deterministic generation
            
        Returns:
            Generated ID in format "prefix.guid"
        """
        # Generate deterministic GUID based on name
        guid = generate_guid(name)
        object_id = f"{type_prefix}.{guid}"
        
        # Ensure uniqueness
        counter = 0
        while object_id in self.used_ids:
            counter += 1
            guid = generate_guid(f"{name}_{counter}")
            object_id = f"{type_prefix}.{guid}"
        
        self.used_ids.add(object_id)
        return object_id
    
    def register_process_item(self, name: str, item_type: str = "CoachFlowWrapper") -> str:
        """
        Register a process item and get its ID.
        
        Args:
            name: Item name
            item_type: Item type (CoachFlowWrapper, ExitPoint, etc.)
            
        Returns:
            Process item ID (always uses 2025 prefix for process items)
        """
        if name in self.process_ids:
            return self.process_ids[name]
        
        # All process items use 2025 prefix (CoachFlowWrapper, ExitPoint, etc.)
        # The tWComponentId will differ based on type (handled in template)
        type_prefix = "2025"
        
        item_id = self._generate_id(type_prefix, f"{self.service_flow_name}_{name}")
        self.process_ids[name] = item_id
        
        logger.debug(f"Registered process item: {name} ({item_type}) -> {item_id}")
        return item_id
    
    def get_component_id(self, name: str, item_type: str) -> str:
        """
        Get the tWComponentId for a process item.
        
        For ExitPoint: returns 3008.{guid}
        For other types: returns the BPMN element ID
        
        Args:
            name: Item name
            item_type: Item type (CoachFlowWrapper, ExitPoint, etc.)
            
        Returns:
            Component ID
        """
        if item_type == "ExitPoint":
            # ExitPoint uses 3008 prefix for tWComponentId
            return self._generate_id("3008", f"{self.service_flow_name}_{name}_component")
        else:
            # Other types use BPMN element ID
            return self.bpmn_ids.get(name, "")
    
    def register_bpmn_element(self, name: str, element_type: str) -> str:
        """
        Register a BPMN element and get its ID.
        
        Args:
            name: Element name
            element_type: Element type (StartEvent, FormTask, EndEvent, etc.)
            
        Returns:
            BPMN element ID (simple string, not prefixed)
        """
        if name in self.bpmn_ids:
            return self.bpmn_ids[name]
        
        # BPMN IDs are simple strings without type prefix
        element_id = f"{element_type}_{generate_guid(f'{self.service_flow_name}_{name}')}"
        self.bpmn_ids[name] = element_id
        
        logger.debug(f"Registered BPMN element: {name} -> {element_id}")
        return element_id
    
    def register_variable(self, name: str, var_type: str = "local") -> str:
        """
        Register a variable and get its ID.
        
        Args:
            name: Variable name
            var_type: Variable type (local, input, output)
            
        Returns:
            Variable ID (uses 2056 prefix for local variables, 2055 for parameters)
        """
        if name in self.variable_ids:
            return self.variable_ids[name]
        
        # Type prefix based on variable type:
        # 2056 for local/private variables (processVariable)
        # 2055 for input/output parameters (processParameter)
        if var_type == "local":
            type_prefix = "2056"
        else:
            type_prefix = "2055"
        
        var_id = self._generate_id(type_prefix, f"{self.service_flow_name}_{name}")
        self.variable_ids[name] = var_id
        
        logger.debug(f"Registered variable: {name} ({var_type}) -> {var_id}")
        return var_id
    
    def register_coach(self, name: str) -> str:
        """
        Register a coach definition and get its ID.
        
        Args:
            name: Coach name
            
        Returns:
            Coach ID
        """
        if name in self.coach_ids:
            return self.coach_ids[name]
        
        # Type prefix 65 for coach definitions
        coach_id = self._generate_id("65", f"{self.service_flow_name}_{name}")
        self.coach_ids[name] = coach_id
        
        logger.debug(f"Registered coach: {name} -> {coach_id}")
        return coach_id
    
    def get_process_item_id(self, name: str) -> Optional[str]:
        """Get process item ID by name"""
        return self.process_ids.get(name)
    
    def get_bpmn_element_id(self, name: str) -> Optional[str]:
        """Get BPMN element ID by name"""
        return self.bpmn_ids.get(name)
    
    def get_variable_id(self, name: str) -> Optional[str]:
        """Get variable ID by name"""
        return self.variable_ids.get(name)
    
    def get_coach_id(self, name: str) -> Optional[str]:
        """Get coach ID by name"""
        return self.coach_ids.get(name)
    
    def get_service_flow_id(self) -> str:
        """Get service flow ID"""
        return self.service_flow_id
    
    def get_summary(self) -> Dict:
        """
        Get summary of registered objects.
        
        Returns:
            Dictionary with counts of registered objects and service flow ID
        """
        return {
            'service_flow_id': self.service_flow_id,
            'process_items': len(self.process_ids),
            'bpmn_elements': len(self.bpmn_ids),
            'variables': len(self.variable_ids),
            'coaches': len(self.coach_ids),
            'total_ids': len(self.used_ids)
        }


def create_service_flow_registry(service_flow_name: str) -> ServiceFlowRegistry:
    """
    Create a new service flow registry.
    
    Args:
        service_flow_name: Name of the service flow
        
    Returns:
        ServiceFlowRegistry instance
    """
    registry = ServiceFlowRegistry(service_flow_name=service_flow_name)
    logger.info(f"Created service flow registry: {service_flow_name} (ID: {registry.service_flow_id})")
    return registry

# Made with Bob
