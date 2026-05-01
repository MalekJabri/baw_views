## change

This event handler is triggered when the bound markdown text data changes. It re-renders the markdown content with the updated text.

```js
// Get the markdown container element
var markdownContainer = this.context.element.querySelector(".markdown-content");

// Get the updated markdown text data
var markdownText = this.getData() || "";

// Get configuration options
var enableSanitization = this.getOption("enableSanitization") !== false; // Default true
var showLineNumbers = this.getOption("showLineNumbers") || false;
var theme = this.getOption("theme") || "default"; // default, dark, light

// Apply theme class
var container = this.context.element.querySelector(".markdown-viewer-container");
container.className = "markdown-viewer-container markdown-theme-" + theme;

// Simple markdown parser function
function parseMarkdown(text) {
  if (!text) return "";
  
  var html = text;
  
  // Escape HTML if sanitization is enabled
  if (enableSanitization) {
    var ampRegex = /&/g;
    var ltRegex = /</g;
    var gtRegex = />/g;
    var quotRegex = /"/g;
    var aposRegex = /'/g;
    
    html = html
      .replace(ampRegex, String.fromCharCode(38) + "amp;")
      .replace(ltRegex, String.fromCharCode(38) + "lt;")
      .replace(gtRegex, String.fromCharCode(38) + "gt;")
      .replace(quotRegex, String.fromCharCode(38) + "quot;")
      .replace(aposRegex, String.fromCharCode(38) + "#039;");
  }
  
  // Headers (h1-h6)
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\*\*\*$/gm, '<hr>');
  html = html.replace(/^___$/gm, '<hr>');
  
  // Code blocks (fenced with ```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
    var langClass = lang ? ' class="language-' + lang + '"' : '';
    return '<pre><code' + langClass + '>' + code.trim() + '</code></pre>';
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
  
  // Strikethrough
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
  
  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Unordered lists
  html = html.replace(/^\*\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/^(\+)\s+(.+)$/gm, '<li>$2</li>');
  
  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  
  // Wrap consecutive list items in ul/ol tags
  html = html.replace(/(<li>.*<\/li>\n?)+/g, function(match) {
    return '<ul>' + match + '</ul>';
  });
  
  // Tables
  html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, function(match, header, rows) {
    var headerCells = header.split('|').filter(function(cell) { return cell.trim(); });
    var headerHtml = '<thead><tr>' + headerCells.map(function(cell) {
      return '<th>' + cell.trim() + '</th>';
    }).join('') + '</tr></thead>';
    
    var rowsHtml = rows.trim().split('\n').map(function(row) {
      var cells = row.split('|').filter(function(cell) { return cell.trim(); });
      return '<tr>' + cells.map(function(cell) {
        return '<td>' + cell.trim() + '</td>';
      }).join('') + '</tr>';
    }).join('');
    
    return '<table><tbody>' + headerHtml + rowsHtml + '</tbody></table>';
  });
  
  // Paragraphs (wrap text not already in tags)
  html = html.replace(/^(?!<[^>]+>)(.+)$/gm, function(match) {
    if (match.trim() === '') return '';
    if (match.match(/^<(h[1-6]|hr|pre|blockquote|ul|ol|table)/)) return match;
    return '<p>' + match + '</p>';
  });
  
  // Clean up extra newlines
  html = html.replace(/\n\n+/g, '\n');
  
  return html;
}

// Parse and render the markdown
var renderedHtml = parseMarkdown(markdownText);

// Add line numbers if enabled
if (showLineNumbers) {
  var lines = renderedHtml.split('\n');
  renderedHtml = '<div class="markdown-with-lines">' +
    lines.map(function(line, index) {
      return '<div class="markdown-line"><span class="line-number">' + (index + 1) + '</span>' +
        '<span class="line-content">' + line + '</span></div>';
    }).join('') +
    '</div>';
}

// Set the rendered HTML
markdownContainer.innerHTML = renderedHtml;

// Trigger custom event for content change
this.executeEventHandlingFunction(this, "onContentChange", {
  originalText: markdownText,
  renderedHtml: renderedHtml
});

console.log("Markdown content updated, length:", markdownText.length, "characters");
```

## Event Handler Usage

The `change` event is automatically triggered by IBM BAW when:
- The bound markdown text data is updated
- The user navigates to a different page/view with different content
- The markdown content changes programmatically

### Configuration Options

- **enableSanitization** (boolean, default: true): Enable HTML sanitization to prevent XSS attacks. When enabled, HTML tags in the markdown will be escaped.
- **showLineNumbers** (boolean, default: false): Display line numbers alongside the rendered content. Useful for code documentation or technical content.
- **theme** (string, default: "default"): Visual theme for the markdown viewer. Options: "default", "light", "dark"

### Example: Dynamic Content Update

```javascript
// In your BAW coach/view, update the markdown content
tw.local.markdownText = `
# Updated Documentation

## New Section

This content has been **dynamically updated**.

### Features
- Real-time rendering
- Automatic sanitization
- Multiple themes
`;

// The change event handler will automatically re-render the markdown
```

### Example: Theme Switching

```javascript
// Change the theme dynamically
tw.local.markdownViewerTheme = "dark";

// Update the content
tw.local.markdownText = "# Dark Theme\n\nThis content is displayed in dark theme.";
```

### Example: Code Documentation with Line Numbers

```javascript
// Enable line numbers for code documentation
tw.local.showLineNumbers = true;

tw.local.markdownText = `
# API Documentation

## Function: calculateTotal

\`\`\`javascript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
\`\`\`

This function calculates the total price of all items.
`;
```

## Custom Event: onContentChange

The widget fires a custom event when the markdown content is rendered. You can listen to this event to perform additional actions:

### Event Details

- **Event Name**: `markdownContentChanged`
- **Event Type**: CustomEvent
- **Event Detail Properties**:
  - `originalText`: The original markdown text
  - `renderedHtml`: The rendered HTML output

### Example: Listening to Content Changes

```javascript
// In your custom JavaScript or another widget
var markdownWidget = document.querySelector('.markdown-viewer-container');

markdownWidget.addEventListener('markdownContentChanged', function(event) {
  console.log('Markdown rendered:', event.detail);
  console.log('Original text length:', event.detail.originalText.length);
  console.log('Rendered HTML length:', event.detail.renderedHtml.length);
  
  // Perform custom actions, such as:
  // - Analytics tracking
  // - Content validation
  // - Triggering other widgets
});
```

## Markdown Parsing Features

The change event handler includes a comprehensive markdown parser that supports:

### Text Formatting
- **Bold**: `**text**` or `__text__`
- **Italic**: `*text*` or `_text_`
- **Strikethrough**: `~~text~~`
- **Inline Code**: `` `code` ``

### Headers
- H1 through H6: `#` to `######`

### Lists
- Unordered lists: `*`, `-`, or `+`
- Ordered lists: `1.`, `2.`, etc.

### Links and Images
- Links: `[text](url)`
- Images: `![alt](url)`

### Code Blocks
- Fenced code blocks with optional language: ` ```language `

### Blockquotes
- Blockquotes: `> text`

### Tables
- Markdown tables with headers and rows

### Horizontal Rules
- `---`, `***`, or `___`

## Security Considerations

### HTML Sanitization

When `enableSanitization` is enabled (default), the widget:
1. Escapes all HTML special characters (`<`, `>`, `&`, `"`, `'`)
2. Prevents XSS attacks
3. Safely renders user-generated content

**Important**: Only disable sanitization if you have complete control over the markdown source.

### Safe Link Handling

All links generated from markdown:
- Open in new tabs (`target="_blank"`)
- Include `rel="noopener noreferrer"` for security
- Are properly escaped

## Performance Considerations

The markdown parser is optimized for:
- Fast rendering of typical documentation
- Efficient regex-based parsing
- Minimal DOM manipulation

For very large documents (>100KB), consider:
- Splitting content into sections
- Using pagination
- Implementing lazy loading

## Troubleshooting

### Content Not Rendering

1. Check that the bound data is a valid string
2. Verify the markdown syntax is correct
3. Ensure the widget is properly initialized

### Styling Issues

1. Verify the theme option is set correctly
2. Check for CSS conflicts with other widgets
3. Ensure custom CSS doesn't override widget styles

### Performance Issues

1. Reduce the size of markdown content
2. Disable line numbers for large documents
3. Optimize images referenced in markdown