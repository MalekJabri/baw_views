"""
Scanner module for discovering and validating widgets.
"""

from .widget_scanner import (
    scan_project,
    is_widget_directory,
    get_widget_files,
    list_widget_names,
    find_widget_by_name,
    count_widgets,
)

from .validator import (
    ValidationResult,
    validate_widget,
    validate_widgets,
    check_required_files,
    get_validation_summary,
)

__all__ = [
    # Scanner
    'scan_project',
    'is_widget_directory',
    'get_widget_files',
    'list_widget_names',
    'find_widget_by_name',
    'count_widgets',
    # Validator
    'ValidationResult',
    'validate_widget',
    'validate_widgets',
    'check_required_files',
    'get_validation_summary',
]

# Made with Bob
