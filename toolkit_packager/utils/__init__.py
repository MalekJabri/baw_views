"""
Utility modules for the BAW Toolkit Packager.
"""

from .exceptions import (
    ToolkitPackagerError,
    ConfigurationError,
    WidgetValidationError,
    XMLGenerationError,
    PackagingError,
    FileNotFoundError,
    InvalidSchemaError,
)
from .logger import setup_logger, get_logger
from .version_manager import VersionManager, increment_toolkit_version
from .custom_type_registry import CustomTypeRegistry, get_custom_type_registry
from .coach_view_registry import CoachViewRegistry, get_coach_view_registry

__all__ = [
    'ToolkitPackagerError',
    'ConfigurationError',
    'WidgetValidationError',
    'XMLGenerationError',
    'PackagingError',
    'FileNotFoundError',
    'InvalidSchemaError',
    'setup_logger',
    'get_logger',
    'VersionManager',
    'increment_toolkit_version',
    'CustomTypeRegistry',
    'get_custom_type_registry',
    'CoachViewRegistry',
    'get_coach_view_registry',
]

# Made with Bob
