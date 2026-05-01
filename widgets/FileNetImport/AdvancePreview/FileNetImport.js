/*************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-I23
 * Copyright IBM Corp. 2019, 2020. All Rights Reserved.
 * U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *************************************************************************/
/*
 * #BEGIN COPYRIGHT
 *
 * Licensed Materials - Property of IBM
 * 5725-C95
 * Copyright IBM Corp. 2019 - 2022. All Rights Reserved.
 * U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *
 * #END COPYRIGHT
 */

// ── Sample data for the designer preview ────────────────────
var PREVIEW_QUEUE = [
  { type: "file",   name: "annual-report.pdf",    path: "",                    size: "1.2 MB",  status: "success" },
  { type: "file",   name: "contract.docx",         path: "",                    size: "340 KB",  status: "success" },
  { type: "file",   name: "architecture.png",      path: "ProjectA/diagrams",   size: "820 KB",  status: "pending" },
  { type: "file",   name: "spec.pdf",              path: "ProjectA/docs",       size: "2.1 MB",  status: "pending" },
  { type: "file",   name: "README.md",             path: "ProjectA",            size: "4 KB",    status: "error"   }
];

var PREVIEW_LOG = [
  { type: "success", msg: "✓ Imported: annual-report.pdf (ID: {C3D4E5F6-...})" },
  { type: "success", msg: "✓ Imported: contract.docx (ID: {D4E5F6A7-...})" },
  { type: "info",    msg: "ℹ Created folder: ProjectA" },
  { type: "info",    msg: "ℹ Created folder: ProjectA/docs" },
  { type: "info",    msg: "ℹ Created folder: ProjectA/diagrams" },
  { type: "error",   msg: "✗ Failed: ProjectA/README.md — Unsupported content type" }
];

var mixObject = {

  createPreview: function(containingDiv, labelText, callback) {
    var bpmextUri = this.context.getManagedAssetUrl(
      "BPMExt-Core-Designer.js",
      this.context.assetType_WEB,
      "SYSBPMUI"
    );

    require(
      ["dojo/dom-construct", "dojo/dom-class", "dojo/dom-attr", bpmextUri],
      this.lang.hitch(this, function(domConstruct, domClass, domAttr, bpmext) {

        bpmext.uidesign.css.ensureSparkUIClass(containingDiv);
        bpmext.uidesign.css.ensureGlyphsLoaded(this);

        this.context.coachViewData.containingDiv = containingDiv;

        // Generate unique temp ID
        var tempID;
        while (true) {
          tempID = dojox.uuid.generateRandomUuid();
          if (containingDiv.querySelector("div[data-temp-id='" + tempID + "']") == null) break;
        }
        containingDiv.setAttribute("data-temp-id", encodeURIComponent(tempID));
        domClass.add(containingDiv, "WYSIWYGContentList");

        // Default width
        this.context.coachViewData.defaultWidth = "100%";

        // ── Build preview queue ──────────────────────────────
        var queueEl = containingDiv.querySelector("#fnimport-preview-queue");
        if (queueEl) {
          this._buildPreviewQueue(domConstruct, queueEl);
        }

        // ── Build preview log ────────────────────────────────
        var logEl = containingDiv.querySelector("#fnimport-preview-log");
        if (logEl) {
          this._buildPreviewLog(domConstruct, logEl);
        }

        // ── Label handler ────────────────────────────────────
        var labelDom = containingDiv.querySelector(".fnimport-preview-wrap");
        this.context.coachViewData.label = labelDom;
        this.context.coachViewData.labelTextDom = document.createTextNode(labelText || "FileNet Import");
        this.context.coachViewData.labelHandler = bpmext.uidesign.createLabelHandler(
          this.context.coachViewData.labelTextDom,
          undefined,
          containingDiv,
          false,
          true
        );

        callback();
      })
    );
  },

  // ── Build sample queue items ─────────────────────────────
  _buildPreviewQueue: function(domConstruct, queueEl) {
    var self = this;

    // Group by top-level folder
    var groups  = {};
    var rootFiles = [];

    PREVIEW_QUEUE.forEach(function(item) {
      if (item.path) {
        var top = item.path.split("/")[0];
        if (!groups[top]) groups[top] = [];
        groups[top].push(item);
      } else {
        rootFiles.push(item);
      }
    });

    // Root-level files
    rootFiles.forEach(function(item) {
      self._appendQueueItem(domConstruct, queueEl, item);
    });

    // Grouped folders
    Object.keys(groups).forEach(function(folderName) {
      var header = domConstruct.create("div", {
        className: "fnimport-preview-folder-header"
      }, queueEl);
      header.textContent = "📁 " + folderName + " (" + groups[folderName].length + " files)";

      groups[folderName].forEach(function(item) {
        self._appendQueueItem(domConstruct, queueEl, item);
      });
    });
  },

  _appendQueueItem: function(domConstruct, queueEl, item) {
    var row = domConstruct.create("div", {
      className: "fnimport-preview-queue-item"
    }, queueEl);

    // Icon
    var iconClass = item.type === "folder"
      ? "fnimport-preview-item-icon fnimport-preview-icon-folder"
      : "fnimport-preview-item-icon fnimport-preview-icon-document";
    domConstruct.create("span", { className: iconClass }, row);

    // Path info
    var pathDiv = domConstruct.create("div", { className: "fnimport-preview-item-path" }, row);
    if (item.path) {
      var prefix = domConstruct.create("span", {
        className: "fnimport-preview-item-folder-prefix"
      }, pathDiv);
      prefix.textContent = "📁 " + item.path;
    }
    var nameSpan = domConstruct.create("span", {
      className: "fnimport-preview-item-name"
    }, pathDiv);
    nameSpan.textContent = item.name;

    // Size
    var sizeSpan = domConstruct.create("span", {
      className: "fnimport-preview-item-size"
    }, row);
    sizeSpan.textContent = item.size;

    // Status badge
    var badgeClass = "fnimport-preview-badge fnimport-preview-badge-" + item.status;
    var badge = domConstruct.create("span", { className: badgeClass }, row);
    var badgeLabels = { pending: "Pending", success: "✓ Done", error: "✗ Failed" };
    badge.textContent = badgeLabels[item.status] || item.status;
  },

  // ── Build sample log entries ─────────────────────────────
  _buildPreviewLog: function(domConstruct, logEl) {
    PREVIEW_LOG.forEach(function(entry) {
      var row = domConstruct.create("div", {
        className: "fnimport-preview-log-entry fnimport-preview-log-" + entry.type
      }, logEl);
      row.textContent = entry.msg;
    });
  },

  getLabelDomElement: function() {
    return this.context.coachViewData.label;
  },

  propertyChanged: function(propertyName, propertyValue) {
    var configHelperUri = this.context.getManagedAssetUrl(
      "BPMExt-Core-ConfigHelper.js",
      this.context.assetType_WEB,
      "SYSBPMUI"
    );

    require(
      ["dojo/dom-style", "dojo/dom-class", "dojo/dom-construct", configHelperUri],
      this.lang.hitch(this, function(domStyle, domClass, domConstruct, configHelper) {

        if (this.context.coachViewData.labelHandler) {
          this.context.coachViewData.labelHandler.propertyChanged(propertyName, propertyValue);
        }

        if (propertyName === "@style") {
          var width    = configHelper.getResponsiveConfigOptionValue(this, "width");
          var minWidth = configHelper.getResponsiveConfigOptionValue(this, "@minWidth");
          var finalWidth = width || minWidth || this.context.coachViewData.defaultWidth;
          if (finalWidth) {
            this.context.coachViewData.containingDiv.style.width =
              isNaN(finalWidth) ? finalWidth : (finalWidth + "px");
          } else {
            this.context.coachViewData.containingDiv.style.width = "";
          }
        }

        // Show/hide config hint based on whether endpoint is set
        if (propertyName === "graphqlEndpoint" || propertyName === "parentFolderId") {
          var hint = this.context.coachViewData.containingDiv.querySelector("#fnimport-preview-hint");
          if (hint) {
            var endpointSet = this.context.coachViewData.containingDiv
              .querySelector("[data-option='graphqlEndpoint']");
            hint.style.display = (propertyValue && propertyValue.length > 0) ? "none" : "block";
          }
        }
      })
    );
  },

  modelChanged: function(propertyName, propertyValue) {
    if (this.context.coachViewData.labelHandler) {
      this.context.coachViewData.labelHandler.modelChanged(propertyName, propertyValue);
    }
  }
};

// Made with Bob