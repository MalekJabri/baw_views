# Carousel Widget - Hands-On Lab Guide

## Lab Overview

In this hands-on lab, you'll create a Carousel widget with flip card animations using Bob's specialized BAW modes. This lab demonstrates the complete widget development lifecycle using AI-assisted development.

**Duration**: 60 minutes  
**Difficulty**: Intermediate to Advanced

---

## Part 1: Lab Setup (10 minutes)

### Step 1.1: Verify Bob Configuration

Ensure Bob is configured with BAW modes:

1. Open VS Code with Bob extension
2. Check that Bob has access to these modes:
   - 🎨 **BAW Coach Widget Mode** (`baw-coachui-view`)
   - 📦 **BAW Package Manager Mode** (`baw-package-manager`)

3. Verify your workspace is the BAW widget repository:
   ```
   /path/to/BAWCoachMode/
   ```

### Step 1.2: Review Repository Structure

Familiarize yourself with the key directories:

```
BAWCoachMode/
├── widgets/              # Widget implementations
├── business-objects/     # Business object definitions
├── toolkit_packager/     # Packaging utilities
├── output/              # Generated TWX files
├── .bob/                # Bob mode configurations
└── lab-docs/            # Lab documentation
```

### Step 1.3: Understand the Widget Requirements

**Carousel Widget Specifications**:
- Display multiple cards in a horizontal layout
- Each card has a front face (icon + title) and back face (description)
- Cards flip on click with smooth 3D animation
- Responsive design with configurable dimensions
- Carbon Design System styling
- Data-driven from BAW business objects

---

## Part 2: Create Widget with Bob (20 minutes)

### Step 2.1: Switch to BAW Coach Widget Mode

**Prompt to Bob**:
```
Switch to BAW Coach Widget mode
```

Bob will activate the specialized mode for widget creation.

### Step 2.2: Request Widget Creation

**Prompt to Bob**:
```
Create a Carousel widget with the following specifications:

Widget Name: Carousel
Description: A carousel widget that displays cards with flip animations

Card Structure:
- Front face: Icon and title
- Back face: Description text
- Flip animation on click

Business Object (CarouselItem):
- icon: String (icon identifier)
- title: String (card title)
- description: String (back face content)

Configuration Options:
- cardWidth: Number (default: 200)
- cardHeight: Number (default: 250)
- spacing: Number (default: 16)
- animationDuration: Number (default: 0.6)

Styling:
- Use Carbon Design System colors
- Smooth 3D flip animation
- Hover effects on cards
- Responsive layout

The widget should bind to a list of CarouselItem objects.
```

### Step 2.3: Review Generated Files

Bob will create the following files in `widgets/Carousel/`:

```
widgets/Carousel/
├── Carousel.svg                    # Palette icon
├── README.md                       # Widget documentation
├── widget/
│   ├── Layout.html                 # HTML structure
│   ├── InlineCSS.css              # Styling with animations
│   ├── inlineJavascript.js        # Data binding logic
│   ├── config.json                # Widget metadata
│   ├── CarouselItem.json          # Business object definition
│   ├── datamodel.md               # Data model documentation
│   ├── eventHandler.md            # Event documentation
│   └── events/
│       └── change.js              # Change event handler
└── AdvancePreview/
    ├── Carousel.html              # Preview HTML
    └── CarouselSnippet.js         # Preview JavaScript
```

### Step 2.4: Examine Key Implementation Details

**Layout.html** - Semantic structure:
```html
<div class="carousel-container">
  <div class="carousel-track" data-dojo-attach-point="carouselTrack">
    <!-- Cards generated dynamically -->
  </div>
</div>
```

**InlineCSS.css** - Flip animation:
```css
.carousel-card {
  perspective: 1000px;
  transition: transform 0.6s;
}

.carousel-card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  backface-visibility: hidden;
}
```

**inlineJavascript.js** - Data binding:
```javascript
var carouselData = this.getData().items; // Access list data
var cardWidth = this.getOption("cardWidth") || 200;
```

### Step 2.5: Verify Widget Files

**Checklist**:
- [ ] All widget files created in `widgets/Carousel/`
- [ ] Business object `CarouselItem.json` defined
- [ ] Configuration options in `config.json`
- [ ] Preview files in `AdvancePreview/`
- [ ] Documentation files created
- [ ] Palette icon `Carousel.svg` exists

---

## Part 3: Package with Bob (10 minutes)

### Step 3.1: Switch to BAW Package Manager Mode

**Prompt to Bob**:
```
Switch to BAW Package Manager mode
```

Bob will activate the packaging and deployment mode.

### Step 3.2: Register Business Objects

**Prompt to Bob**:
```
Register the CarouselItem business object
```

Bob will:
1. Scan business objects directory
2. Assign unique class IDs
3. Update the business object registry

**Expected Output**:
```
INFO: Scanning business objects in: business-objects/generated
INFO:   ✓ Found: CarouselItem (3 properties)
INFO: Business object registered with ID: 12.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Step 3.3: Package the Toolkit

**Prompt to Bob**:
```
Package all widgets including the new Carousel widget
```

Bob will:
1. Scan widgets directory (discovers Carousel automatically)
2. Increment toolkit version
3. Generate TWX package
4. Include all widgets and business objects

**Expected Output**:
```
INFO: Found 13 widgets
INFO: Added widget: Carousel
INFO: Building TWX package with 13 widget(s)
INFO: TWX package created: output/Custom_Widgets_1.0.XX.twx
INFO: Package size: XX.XX MB
```

### Step 3.4: Verify Package Contents

**Checklist**:
- [ ] TWX file created in `output/` directory
- [ ] Carousel widget included in package
- [ ] CarouselItem business object included
- [ ] Version number incremented
- [ ] Package size reasonable

---

## Part 4: Deploy to BAW (10 minutes)

### Step 4.1: Deploy Toolkit

**Prompt to Bob**:
```
Deploy the toolkit to BAW server
```

Bob will:
1. Establish BAW server connection
2. Upload TWX package
3. Monitor deployment status
4. Report results

**Expected Output**:
```
INFO: Successfully obtained CSRF token
INFO: Toolkit deployment submitted
INFO: Deployment status: success
INFO: Toolkit available in BAW Process Designer
```

### Step 4.2: Verify Deployment

1. Open IBM BAW Process Designer
2. Navigate to the Toolkit or Process App
3. Check the palette for the new Carousel widget
4. Verify the widget icon appears correctly

**Screenshot Placeholder**: [BAW Designer showing Carousel widget in palette]

---

## Part 5: Test Your Widget (10 minutes)

### Step 5.1: Create Test Coach

1. In BAW Process Designer, create a new Coach
2. Name it "Carousel Test Coach"
3. Drag the Carousel widget onto the canvas

### Step 5.2: Create Test Data

Create a business object variable with sample data:

**Variable Name**: `carouselItems`  
**Type**: `CarouselItem[]` (List)

**Sample Data**:
```javascript
[
  {
    "icon": "icon-analytics",
    "title": "Analytics",
    "description": "Powerful analytics and reporting tools for data-driven insights"
  },
  {
    "icon": "icon-automation",
    "title": "Automation",
    "description": "Streamline processes with intelligent automation capabilities"
  },
  {
    "icon": "icon-integration",
    "title": "Integration",
    "description": "Seamless integration with enterprise systems and APIs"
  },
  {
    "icon": "icon-security",
    "title": "Security",
    "description": "Enterprise-grade security with role-based access control"
  }
]
```

### Step 5.3: Bind Data to Widget

1. Select the Carousel widget
2. In the Properties panel, bind the data:
   - **Binding**: `carouselItems`
3. Configure options:
   - **Card Width**: 200
   - **Card Height**: 250
   - **Spacing**: 16
   - **Animation Duration**: 0.6

### Step 5.4: Test Widget Functionality

Run the Coach and verify:

**Visual Tests**:
- [ ] Cards display in horizontal layout
- [ ] Icons and titles visible on front face
- [ ] Proper spacing between cards
- [ ] Carbon Design System styling applied

**Interaction Tests**:
- [ ] Click card to flip
- [ ] Smooth 3D flip animation
- [ ] Back face shows description
- [ ] Click again to flip back
- [ ] Hover effects work correctly

**Responsive Tests**:
- [ ] Layout adapts to different screen sizes
- [ ] Cards remain readable on mobile
- [ ] Animations work on all devices

**Screenshot Placeholder**: [Carousel widget showing cards in front state]  
**Screenshot Placeholder**: [Carousel widget showing flipped card with description]

### Step 5.5: Test Data Updates

1. Modify the `carouselItems` variable
2. Add or remove items
3. Change titles and descriptions
4. Verify widget updates automatically

---

## Part 6: Understanding the Implementation (10 minutes)

### How Bob's BAW Coach Widget Mode Works

**Workflow**:
1. **Analyzes Requirements** - Understands widget specifications
2. **Reviews Patterns** - Examines similar widgets for conventions
3. **Generates Structure** - Creates complete file set
4. **Applies Best Practices** - Ensures accessibility, Carbon theme, conventions
5. **Creates Documentation** - Generates aligned documentation

**Key Features**:
- Automatic convention following
- Carbon Design System integration
- Accessibility compliance
- Preview file generation
- Documentation synchronization

### How Bob's BAW Package Manager Mode Works

**Workflow**:
1. **Scans Project** - Discovers widgets and business objects
2. **Registers Objects** - Assigns unique class IDs
3. **Generates TWX** - Creates toolkit package
4. **Deploys** - Uploads to BAW server
5. **Monitors** - Tracks deployment status

**Key Features**:
- Automatic artifact discovery
- Version management
- ID consistency
- Deployment automation
- Status monitoring

### Widget Architecture

**Three-Component Structure**:

1. **Layout.html** - Semantic HTML structure
   - Accessibility attributes
   - Data attachment points
   - Container structure

2. **InlineCSS.css** - Styling with Carbon theme
   - Hardcoded values with theme comments
   - Animations and transitions
   - Responsive design

3. **inlineJavascript.js** - Data binding and logic
   - `this.getData().items` for list data
   - `this.getOption()` for configuration
   - DOM manipulation
   - Event handling

### Data Binding Pattern

**List Binding**:
```javascript
// config.json
"bindingType": {
  "name": "CarouselData",
  "isList": true,
  "type": "CarouselItem"
}

// inlineJavascript.js
var items = this.getData().items; // MUST use .items for lists
```

**Important**: When `isList: true`, BAW wraps the array in an object with an `items` property.

### Carbon Design System Integration

**Color Usage**:
```css
.carousel-card {
  background-color: #ffffff; /* @bpm-body-bg */
  border: 1px solid #e0e0e0; /* Gray 20 */
  color: #161616; /* @bpm-text-color */
}

.card-title {
  color: #0f62fe; /* @bpm-color-primary */
}
```

**Typography**:
```css
.card-title {
  font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif; /* @bpm-font-family-sans-serif */
  font-size: 18px; /* @bpm-font-size-large */
  font-weight: 600; /* @bpm-font-weight-semibold */
}
```

---

## Troubleshooting

### Widget Not Appearing in Palette

**Solution**:
1. Verify TWX deployment succeeded
2. Refresh BAW Process Designer
3. Check toolkit is installed and active
4. Verify widget icon (Carousel.svg) exists

### Cards Not Flipping

**Solution**:
1. Check browser console for JavaScript errors
2. Verify CSS animation properties are applied
3. Ensure click event handler is attached
4. Test in different browsers

### Data Not Displaying

**Solution**:
1. Verify data binding uses `.items` for list data
2. Check business object structure matches CarouselItem
3. Ensure variable is properly initialized
4. Review browser console for errors

### Styling Issues

**Solution**:
1. Verify InlineCSS.css is included in package
2. Check for CSS specificity conflicts
3. Ensure Carbon theme values are correct
4. Test with browser developer tools

---

## Next Steps

### Customize Your Widget

**Easy Customizations**:
- Change card dimensions
- Modify animation speed
- Adjust colors and styling
- Add custom icons

**Advanced Enhancements**:
- Auto-rotation feature
- Navigation arrows
- Pagination indicators
- Lazy loading for large datasets
- Touch/swipe gestures for mobile

### Explore Other Widgets

Study these widgets in the repository:
- **Timeline** - Vertical event timeline
- **Stepper** - Multi-step process indicator
- **ProgressBar** - Animated progress visualization
- **ProcessCircle** - Circular progress indicator

### Create New Widgets

Use Bob to create additional widgets:
```
Prompt: "Create a [WidgetName] widget with [specifications]"
```

Bob will follow the same patterns and conventions automatically.

---

## Lab Completion Checklist

### Widget Creation
- [ ] Carousel widget files created
- [ ] Business object defined
- [ ] Configuration options set
- [ ] Preview files generated
- [ ] Documentation created

### Packaging
- [ ] Business objects registered
- [ ] TWX package generated
- [ ] Version incremented
- [ ] Package verified

### Deployment
- [ ] Toolkit deployed to BAW
- [ ] Deployment status confirmed
- [ ] Widget appears in palette

### Testing
- [ ] Test coach created
- [ ] Sample data configured
- [ ] Visual tests passed
- [ ] Interaction tests passed
- [ ] Responsive tests passed

### Understanding
- [ ] Understand Bob's workflow
- [ ] Know widget architecture
- [ ] Understand data binding
- [ ] Know Carbon integration
- [ ] Can troubleshoot issues

---

## Key Takeaways

1. **Bob Accelerates Development** - Widget creation in minutes vs hours
2. **Modes Provide Structure** - Specialized modes for different tasks
3. **Conventions Matter** - Consistency across all widgets
4. **Carbon Integration** - Professional IBM look and feel
5. **Complete Lifecycle** - From creation to deployment
6. **AI-Assisted Quality** - Built-in best practices and validation

---

## Additional Resources

### Documentation
- [Carousel Lab Overview](Carousel_Lab_Overview.md)
- [BAW Coach Widget Mode Rules](.bob/rules-baw-coachui-view/)
- [Carbon Theme Variables](../themes/CARBON_THEME_VARIABLES.md)
- [Carbon Theme Integration](../docs/CARBON_THEME_INTEGRATION.md)

### Example Code
- [Timeline Widget](../widgets/Timeline/)
- [Stepper Widget](../widgets/Stepper/)
- [ProgressBar Widget](../widgets/ProgressBar/)

### IBM Resources
- [IBM BAW Documentation](https://www.ibm.com/docs/en/baw)
- [Carbon Design System](https://carbondesignsystem.com/)

---

## Congratulations!

You've successfully completed the Carousel Widget lab using Bob's specialized BAW modes. You now have:

✅ A working Carousel widget with flip animations  
✅ Experience with AI-assisted widget development  
✅ Understanding of Bob's BAW development workflow  
✅ Knowledge of packaging and deployment processes  
✅ Skills to create additional custom widgets  

**Continue exploring** and building amazing widgets for IBM Business Automation Workflow!

---

**Version**: 1.0  
**Last Updated**: May 2026  
**IBM BAW Compatibility**: v18.0+  
**Bob Version**: Latest with BAW modes