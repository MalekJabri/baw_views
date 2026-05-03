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

                // Generate preview progress bar
                this.generateSampleData(domConstruct, domAttr, domClass);

                callback();
            }));
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    generateSampleData: function (domConstruct, domAttr, domClass) {
        // Sample progress value (75%)
        var progressValue = 75;
        
        // Create main container
        var mainBox = domConstruct.create("div", null, this.context.coachViewData.inputDiv);
        domClass.add(mainBox, "progressbar_maincontentbox");

        // Create progress container
        var progressContainer = domConstruct.create("div", null, mainBox);
        domClass.add(progressContainer, "DesignContentBox");
        domClass.add(progressContainer, "progressbar-container");

        // Create progress track
        var track = domConstruct.create("div", null, progressContainer);
        domClass.add(track, "DesignContentBox");
        domClass.add(track, "progressbar-track");

        // Create progress fill
        var fill = domConstruct.create("div", null, track);
        domClass.add(fill, "progressbar-fill");
        domAttr.set(fill, "style", "width: " + progressValue + "%;");

        // Create percentage display
        var percentageDiv = domConstruct.create("div", null, progressContainer);
        domClass.add(percentageDiv, "DesignContentBox");
        domClass.add(percentageDiv, "progressbar-percentage");
        
        var percentageValue = domConstruct.create("span", null, percentageDiv);
        domClass.add(percentageValue, "percentage-value");
        percentageValue.textContent = progressValue + "%";

        // Create status message
        var statusDiv = domConstruct.create("div", null, progressContainer);
        domClass.add(statusDiv, "DesignContentBox");
        domClass.add(statusDiv, "progressbar-status");
        
        var statusMessage = domConstruct.create("span", null, statusDiv);
        domClass.add(statusMessage, "status-message");
        statusMessage.textContent = "In progress...";

        // Store references for updates
        this.context.coachViewData.fill = fill;
        this.context.coachViewData.percentageValue = percentageValue;
        this.context.coachViewData.statusMessage = statusMessage;
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle config option changes in preview
        if (this.context.coachViewData.inputDiv) {
            if (propertyName === "showPercentage") {
                var percentageDiv = this.context.coachViewData.inputDiv.querySelector(".progressbar-percentage");
                if (percentageDiv) {
                    percentageDiv.style.display = propertyValue ? "flex" : "none";
                }
            } else if (propertyName === "showStatus") {
                var statusDiv = this.context.coachViewData.inputDiv.querySelector(".progressbar-status");
                if (statusDiv) {
                    statusDiv.style.display = propertyValue ? "flex" : "none";
                }
            } else if (propertyName === "animated") {
                var fill = this.context.coachViewData.fill;
                if (fill) {
                    fill.style.transition = propertyValue ? "width 0.5s ease-in-out, background-color 0.3s ease" : "none";
                }
            }
        }
    },

    modelChanged: function (propertyName, propertyValue) {
        // Not required for preview
    }
};

// Made with Bob