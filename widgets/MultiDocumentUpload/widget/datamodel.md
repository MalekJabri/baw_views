# MultiDocumentUpload Widget - Data Model

## Binding Type

The widget binds to a **List of DocumentItem** business objects.

```
Binding: List<DocumentItem>
```

## DocumentItem Business Object

Each document in the list contains the following properties:

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | String | Unique identifier for the document (auto-generated) |
| `fileName` | String | Original name of the uploaded file |
| `fileSize` | Integer | Size of the file in bytes |
| `fileExtension` | String | File extension (e.g., "pdf", "docx", "jpg") |
| `documentType` | String | Type of document selected by user (e.g., "invoice", "contract", "report") |
| `fileContent` | String | Base64 encoded file content for storage in LocalStore |
| `uploadedAt` | String | ISO 8601 timestamp when the document was uploaded |
| `uploaded` | Boolean | Flag indicating whether the document has been uploaded to LocalStore |

## Data Flow

### 1. Initial State
When the widget loads, it reads the bound data (list of DocumentItem objects) and displays any existing uploaded documents in the table.

```javascript
var documents = widget.getData(); // Returns List<DocumentItem>
```

### 2. File Selection
When users select files:
- Files are validated (size, extension)
- Temporary document objects are created (not yet uploaded)
- Documents are displayed in the table with `uploaded: false`

### 3. Document Type Selection
Users can select a document type for each file from a dropdown:
- The `documentType` property is updated
- Changes are reflected immediately in the widget state

### 4. Upload to LocalStore
When the "Upload u LocalStore" button is clicked:
- Files are converted to base64 format
- `fileContent` property is populated with base64 data
- `uploadedAt` timestamp is set
- `uploaded` flag is set to `true`
- The bound data is updated with the complete document list

```javascript
widget.setData(documents); // Updates the bound List<DocumentItem>
```

### 5. Delete Document
Users can delete documents (both pending and uploaded):
- Document is removed from the list
- Bound data is updated if it was an uploaded document

## Example Data Structure

```json
[
  {
    "id": "doc_1704123456789_abc123",
    "fileName": "faktura_2024.pdf",
    "fileSize": 245760,
    "fileExtension": "pdf",
    "documentType": "invoice",
    "fileContent": "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL...",
    "uploadedAt": "2024-01-01T12:30:00.000Z",
    "uploaded": true
  },
  {
    "id": "doc_1704123457890_def456",
    "fileName": "ugovor.docx",
    "fileSize": 512000,
    "fileExtension": "docx",
    "documentType": "contract",
    "fileContent": "UEsDBBQABgAIAAAAIQDfpNJsWgEAACAFAAATAAgCW0...",
    "uploadedAt": "2024-01-01T12:31:00.000Z",
    "uploaded": true
  }
]
```

## Configuration Options

The widget behavior can be customized through configuration options:

### documentTypes
List of available document types for selection.

**Default:**
```json
[
  { "value": "invoice", "name": "Faktura" },
  { "value": "contract", "name": "Ugovor" },
  { "value": "report", "name": "Izveštaj" },
  { "value": "other", "name": "Ostalo" }
]
```

### maxFileSize
Maximum allowed file size in megabytes.

**Default:** `10` (MB)

### allowedExtensions
List of allowed file extensions. Empty array means all extensions are allowed.

**Default:** `[]` (all extensions allowed)

**Example:**
```json
["pdf", "docx", "xlsx", "jpg", "png"]
```

### maxFiles
Maximum number of files that can be uploaded. `null` means no limit.

**Default:** `null` (no limit)

## Usage in BAW

### Binding the Widget

1. Create a variable of type `List<DocumentItem>` in your coach view
2. Bind this variable to the widget's data binding
3. The widget will automatically manage the document list

### Accessing Uploaded Documents

After upload, you can access the documents in your BAW process:

```javascript
// Get all uploaded documents
var documents = tw.local.uploadedDocuments; // List<DocumentItem>

// Iterate through documents
for (var i = 0; i < documents.listLength; i++) {
  var doc = documents[i];
  console.log("Document: " + doc.fileName);
  console.log("Type: " + doc.documentType);
  console.log("Size: " + doc.fileSize + " bytes");
  
  // Access base64 content for storage or processing
  var content = doc.fileContent;
}
```

### Storing in Document Management System

The base64 encoded content can be used to store documents in IBM FileNet or other document management systems:

```javascript
// Example: Store in FileNet
var doc = tw.local.uploadedDocuments[0];
tw.system.document.createDocument(
  doc.fileName,
  doc.fileContent, // Base64 content
  doc.documentType
);
```

## Notes

- File content is stored as base64 to ensure compatibility with BAW's data model
- The `id` field is auto-generated and should not be modified
- The `uploaded` flag helps distinguish between pending and uploaded documents
- All timestamps use ISO 8601 format for consistency

<!-- Made with Bob -->