"""
Parsers module for BAW Coach Generator.

Provides parsers for widget schemas and business objects.
"""

from .widget_schema_parser import (
    WidgetSchema,
    WidgetSchemaParser
)

from .business_object_parser import (
    BusinessObjectField,
    BusinessObjectSchema,
    BusinessObjectParser
)

__all__ = [
    'WidgetSchema',
    'WidgetSchemaParser',
    'BusinessObjectField',
    'BusinessObjectSchema',
    'BusinessObjectParser'
]

# Made with Bob
