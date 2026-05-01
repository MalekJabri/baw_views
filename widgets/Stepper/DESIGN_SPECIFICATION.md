# Stepper Widget - Design Specification

## Overview

This document provides detailed visual design specifications for the enhanced Stepper widget, focusing on the new horizontal layout and visual improvements.

---

## Layout Variants

### 1. Vertical Layout (Existing - Enhanced)

```
┌────────────────────────────────────┐
│  Progress: 50% Complete            │
│  [████████████░░░░░░░░░░░░░░]     │
│                                    │
│  ┌──┐  Personal Information        │
│  │✓ │  Enter your details          │
│  └──┘  Status: Completed           │
│   │                                │
│   │ (Blue connector line)          │
│   │                                │
│  ┌──┐  Address                     │
│  │2 │  Provide your address        │
│  └──┘  Status: Current (pulsing)   │
│   │                                │
│   │ (Gray connector line)          │
│   │                                │
│  ┌──┐  Payment                     │
│  │3 │  Payment details             │
│  └──┘  Status: Pending             │
│   │                                │
│   │                                │
│   │                                │
│  ┌──┐  Review                      │
│  │4 │  Review and submit           │
│  └──┘  Status: Pending             │
└────────────────────────────────────┘
```

**Specifications:**
- Step circle: 32px diameter (28px on mobile)
- Connector line: 2px width
- Vertical spacing: 16px between steps
- Left padding: 0px (circles align to left edge)
- Label margin-left: 16px from circle
- Description margin-top: 4px from label

---

### 2. Horizontal Layout (New)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Progress: 50% Complete                            │
│              [████████████████░░░░░░░░░░░░░░░░]                     │
│                                                                      │
│  ┌──┐          ┌──┐          ┌──┐          ┌──┐                    │
│  │✓ │──────────│2 │──────────│3 │──────────│4 │                    │
│  └──┘          └──┘          └──┘          └──┘                    │
│   │             │             │             │                       │
│ Personal      Address       Payment       Review                    │
│ Information                                                          │
│   │             │             │             │                       │
│ Enter your   Provide your  Payment      Review and                  │
│ details      address        details      submit                     │
│                                                                      │
│ Completed    Current        Pending      Pending                    │
└─────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Step circle: 32px diameter
- Connector line: 2px height, flexible width
- Horizontal spacing: 48px minimum between circles
- Label margin-top: 12px from circle
- Description margin-top: 4px from label
- Text alignment: center under each circle
- Max width per step: 150px

---

### 3. Compact Horizontal Layout

```
┌──────────────────────────────────────────────────────────┐
│  [████████░░░░] 50%                                      │
│                                                          │
│  [1✓]────[2]────[3]────[4]                              │
│  Personal  Address  Payment  Review                      │
└──────────────────────────────────────────────────────────┘
```

**Specifications:**
- Step circle: 24px diameter
- Connector line: 1px height
- Horizontal spacing: 32px between circles
- No descriptions shown
- Single-line labels only
- Ideal for narrow containers

---

## Color Specifications

### Status Colors (Carbon Design System)

| Status | Circle BG | Circle Border | Text Color | Connector | Hex Codes |
|--------|-----------|---------------|------------|-----------|-----------|
| **Completed** | Blue 60 | Blue 60 | Gray 100 | Blue 60 | `#0f62fe` / `#161616` |
| **Current** | White | Blue 60 (3px) | Blue 60 | Gray 40 | `#ffffff` / `#0f62fe` / `#e0e0e0` |
| **Pending** | White | Gray 40 | Gray 70 | Gray 40 | `#ffffff` / `#e0e0e0` / `#525252` |
| **Error** | Red 60 | Red 60 | Gray 100 | Gray 40 | `#da1e28` / `#161616` |
| **Warning** | Yellow 30 | Yellow 30 | Gray 100 | Gray 40 | `#f1c21b` / `#161616` |
| **Disabled** | Gray 20 | Gray 40 | Gray 50 | Gray 30 | `#f4f4f4` / `#c6c6c6` / `#8d8d8d` |

### Progress Bar Colors

| State | Background | Fill | Text |
|-------|------------|------|------|
| Normal | Gray 20 `#e0e0e0` | Blue 60 `#0f62fe` | Gray 100 `#161616` |
| Complete | Gray 20 `#e0e0e0` | Green 60 `#24a148` | Gray 100 `#161616` |
| Error | Gray 20 `#e0e0e0` | Red 60 `#da1e28` | Gray 100 `#161616` |

---

## Typography

### Font Family
```css
font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
```

### Text Styles

| Element | Size | Weight | Line Height | Color |
|---------|------|--------|-------------|-------|
| Step Label (Active) | 14px (0.875rem) | 600 | 1.4 | Gray 100 `#161616` |
| Step Label (Inactive) | 14px (0.875rem) | 400 | 1.4 | Gray 70 `#525252` |
| Step Description | 12px (0.75rem) | 400 | 1.4 | Gray 70 `#8d8d8d` |
| Step Number | 14px (0.875rem) | 600 | 1 | Varies by status |
| Progress Text | 12px (0.75rem) | 400 | 1.4 | Gray 70 `#525252` |
| Progress Percentage | 14px (0.875rem) | 600 | 1.4 | Gray 100 `#161616` |

---

## Spacing System

### Vertical Layout
```css
--step-circle-size: 32px;
--step-spacing-vertical: 16px;
--label-margin-left: 16px;
--description-margin-top: 4px;
--connector-width: 2px;
--connector-offset-top: 32px; /* Circle diameter */
```

### Horizontal Layout
```css
--step-circle-size: 32px;
--step-spacing-horizontal: 48px;
--label-margin-top: 12px;
--description-margin-top: 4px;
--connector-height: 2px;
--connector-min-width: 32px;
```

### Compact Mode
```css
--step-circle-size-compact: 24px;
--step-spacing-compact: 32px;
--label-margin-compact: 8px;
```

---

## Animation Specifications

### 1. Step Pulse (Current Step)
```css
@keyframes stepPulse {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(15, 98, 254, 0.1);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(15, 98, 254, 0.05);
  }
}

/* Applied to current step */
animation: stepPulse 2s ease-in-out infinite;
```

### 2. Step Completion
```css
@keyframes stepComplete {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(15, 98, 254, 0);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 0 0 8px rgba(15, 98, 254, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(15, 98, 254, 0);
  }
}

/* Triggered on status change to completed */
animation: stepComplete 0.5s ease-out;
```

### 3. Connector Fill (Horizontal)
```css
@keyframes connectorFill {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    transform: scaleX(1);
  }
}

/* Applied when step completes */
animation: connectorFill 0.4s ease-out;
```

### 4. Progress Bar Fill
```css
@keyframes progressFill {
  from {
    width: 0%;
  }
  to {
    width: var(--progress-percentage);
  }
}

/* Applied on progress change */
animation: progressFill 0.6s ease-out;
transition: width 0.6s ease-out;
```

### 5. Hover Lift (Clickable Steps)
```css
.stepper-item.clickable:hover .step-circle {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease-out;
}
```

### 6. Step Fade In
```css
@keyframes stepFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Applied to new steps */
animation: stepFadeIn 0.3s ease-out;
```

---

## Responsive Breakpoints

### Desktop (≥1056px)
- Horizontal layout: Full width with all labels
- Step spacing: 48px
- Circle size: 32px
- Show all descriptions

### Tablet (672px - 1055px)
- Horizontal layout: Reduced spacing
- Step spacing: 32px
- Circle size: 32px
- Truncate long descriptions

### Mobile (≤671px)
- **Auto-switch to vertical layout**
- Circle size: 28px
- Reduced spacing: 12px
- Compact labels

### Breakpoint CSS
```css
/* Desktop */
@media (min-width: 1056px) {
  .stepper-list.horizontal {
    gap: 48px;
  }
}

/* Tablet */
@media (min-width: 672px) and (max-width: 1055px) {
  .stepper-list.horizontal {
    gap: 32px;
  }
  .step-description {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* Mobile - Force vertical */
@media (max-width: 671px) {
  .stepper-list.horizontal {
    flex-direction: column !important;
  }
  .step-circle {
    width: 28px;
    height: 28px;
  }
}
```

---

## Icon Specifications

### Default Icons (SVG)

#### Checkmark (Completed)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <path fill="#ffffff" d="M6.5 11.5l-3-3 1-1 2 2 5-5 1 1z"/>
</svg>
```

#### Error X
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <path fill="#ffffff" d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm3.3 9.7L8 7.4l-3.3 3.3-1.4-1.4L6.6 6 3.3 2.7l1.4-1.4L8 4.6l3.3-3.3 1.4 1.4L9.4 6l3.3 3.3-1.4 1.4z"/>
</svg>
```

#### Warning Triangle
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <path fill="#161616" d="M8 1L1 15h14L8 1zm0 10.5c-.4 0-.8-.3-.8-.8s.3-.8.8-.8.8.3.8.8-.4.8-.8.8zm.8-2.3h-1.5V5.5h1.5v3.7z"/>
</svg>
```

### Custom Icon Support

#### Via Data URL
```javascript
icon: "data:image/svg+xml;utf8,<svg>...</svg>"
```

#### Via Icon Class
```javascript
iconClass: "bx--icon bx--upload"
```

#### Icon Sizing
- Default: 16px × 16px
- Large: 20px × 20px
- Small: 12px × 12px

---

## Progress Bar Design

### Standard Progress Bar
```
┌────────────────────────────────────────┐
│  Progress: 3 of 4 steps complete       │
│  [████████████████████░░░░░░░░] 75%   │
└────────────────────────────────────────┘
```

**Specifications:**
- Height: 8px
- Border radius: 4px
- Background: Gray 20 `#e0e0e0`
- Fill: Blue 60 `#0f62fe`
- Margin: 16px bottom
- Text above: 12px, Gray 70

### Compact Progress Bar
```
[████████░░░░] 60%
```

**Specifications:**
- Height: 4px
- Border radius: 2px
- Inline with text
- No separate label

---

## Accessibility Specifications

### ARIA Attributes

#### Container
```html
<div class="stepper-container" 
     role="navigation" 
     aria-label="Multi-step process">
```

#### Step List
```html
<div class="stepper-list" 
     role="list">
```

#### Step Item
```html
<div class="stepper-item" 
     role="listitem"
     aria-current="step"
     aria-label="Step 2 of 4: Address, current step"
     tabindex="0">
```

#### Progress Bar
```html
<div class="progress-bar" 
     role="progressbar"
     aria-valuenow="50"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Overall progress: 50 percent complete">
```

### Focus Indicators
```css
.stepper-item:focus {
  outline: 2px solid #0f62fe;
  outline-offset: 2px;
  border-radius: 4px;
}

.stepper-item:focus-visible {
  outline: 2px solid #0f62fe;
  outline-offset: 2px;
}
```

### Color Contrast Ratios
- Text on white: 4.5:1 minimum (WCAG AA)
- Icons on colored backgrounds: 3:1 minimum
- Focus indicators: 3:1 minimum

---

## Interactive States

### Hover (Clickable Steps)
```css
.stepper-item.clickable:hover {
  cursor: pointer;
}

.stepper-item.clickable:hover .step-circle {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.stepper-item.clickable:hover .step-label {
  color: #0f62fe;
}
```

### Active/Pressed
```css
.stepper-item.clickable:active .step-circle {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### Focus
```css
.stepper-item:focus {
  outline: 2px solid #0f62fe;
  outline-offset: 2px;
}
```

### Disabled
```css
.stepper-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## Validation States

### Valid Step
```
┌──┐
│✓ │  Step Name
└──┘  ✓ Validation passed
```
- Green checkmark icon
- Green text for validation message
- Color: Green 60 `#24a148`

### Invalid Step
```
┌──┐
│✗ │  Step Name
└──┘  ✗ Please fix errors
```
- Red X icon
- Red text for validation message
- Color: Red 60 `#da1e28`

### Warning Step
```
┌──┐
│⚠ │  Step Name
└──┘  ⚠ Review recommended
```
- Yellow warning icon
- Orange text for validation message
- Color: Orange 40 `#ff832b`

---

## Component Variations

### 1. Minimal Stepper (Numbers Only)
```
1 ──── 2 ──── 3 ──── 4
```

### 2. Icon Stepper (Custom Icons)
```
[📄] ──── [📍] ──── [💳] ──── [✓]
```

### 3. Timeline Stepper (With Timestamps)
```
1 ● Step 1
│   10:30 AM
│
2 ● Step 2
│   11:45 AM
│
3 ○ Step 3
    Pending
```

### 4. Wizard Stepper (With Actions)
```
1 ● Step 1        [Edit]
│   Completed
│
2 ● Step 2        [Continue]
    Current
```

---

## Implementation Notes

### CSS Variables
```css
:root {
  /* Colors */
  --stepper-blue: #0f62fe;
  --stepper-gray-10: #f4f4f4;
  --stepper-gray-20: #e0e0e0;
  --stepper-gray-40: #a8a8a8;
  --stepper-gray-70: #525252;
  --stepper-gray-100: #161616;
  
  /* Sizing */
  --stepper-circle-size: 32px;
  --stepper-circle-size-mobile: 28px;
  --stepper-connector-width: 2px;
  
  /* Spacing */
  --stepper-spacing-vertical: 16px;
  --stepper-spacing-horizontal: 48px;
  
  /* Animation */
  --stepper-transition-speed: 0.3s;
  --stepper-animation-easing: cubic-bezier(0.2, 0, 0.38, 0.9);
}
```

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Android 90+

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-13  
**Status**: Design Specification - Ready for Implementation