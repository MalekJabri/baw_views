"""Service flow registry for stable IDs"""

import json
from pathlib import Path
from typing import Optional, Dict

class ServiceFlowRegistry:
    """Manage service flow IDs for consistent packaging"""
    
    def __init__(self, registry_file: Optional[Path] = None):
        if registry_file is None:
            registry_file = Path(__file__).parent / "baw_service_flows.json"
        self.registry_file = registry_file
        self.registry = self._load_registry()
    
    def _load_registry(self) -> Dict:
        """Load registry from file"""
        if self.registry_file.exists():
            return json.loads(self.registry_file.read_text())
        return {"service_flows": {}}
    
    def get_service_flow_id(self, flow_name: str) -> Optional[str]:
        """Get existing service flow ID"""
        return self.registry["service_flows"].get(flow_name, {}).get("flow_id")
    
    def register_service_flow(self, flow_name: str, flow_id: str):
        """Register new service flow"""
        # TODO: Complete implementation
        pass

# Singleton
_registry = None

def get_service_flow_registry() -> ServiceFlowRegistry:
    """Get singleton registry instance"""
    global _registry
    if _registry is None:
        _registry = ServiceFlowRegistry()
    return _registry
