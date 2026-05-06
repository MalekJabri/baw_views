# BAW Widget Development Lab

Welcome to the IBM Business Automation Workflow (BAW) widget development lab. This lab teaches you how to create custom BAW widgets using Bob's specialized AI-assisted development modes.

## 🎠 Carousel Widget Lab

**Create an interactive carousel with flip card animations using AI-assisted development**

- **Overview**: [Carousel_Lab_Overview.md](Carousel_Lab_Overview.md)
- **Hands-On Guide**: [Carousel_HandsOn_Lab.md](Carousel_HandsOn_Lab.md)
- **Duration**: 60 minutes
- **Difficulty**: Intermediate to Advanced
- **Approach**: AI-assisted with Bob's BAW modes

### What You'll Build

- Interactive carousel with horizontal card layout
- 3D flip animations on card click
- Front face: Icon and title
- Back face: Descriptive text
- Carbon Design System styling
- Full data binding with BAW business objects

### What You'll Learn

- Using Bob's BAW Coach Widget Mode for widget creation
- Using Bob's BAW Package Manager Mode for deployment
- Complete widget lifecycle from creation to deployment
- AI-assisted development workflows
- Complex CSS animations and transitions
- Carbon Design System integration

---

## 🤖 Bob's BAW Development Modes

### Complete Guide
**[Bob's BAW Modes Guide](BOB_BAW_MODES_GUIDE.md)** - Comprehensive documentation of both modes

### 🎨 BAW Coach Widget Mode
**Purpose**: Create and modify BAW coach widgets with AI assistance

**Capabilities**:
- Generate complete widget file structures
- Implement HTML, CSS, and JavaScript
- Create business object definitions
- Generate preview files
- Maintain documentation
- Follow best practices automatically

**When to Use**:
- Creating new widgets
- Modifying existing widgets
- Adding preview files
- Updating documentation

**Mode Identifier**: `baw-coachui-view`

### 📦 BAW Package Manager Mode
**Purpose**: Package and deploy BAW artifacts to servers

**Capabilities**:
- Scan and discover widgets automatically
- Register business objects with unique IDs
- Generate TWX toolkit packages
- Deploy to BAW servers
- Monitor deployment status
- Manage versions

**When to Use**:
- Packaging widgets into TWX files
- Deploying toolkits to BAW
- Managing toolkit versions
- Registering business objects

**Mode Identifier**: `baw-package-manager`

---

## 🚀 Quick Start

### Getting Started with the Lab

1. **Read the Overview**
   - [Carousel_Lab_Overview.md](Carousel_Lab_Overview.md)

2. **Follow the Hands-On Guide**
   - [Carousel_HandsOn_Lab.md](Carousel_HandsOn_Lab.md)

3. **Use Bob's Modes**
   ```
   Step 1: "Switch to BAW Coach Widget mode"
   Step 2: "Create a Carousel widget with flip cards"
   Step 3: "Switch to BAW Package Manager mode"
   Step 4: "Package and deploy the toolkit"
   ```

---

## 📖 Documentation Structure

```
lab-docs/
├── README.md                          # This file
├── BOB_BAW_MODES_GUIDE.md            # Complete modes documentation
├── Carousel_Lab_Overview.md          # Lab introduction
└── Carousel_HandsOn_Lab.md           # Step-by-step guide
```

---

## 🛠️ Prerequisites

### Required
- IBM Business Automation Workflow v18.0+
- Access to BAW Process Designer
- Bob AI Assistant configured
- VS Code with Bob extension
- Git installed
- Modern web browser (Chrome 85+, Firefox 90+, Safari 14+, Edge 85+)
- Basic knowledge of HTML, CSS, JavaScript, and BAW Coach Views

---

## 📦 Repository Structure

```
BAWCoachMode/
├── widgets/                    # Widget implementations
│   ├── Carousel/              # Carousel widget (from lab)
│   ├── Timeline/              # Example: Timeline widget
│   ├── Stepper/               # Example: Stepper widget
│   ├── ProgressBar/           # Example: Progress Bar widget
│   └── ...                    # Other example widgets
├── business-objects/          # Business object definitions
├── toolkit_packager/          # Packaging utilities
├── output/                    # Generated TWX files
├── .bob/                      # Bob mode configurations
│   └── rules-baw-coachui-view/
│       ├── 1_workflow.xml
│       └── 2_best_practices.xml
├── themes/                    # Carbon Design System themes
│   ├── Carbon.less
│   └── CARBON_THEME_VARIABLES.md
├── docs/                      # Additional documentation
│   └── CARBON_THEME_INTEGRATION.md
└── lab-docs/                  # Lab documentation (you are here)
    ├── README.md
    ├── BOB_BAW_MODES_GUIDE.md
    ├── Carousel_Lab_Overview.md
    └── Carousel_HandsOn_Lab.md
```

---

## 🎓 Learning Outcomes

After completing this lab, you will be able to:

### Technical Skills
- ✅ Create custom BAW coach widgets
- ✅ Implement HTML, CSS, and JavaScript for widgets
- ✅ Use Carbon Design System in BAW
- ✅ Implement data binding with BAW business objects
- ✅ Handle widget events and lifecycle
- ✅ Create animations and transitions
- ✅ Package widgets into TWX toolkits
- ✅ Deploy toolkits to BAW servers

### AI-Assisted Development
- ✅ Use Bob's BAW Coach Widget Mode effectively
- ✅ Use Bob's BAW Package Manager Mode
- ✅ Understand mode workflows and boundaries
- ✅ Leverage AI for faster development
- ✅ Maintain code quality with AI assistance

### BAW Expertise
- ✅ Understand BAW widget architecture
- ✅ Work with BAW data binding APIs
- ✅ Configure widget options and metadata
- ✅ Create business object definitions
- ✅ Test widgets in BAW Process Designer
- ✅ Deploy and manage toolkits

---

## 🔗 Additional Resources

### IBM Documentation
- [IBM BAW Documentation](https://www.ibm.com/docs/en/baw)
- [BAW Coach Views Guide](https://www.ibm.com/docs/en/baw/latest?topic=views-coach)
- [BAW Toolkit Development](https://www.ibm.com/docs/en/baw/latest?topic=toolkits-developing)

### Design Resources
- [Carbon Design System](https://carbondesignsystem.com/)
- [Carbon Components](https://www.carbondesignsystem.com/components/overview/)
- [Carbon Icons](https://www.carbondesignsystem.com/guidelines/icons/library/)

### Repository Resources
- [Widget Testing Guide](../WIDGET_TESTING_GUIDE.md)
- [Carbon Theme Variables](../themes/CARBON_THEME_VARIABLES.md)
- [Carbon Theme Integration](../docs/CARBON_THEME_INTEGRATION.md)

### Example Widgets
- [Timeline Widget](../widgets/Timeline/) - Event timeline with vertical layout
- [Stepper Widget](../widgets/Stepper/) - Multi-step process indicator
- [ProgressBar Widget](../widgets/ProgressBar/) - Animated progress visualization
- [Breadcrumb Widget](../widgets/Breadcrumb/) - Navigation breadcrumbs
- [ProcessCircle Widget](../widgets/ProcessCircle/) - Circular progress indicator
- [DateOutput Widget](../widgets/DateOutput/) - Customizable date display

---

## 🤝 Contributing

Found an issue or have suggestions for improving the lab?

1. Review the existing documentation
2. Test your changes thoroughly
3. Update related documentation
4. Submit improvements

---

## 🚀 Next Steps

After completing the lab:

1. **Explore Example Widgets**
   - Study Timeline, Stepper, Breadcrumb implementations
   - Understand different widget patterns
   - Learn advanced techniques

2. **Create Your Own Widgets**
   - Use Bob to create custom widgets
   - Apply learned patterns
   - Build your widget library

3. **Deploy to Production**
   - Package your widgets
   - Deploy to BAW environments
   - Share with your team

4. **Contribute Back**
   - Share your widgets
   - Improve documentation
   - Help others learn

---

## 📞 Support

### Documentation Issues
- Check the [Bob's BAW Modes Guide](BOB_BAW_MODES_GUIDE.md)
- Review example widgets in the repository
- Consult IBM BAW documentation

### Technical Issues
- Verify BAW version compatibility (v18.0+)
- Check browser compatibility
- Review error messages in browser console
- Test with example widgets first

### Lab Feedback
- Report issues or suggestions
- Share your experience
- Suggest improvements

---

## 🏆 Success Stories

After completing this lab, developers have:
- Created production widgets in hours instead of days
- Reduced development time by 70% using Bob
- Built consistent, accessible widgets automatically
- Deployed custom toolkits to enterprise BAW environments
- Trained teams on modern BAW development practices

---

## 🎯 Key Advantages of Using Bob

1. **Speed** - Widget creation in minutes instead of hours
2. **Consistency** - Automatic adherence to conventions and best practices
3. **Quality** - Built-in validation and accessibility compliance
4. **Documentation** - Auto-generated, always in sync with code
5. **Learning** - Understand patterns through AI-guided development
6. **Deployment** - Automated packaging and deployment workflows

---

**Version**: 1.0  
**Last Updated**: May 2026  
**IBM BAW Compatibility**: v18.0+  
**Bob Version**: Latest with BAW modes

---

**Ready to start?**
- 🎠 [Begin the Carousel Lab](Carousel_Lab_Overview.md)
- 🤖 [Learn About Bob's Modes](BOB_BAW_MODES_GUIDE.md)