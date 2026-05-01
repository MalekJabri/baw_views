# FolderTree Widget - Data Model

## Overview

The FolderTree widget provides a two-panel interface for managing uploaded files with hierarchical folder structure and bulk metadata editing capabilities. It allows users to select multiple files and update their properties simultaneously.

---

## Business Data

### Input Data Structure

The widget expects a business object with the following structure:

```javascript
{
  "files": [
    {
      "id": "file1",
      "name": "Document.pdf",
      "type": "file",
      "labelOne": "en",
      "labelTwo": "judgment",
      "metadata": {
        "labelOne": "en",
        "labelTwo": "judgment"
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
          "labelOne": "fr",
          "labelTwo": "contract",
          "metadata": {
            "labelOne": "fr",
            "labelTwo": "contract"
          }
        }
      ]
    }
  ]
}
```

### Data Properties

#### File Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | String | Yes | Unique identifier for the file |
| `name` | String | Yes | Display name of the file |
| `type` | String | Yes | Must be `"file"` |
| `labelOne` | String | No | First custom property value (configurable via PropertyOne option) |
| `labelTwo` | String | No | Second custom property value (configurable via PropertyTwo option) |
| `metadata` | Object | No | Display metadata for the file |
| `metadata.labelOne` | String | No | Display value for first property (defaults to "Unknown" if empty) |
| `metadata.labelTwo` | String | No | Display value for second property (defaults to "Unknown" if empty) |

#### Folder Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | String | Yes | Unique identifier for the folder |
| `name` | String | Yes | Display name of the folder |
| `type` | String | Yes | Must be `"folder"` |
| `children` | Array | No | Array of file/folder objects nested within this folder |

---

## Configuration Options

The widget reads the following options via `this.getOption()`:

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `graphqlEndpoint` | String | Yes | - | Full URL of the FileNet Content Engine GraphQL API endpoint |
| `repositoryIdentifier` | String | Yes | - | FileNet repository identifier (e.g., 'OS1') |
| `rootFolderPath` | String | No | `"/"` | FileNet folder path to start browsing from |
| `allowMultiSelect` | Boolean | No | `true` | Allow multiple files to be selected simultaneously |
| `showFileActions` | Boolean | No | `true` | Show copy and delete action buttons for files |
| `updateAbleFields` | String | No | `""` | Comma-separated list of updateable field names to display in the details panel |
| `PropertyOne` | String | No | `"language"` | Custom property name to use for Label One (e.g., 'DocumentLanguage', 'ContentSize') |
| `PropertyTwo` | String | No | `"documentType"` | Custom property name to use for Label Two (e.g., 'DocumentType', 'DateCreated') |
| `showDetailsPanel` | Boolean | No | `true` | Show or hide the details/update panel on the right side. When false, only the file list is displayed |
| `enableDebugLogging` | Boolean | No | `false` | Enable console logging for debugging property extraction and GraphQL queries |
| `dateFormat` | String | No | `"YYYY-MM-DD HH:mm:ss"` | Date format string for displaying date properties (e.g., 'DD/MM/YYYY', 'MM/DD/YYYY HH:mm') |

### Example Configuration

```javascript
// In BAW Coach View configuration
{
  "graphqlEndpoint": "https://filenet-host/content-services-graphql/graphql",
  "repositoryIdentifier": "OS1",
  "rootFolderPath": "/Uploaded Files",
  "allowMultiSelect": true,
  "showFileActions": true,
  "updateAbleFields": "author,department,status",
  "PropertyOne": "DocumentLanguage",
  "PropertyTwo": "DocumentType",
  "enableDebugLogging": false,
  "dateFormat": "DD/MM/YYYY HH:mm"
}
```

### Special Property Formatting

The widget automatically formats certain property types:

**ContentSize Properties:**
- If `PropertyOne` or `PropertyTwo` is set to "ContentSize" or "contentSize"
- Values are automatically converted from bytes to human-readable format (B, KB, MB, GB)
- Example: `1048576` → `"1.0 MB"`

**Date Properties:**
- Date/datetime/timestamp properties are formatted according to the `dateFormat` option
- Supports common format tokens:
  - `YYYY` - 4-digit year (e.g., 2024)
  - `YY` - 2-digit year (e.g., 24)
  - `MM` - 2-digit month (01-12)
  - `M` - Month (1-12)
  - `DD` - 2-digit day (01-31)
  - `D` - Day (1-31)
  - `HH` - 2-digit hours (00-23)
  - `H` - Hours (0-23)
  - `mm` - 2-digit minutes (00-59)
  - `m` - Minutes (0-59)
  - `ss` - 2-digit seconds (00-59)
  - `s` - Seconds (0-59)
- Example formats:
  - `"YYYY-MM-DD"` → `"2024-03-05"`
  - `"DD/MM/YYYY HH:mm"` → `"05/03/2024 14:30"`
  - `"MM/DD/YYYY"` → `"03/05/2024"`

---

## Output Events

### onSelectionChange

Fired when the user selects or deselects files.

**Event Data:**
```javascript
{
  "selectedFiles": [
    {
      "id": "file1",
      "name": "Document.pdf",
      "type": "file",
      "labelOne": "en",
      "labelTwo": "judgment"
    }
  ],
  "count": 1
}
```

### onSave

Fired when the user clicks the Save button to apply metadata changes.

**Event Data:**
```javascript
{
  "selectedFiles": ["file1", "file2", "file3"],
  "updates": {
    "labelOne": "en",
    "labelTwo": "judgment"
  }
}
```

### onCopyFile

Fired when the user clicks the copy button for a file.

**Event Data:**
```javascript
{
  "fileId": "file1"
}
```

### onDeleteFile

Fired when the user clicks the delete button for a file.

**Event Data:**
```javascript
{
  "fileId": "file1"
}
```

---

## Widget Features

### File List Panel (Left)

- **Hierarchical Display**: Shows files and folders in a tree structure
- **Expandable Folders**: Click the arrow icon to expand/collapse folders
- **Checkboxes**: Select individual files or multiple files
- **Select All/Unselect All**: Bulk selection controls
- **File Count**: Displays total number of files
- **File Actions**: Copy and delete buttons (hover to reveal)
- **Visual Feedback**: Selected files are highlighted

### Details Panel (Right)

- **Selection Status**: Shows number of files selected
- **Label One Input**: Set first custom property for selected files
- **Label Two Input**: Set second custom property for selected files
- **Save Button**: Apply changes to selected files
- **Empty State**: Shown when no files are selected
- **Unified Values**: When multiple files are selected, shows unified value if all files have the same value

### Generic Property Configuration

The widget now uses generic `labelOne` and `labelTwo` properties instead of hardcoded language and document type fields. This allows you to configure any custom FileNet properties via the `PropertyOne` and `PropertyTwo` options.

**Example:**
- Set `PropertyOne: "DocumentLanguage"` to use the DocumentLanguage property
- Set `PropertyTwo: "DocumentType"` to use the DocumentType property
- Values are displayed as-is, or "Unknown" if not set

---

## Usage Examples

### Example 1: Basic File List

```javascript
// Bind to BAW variable
tw.local.uploadedFiles = {
  files: [
    {
      id: "doc1",
      name: "Report.pdf",
      type: "file",
      labelOne: "en",
      labelTwo: "report",
      metadata: {
        labelOne: "en",
        labelTwo: "report"
      }
    }
  ]
};
```

### Example 2: Hierarchical Structure

```javascript
tw.local.uploadedFiles = {
  files: [
    {
      id: "folder1",
      name: "2024 Documents",
      type: "folder",
      children: [
        {
          id: "subfolder1",
          name: "Q1",
          type: "folder",
          children: [
            {
              id: "file1",
              name: "January Report.pdf",
              type: "file",
              labelOne: "en",
              labelTwo: "report"
            }
          ]
        }
      ]
    }
  ]
};
```

### Example 3: Handle Save Event

```javascript
// In the onSave event handler
var selectedFiles = this.getData().selectedFiles;
var updates = this.getData().updates;

// Update business object
selectedFiles.forEach(function(fileId) {
  // Find and update the file in your data structure
  var file = findFileById(tw.local.uploadedFiles.files, fileId);
  if (file) {
    file.labelOne = updates.labelOne;
    file.labelTwo = updates.labelTwo;
  }
});

// Persist changes
tw.local.uploadedFiles = tw.local.uploadedFiles;
```

### Example 4: Handle Selection Change

```javascript
// In the onSelectionChange event handler
var selectedCount = this.getData().count;
var selectedFiles = this.getData().selectedFiles;

tw.local.selectedFileCount = selectedCount;
tw.local.selectedFileIds = selectedFiles.map(function(f) { return f.id; });
```

---

## Styling Customization

The widget uses CSS custom properties (variables) for easy theming:

```css
.ufm-widget {
  --ufm-blue: #0f62fe;        /* Primary action color */
  --ufm-blue-hover: #0043ce;  /* Primary hover color */
  --ufm-blue-light: #edf5ff;  /* Selection background */
  --ufm-gray-10: #f4f4f4;     /* Light background */
  --ufm-gray-20: #e0e0e0;     /* Borders */
  --ufm-gray-100: #161616;    /* Text color */
}
```

---

## Accessibility

The widget implements ARIA attributes for screen reader support:

- `role="region"` for main widget container
- `role="main"` for files panel
- `role="complementary"` for details panel
- `role="list"` and `role="listitem"` for file items
- `aria-label` for all interactive elements
- `aria-live="polite"` for dynamic status updates
- Keyboard navigation support (Tab, Enter, Space)
- Focus indicators for all interactive elements

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Performance Considerations

- The widget efficiently handles up to 1000 files
- Folder expansion/collapse is instant (no API calls)
- Selection state is maintained in memory
- Re-rendering is optimized to update only changed elements

---

## Known Limitations

1. File actions (copy/delete) fire events but do not modify the data structure directly
2. Custom fields configuration requires manual implementation
3. No built-in file upload functionality (use with FileNetImport widget)
4. No search/filter functionality (can be added via custom implementation)

---

## Integration with Other Widgets

### With FileNetImport Widget

```javascript
// After files are uploaded via FileNetImport
tw.local.uploadedFiles = {
  files: tw.local.importedFiles.map(function(file) {
    return {
      id: file.id,
      name: file.name,
      type: "file",
      labelOne: "",
      labelTwo: "",
      metadata: {
        labelOne: "Unknown",
        labelTwo: "Unknown"
      }
    };
  })
};
```

### With FileNetBrowser Widget

```javascript
// When documents are selected from FileNetBrowser
// Assuming PropertyOne is "DocumentLanguage" and PropertyTwo is "DocumentType"
tw.local.uploadedFiles = {
  files: tw.local.selectedDocuments.map(function(doc) {
    return {
      id: doc.id,
      name: doc.name,
      type: "file",
      labelOne: doc.properties.DocumentLanguage || "",
      labelTwo: doc.properties.DocumentType || ""
    };
  })
};
```

---

## Troubleshooting

### Files not displaying

- Ensure `files` array is properly bound to the widget
- Check that each file has required properties: `id`, `name`, `type`
- Verify data structure matches the expected format

### Selection not working

- Check `allowMultiSelect` configuration option
- Ensure file IDs are unique
- Verify event handlers are properly configured

### Save button disabled

- Save button is disabled when no files are selected
- Select at least one file to enable the Save button

---

Made with Bob