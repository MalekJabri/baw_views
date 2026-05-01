# IBM BAW Custom View Widgets

A collection of reusable, accessible custom view widgets for IBM Business Automation Workflow (BAW) built with Carbon Design System principles.

## 📋 Table of Contents

- [Overview](#overview)
- [Available Widgets](#available-widgets)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Widget Documentation](#widget-documentation)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Localization](#localization)
- [Best Practices](#best-practices)
- [Support](#support)
- [License](#license)

## 🎯 Overview

This repository contains a suite of production-ready custom view widgets designed for IBM Business Automation Workflow. Each widget follows IBM Carbon Design System guidelines and provides:

- **Accessibility**: Full ARIA support and keyboard navigation
- **Responsive Design**: Mobile-friendly layouts
- **Data Binding**: Seamless integration with BAW data models
- **Event Handling**: Rich event system for interactions
- **Customization**: Configurable options and styling
- **Documentation**: Comprehensive guides and examples

## 📦 Available Widgets

### 1. **Breadcrumb Widget**
Navigation breadcrumbs with Carbon Design System styling.
- Dynamic breadcrumb generation from array data
- Configurable display options (max items, trailing slash)
- Custom click handlers for flexible navigation
- Overflow handling with ellipsis

[📖 Full Documentation](./Breadcrumb/README.md)

### 2. **CaseStage Widget**
Case stage visualization for case management workflows.
- Visual representation of case stages
- Status indicators and progress tracking

[📁 View Files](./CaseStage/)

### 3. **DateOutput Widget**
Customizable date display with visual context indicators.
- Token-based date formatting (similar to moment.js)
- Multiple input types (Date objects, ISO strings, timestamps)
- Color-coded states (past, today, future)
- Time support with configurable formats

[📖 Full Documentation](./DateOutput/README.md)

### 4. **GoogleMap Widget**
Comprehensive Google Maps integration with marker support.
- Full Google Maps JavaScript API support
- Dynamic markers with custom icons
- Interactive events and geocoding
- ARIA accessible with dark mode support

[📖 Full Documentation](./GoogleMap/README.md)

### 5. **ProcessCircle Widget**
Animated circular progress indicator with dynamic color-coding.
- Smooth 3-second animation
- Color-coded thresholds (green, orange, red)
- Configurable value ranges
- Customizable display suffix

[📖 Full Documentation](./ProcessCircle/README.md)

### 6. **Stepper Widget**
Vertical multi-step process indicator with visual progress tracking.
- Carbon Design System styling
- Dynamic step generation from array data
- Visual status indicators (completed, current, pending, error, warning)
- Interactive navigation with click handlers

[📖 Full Documentation](./Stepper/README.md)

### 7. **TasksList Widget**
Task list display and management widget.
- Task visualization and organization
- Status tracking and filtering

[📁 View Files](./TasksList/)

## 🚀 Installation

### Prerequisites

- **IBM BAW Environment**: Recommended Version 24 or higher
- **Process Designer Access**: Ability to import custom widgets
- **Browser**: Chrome, Firefox, Safari, or Edge.
- **Python 3.7+**: For widget packaging (optional)

> **Disclaimer:** This lab assumes familiarity with IBM Business Automation Workflow (BAW). If you do not have enough experience to follow the steps, ask for help from an expert (or Bob), or refer to the official IBM documentation: https://www.ibm.com/docs/en/baw
>
> **Compatibility Note:** The provided `.twx` file is only compatible with IBM BAW 25.0.1.

### Installation Steps

#### Method 1: Import Pre-packaged TWX File (Recommended)

1. **Generate TWX Package**
   ```bash
   # Package all widgets or specific ones
   python3 package_multiple_widgets.py
   ```

2. **Import into BAW**
   - Open IBM Business Automation Workflow Process Designer
   - Go to **File** → **Import**
   - Select the generated TWX file from `output/` directory
   - Follow the import wizard

3. **Verify Installation**
   - Check that widgets appear in your toolkit
   - Test widgets in a sample coach

#### Method 2: Import Individual Widgets

1. **Navigate to Process Designer**
   - Open IBM Business Automation Workflow Process Designer
   - Select your Process App or Toolkit

2. **Import Widget**
   - Go to **User Interface** → **Views**
   - Click **New** → **Custom HTML**
   - Or right-click on an existing view folder and select **New** → **Custom HTML**

3. **Configure Widget Files**
   
   For each widget (e.g., Breadcrumb):
   
   a. **Layout (HTML)**
   - Copy content from `{WidgetName}/widget/Layout.html`
   - Paste into the **HTML** tab in Process Designer
   
   b. **Inline CSS**
   - Copy content from `{WidgetName}/widget/InlineCSS.css`
   - Paste into the **Inline CSS** tab
   
   c. **Inline JavaScript**
   - Copy content from `{WidgetName}/widget/inlineJavascript.js`
   - Paste into the **Inline JavaScript** tab
   
   d. **Event Handlers**
   - Open `{WidgetName}/widget/eventHandler.md`
   - Follow instructions to configure event handlers
   - Typically add a `change` event handler with the provided code

4. **Configure Data Model**
   - Open `{WidgetName}/widget/datamodel.md`
   - Review the required business data structure
   - Add configuration options as specified

5. **Save and Test**
   - Save the custom view
   - Add it to a coach for testing
   - Bind the required data and configure options

#### Method 2: Bulk Import (Recommended for Multiple Widgets)

1. **Clone or Download Repository**
   ```bash
   git clone <repository-url>
   cd baw_views
   ```

2. **For Each Widget**
   - Follow the individual widget installation steps above
   - Or use BAW's import functionality if available in your version

3. **Verify Installation**
   - Check that all widgets appear in your Views library
   - Test each widget in a sample coach

### Post-Installation Configuration

#### For GoogleMap Widget
- Obtain a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
- Configure the API key in the widget options

#### For Widgets with External Dependencies
- Review each widget's README for specific requirements
- Configure any necessary API keys or external resources

## 🎬 Quick Start

### Example: Using the Breadcrumb Widget

1. **Add Widget to Coach**
   - Drag the Breadcrumb widget onto your coach view

2. **Create Business Data**
   ```javascript
   // In your BAW coach view
   tw.local.breadcrumbPath = [
     { label: "Home", href: "/" },
     { label: "Products", href: "/products" },
     { label: "Electronics", href: "/products/electronics" },
     { label: "Laptops", href: "/products/electronics/laptops" }
   ];
   ```

3. **Bind Data**
   - Bind the widget's data property to `tw.local.breadcrumbPath`

4. **Configure Options**
   - Set `maxItems: 0` (show all)
   - Set `noTrailingSlash: false`
   - Set `showHomeIcon: false`

5. **Run and Test**
   - The breadcrumb will display: `Home / Products / Electronics / Laptops`

### Example: Using the Stepper Widget

1. **Add Widget to Coach**
   - Drag the Stepper widget onto your coach view

2. **Create Business Data**
   ```javascript
   tw.local.processSteps = [
     { label: "Personal Info", description: "Enter details", status: "completed" },
     { label: "Address", description: "Provide address", status: "current" },
     { label: "Payment", description: "Payment details", status: "pending" },
     { label: "Review", description: "Review and submit", status: "pending" }
   ];
   ```

3. **Bind and Configure**
   - Bind data to `tw.local.processSteps`
   - Set `showNumbers: true`
   - Set `showIcons: true`
   - Set `clickable: false`

4. **Run and Test**
   - The stepper will display a vertical progress indicator

## 📚 Widget Documentation

Each widget includes comprehensive documentation:

- **README.md**: Overview, features, and usage examples
- **datamodel.md**: Data structure and configuration options
- **eventHandler.md**: Event handling and integration
- **AdvancePreview/**: Preview mode for BAW designer

### Documentation Structure

```
{WidgetName}/
├── README.md                    # Main documentation
├── widget/
│   ├── Layout.html              # HTML structure
│   ├── InlineCSS.css            # Styling
│   ├── inlineJavascript.js      # Logic
│   ├── datamodel.md             # Data model docs
│   └── eventHandler.md          # Event docs
└── AdvancePreview/
    ├── {WidgetName}.html        # Preview styles
    └── {WidgetName}Snippet.js   # Preview logic
```

## 📁 Project Structure

```
baw_views/
├── README.md                    # This file
├── Breadcrumb/                  # Breadcrumb navigation widget
├── CaseStage/                   # Case stage visualization
├── DateOutput/                  # Date formatting widget
├── ProcessCircle/               # Circular progress indicator
├── Stepper/                     # Multi-step process indicator
├── TasksList/                   # Task list management
├── Loclisation/                 # Localization files
│   ├── README.md
│   ├── zip_localisations.sh
│   └── EtnicProject/
└── docs/                        # Additional documentation
    └── images/
```

## 💻 Requirements

### IBM BAW Environment
- **Recommended Version**: IBM Business Automation Workflow v24.x 
- **Process Designer**: Access to create and modify custom views

### Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 85+ |
| Firefox | 90+ |
| Safari | 14+ |
| Edge | 85+ |
| Mobile Safari | 14+ |
| Chrome Mobile | 90+ |

### Technical Requirements
- **JavaScript**: ES5+ support
- **CSS**: CSS3 with Flexbox and Grid support
- **HTML**: HTML5 semantic elements

### External Dependencies

#### GoogleMap Widget
- Google Maps JavaScript API key
- Active Google Cloud Platform account
- Maps JavaScript API enabled

#### All Widgets
- IBM Carbon Design System fonts (IBM Plex Sans)
- Modern browser with JavaScript enabled

## 🌐 Localization

The project includes localization support for multi-language applications.

### Available Localizations
- English (default)
- French (fr)
- Dutch (nl)

### Localization Files
Located in the `Loclisation/` directory:
- `VacationETNIC.properties` - English
- `VacationETNIC_fr.properties` - French
- `VacationETNIC_nl.properties` - Dutch

### Packaging Localizations
Use the provided script to package localization files:

```bash
cd Loclisation
./zip_localisations.sh
```

[📖 Localization Documentation](./Loclisation/README.md)

## 🎨 Best Practices

### Widget Usage
1. **Read Documentation First**: Review each widget's README before implementation
2. **Test in Development**: Always test widgets in a development environment
3. **Validate Data**: Ensure bound data matches the expected structure
4. **Handle Errors**: Implement error handling for data binding issues
5. **Consider Performance**: For large datasets, implement pagination or lazy loading

### Data Binding
1. **Use Proper Types**: Match data types to widget requirements
2. **Initialize Data**: Ensure data is initialized before widget loads
3. **Update Correctly**: Create new array references when updating data
4. **Validate Input**: Check data validity before binding

### Styling
1. **Preserve Carbon Design**: Maintain Carbon Design System styling
2. **Test Responsiveness**: Verify widgets work on mobile devices
3. **Check Accessibility**: Test with screen readers and keyboard navigation
4. **Avoid Conflicts**: Be careful with global CSS that might affect widgets

### Integration
1. **Event Handling**: Properly configure event handlers
2. **Boundary Events**: Use BAW boundary events for coach integration
3. **Navigation**: Implement proper navigation logic
4. **State Management**: Maintain consistent state across views

## 🔧 Troubleshooting

### Common Issues

#### Widget Not Displaying
- Verify all three files (HTML, CSS, JS) are properly copied
- Check browser console for JavaScript errors
- Ensure data is bound correctly
- Verify widget is visible in the coach

#### Data Not Updating
- Create new array references when updating data
- Check that change event handler is configured
- Verify data structure matches requirements
- Use browser developer tools to inspect data

#### Styling Issues
- Check for CSS conflicts with other styles
- Verify Carbon Design System classes are not overridden
- Clear browser cache
- Test in different browsers

#### Performance Issues
- Limit number of items for large datasets
- Implement pagination or lazy loading
- Use browser performance profiling tools
- Optimize data structures

## 📞 Support

### Documentation
- Widget-specific README files in each widget directory
- `datamodel.md` for data structure details
- `eventHandler.md` for event handling

### IBM Resources
- [IBM Business Automation Workflow Documentation](https://www.ibm.com/docs/en/baw)
- [IBM Carbon Design System](https://carbondesignsystem.com/)

### External Resources
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) (for GoogleMap widget)

## 📄 License

```
Licensed Materials - Property of IBM
5725-C95
(C) Copyright IBM Corporation 2025-2026
```

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

---

## 🛠️ Creating New Widgets

### Quick Start with Widget Template Generator

Use the provided script to create a new widget with the correct structure:

```bash
# Create a new widget
python3 create_widget_template.py MyWidget "Widget description"

# Example
python3 create_widget_template.py StatusBadge "A badge widget for status display"
```

This will generate:
- Complete widget directory structure
- All required files (Layout.html, InlineCSS.css, inlineJavascript.js, openapi.json)
- Optional documentation files (datamodel.md, eventHandler.md)
- Preview files for BAW designer
- Comprehensive README.md

### Widget Structure Requirements

All widgets MUST follow this structure for toolkit_packager compatibility:

```
widgets/[WidgetName]/
├── widget/                          # MUST be lowercase
│   ├── Layout.html                  # REQUIRED
│   ├── InlineCSS.css                # REQUIRED
│   ├── inlineJavascript.js          # REQUIRED
│   ├── openapi.json                 # REQUIRED (OpenAPI 3.0 schema)
│   ├── datamodel.md                 # OPTIONAL
│   └── eventHandler.md              # OPTIONAL
├── AdvancePreview/                  # OPTIONAL
│   ├── [WidgetName].html
│   └── [WidgetName].js
└── README.md                        # RECOMMENDED
```

### Packaging Your Widget

1. **Add to Package List**
   Edit `package_multiple_widgets.py`:
   ```python
   WIDGET_NAMES = ["DateOutput", "ProcessCircle", "Stepper", "TasksList", "YourWidget"]
   ```

2. **Generate TWX Package**
   ```bash
   python3 package_multiple_widgets.py
   ```

3. **Import into BAW**
   - Find the TWX file in `output/` directory
   - Import via BAW Process Designer

### Widget Development Workflow

1. **Create Widget Structure**
   ```bash
   python3 create_widget_template.py MyWidget "Description"
   ```

2. **Develop Widget**
   - Edit `widgets/MyWidget/widget/Layout.html`
   - Style in `widgets/MyWidget/widget/InlineCSS.css`
   - Add logic in `widgets/MyWidget/widget/inlineJavascript.js`
   - Define data model in `widgets/MyWidget/widget/openapi.json`

3. **Test Locally**
   - Open `widgets/MyWidget/AdvancePreview/MyWidget.html` in browser
   - Test with sample data

4. **Package and Deploy**
   ```bash
   python3 package_multiple_widgets.py
   ```

5. **Import and Test in BAW**
   - Import TWX file
   - Add widget to a coach
   - Test with real data

## 🎯 Roadmap

Future enhancements planned:
- [x] Widget generator tool (create_widget_template.py)
- [x] Automated packaging system (toolkit_packager)
- [ ] Additional widgets (DataTable, Timeline, Notification)
- [ ] Enhanced accessibility features
- [ ] More localization options
- [ ] Performance optimizations
- [ ] Additional Carbon Design System components
- [ ] Automated testing suite

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Compatibility**: IBM Business Automation Workflow v24.x 
**Carbon Design System**: v11.x compatible

---

## 🤝 Contributing

When adding new widgets to this collection:

1. Follow the established directory structure
2. Include comprehensive README.md documentation
3. Provide datamodel.md and eventHandler.md files
4. Implement AdvancePreview for BAW designer
5. Follow Carbon Design System guidelines
6. Include usage examples and troubleshooting guides
7. Test across supported browsers
8. Ensure accessibility compliance