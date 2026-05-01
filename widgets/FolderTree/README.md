# FolderTree Widget

A sophisticated IBM BAW Coach View widget for managing uploaded files with hierarchical folder structure and bulk metadata editing capabilities.

![FolderTree Widget](../docs/uploaded-files-manager.png)

## Features

- ✅ **Two-Panel Layout**: Files list on the left, details panel on the right
- ✅ **Hierarchical Structure**: Support for nested folders and files
- ✅ **Multi-Selection**: Select multiple files for bulk operations
- ✅ **Bulk Metadata Editing**: Update language and document type for multiple files
- ✅ **Expandable Folders**: Click to expand/collapse folder contents
- ✅ **File Actions**: Copy and delete individual files
- ✅ **Select All/Unselect All**: Quick selection controls
- ✅ **Responsive Design**: Adapts to different screen sizes
- ✅ **Accessibility**: Full ARIA support and keyboard navigation
- ✅ **Modern UI**: Clean, professional IBM Carbon Design inspired interface

## Installation

1. Import the widget into IBM Business Automation Workflow (BAW)
2. Add the widget to your Coach View
3. Bind the widget to a business object with the required data structure

## Quick Start

### 1. Data Structure

Bind the widget to a business object with this structure:

```javascript
{
  "files": [
    {
      "id": "file1",
      "name": "Document.pdf",
      "type": "file",
      "language": "en",
      "documentType": "judgment",
      "metadata": {
        "language": "English",
        "documentType": "Judgment"
      }
    },
    {
      "id": "folder1",
      "name": "Legal Documents",
      "type": "folder",
      "children": [
        {
          "id": "file2",
          "name": "Contract.pdf",
          "type": "file",
          "language": "fr",
          "documentType": "contract"
        }
      ]
    }
  ]
}
```

### 2. Configuration

Configure the widget options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowMultiSelect` | Boolean | `true` | Allow multiple file selection |
| `showFileActions` | Boolean | `true` | Show copy/delete buttons |
| `customFields` | String | `""` | Comma-separated custom field names |

### 3. Event Handlers

Handle widget events in your BAW process:

#### onSelectionChange
```javascript
tw.local.selectedFiles = this.getData().selectedFiles;
tw.local.selectedCount = this.getData().count;
```

#### onSave
```javascript
var updates = this.getData().updates;
// Apply updates to your business object
```

#### onCopyFile
```javascript
var fileId = this.getData().fileId;
// Handle file copy operation
```

#### onDeleteFile
```javascript
var fileId = this.getData().fileId;
// Handle file deletion
```

## Usage Examples

### Example 1: Basic Implementation

```javascript
// Initialize data
tw.local.uploadedFiles = {
  files: [
    {
      id: "doc1",
      name: "Report.pdf",
      type: "file",
      language: "en",
      documentType: "report",
      metadata: {
        language: "English",
        documentType: "Report"
      }
    }
  ]
};
```

### Example 2: With Nested Folders

```javascript
tw.local.uploadedFiles = {
  files: [
    {
      id: "folder1",
      name: "2024 Documents",
      type: "folder",
      children: [
        {
          id: "file1",
          name: "Q1 Report.pdf",
          type: "file",
          language: "en",
          documentType: "report"
        }
      ]
    }
  ]
};
```

### Example 3: Handle Save Event

```javascript
// In onSave event handler
var selectedFiles = this.getData().selectedFiles;
var updates = this.getData().updates;

selectedFiles.forEach(function(fileId) {
  var file = findFileById(tw.local.uploadedFiles.files, fileId);
  if (file) {
    file.language = updates.language;
    file.documentType = updates.documentType;
  }
});

tw.local.uploadedFiles = tw.local.uploadedFiles;
```

## Supported Languages

- English (en)
- French (fr)
- German (de)
- Spanish (es)
- Italian (it)

## Supported Document Types

- Judgment
- Indictment
- Contract
- Report
- Invoice

## Widget Files

```
FolderTree/
├── widget/
│   ├── Layout.html           # Widget HTML structure
│   ├── InlineCSS.css         # Widget styles
│   ├── inlineJavascript.js   # Widget logic
│   ├── Datamodel.md          # Data model documentation
│   └── eventHandler.md       # Event handler documentation
├── AdvancePreview/
│   ├── FolderTree.html  # Preview HTML
│   └── FolderTree.js    # Preview script
└── README.md                 # This file
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

The widget is fully accessible with:
- ARIA labels and roles
- Keyboard navigation (Tab, Enter, Space)
- Screen reader support
- Focus indicators
- High contrast support

## Performance

- Efficiently handles up to 1000 files
- Instant folder expansion/collapse
- Optimized re-rendering
- Memory-efficient selection management

## Integration

### With FileNetImport Widget

```javascript
// After files are uploaded
tw.local.uploadedFiles = {
  files: tw.local.importedFiles.map(function(file) {
    return {
      id: file.id,
      name: file.name,
      type: "file",
      language: "",
      documentType: ""
    };
  })
};
```

### With FileNetBrowser Widget

```javascript
// When documents are selected
tw.local.uploadedFiles = {
  files: tw.local.selectedDocuments.map(function(doc) {
    return {
      id: doc.id,
      name: doc.name,
      type: "file",
      language: doc.properties.language || "",
      documentType: doc.properties.documentType || ""
    };
  })
};
```

## Public API

The FolderTree widget exposes public methods that can be called from other widgets or external code.

### Available Methods

#### refresh()
Refreshes the file list by clearing the cache and reloading the current folder contents.

**Usage from another widget:**
```javascript
// Method 1: Using widget element
var folderTreeWidget = document.querySelector('[data-widget-id="FolderTree_1"]');
if (folderTreeWidget && folderTreeWidget.context && folderTreeWidget.context.refresh) {
  uploadManagerWidget.context.refresh();
}

// Method 2: Using BAW's widget API (if available)
var folderTree = this.context.getWidgetById("FolderTree_1");
if (folderTree && folderTree.refresh) {
  uploadManager.refresh();
}
```

#### getSelectedFiles()
Returns an array of currently selected file IDs.

**Returns:** `Array<string>` - Copy of the selected files array

**Usage:**
```javascript
var folderTreeWidget = document.querySelector('[data-widget-id="FolderTree_1"]');
if (folderTreeWidget && folderTreeWidget.context && folderTreeWidget.context.getSelectedFiles) {
  var selectedFiles = uploadManagerWidget.context.getSelectedFiles();
  console.log("Selected files:", selectedFiles);
}
```

#### clearSelection()
Clears all selected files and updates the UI.

**Usage:**
```javascript
var folderTreeWidget = document.querySelector('[data-widget-id="FolderTree_1"]');
if (folderTreeWidget && folderTreeWidget.context && folderTreeWidget.context.clearSelection) {
  uploadManagerWidget.context.clearSelection();
}
```

### Integration Example
**Scenario:** After uploading files with FileNetImport widget, refresh the FolderTree


```javascript
// In FileNetImport widget's onUploadComplete event handler
function onUploadComplete() {
  // Find the FolderTree widget
  var folderTree = document.querySelector('[data-widget-id="FolderTree_1"]');

  if (uploadManager && uploadManager.context && uploadManager.context.refresh) {
    // Refresh the file list to show newly uploaded files
    folderTree.context.refresh();
    console.log("FolderTree refreshed after upload");
  }
}
```

**Scenario:** Get selected files from another widget

```javascript
// In a custom button click handler
function handleProcessSelected() {
  var folderTree = document.querySelector('[data-widget-id="FolderTree_1"]');

  if (uploadManager && uploadManager.context && uploadManager.context.getSelectedFiles) {
    var selectedFiles = uploadManager.context.getSelectedFiles();
    
    if (selectedFiles.length === 0) {
      alert("Please select at least one file");
      return;
    }
    
    // Process selected files
    selectedFiles.forEach(function(fileId) {
      console.log("Processing file:", fileId);
      // Your processing logic here
    });
  }
}
```

## Troubleshooting

### Files not displaying
- Verify data structure matches expected format
- Check that each file has required properties: `id`, `name`, `type`
- Ensure data is properly bound to the widget

### Selection not working
- Check `allowMultiSelect` configuration
- Verify file IDs are unique
- Check browser console for errors

### Save button disabled
- Save button requires at least one file to be selected
- Check that files are properly selected

## Documentation

- [Data Model](widget/Datamodel.md) - Complete data structure documentation
- [Event Handlers](widget/eventHandler.md) - Event handler reference and examples

## Support

For issues, questions, or contributions, please contact the BAW development team.

## License

Copyright © 2024 IBM Corporation. All rights reserved.

---

**Made with Bob** 🤖