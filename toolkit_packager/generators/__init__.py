"""
Generators module for BAW Coach Generator.

Provides service flow generation and registry management.
"""

# Existing generators
from .base_generator import BaseGenerator
from .coach_view_generator import CoachViewGenerator
from .managed_asset_generator import ManagedAssetGenerator
from .business_object_generator import BusinessObjectGenerator

# New coach generators
from .service_flow_generator import (
    ServiceFlowGenerator,
    generate_service_flow
)

from .service_flow_registry import (
    ServiceFlowRegistry,
    create_service_flow_registry
)

__all__ = [
    # Existing
    'BaseGenerator',
    'CoachViewGenerator',
    'ManagedAssetGenerator',
    'BusinessObjectGenerator',
    # New
    'ServiceFlowGenerator',
    'generate_service_flow',
    'ServiceFlowRegistry',
    'create_service_flow_registry'
]

# Made with Bob
