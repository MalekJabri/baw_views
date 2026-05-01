## onImportComplete

Fired when **all** files in the queue have been successfully imported to FileNet without any errors.

```js
// Retrieve the import result summary
var result = this.getData();
// result = {
//   total:                 <number>,   // Total files processed
//   succeeded:             <number>,   // Files successfully imported
//   failed:                <number>,   // Files that failed (0 in this event)
//   repositoryIdentifier:  <string>,   // FileNet repository identifier
//   parentFolderPath:      <string>    // Root FileNet folder path used
// }

console.log("Import complete:", result.succeeded, "files imported to", result.parentFolderPath);

// Example: update a BAW variable with the result
tw.local.importResult = result;
tw.local.importStatus = "success";
```

---

## onImportError

Fired when the import finishes but **one or more files failed**. The result object contains counts for both successes and failures.

```js
var result = this.getData();
// result = {
//   total:                 <number>,
//   succeeded:             <number>,
//   failed:                <number>,   // > 0 in this event
//   repositoryIdentifier:  <string>,
//   parentFolderPath:      <string>
// }

console.warn("Import finished with errors:", result.failed, "failed out of", result.total);

// Example: surface the error in the BAW coach
tw.local.importStatus = "partial";
tw.local.failedCount  = result.failed;
```

---

## onFileAdded

Fired each time a file is added to the drop queue (either via drag-and-drop or the browse dialog). Useful for real-time validation or logging.

```js
var fileInfo = this.getData();
// fileInfo = {
//   path: <string>,   // Relative path including folder structure, e.g. "ProjectA/SubFolder/report.pdf"
//   size: <number>    // File size in bytes
// }

console.log("File queued:", fileInfo.path, "(" + fileInfo.size + " bytes)");

// Example: reject files larger than 50 MB at the BAW level
if (fileInfo.size > 50 * 1024 * 1024) {
  console.warn("File exceeds 50 MB limit:", fileInfo.path);
}
```

---

## Event Handler Usage in BAW

Events are registered in the widget's inline JavaScript using:

```js
this.registerEventHandlingFunction(this, "onImportComplete", null);
this.registerEventHandlingFunction(this, "onImportError",    null);
this.registerEventHandlingFunction(this, "onFileAdded",      null);
```

They are fired using:

```js
this.executeEventHandlingFunction(this, "onImportComplete", result);
this.executeEventHandlingFunction(this, "onImportError",    result);
this.executeEventHandlingFunction(this, "onFileAdded",      fileInfo);
```

In the BAW Coach View designer, bind these events to boundary events or JavaScript actions on the coach to react to import lifecycle changes.

---

## Configuration Options (getOption)

| Option                  | Type    | Default | Description |
|-------------------------|---------|---------|-------------|
| `graphqlEndpoint`       | String  | `""`    | Full URL of the FileNet GraphQL API endpoint |
| `repositoryIdentifier`  | String  | `""`    | FileNet repository identifier (e.g., "OS1") |
| `parentFolderPath`      | String  | `"/"`   | FileNet folder path for imports (e.g., "/Folder for Browsing") |
| `maxFileSizeMB`         | Number  | `100`   | Maximum allowed file size in megabytes |
| `allowedMimeTypes`      | String  | `""`    | Comma-separated MIME types to accept (empty = all) |
| `showImportLog`         | Boolean | `true`  | Show or hide the import result log panel |

### Example: reading options in the widget

```js
var graphqlEndpoint    = this.getOption("graphqlEndpoint");
var repositoryId       = this.getOption("repositoryIdentifier");
var parentFolderPath   = this.getOption("parentFolderPath");
var maxFileSizeMB      = this.getOption("maxFileSizeMB") || 100;
var showImportLog      = this.getOption("showImportLog") !== false; // Default true