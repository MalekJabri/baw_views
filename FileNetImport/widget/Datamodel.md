## Business Data

This widget does **not** require bound business data to operate. All file handling is done interactively via drag-and-drop or the browse dialog.

However, the widget **outputs** structured result data through its event handlers. The data shapes below describe what is passed to each event.

---

## Output Data Shapes

### ImportResult (onImportComplete / onImportError)

```javascript
{
  "total":                 5,                    // Total number of files processed
  "succeeded":             4,                    // Files successfully imported
  "failed":                1,                    // Files that failed to import
  "repositoryIdentifier":  "OS1",                // FileNet repository identifier
  "parentFolderPath":      "/Folder for Browsing" // Root FileNet folder path
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

| Option                  | Type    | Required | Default | Description |
|-------------------------|---------|----------|---------|-------------|
| `graphqlEndpoint`       | String  | **Yes**  | `""`    | Full URL of the FileNet Content Engine GraphQL API endpoint. Example: `https://filenet-host/content-services-graphql/graphql` |
| `repositoryIdentifier`  | String  | **Yes**  | `""`    | FileNet repository identifier (e.g., `"OS1"`). This identifies which object store to use. |
| `parentFolderPath`      | String  | **Yes**  | `"/"`   | FileNet folder path where files will be imported. Example: `"/Folder for Browsing"` or `"/Projects/2024"`. All imported files and recreated folder structures will be placed under this path. |
| `maxFileSizeMB`         | Number  | No       | `100`   | Maximum allowed file size in megabytes. Files exceeding this limit are skipped with a warning. |
| `allowedMimeTypes`      | String  | No       | `""`    | Comma-separated list of accepted MIME types (e.g. `"application/pdf,image/png"`). Empty string means all types are accepted. |
| `showImportLog`         | Boolean | No       | `true`  | Show or hide the import result log panel. Set to `false` to hide detailed import logs. |

---

## GraphQL Mutations Used

### Create Folder

```graphql
mutation CreateFolder($repoId: String!, $name: String!, $parentPath: String!) {
  createFolder(
    repositoryIdentifier: $repoId
    folderProperties: {
      name: $name
      parent: {
        identifier: $parentPath
      }
    }
  ) {
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
  "name": "SubFolderName",
  "parentPath": "/Folder for Browsing"
}
```

> **Note:** The `parent.identifier` specifies the path of the parent folder where the new folder will be created.

---

### Import Document (Multipart Form POST)

FileNet GraphQL requires documents to be uploaded using **multipart form POST** with the file as a separate part.

```graphql
mutation ($contvar: String) {
  createDocument(
    repositoryIdentifier: "OS1"
    fileInFolderIdentifier: "/Folder for Browsing"
    documentProperties: {
      name: "report.pdf"
      contentElements: {
        replace: [{
          type: CONTENT_TRANSFER
          contentType: "application/pdf"
          subContentTransfer: {
            content: $contvar
          }
        }]
      }
    }
    checkinAction: {}
  ) {
    id
    name
  }
}
```

**Multipart Form Structure:**

The request must be sent as `multipart/form-data` with two parts:

1. **`graphql` part** (JSON):
```json
{
  "query": "<mutation string>",
  "variables": { "contvar": null }
}
```

2. **`contvar` part** (file binary):
The actual file content as a binary blob.

**JavaScript Implementation:**
```javascript
var formData = new FormData();
formData.append("graphql", JSON.stringify({
  query: mutation,
  variables: { contvar: null }
}));
formData.append("contvar", file);  // file is a File object

fetch(graphqlEndpoint, {
  method: "POST",
  credentials: "include",
  body: formData
});
```

> **Note:** The variable name `$contvar` in the mutation maps to the `contvar` part name in the multipart form. The browser automatically sets the correct `Content-Type: multipart/form-data` header with boundary.

---

## Folder Structure Preservation

When a folder is dropped onto the widget, the widget recursively traverses the folder tree using the `webkitGetAsEntry()` / `FileSystemDirectoryEntry` API. The relative path of each file is preserved and used to recreate the folder hierarchy under the configured `parentFolderPath`.

**Example:** Dropping a folder `ProjectA` containing:
```
ProjectA/
  README.md
  docs/
    spec.pdf
    diagrams/
      arch.png
```

With `parentFolderPath = "/Folder for Browsing"`, results in the following FileNet structure:
```
/Folder for Browsing/
  ProjectA/
    README.md
    docs/
      spec.pdf
      diagrams/
        arch.png
```

Folders are created lazily (only when needed) using the `createFolder` mutation with `fileInFolderIdentifier` pointing to the parent path. Created folder paths are cached within the import session to avoid duplicate creation calls.

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