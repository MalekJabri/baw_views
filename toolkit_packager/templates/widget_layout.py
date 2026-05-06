"""
Widget layout templates for BAW Coach Generator.

Provides functions to create coach definition and widget layout XML elements.
Based on analysis of BAW 8.6.10.25010 coach structure.
"""

from xml.etree import ElementTree as ET
from typing import Optional, List, Dict, Any


def create_coach_definition(coach_id: str, name: str) -> ET.Element:
    """
    Create coach definition element.
    
    Args:
        coach_id: Coach definition ID (format: 65.{guid})
        name: Coach name
        
    Returns:
        XML Element for coach definition
    """
    coach = ET.Element('coach')
    coach.set('id', coach_id)
    coach.set('name', name)
    
    # Basic metadata
    ET.SubElement(coach, 'coachId').text = coach_id
    ET.SubElement(coach, 'isResponsive').text = 'true'
    ET.SubElement(coach, 'showBoundary').text = 'true'
    
    # Layout container
    layout = ET.SubElement(coach, 'layout')
    layout.set('type', 'vertical')
    
    return coach


def create_layout_item(widget_id: str, coach_view_id: str, 
                      binding: str = "", label: str = "") -> ET.Element:
    """
    Create layout item for a widget.
    
    Args:
        widget_id: Unique widget instance ID
        coach_view_id: Coach view ID reference (format: 64.{guid})
        binding: Data binding expression (e.g., "tw.local.myData")
        label: Widget label
        
    Returns:
        XML Element for layout item
    """
    item = ET.Element('item')
    item.set('id', widget_id)
    item.set('type', 'coachView')
    
    # Coach view reference
    view_ref = ET.SubElement(item, 'coachViewRef')
    view_ref.text = coach_view_id
    
    # Data binding
    if binding:
        binding_elem = ET.SubElement(item, 'binding')
        binding_elem.text = binding
    
    # Configuration
    config = ET.SubElement(item, 'config')
    
    if label:
        label_opt = ET.SubElement(config, 'option')
        label_opt.set('name', 'label')
        label_opt.text = label
    
    return item


def create_ok_button(button_id: str = "okButton") -> ET.Element:
    """
    Create standard OK button.
    
    Args:
        button_id: Button instance ID
        
    Returns:
        XML Element for OK button
    """
    button = ET.Element('item')
    button.set('id', button_id)
    button.set('type', 'button')
    
    # Button configuration
    config = ET.SubElement(button, 'config')
    
    label_opt = ET.SubElement(config, 'option')
    label_opt.set('name', 'label')
    label_opt.text = 'OK'
    
    action_opt = ET.SubElement(config, 'option')
    action_opt.set('name', 'action')
    action_opt.text = 'submit'
    
    return button


def create_horizontal_layout(layout_id: str) -> ET.Element:
    """
    Create horizontal layout container.
    
    Args:
        layout_id: Layout container ID
        
    Returns:
        XML Element for horizontal layout
    """
    layout = ET.Element('item')
    layout.set('id', layout_id)
    layout.set('type', 'horizontalLayout')
    
    # Container for child items
    ET.SubElement(layout, 'items')
    
    return layout


def create_vertical_layout(layout_id: str) -> ET.Element:
    """
    Create vertical layout container.
    
    Args:
        layout_id: Layout container ID
        
    Returns:
        XML Element for vertical layout
    """
    layout = ET.Element('item')
    layout.set('id', layout_id)
    layout.set('type', 'verticalLayout')
    
    # Container for child items
    ET.SubElement(layout, 'items')
    
    return layout


def create_panel(panel_id: str, title: str = "") -> ET.Element:
    """
    Create panel container.
    
    Args:
        panel_id: Panel ID
        title: Panel title
        
    Returns:
        XML Element for panel
    """
    panel = ET.Element('item')
    panel.set('id', panel_id)
    panel.set('type', 'panel')
    
    # Panel configuration
    config = ET.SubElement(panel, 'config')
    
    if title:
        title_opt = ET.SubElement(config, 'option')
        title_opt.set('name', 'title')
        title_opt.text = title
    
    # Container for child items
    ET.SubElement(panel, 'items')
    
    return panel


def create_contribution_item(widget_element: ET.Element) -> ET.Element:
    """
    Create contribution item wrapper for a widget in a container.
    
    Args:
        widget_element: Widget element to wrap
        
    Returns:
        XML Element for contribution item
    """
    contribution = ET.Element('contribution')
    contribution.append(widget_element)
    
    return contribution


def create_standard_config_options(label: str = "", visible: bool = True,
                                  enabled: bool = True) -> ET.Element:
    """
    Create standard configuration options element.
    
    Args:
        label: Widget label
        visible: Whether widget is visible
        enabled: Whether widget is enabled
        
    Returns:
        XML Element with configuration options
    """
    config = ET.Element('config')
    
    if label:
        label_opt = ET.SubElement(config, 'option')
        label_opt.set('name', 'label')
        label_opt.text = label
    
    visible_opt = ET.SubElement(config, 'option')
    visible_opt.set('name', 'visible')
    visible_opt.text = str(visible).lower()
    
    enabled_opt = ET.SubElement(config, 'option')
    enabled_opt.set('name', 'enabled')
    enabled_opt.text = str(enabled).lower()
    
    return config


def create_table(table_id: str, binding: str = "") -> ET.Element:
    """
    Create table widget.
    
    Args:
        table_id: Table instance ID
        binding: Data binding for table rows
        
    Returns:
        XML Element for table
    """
    table = ET.Element('item')
    table.set('id', table_id)
    table.set('type', 'table')
    
    if binding:
        binding_elem = ET.SubElement(table, 'binding')
        binding_elem.text = binding
    
    # Columns container
    ET.SubElement(table, 'columns')
    
    return table


def create_table_column(column_id: str, header: str, 
                       binding: str = "") -> ET.Element:
    """
    Create table column.
    
    Args:
        column_id: Column ID
        header: Column header text
        binding: Data binding for column cells
        
    Returns:
        XML Element for table column
    """
    column = ET.Element('column')
    column.set('id', column_id)
    
    # Column configuration
    config = ET.SubElement(column, 'config')
    
    header_opt = ET.SubElement(config, 'option')
    header_opt.set('name', 'header')
    header_opt.text = header
    
    if binding:
        binding_elem = ET.SubElement(column, 'binding')
        binding_elem.text = binding
    
    return column


def create_text_input(input_id: str, binding: str = "",
                     label: str = "", placeholder: str = "") -> ET.Element:
    """
    Create text input widget.
    
    Args:
        input_id: Input instance ID
        binding: Data binding
        label: Input label
        placeholder: Placeholder text
        
    Returns:
        XML Element for text input
    """
    input_elem = ET.Element('item')
    input_elem.set('id', input_id)
    input_elem.set('type', 'text')
    
    if binding:
        binding_elem = ET.SubElement(input_elem, 'binding')
        binding_elem.text = binding
    
    # Configuration
    config = ET.SubElement(input_elem, 'config')
    
    if label:
        label_opt = ET.SubElement(config, 'option')
        label_opt.set('name', 'label')
        label_opt.text = label
    
    if placeholder:
        placeholder_opt = ET.SubElement(config, 'option')
        placeholder_opt.set('name', 'placeholder')
        placeholder_opt.text = placeholder
    
    return input_elem


def create_output_text(output_id: str, binding: str = "",
                      label: str = "") -> ET.Element:
    """
    Create output text widget.
    
    Args:
        output_id: Output instance ID
        binding: Data binding
        label: Output label
        
    Returns:
        XML Element for output text
    """
    output = ET.Element('item')
    output.set('id', output_id)
    output.set('type', 'outputText')
    
    if binding:
        binding_elem = ET.SubElement(output, 'binding')
        binding_elem.text = binding
    
    # Configuration
    config = ET.SubElement(output, 'config')
    
    if label:
        label_opt = ET.SubElement(config, 'option')
        label_opt.set('name', 'label')
        label_opt.text = label
    
    return output

# Made with Bob
