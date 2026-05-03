/*
 * #BEGIN COPYRIGHT
 *
 * Licensed Materials - Property of IBM
 * 5725-C95
 * (C) Copyright IBM Corporation 2019-2026
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

                // Generate preview markdown viewer
                this.generateSampleData(domConstruct, domClass, domAttr);

                callback();
            }));
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    generateSampleData: function (domConstruct, domClass, domAttr) {
        // Create markdown viewer container
        var container = domConstruct.create("div", null, this.context.coachViewData.inputDiv);
        domClass.add(container, "markdown-viewer-container");
        domClass.add(container, "markdown-theme-default");
        domAttr.set(container, "role", "article");
        domAttr.set(container, "aria-label", "Markdown content viewer");
        this.context.coachViewData.container = container;

        // Create markdown content area
        var content = domConstruct.create("div", null, container);
        domClass.add(content, "markdown-content");
        domAttr.set(content, "id", "markdown-output");

        // Sample markdown content (rendered as HTML for preview)
        var sampleHTML = '<h1>Markdown Viewer Preview</h1>' +
            '<p>This is a preview of the <strong>Markdown Viewer</strong> widget.</p>' +
            '<h2>Features</h2>' +
            '<ul>' +
            '<li>Renders markdown-formatted text</li>' +
            '<li>Supports headers, lists, and formatting</li>' +
            '<li>Code blocks with syntax highlighting</li>' +
            '<li>Tables and blockquotes</li>' +
            '</ul>' +
            '<h3>Code Example</h3>' +
            '<pre><code>function hello() {\n  console.log("Hello, World!");\n}</code></pre>' +
            '<blockquote>' +
            '<p>This is a sample blockquote to demonstrate markdown rendering capabilities.</p>' +
            '</blockquote>' +
            '<h3>Table Example</h3>' +
            '<table>' +
            '<thead><tr><th>Feature</th><th>Status</th></tr></thead>' +
            '<tbody>' +
            '<tr><td>Headers</td><td>✓ Supported</td></tr>' +
            '<tr><td>Lists</td><td>✓ Supported</td></tr>' +
            '<tr><td>Code</td><td>✓ Supported</td></tr>' +
            '</tbody>' +
            '</table>';

        content.innerHTML = sampleHTML;
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle config option changes in preview
        if (this.context.coachViewData.container) {
            if (propertyName === "theme") {
                var container = this.context.coachViewData.container;
                
                // Remove existing theme classes
                domClass.remove(container, "markdown-theme-default");
                domClass.remove(container, "markdown-theme-light");
                domClass.remove(container, "markdown-theme-dark");
                
                // Add new theme class
                var themeValue = propertyValue || "default";
                
                require(["dojo/dom-class"], this.lang.hitch(this, function(domClass) {
                    domClass.add(container, "markdown-theme-" + themeValue);
                }));
            } else if (propertyName === "showLineNumbers") {
                // Toggle line numbers display
                var content = this.context.coachViewData.inputDiv.querySelector(".markdown-content");
                if (content) {
                    if (propertyValue) {
                        require(["dojo/dom-class"], this.lang.hitch(this, function(domClass) {
                            domClass.add(content, "show-line-numbers");
                        }));
                    } else {
                        require(["dojo/dom-class"], this.lang.hitch(this, function(domClass) {
                            domClass.remove(content, "show-line-numbers");
                        }));
                    }
                }
            }
        }
    },

    modelChanged: function (propertyName, propertyValue) {
        // Not required for preview
    }
};

// Made with Bob
