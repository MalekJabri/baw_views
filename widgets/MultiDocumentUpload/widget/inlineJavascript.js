// MultiDocumentUpload Widget - Main Logic
// Store widget context reference
var widget = this;

// Get DOM elements
var container = widget.context.element.querySelector(".multi-doc-upload-container");
var fileInput = container.querySelector(".file-input");
var fileInputLabel = container.querySelector(".file-input-label");
var tableSection = container.querySelector(".documents-table-section");
var tbody = container.querySelector(".documents-tbody");
var documentCount = container.querySelector(".document-count");
var btnUpload = container.querySelector(".btn-upload");
var btnClear = container.querySelector(".btn-clear");

// Get configuration options
var documentTypes = widget.getOption("documentTypes") || [];
var maxFileSize = widget.getOption("maxFileSize") || 10; // MB
var allowedExtensions = widget.getOption("allowedExtensions") || [];
var maxFiles = widget.getOption("maxFiles") || null;

// Validate and ensure documentTypes is an array
if (!documentTypes || !Array.isArray(documentTypes)) {
  documentTypes = [
    { value: "invoice", name: "Faktura" },
    { value: "contract", name: "Ugovor" },
    { value: "report", name: "Izveštaj" },
    { value: "other", name: "Ostalo" }
  ];
}

// Get current documents from bound data
var documents = widget.getData() || [];
if (!Array.isArray(documents)) {
  documents = [];
}

// State management
var state = {
  documents: documents,
  pendingFiles: [] // Files waiting to be uploaded
};

// Initialize widget
function init() {
  // Render existing documents
  renderDocuments();
  updateUI();
  
  // Attach event listeners
  attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
  // File input change
  fileInput.addEventListener("change", handleFileSelect);
  
  // Drag and drop
  fileInputLabel.addEventListener("dragover", handleDragOver);
  fileInputLabel.addEventListener("dragleave", handleDragLeave);
  fileInputLabel.addEventListener("drop", handleDrop);
  
  // Upload button
  btnUpload.addEventListener("click", handleUpload);
  
  // Clear button
  btnClear.addEventListener("click", handleClearAll);
}

// Handle file selection
function handleFileSelect(e) {
  var files = Array.from(e.target.files);
  processFiles(files);
  fileInput.value = ""; // Reset input
}

// Handle drag over
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  fileInputLabel.classList.add("drag-over");
}

// Handle drag leave
function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  fileInputLabel.classList.remove("drag-over");
}

// Handle drop
function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  fileInputLabel.classList.remove("drag-over");
  
  var files = Array.from(e.dataTransfer.files);
  processFiles(files);
}

// Process selected files
function processFiles(files) {
  // Check max files limit
  if (maxFiles && (state.pendingFiles.length + files.length) > maxFiles) {
    showNotification("Maksimalan broj fajlova je " + maxFiles, "error");
    return;
  }
  
  files.forEach(function(file) {
    // Validate file
    if (!validateFile(file)) {
      return;
    }
    
    // Create document object
    var doc = {
      id: generateId(),
      fileName: file.name,
      fileSize: file.size,
      fileExtension: getFileExtension(file.name),
      documentType: documentTypes[0].value, // Default to first type
      file: file, // Store file object for upload
      uploaded: false
    };
    
    state.pendingFiles.push(doc);
  });
  
  renderDocuments();
  updateUI();
}

// Validate file
function validateFile(file) {
  // Check file size
  var fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxFileSize) {
    showNotification("Fajl " + file.name + " je prevelik (max " + maxFileSize + "MB)", "error");
    return false;
  }
  
  // Check file extension
  if (allowedExtensions.length > 0) {
    var ext = getFileExtension(file.name).toLowerCase();
    var allowed = allowedExtensions.some(function(allowedExt) {
      return allowedExt.toLowerCase() === ext;
    });
    
    if (!allowed) {
      showNotification("Tip fajla " + ext + " nije dozvoljen", "error");
      return false;
    }
  }
  
  return true;
}

// Render documents in table
function renderDocuments() {
  tbody.innerHTML = "";
  
  var allDocs = state.pendingFiles.concat(state.documents);
  
  if (allDocs.length === 0) {
    tableSection.classList.remove("has-documents");
    return;
  }
  
  tableSection.classList.add("has-documents");
  
  allDocs.forEach(function(doc) {
    var row = document.createElement("tr");
    row.setAttribute("data-doc-id", doc.id);
    
    // Filename column
    var tdFilename = document.createElement("td");
    tdFilename.className = "col-filename";
    tdFilename.innerHTML = 
      '<div class="file-info">' +
        '<div class="file-icon">' +
          '<svg viewBox="0 0 16 16" fill="currentColor">' +
            '<path d="M9 1H3.5c-.3 0-.5.2-.5.5v13c0 .3.2.5.5.5h9c.3 0 .5-.2.5-.5V5L9 1zm0 1.4L11.6 5H9V2.4zM12 14H4V2h4v3.5c0 .3.2.5.5.5H12v8z"/>' +
          '</svg>' +
        '</div>' +
        '<div class="file-details">' +
          '<div class="file-name" title="' + doc.fileName + '">' + doc.fileName + '</div>' +
          '<div class="file-extension">' + doc.fileExtension + '</div>' +
        '</div>' +
      '</div>';
    row.appendChild(tdFilename);
    
    // Size column
    var tdSize = document.createElement("td");
    tdSize.className = "col-size";
    tdSize.innerHTML = '<span class="file-size">' + formatFileSize(doc.fileSize) + '</span>';
    row.appendChild(tdSize);
    
    // Document type column
    var tdType = document.createElement("td");
    tdType.className = "col-type";
    var select = document.createElement("select");
    select.className = "doc-type-select";
    select.setAttribute("data-doc-id", doc.id);
    
    documentTypes.forEach(function(type) {
      var option = document.createElement("option");
      option.value = type.value;
      option.textContent = type.name;
      if (type.value === doc.documentType) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    
    select.addEventListener("change", function(e) {
      handleDocumentTypeChange(doc.id, e.target.value);
    });
    
    tdType.appendChild(select);
    row.appendChild(tdType);
    
    // Actions column
    var tdActions = document.createElement("td");
    tdActions.className = "col-actions";
    var btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.className = "btn-delete";
    btnDelete.setAttribute("aria-label", "Obriši " + doc.fileName);
    btnDelete.innerHTML = 
      '<svg viewBox="0 0 16 16" fill="currentColor">' +
        '<path d="M12 4.7L11.3 4 8 7.3 4.7 4 4 4.7 7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z"/>' +
      '</svg>';
    
    btnDelete.addEventListener("click", function() {
      handleDeleteDocument(doc.id);
    });
    
    tdActions.appendChild(btnDelete);
    row.appendChild(tdActions);
    
    tbody.appendChild(row);
  });
  
  // Update document count
  documentCount.textContent = allDocs.length + " dokumenata";
}

// Handle document type change
function handleDocumentTypeChange(docId, newType) {
  // Find document in pending files
  var doc = state.pendingFiles.find(function(d) {
    return d.id === docId;
  });
  
  if (doc) {
    doc.documentType = newType;
  } else {
    // Find in uploaded documents
    doc = state.documents.find(function(d) {
      return d.id === docId;
    });
    if (doc) {
      doc.documentType = newType;
      // Update bound data
      widget.setData(state.documents);
    }
  }
}

// Handle delete document
function handleDeleteDocument(docId) {
  // Remove from pending files
  var pendingIndex = state.pendingFiles.findIndex(function(d) {
    return d.id === docId;
  });
  
  if (pendingIndex !== -1) {
    state.pendingFiles.splice(pendingIndex, 1);
  } else {
    // Remove from uploaded documents
    var uploadedIndex = state.documents.findIndex(function(d) {
      return d.id === docId;
    });
    
    if (uploadedIndex !== -1) {
      state.documents.splice(uploadedIndex, 1);
      widget.setData(state.documents);
    }
  }
  
  renderDocuments();
  updateUI();
}

// Handle upload to LocalStore
function handleUpload() {
  if (state.pendingFiles.length === 0) {
    return;
  }
  
  // Convert files to base64 and add to documents
  var uploadPromises = state.pendingFiles.map(function(doc) {
    return fileToBase64(doc.file).then(function(base64) {
      return {
        id: doc.id,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        fileExtension: doc.fileExtension,
        documentType: doc.documentType,
        fileContent: base64,
        uploadedAt: new Date().toISOString(),
        uploaded: true
      };
    });
  });
  
  Promise.all(uploadPromises).then(function(uploadedDocs) {
    // Add to documents array
    state.documents = state.documents.concat(uploadedDocs);
    
    // Clear pending files
    state.pendingFiles = [];
    
    // Update bound data
    widget.setData(state.documents);
    
    // Re-render
    renderDocuments();
    updateUI();
    
    showNotification("Dokumenti uspešno uploadovani u LocalStore", "success");
  }).catch(function(error) {
    console.error("Upload error:", error);
    showNotification("Greška pri uploadu dokumenata", "error");
  });
}

// Handle clear all
function handleClearAll() {
  if (confirm("Da li ste sigurni da želite da obrišete sve dokumente?")) {
    state.pendingFiles = [];
    state.documents = [];
    widget.setData(state.documents);
    renderDocuments();
    updateUI();
    showNotification("Svi dokumenti su obrisani", "info");
  }
}

// Update UI state
function updateUI() {
  var hasPending = state.pendingFiles.length > 0;
  var hasAny = state.pendingFiles.length > 0 || state.documents.length > 0;
  
  // Enable/disable upload button
  btnUpload.disabled = !hasPending;
  
  // Enable/disable clear button
  btnClear.disabled = !hasAny;
}

// Convert file to base64
function fileToBase64(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function() {
      var base64 = reader.result.split(",")[1]; // Remove data:*/*;base64, prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// Get file extension
function getFileExtension(filename) {
  var parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

// Generate unique ID
function generateId() {
  return "doc_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

// Show notification (simple implementation)
function showNotification(message, type) {
  console.log("[" + type.toUpperCase() + "] " + message);
  // In a real implementation, you might want to show a toast notification
  // or update a status message in the UI
}

// Initialize the widget
init();

// Made with Bob