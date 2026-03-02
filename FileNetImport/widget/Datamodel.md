## Business Data

This widget does **not** require bound business data to operate. All file handling is done interactively via drag-and-drop or the browse dialog.

However, the widget **outputs** structured result data through its event handlers. The data shapes below describe what is passed to each event.

---

## Output Data Shapes

### ImportResult (onImportComplete / onImportError)

```javascript
{
  "total":          5,                          // Total number of files processed
  "succeeded":      4,                          // Files successfully imported
  "failed":         1,                          // Files that failed to import
  "parentFolderId": "{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}"  // Root FileNet folder ID
}
```

### FileAddedInfo (onFileAdded)

```javascript
{
  "path": "ProjectA/SubFolder/report.pdf",      // Relative path preserving folder structure
  "size": 204800                                // File size in bytes
}
```

---

## Configuration Options

The widget reads the following options via `this.getOption()`:

| Option             | Type    | Required | Default | Description |
|--------------------|---------|----------|---------|-------------|
| `graphqlEndpoint`  | String  | **Yes**  | `""`    | Full URL of the FileNet Content Engine GraphQL API endpoint. Example: `https://filenet-host/content-services-graphql/graphql` |
| `parentFolderId`   | String  | **Yes**  | `""`    | FileNet object ID (GUID) of the destination root folder. All imported files and recreated folder structures will be placed under this folder. |
| `maxFileSizeMB`    | Number  | No       | `100`   | Maximum allowed file size in megabytes. Files exceeding this limit are skipped with a warning. |
| `allowedMimeTypes` | String  | No       | `""`    | Comma-separated list of accepted MIME types (e.g. `"application/pdf,image/png"`). Empty string means all types are accepted. |

---

## GraphQL Mutations Used

### Create Folder

```graphql
mutation CreateFolder($name: String!, $parentId: ID!) {
  createFolder(name: $name, parentId: $parentId) {
    id
    name
    pathName
  }
}
```

**Variables:**
```json
{
  "name": "SubFolderName",
  "parentId": "{PARENT-FOLDER-GUID}"
}
```

---

### Import Document

```graphql
mutation ImportDocument(
  $name: String!,
  $folderId: ID!,
  $content: String!,
  $mimeType: String!
) {
  createDocument(
    name: $name,
    folderId: $folderId,
    content: {
      data: $content,
      mimeType: $mimeType
    }
  ) {
    id
    name
    size
    created
  }
}
```

**Variables:**
```json
{
  "name": "report.pdf",
  "folderId": "{TARGET-FOLDER-GUID}",
  "content": "<base64-encoded-file-content>",
  "mimeType": "application/pdf"
}
```

> **Note:** The `content` field is the Base64-encoded binary content of the file, extracted via `FileReader.readAsDataURL()` and stripping the data URL prefix.

---

## Folder Structure Preservation

When a folder is dropped onto the widget, the widget recursively traverses the folder tree using the `webkitGetAsEntry()` / `FileSystemDirectoryEntry` API. The relative path of each file is preserved and used to recreate the folder hierarchy under the configured `parentFolderId`.

**Example:** Dropping a folder `ProjectA` containing:
```
ProjectA/
  README.md
  docs/
    spec.pdf
    diagrams/
      arch.png
```

Results in the following FileNet structure under the parent folder:
```
<parentFolder>/
  README.md
  ProjectA/
    docs/
      spec.pdf
      diagrams/
        arch.png
```

Folders are created lazily (only when needed) and cached within the import session to avoid duplicate creation calls.

---

## Authentication

The widget uses `credentials: "include"` on all `fetch()` calls to the GraphQL endpoint. This means the browser's existing session cookies (set when the user authenticated to FileNet / IBM Content Navigator) are automatically forwarded. **No additional authentication configuration is required.**

---

## Example BAW Variable Binding

To capture the import result in a BAW process variable:

```javascript
// In the onImportComplete event handler:
tw.local.importResult = {
  total:          this.getData().total,
  succeeded:      this.getData().succeeded,
  failed:         this.getData().failed,
  parentFolderId: this.getData().parentFolderId
};
tw.local.importStatus = "success";
```

```javascript
// In the onImportError event handler:
tw.local.importResult = this.getData();
tw.local.importStatus = "partial_failure";