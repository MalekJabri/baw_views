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

                // Generate preview content
                this.generateSampleData(domConstruct, domAttr, domClass);

                callback();
            }));
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    generateSampleData: function (domConstruct, domAttr, domClass) {
        // Create main container
        var mainBox = domConstruct.create("div", null, this.context.coachViewData.inputDiv);
        domClass.add(mainBox, "multidocupload_maincontentbox");

        // Create upload preview container
        var previewContainer = domConstruct.create("div", null, mainBox);
        domClass.add(previewContainer, "DesignContentBox");
        domClass.add(previewContainer, "upload-preview-container");

        // Create upload area
        var uploadArea = domConstruct.create("div", null, previewContainer);
        domClass.add(uploadArea, "DesignContentBox");
        domClass.add(uploadArea, "upload-area");

        // Upload icon (SVG)
        var uploadIcon = domConstruct.create("svg", {
            viewBox: "0 0 16 16",
            fill: "currentColor"
        }, uploadArea);
        domClass.add(uploadIcon, "upload-icon");
        
        var iconPath = domConstruct.create("path", {
            d: "M7.5 11V3.7L5.7 5.5 5 4.8 8 1.8l3 3-.7.7-1.8-1.8V11h-1z"
        }, uploadIcon);
        
        var iconPath2 = domConstruct.create("path", {
            d: "M13 14H3V7h1v6h8V7h1v7z"
        }, uploadIcon);

        // Upload text
        var uploadText = domConstruct.create("span", null, uploadArea);
        domClass.add(uploadText, "upload-text");
        uploadText.textContent = "Izaberite dokumente";

        // Upload hint
        var uploadHint = domConstruct.create("span", null, uploadArea);
        domClass.add(uploadHint, "upload-hint");
        uploadHint.textContent = "ili prevucite ovde";

        // Create documents preview section
        var documentsPreview = domConstruct.create("div", null, previewContainer);
        domClass.add(documentsPreview, "DesignContentBox");
        domClass.add(documentsPreview, "documents-preview");

        // Preview header
        var previewHeader = domConstruct.create("div", null, documentsPreview);
        domClass.add(previewHeader, "DesignContentBox");
        domClass.add(previewHeader, "preview-header");

        var previewTitle = domConstruct.create("span", null, previewHeader);
        domClass.add(previewTitle, "preview-title");
        previewTitle.textContent = "Uploadovani dokumenti";

        var previewCount = domConstruct.create("span", null, previewHeader);
        domClass.add(previewCount, "preview-count");
        previewCount.textContent = "2 dokumenata";

        // Sample documents
        var sampleDocs = [
            { name: "faktura_2024.pdf", size: "240 KB", type: "Faktura", ext: "PDF" },
            { name: "ugovor.docx", size: "500 KB", type: "Ugovor", ext: "DOCX" }
        ];

        sampleDocs.forEach(function(doc) {
            var docItem = domConstruct.create("div", null, documentsPreview);
            domClass.add(docItem, "DesignContentBox");
            domClass.add(docItem, "document-item");

            // Document icon
            var docIcon = domConstruct.create("div", null, docItem);
            domClass.add(docIcon, "doc-icon");
            
            var docIconSvg = domConstruct.create("svg", {
                viewBox: "0 0 16 16",
                fill: "currentColor"
            }, docIcon);
            
            var docIconPath = domConstruct.create("path", {
                d: "M9 1H3.5c-.3 0-.5.2-.5.5v13c0 .3.2.5.5.5h9c.3 0 .5-.2.5-.5V5L9 1zm0 1.4L11.6 5H9V2.4zM12 14H4V2h4v3.5c0 .3.2.5.5.5H12v8z"
            }, docIconSvg);

            // Document info
            var docInfo = domConstruct.create("div", null, docItem);
            domClass.add(docInfo, "doc-info");

            var docName = domConstruct.create("div", null, docInfo);
            domClass.add(docName, "doc-name");
            docName.textContent = doc.name;

            var docMeta = domConstruct.create("div", null, docInfo);
            domClass.add(docMeta, "doc-meta");
            docMeta.textContent = doc.ext + " • " + doc.size;

            // Document type badge
            var docTypeBadge = domConstruct.create("span", null, docItem);
            domClass.add(docTypeBadge, "doc-type-badge");
            docTypeBadge.textContent = doc.type;
        });

        // Upload button
        var uploadButton = domConstruct.create("button", {
            type: "button"
        }, previewContainer);
        domClass.add(uploadButton, "DesignContentBox");
        domClass.add(uploadButton, "upload-button");

        var btnIconSvg = domConstruct.create("svg", {
            viewBox: "0 0 16 16",
            fill: "currentColor",
            width: "20",
            height: "20"
        }, uploadButton);
        
        var btnIconPath = domConstruct.create("path", {
            d: "M9 7h4l-5 5-5-5h4V1h2v6z"
        }, btnIconSvg);
        
        var btnIconPath2 = domConstruct.create("path", {
            d: "M2 14h12v1H2z"
        }, btnIconSvg);

        var btnText = domConstruct.create("span", null, uploadButton);
        btnText.textContent = "Upload u LocalStore";

        // Store references for updates
        this.context.coachViewData.previewCount = previewCount;
        this.context.coachViewData.documentsPreview = documentsPreview;
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle config option changes in preview
        if (this.context.coachViewData.inputDiv) {
            if (propertyName === "maxFiles") {
                // Update preview to show max files limit
                console.log("Max files changed to:", propertyValue);
            } else if (propertyName === "maxFileSize") {
                // Update preview to show max file size
                console.log("Max file size changed to:", propertyValue, "MB");
            }
        }
    },

    modelChanged: function (propertyName, propertyValue) {
        // Not required for preview
    }
};

// Made with Bob