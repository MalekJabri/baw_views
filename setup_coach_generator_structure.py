#!/usr/bin/env python3
"""
Setup script to create the complete folder structure for BAW Coach Generator.
This creates all necessary directories and placeholder files.
"""

from pathlib import Path

def create_file(path: Path, content: str):
    """Create a file with content"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)
    print(f"✓ Created: {path}")

def setup_structure():
    """Create complete folder structure"""
    
    base = Path(".")
    
    # Structure definition
    structure = {
        # Templates
        "toolkit_packager/templates/service_flow_template.py": '''"""Service Flow XML templates"""

class ServiceFlowTemplate:
    """Templates for service flow XML structure"""
    
    @staticmethod
    def create_root(flow_id: str, name: str, description: str = "") -> str:
        """Generate root process element"""
        # TODO: Implement in Phase 1
        pass
''',
        
        "toolkit_packager/templates/bpmn_elements.py": '''"""BPMN element templates"""

class BPMNElements:
    """Templates for BPMN flow elements"""
    
    @staticmethod
    def create_start_event(event_id: str) -> str:
        """Generate start event"""
        # TODO: Implement in Phase 2
        pass
''',
        
        "toolkit_packager/templates/widget_layout.py": '''"""Widget layout templates"""

class WidgetLayoutTemplate:
    """Templates for widget layout items"""
    
    @staticmethod
    def create_layout_item(widget_schema) -> str:
        """Generate widget layout item"""
        # TODO: Implement in Phase 2
        pass
''',
        
        # Parsers
        "toolkit_packager/parsers/__init__.py": '''"""Schema parsers for widgets and business objects"""

from .widget_schema_parser import WidgetSchemaParser
from .business_object_parser import BusinessObjectParser

__all__ = ['WidgetSchemaParser', 'BusinessObjectParser']
''',
        
        "toolkit_packager/parsers/widget_schema_parser.py": '''"""Widget schema parser"""

from pathlib import Path
from typing import Dict, List
from dataclasses import dataclass

@dataclass
class WidgetSchema:
    """Widget schema information"""
    name: str
    coach_view_id: str
    binding_type: str
    is_list: bool
    config_options: List[Dict]
    business_objects: List[str]

class WidgetSchemaParser:
    """Parse widget config.json files"""
    
    def parse(self, widget_path: Path) -> WidgetSchema:
        """Parse widget configuration"""
        # TODO: Implement in Phase 1
        pass
''',
        
        "toolkit_packager/parsers/business_object_parser.py": '''"""Business object schema parser"""

from pathlib import Path
from typing import Dict

class BusinessObjectParser:
    """Parse business object JSON schemas"""
    
    def parse(self, bo_file: Path) -> Dict:
        """Parse business object schema"""
        # TODO: Implement in Phase 1
        pass
''',
        
        # AI Layer
        "toolkit_packager/ai/__init__.py": '''"""LLM integration for intelligent layout composition"""

from .layout_composer import LLMLayoutComposer
from .sample_data_generator import SampleDataGenerator

__all__ = ['LLMLayoutComposer', 'SampleDataGenerator']
''',
        
        "toolkit_packager/ai/layout_composer.py": '''"""LLM-powered layout composer"""

from typing import List, Dict

class LLMLayoutComposer:
    """Use LLM to compose intelligent widget layouts"""
    
    def compose_screens(self, widget_schemas: List, context: Dict = None) -> Dict:
        """Compose widgets into logical screens using LLM"""
        # TODO: Implement in Phase 3
        pass
''',
        
        "toolkit_packager/ai/sample_data_generator.py": '''"""LLM-powered sample data generator"""

class SampleDataGenerator:
    """Generate sample data for widgets using LLM"""
    
    def generate_for_widget(self, widget_schema, context: Dict = None) -> str:
        """Generate JavaScript initialization code for widget data"""
        # TODO: Implement in Phase 3
        pass
''',
        
        "toolkit_packager/ai/prompts.py": '''"""Prompt templates for LLM"""

class PromptTemplates:
    """Prompt templates for LLM interactions"""
    
    LAYOUT_COMPOSITION = """You are a BAW UI designer..."""
    
    SAMPLE_DATA_GENERATION = """Generate realistic sample data..."""
''',
        
        # Generators (new service flow generator)
        "toolkit_packager/generators/service_flow_generator.py": '''"""Service flow generator"""

from pathlib import Path
from typing import List
from ..models import Widget

class ServiceFlowGenerator:
    """Generate BAW Service Flow XML with embedded coach"""
    
    def __init__(self, flow_name: str, widgets: List[Widget]):
        self.flow_name = flow_name
        self.widgets = widgets
    
    def generate(self) -> str:
        """Generate complete service flow XML"""
        # TODO: Implement in Phase 2
        pass
''',
        
        # Utils (service flow registry)
        "toolkit_packager/utils/service_flow_registry.py": '''"""Service flow registry for stable IDs"""

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
''',
        
        "toolkit_packager/utils/baw_service_flows.json": '''{
  "service_flows": {},
  "version": "1.0.0",
  "last_updated": null
}
''',
        
        # CLI Script
        "generate_coach.py": '''#!/usr/bin/env python3
"""
Generate BAW test coach from widgets

Usage:
    python3 generate_coach.py --name "My Test Coach"
    python3 generate_coach.py --widgets Breadcrumb,Stepper,ProgressBar
"""

import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(
        description="Generate BAW test coach from widgets"
    )
    parser.add_argument(
        "--name",
        default="Widget Test Coach",
        help="Name of the coach"
    )
    parser.add_argument(
        "--widgets",
        help="Comma-separated list of widget names (default: all)"
    )
    parser.add_argument(
        "--output",
        default="coaches",
        help="Output directory"
    )
    parser.add_argument(
        "--no-llm",
        action="store_true",
        help="Disable LLM layout composition"
    )
    
    args = parser.parse_args()
    
    print(f"Generating coach: {args.name}")
    print("TODO: Implementation in Phase 4")

if __name__ == "__main__":
    main()
''',
        
        # Documentation
        "docs/COACH_GENERATOR_GUIDE.md": '''# BAW Coach Generator User Guide

## Overview

The BAW Coach Generator automatically creates test coaches (Service Flows) 
that compose your custom widgets into functional UI screens.

## Quick Start

```bash
# Generate coach with all widgets
python3 generate_coach.py

# Generate coach with specific widgets
python3 generate_coach.py --widgets Breadcrumb,Stepper,ProgressBar

# Generate and package into TWX
python3 package_multiple_widgets.py --include-coaches
```

## Documentation Status

- [ ] Installation guide
- [ ] Usage examples
- [ ] API reference
- [ ] Troubleshooting

*Documentation will be completed in Phase 5*
''',
        
        "docs/API_REFERENCE.md": '''# API Reference

## ServiceFlowGenerator

```python
from toolkit_packager.generators import ServiceFlowGenerator

generator = ServiceFlowGenerator("My Coach", widgets)
xml = generator.generate()
```

*API documentation will be completed in Phase 5*
''',
        
        "docs/EXAMPLES.md": '''# Examples

## Example 1: Simple Coach

```python
# TODO: Add examples in Phase 5
```

## Example 2: Multi-Screen Coach

```python
# TODO: Add examples in Phase 5
```
''',
        
        # README for coaches directory
        "coaches/README.md": '''# Generated Coaches

This directory contains auto-generated BAW Service Flow XML files.

## Files

Generated coaches will appear here after running:
```bash
python3 generate_coach.py
```

## Usage

1. Generate coach XML
2. Package into TWX: `python3 package_multiple_widgets.py --include-coaches`
3. Import TWX into BAW
4. Test the coach

## Structure

Each coach file contains:
- Service Flow definition
- BPMN flow elements
- Coach screens with widgets
- Data bindings
- Navigation logic
''',
    }
    
    print("Creating BAW Coach Generator folder structure...\n")
    
    for file_path, content in structure.items():
        create_file(base / file_path, content)
    
    print(f"\n✅ Structure created successfully!")
    print(f"\nCreated {len(structure)} files across:")
    print("  - toolkit_packager/templates/")
    print("  - toolkit_packager/parsers/")
    print("  - toolkit_packager/ai/")
    print("  - toolkit_packager/generators/")
    print("  - toolkit_packager/utils/")
    print("  - coaches/")
    print("  - docs/")
    print("\n📋 Next steps:")
    print("  1. Review the created structure")
    print("  2. Begin Phase 1 implementation")
    print("  3. Run: python3 generate_coach.py --help")

if __name__ == "__main__":
    setup_structure()

# Made with Bob
