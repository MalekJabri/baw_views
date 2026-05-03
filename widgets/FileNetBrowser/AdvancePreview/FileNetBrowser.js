/*
 * #BEGIN COPYRIGHT
 *
 * Licensed Materials - Property of IBM
 * 5725-C95
 * (C) Copyright IBM Corporation 2026
 *
 * #END COPYRIGHT
 */

var mixObject = {

    createPreview: function (containingDiv, labelText, callback) {
        var previewLayerUri = this.context.getManagedAssetUrl(
            "BPMExt-Controls.preview.js",
            this.context.assetType_WEB,
            "SYSBPMUI"
        );

        require([previewLayerUri], this.lang.hitch(this, function () {
            require([
                "dojo/dom-construct",
                "dojo/dom-class",
                "dojo/dom-attr",
                "bpmui/preview/BPMExt-Core-Designer"
            ], this.lang.hitch(this, function (domConstruct, domClass, domAttr, bpmext) {

                bpmext.uidesign.css.ensureGlyphsLoaded(this);
                bpmext.uidesign.css.ensureSparkUIClass(containingDiv);

                this.context.coachViewData.containingDiv = containingDiv;

                // Form group
                var formGroupDiv = domConstruct.create("div", null, containingDiv);
                domClass.add(formGroupDiv, "form-group");
                this.context.coachViewData.formGroupDiv = formGroupDiv;

                // Label
                var label = domConstruct.create("span", null, formGroupDiv);
                domClass.add(label, "control-label");
                label.appendChild(document.createTextNode(labelText));
                this.context.coachViewData.label = label;

                // Input container
                var inputDiv = domConstruct.create("div", null, formGroupDiv);
                domClass.add(inputDiv, "input");
                this.context.coachViewData.inputDiv = inputDiv;

                // Generate preview FileNet browser
                this.generateSampleData(domConstruct, domClass, domAttr);

                callback();
            }));
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    generateSampleData: function (domConstruct, domClass, domAttr) {
        // Create main widget container
        var widgetDiv = domConstruct.create("div", null, this.context.coachViewData.inputDiv);
        domClass.add(widgetDiv, "fnbrowser-widget");
        domAttr.set(widgetDiv, "role", "region");
        domAttr.set(widgetDiv, "aria-label", "FileNet Folder Browser");

        // Create breadcrumb navigation
        var breadcrumbNav = domConstruct.create("nav", null, widgetDiv);
        domClass.add(breadcrumbNav, "fnbrowser-breadcrumb");
        domAttr.set(breadcrumbNav, "role", "navigation");
        domAttr.set(breadcrumbNav, "aria-label", "Folder path breadcrumb");

        var breadcrumbList = domConstruct.create("ol", null, breadcrumbNav);
        domClass.add(breadcrumbList, "fnbrowser-breadcrumb-list");
        domAttr.set(breadcrumbList, "role", "list");

        // Sample breadcrumb items
        var breadcrumbItems = ["Root", "Folder for Browsing", "Documents"];
        for (var i = 0; i < breadcrumbItems.length; i++) {
            var item = domConstruct.create("li", null, breadcrumbList);
            domClass.add(item, "fnbrowser-breadcrumb-item");
            if (i === breadcrumbItems.length - 1) {
                domClass.add(item, "active");
            }
            item.textContent = breadcrumbItems[i];
        }

        // Create main container
        var containerDiv = domConstruct.create("div", null, widgetDiv);
        domClass.add(containerDiv, "fnbrowser-container");

        // Create tree panel
        var treePanel = domConstruct.create("aside", null, containerDiv);
        domClass.add(treePanel, "fnbrowser-tree-panel");
        domAttr.set(treePanel, "role", "complementary");
        domAttr.set(treePanel, "aria-label", "Folder tree");

        var treeHeader = domConstruct.create("div", null, treePanel);
        domClass.add(treeHeader, "fnbrowser-tree-header");

        var treeTitle = domConstruct.create("h3", null, treeHeader);
        domClass.add(treeTitle, "fnbrowser-tree-title");
        treeTitle.textContent = "Folders";

        var treeContainer = domConstruct.create("div", null, treePanel);
        domClass.add(treeContainer, "fnbrowser-tree-container");
        domAttr.set(treeContainer, "role", "tree");
        domAttr.set(treeContainer, "aria-label", "Folder hierarchy");

        // Sample tree structure
        var treeSample = domConstruct.create("div", null, treeContainer);
        treeSample.innerHTML = '<div class="fnbrowser-tree-node">📁 Root</div>' +
            '<div class="fnbrowser-tree-node" style="margin-left: 20px;">📁 Folder for Browsing</div>' +
            '<div class="fnbrowser-tree-node active" style="margin-left: 40px;">📁 Documents</div>' +
            '<div class="fnbrowser-tree-node" style="margin-left: 40px;">📁 Images</div>';

        // Create content panel
        var contentPanel = domConstruct.create("main", null, containerDiv);
        domClass.add(contentPanel, "fnbrowser-content-panel");
        domAttr.set(contentPanel, "role", "main");
        domAttr.set(contentPanel, "aria-label", "Folder contents");

        // Toolbar
        var toolbar = domConstruct.create("div", null, contentPanel);
        domClass.add(toolbar, "fnbrowser-toolbar");

        var toolbarLeft = domConstruct.create("div", null, toolbar);
        domClass.add(toolbarLeft, "fnbrowser-toolbar-left");
        toolbarLeft.innerHTML = '<button class="fnbrowser-nav-btn" type="button" title="Back">◀</button>' +
            '<button class="fnbrowser-nav-btn" type="button" title="Forward">▶</button>' +
            '<button class="fnbrowser-nav-btn" type="button" title="Up">▲</button>';

        var toolbarRight = domConstruct.create("div", null, toolbar);
        domClass.add(toolbarRight, "fnbrowser-toolbar-right");
        toolbarRight.innerHTML = '<div class="fnbrowser-view-toggle">' +
            '<button class="fnbrowser-view-btn active" type="button" title="List view">☰</button>' +
            '<button class="fnbrowser-view-btn" type="button" title="Grid view">⊞</button>' +
            '</div>';

        // Current path
        var currentPath = domConstruct.create("div", null, contentPanel);
        domClass.add(currentPath, "fnbrowser-current-path");
        domAttr.set(currentPath, "role", "status");
        domAttr.set(currentPath, "aria-live", "polite");

        var pathIcon = domConstruct.create("span", null, currentPath);
        domClass.add(pathIcon, "fnbrowser-path-icon");
        domAttr.set(pathIcon, "aria-hidden", "true");
        pathIcon.textContent = "📁";

        var pathText = domConstruct.create("span", null, currentPath);
        domClass.add(pathText, "fnbrowser-path-text");
        pathText.textContent = "/Folder for Browsing/Documents";

        // Content list
        var contentList = domConstruct.create("div", null, contentPanel);
        domClass.add(contentList, "fnbrowser-content-list");
        domAttr.set(contentList, "role", "list");
        domAttr.set(contentList, "aria-label", "Folders and documents");

        // Sample content items
        var sampleItems = [
            { type: "folder", name: "Contracts", icon: "📁" },
            { type: "folder", name: "Specifications", icon: "📁" },
            { type: "document", name: "Technical Specification.pdf", size: "512 KB", version: "3.0", icon: "📄" },
            { type: "document", name: "User Manual.pdf", size: "1.0 MB", version: "1.2", icon: "📄" },
            { type: "document", name: "Requirements.xlsx", size: "200 KB", version: "2.0", icon: "📊" }
        ];

        for (var j = 0; j < sampleItems.length; j++) {
            var item = sampleItems[j];
            var itemDiv = domConstruct.create("div", null, contentList);
            domClass.add(itemDiv, "fnbrowser-content-item");
            domClass.add(itemDiv, "fnbrowser-" + item.type);
            domAttr.set(itemDiv, "role", "listitem");

            var itemIcon = domConstruct.create("span", null, itemDiv);
            domClass.add(itemIcon, "fnbrowser-item-icon");
            itemIcon.textContent = item.icon;

            var itemName = domConstruct.create("span", null, itemDiv);
            domClass.add(itemName, "fnbrowser-item-name");
            itemName.textContent = item.name;

            if (item.type === "document") {
                var itemMeta = domConstruct.create("span", null, itemDiv);
                domClass.add(itemMeta, "fnbrowser-item-meta");
                itemMeta.textContent = item.size + " • v" + item.version;
            }
        }

        // Pagination
        var pagination = domConstruct.create("div", null, contentPanel);
        domClass.add(pagination, "fnbrowser-pagination");
        domAttr.set(pagination, "role", "navigation");
        domAttr.set(pagination, "aria-label", "Pagination");

        var paginationInfo = domConstruct.create("div", null, pagination);
        domClass.add(paginationInfo, "fnbrowser-pagination-info");
        paginationInfo.innerHTML = '<span class="fnbrowser-pagination-text">Showing <strong>1</strong>-<strong>5</strong> of <strong>5</strong> items</span>';

        // Properties panel
        var propertiesPanel = domConstruct.create("aside", null, containerDiv);
        domClass.add(propertiesPanel, "fnbrowser-properties-panel");
        domAttr.set(propertiesPanel, "role", "complementary");
        domAttr.set(propertiesPanel, "aria-label", "Document properties");

        var propertiesHeader = domConstruct.create("div", null, propertiesPanel);
        domClass.add(propertiesHeader, "fnbrowser-properties-header");

        var propertiesTitle = domConstruct.create("h3", null, propertiesHeader);
        domClass.add(propertiesTitle, "fnbrowser-properties-title");
        propertiesTitle.textContent = "Document Properties";

        var propertiesContent = domConstruct.create("div", null, propertiesPanel);
        domClass.add(propertiesContent, "fnbrowser-properties-content");

        var propertiesEmpty = domConstruct.create("div", null, propertiesContent);
        domClass.add(propertiesEmpty, "fnbrowser-properties-empty");

        var emptyIcon = domConstruct.create("div", null, propertiesEmpty);
        domClass.add(emptyIcon, "fnbrowser-properties-empty-icon");
        domAttr.set(emptyIcon, "aria-hidden", "true");
        emptyIcon.textContent = "📄";

        var emptyText = domConstruct.create("p", null, propertiesEmpty);
        domClass.add(emptyText, "fnbrowser-properties-empty-text");
        emptyText.textContent = "Select a document to view its properties";

        // Selection bar
        var selectionBar = domConstruct.create("div", null, widgetDiv);
        domClass.add(selectionBar, "fnbrowser-selection-bar");
        domAttr.set(selectionBar, "role", "status");
        domAttr.set(selectionBar, "aria-live", "polite");

        var selectionText = domConstruct.create("span", null, selectionBar);
        domClass.add(selectionText, "fnbrowser-selection-text");
        selectionText.textContent = "No items selected";
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle config option changes in preview
        if (propertyName === "showBreadcrumb") {
            var breadcrumb = this.context.coachViewData.inputDiv.querySelector(".fnbrowser-breadcrumb");
            if (breadcrumb) {
                breadcrumb.style.display = propertyValue ? "block" : "none";
            }
        } else if (propertyName === "showDocumentDetails") {
            var metaElements = this.context.coachViewData.inputDiv.querySelectorAll(".fnbrowser-item-meta");
            for (var i = 0; i < metaElements.length; i++) {
                metaElements[i].style.display = propertyValue ? "inline" : "none";
            }
        }
    },

    modelChanged: function (propertyName, propertyValue) {
        // Not required for preview
    }
};

// Made with Bob