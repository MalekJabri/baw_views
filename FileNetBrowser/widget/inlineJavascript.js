// ============================================================
// FileNetBrowser Widget — Inline JavaScript
// IBM BAW Coach View Widget
// Handles browsing FileNet folders and documents via GraphQL API
// ============================================================

// ── Configuration from options ──────────────────────────────
_this = this;
var graphqlEndpoint    = this.getOption("graphqlEndpoint") || "";
var repositoryId       = this.getOption("repositoryIdentifier") || "";
var rootFolderPath     = this.getOption("rootFolderPath") || "/";
var showDocumentDetails= this.getOption("showDocumentDetails") !== false;
var allowMultiSelect   = this.getOption("allowMultiSelect") || false;
var showBreadcrumb     = this.getOption("showBreadcrumb") !== false;
var pageSize           = this.getOption("pageSize") || 50;
var showPagination     = this.getOption("showPagination") !== false;

// ── DOM references ───────────────────────────────────────────
var root              = this.context.element.querySelector(".fnbrowser-widget");
var breadcrumbNav     = root.querySelector(".fnbrowser-breadcrumb");
var breadcrumbList    = root.querySelector(".fnbrowser-breadcrumb-list");
var treeContainer     = root.querySelector(".fnbrowser-tree-container");
var refreshBtn        = root.querySelector(".fnbrowser-refresh-btn");
var navBackBtn        = root.querySelector(".fnbrowser-nav-back");
var navForwardBtn     = root.querySelector(".fnbrowser-nav-forward");
var navUpBtn          = root.querySelector(".fnbrowser-nav-up");
var viewListBtn       = root.querySelector(".fnbrowser-view-list");
var viewGridBtn       = root.querySelector(".fnbrowser-view-grid");
var currentPathEl     = root.querySelector(".fnbrowser-path-text");
var contentList       = root.querySelector(".fnbrowser-content-list");
var loadingEl         = root.querySelector(".fnbrowser-loading");
var emptyEl           = root.querySelector(".fnbrowser-empty");
var errorEl           = root.querySelector(".fnbrowser-error");
var errorText         = root.querySelector(".fnbrowser-error-text");
var retryBtn          = root.querySelector(".fnbrowser-retry-btn");
var selectionBar      = root.querySelector(".fnbrowser-selection-bar");
var selectionText     = root.querySelector(".fnbrowser-selection-text");
var clearSelectionBtn = root.querySelector(".fnbrowser-clear-selection-btn");
var paginationEl      = root.querySelector(".fnbrowser-pagination");
var pageStartEl       = root.querySelector(".fnbrowser-page-start");
var pageEndEl         = root.querySelector(".fnbrowser-page-end");
var totalItemsEl      = root.querySelector(".fnbrowser-total-items");
var currentPageEl     = root.querySelector(".fnbrowser-current-page");
var totalPagesEl      = root.querySelector(".fnbrowser-total-pages");
var pageFirstBtn      = root.querySelector(".fnbrowser-page-first");
var pagePrevBtn       = root.querySelector(".fnbrowser-page-prev");
var pageNextBtn       = root.querySelector(".fnbrowser-page-next");
var pageLastBtn       = root.querySelector(".fnbrowser-page-last");

// ── Widget state ─────────────────────────────────────────────
var currentPath       = rootFolderPath;
var currentFolderId   = null; // Current folder ID
var navigationHistory = [rootFolderPath];
var currentPage       = 1;
var totalDocuments    = 0;
var allDocuments      = []; // All documents for current folder
var allFolders        = []; // All folders for current folder
var historyIndex      = 0;
var selectedItems     = [];
var currentViewMode   = "list"; // "list" or "grid"
var folderCache       = {}; // Cache folder contents: path -> { folders: [], documents: [], folderId: "" }
var draggedItem       = null; // Currently dragged item
var draggedItemType   = null; // "folder" or "document"

// ── Register BAW event handlers ──────────────────────────────
this.registerEventHandlingFunction(this, "onFolderSelected", "data");
this.registerEventHandlingFunction(this, "onDocumentSelected", "data");
this.registerEventHandlingFunction(this, "onNavigate", "data");

// ── Apply configuration ──────────────────────────────────────
if (!showBreadcrumb) {
  breadcrumbNav.style.display = "none";
}

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
    "      }",
    "      pageInfo {",
    "        totalCount",
    "      }",
    "    }",
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
        path: folderPath
      }
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }
    if (!json.data || !json.data.folder) {
      throw new Error("Folder not found: " + folderPath);
    }
    return {
      folderId: json.data.folder.id,
      folders: (json.data.folder.subFolders && json.data.folder.subFolders.folders) || [],
      documents: (json.data.folder.containedDocuments && json.data.folder.containedDocuments.documents) || []
    };
  });
}

// ── GraphQL: Query single folder info ───────────────────────
function queryFolderInfo(folderPath) {
  var query = [
    "query GetFolder($repoId: String!, $path: String!) {",
    "  folder(repositoryIdentifier: $repoId, identifier: $path) {",
    "    id",
    "    name",
    "    pathName",
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
        path: folderPath
      }
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }
    return json.data.folder;
  });
}
// ── GraphQL: File document mutation ──────────────────────────
function fileDocument(documentId, targetFolderPath) {
  var mutation = [
    "mutation FileDocument($repoId: String!, $docId: String!, $folderId: String!) {",
    "  fileDocument(",
    "    repositoryIdentifier: $repoId",
    "    identifier: $docId",
    "    folderIdentifier: $folderId",
    "  ) {",
    "    id",
    "  }",
    "}"
  ].join("\n");

  return fetch(graphqlEndpoint, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: {
        repoId: repositoryId,
        docId: documentId,
        folderId: targetFolderPath
      }
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }
    return json.data.fileDocument;
  });
}

// ── GraphQL: Get referential containment relationship ────────
function getReferentialContainmentRelationship(documentId, sourceFolderId) {
  var query = [
    "query GetContainmentRelationship($repoId: String!, $docId: String!) {",
    "  document(repositoryIdentifier: $repoId, identifier: $docId) {",
    "    id",
    "    containers {",
    "      referentialContainmentRelationships {",
    "        id",
    "        containmentName",
    "        head {",
    "          id",
    "        }",
    "        tail {",
    "          id",
    "        }",
    "      }",
    "    }",
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
    
    var doc = json.data.document;
    if (!doc || !doc.containers || !doc.containers.referentialContainmentRelationships) {
      throw new Error("No containment relationships found for document");
    }
    
    // Find the relationship for the source folder
    // tail = folder, head = document
    var relationships = doc.containers.referentialContainmentRelationships;
    var relationship = relationships.find(function(rel) {
      return rel.tail.id === sourceFolderId;
    });
    
    if (!relationship) {
      throw new Error("Containment relationship not found for source folder");
    }
    
    return relationship.id;
  });
}

// ── GraphQL: Unfile document mutation ────────────────────────
function unfileDocument(relationshipId) {
  var mutation = [
    "mutation UnfileDocument($repoId: String!, $identifier: String!) {",
    "  deleteReferentialContainmentRelationship(",
    "    repositoryIdentifier: $repoId",
    "    identifier: $identifier",
    "  ) {",
    "    id",
    "  }",
    "}"
  ].join("\n");

  return fetch(graphqlEndpoint, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: {
        repoId: repositoryId,
        identifier: relationshipId
      }
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }
    return json.data.deleteReferentialContainmentRelationship;
  });
}

// ── Drag and Drop: Move document ─────────────────────────────
function moveDocument(documentId, documentName, sourceFolderId, targetPath) {
  if (!sourceFolderId) {
    return Promise.reject(new Error("Source folder ID not available"));
  }

  showLoading();
  
  // First get the referential containment relationship, then unfile, then file to target
  return getReferentialContainmentRelationship(documentId, sourceFolderId)
    .then(function(relationshipId) {
      return unfileDocument(relationshipId);
    })
    .then(function() {
      return fileDocument(documentId, targetPath);
    })
    .then(function() {
      // Clear cache for both folders
      delete folderCache[currentPath];
      delete folderCache[targetPath];
      
      // Reload current folder
      loadFolderContents(currentPath);
      
      return { success: true, message: "Document moved successfully" };
    })
    .catch(function(err) {
      showError("Failed to move document: " + err.message);
      throw err;
    });
}


// ── UI: Show loading state ───────────────────────────────────
function showLoading() {
  contentList.style.display = "none";
  emptyEl.classList.remove("visible");
  errorEl.classList.remove("visible");
  loadingEl.classList.add("visible");
}

// ── UI: Show error state ─────────────────────────────────────
function showError(message) {
  contentList.style.display = "none";
  emptyEl.classList.remove("visible");
  loadingEl.classList.remove("visible");
  errorText.textContent = message;
  errorEl.classList.add("visible");
}

// ── UI: Show empty state ─────────────────────────────────────
function showEmpty() {
  contentList.innerHTML = "";
  contentList.style.display = "none";
  loadingEl.classList.remove("visible");
  errorEl.classList.remove("visible");
  emptyEl.classList.add("visible");
}

// ── UI: Show content ─────────────────────────────────────────
function showContent() {
  loadingEl.classList.remove("visible");
  errorEl.classList.remove("visible");
  emptyEl.classList.remove("visible");
  contentList.style.display = currentViewMode === "grid" ? "grid" : "block";
}

// ── UI: Update breadcrumb ────────────────────────────────────
function updateBreadcrumb() {
  if (!showBreadcrumb) return;
  
  breadcrumbList.innerHTML = "";
  
  // Get segments relative to root folder path
  var rootSegments = rootFolderPath.split("/").filter(function(s) { return s.length > 0; });
  var currentSegments = currentPath.split("/").filter(function(s) { return s.length > 0; });
  
  // Find segments that are beyond the root folder path
  var relativeSegments = [];
  for (var i = rootSegments.length; i < currentSegments.length; i++) {
    relativeSegments.push(currentSegments[i]);
  }
  
  // Root item (configured root folder)
  var rootItem = document.createElement("li");
  rootItem.className = "fnbrowser-breadcrumb-item";
  rootItem.setAttribute("role", "listitem");
  
  var rootLink = document.createElement("a");
  rootLink.className = "fnbrowser-breadcrumb-link";
  rootLink.textContent = rootSegments[rootSegments.length - 1] || "Root";
  rootLink.href = "#";
  rootLink.setAttribute("data-path", rootFolderPath);
  rootLink.addEventListener("click", function(e) {
    e.preventDefault();
    navigateToFolder(rootFolderPath);
  });
  
  rootItem.appendChild(rootLink);
  breadcrumbList.appendChild(rootItem);
  
  // Path segments relative to root
  var builtPath = rootFolderPath;
  relativeSegments.forEach(function(segment, idx) {
    builtPath += "/" + segment;
    
    var separator = document.createElement("li");
    separator.className = "fnbrowser-breadcrumb-separator";
    separator.setAttribute("role", "presentation");
    separator.setAttribute("aria-hidden", "true");
    separator.textContent = "›";
    breadcrumbList.appendChild(separator);
    
    var item = document.createElement("li");
    item.className = "fnbrowser-breadcrumb-item";
    item.setAttribute("role", "listitem");
    
    if (idx === relativeSegments.length - 1) {
      // Current folder
      var current = document.createElement("span");
      current.className = "fnbrowser-breadcrumb-current";
      current.textContent = segment;
      item.appendChild(current);
    } else {
      // Navigable folder
      var link = document.createElement("a");
      link.className = "fnbrowser-breadcrumb-link";
      link.textContent = segment;
      link.href = "#";
      link.setAttribute("data-path", builtPath);
      (function(path) {
        link.addEventListener("click", function(e) {
          e.preventDefault();
          navigateToFolder(path);
        });
      })(builtPath);
      item.appendChild(link);
    }
    
    breadcrumbList.appendChild(item);
  });
}

// ── UI: Update pagination ────────────────────────────────────
function updatePagination() {
  if (!showPagination || pageSize === 0 || totalDocuments === 0) {
    paginationEl.classList.remove("visible");
    return;
  }
  
  var totalPages = Math.ceil(totalDocuments / pageSize);
  
  if (totalPages <= 1) {
    paginationEl.classList.remove("visible");
    return;
  }
  
  paginationEl.classList.add("visible");
  
  var start = ((currentPage - 1) * pageSize) + 1;
  var end = Math.min(currentPage * pageSize, totalDocuments);
  
  pageStartEl.textContent = start;
  pageEndEl.textContent = end;
  totalItemsEl.textContent = totalDocuments;
  currentPageEl.textContent = currentPage;
  totalPagesEl.textContent = totalPages;
  
  // Update button states
  pageFirstBtn.disabled = currentPage === 1;
  pagePrevBtn.disabled = currentPage === 1;
  pageNextBtn.disabled = currentPage === totalPages;
  pageLastBtn.disabled = currentPage === totalPages;
}

// ── Pagination: Go to page ───────────────────────────────────
function goToPage(page) {
  var totalPages = Math.ceil(totalDocuments / pageSize);
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderContentList(allFolders, allDocuments);
  updatePagination();
}

// ── UI: Update navigation buttons ────────────────────────────
function updateNavigationButtons() {
  navBackBtn.disabled = historyIndex <= 0;
  navForwardBtn.disabled = historyIndex >= navigationHistory.length - 1;
  navUpBtn.disabled = currentPath === "/" || currentPath === rootFolderPath;
}

// ── UI: Render content list ──────────────────────────────────
function renderContentList(folders, documents) {
  contentList.innerHTML = "";
  
  // Store all folders and documents for pagination
  allFolders = folders;
  allDocuments = documents;
  
  if (folders.length === 0 && documents.length === 0) {
    showEmpty();
    paginationEl.classList.remove("visible");
    return;
  }
  
  showContent();
  
  // Combine folders and documents for unified pagination
  var allItems = [];
  
  // Add folders first
  allFolders.forEach(function(folder) {
    allItems.push({ type: "folder", data: folder });
  });
  
  // Add documents
  allDocuments.forEach(function(doc) {
    allItems.push({ type: "document", data: doc });
  });
  
  // Store total count for pagination
  totalDocuments = allItems.length;
  
  // Apply pagination to all items
  var paginatedItems = allItems;
  if (showPagination && pageSize > 0 && allItems.length > pageSize) {
    var start = (currentPage - 1) * pageSize;
    var end = start + pageSize;
    paginatedItems = allItems.slice(start, end);
  }
  
  // Render paginated items
  paginatedItems.forEach(function(item) {
    var element = createContentItem(item.type, item.data);
    contentList.appendChild(element);
  });
  
  // Update pagination controls
  updatePagination();
}

// ── UI: Create content item ──────────────────────────────────
function createContentItem(type, data) {
  var item = document.createElement("div");
  item.className = "fnbrowser-item";
  item.setAttribute("role", "listitem");
  item.setAttribute("tabindex", "0");
  item.setAttribute("data-type", type);
  item.setAttribute("data-id", data.id);
  item.setAttribute("data-name", data.name);
  if (type === "folder") {
    item.setAttribute("data-path", data.pathName);
  }
  
  // Icon
  var icon = document.createElement("div");
  icon.className = "fnbrowser-item-icon " + type;
  icon.setAttribute("aria-hidden", "true");
  
  // Info container
  var info = document.createElement("div");
  info.className = "fnbrowser-item-info";
  
  // Name
  var name = document.createElement("div");
  name.className = "fnbrowser-item-name";
  name.textContent = data.name;
  info.appendChild(name);
  
  // Metadata
  if (showDocumentDetails && type === "document") {
    var meta = document.createElement("div");
    meta.className = "fnbrowser-item-meta";
    
    if (data.majorVersionNumber !== undefined) {
      var version = document.createElement("span");
      version.className = "fnbrowser-item-version";
      version.textContent = formatVersion(data.majorVersionNumber, data.minorVersionNumber);
      meta.appendChild(version);
    }
    
    if (data.contentSize) {
      var size = document.createElement("span");
      size.className = "fnbrowser-item-size";
      size.textContent = formatBytes(data.contentSize);
      meta.appendChild(size);
    }
    
    info.appendChild(meta);
  }
  
  item.appendChild(icon);
  item.appendChild(info);
  
  // Event handlers
  item.addEventListener("click", function(e) {
    handleItemClick(item, type, data, e);
  });
  
  item.addEventListener("dblclick", function(e) {
    handleItemDoubleClick(item, type, data, e);
  });
  
  item.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      handleItemDoubleClick(item, type, data, e);
    }
  });
  
  // Drag and drop handlers
  if (type === "document") {
    // Make documents draggable
    item.setAttribute("draggable", "true");
    
    item.addEventListener("dragstart", function(e) {
      draggedItem = data;
      draggedItemType = type;
      item.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", data.id);
    });
    
    item.addEventListener("dragend", function(e) {
      item.classList.remove("dragging");
      draggedItem = null;
      draggedItemType = null;
      // Remove all drag-over classes
      var allItems = contentList.querySelectorAll(".fnbrowser-item");
      allItems.forEach(function(el) {
        el.classList.remove("drag-over");
      });
    });
  }
  
  if (type === "folder") {
    // Make folders drop targets
    item.addEventListener("dragover", function(e) {
      if (draggedItemType === "document") {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        item.classList.add("drag-over");
      }
    });
    
    item.addEventListener("dragleave", function(e) {
      item.classList.remove("drag-over");
    });
    
    item.addEventListener("drop", function(e) {
      e.preventDefault();
      item.classList.remove("drag-over");
      
      if (draggedItem && draggedItemType === "document" && currentFolderId) {
        var targetFolderPath = data.pathName;
        moveDocument(draggedItem.id, draggedItem.name, currentFolderId, targetFolderPath)
          .then(function(result) {
            console.log("Document moved successfully");
          })
          .catch(function(err) {
            console.error("Failed to move document:", err);
          });
      }
    });
  }
  
  return item;
}

// ── Handle item click ────────────────────────────────────────
function handleItemClick(item, type, data, event) {
  if (allowMultiSelect && (event.ctrlKey || event.metaKey)) {
    // Toggle selection
    toggleItemSelection(item, type, data);
  } else {
    // Single selection
    clearSelection();
    selectItem(item, type, data);
  }
}

// ── Handle item double-click ─────────────────────────────────
function handleItemDoubleClick(item, type, data, event) {
  event.preventDefault();
  
  if (type === "folder") {
    navigateToFolder(data.pathName);
  } else {
    // Fire document selected event
    _this.executeEventHandlingFunction(this, "onDocumentSelected", {
      type: "document",
      id: data.id,
      name: data.name,
      version: formatVersion(data.majorVersionNumber, data.minorVersionNumber)
    });
  }
}

// ── Selection management ─────────────────────────────────────
function selectItem(item, type, data) {
  item.classList.add("selected");
  selectedItems.push({
    element: item,
    type: type,
    data: data
  });
  updateSelectionBar();
  
  // Fire selection event
  var eventData = {
    type: type,
    id: data.id,
    name: data.name
  };
  
  if (type === "folder") {
    eventData.pathName = data.pathName;
    _this.executeEventHandlingFunction(this, "onFolderSelected", eventData);
  } else {
    eventData.version = formatVersion(data.majorVersionNumber, data.minorVersionNumber);
    _this.executeEventHandlingFunction(this, "onDocumentSelected", eventData);
  }
}

function toggleItemSelection(item, type, data) {
  var index = -1;
  for (var i = 0; i < selectedItems.length; i++) {
    if (selectedItems[i].element === item) {
      index = i;
      break;
    }
  }
  
  if (index >= 0) {
    // Deselect
    item.classList.remove("selected");
    selectedItems.splice(index, 1);
  } else {
    // Select
    selectItem.call(this, item, type, data);
  }
  
  updateSelectionBar();
}

function clearSelection() {
  selectedItems.forEach(function(item) {
    item.element.classList.remove("selected");
  });
  selectedItems = [];
  updateSelectionBar();
}

function updateSelectionBar() {
  if (selectedItems.length === 0) {
    selectionBar.classList.remove("visible");
    selectionText.textContent = "No items selected";
  } else {
    selectionBar.classList.add("visible");
    var text = selectedItems.length === 1
      ? "1 item selected"
      : selectedItems.length + " items selected";
    selectionText.textContent = text;
  }
}

// ── Navigation ───────────────────────────────────────────────
function navigateToFolder(folderPath) {
  // Clear selection when navigating
  clearSelection();
  
  // Reset pagination
  currentPage = 1;
  
  // Update history
  if (folderPath !== currentPath) {
    // Remove forward history if we're not at the end
    if (historyIndex < navigationHistory.length - 1) {
      navigationHistory = navigationHistory.slice(0, historyIndex + 1);
    }
    navigationHistory.push(folderPath);
    historyIndex = navigationHistory.length - 1;
  }
  
  currentPath = folderPath;
  currentPathEl.textContent = folderPath;
  
  updateBreadcrumb();
  updateNavigationButtons();
  loadFolderContents(folderPath);
  
  // Fire navigation event
  _this.executeEventHandlingFunction(this, "onNavigate", {
    pathName: folderPath
  });
}

function navigateBack() {
  if (historyIndex > 0) {
    historyIndex--;
    currentPath = navigationHistory[historyIndex];
    currentPathEl.textContent = currentPath;
    currentPage = 1; // Reset pagination
    updateBreadcrumb();
    updateNavigationButtons();
    loadFolderContents(currentPath);
    
    _this.executeEventHandlingFunction(this, "onNavigate", {
      pathName: currentPath
    });
  }
}

function navigateForward() {
  if (historyIndex < navigationHistory.length - 1) {
    historyIndex++;
    currentPath = navigationHistory[historyIndex];
    currentPathEl.textContent = currentPath;
    currentPage = 1; // Reset pagination
    updateBreadcrumb();
    updateNavigationButtons();
    loadFolderContents(currentPath);
    
    _this.executeEventHandlingFunction(this, "onNavigate", {
      pathName: currentPath
    });
  }
}

function navigateUp() {
  if (currentPath === "/" || currentPath === rootFolderPath) return;
  
  var segments = currentPath.split("/").filter(function(s) { return s.length > 0; });
  segments.pop();
  var parentPath = segments.length > 0 ? "/" + segments.join("/") : "/";
  navigateToFolder.call(this, parentPath);
}

// ── Load folder contents ─────────────────────────────────────
function loadFolderContents(folderPath) {
  showLoading();
  
  // Check cache first
  if (folderCache[folderPath]) {
    var cached = folderCache[folderPath];
    currentFolderId = cached.folderId;
    renderContentList(cached.folders, cached.documents);
    return;
  }
  
  queryFolderContents(folderPath)
    .then(function(result) {
      folderCache[folderPath] = result;
      currentFolderId = result.folderId;
      renderContentList(result.folders, result.documents);
    })
    .catch(function(err) {
      showError(err.message || "Failed to load folder contents");
    });
}

// ── Build folder tree ────────────────────────────────────────
function buildFolderTree(folderPath, level) {
  level = level || 0;
  
  return queryFolderContents(folderPath)
    .then(function(result) {
      var node = document.createElement("div");
      node.className = "fnbrowser-tree-node";
      node.setAttribute("data-level", level);
      node.setAttribute("data-path", folderPath);
      
      var header = document.createElement("div");
      header.className = "fnbrowser-tree-node-header";
      header.setAttribute("tabindex", "0");
      header.setAttribute("role", "treeitem");
      header.setAttribute("aria-expanded", "false");
      
      var toggle = null;
      if (result.folders.length > 0) {
        toggle = document.createElement("div");
        toggle.className = "fnbrowser-tree-toggle";
        var toggleIcon = document.createElement("div");
        toggleIcon.className = "fnbrowser-tree-toggle-icon";
        toggle.appendChild(toggleIcon);
        header.appendChild(toggle);
      } else {
        var spacer = document.createElement("div");
        spacer.style.width = "16px";
        header.appendChild(spacer);
      }
      
      var icon = document.createElement("div");
      icon.className = "fnbrowser-tree-icon";
      icon.setAttribute("aria-hidden", "true");
      
      var label = document.createElement("div");
      label.className = "fnbrowser-tree-label";
      label.textContent = folderPath === "/" ? "Root" : folderPath.split("/").pop();
      
      header.appendChild(icon);
      header.appendChild(label);
      
      // Toggle click handler (for expand/collapse)
      if (toggle) {
        toggle.addEventListener("click", function(e) {
          e.stopPropagation();
          
          var children = node.querySelector(".fnbrowser-tree-children");
          if (children) {
            var isExpanded = children.classList.contains("expanded");
            
            if (!isExpanded && children.children.length === 0) {
              // Lazy load children on first expand
              result.folders.forEach(function(folder) {
                buildFolderTree.call(this, folder.pathName, level + 1)
                  .then(function(childNode) {
                    children.appendChild(childNode);
                  })
                  .catch(function(err) {
                    console.error("Failed to load folder:", folder.pathName, err);
                  });
              }.bind(this));
            }
            
            children.classList.toggle("expanded");
            toggle.classList.toggle("expanded");
            header.setAttribute("aria-expanded", !isExpanded);
          }
        }.bind(this));
      }
      
      // Header click handler (for navigation)
      header.addEventListener("click", function(e) {
        e.stopPropagation();
        navigateToFolder.call(this, folderPath);
        
        // Update active state
        var allHeaders = treeContainer.querySelectorAll(".fnbrowser-tree-node-header");
        allHeaders.forEach(function(h) { h.classList.remove("active"); });
        header.classList.add("active");
      }.bind(this));
      
      // Drag and drop handlers for tree nodes
      header.addEventListener("dragover", function(e) {
        if (draggedItemType === "document") {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          header.classList.add("drag-over");
        }
      });
      
      header.addEventListener("dragleave", function(e) {
        header.classList.remove("drag-over");
      });
      
      header.addEventListener("drop", function(e) {
        e.preventDefault();
        header.classList.remove("drag-over");
        
        if (draggedItem && draggedItemType === "document" && currentFolderId) {
          var targetFolderPath = folderPath;
          moveDocument(draggedItem.id, draggedItem.name, currentFolderId, targetFolderPath)
            .then(function(result) {
              console.log("Document moved successfully to tree folder");
            })
            .catch(function(err) {
              console.error("Failed to move document:", err);
            });
        }
      });
      
      node.appendChild(header);
      
      // Children container (lazy load on expand)
      if (result.folders.length > 0) {
        var children = document.createElement("div");
        children.className = "fnbrowser-tree-children";
        node.appendChild(children);
      }
      
      return node;
    });
}

// ── Initialize tree ──────────────────────────────────────────
function initializeTree() {
  treeContainer.innerHTML = "";
  buildFolderTree.call(this, rootFolderPath, 0)
    .then(function(rootNode) {
      treeContainer.appendChild(rootNode);
      // Auto-expand root
      var header = rootNode.querySelector(".fnbrowser-tree-node-header");
      if (header) {
        header.click();
      }
    })
    .catch(function(err) {
      console.error("Failed to initialize tree:", err);
    });
}

// ── View mode toggle ─────────────────────────────────────────
function setViewMode(mode) {
  currentViewMode = mode;
  
  if (mode === "grid") {
    contentList.classList.add("grid-view");
    viewListBtn.classList.remove("active");
    viewListBtn.setAttribute("aria-checked", "false");
    viewGridBtn.classList.add("active");
    viewGridBtn.setAttribute("aria-checked", "true");
  } else {
    contentList.classList.remove("grid-view");
    viewListBtn.classList.add("active");
    viewListBtn.setAttribute("aria-checked", "true");
    viewGridBtn.classList.remove("active");
    viewGridBtn.setAttribute("aria-checked", "false");
  }
}

// ── Event listeners ──────────────────────────────────────────
refreshBtn.addEventListener("click", function() {
  folderCache = {};
  initializeTree.call(this);
  loadFolderContents(currentPath);
}.bind(this));

navBackBtn.addEventListener("click", function() {
  navigateBack.call(this);
}.bind(this));

navForwardBtn.addEventListener("click", function() {
  navigateForward.call(this);
}.bind(this));

navUpBtn.addEventListener("click", function() {
  navigateUp.call(this);
}.bind(this));

viewListBtn.addEventListener("click", function() {
  setViewMode("list");
});

viewGridBtn.addEventListener("click", function() {
  setViewMode("grid");
});

retryBtn.addEventListener("click", function() {
  loadFolderContents(currentPath);
});

clearSelectionBtn.addEventListener("click", function() {
  clearSelection();
});

// Pagination button listeners
pageFirstBtn.addEventListener("click", function() {
  goToPage(1);
});

pagePrevBtn.addEventListener("click", function() {
  goToPage(currentPage - 1);
});

pageNextBtn.addEventListener("click", function() {
  goToPage(currentPage + 1);
});

pageLastBtn.addEventListener("click", function() {
  var totalPages = Math.ceil(totalDocuments / pageSize);
  goToPage(totalPages);
});

// ── Initialize widget ────────────────────────────────────────
if (!graphqlEndpoint) {
  showError("GraphQL endpoint is not configured");
} else if (!repositoryId) {
  showError("Repository identifier is not configured");
} else {
  initializeTree.call(this);
  navigateToFolder.call(this, rootFolderPath);
}

// Made with Bob