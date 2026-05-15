# Progress Bar Widget - Lab Overview

## Introduction

This hands-on lab teaches you how to create a custom Progress Bar widget for IBM Business Automation Workflow (BAW). You'll build a production-ready widget from scratch in just 45 minutes, learning the fundamental patterns for BAW widget development.

## What You'll Build

A fully functional Progress Bar widget with:

- **Animated horizontal progress bar** with smooth transitions
- **Percentage display** showing real-time progress
- **Color-coded states** that change automatically:
  - 🔴 Red (0-49%): Low progress
  - 🟡 Yellow (50-74%): Moderate progress
  - 🟢 Green (75-100%): High progress
- **Status messages** ("Not started", "In progress...", "Complete")
- **Data binding** with BAW business objects
- **Event handling** for automatic updates
- **Accessibility** with ARIA support

## Lab Details

- **Duration**: 45 minutes
- **Difficulty**: Intermediate
- **Format**: Hands-on, step-by-step guide

## Prerequisites

Before starting this lab, you should have:

- IBM Business Automation Workflow v18.0+ installed
- Access to IBM BAW Process Designer
- A Process App or Toolkit where you can create custom views
- Git installed on your machine
- A text editor (VS Code recommended)
- Modern web browser (Chrome 85+, Firefox 90+, Safari 14+, or Edge 85+)
- Basic knowledge of HTML, CSS, JavaScript, and BAW Coach Views

## Learning Objectives

By completing this lab, you will learn to:

1. Create custom BAW Coach View widgets from scratch
2. Implement HTML structure with Carbon Design System principles
3. Style widgets using CSS with animations and transitions
4. Write JavaScript for data binding and widget lifecycle management
5. Configure widget options and business data models
6. Implement event handlers for dynamic updates
7. Test and debug custom widgets in BAW Process Designer

## Lab Structure

The lab is divided into four main parts:

1. **Lab Setup (5 min)** - Clone repository and prepare environment
2. **Create Widget Files (10 min)** - Build HTML, CSS, and JavaScript files
3. **Import to BAW (10 min)** - Import widget into BAW Process Designer
4. **Test Your Widget (10 min)** - Create test coach and verify functionality
5. **Understanding the Code (10 min)** - Learn how the widget works

## Repository

All lab materials and example widgets are available in the GitHub repository:

**Repository URL**: https://github.com/MalekJabri/BOB-BAW-Widget

The repository includes:
- Complete source code for the Progress Bar widget
- Multiple example widgets (Breadcrumb, ProcessCircle, FileNetBrowser, etc.)
- Established patterns and best practices
- Documentation and preview implementations

## Getting Started

To begin the lab, follow the detailed step-by-step instructions in:

**[Progress Bar Hands-On Lab Guide](ProgressBar_HandsOn_Lab.md)**

The guide provides:
- Complete, copy-paste-ready code for all widget files
- Clear step-by-step instructions with time estimates
- Screenshot placeholders for visual guidance
- Testing checklist with expected results
- Troubleshooting tips for common issues
- Explanations of key concepts and patterns

## What You'll Learn

### Technical Skills

- **BAW Widget Architecture** - Understanding the three-component structure (HTML, CSS, JavaScript)
- **Data Binding** - Connecting BAW business objects to widget UI
- **Event Handling** - Implementing the change event for dynamic updates
- **Carbon Design System** - Following IBM's design language
- **Accessibility** - Implementing ARIA attributes for screen readers
- **Responsive Design** - Creating mobile-friendly layouts

### BAW-Specific Concepts

- `this.getData()` - Retrieving bound data from BAW
- `this.getOption()` - Accessing widget configuration options
- `this.context.element` - Accessing the widget's DOM
- Change event handler - Updating widget when data changes
- Custom view configuration - Setting up options and data binding

## After the Lab

Once you complete the lab, you can:

- **Customize the widget** - Modify colors, thresholds, animations
- **Add advanced features** - Striped patterns, custom themes, milestones
- **Explore other widgets** - Study Breadcrumb, ProcessCircle, Stepper examples
- **Create new widgets** - Apply learned patterns to build custom components
- **Share with your team** - Deploy widgets to your BAW environment

## Support and Resources

### Documentation
- [IBM BAW Documentation](https://www.ibm.com/docs/en/baw)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Lab Repository](https://github.com/MalekJabri/BOB-BAW-Widget)

### Example Widgets in Repository
- **Breadcrumb** - Navigation breadcrumbs with overflow handling
- **ProcessCircle** - Circular progress indicator
- **Stepper** - Multi-step process indicator
- **FileNetBrowser** - File and folder browser
- **DateOutput** - Customizable date display

## Lab Outcomes

Upon completion, you will have:

✅ A working Progress Bar widget deployed in BAW  
✅ Understanding of BAW widget architecture  
✅ Knowledge of data binding and event handling  
✅ Skills to create additional custom widgets  
✅ Production-ready code following best practices  

---

## Ready to Start?

Access the complete hands-on lab guide:

**➡️ [Progress Bar Hands-On Lab Guide](ProgressBar_HandsOn_Lab.md)**

**Estimated Time**: 45 minutes  
**Difficulty**: Intermediate  
**Prerequisites**: See above

---

**Version**: 1.0  
**Last Updated**: March 2026  
**IBM BAW Compatibility**: v18.0+