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
        var inputDiv = this.context.coachViewData.inputDiv;

        // Create timeline container
        var timelineContainer = domConstruct.create("div", null, inputDiv);
        domClass.add(timelineContainer, "timeline_maincontentbox");

        var containerInner = domConstruct.create("div", null, timelineContainer);
        domClass.add(containerInner, "timeline-container");

        // Create timeline line
        var timelineLine = domConstruct.create("div", null, containerInner);
        domClass.add(timelineLine, "timeline-line");

        // Create timeline events container
        var timelineEvents = domConstruct.create("div", null, containerInner);
        domClass.add(timelineEvents, "timeline-events");

        // Sample timeline data
        var sampleEvents = [
            {
                title: "Project Initiated",
                description: "Project kickoff and initial planning completed",
                date: "Jan 15, 2026",
                status: "completed"
            },
            {
                title: "Requirements Gathering",
                description: "Stakeholder interviews and requirements documentation",
                date: "Feb 1, 2026",
                status: "completed"
            },
            {
                title: "Development Phase",
                description: "Active development and implementation in progress",
                date: "Mar 1, 2026",
                status: "current"
            },
            {
                title: "Testing & QA",
                description: "Quality assurance and user acceptance testing",
                date: "May 1, 2026",
                status: "pending"
            }
        ];

        // Create timeline events
        sampleEvents.forEach(function(event) {
            // Event container
            var eventDiv = domConstruct.create("div", null, timelineEvents);
            domClass.add(eventDiv, "timeline-event");
            domClass.add(eventDiv, event.status);

            // Event marker
            var marker = domConstruct.create("div", null, eventDiv);
            domClass.add(marker, "event-marker");

            // Add icon based on status
            if (event.status === "completed") {
                var icon = domConstruct.create("div", null, marker);
                domClass.add(icon, "timeline_icon_completed");
            } else if (event.status === "current") {
                var icon = domConstruct.create("div", null, marker);
                domClass.add(icon, "timeline_icon_current");
            } else {
                var icon = domConstruct.create("div", null, marker);
                domClass.add(icon, "timeline_icon_pending");
            }

            // Event content
            var content = domConstruct.create("div", null, eventDiv);
            domClass.add(content, "event-content");

            // Event date
            var dateDiv = domConstruct.create("div", null, content);
            domClass.add(dateDiv, "event-date");
            dateDiv.appendChild(document.createTextNode(event.date));

            // Event title
            var titleDiv = domConstruct.create("div", null, content);
            domClass.add(titleDiv, "event-title");
            titleDiv.appendChild(document.createTextNode(event.title));

            // Event description
            var descDiv = domConstruct.create("div", null, content);
            domClass.add(descDiv, "event-description");
            descDiv.appendChild(document.createTextNode(event.description));
        });

        // Store references
        this.context.coachViewData.timelineContainer = timelineContainer;
        this.context.coachViewData.timelineEvents = timelineEvents;
    },

    propertyChanged: function (propertyName, propertyValue) {
        // Handle config option changes
        if (propertyName === "showDates" || propertyName === "showIcons" || 
            propertyName === "alternateLayout" || propertyName === "compact") {
            // Regenerate preview with new options
            if (this.context.coachViewData.inputDiv) {
                require([
                    "dojo/dom-construct",
                    "dojo/dom-class",
                    "dojo/dom-attr"
                ], this.lang.hitch(this, function (domConstruct, domClass, domAttr) {
                    // Clear and regenerate
                    this.context.coachViewData.inputDiv.innerHTML = "";
                    this.generateSampleData(domConstruct, domAttr, domClass);
                }));
            }
        }
    },

    modelChanged: function (propertyName, propertyValue) {
        // Usually not needed for preview
    }
};

// Made with Bob