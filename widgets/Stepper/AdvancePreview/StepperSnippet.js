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
        var bpmextUri = this.context.getManagedAssetUrl(
            "BPMExt-Core-Designer.js",
            this.context.assetType_WEB,
            "SYSBPMUI"
        );

        require([
            "dojo/dom-construct",
            "dojo/dom-class",
            "dojo/dom-attr",
            bpmextUri
        ], this.lang.hitch(this, function (domConstruct, domClass, domAttr, bpmext) {

            bpmext.uidesign.css.ensureSparkUIClass(containingDiv);
            bpmext.uidesign.css.ensureGlyphsLoaded(this);

            this.context.coachViewData.containingDiv = containingDiv;

            // Generate unique temp ID
            var tempID;
            while (true) {
                tempID = dojox.uuid.generateRandomUuid();
                if (containingDiv.querySelector("div[data-temp-id='" + tempID + "']") == null) {
                    break;
                }
            }

            containingDiv.setAttribute("data-temp-id", encodeURIComponent(tempID));
            domClass.add(containingDiv, "WYSIWYGContentList");

            // Get the label element from the predefined HTML
            this.context.coachViewData.label = containingDiv.querySelector(".stepper-title");
            if (this.context.coachViewData.label) {
                this.context.coachViewData.labelTextDom = document.createTextNode(labelText);
                this.context.coachViewData.label.appendChild(this.context.coachViewData.labelTextDom);
                this.context.coachViewData.label.style.display = "none";
            }

            // Default width
            this.context.coachViewData.defaultWidth = "100%";

            // Create label handler
            this.context.coachViewData.labelHandler = bpmext.uidesign.createLabelHandler(
                this.context.coachViewData.labelTextDom,
                undefined,
                containingDiv,
                false,
                true
            );

            callback();
        }));
    },

    getLabelDomElement: function () {
        return this.context.coachViewData.label;
    },

    propertyChanged: function (propertyName, propertyValue) {
        var configHelperUri = this.context.getManagedAssetUrl(
            "BPMExt-Core-ConfigHelper.js",
            this.context.assetType_WEB,
            "SYSBPMUI"
        );

        require([
            "dojo/dom-style",
            "dojo/dom-class",
            "dojo/dom-construct",
            configHelperUri
        ], this.lang.hitch(this, function (domStyle, domClass, domConstruct, configHelper) {

            if (this.context.coachViewData.labelHandler) {
                this.context.coachViewData.labelHandler.propertyChanged(propertyName, propertyValue);
            }

            if (propertyName == "@style") {
                var width = configHelper.getResponsiveConfigOptionValue(this, "width");
                var minWidth = configHelper.getResponsiveConfigOptionValue(this, "@minWidth");
                var finalWidth = width || minWidth || this.context.coachViewData.defaultWidth;
                if (finalWidth) {
                    this.context.coachViewData.containingDiv.style.width =
                        isNaN(finalWidth) ? finalWidth : (finalWidth + "px");
                } else {
                    this.context.coachViewData.containingDiv.style.width = "";
                }
            }
        }));
    },

    modelChanged: function (propertyName, propertyValue) {
        if (this.context.coachViewData.labelHandler) {
            this.context.coachViewData.labelHandler.modelChanged(propertyName, propertyValue);
        }
    }
};

// Made with Bob
