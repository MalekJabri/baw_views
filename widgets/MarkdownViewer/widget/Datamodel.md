## Business Data

The MarkdownViewer widget expects a string containing markdown-formatted text as input. The widget will parse and render this markdown text into formatted HTML.

### Data Structure

- **Type**: String
- **Required**: Yes
- **Default**: Empty string (displays nothing)

### Input Format

The widget accepts standard markdown syntax including:

#### Headers
```markdown
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header
```

#### Text Formatting
```markdown
**Bold text** or __Bold text__
*Italic text* or _Italic text_
~~Strikethrough text~~
`Inline code`
```

#### Links and Images
```markdown
[Link text](https://example.com)
![Image alt text](https://example.com/image.png)
```

#### Lists
```markdown
Unordered list:
* Item 1
* Item 2
- Item 3

Ordered list:
1. First item
2. Second item
3. Third item
```

#### Code Blocks
````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
````

#### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

#### Horizontal Rules
```markdown
---
***
___
```

#### Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableSanitization` | Boolean | `true` | Enable HTML sanitization to prevent XSS attacks. When enabled, HTML tags in the markdown will be escaped. |
| `showLineNumbers` | Boolean | `false` | Display line numbers alongside the rendered content. Useful for code documentation or technical content. |
| `theme` | String | `"default"` | Visual theme for the markdown viewer. Options: `"default"`, `"light"`, `"dark"` |

### Theme Options

#### Default Theme
- Clean white background
- IBM Carbon Design System colors
- Suitable for most applications

#### Light Theme
- Light gray background
- Softer contrast
- Good for embedded content

#### Dark Theme
- Dark background with light text
- High contrast for readability
- Ideal for code-heavy content or dark mode applications

## Example Data

### Simple Text
```javascript
tw.local.markdownContent = "# Welcome\n\nThis is a **simple** markdown example.";
```

### Documentation Example
```javascript
tw.local.markdownContent = `
# User Guide

## Getting Started

Follow these steps to begin:

1. **Login** to your account
2. Navigate to the *Dashboard*
3. Click on **New Project**

### Important Notes

> Always save your work regularly to prevent data loss.

For more information, visit [our website](https://example.com).
`;
```

### Code Documentation
```javascript
tw.local.markdownContent = `
# API Reference

## Authentication

Use the following code to authenticate:

\`\`\`javascript
const token = await authenticate({
  username: "user",
  password: "pass"
});
\`\`\`

### Response Format

| Field | Type | Description |
|-------|------|-------------|
| token | string | Authentication token |
| expires | number | Expiration timestamp |
| user | object | User information |
`;
```

### Technical Specifications
```javascript
tw.local.markdownContent = `
# System Requirements

## Hardware
- **CPU**: 2.0 GHz or faster
- **RAM**: 4 GB minimum, 8 GB recommended
- **Storage**: 500 MB available space

## Software
- Operating System: Windows 10+, macOS 10.14+, or Linux
- Browser: Chrome 90+, Firefox 88+, Safari 14+

---

## Installation

Run the following command:

\`npm install @company/product\`

For more details, see the [installation guide](https://docs.example.com).
`;
```

### Rich Content Example
```javascript
tw.local.markdownContent = `
# Product Features

## Overview

Our product offers the following capabilities:

* **Real-time collaboration**
* **Advanced analytics**
* **Secure data storage**

### Performance Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Uptime | 99.9% | ✓ Good |
| Response Time | <100ms | ✓ Excellent |
| Throughput | 10k req/s | ✓ Good |

## Code Example

\`\`\`python
def calculate_total(items):
    return sum(item.price for item in items)
\`\`\`

> **Note**: This is a simplified example. Production code should include error handling.

![Architecture Diagram](https://example.com/diagram.png)
`;
```

## Data Binding

### In IBM BAW Coach View

Bind the widget to a string variable containing markdown text:

```javascript
// Set the markdown content
tw.local.markdownText = "# Hello World\n\nThis is **markdown** content.";

// The widget will automatically render the content
```

### Dynamic Updates

The widget supports dynamic content updates through the change event:

```javascript
// Update the markdown content
tw.local.markdownText = "# Updated Content\n\nThe content has been updated.";

// The widget will automatically re-render
```

## Best Practices

1. **Keep Content Structured**: Use headers to organize content hierarchically
2. **Use Semantic Markup**: Choose appropriate markdown elements for your content type
3. **Enable Sanitization**: Always keep `enableSanitization` enabled when displaying user-generated content
4. **Test Themes**: Preview your content in different themes to ensure readability
5. **Optimize Images**: Use appropriately sized images to maintain performance
6. **Validate Markdown**: Test your markdown syntax before deploying to production

## Accessibility Considerations

- The widget uses semantic HTML elements for proper screen reader support
- All links include appropriate ARIA attributes
- Images should include descriptive alt text in the markdown
- The container has proper ARIA role and label attributes
- Focus indicators are visible for keyboard navigation

## Security

When `enableSanitization` is enabled (default), the widget:
- Escapes all HTML tags in the input
- Prevents XSS attacks
- Safely renders user-generated content

**Warning**: Only disable sanitization if you have complete control over the markdown source and trust the content completely.