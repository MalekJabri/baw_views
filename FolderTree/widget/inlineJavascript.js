// ============================================================
// FolderTree Widget — Inline JavaScript
// IBM BAW Coach View Widget
// Manages uploaded files with hierarchical structure and bulk metadata editing
// ============================================================

// ── Configuration from options ──────────────────────────────
var _this = this;
var graphqlEndpoint       = this.getOption("graphqlEndpoint") || "";
var repositoryId          = this.getOption("repositoryIdentifier") || "";
var rootFolderPath        = this.getOption("rootFolderPath") || "/";
var allowMultiSelect      = this.getOption("allowMultiSelect") !== false;
var showFileActions       = this.getOption("showFileActions") !== false;
var updateAbleFields      = this.getOption("updateAbleFields") || ""; // Comma-separated list
var enableFolderExpansion = this.getOption("enableFolderExpansion") !== false;
var showSelectionControls = this.getOption("showSelectionControls") !== false;
var showFileCount         = this.getOption("showFileCount") !== false;
var autoSave              = this.getOption("autoSave") || false;
var showDocumentDetails   = this.getOption("showDocumentDetails") !== false;
var PropertyOne           = this.getOption("PropertyOne") || "language";
var PropertyTwo           = this.getOption("PropertyTwo") || "documentType";
var enableDebugLogging    = this.getOption("enableDebugLogging") || false;
var dateFormat            = this.getOption("dateFormat") || "YYYY-MM-DD HH:mm:ss";
var showDetailsPanel      = this.getOption("showDetailsPanel") !== false;

// ── Debug logging helper ─────────────────────────────────────
function debugLog() {
  if (enableDebugLogging && console && console.log) {
    console.log.apply(console, arguments);
  }
}

// ── Format property value based on type ──────────────────────
function formatPropertyValue(propertyName, value, type) {
  if (!value) return value;
  
  // Handle ContentSize - convert bytes to human readable format
  if (propertyName === "ContentSize" || propertyName === "contentSize") {
    var numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return formatBytes(numValue);
    }
  }
  
  // Handle date/time properties
  if (type === "date" || type === "datetime" || type === "timestamp") {
    return formatDate(value, dateFormat);
  }
  
  return value;
}

// ── Format date using simple pattern matching ────────────────
function formatDate(dateValue, format) {
  if (!dateValue) return dateValue;
  
  var date;
  // Try to parse the date
  if (typeof dateValue === "string") {
    date = new Date(dateValue);
  } else if (typeof dateValue === "number") {
    date = new Date(dateValue);
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    return dateValue; // Can't parse, return as-is
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateValue; // Invalid date, return as-is
  }
  
  // Simple format replacement (supports common patterns)
  var formatted = format;
  
  // Year
  formatted = formatted.replace("YYYY", date.getFullYear());
  formatted = formatted.replace("YY", String(date.getFullYear()).slice(-2));
  
  // Month
  var month = date.getMonth() + 1;
  formatted = formatted.replace("MM", String(month).padStart(2, "0"));
  formatted = formatted.replace("M", month);
  
  // Day
  var day = date.getDate();
  formatted = formatted.replace("DD", String(day).padStart(2, "0"));
  formatted = formatted.replace("D", day);
  
  // Hours
  var hours = date.getHours();
  formatted = formatted.replace("HH", String(hours).padStart(2, "0"));
  formatted = formatted.replace("H", hours);
  
  // Minutes
  var minutes = date.getMinutes();
  formatted = formatted.replace("mm", String(minutes).padStart(2, "0"));
  formatted = formatted.replace("m", minutes);
  
  // Seconds
  var seconds = date.getSeconds();
  formatted = formatted.replace("ss", String(seconds).padStart(2, "0"));
  formatted = formatted.replace("s", seconds);
  
  return formatted;
}

// ── Show delete confirmation modal ───────────────────────────
function showDeleteModal(message) {
  return new Promise(function(resolve) {
    // Get modal elements dynamically
    var deleteModal = root ? root.querySelector("#ufm-delete-modal") : null;
    var modalMessage = deleteModal ? deleteModal.querySelector(".ufm-modal-message") : null;
    var modalConfirmBtn = deleteModal ? deleteModal.querySelector(".ufm-modal-confirm") : null;
    var modalCancelBtn = deleteModal ? deleteModal.querySelector(".ufm-modal-cancel") : null;
    var modalCloseBtn = deleteModal ? deleteModal.querySelector(".ufm-modal-close") : null;
    var modalOverlay = deleteModal ? deleteModal.querySelector(".ufm-modal-overlay") : null;
    
    if (!deleteModal || !modalMessage || !modalConfirmBtn || !modalCancelBtn) {
      // Fallback to browser confirm if modal not available
      resolve(confirm(message));
      return;
    }
    
    // Set message
    modalMessage.textContent = message;
    
    // Show modal
    deleteModal.style.display = "flex";
    
    // Focus confirm button
    setTimeout(function() {
      if (modalConfirmBtn) modalConfirmBtn.focus();
    }, 100);
    
    // Handle confirm
    function handleConfirm() {
      cleanup();
      resolve(true);
    }
    
    // Handle cancel
    function handleCancel() {
      cleanup();
      resolve(false);
    }
    
    // Cleanup function
    function cleanup() {
      deleteModal.style.display = "none";
      if (modalConfirmBtn) modalConfirmBtn.removeEventListener("click", handleConfirm);
      if (modalCancelBtn) modalCancelBtn.removeEventListener("click", handleCancel);
      if (modalCloseBtn) modalCloseBtn.removeEventListener("click", handleCancel);
      if (modalOverlay) modalOverlay.removeEventListener("click", handleCancel);
      document.removeEventListener("keydown", handleEscape);
    }
    
    // Handle escape key
    function handleEscape(e) {
      if (e.key === "Escape") {
        handleCancel();
      }
    }
    
    // Attach event listeners
    if (modalConfirmBtn) modalConfirmBtn.addEventListener("click", handleConfirm);
    if (modalCancelBtn) modalCancelBtn.addEventListener("click", handleCancel);
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", handleCancel);
    if (modalOverlay) modalOverlay.addEventListener("click", handleCancel);
    document.addEventListener("keydown", handleEscape);
  });
}

// ── DOM references ───────────────────────────────────────────
var root              = this.context.element.querySelector(".ufm-widget");
var filesPanel        = root.querySelector(".ufm-files-panel");
var filesHeader       = root.querySelector(".ufm-files-header");
var refreshBtn        = root.querySelector(".ufm-refresh-btn");
var selectionControls = root.querySelector(".ufm-selection-controls");
var selectAllBtn      = root.querySelector(".ufm-select-all-btn");
var unselectAllBtn    = root.querySelector(".ufm-unselect-all-btn");
var fileCountEl       = root.querySelector(".ufm-file-count");
var filesList         = root.querySelector(".ufm-files-list");
var detailsPanel      = root.querySelector(".ufm-details-panel");
var detailsHeader     = root.querySelector(".ufm-details-header");
var saveBtn           = root.querySelector(".ufm-save-btn");
var selectionStatus   = root.querySelector(".ufm-selection-status");
var selectionText     = root.querySelector(".ufm-selection-text");
var detailsForm       = root.querySelector(".ufm-details-form");
var detailsEmpty      = root.querySelector(".ufm-details-empty");
var updateableFieldsContainer = root.querySelector(".ufm-updateable-fields");

// ── Widget state ─────────────────────────────────────────────
var currentPath       = rootFolderPath;
var currentFolderId   = null;
var filesData         = [];
var selectedFiles     = [];
var expandedFolders   = [];
var totalFileCount    = 0;
var folderCache       = {}; // Cache folder contents: path -> { folders: [], documents: [], folderId: "" }
var propertyDefinitions = {}; // Cache property metadata: propertyName -> { label, type, dataType }
var fieldsGeneratedWithLabels = false; // Track if fields have been generated with proper labels from GraphQL

// ── Register BAW event handlers ──────────────────────────────
this.registerEventHandlingFunction(this, "onSelectionChange", "data");
this.registerEventHandlingFunction(this, "onSave", "data");
this.registerEventHandlingFunction(this, "onCopyFile", "data");
this.registerEventHandlingFunction(this, "onDeleteFile", "data");

// ── Apply configuration ──────────────────────────────────────
if (!showSelectionControls) {
  selectionControls.style.display = "none";
}

if (!showFileCount) {
  fileCountEl.style.display = "none";
}

// ── Generate dynamic form fields ─────────────────────────────
function generateUpdateableFields() {
  if (!updateableFieldsContainer) return;
  
  // Clear existing fields
  updateableFieldsContainer.innerHTML = "";
  
  if (!updateAbleFields) return;
  
  // Parse the updateAbleFields string
  var fieldsArray = updateAbleFields.split(",").map(function(field) {
    return field.trim();
  }).filter(function(field) {
    return field.length > 0;
  });
  
  // Generate a form group for each field
  fieldsArray.forEach(function(fieldName) {
    var propDef = propertyDefinitions[fieldName] || {};
    var fieldLabel = propDef.label || fieldName;
    var fieldType = propDef.type || "string";
    
    var formGroup = document.createElement("div");
    formGroup.className = "ufm-form-group";
    
    var label = document.createElement("label");
    label.className = "ufm-form-label";
    label.setAttribute("for", "ufm-field-" + fieldName);
    label.textContent = fieldLabel;
    
    var infoIcon = document.createElement("span");
    infoIcon.className = "ufm-info-icon";
    infoIcon.setAttribute("aria-label", "Information");
    infoIcon.setAttribute("title", "Update " + fieldLabel + " for selected files");
    label.appendChild(infoIcon);
    
    // Create appropriate input based on type
    var input = createInputForType(fieldName, fieldType, fieldLabel);
    
    formGroup.appendChild(label);
    formGroup.appendChild(input);
    updateableFieldsContainer.appendChild(formGroup);
  });
}

// ── Create input element based on property type ──────────────
function createInputForType(fieldName, fieldType, fieldLabel) {
  var input;
  
  // Normalize type string
  var normalizedType = (fieldType || "").toLowerCase();
  
  if (normalizedType.indexOf("date") !== -1 || normalizedType.indexOf("time") !== -1) {
    // Date/DateTime input
    input = document.createElement("input");
    input.type = "datetime-local";
    input.className = "ufm-form-select";
  } else if (normalizedType.indexOf("int") !== -1 || normalizedType.indexOf("long") !== -1 || normalizedType.indexOf("double") !== -1 || normalizedType.indexOf("float") !== -1) {
    // Numeric input
    input = document.createElement("input");
    input.type = "number";
    input.className = "ufm-form-select";
  } else if (normalizedType.indexOf("bool") !== -1) {
    // Boolean checkbox
    input = document.createElement("input");
    input.type = "checkbox";
    input.className = "ufm-form-checkbox";
  } else {
    // Default text input
    input = document.createElement("input");
    input.type = "text";
    input.className = "ufm-form-select";
    input.placeholder = "Enter " + fieldLabel;
  }
  
  input.id = "ufm-field-" + fieldName;
  input.setAttribute("data-field-name", fieldName);
  input.setAttribute("data-field-type", fieldType);
  input.setAttribute("aria-label", fieldLabel);
  
  return input;
}

// Fetch property definitions and then generate fields
function initializeUpdateableFields() {
  if (!updateAbleFields) {
    return;
  }
  
  var fieldsArray = updateAbleFields.split(",").map(function(field) {
    return field.trim();
  }).filter(function(field) {
    return field.length > 0;
  });
  
  if (fieldsArray.length === 0) {
    return;
  }
  
  // Fetch property definitions from a sample document
  // For now, we'll generate fields without metadata and update them when we load documents
  generateUpdateableFields();
}

// Initialize fields on load
initializeUpdateableFields();

// ── Utility: format bytes ────────────────────────────────────
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// ── Utility: format version ──────────────────────────────────
function formatVersion(major, minor) {
  return "v" + (major || 0) + "." + (minor || 0);
}

// ── GraphQL: Query folder contents ──────────────────────────
function queryFolderContents(folderPath) {
  // Build properties list for the query
  var propertiesToFetch = [];
  if (PropertyOne) {
    propertiesToFetch.push('"' + PropertyOne + '"');
  }
  if (PropertyTwo) {
    propertiesToFetch.push('"' + PropertyTwo + '"');
  }
  
  // Add updateAbleFields to the query
  if (updateAbleFields) {
    var fieldsArray = updateAbleFields.split(",").map(function(field) {
      return field.trim();
    }).filter(function(field) {
      return field.length > 0;
    });
    
    fieldsArray.forEach(function(fieldName) {
      var quotedField = '"' + fieldName + '"';
      if (propertiesToFetch.indexOf(quotedField) === -1) {
        propertiesToFetch.push(quotedField);
      }
    });
  }
  
  var propertiesQuery = "";
  if (propertiesToFetch.length > 0) {
    propertiesQuery = [
      "        properties(includes: [" + propertiesToFetch.join(", ") + "]) {",
      "          id",
      "          label",
      "          type",
      "          value",
      "        }"
    ].join("\n");
  }
  
  var query = [
    "query GetFolderContents($repoId: String!, $path: String!) {",
    "  folder(repositoryIdentifier: $repoId, identifier: $path) {",
    "    id",
    "    name",
    "    pathName",
    "    subFolders {",
    "      folders {",
    "        id",
    "        name",
    "        pathName",
    "      }",
    "    }",
    "    containedDocuments {",
    "      documents {",
    "        id",
    "        name",
    "        majorVersionNumber",
    "        minorVersionNumber",
    "        mimeType",
    "        contentSize",
    propertiesQuery,
    "      }",
    "      pageInfo {",
    "        totalCount",
    "      }",
    "    }",
    "  }",
    "}"
  ].join("\n");

  debugLog("GraphQL Query:", query);
  debugLog("Variables:", { repoId: repositoryId, path: folderPath });
  
  return fetch(graphqlEndpoint, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: {
        repoId: repositoryId,
        path: folderPath
      }
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    debugLog("GraphQL Response:", json);
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }
    if (!json.data || !json.data.folder) {
      throw new Error("Folder not found: " + folderPath);
    }
    var result = {
      folderId: json.data.folder.id,
      folders: (json.data.folder.subFolders && json.data.folder.subFolders.folders) || [],
      documents: (json.data.folder.containedDocuments && json.data.folder.containedDocuments.documents) || []
    };
    debugLog("Parsed documents:", result.documents);
    return result;
  });
}

// ── GraphQL: Query document properties ──────────────────────
function queryDocumentProperties(documentId) {
  var customPropsArray = [];
  if (updateAbleFields) {
    customPropsArray = updateAbleFields.split(",").map(function(prop) {
      return prop.trim();
    }).filter(function(prop) {
      return prop.length > 0;
    });
  }
  
  var queryFields = [
    "    id",
    "    name",
    "    majorVersionNumber",
    "    minorVersionNumber",
    "    mimeType",
    "    contentSize",
    "    dateCreated",
    "    creator"
  ];
  
  if (customPropsArray.length > 0) {
    var propsIncludes = customPropsArray.map(function(prop) {
      return '"' + prop + '"';
    }).join(", ");
    
    queryFields.push("    properties(includes: [" + propsIncludes + "]) {");
    queryFields.push("      id");
    queryFields.push("      label");
    queryFields.push("      type");
    queryFields.push("      value");
    queryFields.push("    }");
  }
  
  var query = [
    "query GetDocumentProperties($repoId: String!, $docId: String!) {",
    "  document(repositoryIdentifier: $repoId, identifier: $docId) {",
    queryFields.join("\n"),
    "  }",
    "}"
  ].join("\n");

  return fetch(graphqlEndpoint, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: {
        repoId: repositoryId,
        docId: documentId
      }
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }
    if (!json.data || !json.data.document) {
      throw new Error("Document not found: " + documentId);
    }
    return json.data.document;
  });
}

// ── Initialize widget ────────────────────────────────────────
function initialize() {
  // Check if GraphQL endpoint is configured
  if (!graphqlEndpoint || !repositoryId) {
    showError("GraphQL endpoint and repository identifier must be configured");
    return;
  }
  
  // Apply showDetailsPanel configuration
  if (!showDetailsPanel) {
    if (detailsPanel) {
      detailsPanel.style.display = "none";
    }
    // Make files panel full width
    if (filesPanel) {
      filesPanel.classList.add("full-width");
    }
  }
  
  loadFolderContents(currentPath);
  attachEventListeners();
  
  // ── Public API ──────────────────────────────────────────────
  // Expose methods for external widget access
  if (_this.context) {
    _this.context.refresh = function() {
      if (enableDebugLogging) {
        console.log("[FolderTree] External refresh called");
      }
      handleRefresh();
    };
    
    _this.context.getSelectedFiles = function() {
      if (enableDebugLogging) {
        console.log("[FolderTree] getSelectedFiles called, returning:", selectedFiles.length, "files");
      }
      return selectedFiles.slice(); // Return copy of array
    };
    
    _this.context.clearSelection = function() {
      if (enableDebugLogging) {
        console.log("[FolderTree] clearSelection called");
      }
      handleUnselectAll();
    };
    
    if (enableDebugLogging) {
      console.log("[FolderTree] Public API methods exposed: refresh, getSelectedFiles, clearSelection");
    }
  } else if (enableDebugLogging) {
    console.warn("[FolderTree] Context not available, public API methods not exposed");
  }
}

// ── Load folder contents from FileNet ────────────────────────
function loadFolderContents(folderPath) {
  // Check cache first
  if (folderCache[folderPath]) {
    var cached = folderCache[folderPath];
    currentFolderId = cached.folderId;
    buildFilesData(cached.folders, cached.documents);
    renderFilesList();
    updateSelectionStatus();
    updateFileCount();
    return;
  }
  
  // Show loading state
  showLoading();
  
  queryFolderContents(folderPath)
    .then(function(result) {
      // Cache the result
      folderCache[folderPath] = result;
      currentFolderId = result.folderId;
      
      // Build files data structure
      buildFilesData(result.folders, result.documents);
      
      // Render
      hideLoading();
      renderFilesList();
      updateSelectionStatus();
      updateFileCount();
    })
    .catch(function(error) {
      hideLoading();
      showError(error.message || "Failed to load folder contents");
    });
}

// ── Build files data structure from GraphQL results ──────────
function buildFilesData(folders, documents) {
  filesData = [];
  
  // Add folders first
  folders.forEach(function(folder) {
    filesData.push({
      id: folder.id,
      name: folder.name,
      type: "folder",
      pathName: folder.pathName,
      children: [],
      metadata: {}
    });
  });
  
  // Add documents
  documents.forEach(function(doc) {
    // Extract property values from the properties array
    var labelOne = "";
    var labelTwo = "";
    
    debugLog("Processing document:", doc.name);
    debugLog("Document properties:", doc.properties);
    debugLog("Looking for PropertyOne:", PropertyOne);
    debugLog("Looking for PropertyTwo:", PropertyTwo);
    
    if (doc.properties && doc.properties.length > 0) {
      doc.properties.forEach(function(prop) {
        debugLog("Checking property:", prop.id, "=", prop.value, "type:", prop.type);
        
        // Cache property definition
        if (prop.id && !propertyDefinitions[prop.id]) {
          propertyDefinitions[prop.id] = {
            label: prop.label || prop.id,
            type: prop.type || "string"
          };
        }
        
        if (prop.id === PropertyOne) {
          labelOne = formatPropertyValue(prop.id, prop.value, prop.type);
          debugLog("Found labelOne:", labelOne);
        }
        if (prop.id === PropertyTwo) {
          labelTwo = formatPropertyValue(prop.id, prop.value, prop.type);
          debugLog("Found labelTwo:", labelTwo);
        }
      });
    }
    
    debugLog("Final values - labelOne:", labelOne, "labelTwo:", labelTwo);
    
    filesData.push({
      id: doc.id,
      name: doc.name,
      type: "file",
      labelOne: labelOne,
      labelTwo: labelTwo,
      version: formatVersion(doc.majorVersionNumber, doc.minorVersionNumber),
      mimeType: doc.mimeType,
      size: doc.contentSize,
      properties: doc.properties || [],
      metadata: {
        labelOne: labelOne || "Unknown",
        labelTwo: labelTwo || "Unknown",
        version: formatVersion(doc.majorVersionNumber, doc.minorVersionNumber),
        size: formatBytes(doc.contentSize)
      }
    });
  });
  
  // Regenerate fields once after processing all documents if we have property definitions and haven't done so yet
  if (!fieldsGeneratedWithLabels && Object.keys(propertyDefinitions).length > 0 && updateableFieldsContainer) {
    debugLog("Regenerating fields with proper labels from GraphQL");
    generateUpdateableFields();
    fieldsGeneratedWithLabels = true;
  }
}

// ── Show loading state ───────────────────────────────────────
function showLoading() {
  if (filesList) {
    filesList.innerHTML = '<div style="padding: 32px; text-align: center; color: #6f6f6f;">Loading files...</div>';
  }
}

// ── Hide loading state ───────────────────────────────────────
function hideLoading() {
  // Loading is hidden when renderFilesList is called
}

// ── Show error message ───────────────────────────────────────
function showError(message) {
  if (filesList) {
    filesList.innerHTML = '<div style="padding: 32px; text-align: center; color: #da1e28;">Error: ' + message + '</div>';
  }
}

// ── Render files list ────────────────────────────────────────
function renderFilesList() {
  if (!filesList) return;
  
  filesList.innerHTML = "";
  
  if (filesData.length === 0) {
    var emptyMsg = document.createElement("div");
    emptyMsg.style.padding = "32px";
    emptyMsg.style.textAlign = "center";
    emptyMsg.style.color = "#6f6f6f";
    emptyMsg.textContent = "No files uploaded";
    filesList.appendChild(emptyMsg);
    return;
  }
  
  filesData.forEach(function(item) {
    var itemElement = createFileItem(item, 0);
    filesList.appendChild(itemElement);
  });
}

// ── Create file/folder item element ──────────────────────────
function createFileItem(item, level) {
  var isFolder = item.type === "folder";
  var isExpanded = expandedFolders.indexOf(item.id) !== -1;
  var isSelected = selectedFiles.indexOf(item.id) !== -1;
  
  // Main item wrapper
  var wrapper = document.createElement("div");
  wrapper.className = "ufm-file-item-wrapper";
  wrapper.setAttribute("data-item-id", item.id);
  wrapper.setAttribute("data-item-type", item.type);
  
  // File item
  var fileItem = document.createElement("div");
  fileItem.className = "ufm-file-item" + (isSelected ? " selected" : "");
  fileItem.setAttribute("role", "listitem");
  fileItem.setAttribute("tabindex", "0");
  fileItem.style.paddingLeft = (24 + (level * 44)) + "px";
  
  // Folder toggle or spacer
  if (isFolder) {
    var toggle = document.createElement("div");
    toggle.className = "ufm-folder-toggle" + (isExpanded ? " expanded" : "");
    toggle.innerHTML = '<div class="ufm-folder-toggle-icon"></div>';
    toggle.addEventListener("click", function(e) {
      e.stopPropagation();
      toggleFolder(item.id);
    });
    fileItem.appendChild(toggle);
  } else {
    var spacer = document.createElement("div");
    spacer.style.width = "20px";
    spacer.style.flexShrink = "0";
    fileItem.appendChild(spacer);
  }
  
  // Checkbox
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "ufm-file-checkbox";
  checkbox.checked = isSelected;
  checkbox.setAttribute("aria-label", "Select " + item.name);
  checkbox.addEventListener("change", function(e) {
    e.stopPropagation();
    handleCheckboxChange(item.id, checkbox.checked);
  });
  fileItem.appendChild(checkbox);
  
  // Icon
  var icon = document.createElement("div");
  icon.className = "ufm-file-icon " + (isFolder ? "folder" : "document");
  icon.setAttribute("aria-hidden", "true");
  fileItem.appendChild(icon);
  
  // Info
  var info = document.createElement("div");
  info.className = "ufm-file-info";
  
  var name = document.createElement("div");
  name.className = "ufm-file-name";
  name.textContent = item.name;
  info.appendChild(name);
  
  if (!isFolder && item.metadata) {
    var meta = document.createElement("div");
    meta.className = "ufm-file-meta";
    
    var labelOne = document.createElement("span");
    labelOne.textContent = item.metadata.labelOne || "Unknown";
    if (!item.metadata.labelOne) {
      labelOne.className = "unknown";
    }
    meta.appendChild(labelOne);
    
    var separator = document.createElement("span");
    separator.className = "separator";
    separator.textContent = " · ";
    meta.appendChild(separator);
    
    var labelTwo = document.createElement("span");
    labelTwo.textContent = item.metadata.labelTwo || "Unknown";
    if (!item.metadata.labelTwo) {
      labelTwo.className = "unknown";
    }
    meta.appendChild(labelTwo);
    
    info.appendChild(meta);
  }
  
  fileItem.appendChild(info);
  
  // Actions (for files only)
  if (showFileActions && !isFolder) {
    var actions = document.createElement("div");
    actions.className = "ufm-file-actions";
    
    var copyBtn = document.createElement("button");
    copyBtn.className = "ufm-action-btn";
    copyBtn.type = "button";
    copyBtn.setAttribute("aria-label", "Copy file");
    copyBtn.innerHTML = '<div class="ufm-action-icon copy"></div>';
    copyBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      handleCopyFile(item.id);
    });
    actions.appendChild(copyBtn);
    
    var deleteBtn = document.createElement("button");
    deleteBtn.className = "ufm-action-btn";
    deleteBtn.type = "button";
    deleteBtn.setAttribute("aria-label", "Delete file");
    deleteBtn.innerHTML = '<div class="ufm-action-icon delete"></div>';
    deleteBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      handleDeleteFile(item.id);
    });
    actions.appendChild(deleteBtn);
    
    fileItem.appendChild(actions);
  }
  
  // Click handler
  fileItem.addEventListener("click", function() {
    handleItemClick(item.id);
  });
  
  wrapper.appendChild(fileItem);
  
  // Nested children (if folder)
  if (isFolder && item.children && item.children.length > 0) {
    var nestedContainer = document.createElement("div");
    nestedContainer.className = "ufm-nested-files" + (isExpanded ? " expanded" : "");
    nestedContainer.setAttribute("data-parent-id", item.id);
    
    item.children.forEach(function(child) {
      var childElement = createFileItem(child, level + 1);
      nestedContainer.appendChild(childElement);
    });
    
    wrapper.appendChild(nestedContainer);
  }
  
  return wrapper;
}

// ── Toggle folder expansion ──────────────────────────────────
function toggleFolder(folderId) {
  var index = expandedFolders.indexOf(folderId);
  var isExpanding = index === -1;
  
  if (isExpanding) {
    expandedFolders.push(folderId);
    // Load folder contents if not already loaded
    var folder = findItemById(filesData, folderId);
    if (folder && folder.type === "folder" && (!folder.children || folder.children.length === 0)) {
      loadSubfolderContents(folder);
      return; // Will re-render after loading
    }
  } else {
    expandedFolders.splice(index, 1);
  }
  
  var wrapper = root.querySelector('[data-item-id="' + folderId + '"]');
  if (!wrapper) return;
  
  var toggle = wrapper.querySelector(".ufm-folder-toggle");
  var nested = wrapper.querySelector(".ufm-nested-files");
  
  if (toggle) {
    if (expandedFolders.indexOf(folderId) !== -1) {
      toggle.classList.add("expanded");
    } else {
      toggle.classList.remove("expanded");
    }
  }
  
  if (nested) {
    if (expandedFolders.indexOf(folderId) !== -1) {
      nested.classList.add("expanded");
    } else {
      nested.classList.remove("expanded");
    }
  }
}

// ── Load subfolder contents ──────────────────────────────────
function loadSubfolderContents(folder) {
  var folderPath = folder.pathName;
  
  // Check cache first
  if (folderCache[folderPath]) {
    var cached = folderCache[folderPath];
    folder.children = [];
    
    // Add subfolders
    cached.folders.forEach(function(subFolder) {
      folder.children.push({
        id: subFolder.id,
        name: subFolder.name,
        type: "folder",
        pathName: subFolder.pathName,
        children: [],
        metadata: {}
      });
    });
    
    // Add documents
    cached.documents.forEach(function(doc) {
      // Extract property values from the properties array
      var labelOne = "";
      var labelTwo = "";
      
      if (doc.properties && doc.properties.length > 0) {
        doc.properties.forEach(function(prop) {
          if (prop.id === PropertyOne) {
            labelOne = formatPropertyValue(prop.id, prop.value, prop.type);
          }
          if (prop.id === PropertyTwo) {
            labelTwo = formatPropertyValue(prop.id, prop.value, prop.type);
          }
        });
      }
      
      folder.children.push({
        id: doc.id,
        name: doc.name,
        type: "file",
        labelOne: labelOne,
        labelTwo: labelTwo,
        version: formatVersion(doc.majorVersionNumber, doc.minorVersionNumber),
        mimeType: doc.mimeType,
        size: doc.contentSize,
        metadata: {
          labelOne: labelOne || "Unknown",
          labelTwo: labelTwo || "Unknown",
          version: formatVersion(doc.majorVersionNumber, doc.minorVersionNumber),
          size: formatBytes(doc.contentSize)
        }
      });
    });
    
    renderFilesList();
    updateSelectionStatus();
    return;
  }
  
  // Show loading indicator for this folder
  var wrapper = root.querySelector('[data-item-id="' + folder.id + '"]');
  if (wrapper) {
    var toggle = wrapper.querySelector(".ufm-folder-toggle");
    if (toggle) {
      toggle.style.opacity = "0.5";
    }
  }
  
  queryFolderContents(folderPath)
    .then(function(result) {
      // Cache the result
      folderCache[folderPath] = result;
      
      // Build children array
      folder.children = [];
      
      // Add subfolders
      result.folders.forEach(function(subFolder) {
        folder.children.push({
          id: subFolder.id,
          name: subFolder.name,
          type: "folder",
          pathName: subFolder.pathName,
          children: [],
          metadata: {}
        });
      });
      
      // Add documents
      result.documents.forEach(function(doc) {
        // Extract property values from the properties array
        var labelOne = "";
        var labelTwo = "";
        
        if (doc.properties && doc.properties.length > 0) {
          doc.properties.forEach(function(prop) {
            if (prop.id === PropertyOne) {
              labelOne = formatPropertyValue(prop.id, prop.value, prop.type);
            }
            if (prop.id === PropertyTwo) {
              labelTwo = formatPropertyValue(prop.id, prop.value, prop.type);
            }
          });
        }
        
        folder.children.push({
          id: doc.id,
          name: doc.name,
          type: "file",
          labelOne: labelOne,
          labelTwo: labelTwo,
          version: formatVersion(doc.majorVersionNumber, doc.minorVersionNumber),
          mimeType: doc.mimeType,
          size: doc.contentSize,
          metadata: {
            labelOne: labelOne || "Unknown",
            labelTwo: labelTwo || "Unknown",
            version: formatVersion(doc.majorVersionNumber, doc.minorVersionNumber),
            size: formatBytes(doc.contentSize)
          }
        });
      });
      
      // Re-render the list
      renderFilesList();
      updateSelectionStatus();
      updateFileCount();
    })
    .catch(function(error) {
      // Remove from expanded folders on error
      var idx = expandedFolders.indexOf(folder.id);
      if (idx !== -1) {
        expandedFolders.splice(idx, 1);
      }
      
      // Restore toggle opacity
      if (wrapper) {
        var toggle = wrapper.querySelector(".ufm-folder-toggle");
        if (toggle) {
          toggle.style.opacity = "1";
        }
      }
      
      showError("Failed to load folder: " + error.message);
    });
}

// ── Handle checkbox change ───────────────────────────────────
function handleCheckboxChange(itemId, checked) {
  var item = findItemById(filesData, itemId);
  if (!item) return;
  
  if (checked) {
    // If it's a folder, select all documents inside it (but not the folder itself)
    if (item.type === "folder") {
      var folderDocIds = collectAllFileIds([item]);
      if (allowMultiSelect) {
        folderDocIds.forEach(function(docId) {
          if (selectedFiles.indexOf(docId) === -1) {
            selectedFiles.push(docId);
          }
        });
      } else {
        selectedFiles = folderDocIds;
      }
    } else {
      // It's a file, add it to selection
      if (allowMultiSelect) {
        if (selectedFiles.indexOf(itemId) === -1) {
          selectedFiles.push(itemId);
        }
      } else {
        selectedFiles = [itemId];
      }
    }
  } else {
    // Unchecking: remove the item or all documents in folder
    if (item.type === "folder") {
      var folderDocIds = collectAllFileIds([item]);
      folderDocIds.forEach(function(docId) {
        var index = selectedFiles.indexOf(docId);
        if (index !== -1) {
          selectedFiles.splice(index, 1);
        }
      });
    } else {
      var index = selectedFiles.indexOf(itemId);
      if (index !== -1) {
        selectedFiles.splice(index, 1);
      }
    }
  }
  
  updateSelectionStatus();
  updateCheckboxStates();
  fireSelectionEvent();
}

// ── Handle item click ────────────────────────────────────────
function handleItemClick(itemId) {
  var item = findItemById(filesData, itemId);
  if (!item || item.type === "folder") return;
  
  var index = selectedFiles.indexOf(itemId);
  if (index !== -1) {
    selectedFiles.splice(index, 1);
  } else {
    if (!allowMultiSelect) {
      selectedFiles = [];
    }
    selectedFiles.push(itemId);
  }
  
  updateSelectionStatus();
  updateCheckboxStates();
  fireSelectionEvent();
}

// ── Handle select all ────────────────────────────────────────
function handleSelectAll() {
  selectedFiles = [];
  collectAllFileIds(filesData).forEach(function(id) {
    selectedFiles.push(id);
  });
  updateSelectionStatus();
  updateCheckboxStates();
  fireSelectionEvent();
}

// ── Handle unselect all ──────────────────────────────────────
function handleUnselectAll() {
  selectedFiles = [];
  updateSelectionStatus();
  updateCheckboxStates();
  fireSelectionEvent();
}

// ── GraphQL: Update document properties ──────────────────────
function updateDocumentProperties(documentId, properties) {
  // Build properties array for mutation
  var propertiesArray = [];
  
  for (var propName in properties) {
    if (properties.hasOwnProperty(propName)) {
      var propValue = properties[propName];
      var propObj = {};
      propObj[propName] = propValue;
      propertiesArray.push(propObj);
    }
  }
  
  var mutation = [
    "mutation UpdateDocument($repoId: String!, $docId: String!, $props: DocumentPropertiesInput!) {",
    "  updateDocument(",
    "    repositoryIdentifier: $repoId",
    "    identifier: $docId",
    "    documentProperties: $props",
    "  ) {",
    "    id",
    "    name",
    "  }",
    "}"
  ].join("\n");
  
  var variables = {
    repoId: repositoryId,
    docId: documentId,
    props: {
      properties: propertiesArray
    }
  };
  
  debugLog("GraphQL Mutation:", mutation);
  debugLog("Variables:", variables);
  
  return fetch(graphqlEndpoint, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: variables
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }
    if (!json.data || !json.data.updateDocument) {
      throw new Error("Failed to update document: " + documentId);
    }
    debugLog("Document updated:", json.data.updateDocument);
    return json.data.updateDocument;
  });
}

// ── Handle save ──────────────────────────────────────────────
function handleSave() {
  // Capture widget context for use in Promise callbacks
  var widget = _this;
  
  if (selectedFiles.length === 0) {
    showError("No files selected");
    return;
  }
  
  var updates = {};
  
  // Collect values from all dynamic fields
  if (updateableFieldsContainer) {
    var inputs = updateableFieldsContainer.querySelectorAll("input[data-field-name]");
    inputs.forEach(function(input) {
      var fieldName = input.getAttribute("data-field-name");
      var fieldType = input.getAttribute("data-field-type") || "string";
      var value;
      
      // Get value based on input type
      if (input.type === "checkbox") {
        value = input.checked;
      } else if (input.type === "datetime-local") {
        // Convert to ISO string if value exists
        value = input.value ? new Date(input.value).toISOString() : null;
      } else if (input.type === "number") {
        // Parse number value
        value = input.value ? parseFloat(input.value) : null;
      } else {
        value = input.value || null;
      }
      
      if (value !== null && value !== "") {
        updates[fieldName] = value;
      }
    });
  }
  
  if (Object.keys(updates).length === 0) {
    showError("No changes to save");
    return;
  }
  
  debugLog("Saving updates:", updates);
  debugLog("Selected files:", selectedFiles);
  
  // Disable save button during update
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
  }
  
  // Update each selected document via GraphQL mutation
  var updatePromises = selectedFiles.map(function(itemId) {
    var item = findItemById(filesData, itemId);
    if (!item || item.type !== "file") {
      return Promise.resolve();
    }
    
    return updateDocumentProperties(item.id, updates);
  });
  
  Promise.all(updatePromises)
    .then(function(results) {
      debugLog("All documents updated successfully");
      
      // Update local data
      selectedFiles.forEach(function(itemId) {
        var item = findItemById(filesData, itemId);
        if (item && item.type === "file") {
          if (!item.properties) {
            item.properties = [];
          }
          
          // Update each field in local data
          for (var fieldName in updates) {
            if (updates.hasOwnProperty(fieldName)) {
              var existingProp = null;
              for (var i = 0; i < item.properties.length; i++) {
                if (item.properties[i].id === fieldName) {
                  existingProp = item.properties[i];
                  break;
                }
              }
              
              if (existingProp) {
                existingProp.value = updates[fieldName];
              } else {
                item.properties.push({
                  id: fieldName,
                  value: updates[fieldName]
                });
              }
            }
          }
        }
      });
      
      // Re-render
      renderFilesList();
      updateCheckboxStates();
      
      // Re-enable save button
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save";
      }
      
      // Fire save event
      widget.executeEventHandlingFunction(widget, "onSave", {
        selectedFiles: selectedFiles.slice(),
        updates: updates,
        success: true
      });
      
      // Show success message (optional)
      debugLog("Documents updated successfully");
    })
    .catch(function(error) {
      debugLog("Error updating documents:", error);
      showError("Failed to update documents: " + error.message);
      
      // Re-enable save button
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save";
      }
      
      // Fire save event with error
      widget.executeEventHandlingFunction(widget, "onSave", {
        selectedFiles: selectedFiles.slice(),
        updates: updates,
        success: false,
        error: error.message
      });
    });
}

// ── Handle copy file ─────────────────────────────────────────
function handleCopyFile(fileId) {
  _this.executeEventHandlingFunction(_this, "onCopyFile", { fileId: fileId });
}

// ── Handle delete file ───────────────────────────────────────
// ── GraphQL: Delete document ─────────────────────────────────
function deleteDocument(documentId) {
  var mutation = [
    "mutation DeleteDocument($repoId: String!, $docId: String!) {",
    "  deleteDocument(",
    "    repositoryIdentifier: $repoId",
    "    identifier: $docId",
    "  ) {",
    "    id",
    "  }",
    "}"
  ].join("\n");
  
  var variables = {
    repoId: repositoryId,
    docId: documentId
  };
  
  debugLog("GraphQL Delete Document Mutation:", mutation);
  debugLog("Variables:", variables);
  
  return fetch(graphqlEndpoint, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: variables
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }
    if (!json.data || !json.data.deleteDocument) {
      throw new Error("Failed to delete document: " + documentId);
    }
    debugLog("Document deleted:", json.data.deleteDocument);
    return json.data.deleteDocument;
  });
}

// ── GraphQL: Delete folder ───────────────────────────────────
function deleteFolder(folderId) {
  var mutation = [
    "mutation DeleteFolder($repoId: String!, $folderId: String!) {",
    "  deleteFolder(",
    "    repositoryIdentifier: $repoId",
    "    identifier: $folderId",
    "  ) {",
    "    id",
    "  }",
    "}"
  ].join("\n");
  
  var variables = {
    repoId: repositoryId,
    folderId: folderId
  };
  
  debugLog("GraphQL Delete Folder Mutation:", mutation);
  debugLog("Variables:", variables);
  
  return fetch(graphqlEndpoint, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: variables
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }
    if (!json.data || !json.data.deleteFolder) {
      throw new Error("Failed to delete folder: " + folderId);
    }
    debugLog("Folder deleted:", json.data.deleteFolder);
    return json.data.deleteFolder;
  });
}

// ── Get all documents in folder recursively ──────────────────
function getAllDocumentsInFolder(folder) {
  var documents = [];
  
  // Add documents in this folder
  if (folder.children) {
    folder.children.forEach(function(child) {
      if (child.type === "file") {
        documents.push(child);
      } else if (child.type === "folder") {
        // Recursively get documents from subfolders
        var subDocs = getAllDocumentsInFolder(child);
        documents = documents.concat(subDocs);
      }
    });
  }
  
  return documents;
}

// ── Handle delete file/folder ────────────────────────────────
function handleDeleteFile(itemId) {
  var item = findItemById(filesData, itemId);
  if (!item) {
    showError("Item not found");
    return;
  }
  
  var itemType = item.type === "folder" ? "folder" : "document";
  var itemName = item.name;
  
  // Show confirmation modal
  var message = "Are you sure you want to delete this " + itemType + "?\n\n" + itemName;
  
  showDeleteModal(message).then(function(confirmed) {
    if (!confirmed) {
      return;
    }
    
    debugLog("Deleting " + itemType + ":", itemId, itemName);
    
    var deletePromise;
    
    if (item.type === "folder") {
      // For folders: delete all documents first, then delete the folder
      var documents = getAllDocumentsInFolder(item);
      
      if (documents.length > 0) {
        debugLog("Deleting " + documents.length + " documents in folder first");
        
        // Delete all documents in the folder
        var deleteDocPromises = documents.map(function(doc) {
          return deleteDocument(doc.id);
        });
        
        deletePromise = Promise.all(deleteDocPromises)
          .then(function() {
            debugLog("All documents deleted, now deleting folder");
            return deleteFolder(item.id);
          });
      } else {
        // Empty folder, delete directly
        deletePromise = deleteFolder(item.id);
      }
    } else {
      // Delete document directly
      deletePromise = deleteDocument(item.id);
    }
    
    deletePromise
      .then(function() {
        debugLog(itemType + " deleted successfully:", itemId);
        
        // Remove from local data
        removeItemFromData(filesData, itemId);
        
        // Remove from selected files if it was selected
        var selectedIndex = selectedFiles.indexOf(itemId);
        if (selectedIndex !== -1) {
          selectedFiles.splice(selectedIndex, 1);
        }
        
        // Re-render
        renderFilesList();
        updateSelectionStatus();
        updateCheckboxStates();
        updateFileCount();
        
        // Fire delete event
        _this.executeEventHandlingFunction(_this, "onDeleteFile", {
          itemId: itemId,
          itemType: itemType,
          itemName: itemName,
          success: true
        });
      })
      .catch(function(error) {
        debugLog("Error deleting " + itemType + ":", error);
        showError("Failed to delete " + itemType + ": " + error.message);
        
        // Fire delete event with error
        _this.executeEventHandlingFunction(_this, "onDeleteFile", {
          itemId: itemId,
          itemType: itemType,
          itemName: itemName,
          success: false,
          error: error.message
        });
      });
  });
}

// ── Remove item from data structure ──────────────────────────
function removeItemFromData(dataArray, itemId) {
  for (var i = 0; i < dataArray.length; i++) {
    if (dataArray[i].id === itemId) {
      dataArray.splice(i, 1);
      return true;
    }
    if (dataArray[i].children && dataArray[i].children.length > 0) {
      if (removeItemFromData(dataArray[i].children, itemId)) {
        return true;
      }
    }
  }
  return false;
}

// ── Update selection status ──────────────────────────────────
function updateSelectionStatus() {
  if (!selectionText || !detailsForm || !detailsEmpty || !saveBtn) return;
  
  var selectedCount = selectedFiles.length;
  
  if (selectedCount === 0) {
    selectionText.textContent = "No files selected";
    detailsForm.classList.remove("visible");
    detailsEmpty.classList.remove("hidden");
    saveBtn.disabled = true;
  } else if (selectedCount === 1) {
    selectionText.textContent = "1 File selected";
    detailsForm.classList.add("visible");
    detailsEmpty.classList.add("hidden");
    saveBtn.disabled = false;
    populateDetailsForm();
  } else {
    selectionText.textContent = selectedCount + " Files selected";
    detailsForm.classList.add("visible");
    detailsEmpty.classList.add("hidden");
    saveBtn.disabled = false;
    populateDetailsFormMultiple();
  }
}

// ── Populate details form (single selection) ─────────────────
function populateDetailsForm() {
  var selectedId = selectedFiles[0];
  var item = findItemById(filesData, selectedId);
  
  if (!item || !updateableFieldsContainer) return;
  
  // Populate all dynamic fields
  var inputs = updateableFieldsContainer.querySelectorAll("input[data-field-name]");
  inputs.forEach(function(input) {
    var fieldName = input.getAttribute("data-field-name");
    var value = "";
    
    // Find the property value in the item
    if (item.properties && item.properties.length > 0) {
      for (var i = 0; i < item.properties.length; i++) {
        if (item.properties[i].id === fieldName) {
          value = item.properties[i].value || "";
          break;
        }
      }
    }
    
    // Set value based on input type
    if (input.type === "checkbox") {
      input.checked = (value === "true" || value === true);
    } else if (input.type === "datetime-local" && value) {
      // Convert ISO string to datetime-local format
      try {
        var date = new Date(value);
        var localDateTime = date.getFullYear() + "-" +
          String(date.getMonth() + 1).padStart(2, "0") + "-" +
          String(date.getDate()).padStart(2, "0") + "T" +
          String(date.getHours()).padStart(2, "0") + ":" +
          String(date.getMinutes()).padStart(2, "0");
        input.value = localDateTime;
      } catch (e) {
        input.value = value;
      }
    } else {
      input.value = value;
    }
  });
}

// ── Populate details form (multiple selection) ───────────────
function populateDetailsFormMultiple() {
  var selectedItems = selectedFiles.map(function(id) {
    return findItemById(filesData, id);
  }).filter(function(item) {
    return item !== null;
  });
  
  if (!updateableFieldsContainer) return;
  
  // For each field, check if all selected items have the same value
  var inputs = updateableFieldsContainer.querySelectorAll("input[data-field-name]");
  inputs.forEach(function(input) {
    var fieldName = input.getAttribute("data-field-name");
    var values = [];
    
    // Collect values from all selected items
    selectedItems.forEach(function(item) {
      var value = "";
      if (item.properties && item.properties.length > 0) {
        for (var i = 0; i < item.properties.length; i++) {
          if (item.properties[i].id === fieldName) {
            value = item.properties[i].value || "";
            break;
          }
        }
      }
      values.push(value);
    });
    
    // Get unique values
    var uniqueValues = values.filter(function(value, index, self) {
      return self.indexOf(value) === index;
    });
    
    // If all items have the same value, show it; otherwise leave empty or unchecked
    if (input.type === "checkbox") {
      if (uniqueValues.length === 1) {
        input.checked = (uniqueValues[0] === "true" || uniqueValues[0] === true);
      } else {
        input.checked = false;
        input.indeterminate = true; // Show indeterminate state for mixed values
      }
    } else if (input.type === "datetime-local") {
      if (uniqueValues.length === 1 && uniqueValues[0]) {
        try {
          var date = new Date(uniqueValues[0]);
          var localDateTime = date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0") + "T" +
            String(date.getHours()).padStart(2, "0") + ":" +
            String(date.getMinutes()).padStart(2, "0");
          input.value = localDateTime;
        } catch (e) {
          input.value = "";
        }
      } else {
        input.value = "";
      }
    } else {
      input.value = uniqueValues.length === 1 ? uniqueValues[0] : "";
    }
  });
}

// ── Update checkbox states ───────────────────────────────────
function updateCheckboxStates() {
  var checkboxes = root.querySelectorAll(".ufm-file-checkbox");
  checkboxes.forEach(function(checkbox) {
    var wrapper = checkbox.closest(".ufm-file-item-wrapper");
    var itemId = wrapper ? wrapper.getAttribute("data-item-id") : null;
    if (itemId) {
      checkbox.checked = selectedFiles.indexOf(itemId) !== -1;
      var fileItem = checkbox.closest(".ufm-file-item");
      if (fileItem) {
        if (selectedFiles.indexOf(itemId) !== -1) {
          fileItem.classList.add("selected");
        } else {
          fileItem.classList.remove("selected");
        }
      }
    }
  });
}

// ── Update file count ────────────────────────────────────────
function updateFileCount() {
  if (!fileCountEl) return;
  
  totalFileCount = countAllFiles(filesData);
  fileCountEl.textContent = totalFileCount + " file" + (totalFileCount !== 1 ? "s" : "");
}

// ── Fire selection event ─────────────────────────────────────
function fireSelectionEvent() {
  var selectedItems = selectedFiles.map(function(id) {
    var item = findItemById(filesData, id);
    return item ? {
      id: item.id,
      name: item.name,
      type: item.type,
      labelOne: item.labelOne,
      labelTwo: item.labelTwo
    } : null;
  }).filter(function(item) {
    return item !== null;
  });
  
  _this.executeEventHandlingFunction(_this, "onSelectionChange", {
    selectedFiles: selectedItems,
    count: selectedItems.length
  });
}

// ── Handle refresh ───────────────────────────────────────────
function handleRefresh() {
  if (enableDebugLogging) {
    console.log("[FolderTree] Refreshing file list");
  }
  
  // Add refreshing animation class
  if (refreshBtn) {
    refreshBtn.classList.add("refreshing");
    setTimeout(function() {
      refreshBtn.classList.remove("refreshing");
    }, 600);
  }
  
  // Clear folder cache to force reload
  folderCache = {};
  
  // Clear selection
  selectedFiles = [];
  updateSelectionStatus();
  updateCheckboxStates();
  
  // Reload current folder contents
  loadFolderContents(currentPath);
  
  if (enableDebugLogging) {
    console.log("[FolderTree] File list refreshed");
  }
}

// ── Attach event listeners ───────────────────────────────────
function attachEventListeners() {
  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", handleSelectAll);
  }
  
  if (unselectAllBtn) {
    unselectAllBtn.addEventListener("click", handleUnselectAll);
  }
  
  if (saveBtn) {
    saveBtn.addEventListener("click", handleSave);
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener("click", handleRefresh);
  }
}

// ── Utility: Find item by ID ─────────────────────────────────
function findItemById(items, id) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === id) return items[i];
    if (items[i].children) {
      var found = findItemById(items[i].children, id);
      if (found) return found;
    }
  }
  return null;
}

// ── Utility: Collect all file IDs ────────────────────────────
function collectAllFileIds(items) {
  var ids = [];
  items.forEach(function(item) {
    if (item.type === "file") {
      ids.push(item.id);
    }
    if (item.children) {
      ids = ids.concat(collectAllFileIds(item.children));
    }
  });
  return ids;
}

// ── Utility: Count all files ─────────────────────────────────
function countAllFiles(items) {
  var count = 0;
  items.forEach(function(item) {
    if (item.type === "file") {
      count++;
    }
    if (item.children) {
      count += countAllFiles(item.children);
    }
  });
  return count;
}


// ── Initialize widget on load ────────────────────────────────
initialize();

// Made with Bob
