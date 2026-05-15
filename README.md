# IBM BAW Development Toolkit with Bob AI

A comprehensive toolkit for IBM Business Automation Workflow (BAW) development, featuring custom widgets, business object management, BPMN process generation, and AI-assisted development through specialized Bob modes.

## ⚠️ Important Disclaimer

**This is NOT an official IBM project.** This repository contains experimental tools and widgets developed using Large Language Models (LLMs) for rapid prototyping and development acceleration.

### Key Considerations:

- **LLM-Generated Content**: All code, assets, and artifacts have been generated or assisted by AI/LLM tools and may contain errors, inconsistencies, or "hallucinations"
- **Not Production-Ready**: These tools are intended for development and testing purposes only
- **Use Standard Mechanisms**: For production environments, we strongly recommend using IBM's official methods:
  - Import BPMN models through standard BAW import
  - Use OpenAPI specifications for service integration
  - Perform manual copy-paste of verified artifacts
  - Follow IBM's official documentation and best practices

### Recommendations:

1. **Always review generated code** before using in any environment
2. **Test thoroughly** in development environments before considering production use
3. **Validate against IBM documentation** and best practices
4. **Use official IBM tools** for production deployments
5. **Consider this as a learning resource** and development accelerator, not a production solution

**By using this repository, you acknowledge that you understand these limitations and will use appropriate caution and validation in your projects.**

---

## 🎯 Project Goals

This toolkit aims to accelerate IBM BAW development by providing:

1. **Custom Widget Library** - Reusable, accessible UI components built with Carbon Design System
2. **Business Object Management** - Tools for extracting, normalizing, and managing business data models
3. **BPMN Process Generation** - Config-driven approach to creating business process models
4. **AI-Assisted Development** - Specialized Bob modes for different aspects of BAW development
5. **Automated Packaging** - Tools for packaging and deploying BAW artifacts
6. **Comprehensive Documentation** - Guides, examples, and hands-on labs

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Bob AI Modes](#-bob-ai-modes)
- [Getting Started](#-getting-started)
- [Available Widgets](#-available-widgets)
- [BPMN Tools](#-bpmn-tools)
- [Documentation](#-documentation)
- [Hands-On Labs](#-hands-on-labs)
- [Toolkit Configuration](#-toolkit-configuration)
- [License](#-license)

---

## 🔧 Prerequisites

### Required Software

#### 1. **IBM Business Automation Workflow (BAW)**
- **Version**: 24.x or higher (25.0.1 recommended)
- **Access**: Process Designer with permissions to import toolkits
- **Purpose**: Target platform for deploying widgets and processes

#### 2. **Python 3.7+**
- **Purpose**: Widget packaging, BPMN generation, business object management
- **Installation**: [python.org](https://www.python.org/downloads/)
- **Verify**: `python3 --version`

#### 3. **Node.js & NPX**
- **Purpose**: MCP (Model Context Protocol) server for BAW admin operations
- **Installation**: [nodejs.org](https://nodejs.org/)
- **Verify**: `npx --version`
- **Used for**: BAW server deployment and management

#### 4. **IBM Bob AI Assistant**
- **Purpose**: AI-assisted development with specialized BAW modes
- **Setup**: Configure Bob with BAW custom modes (see `.bob/custom_modes.yaml`)
- **Modes**: Blueprint Parser, Coach Widget, Coach Composer, Package Manager

#### 5. **Modern Web Browser**
- Chrome 85+, Firefox 90+, Safari 14+, or Edge 85+
- **Purpose**: Testing widgets and preview files

### Optional but Recommended

- **Git**: For version control
- **VS Code**: With Bob extension for optimal development experience
- **BAW Admin Access**: For server deployment features

---

## 📁 Project Structure

```
BAWCoachMode/
├── README.md                           # This file
├── toolkit.config.json                 # Toolkit packaging configuration
│
├── widgets/                            # Custom widget implementations
│   ├── Breadcrumb/                    # Navigation breadcrumbs
│   ├── DateOutput/                    # Date formatting widget
│   ├── FileNetBrowser/                # FileNet document browser
│   ├── FileNetImport/                 # FileNet import widget
│   ├── FolderTree/                    # Hierarchical folder tree
│   ├── MarkdownViewer/                # Markdown rendering widget
│   ├── MultiSelect/                   # Multi-select dropdown
│   ├── ProcessCircle/                 # Circular progress indicator
│   ├── ProgressBar/                   # Linear progress bar
│   ├── Stepper/                       # Multi-step process indicator
│   ├── TasksList/                     # Task list widget
│   └── Timeline/                      # Event timeline widget
│
├── business-objects/                   # Business object management
│   ├── generated/                     # Generated business objects by context
│   ├── catalog/                       # Business object catalogs
│   └── reports/                       # Discovery and analysis reports
│
├── business-processes/                 # BPMN process definitions
│   ├── configs/                       # JSON config files for BPMN generation
│   ├── bpmn/                          # Generated BPMN XML files
│   ├── diagrams/                      # Mermaid process diagrams
│   └── catalog/                       # Process catalogs
│
├── BPMN_tools/                        # Config-driven BPMN generation
│   ├── generate_bpmn.py              # Main BPMN generator
│   ├── bpmn_xml_builder.py           # BPMN XML builder
│   ├── validator.py                   # Config validation
│   ├── CONFIG_SCHEMA_DESIGN.md       # JSON schema specification
│   ├── USER_GUIDE.md                 # Complete user guide
│   └── README.md                      # Quick reference
│
├── toolkit_packager/                   # Python packaging tools
│   ├── core/                          # Core utilities
│   ├── models/                        # Data models
│   ├── scanner/                       # Widget discovery
│   ├── generators/                    # XML generators
│   └── packager/                      # TWX building
│
├── .bob/                              # Bob AI mode configurations
│   ├── custom_modes.yaml             # Mode definitions
│   ├── mcp.json                      # MCP server configuration
│   └── rules-*/                      # Mode-specific instruction files
│
├── docs/                              # Technical documentation
│   ├── BAW_BLUEPRINT_PARSER_MODE.md  # Blueprint parser guide
│   ├── BAW_COACHUI_VIEW_MODE.md      # Widget development guide
│   ├── BAW_COACH_COMPOSER_MODE.md    # Coach composition guide
│   ├── BAW_PACKAGE_MANAGER_MODE.md   # Packaging guide
│   ├── CARBON_THEME_INTEGRATION.md   # Carbon Design System guide
│   └── API_REFERENCE.md              # API documentation
│
├── lab-docs/                          # Hands-on learning materials
│   ├── README.md                      # Lab overview
│   ├── BOB_BAW_MODES_GUIDE.md        # Complete modes guide
│   ├── Carousel_Lab_Overview.md      # Carousel widget lab
│   └── Carousel_HandsOn_Lab.md       # Step-by-step tutorial
│
├── themes/                            # Carbon Design System themes
│   ├── Carbon.less                   # Carbon theme stylesheet
│   └── CARBON_THEME_VARIABLES.md     # Theme customization guide
│
├── templates/                         # Reference templates
│   └── BaseTWX/                      # Base TWX structure
│
├── coaches/                           # Generated coach definitions
│
└── output/                            # Generated TWX packages (gitignored)
```

---

## 🤖 Bob AI Modes

This project includes four specialized Bob modes for different aspects of BAW development:

### 1. 📘 BAW Blueprint Parser Mode
**Slug**: `baw-blueprint-parser`

**Purpose**: Transform business documentation into structured BAW artifacts

**Capabilities**:
- Parse business blueprint documents (PDF, Word, etc.)
- Extract business entities, fields, and relationships
- Discover business processes and workflows
- Generate JSON business object definitions
- Create BPMN configuration files (JSON)
- Generate Mermaid process diagrams
- Create discovery reports and catalogs
- Register business objects with deterministic class IDs

**When to Use**:
- Analyzing business documents
- Extracting data models from requirements
- Discovering business processes
- Preparing artifacts for packaging

**Output**:
- Business objects: `business-objects/generated/[context]/`
- BPMN configs: `business-processes/configs/[context]/`
- Reports: `business-objects/reports/`
- Catalogs: `business-objects/catalog/` and `business-processes/catalog/`

**Documentation**: [docs/BAW_BLUEPRINT_PARSER_MODE.md](docs/BAW_BLUEPRINT_PARSER_MODE.md)

---

### 2. 📲 BAW Coach Widget Mode
**Slug**: `baw-coachui-view`

**Purpose**: Create and modify custom BAW coach view widgets

**Capabilities**:
- Generate complete widget file structures
- Implement HTML, CSS, and JavaScript
- Create business object definitions
- Generate preview files for BAW designer
- Maintain widget documentation
- Follow Carbon Design System guidelines
- Implement accessibility features

**When to Use**:
- Creating new custom widgets
- Modifying existing widgets
- Adding preview functionality
- Updating widget documentation

**Output**:
- Widget files: `widgets/[WidgetName]/`
- Configuration: `widget/config.json`
- Preview: `AdvancePreview/`

**Documentation**: [docs/BAW_COACHUI_VIEW_MODE.md](docs/BAW_COACHUI_VIEW_MODE.md)

---

### 3. 🎨 BAW Coach Composer Mode (Beta)
**Slug**: `baw-coach-composer`

**Purpose**: Design and compose BAW coaches with intelligent layout

**Capabilities**:
- Analyze widget purposes and suggest layouts
- Use both custom and standard BAW widgets
- Generate realistic sample data
- Compose complete service flows
- Create coaches for testing
- Automatically switch to Package Manager after creation

**When to Use**:
- Creating test coaches for widgets
- Building production-ready forms
- Designing multi-widget interfaces
- Generating sample data for testing

**Output**:
- Coach definitions: `coaches/`
- Service flows with sample data

**Documentation**: [docs/BAW_COACH_COMPOSER_MODE.md](docs/BAW_COACH_COMPOSER_MODE.md)

---

### 4. 🗂️ BAW Package Manager Mode (Beta)
**Slug**: `baw-package-manager`

**Purpose**: Package and deploy BAW artifacts to servers

**Capabilities**:
- Automatically detect new widgets
- Scan and include business objects
- Register business objects with class IDs
- Generate TWX toolkit packages
- Deploy to BAW servers via MCP
- Monitor deployment status
- Validate packaging readiness

**When to Use**:
- Packaging widgets into TWX files
- Deploying toolkits to BAW servers
- Managing toolkit versions
- Troubleshooting packaging issues

**Output**:
- TWX packages: `output/`
- Deployment status reports

**Documentation**: [docs/BAW_PACKAGE_MANAGER_MODE.md](docs/BAW_PACKAGE_MANAGER_MODE.md)

---

## 🚀 Getting Started

### Quick Start Guide

#### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd BAWCoachMode
```

#### 2. **Install Python Dependencies**
```bash
pip install -r requirements.txt  # If requirements.txt exists
```

#### 3. **Configure Bob Modes**
The modes are pre-configured in `.bob/custom_modes.yaml`. Ensure Bob AI is installed and configured.

#### 4. **Choose Your Workflow**

**Option A: Use Existing Widgets**
```bash
# Package all widgets
python3 package_baw.py

# Import the generated TWX file from output/ into BAW
```

**Option B: Create New Widget**
```
1. Ask Bob: "Switch to BAW Coach Widget mode"
2. Request: "Create a [WidgetName] widget that does [description]"
3. Bob creates the widget structure and implementation
4. Ask Bob: "Switch to BAW Package Manager mode"
5. Request: "Package and deploy the toolkit"
```

**Option C: Parse Business Documents**
```
1. Place documents in business-blueprints/
2. Ask Bob: "Switch to BAW Blueprint Parser mode"
3. Request: "Parse [document] and generate business objects and processes"
4. Bob extracts entities, creates JSON files, and generates BPMN configs
5. Ask Bob: "Switch to BAW Package Manager mode" (when ready to package)
```

**Option D: Generate BPMN Processes**
```bash
# Create a JSON config file (see BPMN_tools/CONFIG_SCHEMA_DESIGN.md)
# Then generate BPMN XML:
python3 BPMN_tools/generate_bpmn.py my_process.json output.bpmn
```

---

## 📦 Available Widgets

This toolkit includes 12+ production-ready custom widgets:

### Navigation & Layout
- **Breadcrumb** - Navigation breadcrumbs with overflow handling
- **FolderTree** - Hierarchical folder tree with expand/collapse

### Data Display
- **DateOutput** - Customizable date formatting
- **MarkdownViewer** - Markdown rendering with syntax highlighting
- **Timeline** - Event timeline with vertical layout

### Form Controls
- **MultiSelect** - Multi-select dropdown with search

### Process Visualization
- **Stepper** - Multi-step process indicator
- **ProgressBar** - Animated progress bar
- **ProcessCircle** - Circular progress indicator

### Content Management
- **FileNetBrowser** - FileNet document browser
- **FileNetImport** - FileNet document import
- **TasksList** - Task list with status tracking

Each widget includes:
- Complete source code
- README with usage examples
- Data model specifications
- Event handler documentation
- Preview files for BAW designer

**Browse**: `widgets/` directory for all widgets

---

## 🔧 BPMN Tools

### Config-Driven BPMN Generation

The BPMN_tools module provides a **config-driven approach** to creating BPMN 2.0 workflows:

```
Business Document → AI Analysis → JSON Config → Python Tool → BPMN XML
                    (Bob Mode)                   (generate_bpmn.py)
```

### Quick Example

**1. Create Config** (`my_process.json`):
```json
{
  "process": {
    "id": "proc-001",
    "name": "My Process",
    "version": "1.0"
  },
  "roles": [
    {"id": "role-analyst", "name": "Analyst"}
  ],
  "elements": [
    {"id": "start-001", "type": "startEvent", "name": "Start"},
    {"id": "task-001", "type": "userTask", "name": "Review", "assignee": "role-analyst"},
    {"id": "end-001", "type": "endEvent", "name": "End"}
  ],
  "flows": [
    {"id": "flow-001", "sourceRef": "start-001", "targetRef": "task-001"},
    {"id": "flow-002", "sourceRef": "task-001", "targetRef": "end-001"}
  ]
}
```

**2. Generate BPMN**:
```bash
python3 BPMN_tools/generate_bpmn.py my_process.json my_process.bpmn
```

**3. Import to BAW**: Use the generated `.bpmn` file in BAW Process Designer

### Features
- ✅ BPMN 2.0 compliant
- ✅ IBM BAW compatible
- ✅ Supports all BPMN elements (tasks, gateways, events)
- ✅ Swimlanes and milestones
- ✅ Validation and error checking
- ✅ AI/LLM friendly

**Documentation**: [BPMN_tools/README.md](BPMN_tools/README.md) and [BPMN_tools/USER_GUIDE.md](BPMN_tools/USER_GUIDE.md)

---

## 📚 Documentation

### Technical Documentation (`docs/`)
- **[BAW_BLUEPRINT_PARSER_MODE.md](docs/BAW_BLUEPRINT_PARSER_MODE.md)** - Business document parsing and artifact generation
- **[BAW_COACHUI_VIEW_MODE.md](docs/BAW_COACHUI_VIEW_MODE.md)** - Custom widget development
- **[BAW_COACH_COMPOSER_MODE.md](docs/BAW_COACH_COMPOSER_MODE.md)** - Coach design and composition
- **[BAW_PACKAGE_MANAGER_MODE.md](docs/BAW_PACKAGE_MANAGER_MODE.md)** - Packaging and deployment
- **[CARBON_THEME_INTEGRATION.md](docs/CARBON_THEME_INTEGRATION.md)** - Carbon Design System integration
- **[API_REFERENCE.md](docs/API_REFERENCE.md)** - API documentation

### BPMN Tools Documentation (`BPMN_tools/`)
- **[README.md](BPMN_tools/README.md)** - Quick reference and examples
- **[USER_GUIDE.md](BPMN_tools/USER_GUIDE.md)** - Complete user guide
- **[CONFIG_SCHEMA_DESIGN.md](BPMN_tools/CONFIG_SCHEMA_DESIGN.md)** - JSON schema specification
- **[LLM_USAGE_GUIDE.md](BPMN_tools/LLM_USAGE_GUIDE.md)** - Guide for AI/LLM integration

### Widget Documentation
Each widget includes:
- `README.md` - Overview and usage
- `widget/datamodel.md` - Data structure
- `widget/eventHandler.md` - Event handling

---

## 🎓 Hands-On Labs

### Lab Documentation (`lab-docs/`)

The project includes comprehensive hands-on labs for learning BAW development with Bob:

- **[README.md](lab-docs/README.md)** - Lab overview and getting started
- **[BOB_BAW_MODES_GUIDE.md](lab-docs/BOB_BAW_MODES_GUIDE.md)** - Complete guide to Bob's BAW modes
- **[Carousel_Lab_Overview.md](lab-docs/Carousel_Lab_Overview.md)** - Carousel widget lab introduction
- **[Carousel_HandsOn_Lab.md](lab-docs/Carousel_HandsOn_Lab.md)** - Step-by-step tutorial

### What You'll Learn
- Creating custom widgets with Bob
- Packaging and deploying toolkits
- Using all four Bob modes effectively
- BAW best practices and patterns
- Carbon Design System integration

**Duration**: 60-90 minutes per lab  
**Level**: Intermediate to Advanced

---

## ⚙️ Toolkit Configuration

### `toolkit.config.json`

This file controls toolkit packaging behavior:

```json
{
  "toolkit": {
    "name": "Custom Widgets2",           // Toolkit name in BAW
    "shortName": "CW2",                  // Short identifier
    "description": "Custom widget toolkit for BAW",
    "version": "1.0.2",                  // Toolkit version
    "bawVersion": "25.0.1",              // Target BAW version
    "id": "2066.cebc1c06-68a5-4d2e-986a-aaae3072cefb",  // Unique toolkit ID
    "isToolkit": true,
    "isHidden": false,
    "isSystem": false
  },
  "dependencies": {
    "systemData": {
      "snapshotId": "2064.1080ded6-d153-4654-947c-2d16fce170db",
      "name": "8.6.0.0_TC"
    },
    "uiToolkit": {
      "snapshotId": "2064.304ac881-16c3-47d2-97d5-6e4c4a893177",
      "name": "8.6.0.0"
    }
  },
  "output": {
    "directory": "output",               // Output directory for TWX files
    "filename": "Custom_Widgets_{version}.twx"  // Output filename pattern
  },
  "widgets": {
    "include": ["*"],                    // Include all widgets
    "exclude": [],                       // Exclude specific widgets
    "source_directory": "widgets"        // Widget source directory
  }
}
```

### Key Configuration Options

- **toolkit.name**: Display name in BAW Process Designer
- **toolkit.version**: Increment for each release
- **toolkit.id**: Unique GUID (generate once, keep stable)
- **bawVersion**: Target BAW version for compatibility
- **widgets.include**: `["*"]` for all, or specific widget names
- **widgets.exclude**: Widget names to skip during packaging

### Updating Configuration

```bash
# Edit toolkit.config.json
# Then package with new settings:
python3 package_baw.py
```

---

## 🔄 Typical Workflows

### Workflow 1: Create and Deploy a Widget
```
1. Bob: "Switch to BAW Coach Widget mode"
2. You: "Create a StatusBadge widget for displaying status indicators"
3. Bob: Creates widget structure and implementation
4. You: Test the widget locally in AdvancePreview/
5. Bob: "Switch to BAW Package Manager mode"
6. You: "Package and deploy the toolkit"
7. Bob: Packages TWX and offers deployment to BAW server
```

### Workflow 2: Parse Business Documents
```
1. Place PDF/Word documents in business-blueprints/
2. Bob: "Switch to BAW Blueprint Parser mode"
3. You: "Parse LifeInsurance.pdf and generate business objects and processes"
4. Bob: Extracts entities, creates JSON files, generates BPMN configs
5. Bob: Automatically generates BPMN XML files
6. You: Review generated artifacts
7. Bob: "Switch to BAW Package Manager mode" (when ready)
8. You: "Package the business objects"
```

### Workflow 3: Generate BPMN Process
```
1. Create JSON config or use Bob Blueprint Parser mode
2. Run: python3 BPMN_tools/generate_bpmn.py config.json output.bpmn
3. Import output.bpmn into BAW Process Designer
4. Enhance with BAW-specific features
5. Deploy to BAW server
```

---

## 🎨 Best Practices

### Widget Development
1. Follow Carbon Design System guidelines
2. Implement full accessibility (ARIA, keyboard navigation)
3. Test on multiple browsers and devices
4. Document data models and events thoroughly
5. Create preview files for BAW designer

### Business Object Management
1. Use consistent naming conventions (PascalCase)
2. Register objects with deterministic class IDs
3. Document assumptions in discovery reports
4. Organize by business context
5. Validate references and relationships

### BPMN Process Design
1. Use meaningful element names
2. Follow ID naming conventions (proc-, role-, elem-, flow-)
3. Validate configs before generating XML
4. Create Mermaid diagrams for visualization
5. Link processes to relevant business objects

### Packaging and Deployment
1. Test in development environment first
2. Increment version numbers appropriately
3. Review generated TWX contents
4. Monitor deployment status
5. Keep toolkit configuration stable

---

## 🤝 Contributing

When adding to this toolkit:

1. Follow established directory structures
2. Include comprehensive documentation
3. Test across supported browsers and BAW versions
4. Follow Carbon Design System guidelines
5. Ensure accessibility compliance
6. Update relevant catalogs and indexes

---

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

## 📞 Support

### Documentation
- Technical docs: `docs/`
- Lab materials: `lab-docs/`
- Widget-specific: `widgets/[WidgetName]/README.md`
- BPMN tools: `BPMN_tools/README.md`

### IBM Resources
- [IBM BAW Documentation](https://www.ibm.com/docs/en/baw)
- [Carbon Design System](https://carbondesignsystem.com/)

### Troubleshooting
- Check browser console for errors
- Verify BAW version compatibility
- Review mode-specific documentation
- Test with example widgets first

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**BAW Compatibility**: v24.x, v25.x  
**Carbon Design System**: v11.x compatible

---

**Ready to start?**
- 🎓 [Begin with the Labs](lab-docs/README.md)
- 🤖 [Learn About Bob's Modes](lab-docs/BOB_BAW_MODES_GUIDE.md)
- 📦 [Explore Available Widgets](widgets/)
- 🔧 [Try BPMN Tools](BPMN_tools/README.md)