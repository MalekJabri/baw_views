# Carousel Widget - Lab Overview

## Introduction

This hands-on lab teaches you how to create a custom Carousel widget for IBM Business Automation Workflow (BAW) using Bob's specialized modes. You'll experience the complete widget development lifecycle - from creation to deployment - using AI-assisted development tools that streamline BAW widget development.

## What You'll Build

A fully functional Carousel widget with:

- **Interactive card display** showing multiple items in a horizontal layout
- **Flip animation** - cards flip on click to reveal detailed information
- **Front face** displaying an icon and title
- **Back face** showing descriptive text content
- **Responsive design** adapting to different screen sizes
- **Carbon Design System styling** for consistent IBM look and feel
- **Data binding** with BAW business objects
- **Event handling** for card interactions
- **Accessibility** with ARIA support and keyboard navigation

## Lab Details

- **Duration**: 60 minutes
- **Difficulty**: Intermediate to Advanced
- **Format**: AI-assisted, hands-on development
- **Tools**: Bob AI Assistant with specialized BAW modes

## Prerequisites

Before starting this lab, you should have:

- IBM Business Automation Workflow v18.0+ installed
- Access to IBM BAW Process Designer
- Bob AI Assistant configured with BAW modes
- Git installed on your machine
- VS Code with Bob extension
- Modern web browser (Chrome 85+, Firefox 90+, Safari 14+, or Edge 85+)
- Basic knowledge of HTML, CSS, JavaScript, and BAW Coach Views

## Learning Objectives

By completing this lab, you will learn to:

1. **Use Bob's BAW Coach Widget Mode** to create custom widgets
2. **Leverage AI assistance** for widget implementation
3. **Implement complex UI patterns** (card flip animations)
4. **Work with Carbon Design System** in BAW widgets
5. **Use Bob's BAW Package Manager Mode** to package and deploy widgets
6. **Understand the complete widget lifecycle** from creation to deployment
7. **Apply best practices** for BAW widget development

## Bob's BAW Development Modes

This lab introduces two specialized Bob modes designed for BAW development:

### 🎨 BAW Coach Widget Mode

**Purpose**: Create and modify IBM Business Automation Workflow coach widgets

**Capabilities**:
- Generate widget HTML structure with semantic markup
- Create CSS styling with Carbon Design System integration
- Implement JavaScript for data binding and widget lifecycle
- Configure widget metadata and business objects
- Create preview assets for testing outside BAW runtime
- Generate widget documentation

**Key Features**:
- Follows repository conventions automatically
- Ensures accessibility compliance
- Integrates Carbon Design System values
- Creates complete widget file sets
- Maintains documentation alignment

**Reference**: See `.bob/rules-baw-coachui-view/1_workflow.xml` for detailed workflow

### 📦 BAW Package Manager Mode

**Purpose**: Package and deploy BAW artifacts to BAW servers

**Capabilities**:
- Scan and discover widgets and business objects
- Generate TWX toolkit packages
- Register business objects with unique class IDs
- Deploy toolkits to BAW servers
- Monitor deployment status
- Manage toolkit versions

**Key Features**:
- Automatic artifact discovery
- Consistent ID management
- Version control integration
- Deployment automation
- Status monitoring

**Reference**: Package manager handles TWX generation and deployment

## Lab Structure

The lab is divided into five main parts:

1. **Lab Setup (10 min)** - Configure Bob and prepare environment
2. **Create Widget with Bob (20 min)** - Use BAW Coach Widget Mode to build the Carousel
3. **Package with Bob (10 min)** - Use BAW Package Manager Mode to create TWX
4. **Deploy to BAW (10 min)** - Deploy toolkit to BAW server
5. **Test Your Widget (10 min)** - Create test coach and verify functionality

## Widget Specification

### Carousel Card Structure

Each card in the carousel will have:

**Front Face**:
- Icon (SVG or icon class)
- Title text
- Subtle hover effect

**Back Face**:
- Descriptive text content
- Consistent styling
- Smooth transition

### Business Object

```javascript
CarouselItem {
  icon: String        // Icon identifier or SVG path
  title: String       // Card title
  description: String // Back face content
}
```

### Widget Configuration Options

- `cardWidth`: Width of each card (default: 200px)
- `cardHeight`: Height of each card (default: 250px)
- `spacing`: Gap between cards (default: 16px)
- `animationDuration`: Flip animation speed (default: 0.6s)

## Repository

All lab materials and example widgets are available in the GitHub repository:

**Repository URL**: https://github.com/MalekJabri/BOB-BAW-Widget

The repository includes:
- Complete source code for multiple example widgets
- Bob mode configuration files
- Established patterns and best practices
- Documentation and preview implementations
- Packaging and deployment scripts

## Getting Started

### Step 1: Access Bob's BAW Modes

Bob provides two specialized modes for BAW development:

1. **🎨 BAW Coach Widget Mode** (`baw-coachui-view`)
   - For creating and modifying widgets
   - Handles all widget implementation details
   - Ensures best practices and conventions

2. **📦 BAW Package Manager Mode** (`baw-package-manager`)
   - For packaging widgets into TWX files
   - Manages deployment to BAW servers
   - Handles version control and dependencies

### Step 2: Mode Workflow

**Widget Creation Flow**:
```
User Request → BAW Coach Widget Mode → Widget Files Created
```

**Packaging & Deployment Flow**:
```
Widget Files → BAW Package Manager Mode → TWX Package → BAW Server
```

### Step 3: Follow the Hands-On Guide

Proceed to the detailed step-by-step instructions in:

**[Carousel Widget Hands-On Lab Guide](Carousel_HandsOn_Lab.md)**

## What You'll Learn

### Technical Skills

- **AI-Assisted Development** - Using Bob to accelerate widget creation
- **BAW Widget Architecture** - Understanding the three-component structure
- **CSS Animations** - Implementing 3D flip transformations
- **Data Binding** - Connecting BAW business objects to widget UI
- **Event Handling** - Managing user interactions
- **Carbon Design System** - Following IBM's design language
- **Packaging & Deployment** - Complete toolkit lifecycle management

### Bob-Specific Concepts

- **Mode Selection** - Choosing the right mode for each task
- **Prompt Engineering** - Effective communication with Bob
- **Convention Following** - How Bob maintains consistency
- **Automated Workflows** - Leveraging Bob's built-in processes
- **Quality Assurance** - Bob's validation and best practices

### BAW-Specific Concepts

- `this.getData()` - Retrieving bound data from BAW
- `this.getOption()` - Accessing widget configuration options
- `this.context.element` - Accessing the widget's DOM
- Change event handler - Updating widget when data changes
- Custom view configuration - Setting up options and data binding

## Mode Integration Example

Here's how the two modes work together:

### Creating a Widget (BAW Coach Widget Mode)

```
User: "Create a Carousel widget with flip cards"

Bob (BAW Coach Widget Mode):
1. Analyzes requirements
2. Reviews similar widgets for patterns
3. Creates widget structure:
   - Layout.html (semantic structure)
   - InlineCSS.css (Carbon-themed styles)
   - inlineJavascript.js (data binding logic)
   - config.json (widget metadata)
   - CarouselItem.json (business object)
   - events/change.js (event handler)
   - Carousel.svg (palette icon)
4. Generates preview files
5. Creates documentation
```

### Packaging & Deploying (BAW Package Manager Mode)

```
User: "Package and deploy the Carousel widget"

Bob (BAW Package Manager Mode):
1. Scans widgets directory
2. Registers business objects with class IDs
3. Generates TWX package
4. Establishes BAW server connection
5. Deploys toolkit
6. Monitors deployment status
7. Reports results
```

## After the Lab

Once you complete the lab, you can:

- **Customize the widget** - Modify animations, styling, card layouts
- **Add advanced features** - Auto-rotation, navigation controls, lazy loading
- **Explore other widgets** - Study Timeline, Stepper, ProcessCircle examples
- **Create new widgets** - Apply learned patterns with Bob's assistance
- **Share with your team** - Deploy widgets to your BAW environment
- **Contribute back** - Share improvements with the community

## Support and Resources

### Documentation
- [IBM BAW Documentation](https://www.ibm.com/docs/en/baw)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Lab Repository](https://github.com/MalekJabri/BOB-BAW-Widget)
- [Bob BAW Coach Widget Mode Rules](.bob/rules-baw-coachui-view/)

### Example Widgets in Repository
- **Timeline** - Event timeline with vertical layout
- **Stepper** - Multi-step process indicator
- **ProgressBar** - Animated progress visualization
- **Breadcrumb** - Navigation breadcrumbs
- **ProcessCircle** - Circular progress indicator
- **DateOutput** - Customizable date display

### Bob Mode References
- **BAW Coach Widget Mode**: `.bob/rules-baw-coachui-view/1_workflow.xml`
- **Best Practices**: `.bob/rules-baw-coachui-view/2_best_practices.xml`
- **Carbon Theme Integration**: `docs/CARBON_THEME_INTEGRATION.md`
- **Theme Variables**: `themes/CARBON_THEME_VARIABLES.md`

## Lab Outcomes

Upon completion, you will have:

✅ A working Carousel widget with flip animations  
✅ Understanding of Bob's BAW development modes  
✅ Experience with AI-assisted widget development  
✅ Knowledge of packaging and deployment workflows  
✅ Skills to create additional custom widgets with Bob  
✅ Production-ready code following best practices  

## Key Advantages of Using Bob

1. **Speed** - Widget creation in minutes instead of hours
2. **Consistency** - Automatic adherence to conventions and best practices
3. **Quality** - Built-in validation and accessibility compliance
4. **Documentation** - Auto-generated, always in sync with code
5. **Learning** - Understand patterns through AI-guided development
6. **Deployment** - Automated packaging and deployment workflows

---

## Ready to Start?

Access the complete hands-on lab guide:

**➡️ [Carousel Widget Hands-On Lab Guide](Carousel_HandsOn_Lab.md)**

**Estimated Time**: 60 minutes  
**Difficulty**: Intermediate to Advanced  
**Prerequisites**: See above

---

**Version**: 1.0  
**Last Updated**: May 2026  
**IBM BAW Compatibility**: v18.0+  
**Bob Version**: Latest with BAW modes