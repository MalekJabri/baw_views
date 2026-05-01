// ============================================================
// FileNetImport Widget — Inline JavaScript
// IBM BAW Coach View Widget
// Handles drag-and-drop of files/folders, preserves folder
// structure, and imports via FileNet GraphQL API.
// ============================================================

// ── Configuration from options ──────────────────────────────
var graphqlEndpoint    = this.getOption("graphqlEndpoint") || "";
var repositoryId       = this.getOption("repositoryIdentifier") || "";
var parentFolderPath   = this.getOption("parentFolderPath") || "/";
var maxFileSizeMB      = this.getOption("maxFileSizeMB") || 100;
var allowedMimeTypes   = this.getOption("allowedMimeTypes") || "";
var showImportLog      = this.getOption("showImportLog") !== false; // Default true
var documentClassId    = this.getOption("documentClassIdentifier") || "";
var folderClassId      = this.getOption("folderClassIdentifier") || "";

// ── DOM references ───────────────────────────────────────────
var root        = this.context.element.querySelector(".fnimport-widget");
var dropzone    = root.querySelector(".fnimport-dropzone");
var fileInput   = root.querySelector(".fnimport-file-input");
var browseBtn   = root.querySelector(".fnimport-browse-btn");
var statusBar   = root.querySelector(".fnimport-statusbar");
var statusText  = root.querySelector(".fnimport-status-text");
var progressBar = root.querySelector(".fnimport-progress-bar");
var progressFill= root.querySelector(".fnimport-progress-fill");
var queueEl     = root.querySelector(".fnimport-queue");
var importBtn   = root.querySelector(".fnimport-btn-import");
var clearBtn    = root.querySelector(".fnimport-btn-clear");
var logEl       = root.querySelector(".fnimport-log");

// ── Apply log visibility based on configuration ─────────────
if (!showImportLog) {
  logEl.style.display = "none";
}

// ── Widget state ─────────────────────────────────────────────
var fileQueue   = [];   // Array of { file, relativePath, type:"file"|"folder" }
var folderCache = {};   // Map: relativeFolderPath → FileNet folder ID
var isImporting = false;

// ── Register BAW event handlers ──────────────────────────────
this.registerEventHandlingFunction(this, "onImportComplete", "data");
this.registerEventHandlingFunction(this, "onImportError",    "data");
this.registerEventHandlingFunction(this, "onFileAdded",      "data");

// ── Utility: format bytes ────────────────────────────────────
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// ── Utility: get file extension ──────────────────────────────
function getExtension(name) {
  var parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

// ── Utility: sanitize path segment ──────────────────────────
function sanitizeName(name) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
}

// ── Utility: add log entry ───────────────────────────────────
function addLog(message, type) {
  // Skip if log is hidden
  if (!showImportLog) return;
  
  // type: "success" | "error" | "info" | "warning"
  var icons = { success: "✓", error: "✗", info: "ℹ", warning: "⚠" };
  var entry = document.createElement("div");
  entry.className = "fnimport-log-entry fnimport-log-" + (type || "info");
  entry.setAttribute("role", "listitem");

  var iconSpan = document.createElement("span");
  iconSpan.className = "fnimport-log-icon";
  iconSpan.setAttribute("aria-hidden", "true");
  iconSpan.textContent = icons[type] || "ℹ";

  var msgSpan = document.createElement("span");
  msgSpan.className = "fnimport-log-message";
  msgSpan.textContent = message;

  entry.appendChild(iconSpan);
  entry.appendChild(msgSpan);
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
}

// ── Utility: update progress ─────────────────────────────────
function updateProgress(done, total, message) {
  var pct = total > 0 ? Math.round((done / total) * 100) : 0;
  progressFill.style.width = pct + "%";
  progressBar.setAttribute("aria-valuenow", pct);
  statusText.textContent = message || (done + " / " + total + " imported");
  statusBar.classList.add("fnimport-visible");
}

// ── Utility: set import button state ────────────────────────
function refreshImportButton() {
  importBtn.disabled = fileQueue.length === 0 || isImporting;
}

// ── Build queue item DOM ─────────────────────────────────────
function buildQueueItem(entry, index) {
  var item = document.createElement("div");
  item.className = "fnimport-queue-item";
  item.setAttribute("role", "listitem");
  item.setAttribute("data-queue-index", index);

  // Icon
  var icon = document.createElement("span");
  icon.className = "fnimport-item-icon " +
    (entry.type === "folder" ? "fnimport-icon-folder" : "fnimport-icon-document");
  icon.setAttribute("aria-hidden", "true");

  // Path info
  var pathDiv = document.createElement("div");
  pathDiv.className = "fnimport-item-path";

  var folderPrefix = document.createElement("span");
  folderPrefix.className = "fnimport-item-folder-prefix";
  var dirPart = entry.relativePath.includes("/")
    ? entry.relativePath.substring(0, entry.relativePath.lastIndexOf("/"))
    : "";
  folderPrefix.textContent = dirPart ? "📁 " + dirPart : "";

  var nameSpan = document.createElement("span");
  nameSpan.className = "fnimport-item-name";
  nameSpan.textContent = entry.file ? entry.file.name : entry.relativePath;

  pathDiv.appendChild(folderPrefix);
  pathDiv.appendChild(nameSpan);

  // Size
  var sizeSpan = document.createElement("span");
  sizeSpan.className = "fnimport-item-size";
  sizeSpan.textContent = entry.file ? formatBytes(entry.file.size) : "";

  // Status badge
  var statusBadge = document.createElement("span");
  statusBadge.className = "fnimport-item-status fnimport-status-pending";
  statusBadge.textContent = "Pending";
  statusBadge.setAttribute("data-status-badge", "true");

  // Remove button
  var removeBtn = document.createElement("button");
  removeBtn.className = "fnimport-item-remove";
  removeBtn.type = "button";
  removeBtn.setAttribute("aria-label", "Remove " + (entry.file ? entry.file.name : entry.relativePath) + " from queue");
  removeBtn.textContent = "×";
  removeBtn.addEventListener("click", function() {
    fileQueue.splice(index, 1);
    renderQueue();
    refreshImportButton();
  });

  item.appendChild(icon);
  item.appendChild(pathDiv);
  item.appendChild(sizeSpan);
  item.appendChild(statusBadge);
  item.appendChild(removeBtn);
  return item;
}

// ── Render the full queue ────────────────────────────────────
function renderQueue() {
  queueEl.innerHTML = "";
  if (fileQueue.length === 0) return;

  // Group by top-level folder
  var groups = {};
  var ungrouped = [];

  fileQueue.forEach(function(entry, idx) {
    var parts = entry.relativePath.split("/");
    if (parts.length > 1) {
      var topFolder = parts[0];
      if (!groups[topFolder]) groups[topFolder] = [];
      groups[topFolder].push({ entry: entry, idx: idx });
    } else {
      ungrouped.push({ entry: entry, idx: idx });
    }
  });

  // Render ungrouped files first
  ungrouped.forEach(function(item) {
    queueEl.appendChild(buildQueueItem(item.entry, item.idx));
  });

  // Render grouped folders
  Object.keys(groups).forEach(function(folderName) {
    var header = document.createElement("div");
    header.className = "fnimport-folder-header";
    header.setAttribute("role", "heading");
    header.setAttribute("aria-level", "3");
    header.textContent = "📁 " + folderName + " (" + groups[folderName].length + " files)";
    queueEl.appendChild(header);

    groups[folderName].forEach(function(item) {
      queueEl.appendChild(buildQueueItem(item.entry, item.idx));
    });
  });
}

// ── Update a single item's status badge ─────────────────────
function setItemStatus(index, status, label) {
  var item = queueEl.querySelector("[data-queue-index='" + index + "'] [data-status-badge]");
  if (!item) return;
  item.className = "fnimport-item-status fnimport-status-" + status;
  item.textContent = label;
}

// ── Process dropped DataTransferItemList (supports folders) ──
function processDataTransferItems(items) {
  var promises = [];

  function traverseEntry(entry, path) {
    path = path || "";
    if (entry.isFile) {
      return new Promise(function(resolve) {
        entry.file(function(file) {
          var relPath = path ? path + "/" + file.name : file.name;
          addFileToQueue(file, relPath);
          resolve();
        }, function() { resolve(); });
      });
    } else if (entry.isDirectory) {
      var dirReader = entry.createReader();
      return new Promise(function(resolve) {
        var allEntries = [];
        function readBatch() {
          dirReader.readEntries(function(batch) {
            if (batch.length === 0) {
              var subPromises = allEntries.map(function(subEntry) {
                var subPath = path ? path + "/" + entry.name : entry.name;
                return traverseEntry(subEntry, subPath);
              });
              Promise.all(subPromises).then(resolve);
            } else {
              allEntries = allEntries.concat(Array.prototype.slice.call(batch));
              readBatch();
            }
          }, function() { resolve(); });
        }
        readBatch();
      });
    }
    return Promise.resolve();
  }

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.kind === "file") {
      var entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
      if (entry) {
        promises.push(traverseEntry(entry, ""));
      } else {
        // Fallback: plain file
        var file = item.getAsFile();
        if (file) addFileToQueue(file, file.name);
      }
    }
  }

  Promise.all(promises).then(function() {
    renderQueue();
    refreshImportButton();
    if (fileQueue.length > 0) {
      addLog(fileQueue.length + " item(s) added to queue.", "info");
    }
  });
}

// ── Add a file to the queue (with validation) ────────────────
var self = this;
function addFileToQueue(file, relativePath) {
  // Size check
  if (file.size > maxFileSizeMB * 1024 * 1024) {
    addLog("Skipped (too large): " + relativePath + " (" + formatBytes(file.size) + ")", "warning");
    return;
  }
  // Duplicate check
  for (var i = 0; i < fileQueue.length; i++) {
    if (fileQueue[i].relativePath === relativePath) return;
  }
  fileQueue.push({ file: file, relativePath: relativePath, type: "file" });
  self.executeEventHandlingFunction(self, "onFileAdded", { path: relativePath, size: file.size });
}

// ── GraphQL: create a folder under a parent path ─────────────
function gqlCreateFolder(folderName, parentPath) {
  // Build mutation dynamically based on whether classIdentifier is provided
  var mutationParts = [
    "mutation CreateFolder($repoId: String!, $name: String!, $parentPath: String!" + (folderClassId ? ", $classId: String!" : "") + ") {",
    "  createFolder(",
    "    repositoryIdentifier: $repoId"
  ];
  
  // Add classIdentifier at the top level if provided
  if (folderClassId) {
    mutationParts.push("    classIdentifier: $classId");
  }
  
  mutationParts = mutationParts.concat([
    "    folderProperties: {",
    "      name: $name",
    "      parent: {",
    "        identifier: $parentPath",
    "      }",
    "    }",
    "  ) {",
    "    id",
    "    name",
    "    pathName",
    "  }",
    "}"
  ]);
  
  var mutation = mutationParts.join("\n");
  
  var variables = {
    repoId: repositoryId,
    name: sanitizeName(folderName),
    parentPath: parentPath
  };
  
  if (folderClassId) {
    variables.classId = folderClassId;
  }

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
    return json.data.createFolder.pathName;
  });
}

// ── GraphQL: import a document into a folder (multipart form) ─
function gqlImportDocument(file, folderPath) {
  return new Promise(function(resolve, reject) {
    var mimeType = file.type || "application/octet-stream";
    
    // Build GraphQL mutation dynamically based on whether classIdentifier is provided
    var mutationParts = [
      "mutation ($contvar: String) {",
      "  createDocument(",
      "    repositoryIdentifier: \"" + repositoryId + "\"",
      "    fileInFolderIdentifier: \"" + folderPath + "\""
    ];
    
    // Add classIdentifier at the top level if provided
    if (documentClassId) {
      mutationParts.push("    classIdentifier: \"" + documentClassId + "\"");
    }
    
    mutationParts = mutationParts.concat([
      "    documentProperties: {",
      "      name: \"" + sanitizeName(file.name) + "\"",
      "      contentElements: {",
      "        replace: [{",
      "          type: CONTENT_TRANSFER",
      "          contentType: \"" + mimeType + "\"",
      "          subContentTransfer: {",
      "            content: $contvar",
      "          }",
      "        }]",
      "      }",
      "    }",
      "    checkinAction: {}",
      "  ) {",
      "    id",
      "    name",
      "  }",
      "}"
    ]);
    
    var mutation = mutationParts.join("\n");

    // Build multipart form data
    var formData = new FormData();
    
    // Add GraphQL query and variables as JSON
    formData.append("graphql", JSON.stringify({
      query: mutation,
      variables: { contvar: null }  // null because file is in separate part
    }));
    
    // Add file content as separate part named "contvar"
    formData.append("contvar", file);

    fetch(graphqlEndpoint, {
      method: "POST",
      credentials: "include",
      body: formData  // No Content-Type header - browser sets it with boundary
    })
    .then(function(res) { return res.json(); })
    .then(function(json) {
      if (json.errors && json.errors.length > 0) {
        reject(new Error(json.errors[0].message));
      } else {
        resolve(json.data.createDocument);
      }
    })
    .catch(reject);
  });
}

// ── Ensure folder path exists, return leaf folder path ───────
function ensureFolderPath(relativePath) {
  // relativePath: e.g. "ProjectA/SubFolder"
  var segments = relativePath.split("/").filter(function(s) { return s.length > 0; });
  if (segments.length === 0) return Promise.resolve(parentFolderPath);

  var chain = Promise.resolve(parentFolderPath);
  var builtPath = "";

  segments.forEach(function(segment) {
    chain = chain.then(function(currentParentPath) {
      builtPath = builtPath ? builtPath + "/" + segment : segment;
      if (folderCache[builtPath]) {
        return Promise.resolve(folderCache[builtPath]);
      }
      return gqlCreateFolder(segment, currentParentPath).then(function(newPath) {
        folderCache[builtPath] = newPath;
        addLog("Created folder: " + newPath, "info");
        return newPath;
      });
    });
  });

  return chain;
}

// ── Main import routine ──────────────────────────────────────
function startImport() {
  if (!graphqlEndpoint) {
    addLog("Error: GraphQL endpoint is not configured.", "error");
    return;
  }
  if (!repositoryId) {
    addLog("Error: Repository identifier is not configured.", "error");
    return;
  }
  if (!parentFolderPath) {
    addLog("Error: Parent folder path is not configured.", "error");
    return;
  }
  if (fileQueue.length === 0) return;

  isImporting = true;
  importBtn.disabled = true;
  clearBtn.disabled = true;
  folderCache = {};

  var total = fileQueue.length;
  var done  = 0;
  var errors = 0;

  addLog("Starting import of " + total + " file(s)…", "info");
  updateProgress(0, total, "Preparing…");

  // Process sequentially to avoid overwhelming the server
  var chain = Promise.resolve();

  fileQueue.forEach(function(entry, idx) {
    chain = chain.then(function() {
      setItemStatus(idx, "uploading", "Uploading…");
      updateProgress(done, total, "Uploading: " + entry.file.name);

      // Determine target folder
      var dirPath = entry.relativePath.includes("/")
        ? entry.relativePath.substring(0, entry.relativePath.lastIndexOf("/"))
        : "";

      return ensureFolderPath(dirPath)
        .then(function(targetFolderPath) {
          return gqlImportDocument(entry.file, targetFolderPath);
        })
        .then(function(doc) {
          done++;
          setItemStatus(idx, "success", "✓ Done");
          addLog("Imported: " + entry.relativePath + " (ID: " + doc.id + ")", "success");
          updateProgress(done, total);
        })
        .catch(function(err) {
          errors++;
          done++;
          setItemStatus(idx, "error", "✗ Failed");
          addLog("Failed: " + entry.relativePath + " — " + err.message, "error");
          updateProgress(done, total);
        });
    });
  });

  chain.then(function() {
    isImporting = false;
    clearBtn.disabled = false;
    var summary = "Import complete: " + (total - errors) + " succeeded, " + errors + " failed.";
    statusText.textContent = summary;
    addLog(summary, errors > 0 ? "warning" : "success");

    // Fire BAW event
    var result = {
      total: total,
      succeeded: total - errors,
      failed: errors,
      repositoryIdentifier: repositoryId,
      parentFolderPath: parentFolderPath
    };
    if (errors > 0) {
      this.executeEventHandlingFunction(this, "onImportError", result);
    } else {
      this.executeEventHandlingFunction(this, "onImportComplete", result);
    }
  }.bind(this));
}

// ── Drag-and-drop event listeners ────────────────────────────
dropzone.addEventListener("dragenter", function(e) {
  e.preventDefault();
  e.stopPropagation();
  dropzone.classList.add("fnimport-drag-over");
});

dropzone.addEventListener("dragover", function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = "copy";
  dropzone.classList.add("fnimport-drag-over");
});

dropzone.addEventListener("dragleave", function(e) {
  e.preventDefault();
  e.stopPropagation();
  // Only remove if leaving the dropzone entirely
  if (!dropzone.contains(e.relatedTarget)) {
    dropzone.classList.remove("fnimport-drag-over");
  }
});

dropzone.addEventListener("drop", function(e) {
  e.preventDefault();
  e.stopPropagation();
  dropzone.classList.remove("fnimport-drag-over");
  if (isImporting) return;

  var items = e.dataTransfer.items;
  if (items && items.length > 0) {
    processDataTransferItems(items);
  } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    // Fallback for browsers without DataTransferItem API
    Array.prototype.forEach.call(e.dataTransfer.files, function(file) {
      addFileToQueue(file, file.name);
    });
    renderQueue();
    refreshImportButton();
  }
});

// Keyboard accessibility for dropzone
dropzone.addEventListener("keydown", function(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

// ── Browse button ────────────────────────────────────────────
browseBtn.addEventListener("click", function(e) {
  e.stopPropagation();
  fileInput.click();
});

fileInput.addEventListener("change", function() {
  if (!fileInput.files || fileInput.files.length === 0) return;
  Array.prototype.forEach.call(fileInput.files, function(file) {
    // Use webkitRelativePath if available (folder selection), otherwise just file name
    var relativePath = file.webkitRelativePath || file.name;
    addFileToQueue(file, relativePath);
  });
  renderQueue();
  refreshImportButton();
  fileInput.value = ""; // Reset so same file can be re-added
});

// ── Import button ────────────────────────────────────────────
importBtn.addEventListener("click", function() {
  startImport.call(this);
}.bind(this));

// ── Clear button ─────────────────────────────────────────────
clearBtn.addEventListener("click", function() {
  if (isImporting) return;
  fileQueue = [];
  folderCache = {};
  queueEl.innerHTML = "";
  logEl.innerHTML = "";
  statusBar.classList.remove("fnimport-visible");
  progressFill.style.width = "0%";
  refreshImportButton();
});

// ── Initial state ────────────────────────────────────────────
refreshImportButton();

// Made with Bob