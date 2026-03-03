## Business Data

This widget does **not** require bound business data to operate. All browsing is done interactively through the FileNet GraphQL API.

However, the widget **outputs** structured data through its event handlers. The data shapes below describe what is passed to each event.

---

## Output Data Shapes

### SelectionInfo (onFolderSelected / onDocumentSelected)

```javascript
// Folder Selection
{
  "type":     "folder",
  "id":       "{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}",
  "name":     "Documents",
  "pathName": "/Folder for Browsing/Documents"
}

// Document Selection
{
  "type":    "document",
  "id":      "{D0D98E6A-0000-CD12-BB33-2DC8E5CABEE1}",
  "name":    "report.pdf",
  "version": "v1.0"
}
```

### NavigationInfo (onNavigate)

```javascript
{
  "pathName": "/Folder for Browsing/Documents"
}
```

---

## Configuration Options

The widget reads the following options via `this.getOption()`:

| Option                  | Type    | Required | Default | Description |
|-------------------------|---------|----------|---------|-------------|
| `graphqlEndpoint`       | String  | **Yes**  | `""`    | Full URL of the FileNet Content Engine GraphQL API endpoint. Example: `https://filenet-host/content-services-graphql/graphql` |
| `repositoryIdentifier`  | String  | **Yes**  | `""`    | FileNet repository identifier (e.g., `"OS1"`). This identifies which object store to use. |
| `rootFolderPath`        | String  | No       | `"/"`   | FileNet folder path to start browsing from. Example: `"/Folder for Browsing"`. The widget will not allow navigation above this folder. |
| `showDocumentDetails`   | Boolean | No       | `true`  | Show document version numbers and file sizes in the content list. |
| `allowMultiSelect`      | Boolean | No       | `false` | Allow multiple items to be selected at once using Ctrl/Cmd+Click. |
| `showBreadcrumb`        | Boolean | No       | `true`  | Show breadcrumb navigation at the top of the widget. |
| `pageSize`              | Integer | No       | `50`    | Number of documents to display per page. Set to 0 to disable pagination. |
| `showPagination`        | Boolean | No       | `true`  | Show pagination controls when there are more documents than pageSize. |

---

## GraphQL Queries Used

### Query Folder Contents

This query retrieves a folder's subfolders and contained documents:

```graphql
query GetFolderContents($repoId: String!, $path: String!) {
  folder(repositoryIdentifier: $repoId, identifier: $path) {
    id
    name
    pathName
    subFolders {
      folders {
        id
        name
        pathName
      }
    }
    containedDocuments {
      documents {
        id
        name
        majorVersionNumber
        minorVersionNumber
        mimeType
        contentSize
      }
      pageInfo {
        totalCount
      }
    }
  }
}
```

**Variables:**
```json
{
  "repoId": "OS1",
  "path": "/Folder for Browsing"
}
```

**Response:**
```json
{
  "data": {
    "folder": {
      "id": "{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}",
      "name": "Folder for Browsing",
      "pathName": "/Folder for Browsing",
      "subFolders": {
        "folders": [
          {
            "id": "{B2C3D4E5-F6A7-8901-BCDE-F12345678901}",
            "name": "Documents",
            "pathName": "/Folder for Browsing/Documents"
          }
        ]
      },
      "containedDocuments": {
        "documents": [
          {
            "id": "{D0D98E6A-0000-CD12-BB33-2DC8E5CABEE1}",
            "name": "report.pdf",
            "majorVersionNumber": 1,
            "minorVersionNumber": 0,
            "mimeType": "application/pdf",
            "contentSize": 204800
          }
        ],
        "pageInfo": {
          "totalCount": 1
        }
      }
    }
  }
}
```

---

### Query Single Folder Info

This query retrieves basic information about a specific folder:

```graphql
query GetFolder($repoId: String!, $path: String!) {
  folder(repositoryIdentifier: $repoId, identifier: $path) {
    id
    name
    pathName
  }
}
```

**Variables:**
```json
{
  "repoId": "OS1",
  "path": "/Folder for Browsing"
}
```

**Response:**
```json
{
  "data": {
    "folder": {
      "id": "{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}",
      "name": "Folder for Browsing",
      "pathName": "/Folder for Browsing"
    }
  }
}
```

---

## Widget Features

### Folder Tree Navigation

The left panel displays a hierarchical tree of folders starting from the `rootFolderPath`. Users can:
- Click folders to navigate and view their contents
- Expand/collapse folders to see subfolders
- See the currently active folder highlighted

### Content List

The main panel displays the contents of the current folder:
- **Folders** are shown first, followed by **documents**
- Click an item to select it (fires `onFolderSelected` or `onDocumentSelected`)
- Double-click a folder to navigate into it
- Double-click a document to fire `onDocumentSelected` event

### View Modes

- **List View**: Displays items in a vertical list with details
- **Grid View**: Displays items in a grid layout with icons

### Navigation Controls

- **Back/Forward**: Navigate through browsing history
- **Up**: Navigate to parent folder
- **Breadcrumb**: Click any folder in the path to jump directly to it

### Selection

- Single-click selects an item
- Ctrl/Cmd+Click for multi-select (if `allowMultiSelect` is enabled)
- Selected items are highlighted and shown in the selection bar

### Caching

The widget caches folder contents to improve performance. Use the **Refresh** button to clear the cache and reload from FileNet.

---

## Authentication

The widget uses `credentials: "include"` on all `fetch()` calls to the GraphQL endpoint. This means the browser's existing session cookies (set when the user authenticated to FileNet / IBM Content Navigator) are automatically forwarded. **No additional authentication configuration is required.**

---

## Example BAW Variable Binding

To capture selected items in BAW process variables:

```javascript
// In the onFolderSelected event handler:
tw.local.selectedFolder = {
  id:       this.getData().id,
  name:     this.getData().name,
  pathName: this.getData().pathName
};
```

```javascript
// In the onDocumentSelected event handler:
tw.local.selectedDocument = {
  id:      this.getData().id,
  name:    this.getData().name,
  version: this.getData().version
};
```

```javascript
// In the onNavigate event handler:
tw.local.currentPath = this.getData().pathName;

---

## Drag and Drop Operations

The widget supports drag-and-drop functionality for moving documents between folders.

### Supported Operations

- **Drag Documents**: Documents can be dragged from the content list
- **Drop on Folders**: Documents can be dropped on:
  - Folder items in the content list
  - Folder nodes in the tree navigation

### GraphQL Mutations Used

#### fileDocument
Files a document to a target folder:

```graphql
mutation FileDocument($repoId: String!, $docId: String!, $folderId: String!) {
  fileDocument(
    repositoryIdentifier: $repoId
    identifier: $docId
    folderIdentifier: $folderId
  ) {
    id
  }
}
```

#### deleteReferentialContainmentRelationship
Unfiles a document from its source folder:

```graphql
mutation UnfileDocument($repoId: String!, $identifier: String!) {
  deleteReferentialContainmentRelationship(
    repositoryIdentifier: $repoId
    identifier: $identifier
  ) {
    id
  }
}
```

### Move Process

1. User drags a document from the current folder
2. User drops it on a target folder (in content list or tree)
3. Widget unfiles the document from the source folder
4. Widget files the document to the target folder
5. Widget clears cache and reloads affected folders

### Visual Feedback

- **Dragging**: Document becomes semi-transparent with move cursor
- **Drop Target**: Folders highlight with blue border when document is dragged over
- **Completion**: Loading state shown during move operation

### Error Handling

If the move operation fails:
- Error message is displayed to the user
- Source and target folders remain unchanged
- Cache is not cleared

```

---

## Error Handling

The widget displays user-friendly error messages when:
- GraphQL endpoint is not configured
- Repository identifier is not configured
- Folder not found or access denied
- Network errors occur

Users can click the **Retry** button to attempt loading again.

---

## Accessibility

The widget implements ARIA attributes for screen reader support:
- `role="tree"` for folder hierarchy
- `role="list"` and `role="listitem"` for content items
- `role="navigation"` for breadcrumb
- `aria-label` and `aria-describedby` for context
- Keyboard navigation support (Tab, Enter, Arrow keys)
- Focus indicators for all interactive elements