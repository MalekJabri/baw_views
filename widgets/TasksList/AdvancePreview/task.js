/*
 * #BEGIN COPYRIGHT
 *
 * Licensed Materials - Property of IBM
 * 5725-C95
 * (C) Copyright IBM Corporation
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

                // Save references
                this.context.coachViewData.containingDiv = containingDiv;

                // Main form group
                var formGroupDiv = domConstruct.create("div", null, containingDiv);
                domClass.add(formGroupDiv, "form-group");
                this.context.coachViewData.formGroupDiv = formGroupDiv;

                // Label
                var labelNode = domConstruct.create("span", null, formGroupDiv);
                domClass.add(labelNode, "control-label");
                labelNode.appendChild(document.createTextNode(labelText));
                this.context.coachViewData.label = labelNode;

                // Input container
                var inputDiv = domConstruct.create("div", null, formGroupDiv);
                domClass.add(inputDiv, "input");
                domAttr.set(inputDiv, "role", "list");
                this.context.coachViewData.inputDiv = inputDiv;

                // Generate sample preview data
                this.generateSampleData(domConstruct, domClass);

                callback();
            }));
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    generateSampleData: function (domConstruct, domClass) {

        var tasks = [
            { label: "Validate request", status: "Complete" },
            { label: "Approve budget", status: "Pending" },
            { label: "Generate document", status: "Failed" }
        ];

        for (var i = 0; i < tasks.length; i++) {
            this._createTaskRow(domConstruct, domClass, tasks[i]);
        }
    },

    _createTaskRow: function (domConstruct, domClass, task) {

        var row = domConstruct.create("div", null, this.context.coachViewData.inputDiv);
        domClass.add(row, "task-item");
        domClass.add(row, task.status.toLowerCase());

        // Icon
        var icon = domConstruct.create("span", null, row);
        domClass.add(icon, "task-icon");
        icon.innerHTML = this._getStatusIcon(task.status);

        // Label
        var label = domConstruct.create("span", null, row);
        domClass.add(label, "task-label");
        label.innerHTML = task.label;

        // Status
        var status = domConstruct.create("span", null, row);
        domClass.add(status, "task-status");
        status.innerHTML = task.status;
    },

    _getStatusIcon: function (status) {

        if (status === "Complete") {
            return '<svg width="16" height="16" fill="#1ba348"><path d="M6 10l-3-3 1-1 2 2 5-5 1 1z"/></svg>';
        }

        if (status === "Pending") {
            return '<svg width="16" height="16" fill="#777"><circle cx="8" cy="8" r="7"/></svg>';
        }

        if (status === "Failed") {
            return '<svg width="16" height="16" fill="#d32f2f"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm1 8H7V4h2v5zM7 11h2v2H7z"/></svg>';
        }

        return '';
    },

    propertyChanged: function (propertyName, propertyValue) {
        // No dynamic properties for this simple preview
    },

    modelChanged: function (propertyName, propertyValue) {
        // Not needed for preview-only widget
    }
};
