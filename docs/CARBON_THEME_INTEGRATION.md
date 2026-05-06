# Carbon Theme Integration Guide

This document explains how BAW Coach widgets integrate with the Carbon Design System theme.

## Overview

All BAW Coach widgets in this repository follow Carbon Design System principles for colors, typography, spacing, and interaction patterns. The theme is defined in [`themes/Carbon.less`](../themes/Carbon.less) and widgets reference these values through inline comments.

## Implementation Approach

### Why Comments Instead of LESS Variables?

BAW widget inline CSS files (InlineCSS.css) are **pure CSS**, not LESS. They don't support LESS preprocessing or variable substitution. Therefore, we use **hardcoded values with inline comments** that document which Carbon theme variables they correspond to.

**Example:**
```css
.widget-title {
    font-size: 14px; /* @bpm-font-size-base */
    color: #161616; /* @bpm-text-color */
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; /* @bpm-font-family-sans-serif */
}
```

This approach provides:
1. **Documentation**: Developers can see which theme variables values correspond to
2. **Maintainability**: Easy to update when theme changes
3. **Consistency**: All widgets use the same color palette and typography
4. **Compatibility**: Works with BAW's CSS compilation process

## Updated Widgets

The following widgets have been updated to use Carbon theme values:

### ✅ Completed
- **Timeline** - Modern timeline with Carbon colors and typography
- **Stepper** - Vertical stepper with Carbon design tokens
- **ProgressBar** - Progress indicator with semantic colors
- **Breadcrumb** - Navigation breadcrumb with Carbon link styles
- **DateOutput** - Date display with Carbon typography

### 🔄 Pending Updates
- MultiSelect
- ProcessCircle
- MarkdownViewer
- FileNetBrowser
- FileNetImport
- FolderTree
- TasksList

## Carbon Theme Reference

For a complete reference of available Carbon theme variables, see:
- [`themes/CARBON_THEME_VARIABLES.md`](../themes/CARBON_THEME_VARIABLES.md) - Comprehensive variable reference
- [`themes/Carbon.less`](../themes/Carbon.less) - Source theme file

## Key Carbon Design Tokens

### Colors

#### Primary Colors
- **Primary Blue**: `#0f62fe` (`@bpm-color-primary`)
- **Primary Dark**: `#0353E9` (`@bpm-color-primary-dark`)
- **Hover Blue**: `#0043ce` (`@bpm-link-text-color-hover`)

#### Semantic Colors
- **Success**: `#198038` (`@bpm-color-success`)
- **Warning**: `#fdd13a` (`@bpm-color-warning`)
- **Error/Alert**: `#da1e28` (`@bpm-color-alert`)
- **Info**: `#6ccaff` (`@bpm-color-info`)

#### Neutral Grays
- **Gray 100 (Text)**: `#161616` (`@bpm-text-color`)
- **Gray 70**: `#525252` (Secondary text)
- **Gray 50**: `#8d8d8d` (Tertiary text)
- **Gray 30**: `#c6c6c6` (Disabled)
- **Gray 20**: `#e0e0e0` (Borders)
- **Gray 10**: `#f4f4f4` (Light backgrounds)
- **White**: `#ffffff` (`@bpm-body-bg`)

### Typography

#### Font Family
```css
font-family: 'IBM Plex Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
/* @bpm-font-family-sans-serif */
```

#### Font Sizes
- **Base**: `14px` (`@bpm-font-size-base`)
- **Small**: `12px` (`@bpm-font-size-small`)
- **XSmall**: `10px` (`@bpm-font-size-xsmall`)
- **Large**: `18px` (`@bpm-font-size-large`)
- **XLarge**: `24px` (`@bpm-font-size-xlarge`)
- **XXLarge**: `32px` (`@bpm-font-size-xxlarge`)

#### Font Weights
- **Normal**: `400` (`@bpm-font-weight-normal`)
- **Semibold**: `600` (`@bpm-font-weight-semibold`)
- **Bold**: `700` (`@bpm-font-weight-bold`)

## Widget CSS Structure

All widget CSS files should follow this structure:

```css
/* WidgetName Widget Styles - Carbon Design System */
/* Colors and typography aligned with themes/Carbon.less */

.widget_maincontentbox {
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; /* @bpm-font-family-sans-serif */
    font-size: 14px; /* @bpm-font-size-base */
    color: #161616; /* @bpm-text-color */
}

/* Widget-specific styles with Carbon theme comments */
.widget-element {
    background-color: #0f62fe; /* @bpm-color-primary */
    border-color: #e0e0e0; /* Gray 20 */
}

/* Made with Bob */
```

## Best Practices

### 1. Always Include Theme Comments
```css
/* ✅ Good */
color: #161616; /* @bpm-text-color */

/* ❌ Bad */
color: #161616;
```

### 2. Use Semantic Color Names
```css
/* ✅ Good */
background-color: #da1e28; /* @bpm-color-alert */

/* ❌ Bad */
background-color: #da1e28; /* Red */
```

### 3. Reference Gray Scale Properly
```css
/* ✅ Good */
border-color: #e0e0e0; /* Gray 20 */

/* ❌ Bad */
border-color: #e0e0e0; /* Light gray */
```

### 4. Document Font Sizes
```css
/* ✅ Good */
font-size: 14px; /* @bpm-font-size-base */

/* ❌ Bad */
font-size: 14px;
```

### 5. Include Font Family
```css
/* ✅ Good */
font-family: 'IBM Plex Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; /* @bpm-font-family-sans-serif */

/* ❌ Bad */
font-family: Arial, sans-serif;
```

## Updating Existing Widgets

To update an existing widget to use Carbon theme values:

1. **Read the current CSS** to understand the widget's styling
2. **Identify hardcoded values** that should use Carbon theme tokens
3. **Replace values** with Carbon equivalents
4. **Add inline comments** documenting the theme variable
5. **Test the widget** to ensure visual consistency
6. **Update widget README** if needed

### Example Update

**Before:**
```css
.widget-title {
    font-size: 16px;
    color: #333;
    font-family: Arial, sans-serif;
}
```

**After:**
```css
.widget-title {
    font-size: 18px; /* @bpm-font-size-large */
    color: #161616; /* @bpm-text-color */
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; /* @bpm-font-family-sans-serif */
}
```

## Creating New Widgets

When creating a new widget:

1. **Start with the template** from `create_widget_template.py`
2. **Use Carbon theme values** from the start
3. **Include theme comments** for all color and typography values
4. **Follow the widget CSS structure** outlined above
5. **Reference existing widgets** (Timeline, Stepper, ProgressBar) as examples

## Testing Theme Integration

After updating a widget:

1. **Visual Review**: Check that colors match Carbon Design System
2. **Typography Check**: Verify font family, sizes, and weights
3. **Responsive Test**: Ensure mobile breakpoints work correctly
4. **Accessibility**: Verify color contrast meets WCAG standards
5. **Preview Test**: Test in BAW Designer preview mode

## Resources

- [IBM Carbon Design System](https://carbondesignsystem.com/)
- [Carbon Color Palette](https://carbondesignsystem.com/guidelines/color/overview)
- [Carbon Typography](https://carbondesignsystem.com/guidelines/typography/overview)
- [Carbon Spacing](https://carbondesignsystem.com/guidelines/spacing/overview)

## Maintenance

### When Theme Changes

If the Carbon theme is updated:

1. Update [`themes/Carbon.less`](../themes/Carbon.less)
2. Update [`themes/CARBON_THEME_VARIABLES.md`](../themes/CARBON_THEME_VARIABLES.md)
3. Review all widget CSS files for affected values
4. Update hardcoded values to match new theme
5. Test all widgets for visual consistency

### Version Tracking

Document theme version in widget README files:
```markdown
## Theme Version
- Carbon Design System: v11
- BAW Theme: 25.0.1
- Last Updated: 2026-05-06
```

## Support

For questions or issues with Carbon theme integration:
1. Check [`themes/CARBON_THEME_VARIABLES.md`](../themes/CARBON_THEME_VARIABLES.md)
2. Review existing widget implementations
3. Consult [IBM Carbon Design System documentation](https://carbondesignsystem.com/)

<!-- Made with Bob -->