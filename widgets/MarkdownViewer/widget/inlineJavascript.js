// Get the markdown container element
var markdownContainer = this.context.element.querySelector(".markdown-content");

// Get the markdown text data
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
    // Check if it's an ordered list (starts with number)
    if (/^\d+\./.test(text.match(new RegExp(match.replace(/<[^>]+>/g, ''))))) {
      return '<ol>' + match + '</ol>';
    }
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

// Register event handling function for content changes
this.registerEventHandlingFunction = function(context, eventName, args) {
  if (eventName === "onContentChange") {
    // Trigger custom event when markdown content changes
    var event = new CustomEvent("markdownContentChanged", {
      detail: {
        originalText: markdownText,
        renderedHtml: renderedHtml
      }
    });
    context.element.dispatchEvent(event);
  }
};

// Made with Bob